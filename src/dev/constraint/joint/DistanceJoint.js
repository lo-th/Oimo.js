OIMO.DistanceJoint = function(config,minDistance,maxDistance){
    OIMO.Joint.call( this, config);

    this.type=this.JOINT_DISTANCE;
    this.normal=new OIMO.Vec3();
    this.limitMotor=new OIMO.LimitMotor(this.normal,true);
    this.limitMotor.lowerLimit=minDistance;
    this.limitMotor.upperLimit=maxDistance;
    this.t=new OIMO.TranslationalConstraint(this,this.limitMotor);
}
OIMO.DistanceJoint.prototype = Object.create( OIMO.Joint.prototype );
OIMO.DistanceJoint.prototype.preSolve = function (timeStep,invTimeStep) {
    this.updateAnchorPoints();
    var nx=this.anchorPoint2.x-this.anchorPoint1.x;
    var ny=this.anchorPoint2.y-this.anchorPoint1.y;
    var nz=this.anchorPoint2.z-this.anchorPoint1.z;
    var len=Math.sqrt(nx*nx+ny*ny+nz*nz);
    if(len>0)len=1/len;
    this.normal.init(nx*len,ny*len,nz*len);
    this.t.preSolve(timeStep,invTimeStep);
}
OIMO.DistanceJoint.prototype.solve = function () {
    this.t.solve();
}
OIMO.DistanceJoint.prototype.postSolve = function () {
}