var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var five = require("johnny-five"),
    board, myMotor, led;

board = new five.Board();
server.listen(3000);

app.get('/', function (req, res) {
      res.sendfile(__dirname + '/index.html');
});


board.on("ready", function() {
  board.activated = true;
  myMotor = new five.Motor({
    pin: 9
  });
  // event handlers on start and stop
  myMotor.on("start", function( err, timestamp ) {
    console.log( "started", timestamp );
  }); 
  myMotor.on("stop", function( err, timestamp ) {
    console.log( "stopped", timestamp );
  });

  myMotor.start();
  // stop after 2 seconds
  board.wait(2000, function() {
    myMotor.stop();
  });

});

io.on('connection', function (socket) {
        socket.on('state', function (data) {
            //j5 Check
            if(board && !board.activated) return false;

            if(data.motor)
                return myMotor.start();

            return myMotor.stop();
            
        });
});
