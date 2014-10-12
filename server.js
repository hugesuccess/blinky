var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var five = require("johnny-five"),
    onButton, offButton, led, sock = false;

server.listen(3000);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

five.Board().on("ready", function() {
    onButton = new five.Button({
        pin: 2
    });
    offButton = new five.Button({
        pin: 3
    });

  led = new five.Led(13);
  onButton.on("down", function(value){
       led.on();
       if(sock) sock.emit('state', { led: 1 });
  });

  offButton.on("down", function(){
      led.off();
      if(sock) sock.emit('state', { led: 0 });
  });
});


io.on('connection', function (socket) {
    sock = socket;
});
