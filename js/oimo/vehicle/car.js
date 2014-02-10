/* Copyright (c) 2012-2013 EL-EMENT saharan */

Car = function (Pos, Config) {
	this.body;
	this.wheel1;
	this.wheel2;
	this.wheel3;
	this.wheel4;
	this.joint1;
	this.joint2;
	this.joint3;
	this.joint4;
	this.angle =0;

	this.pos = Pos || [0,0,0];
	//this.size = {w:0.5, d:1, h:0.4}
	this.size = {w:50, d:100, h:40}
	this.config = Config || [10,0.5,0.5,    10,4,0.5];

	// create a body
	//var off = 0.4;
	var rad = 30;//0.3;
	var h = 40;//0.4;
	var w = 50;//0.5;
	var d = 100;//1;

	var sc = new OIMO.ShapeConfig();
	sc.density = this.config[0] || 10;
	sc.friction = this.config[1] || 0.5;
	sc.restitution = this.config[2] || 0.5;
	
	//this.body = addRigid({type:"carBody", size:[(w+0.2) * 2, h, (d+0.4) * 2], pos:this.pos, sc:sc, move:true, noSleep:true, noAdjust:true});
	this.body = addRigid({type:"carBody", size:[(w+20) * 2, h, (d+40) * 2], pos:this.pos, sc:sc, move:true, noSleep:true, massPos:[0, (h*0.5)+rad, 0]});


	// create wheels
	sc.friction = this.config[3] || 10;
	sc.friction = this.config[4] || 4;
	sc.restitution = this.config[5] || 0.5;
	sc.relativePosition.init(0, 0, 0);
	this.wheel1 = addRigid({type:"wheelinv", size:[rad, rad, rad], pos:[this.pos[0] - w , this.pos[1], this.pos[2] - d], sc:sc, move:true});
	this.wheel2 = addRigid({type:"wheel", size:[rad, rad, rad], pos:[this.pos[0] + w, this.pos[1], this.pos[2] - d], sc:sc, move:true});
	this.wheel3 = addRigid({type:"wheelinv", size:[rad, rad, rad], pos:[this.pos[0] - w, this.pos[1], this.pos[2] + d], sc:sc, move:true});
	this.wheel4 = addRigid({type:"wheel", size:[rad, rad, rad], pos:[this.pos[0] + w, this.pos[1], this.pos[2] + d], sc:sc, move:true});
	
	// create joints
	this.joint1 = addJoint({type:"jointWheel", body1:this.body, body2:this.wheel1, pos1:[-w, 0, -d], axe1:[0, -1, 0], axe2:[-1, 0, 0], limit:[0,0], spring:[8,1] });
	this.joint2 = addJoint({type:"jointWheel", body1:this.body, body2:this.wheel2, pos1:[w, 0, -d], axe1:[0, -1, 0], axe2:[-1, 0, 0], limit:[0,0], spring:[8,1] });
	this.joint3 = addJoint({type:"jointWheel", body1:this.body, body2:this.wheel3, pos1:[-w, 0, d], axe1:[0, -1, 0], axe2:[-1, 0, 0], limit:[0,0] });
	this.joint4 = addJoint({type:"jointWheel", body1:this.body, body2:this.wheel4, pos1:[w, 0, d], axe1:[0, -1, 0], axe2:[-1, 0, 0], limit:[0,0] });
}

Car.prototype.move =function (x,y,z) {
	this.body.position = new OIMO.Vec3(x,y,z);
	this.wheel1.position = new OIMO.Vec3(x-this.size.w,y,z-this.size.d);
	this.wheel2.position = new OIMO.Vec3(x+this.size.w,y,z-this.size.d);
	this.wheel3.position = new OIMO.Vec3(x-this.size.w,y,z+this.size.d);
	this.wheel4.position = new OIMO.Vec3(x+this.size.w,y,z+this.size.d);

	this.update(0,0);
}

Car.prototype.update = function (accelSign, handleSign) {
	var breaking = this.body.linearVelocity.dot(new OIMO.Vec3(this.body.rotation.e02, this.body.rotation.e12, this.body.rotation.e22)) * accelSign > 0;
	var ratio = 0;
	var v = this.body.linearVelocity.length() * 3.6;
	var maxSpeed = Math.PI * 2 / 60 * 1200; // 1200rpm
	var minTorque = 4;
	
	if (breaking) minTorque *= 2;
	
	if (v < 10) ratio = 3;
	else if (v < 30) ratio = 2;
	else if (v < 70) ratio = 1.4;
	else if (v < 100) ratio = 1.2;
	else  ratio = 1;
	
	var speed = maxSpeed / ratio * accelSign;
	var torque = minTorque * ratio * (accelSign * accelSign);
	
	var deg45 = Math.PI / 4;
	this.angle += handleSign * 0.02;
	this.angle *= 0.94;
	this.angle = this.angle > deg45 ? deg45 : this.angle < -deg45 ? -deg45 : this.angle;
	
	this.joint1.rotationalLimitMotor2.setMotor(speed, torque);
	this.joint2.rotationalLimitMotor2.setMotor(speed, torque);
	this.joint3.rotationalLimitMotor2.setMotor(speed, torque);
	this.joint4.rotationalLimitMotor2.setMotor(speed, torque);
	this.joint1.rotationalLimitMotor1.setLimit(this.angle, this.angle);
	this.joint2.rotationalLimitMotor1.setLimit(this.angle, this.angle);
	
	var axis = new OIMO.Vec3(this.body.rotation.e01, this.body.rotation.e11, this.body.rotation.e21); // up axis
	
	this.correctRotation(this.wheel1);
	this.correctRotation(this.wheel2);
	this.correctRotation(this.wheel3);
	this.correctRotation(this.wheel4);
}
	
Car.prototype.correctRotation =	function (w) {
	var axis1 = new OIMO.Vec3(this.body.rotation.e01, this.body.rotation.e11, this.body.rotation.e21);
	var axis2 = new OIMO.Vec3(w.rotation.e00, w.rotation.e10, w.rotation.e20);
	var axis3 = new OIMO.Vec3().sub(axis2, axis1.scaleEqual(axis1.dot(axis2)));
	w.orientation.mul(new OIMO.Quat().arc(axis2, axis3.normalize(axis3)), w.orientation);
	w.orientation.normalize(w.orientation);
}