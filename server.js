var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var five = require("johnny-five"),
    board, shiftRegister, value;

board = new five.Board();
server.listen(3000);

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html');
});

board.on("ready", function() {
  shiftRegister = new five.ShiftRegister({
    pins: {
      data: 2,
      clock: 3,
      latch: 4
    }
  });
  value = 0;

});

io.on('connection', function(socket) {
    socket.on('state', function(data) {
      next();
    });
});

function next() {
    value = value > 0x11 ? value >> 1 : 0x88;
    shiftRegister.send( value );
    setTimeout(next, 300);
}
