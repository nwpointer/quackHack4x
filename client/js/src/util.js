var THREE = require('three');
var TWEEN 		 = require('tween.js');
module.exports.stdCamera = new THREE.PerspectiveCamera(
	35, // fov deg
	window.innerWidth / window.innerHeight,
	1, //near
	1000 // far
);

module.exports.tile = function(color){
	var tile = new THREE.Mesh(
		new THREE.BoxGeometry(1, .1, 1),
		new THREE.MeshPhongMaterial({
			ambient: 0x555555,
			color: color,
			specular: 0xffffff,
			shininess: 50,
			shading: THREE.SmoothShading,
			name:"cube",
		})
	);
	tile.userData.terrainCost = 0;
	return tile;
}

module.exports.tower = function(color){
	var tower = new THREE.Mesh(new THREE.BoxGeometry(.1,1,.1));
	var walls = new THREE.Mesh(new THREE.BoxGeometry(.3,.1,.3));
	var combo = new THREE.Geometry();

	combo.merge(tower.geometry, tower.matrix);
	combo.merge(walls.geometry, walls.matrix);

	var city = new THREE.Mesh(
		combo,
		new THREE.MeshLambertMaterial({
			color:color
		})
	);

	return city;
}

module.exports.creeps = function(color){
	var a = new THREE.BoxGeometry(.075, .4, .075);
	// var b = new THREE.BoxGeometry(.1, .4, .1);
	// var c = new THREE.BoxGeometry(.1, .4, .1);
	return new THREE.Mesh(
			a,
			new THREE.MeshPhongMaterial({
				color: color,
				name:"creep"
			})
		);
}

module.exports.addTerrain = function(terrain, terrainTypes, scene){
	var tileMap = terrain.map((row,x)=>{
		return row.map((type,y)=>{
			var clone = terrainTypes[type].clone();
			clone.position.x = x -2
			clone.position.z = y -2
			scene.add(clone);
			return clone;
		})
	})
	return tileMap;
}

module.exports.city = function(color){
	var tower = new THREE.Mesh(new THREE.CylinderGeometry(.2, .2, 1.5, 30, 30));
	var walls = new THREE.Mesh(new THREE.BoxGeometry(.5,.5,.5));
	var combo = new THREE.Geometry();

	combo.merge(tower.geometry, tower.matrix);
	combo.merge(walls.geometry, walls.matrix);

	var city = new THREE.Mesh(
		combo,
		new THREE.MeshLambertMaterial({
			color:color
		})
	);

	return city;
}

var move = module.exports.move = function(object, direction, distance, then){
		var position;
		var target;
		position = {
			x:object.position.x,
			z:object.position.z
		};
		switch(direction){
			case 7:
				target = {
					x:object.position.x-distance,
					z:object.position.z-distance
				};
				break;
			case 2:
				target = {
					x:object.position.x+distance,
					z:object.position.z+distance
				};
				break;
			case 4:
				target = {
					x:object.position.x-distance,
					z:object.position.z+distance
				};
				break;
			case 5:
				target = {
					x:object.position.x+distance,
					z:object.position.z-distance
				};
				break;
			case 6:
				target = {
					x:object.position.x-distance,
				};
				break;
			case 3:
				target = {
					x:object.position.x+distance,
				};
				break;
			case 8:
				target = {
					z:object.position.z-distance
				};
				break;
			case 1:
				target = {
					z:object.position.z+distance
				};
				break;						
		}

		var tween = new TWEEN.Tween(position).to(target,1000);
		tween.onUpdate(function(){
			object.position.x =position.x;
			object.position.z =position.z;
		})
		// tween.delay(500);
		// tween.easing(TWEEN.Easing.Elastic.InOut);
		// tween.start();
		tween.onComplete(function(){
			if(then){
				then();
			}
		})
		return tween;
}

var combinePath = module.exports.combinePath = function(obj, arr){
	var dir = arr.pop();
	if(dir){
		return move(obj,dir, 1, function(){
			var n = combinePath(obj, arr);
			if(n){
				n.start();
			}
		})
		combinePath(arr);
	}
}


// module.exports.cube2.onmousedown = module.exports.cube1.onmousedown = function(){
// 	this.material.transparent = true;
// 	this.material.opacity = 0.1;
// }


var ring = module.exports.ring = new THREE.Mesh(
	new THREE.RingGeometry(.2, .4, 100, 1, 0, Math.PI * 2),
	new THREE.MeshBasicMaterial({
		color: 'white',
		transparent:true,
		opacity:0.0,
	})
);
ring.overdraw = true;
ring.material.side = THREE.DoubleSide;
ring.rotation.x = Math.PI / 2;
ring.position.set(1, .051, 0);

module.exports.fullScreenAttachment = function(renderer, id) {
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.getElementById("scene").appendChild(renderer.domElement);
}

