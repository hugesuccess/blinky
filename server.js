var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var five = require("johnny-five"),
board, myServo;

board = new five.Board();
server.listen(3000);

app.get('/', function (req, res) {
      res.sendfile(__dirname + '/index.html');
});

board.on("ready", function() {
  board.activated = true;
  myServo = new five.Servo(9);

  myServo.sweep();

  this.wait(5000, function(){
    myServo.stop();
    myServo.center();
  });  
});

io.on('connection', function (socket) {
    socket.on('state', function (data) {
        //j5 Check
        if(board && !board.activated) return false;

        if(data.servo)
            return myServo.sweep();
    
        return myServo.stop();
    });
});


