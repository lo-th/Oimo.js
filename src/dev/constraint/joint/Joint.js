/**
* Joints are used to constrain the motion between two rigid bodies.
* @author saharan
*/
OIMO.Joint = function(config){
    OIMO.Constraint.call( this );

    this.name = "";
    // Distance joint
    this.JOINT_DISTANCE=0x1;
    // Ball-and-socket joint
    this.JOINT_BALL_AND_SOCKET=0x2;
    //  Hinge joint
    this.JOINT_HINGE=0x3;
    //  Wheel joint
    this.JOINT_WHEEL=0x4;
    //  Slider joint
    this.JOINT_SLIDER=0x5;
    //  Prismatic joint
    this.JOINT_PRISMATIC=0x6;

    // The type of the joint.
    this.type=0;
    //  The previous joint in the world.
    this.prev=null;
    // The next joint in the world.
    this.next=null;

    this.body1=config.body1;
    this.body2=config.body2;

    // The anchor point on the first rigid body in local coordinate system.
    this.localAnchorPoint1=new OIMO.Vec3().copy(config.localAnchorPoint1);
    // The anchor point on the second rigid body in local coordinate system.
    this.localAnchorPoint2=new OIMO.Vec3().copy(config.localAnchorPoint2);
    // The anchor point on the first rigid body in world coordinate system relative to the body's origin.
    this.relativeAnchorPoint1=new OIMO.Vec3();
    // The anchor point on the second rigid body in world coordinate system relative to the body's origin.
    this.relativeAnchorPoint2=new OIMO.Vec3();
    //  The anchor point on the first rigid body in world coordinate system.
    this.anchorPoint1=new OIMO.Vec3();
    // The anchor point on the second rigid body in world coordinate system.
    this.anchorPoint2=new OIMO.Vec3();
    //  Whether allow collision between connected rigid bodies or not.
    this.allowCollision=config.allowCollision;

    this.b1Link=new OIMO.JointLink(this);
    this.b2Link=new OIMO.JointLink(this);

    this.matrix = new OIMO.Mat44();
}
OIMO.Joint.prototype = Object.create( OIMO.Constraint.prototype );
/**
* Update all the anchor points.
*/
OIMO.Joint.prototype.updateAnchorPoints = function () {
    var p1=this.body1.position;
    var p2=this.body2.position;

    var tr1 = this.body1.rotation.elements;
    var tr2 = this.body2.rotation.elements;

    var l1x=this.localAnchorPoint1.x;
    var l1y=this.localAnchorPoint1.y;
    var l1z=this.localAnchorPoint1.z;
    var l2x=this.localAnchorPoint2.x;
    var l2y=this.localAnchorPoint2.y;
    var l2z=this.localAnchorPoint2.z;

    var r1x=l1x*tr1[0]+l1y*tr1[1]+l1z*tr1[2];
    var r1y=l1x*tr1[3]+l1y*tr1[4]+l1z*tr1[5];
    var r1z=l1x*tr1[6]+l1y*tr1[7]+l1z*tr1[8];
    var r2x=l2x*tr2[0]+l2y*tr2[1]+l2z*tr2[2];
    var r2y=l2x*tr2[3]+l2y*tr2[4]+l2z*tr2[5];
    var r2z=l2x*tr2[6]+l2y*tr2[7]+l2z*tr2[8];
    this.relativeAnchorPoint1.x=r1x;
    this.relativeAnchorPoint1.y=r1y;
    this.relativeAnchorPoint1.z=r1z;
    this.relativeAnchorPoint2.x=r2x;
    this.relativeAnchorPoint2.y=r2y;
    this.relativeAnchorPoint2.z=r2z;
    var p1x=r1x+p1.x;
    var p1y=r1y+p1.y;
    var p1z=r1z+p1.z;
    var p2x=r2x+p2.x;
    var p2y=r2y+p2.y;
    var p2z=r2z+p2.z;
    this.anchorPoint1.x=p1x;
    this.anchorPoint1.y=p1y;
    this.anchorPoint1.z=p1z;
    this.anchorPoint2.x=p2x;
    this.anchorPoint2.y=p2y;
    this.anchorPoint2.z=p2z;
}
/**
* Attach the joint from the bodies.
*/
OIMO.Joint.prototype.attach = function () {
    this.b1Link.body=this.body2;
    this.b2Link.body=this.body1;
    if(this.body1.jointLink!=null)(this.b1Link.next=this.body1.jointLink).prev=this.b1Link;
    else this.b1Link.next=null;
    this.body1.jointLink=this.b1Link;
    this.body1.numJoints++;
    if(this.body2.jointLink!=null)(this.b2Link.next=this.body2.jointLink).prev=this.b2Link;
    else this.b2Link.next=null;
    this.body2.jointLink=this.b2Link;
    this.body2.numJoints++;
}
OIMO.Joint.prototype.detach = function () {
    var prev=this.b1Link.prev;
    var next=this.b1Link.next;
    if(prev!=null)prev.next=next;
    if(next!=null)next.prev=prev;
    if(this.body1.jointLink==this.b1Link)this.body1.jointLink=next;
    this.b1Link.prev=null;
    this.b1Link.next=null;
    this.b1Link.body=null;
    this.body1.numJoints--;

    prev=this.b2Link.prev;
    next=this.b2Link.next;
    if(prev!=null)prev.next=next;
    if(next!=null)next.prev=prev;
    if(this.body2.jointLink==this.b2Link)this.body2.jointLink=next;
    this.b2Link.prev=null;
    this.b2Link.next=null;
    this.b2Link.body=null;
    this.body2.numJoints--;

    this.b1Link.body=null;
    this.b2Link.body=null;
}
/**
* Awake the bodies.
*/
OIMO.Joint.prototype.awake = function () {
    this.body1.awake();
    this.body2.awake();
}
OIMO.Joint.prototype.preSolve = function (timeStep,invTimeStep) {
}
OIMO.Joint.prototype.solve = function () {
}
OIMO.Joint.prototype.postSolve = function () {
}

OIMO.Joint.prototype.dispose = function(){
    this.parent.removeJoint(this);
}

/**
* Three js add
*/
OIMO.Joint.prototype.getPosition = function () {
    var p1 = new OIMO.Vec3().scale(this.anchorPoint1, OIMO.WORLD_SCALE);
    var p2 = new OIMO.Vec3().scale(this.anchorPoint2, OIMO.WORLD_SCALE);
    return [p1, p2];
}

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
}