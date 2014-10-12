var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var five = require("johnny-five");
var sock = false;

server.listen(3000);

app.get('/', function(req, res) {
    res.sendfile(__dirname + "/index.html");
});


five.Board().on("ready", function(){
  var tempSensor = new five.Sensor("A0");
  tempSensor.on("read", function(err, value){
    var cel = (100 * (value / 1000) - 50).toFixed(2);
    if(isNaN(cel)) return false;
    console.log("temp is " + cel);
    if(sock) sock.emit('state', {temp: cel});
  });
});

io.on('connection', function(socket) {
    sock = socket;
});
