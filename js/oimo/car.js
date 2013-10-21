/* Copyright (c) 2012-2013 EL-EMENT saharan */

Car = function (x, y, z, world) {
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

	// create a body
	var off = 0.4;
	var rad = 0.3;
	var w = 0.5;
	var d = 1;

	var sc = new ShapeConfig();
	sc.relativePosition.init(0, off, 0);
	sc.density = 10;
	
	this.body = addRigid({type:"box", size:[w * 2, 0.4, d * 2], pos:[x, y, z], sc:sc, move:true, noSleep:true, noAdjust:true});

	// create wheels
	sc.friction = 4;
	sc.relativePosition.init(0, 0, 0);
	this.wheel1 = addRigid({type:"wheelinv", size:[rad, rad, rad], pos:[x - w, y, z - d], sc:sc, move:true});
	this.wheel2 = addRigid({type:"wheel", size:[rad, rad, rad], pos:[x + w, y, z - d], sc:sc, move:true});
	this.wheel3 = addRigid({type:"wheelinv", size:[rad, rad, rad], pos:[x - w, y, z + d], sc:sc, move:true});
	this.wheel4 = addRigid({type:"wheel", size:[rad, rad, rad], pos:[x + w, y, z + d], sc:sc, move:true});
		
	// create joints
	this.joint1 = addJoint({type:"wheel", body1:this.body, body2:this.wheel1, pos1:[-w, 0, -d], axis1:[0, -1, 0], axis2:[-1, 0, 0], limit:[0,0], spring:[8,1] });
	this.joint2 = addJoint({type:"wheel", body1:this.body, body2:this.wheel2, pos1:[w, 0, -d], axis1:[0, -1, 0], axis2:[-1, 0, 0], limit:[0,0], spring:[8,1] });
	this.joint3 = addJoint({type:"wheel", body1:this.body, body2:this.wheel3, pos1:[-w, 0, d], axis1:[0, -1, 0], axis2:[-1, 0, 0], limit:[0,0] });
	this.joint4 = addJoint({type:"wheel", body1:this.body, body2:this.wheel4, pos1:[w, 0, d], axis1:[0, -1, 0], axis2:[-1, 0, 0], limit:[0,0] });
}
	
/*Car.prototype.update = function (accelSign, handleSign) {
		var breaking = this.body.linearVelocity.dot(new Vec3(this.body.rotation.e02, this.body.rotation.e12, this.body.rotation.e22)) * accelSign > 0;
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
		
		var axis = new Vec3(body.rotation.e01, body.rotation.e11, body.rotation.e21); // up axis
		
		this.correctRotation(this.wheel1);
		this.correctRotation(this.wheel2);
		this.correctRotation(this.wheel3);
		this.correctRotation(this.wheel4);
	}
	
Car.prototype.correctRotation =	function (w) {
	var axis1 = new Vec3(this.body.rotation.e01, this.body.rotation.e11, this.body.rotation.e21);
	var axis2 = new Vec3(w.rotation.e00, w.rotation.e10, w.rotation.e20);
	var axis3 = new Vec3().sub(axis2, axis1.scaleEqual(axis1.dot(axis2)));
	w.orientation.mul(new Quat().arc(axis2, axis3.normalize(axis3)), w.orientation);
	w.orientation.normalize(w.orientation);
}*/