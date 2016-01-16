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
var authMsg = uuid;

//-------------Socket listeners---------------

socket.on(authMsg, function(msg){
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
	authMsg = uuid + '_' + gameName +'_auth';
	socket.emit(authMsg, 'true');
		$('#inputBox').val('');
	return false;
});