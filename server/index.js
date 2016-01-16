var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var enforcementObject = {};
var clientMap = {};

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

  var clientId = socket.client.conn.id;

  console.log("Client: "+clientId+" has connected.");

  clientMap.clientId = null;

  socket.on('disconnect', function(){
    //console.log("Client: "+this.client.conn.id+" has disconnected.");
    //delete clientMap.this.client.conn.id;
  });
  socket.on("*",function(event,data) {
      var clientId = this.client.conn.id;
      console.log("Client: "+clientId+" has sent an event.");
      if(event.split("_").length > 1) {
        console.log("Client: "+clientId+" is requesting auth.");
        console.log("Here's the split event: ", event.split("_"));
        clientMap.clientId = event.split("_")[1];
      }
      console.log("Event: "+event);
      console.log("Data: "+data);
      io.emit(event, data);
  });

});

http.listen(80, function(){
  console.log('listening on *:80');
});
