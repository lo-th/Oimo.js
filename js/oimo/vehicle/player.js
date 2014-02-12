/* Copyright (c) 2014 loth */

Player = function (Pos, d, Name) {
	var sc = new OIMO.ShapeConfig();
	sc.density = d || 1;
	sc.friction = 0.0;
	sc.restitution = 0.0;
	this.sc = sc;
	this.speed = 0.2;
	this.phi = 0;
	this.pos = Pos || [0,100,0];
	
	var name  = Name || 'droid';
	this.body = addRigid({type:name, size:[100, 200, 100], pos:this.pos, sc:sc, move:true, noSleep:true, name:name});
}

Player.prototype.move =function (v) {
	//this.body.angularVelocity.x = 0;
	//this.body.angularVelocity.y = v.r;
	//this.body.angularVelocity.z = 0;
	this.body.linearVelocity.x =  (v.x);
	//this.body.linearVelocity.y = 0;
	this.body.linearVelocity.z =  (v.z);
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