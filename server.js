var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var five = require("johnny-five"),
    board, myPotentiometer, threshold = 512, sock = false, percentage = 0;
board = new five.Board();

server.listen(3000);

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html');
})

board.on("ready", function() {
  myPotentiometer = new five.Sensor({
    pin: "A0",
    freq: 250
  });
  myLed = new five.Led(9);
  myPotentiometer.on("read", function() {
    percentage = (this.raw/1023) * 100;
    if(sock) sock.emit('state', {led: percentage});
    if (this.raw > threshold) {
       myLed.on();
    } else {
       myLed.off();   
    }
  });
});

io.on('connection', function(socket) {
    sock = socket;
});
