/**
 * A hinge joint allows only for relative rotation of rigid bodies along the axis.
 * @author saharan
 * @author lo-th
 */

OIMO.HingeJoint = function ( config, lowerAngleLimit, upperAngleLimit ) {

    OIMO.Joint.call( this, config);

    this.type = OIMO.JOINT_HINGE;

    // The axis in the first body's coordinate system.
    this.localAxis1 = config.localAxis1.clone().norm();
    // The axis in the second body's coordinate system.
    this.localAxis2 = config.localAxis2.clone().norm();

    // make angle axis 1
    this.localAngle1 = new OIMO.Vec3(
        this.localAxis1.y*this.localAxis1.x - this.localAxis1.z*this.localAxis1.z,
        -this.localAxis1.z*this.localAxis1.y - this.localAxis1.x*this.localAxis1.x,
        this.localAxis1.x*this.localAxis1.z + this.localAxis1.y*this.localAxis1.y
    ).norm();

    // make angle axis 2
    var arc = new OIMO.Mat33().setQuat(new OIMO.Quat().arc(this.localAxis1,this.localAxis2));
    this.localAngle2 = new OIMO.Vec3().mulMat(arc, this.localAngle1);

    this.nor = new OIMO.Vec3();
    this.tan = new OIMO.Vec3();
    this.bin = new OIMO.Vec3();

    this.ax1 = new OIMO.Vec3();
    this.ax2 = new OIMO.Vec3();
    this.an1 = new OIMO.Vec3();
    this.an2 = new OIMO.Vec3();

    // The rotational limit and motor information of the joint.
    this.limitMotor = new OIMO.LimitMotor(this.nor,false);
    this.limitMotor.lowerLimit = lowerAngleLimit;
    this.limitMotor.upperLimit = upperAngleLimit;

    this.lc = new OIMO.LinearConstraint(this);
    this.r3 = new OIMO.Rotational3Constraint(this,this.limitMotor,new OIMO.LimitMotor(this.tan,true),new OIMO.LimitMotor(this.bin,true));
};

OIMO.HingeJoint.prototype = Object.create( OIMO.Joint.prototype );
OIMO.HingeJoint.prototype.constructor = OIMO.HingeJoint;


OIMO.HingeJoint.prototype.preSolve = function (timeStep,invTimeStep) {

    var tmp1X, tmp1Y, tmp1Z, limite;//, nx, ny, nz, tx, ty, tz, bx, by, bz;

    this.updateAnchorPoints();

    this.ax1.mulMat( this.body1.rotation, this.localAxis1 );
    this.ax2.mulMat( this.body2.rotation, this.localAxis2 );

    this.an1.mulMat( this.body1.rotation, this.localAngle1 );
    this.an2.mulMat( this.body2.rotation, this.localAngle2 );

    this.nor.set(
        this.ax1.x*this.body2.inverseMass + this.ax2.x*this.body1.inverseMass,
        this.ax1.y*this.body2.inverseMass + this.ax2.y*this.body1.inverseMass,
        this.ax1.z*this.body2.inverseMass + this.ax2.z*this.body1.inverseMass
    ).norm();

    this.tan.set(
        this.nor.y*this.nor.x - this.nor.z*this.nor.z,
        -this.nor.z*this.nor.y - this.nor.x*this.nor.x,
        this.nor.x*this.nor.z + this.nor.y*this.nor.y
    ).norm();

    this.bin.set(
        this.nor.y*this.tan.z - this.nor.z*this.tan.y,
        this.nor.z*this.tan.x - this.nor.x*this.tan.z,
        this.nor.x*this.tan.y - this.nor.y*this.tan.x
    );

    // calculate hinge angle

    limite = this.acosClamp(this.an1.x*this.an2.x + this.an1.y*this.an2.y + this.an1.z*this.an2.z)

    if(
        this.nor.x*(this.an1.y*this.an2.z - this.an1.z*this.an2.y)+
        this.nor.y*(this.an1.z*this.an2.x - this.an1.x*this.an2.z)+
        this.nor.z*(this.an1.x*this.an2.y - this.an1.y*this.an2.x)<0
    ){
        this.limitMotor.angle = -limite;
    }else{
        this.limitMotor.angle = limite;
    }

    tmp1X = this.ax1.y*this.ax2.z - this.ax1.z*this.ax2.y;
    tmp1Y = this.ax1.z*this.ax2.x - this.ax1.x*this.ax2.z;
    tmp1Z = this.ax1.x*this.ax2.y - this.ax1.y*this.ax2.x;

    this.r3.limitMotor2.angle = this.tan.x*tmp1X + this.tan.y*tmp1Y + this.tan.z*tmp1Z;
    this.r3.limitMotor3.angle = this.bin.x*tmp1X + this.bin.y*tmp1Y + this.bin.z*tmp1Z;
    
    this.r3.preSolve(timeStep,invTimeStep);
    this.lc.preSolve(timeStep,invTimeStep);

};

OIMO.HingeJoint.prototype.solve = function () {

    this.r3.solve();
    this.lc.solve();

};

OIMO.HingeJoint.prototype.postSolve = function () {
};

OIMO.HingeJoint.prototype.acosClamp = function(cos){

    if(cos>1) return 0;
    else if(cos<-1) return OIMO.PI;
    else return OIMO.acos(cos);

};