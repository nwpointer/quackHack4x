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
var THREEx = require('./vendor/bower_components/threex.colliders/threex.collider.js');
var howl = require('howler');

var example = (function(){
	"use strict";
	const PLACE_TURRET = "PLACE_TURRET";
	const CREEP        = "CREEP";
	var THREE        = require('three'),
		TWEEN 		 = require('tween.js'),
		scene        = new THREE.Scene(),
		renderer     = window.WebGLRenderingContext ? new THREE.WebGLRenderer() :THREE.CanvasRenderer(),
		afix         = require('./util.js').fullScreenAttachment,
		light        = new THREE.PointLight(0xffffff, 4, 40),
		ambient      = new THREE.AmbientLight(0x4000ff),
		D 		     = 3, 
		height       = window.innerHeight,
		width        = window.innerWidth,
		aspect       = width / height,
		camera       = new THREE.OrthographicCamera(-D * aspect, D * aspect, D, -D, 1, 1000),
		tile	     = require('./util.js').tile,
		// clock        = new THREE.Clock(),
		raycaster    = new THREE.Raycaster(),
		mouse        = new THREE.Vector2(),
		ring         = require('./util.js').ring,
		winResize    = new WindowResize(renderer, camera),
		util         = require('./util.js'),
		black        = 0x222222,
		white        = 0xffffff,
		mode 		 = CREEP,
		player       = {},
		aStar        = require('./astar.js'),
		colliderSystem	= new THREEx.ColliderSystem(),
		healthbar    = require('./ui.js').HealthBar,
		colliders	= [],
		terrainCostMap,
		tileMap
	;	

	window.mode = mode;
	window.creepsToLauch = 1;
	window.health = 100;

	window.BottomBar = require('./ui.js');

	function init () {
		afix(renderer, 'scene');
		renderer.setClearColor( 0xf0f0f0 );
		light.position.set(10, 20, 15);
		camera.position.set(20, 20, 20);
		camera.lookAt(new THREE.Vector3(0,0,0));

		player = {color:white, creeps:[]} 

		var terrainTypes = [tile(0x458B00), tile(0xffee22)];
		var terrainMap = [
			[0,1,1,0,0,0],
			[0,0,0,1,1,0],
			[0,0,0,1,1,0],
			[0,1,0,0,1,0],
			[0,0,0,0,1,0],
			[0,0,1,0,0,0],
		];


		tileMap = util.addTerrain(terrainMap, terrainTypes, scene);
		// tileMap[4][4].userData.terrainCost = 400;

		var tower = (util.tower(black));
		tower.position.set(-1,0,1);
		scene.add(tower);

		var whiteCity = util.city(0xffffff);

		whiteCity.position.z = -1;
		whiteCity.position.x = 2;

		var blackCity = util.city(0x222222);	
		blackCity.position.z = 2;
		blackCity.position.x = -1;

		scene.add(whiteCity);
		scene.add(blackCity);

		scene.add(camera);
		scene.add(ambient);
		scene.add(light);

		// creepFactory(terrainCostMap);
		setTimeout(creepFactory,1000);
		// console.log("CREEP",player.creeps[0].position)
		
		render();
	}

	var left  = (n,object)=>{object.position.y+=n*.005; object.position.x+=n*.01;},
		right = (n,object)=>{object.position.y-=n*.005; object.position.x-=n*.01;},
		up    = (n,object)=>{object.position.y-=n*.005;},
		down  = (n,object)=>{object.position.y+=n*.005;};

	function render () {
		requestAnimationFrame(render);
		TWEEN.update();
		colliderSystem.computeAndNotify(colliders);
		terrainCostMap = (tileMap.map(x=>{
			return x.map(y=>{
				// console.log(y.userData.terrainCost);
				return y.userData.terrainCost
			})
		}))
		// camera.zoom += .01;
		// camera.updateProjectionMatrix();
		// var delta = clock.getDelta();
		renderer.render(scene,camera);
	}

	// EVENTS
	function onMouseMove(event) {
		mouse.x = (event.clientX / renderer.domElement.width) * 2 - 1;
		mouse.y = -(event.clientY / renderer.domElement.height) * 2 + 1;
		// console.log(mouse.x);
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
		// console.log(object.position);
		if(window.mode == PLACE_TURRET){
			// console.log("place turret");
			console.log(object.userData, );
			object.userData.terrainCost = 400;
			// console.log("weight", object.userData.terrainCost);
			var tower = (util.tower(player.color));
			tower.position.set(object.position.x, object.position.y+.01, object.position.z);
			scene.add(tower);
			window.mode = CREEP;
			fireTurret(object.position.x, object.position.y,0);
			// send message
		}
	}

	function getRandomArbitrary(min, max) {
	  return Math.random() * (max - min) + min;
	}

	function getRandomVector(min,max){
		var vec = new THREE.Vector3(
			getRandomArbitrary(min, max),
			0,
			getRandomArbitrary(min, max)
		)
		// console.log(vec);
		return vec;
	}

	function fireTurret(trtX, trtY, reloadTime) {
		console.log("Fired Turret");
		if (reloadTime > 0) {
			setTimeout(function() {
				fireTurret(trtX, trtY, reloadTime-1);
			}, 100);
		} else {
			/*scannedList = [];
			for(i = -2; i < 3; i++) {
				for(j = -2; j < 3; j++) {
					//Scan around self
					//if (trtX + i < 0 || trtY + j < 0 || trtX + i > 5 || trtY + j > 5) {

					//} else if( i === 0 && k === 0) {

					//else {
						scannedList.push([Math.round(Number(trtX+i)), Math.round(Number(trtY+j))]);
					//}
				}
			}*/
			for (var k = 0; k < player.creeps.length; k++) {
				//if (scannedList.contains([Math.round(Number(player.creeps[k].position.x)), Math.round(Number(player.creeps[k].position.y))] )) {
				if (Math.abs(player.creeps[k].position.x - trtX) < 1 && Math.abs(player.creeps[k].position.y - trtY) < 1) {
					var sound = new howl.Howl({
				    	urls: ['media/turret-shot.ogg']
				    }).play();
					scene.remove(player.creeps[k]);
					if(k != -1) {
						player.creeps.splice(k, 1);
					}
					reloadTime = 30;
					break;
				}
			}
			setTimeout(function() {
				fireTurret(trtX, trtY, reloadTime);
			}, 100);
		}
	}

	function creepFactory(){
		// console.log("asdfasdf", window.creepsToLauch);
		if (window.creepsToLauch > 0) {
			
			var creep = util.creeps(player.color);

			// colliderSystem.add(collider)
			var rp = getRandomVector(0,1);
			creep.position.set(rp.x, rp.y, rp.z+1)
			creep.position.set(2,0,0);
			player.creeps.push(creep);
			scene.add(creep);
			var p = creep.position;
			// console.log(path);

			var go = util.combinePath(
				creep, 
				function(){
					return aStar([6-(p.z+3),6-(p.x+3)],[1,4], terrainCostMap)
				},
				function(){
					console.log("reached holy land");
					window.health -=1;
					console.log(window.health);
					healthbar();
                    var sound = new howl.Howl({
				    	urls: ['media/death-sound.ogg']
				    }).play();
				}
			);

			go.start();
			window.creepsToLauch--;
		}
		setTimeout(creepFactory,100);

		
	}



	// function onDocumentMouseUP(event){
	// 	ring.material.opacity = 0;
	// }

	window.onload = init();
	window.onmousedown = onDocumentMouseDown;
	// window.onmouseup = onDocumentMouseUP;
	window.onmousemove = onMouseMove;
	window.player = player;

	return{
		scene : scene,
	}
})();