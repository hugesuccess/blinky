var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var five = require("johnny-five"),
    board, myPhotoresistor, myLed, sock = false;

board = new five.Board();
server.listen(3000);

app.get('/', function(req, res) {
    res.sendfile(__dirname + "/index.html");
});

board.on("ready", function() {
  myLed = new five.Led(9);
  myPhotoresistor = new five.Sensor({
    pin: "A0",
    freq: 250
  });
  myPhotoresistor.on("read", function( err, value ) {
    var threshold = 300;
    if (value > threshold) {
        myLed.on();
        if(sock) sock.emit('state', {on: 1});
    } else {
        myLed.off();
        if(sock) sock.emit('state', {on: 0});
    }
  });
});

io.on('connection', function(socket) {
    sock = socket;
});
