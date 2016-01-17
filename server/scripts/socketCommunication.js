function makeAlias(object, name) {
    var fn = object ? object[name] : null;
    if (typeof fn == 'undefined') return function () {}
    return function () {
        return fn.apply(object, arguments)
    }
}
var $ = makeAlias(document, 'getElementById');

var gameName = $("gameName").text;

var chatMessageItem = gameName + "_chatMessage";
var turretPlacementItem = gameName + "_turretPlacement";
var hitItem = gameName + "_hit";
var creeperLocationsItem = gameName + "_creeperLocations";



//-------------Socket listeners---------------

socket.on(gameName + '_chatMessage', function(msg){
	var ul = $("messages");
	var li = document.createElement("li");
	li.appendChild(document.innerHTML(msg));
	ul.appendChild(li);
});

socket.on(turretPlacementItem, function(msg){
	console.log("We got a turretPlacement " + JSON.parse(msg));
	msg = '<b>Turret placement:</b> ' + msg;
	var ul = $("messages");
	var li = document.createElement("li");
	li.appendChild(document.innerHTML(msg));
	ul.appendChild(li);
});

socket.on(hitItem, function(msg){
	console.log("We got a hit ");
	msg = '<b>Someone was hit:</b>';
	var ul = $("messages");
	var li = document.createElement("li");
	li.appendChild(document.innerHTML(msg));
	ul.appendChild(li);
});

socket.on(creeperLocationsItem, function(msg){
	console.log("Creepers: "+msg);
	//$('#messages').append($('<li>').text(msg));
});


//--------------Socket Output--------------------

function sendMessage(item, message) {
	console.log("Sending message: "+item);
	socket.emit(item, message);
	return;
}


//------------Turret Placement Code------------------

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

$("canvas").onclick = validateTurretPlacement;


//----------Send message Code----------------------------

$('sendMsg').onclick = function(){
	console.log("We're sending a message")
	sendMessage(chatMessageItem, $('inputBox').value);
	$('inputBox').value = '';
	return;
};