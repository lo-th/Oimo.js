/**
* An angular constraint for all axes for various joints.
* @author saharan
*/

OIMO.AngularConstraint = function ( joint, targetOrientation ) {

    this.joint = joint;

    this.targetOrientation = new OIMO.Quat().invert(targetOrientation);

    this.relativeOrientation = new OIMO.Quat();

    this.ii1 = null;
    this.ii2 = null;
    this.dd = null;

    this.vel = new OIMO.Vec3();
    this.imp = new OIMO.Vec3();

    this.rn0 = new OIMO.Vec3();
    this.rn1 = new OIMO.Vec3();
    this.rn2 = new OIMO.Vec3();

    this.b1 = joint.body1;
    this.b2 = joint.body2;
    this.a1 = this.b1.angularVelocity;
    this.a2 = this.b2.angularVelocity;
    this.i1 = this.b1.inverseInertia;
    this.i2 = this.b2.inverseInertia;

};

OIMO.AngularConstraint.prototype = {

    constructor: OIMO.AngularConstraint,

    preSolve: function ( timeStep, invTimeStep ) {

        var inv, len, v, vv;

        this.ii1 = this.i1.clone();
        this.ii2 = this.i2.clone();

        v = new OIMO.Mat33().add(this.ii1, this.ii2).elements;
        inv = 1/( v[0]*(v[4]*v[8]-v[7]*v[5])  +  v[3]*(v[7]*v[2]-v[1]*v[8])  +  v[6]*(v[1]*v[5]-v[4]*v[2]) );
        this.dd = new OIMO.Mat33(
            v[4]*v[8]-v[5]*v[7], v[2]*v[7]-v[1]*v[8], v[1]*v[5]-v[2]*v[4],
            v[5]*v[6]-v[3]*v[8], v[0]*v[8]-v[2]*v[6], v[2]*v[3]-v[0]*v[5],
            v[3]*v[7]-v[4]*v[6], v[1]*v[6]-v[0]*v[7], v[0]*v[4]-v[1]*v[3]
        ).multiply(inv);
        
        this.relativeOrientation.invert(this.b1.orientation);
        this.relativeOrientation.mul(this.targetOrientation,this.relativeOrientation);
        this.relativeOrientation.mul(this.b2.orientation,this.relativeOrientation);
        inv = this.relativeOrientation.s*2;

        this.vel.scale( this.relativeOrientation, inv );

        len = this.vel.length();

        if( len>0.02 ) {
            len = (0.02-len)/len*invTimeStep*0.05;
            this.vel.scaleEqual(len);
        }else{
            this.vel.init();
        }

        this.rn1.mulMat(this.ii1, this.imp);
        this.rn2.mulMat(this.ii2, this.imp);

        this.a1.addEqual(this.rn1);
        this.a2.subEqual(this.rn2);

    },

    solve: function () {

        var r = this.a2.clone().subEqual(this.a1).subEqual(this.vel);
        this.rn0.mulMat(this.dd, r);
        this.rn1.mulMat(this.ii1, this.rn0);
        this.rn2.mulMat(this.ii2, this.rn0);
        this.imp.addEqual(this.rn0);
        this.a1.addEqual(this.rn1);
        this.a2.subEqual(this.rn2);

    }

};