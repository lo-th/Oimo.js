/* Copyright (c) 2012-2013 EL-EMENT saharan */

Player = function (Pos, d, Name) {
	var sc = new OIMO.ShapeConfig();
	sc.density = d || 20;
	sc.friction = 0.6;
	this.sc = sc;
	this.speed = 0.2;
	this.phi = 0;
	this.pos = Pos || [0,100,0];
	
	var name  = Name || 'droid';
	this.body = addRigid({type:name, size:[100, 200, 100], pos:this.pos, sc:sc, move:true, noSleep:true});
}

Player.prototype.Phi =function (v) {
	this.phi = v;
}

Player.prototype.move =function (x,y,z, rot) {
	//this.body.rotation = eulerToMatrix(0,rot,0);
	this.body.position = new OIMO.Vec3(x,y+1,z);
	//this.body.orientation = eulerToAxisAngle(0,rot,0);
	/*this.body.orientation.x = 0;
	this.body.orientation.y = 0;
	this.body.orientation.z = 0;
	this.body.orientation.s = 0;*/
	this.body.angularVelocity.x = 0;
	this.body.angularVelocity.y = rot;
	this.body.angularVelocity.z = 0;
	this.body.linearVelocity.x = 0;
	this.body.linearVelocity.y = 0;
	this.body.linearVelocity.z = 0;
	//this.update(0,0);
}

Player.prototype.update = function (up, down, left, right) {
	/*if (up === 1) {
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
	if (up === 0 && down === 0 && left === 0 && right === 0) {*/
		/*this.body.angularVelocity.x = 0;
		this.body.angularVelocity.y = 0;
		this.body.angularVelocity.z = 0;
		this.body.linearVelocity.x = 0;
		this.body.linearVelocity.y = 0;
		this.body.linearVelocity.z = 0;*/
	/*	this.body.angularVelocity.scaleEqual(0.98);
		this.body.angularVelocity.scaleEqual(0.88);
	}*/
}