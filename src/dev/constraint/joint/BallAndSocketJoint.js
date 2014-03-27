OIMO.BallAndSocketJoint = function(config){
    OIMO.Joint.call( this, config);

    this.type=this.JOINT_BALL_AND_SOCKET;
    this.lc=new OIMO.LinearConstraint(this);
}
OIMO.BallAndSocketJoint.prototype = Object.create( OIMO.Joint.prototype );
OIMO.BallAndSocketJoint.prototype.preSolve = function (timeStep,invTimeStep) {
    this.updateAnchorPoints();
    this.lc.preSolve(timeStep,invTimeStep);
}
OIMO.BallAndSocketJoint.prototype.solve = function () {
    this.lc.solve();
}
OIMO.BallAndSocketJoint.prototype.postSolve = function () {
}