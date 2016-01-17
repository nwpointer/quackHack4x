module.exports = (function(){
	return {
		init: function() {
			//---------------These are helpers/globals/etc---------------
			var socket = io();
			function makeAlias(object, name) {
			    var fn = object ? object[name] : null;
			    if (typeof fn == 'undefined') return function () {}
			    return function () {
			        return fn.apply(object, arguments)
			    }
			}
			var $ = makeAlias(document, 'getElementById');

			function guid() {
			  function s4() {
			    return Math.floor((1 + Math.random()) * 0x10000)
			      .toString(16)
			      .substring(1);
			  }
			  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
			    s4() + '-' + s4() + s4() + s4();
			}

			var uuid = guid();
			var authMsg = uuid+'_auth';

			//------------These are the socket items--------------
			var chatMessageItem = gameName + "_chatMessage";
			var turretPlacementItem = gameName + "_turretPlacement";
			var hitItem = gameName + "_hit";
			var creeperLocationsItem = gameName + "_creeperLocations";


			//--------------Socket Output--------------------
			function sendMessage(item, message) {
				console.log("Sending message: "+item);
				socket.emit(item, message);
				return;
			}

			//-------------Socket listeners---------------

			socket.on(authMsg, function(msg){
				console.log("Got an authMsg back with msg: "+msg);
				if(msg) {
					console.log("Approved");
				}
				else {
					console.log("Sorry, that game is full.");
				}
			});

			socket.on(gameName + '_chatMessage', function(msg){
				//var ul = $("messages");
			});

			socket.on(turretPlacementItem, function(msg){
				console.log("We got a turretPlacement " + JSON.parse(msg));
			});

			socket.on(hitItem, function(msg){
				console.log("We got a hit ");
			});

			socket.on(creeperLocationsItem, function(msg){
				console.log("Creepers: "+msg);
			});


			//----------Send message Code----------------------------

			// $('getAuth').onclick = function(){
			// 	var gameName = $('inputBox').value;
			// 	socket.emit(uuid + '_' + gameName +'_auth', 'true');
			// 	return;
			// };

			//------------Send Turret Placement Code------------------

			function validateTurretPlacement(e) {
				var valid = true;
				//TODO:
				//obviously this is a shit function if it's always valid
				if(valid){
					sendTurretPlacement(e)
				}
			}

			function sendTurretPlacement(e) {
				var turret = {
					X : e.clientX,
					Y : e.clientY
				}

				var turretPlacementString = JSON.stringify(turret);
			    sendMessage(turretPlacementItem, turretPlacementString);
			}

			//----------Send message Code----------------------------

			// $('sendMsg').onclick = function(){
			// 	console.log("We're sending a message")
			// 	sendMessage(chatMessageItem, $('inputBox').value);
			// 	$('inputBox').value = '';
			// 	return;
			// };
		}
	}
})()



