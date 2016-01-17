var socket = io();

$("#header").text(window.location.search.replace("?", ""));


//-------------Socket listeners---------------

socket.on('chat message', function(msg){
	$('#messages').append($('<li>').text(msg));
});

socket.on('turretPlacement', function(msg){
	console.log("We got a turretPlacement " + JSON.parse(msg));
	msg = '<b>Turret placement:</b> ' + msg;
	$('#messages').append($('<li>').html(msg));
});

socket.on('hit', function(msg){
	console.log("We got a hit ");
	$('#messages').append($('<li>').html('<b>Someone was hit:</b>'));
});

socket.on('creeperLocations', function(msg){
	$('#messages').append($('<li>').text(msg));
});



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

    console.log("Sending turret coords at " + turretPlacementString);
    socket.emit('turretPlacement', turretPlacementString);
}

$("#canvas").on("click", validateTurretPlacement);


//------------Hit Code---------------------------------

function sendHit() {
    console.log("I hit you!");
    socket.emit('hit', "true");
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
	return;
}

function sendCreeperArray() {
    
    var numOfCreepers = 5;


    console.log("The creepers are moving!");


    //socket.emit('creeperLocations', "true");
}

//$("#hit").on("click", sendCreeperArray);



//----------Send message Code----------------------------

$('#sendMsg').on("click", function(){
	socket.emit('chat message', $('#inputBox').val());
	$('#inputBox').val('');
	return false;
});