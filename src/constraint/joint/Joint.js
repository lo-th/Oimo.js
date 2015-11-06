/**
 * Joints are used to constrain the motion between two rigid bodies.
 * @author saharan
 * @author lo-th
 */

OIMO.Joint = function(config){

    OIMO.Constraint.call( this );

    // joint name
    this.name = "";

    // The type of the joint.
    this.type = OIMO.JOINT_NULL;
    //  The previous joint in the world.
    this.prev = null;
    // The next joint in the world.
    this.next = null;

    this.body1 = config.body1;
    this.body2 = config.body2;

    // The anchor point on the first rigid body in local coordinate system.
    this.localAnchorPoint1 = new OIMO.Vec3().copy(config.localAnchorPoint1);
    // The anchor point on the second rigid body in local coordinate system.
    this.localAnchorPoint2 = new OIMO.Vec3().copy(config.localAnchorPoint2);
    // The anchor point on the first rigid body in world coordinate system relative to the body's origin.
    this.relativeAnchorPoint1 = new OIMO.Vec3();
    // The anchor point on the second rigid body in world coordinate system relative to the body's origin.
    this.relativeAnchorPoint2 = new OIMO.Vec3();
    //  The anchor point on the first rigid body in world coordinate system.
    this.anchorPoint1 = new OIMO.Vec3();
    // The anchor point on the second rigid body in world coordinate system.
    this.anchorPoint2 = new OIMO.Vec3();
    //  Whether allow collision between connected rigid bodies or not.
    this.allowCollision = config.allowCollision;

    this.b1Link = new OIMO.JointLink(this);
    this.b2Link = new OIMO.JointLink(this);

    this.matrix = new OIMO.Mat44();

};

OIMO.Joint.prototype = Object.create( OIMO.Constraint.prototype );
OIMO.Joint.prototype.constructor = OIMO.Joint;

// Update all the anchor points.

OIMO.Joint.prototype.updateAnchorPoints = function () {

    this.relativeAnchorPoint1.mulMat(this.body1.rotation, this.localAnchorPoint1);
    this.relativeAnchorPoint2.mulMat(this.body2.rotation, this.localAnchorPoint2);

    this.anchorPoint1.add(this.relativeAnchorPoint1, this.body1.position);
    this.anchorPoint2.add(this.relativeAnchorPoint2, this.body2.position);

};

// Attach the joint from the bodies.

OIMO.Joint.prototype.attach = function () {
    this.b1Link.body = this.body2;
    this.b2Link.body = this.body1;
    if(this.body1.jointLink != null) (this.b1Link.next=this.body1.jointLink).prev = this.b1Link;
    else this.b1Link.next = null;
    this.body1.jointLink = this.b1Link;
    this.body1.numJoints++;
    if(this.body2.jointLink != null) (this.b2Link.next=this.body2.jointLink).prev = this.b2Link;
    else this.b2Link.next = null;
    this.body2.jointLink = this.b2Link;
    this.body2.numJoints++;
};

// Detach the joint from the bodies.

OIMO.Joint.prototype.detach = function () {
    var prev = this.b1Link.prev;
    var next = this.b1Link.next;
    if(prev != null) prev.next = next;
    if(next != null) next.prev = prev;
    if(this.body1.jointLink == this.b1Link) this.body1.jointLink = next;
    this.b1Link.prev = null;
    this.b1Link.next = null;
    this.b1Link.body = null;
    this.body1.numJoints--;

    prev = this.b2Link.prev;
    next = this.b2Link.next;
    if(prev != null) prev.next = next;
    if(next != null) next.prev = prev;
    if(this.body2.jointLink==this.b2Link) this.body2.jointLink = next;
    this.b2Link.prev = null;
    this.b2Link.next = null;
    this.b2Link.body = null;
    this.body2.numJoints--;

    this.b1Link.body = null;
    this.b2Link.body = null;
};


// Awake the bodies.

OIMO.Joint.prototype.awake = function () {
    this.body1.awake();
    this.body2.awake();
};

// calculation function

OIMO.Joint.prototype.preSolve = function (timeStep,invTimeStep) {
};

OIMO.Joint.prototype.solve = function () {
};

OIMO.Joint.prototype.postSolve = function () {
};

// Delete process

OIMO.Joint.prototype.remove = function(){
    this.dispose();
};

OIMO.Joint.prototype.dispose = function(){
    this.parent.removeJoint(this);
};


// Three js add

OIMO.Joint.prototype.getPosition = function () {
    var p1 = new OIMO.Vec3().scale(this.anchorPoint1, OIMO.WORLD_SCALE);
    var p2 = new OIMO.Vec3().scale(this.anchorPoint2, OIMO.WORLD_SCALE);
    return [p1, p2];
};

OIMO.Joint.prototype.getMatrix = function () {
    var m = this.matrix.elements;
    var p1 = this.anchorPoint1;
    var p2 = this.anchorPoint2;
    m[0] = p1.x * OIMO.WORLD_SCALE;
    m[1] = p1.y * OIMO.WORLD_SCALE;
    m[2] = p1.z * OIMO.WORLD_SCALE;
    m[3] = 0;

    m[4] = p2.x * OIMO.WORLD_SCALE;
    m[5] = p2.y * OIMO.WORLD_SCALE;
    m[6] = p2.z * OIMO.WORLD_SCALE;
    m[7] = 0;

    return m;
};