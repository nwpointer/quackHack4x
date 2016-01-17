var socket = io();

var url = "postAuth.html";

function makeAlias(object, name) {
    var fn = object ? object[name] : null;
    if (typeof fn == 'undefined') return function () {}
    return function () {
        return fn.apply(object, arguments)
    }
}
var $ = makeAlias(document, 'getElementById');


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
		$("authResult").innerHTML = "Approved.";
		debugger;
		$("gameName").text = $('inputBox').value;
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				$("content").innerHTML = xhttp.responseText;
				eval($("scary").text);
			}
		};
		xhttp.open("GET", url, true);
		xhttp.send();
	}
	else {
		$("authResult").innerHTML = "Sorry, that game is full.";
	}
});


//----------Send message Code----------------------------

$('getAuth').onclick = function(){
	var gameName = $('inputBox').value;
	socket.emit(uuid + '_' + gameName +'_auth', 'true');
	return;
};