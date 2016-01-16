var socket = io();


//-----------We need a GUID to only listen to OUR response

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

//-------------Socket listeners---------------

socket.on(authMsg, function(msg){
	console.log("Got an authMsg back with msg: "+msg);
	if(msg) {
		console.log("Approved.");
	}
	else {
		console.log("BANNED");
	}
});


//----------Send message Code----------------------------

$('#getAuth').on("click", function(){
	var gameName = $('#inputBox').val();
	socket.emit(uuid + '_' + gameName +'_auth', 'true');
	$('#inputBox').val('');
	return false;
});