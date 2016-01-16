var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//authMap ties between game name and number of players in that game
var authMap = {};
//clientMap ties between client ids and game names
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
    console.log("Trying to disconnect, this is: ", this);
    //console.log("Client: "+this.client.conn.id+" has disconnected.");
    //delete clientMap.this.client.conn.id;
  });
  socket.on("*",function(event,data) {
      var clientId = this.client.conn.id;
      console.log("Client: "+clientId+" has sent an event.");
      if(event.split("_").length > 1) {
        console.log("Client: "+clientId+" is requesting auth.");
        console.log("Here's the split event: ", event.split("_"));
        var gameName = event.split("_")[1];
        clientMap.clientId = gameName;
        console.log("Now clientMap looks like this: ", clientMap);
        if(authMap.gameName && authMap.gameName < 2) {
          authMap.gameName++;
          io.emit(event, true);
          return;
        }
        else if(authMap.gameName && authMap.gameName >= 2) {
          io.emit(event, false);
          return;
        }
        else {
          authMap.gameName = 1;
          io.emit(event, true);
          return;
        }
      }
      console.log("Event: "+event);
      console.log("Data: "+data);
      io.emit(event, data);
  });

});

http.listen(80, function(){
  console.log('listening on *:80');
});
