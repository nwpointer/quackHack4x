var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
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
});

http.listen(80, function(){
  console.log('listening on *:80');
});
