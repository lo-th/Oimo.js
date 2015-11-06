/**
 * A distance joint limits the distance between two anchor points on rigid bodies.
 * @author saharan
 * @author lo-th
 */

OIMO.DistanceJoint = function(config,minDistance,maxDistance){

    OIMO.Joint.call( this, config );

    this.type = OIMO.JOINT_DISTANCE;
    
    this.normal = new OIMO.Vec3();
    this.nr = new OIMO.Vec3(); 

    // The limit and motor information of the joint.
    this.limitMotor = new OIMO.LimitMotor(this.normal,true);
    this.limitMotor.lowerLimit = minDistance;
    this.limitMotor.upperLimit = maxDistance;
    this.t = new OIMO.TranslationalConstraint(this,this.limitMotor);

};

OIMO.DistanceJoint.prototype = Object.create( OIMO.Joint.prototype );
OIMO.DistanceJoint.prototype.constructor = OIMO.DistanceJoint;


OIMO.DistanceJoint.prototype.preSolve = function (timeStep,invTimeStep) {

    this.updateAnchorPoints();

    //var nr = this.nr;

    this.nr.sub(this.anchorPoint2, this.anchorPoint1);
    //var len = OIMO.sqrt( nr.x*nr.x + nr.y*nr.y + nr.z*nr.z );
    //if(len>0) len = 1/len;
    //this.normal.scale( nr, len );

    this.normal.normalize(this.nr);

    this.t.preSolve( timeStep, invTimeStep );

};

OIMO.DistanceJoint.prototype.solve = function () {

    this.t.solve();

};

OIMO.DistanceJoint.prototype.postSolve = function () {
};