var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/'));


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  var onevent = socket.onevent;
  socket.onevent = function (packet) {
      var args = packet.data || [];
      onevent.call (this, packet);    // original call
      packet.data = ["*"].concat(args);
      onevent.call(this, packet);      // additional call to catch-all
  };
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('User disconnected');
  });
  socket.on("*",function(event,data) {
      console.log("Event: "+event);
      console.log("Data: "+data);
  });
  // socket.on('chat message', function(msg){
  //   io.emit('chat message', msg);
  //   console.log('Got message: '+msg);
  // });
  // socket.on('turretPlacement', function(msg){
  //   io.emit('turretPlacement', msg);
  //   console.log('Got turretPlacement: '+msg);
  // });
  // socket.on('hit', function(msg){
  //   io.emit('hit', msg);
  //   console.log('Got hit!');
  // });
  // socket.on('creeperLocations', function(msg){
  //   io.emit('creeperLocations', msg);
  //   console.log('Got creeperLocations: '+msg);
  // });
});

http.listen(80, function(){
  console.log('listening on *:80');
});
