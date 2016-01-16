var THREE = require('three');
module.exports.stdCamera = new THREE.PerspectiveCamera(
	35, // fov deg
	window.innerWidth / window.innerHeight,
	1, //near
	1000 // far
);

module.exports.cube1 = new THREE.Mesh(
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
module.exports.cube2 = new THREE.Mesh(
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

module.exports.cube2.onmousedown = module.exports.cube1.onmousedown = function(){
	this.material.transparent = true;
	this.material.opacity = 0.1;
}


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

