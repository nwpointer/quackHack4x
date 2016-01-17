var gameName = $("#gameName").text();

var chatMessageItem = gameName + "_chatMessage";
var turretPlacementItem = gameName + "_turretPlacement";
var hitItem = gameName + "_hit";
var creeperLocationsItem = gameName + "_creeperLocations";



//-------------Socket listeners---------------

socket.on(gameName + '_chatMessage', function(msg){
	$('#messages').append($('<li>').text(msg));
});

socket.on(turretPlacementItem, function(msg){
	console.log("We got a turretPlacement " + JSON.parse(msg));
	msg = '<b>Turret placement:</b> ' + msg;
	$('#messages').append($('<li>').html(msg));
});

socket.on(hitItem, function(msg){
	console.log("We got a hit ");
	$('#messages').append($('<li>').html('<b>Someone was hit:</b>'));
});

socket.on(creeperLocationsItem, function(msg){
	console.log("Creepers: "+msg);
	//$('#messages').append($('<li>').text(msg));
});


//--------------Socket Output--------------------

function sendMessage(item, message) {
	console.log("Sending message: "+item)
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

$("#canvas").on("click", validateTurretPlacement);


//------------Hit Code---------------------------------

function sendHit() {
    console.log("Sending message");
    sendMessage(hitItem, "true");
}

$("#hit").on("click", sendHit);


//------------Creeper Code---------------------------------

//TODO:
//Remove this dumb canvas shit once the real code is implemented
var c = document.getElementById("canvas");
var ctx = c.getContext("2d");
ctx.fillStyle = '#'+Math.floor(Math.random()*16777215).toString(16);
ctx.fillRect(20,20,5,5);

function creeperLocationGenerator() {
	return {
		X: Math.random()*300,
		Y: Math.random()*300
	};
}

function sendCreeperArray() {
    var numOfCreepers = 5;
    var creeperLocations = [];

    for(var i=0; i<numOfCreepers; i++)
    {
    	creeperLocations.push(creeperLocationGenerator());
    }

    console.log("The creepers are moving!");
    sendMessage(creeperLocationsItem, JSON.stringify(creeperLocations));
}
window.setInterval(sendCreeperArray, 5000);



//----------Send message Code----------------------------

$('#sendMsg').on("click", function(){
	sendMessage(chatMessageItem, $('#inputBox').val());
	$('#inputBox').val('');
	return false;
});