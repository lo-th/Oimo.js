/* Copyright (c) 2012-2013 EL-EMENT saharan */

Ball = function (Pos, d, Name) {
	var sc = new OIMO.ShapeConfig();
	sc.density = d || 10;
	sc.friction = 2;
	this.speed = 0.2;
	this.phi = 0;
	this.pos = Pos || [0,0,0];
	
	var name  = Name || 'gyro';
	this.body = addRigid({type:name, size:[100], pos:this.pos, sc:sc, move:true, noSleep:true});
}

Ball.prototype.Phi =function (v) {
	this.phi = v;
}

Ball.prototype.move =function (x,y,z) {
	this.body.position = new OIMO.Vec3(x,y,z);
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
		this.body.angularVelocity.scaleEqual(0.3);
		this.body.linearVelocity.scaleEqual(0.3);
	}
}

//In droid demo, you may set actual velocity(note that the unit for velocity is [m/s] 
//	so you should devide movement amount by movement duration) to droid's rigid body 
//for avoiding penetration, because OimoPhysics uses velocities for "primary" constraint impulses,
// and penetration depths for "secondary" constraint impulses that are used just for correcting errors occured in solving primary constraints