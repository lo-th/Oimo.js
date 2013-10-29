/* Copyright (c) 2012-2013 EL-EMENT saharan */

Ball = function (x, y, z, world) {
	var sc = new ShapeConfig();
	sc.density = 10;
	sc.friction = 2;
	this.speed = 0.2;
	this.phi = 0;
	
	this.body = addRigid({type:"gyro", size:[1], pos:[x, y, z], sc:sc, move:true, noSleep:true});
}

Ball.prototype.Phi =function (v) {
	this.phi = v;
}

Ball.prototype.move =function (x,y,z) {
	this.body.position = new Vec3(x,y,z);
	this.update(0,0);
}

Ball.prototype.update = function (up, down, left, right) {
	if (up === 1) {
		this.body.linearVelocity.x -= Math.cos(this.phi) * this.speed;
		this.body.linearVelocity.z -= Math.sin(this.phi) * this.speed;
	}
	if (down === 1) {
		this.body.linearVelocity.x += Math.cos(this.phi) * this.speed;
		this.body.linearVelocity.z += Math.sin(this.phi) * this.speed;
	}
	if (left ===1) {
		this.body.linearVelocity.x -= Math.cos(this.phi - Math.PI * 0.5) * this.speed;
		this.body.linearVelocity.z -= Math.sin(this.phi - Math.PI * 0.5) * this.speed;
	}
	if (right ===1) {
		this.body.linearVelocity.x -= Math.cos(this.phi + Math.PI * 0.5) * this.speed;
		this.body.linearVelocity.z -= Math.sin(this.phi + Math.PI * 0.5) * this.speed;
	}
	if (up === 0 && down === 0 && left === 0 && right === 0) {
		/*this.body.angularVelocity.x = 0;
		this.body.angularVelocity.y = 0;
		this.body.angularVelocity.z = 0;
		this.body.linearVelocity.x = 0;
		this.body.linearVelocity.y = 0;
		this.body.linearVelocity.z = 0;*/
		//this.body.angularVelocity.scaleEqual(0.98);
		//this.body.angularVelocity.scaleEqual(0.88);
	}
}