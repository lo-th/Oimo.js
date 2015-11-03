OIMO.Joint = function(){
    OIMO.Constraint.call( this );

    this.JOINT_NULL=0x0;
    this.JOINT_DISTANCE=0x1;
    this.JOINT_BALL=0x2;
    this.JOINT_HINGE=0x3;
    this.JOINT_HINGE2=0x4;

    this.name = "";
    this.type=0;
    this.allowCollision=false;
    this.localRelativeAnchorPosition1=new OIMO.Vec3();
    this.localRelativeAnchorPosition2=new OIMO.Vec3();
    this.relativeAnchorPosition1=new OIMO.Vec3();
    this.relativeAnchorPosition2=new OIMO.Vec3();
    this.anchorPosition1=new OIMO.Vec3();
    this.anchorPosition2=new OIMO.Vec3();
    this.connection1=new OIMO.JointConnection(this);
    this.connection2=new OIMO.JointConnection(this);

    this.matrix = new OIMO.Mat44();
}
OIMO.Joint.prototype = Object.create( OIMO.Constraint.prototype );
OIMO.Joint.prototype.preSolve = function (timeStep,invTimeStep) {
}
OIMO.Joint.prototype.solve = function () {
}
OIMO.Joint.prototype.postSolve = function () {
}


// for three js
OIMO.Joint.prototype.getMatrix = function () {
    var m = this.matrix.elements;
    var p1 = this.anchorPosition1;
    var p2 = this.anchorPosition2;
    m[0] = p1.x * OIMO.WORLD_SCALE;
    m[1] = p1.y * OIMO.WORLD_SCALE;
    m[2] = p1.z * OIMO.WORLD_SCALE;
    m[3] = 0;

    m[4] = p2.x * OIMO.WORLD_SCALE;
    m[5] = p2.y * OIMO.WORLD_SCALE;
    m[6] = p2.z * OIMO.WORLD_SCALE;
    m[7] = 0;

    return m;
}