/**
* Kinematic Human
* @author _ishibashijun - http://jsdo.it/_ishibashijun
*/

var Human = function () {

	this.sets = {
		speed : 0.3,
		thighRange : 50,
        thighBase : 100,
        calfRange : 30,
        calfOffset : -1.57,
        armRange : 55,
        foreArmRange : 20,
        foreArmOffset : -1.57, 
        gravity : 0.88
	};

	this.bones = {
		body : new Human.bone( 0,0,0,   80,20,36 ),
		neck : new Human.bone( 0,0,0,   25,10,10 ),
		head : new Human.bone( 0,0,0    ),

		LeftUpLeg : new Human.bone(   200,200,-10,  50,15,15 ),
		LeftLowLeg : new Human.bone(  0,0,-10,      60,10,10 ), 
		RightUpLeg : new Human.bone(  200,200,10,   50,15,15 ),
		RightLowLeg : new Human.bone( 0,0,10,       60,10,10 ),
		
		LeftUpArm : new Human.bone(   0,0,-22,      40,10,10 ),
		LeftLowArm : new Human.bone(  0,0,-22,      50,7,7   ),
		RightUpArm : new Human.bone(  0,0,22,       40,10,10 ),
		RightLowArm : new Human.bone( 0,0,22,       50,7,7   )
	};

	
	this.bones.body.x = this.bones.LeftUpLeg.x;
	this.bones.body.y = this.bones.LeftUpLeg.y;
	this.bones.neck.x = this.bones.body.getPin().x;
	this.bones.neck.y = this.bones.body.getPin().y;
	this.bones.head.x = this.bones.neck.getPin().x;
	this.bones.head.y = this.bones.neck.getPin().y;

	this.bones.LeftLowLeg.x = this.bones.LeftUpLeg.getPin().x;
	this.bones.LeftLowLeg.y = this.bones.LeftUpLeg.getPin().y;
	this.bones.RightLowLeg.x = this.bones.RightUpLeg.getPin().x;
	this.bones.RightLowLeg.y = this.bones.RightUpLeg.getPin().y;

	this.bones.LeftUpArm.x = this.bones.body.getPin().x;
	this.bones.LeftUpArm.y = this.bones.body.getPin().y;
	this.bones.LeftLowArm.x = this.bones.LeftUpArm.getPin().x;
	this.bones.LeftLowArm.y = this.bones.LeftUpArm.getPin().y;
	this.bones.RightUpArm.x = this.bones.body.getPin().x;
	this.bones.RightUpArm.y = this.bones.body.getPin().y;
	this.bones.RightLowArm.x = this.bones.RightUpArm.getPin().x;
	this.bones.RightLowArm.y = this.bones.RightUpArm.getPin().y;

	this.running = true;
	this.vx = 0;
	this.vy = 0;
	this.angle = 0;
	this.zw = 0;
	this.zh = 0;
	this.ToRad = Math.PI / 180;
};

