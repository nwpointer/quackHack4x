'use strict'
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


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

  var clientId = socket.client.conn.id;
    console.log("Client: "+clientId+" has connected.");

    socket.on('disconnect', function(){
      var clientId = this.client.conn.id;
      console.log("Client: "+clientId+" has disconnected.");
    });
    socket.on("*",function(event,data) {
        var clientId = this.client.conn.id;
        if(event.split("_").length > 2) {
          return;
        }
        console.log("Event: "+event);
        console.log("Data: "+data);
        io.emit(event, data);
    });

  });

http.listen(8000, function(){
  console.log('listening on *:8000');
});

