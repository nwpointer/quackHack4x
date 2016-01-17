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
		oponent       = {},
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
		oponent = {color:black, creeps:[]} 

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

		// var tower = (util.tower(black));
		// tower.position.set(-1,0,1);
		// scene.add(tower);


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
		// setTimeout(creepFactory.bind(this, player),1000);

		setTimeout(creepFactory.bind(this, player),1000);
		// console.log("CREEP",player.creeps[0].position)
		opponentPlaceTurret(0);
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
		console.log("weight", object.userData.terrainCost);
		if(window.mode == PLACE_TURRET){
			// console.log("place turret");
			console.log(object.userData);
			object.userData.terrainCost = 400;
			
			var tower = (util.tower(player.color));
			tower.position.set(object.position.x, object.position.y+.01, object.position.z);
			scene.add(tower);
			window.mode = CREEP;
			fireTurret(object.position.x, object.position.y,0);
			// send message
		}
	}

	function opponentPlaceTurret(numTrts) {
		numTrts++;
		var [x,y] = [getRandomArbitrary(0,5), getRandomArbitrary(0,5)];
		if ((x === 4 && y === 1) || (x === 1 && y === 4)) {
			opponentPlaceTurret();
		}
		var tower = (util.tower(oponent.color));
		tower.position.set(Math.round(Number(x-2)), .01,  Math.round(Number(y-2)));
		scene.add(tower);
		opponentFireTurret(x-2,y-2,0);
		tileMap[Math.round(Number(x))][Math.round(Number(y))].userData.terrainCost = 400;

		console.log(x,y);
		if(numTrts < 13){
			setTimeout(function() {
				opponentPlaceTurret(numTrts);
			}, 600);
		}
	}

	function opponentFireTurret(trtX, trtY, reloadTime) {
		if (reloadTime > 0) {
			setTimeout(function() {
				opponentFireTurret(trtX, trtY, reloadTime-1);
			}, 100);
		} else {
			for (var k = 0; k < player.creeps.length; k++) {
				//if (scannedList.contains([Math.round(Number(player.creeps[k].position.x)), Math.round(Number(player.creeps[k].position.y))] )) {
				if (Math.abs(player.creeps[k].position.x - trtX) < 1 && Math.abs(player.creeps[k].position.y - trtY) < 1) {
					var sound = new howl.Howl({
				    	urls: ['media/turret-shot.ogg']
				    }).play();
                    player.creeps[k].userData.alive = false;
					scene.remove(player.creeps[k]);
					if(k != -1) {
						player.creeps.splice(k, 1);
					}
					reloadTime = 30;
					break;
				}
			}
			setTimeout(function() {
				opponentFireTurret(trtX, trtY, reloadTime);
			}, 100);
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
		//console.log("Fired Turret");
		if (reloadTime > 0) {
			setTimeout(function() {
				fireTurret(trtX, trtY, reloadTime-1);
			}, 100);
		} else {
			for (var k = 0; k < oponent.creeps.length; k++) {
				//if (scannedList.contains([Math.round(Number(player.creeps[k].position.x)), Math.round(Number(player.creeps[k].position.y))] )) {
				if (Math.abs(oponent.creeps[k].position.x - trtX) < 1 && Math.abs(oponent.creeps[k].position.y - trtY) < 1) {
					var sound = new howl.Howl({
				    	urls: ['media/turret-shot.ogg']
				    }).play();
                    oponent.creeps[k].userData.alive = false;
					scene.remove(oponent.creeps[k]);
					if(k != -1) {
						oponent.creeps.splice(k, 1);
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

	function creepFactory(user){
		// console.log("asdfasdf", window.creepsToLauch);
		if (window.creepsToLauch > 0) {
			

			var creep = util.creeps(user.color);
            creep.userData.alive = true;
			// colliderSystem.add(collider)
			// var rp = getRandomVector(0,1);
			// creep.position.set(rp.x, rp.y, rp.z+1)
			
			
			
			
			// console.log(path);

			if(user == oponent){
				// console.log("oponent");
				var poz =[4,1];
				creep.position.set(-1,0,2);
			}else{
				creep.position.set(2,0,-1);
				var poz =[1,4];
			}
			user.creeps.push(creep);
			var p = creep.position;
			scene.add(creep);

			var go = util.combinePath(
				creep, 
				function(){
					return aStar([6-(p.z+3),6-(p.x+3)],[poz[0],poz[1]], terrainCostMap)
				},
				function(){
                    if(creep.userData.alive) {
                        console.log("reached holy land");
                        window.health -=1;
                        //console.log(window.health);
                        healthbar();
                        var sound = new howl.Howl({
                            urls: ['media/death-sound.ogg']
                        }).play();
                    }
				}
			);

			go.start();
			window.creepsToLauch--;
		}
		setTimeout(creepFactory.bind(null,user) ,100);
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