Human.prototype = {
	update: function(){

		this.angle += this.sets.speed;
		this.vy += this.sets.gravity;
		this.bones.LeftUpLeg.x += this.vx;
		this.bones.LeftUpLeg.y += this.vy;
		this.bones.RightUpLeg.x += this.vx;
		this.bones.RightUpLeg.y += this.vy;

		this.moveLegs( this.bones.LeftUpLeg, this.bones.LeftLowLeg, this.angle );
	    this.moveLegs( this.bones.RightUpLeg, this.bones.RightLowLeg, this.angle + Math.PI );
	    this.bodyAngle( this.bones.body, this.bones.LeftUpLeg );
     	this.neckAngle( this.bones.body, this.bones.neck);
	    this.moveHead( this.bones.neck, this.bones.head );
	    this.moveArms( this.bones.LeftUpArm, this.bones.LeftLowArm, this.angle + Math.PI );
	    this.moveArms( this.bones.RightUpArm, this.bones.RightLowArm, this.angle );

	    this.checkFloor( this.bones.LeftLowLeg );
	    this.checkFloor( this.bones.RightLowLeg );

	    this.checkWalls();

	},

	initWalk : function () {
		this.running = false;
		this.sets.speed = 0.15;
		this.sets.thighRange = 25;
		this.sets.thighBase = 90;
		this.sets.calfRange = 20;
		this.sets.armRange = 60//17;
		this.sets.foreArmRange = 15;
		this.sets.gravity = 0.17;
    },

	initRun : function () {
		this.running = true;
		this.sets.speed = 0.30;
		this.sets.thighRange = 50;
		this.sets.thighBase = 100;
		this.sets.calfRange = 30;
		this.sets.armRange = 55;
		this.sets.foreArmRange = 20;
		this.sets.gravity = 0.92;
	},

	moveLegs : function ( legA, legB, a ) {
		var angle0 = ( Math.sin( a ) * this.sets.thighRange + this.sets.thighBase ) * this.ToRad,
			angle1 = ( Math.sin( a + this.sets.calfOffset ) * this.sets.calfRange + this.sets.calfRange ) * this.ToRad,
			foot = legB.getPin(  ),
			oneTwenty = 120 * this.ToRad;
		if ( !this.running ) legA.rotation = angle0;
		else legA.rotation = angle0 > oneTwenty ? oneTwenty : angle0;
		legB.rotation = legA.rotation + angle1;
		legB.x = legA.getPin().x;
		legB.y = legA.getPin().y;
		legB.vx = legB.getPin().x - foot.x;
		legB.vy = legB.getPin().y - foot.y;
	},
	moveArms : function ( armA, armB, a ) {
		var angle0 = ( Math.sin( a ) * this.sets.armRange + this.sets.thighBase ) * this.ToRad,
			angle1 = ( Math.sin( a + this.sets.foreArmOffset ) * this.sets.foreArmRange + this.sets.foreArmRange ) * this.ToRad,
			fourtyFive = 45 * this.ToRad;
		armA.x = this.bones.body.getPin().x;
		armA.y = this.bones.body.getPin().y;
		armA.rotation = angle0;
		if ( !this.running ) armB.rotation = armA.rotation - angle1;
		else armB.rotation = armA.rotation - angle1 - fourtyFive;
		armB.x = armA.getPin().x;
		armB.y = armA.getPin().y;
	},
	bodyAngle : function ( body, leg ) {
		var angle = -( 180 - this.sets.thighBase ) * this.ToRad;
		body.rotation = angle;
		body.x = leg.x;
		body.y = leg.y;
	},
	neckAngle : function ( body, neck ) {
		var angle = -( 180 - this.sets.thighBase ) * this.ToRad;
		neck.rotation = angle;
		neck.x = body.getPin().x;
		neck.y = body.getPin().y;
	},
	moveHead : function( neck, head ) {
		head.x = neck.getPin().x;
		head.y = neck.getPin().y;
	},
	checkFloor : function ( seg ) {
		var yMax = seg.getPin().y + seg.height * 0.5;
		if ( yMax > this.zh ) {
			var dy = yMax - this.zh;
			this.bones.LeftUpLeg.y -= dy;
			this.bones.LeftLowLeg.y -= dy;
			this.bones.RightUpLeg.y -= dy;
			this.bones.RightLowLeg.y -= dy;
			this.vx -= seg.vx;
			this.vy -= seg.vy;
		}
	},
	checkWalls : function () {
		if ( this.bones.LeftUpLeg.x >= this.zw ) {
			this.bones.LeftUpLeg.x = 0;
			this.bones.RightUpLeg.x = 0;
			this.bones.LeftLowLeg.x = 0;
			this.bones.RightLowLeg.x = 0;
		}
	}
};



Human.bone = function ( x,y,z, w,h,d ) {
	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
	this.width = w || 0;
	this.height = h || 0;
	this.deepth = d || 0;
	this.vx = 0;
	this.vy = 0;
	this.rotation = 0;
	this.color = "#000";
	this.lineWidth = 1;
};

Human.bone.prototype = {
	getPin: function () {
		return {
			x: this.x + Math.cos( this.rotation ) * this.width,
			y: this.y + Math.sin( this.rotation ) * this.width
		};
	}
};