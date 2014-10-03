var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var j5 = require("johnny-five");
var board, blinky;

board = new j5.Board();
board.actived = false;


server.listen(3000);

app.get('/', function (req, res) {
      res.sendfile(__dirname + '/index.html');
});

/*
 *  Websocket Connection  
 *    client sends a an object w/ led param with a boolean value
 *    {led: BOOL}
 *    If true
 */

io.on('connection', function (socket) {
        socket.on('state', function (data) {
            //j5 Check
            if(board && !board.activated) return false;

            if(data.led)
                return blinky.on();
        
            return blinky.off();
        });
});

board.on("ready", function() {
  board.activated = true;
  blinky = new j5.Led(13);
});

