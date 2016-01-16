var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
  res.sendFile(__dirname + '/scripts/socketCommunication.js');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('User disconnected');
  });
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
    console.log('Got message: '+msg);
  });
  socket.on('turretPlacement', function(msg){
    io.emit('turretPlacement', msg);
    console.log('Got turretPlacement: '+msg);
  });
  socket.on('hit', function(msg){
    io.emit('hit', msg);
    console.log('Got hit!');
  });
  socket.on('creeperLocations', function(msg){
    io.emit('creeperLocations', msg);
    console.log('Got creeperLocations: '+msg);
  });
});

http.listen(80, function(){
  console.log('listening on *:80');
});
