var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//authMap ties between game name and number of players in that game
var authMap = {};
//clientMap ties between client ids and game names
var clientMap = {};

function addAuthorize(clientId, event) {
  console.log("Client: "+clientId+" is requesting auth.");
  var guid = event.split("_")[0];
  var gameName = event.split("_")[1];
  event = guid + '_auth';
  clientMap[clientId] = gameName;
  console.log("Now clientMap looks like this: ", clientMap);
  console.log("Now authMap looks like this: ", authMap);
  if(authMap[gameName] && authMap[gameName] >= 2) {
    console.log("Preventing auth, sending event "+event);
    io.emit(event, false);
    return;
  }
  else {
    authMap[gameName] ? authMap[gameName] = 2 : authMap[gameName] = 1;
    console.log("Allowing auth, sending event "+event);
    console.log("Number of players: "+authMap[gameName]+", Game: "+gameName);
    io.emit(event, true);
    return;
  }
}
function removeAuthorize(clientId) {
  var gameName = clientMap[clientId];
  console.log("Client: "+clientId+" is removing auth for game "+gameName);
  if(authMap[gameName] && authMap[gameName] > 0) {
    authMap[gameName]--;
  }
  else if(authMap[gameName] && authMap[gameName] == 0){
    delete authMap[gameName];
  }
  return;
}

app.use(express.static(__dirname + '/'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  //this is mystery code which allows one handler for all (non-default) events
  var onevent = socket.onevent;
  socket.onevent = function (packet) {
      var args = packet.data || [];
      onevent.call (this, packet);    // original call
      packet.data = ["*"].concat(args);
      onevent.call(this, packet);      // additional call to catch-all
  };
  //end mystery code

  var clientId = socket.client.conn.id;
  console.log("Client: "+clientId+" has connected.");
  clientMap[clientId] = null;

  socket.on('disconnect', function(){
    var clientId = this.client.conn.id;
    console.log("Client: "+clientId+" has disconnected.");
    removeAuthorize(clientId);
    delete clientMap[clientId];
  });
  socket.on("*",function(event,data) {
      var clientId = this.client.conn.id;
      if(event.split("_").length > 2) {
        addAuthorize(clientId, event);
        return;
      }
      console.log("Event: "+event);
      console.log("Data: "+data);
      io.emit(event, data);
  });

});

http.listen(80, function(){
  console.log('listening on *:80');
});
