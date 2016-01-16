var THREE = require('three');
module.exports.stdCamera = new THREE.PerspectiveCamera(
	35, // fov deg
	window.innerWidth / window.innerHeight,
	1, //near
	1000 // far
);

module.exports.tile = new THREE.Mesh(
	new THREE.BoxGeometry(1, .1, 1),
	new THREE.MeshPhongMaterial({
		ambient: 0x555555,
		color: 0x990000,
		specular: 0xffffff,
		shininess: 50,
		shading: THREE.SmoothShading,
		name:"cube"
	})
);

module.exports.addTerrain = function(terrain, terrainTypes, scene){
	terrain.map((row,x)=>{
		row.map((type,y)=>{
			var clone = terrainTypes[type].clone();
			clone.position.x = x -2
			clone.position.z = y -2
			scene.add(clone);
		})
	})
}

module.exports.city = new THREE.Mesh(
	new THREE.CylinderGeometry(.5, .5, .5, 30, 30),
	new THREE.MeshLambertMaterial({
		color:0xffffff
	})
)


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

