/*
	- click and drag (to make path or move camera)
	- resources (via on hover, toggling childrens)
	- physiscs(for arrows? & collision detection)
	- better map controlls (kenetic)
	- react integration
	- better events? (hover)
	- reactive object state?
	- game state management plan / server commands?
	- abstract into modules
*/

var WindowResize = require('./vendor/threex.windowresize.js');
var example = (function(){
	"use strict";
	var THREE        = require('three'),
		scene        = new THREE.Scene(),
		renderer     = window.WebGLRenderingContext ? new THREE.WebGLRenderer() :THREE.CanvasRenderer(),
		afix         = require('./util.js').fullScreenAttachment,
		light        = new THREE.PointLight(0xffffff, 6, 40),
		ambient      = new THREE.AmbientLight(0x4000ff),
		D 		     = 1, 
		height       = window.innerHeight,
		width        = window.innerWidth,
		aspect       = width / height,
		camera       = new THREE.OrthographicCamera(-D * aspect, D * aspect, D, -D, 1, 1000),
		cube1	     = require('./util.js').cube1,
		cube2	     = require('./util.js').cube2,
		// clock        = new THREE.Clock(),
		raycaster    = new THREE.Raycaster(),
		mouse        = new THREE.Vector2(),
		ring         = require('./util.js').ring,
		winResize    = new WindowResize(renderer, camera)
	;	

	function init () {
		afix(renderer, 'scene');
		renderer.setClearColor( 0xf0f0f0 );
		
		light.position.set(10, 20, 15);
		camera.position.set(20, 20, 20);
		cube1.position.set(0,0,0);
		cube2.position.set(1,0,0);
		camera.lookAt(new THREE.Vector3(0,0,0)); 

		scene.add(ring);
		scene.add(cube1);
		scene.add(cube2);
		scene.add(camera);
		scene.add(ambient);
		scene.add(light);
		
		render();
	}

	var left  = (n)=>{camera.position.y+=n*.005; camera.position.x+=n*.01;},
		right = (n)=>{camera.position.y-=n*.005; camera.position.x-=n*.01;},
		up    = (n)=>{camera.position.y-=n*.005;},
		down  = (n)=>{camera.position.y+=n*.005;};

	function render () {
		requestAnimationFrame(render);
		// camera.zoom += .01;
		// camera.updateProjectionMatrix();
		// var delta = clock.getDelta();
		renderer.render(scene,camera);
	}

	// EVENTS
	function onMouseMove(event) {
		mouse.x = (event.clientX / renderer.domElement.width) * 2 - 1;
		mouse.y = -(event.clientY / renderer.domElement.height) * 2 + 1;
	}

	function getIntersectedObject(){
		raycaster.setFromCamera(mouse, camera);
		var intersects = raycaster.intersectObjects(scene.children, true);
		if (intersects.length > 0) {
			return intersects[0].object;
		}
	}

	function onDocumentMouseDown(event) {
		var object = getIntersectedObject();
		if(object && object.onmousedown){
			object.onmousedown();
		}

		ring.material.opacity = 1;

	}

	function onDocumentMouseUP(event){
		ring.material.opacity = 0;
	}

	window.onload = init();
	window.onmousedown = onDocumentMouseDown;
	window.onmouseup = onDocumentMouseUP;
	window.onmousemove = onMouseMove;

	return{
		scene : scene
	}
})();