/**
* An angular constraint for all axes for various joints.
* @author saharan
*/
OIMO.AngularConstraint = function(joint, targetOrientation){

    this.ii1 = null;
    this.ii2 = null;
    this.dd = null;

    this.ax = NaN;
    this.ay = NaN;
    this.az = NaN;
    this.velx = NaN;
    this.vely = NaN;
    this.velz = NaN;

    this.joint = joint;
    this.targetOrientation = new OIMO.Quat().invert(targetOrientation);
    this.relativeOrientation = new OIMO.Quat();
    this.b1 = joint.body1;
    this.b2 = joint.body2;
    this.a1 = this.b1.angularVelocity;
    this.a2 = this.b2.angularVelocity;
    this.i1 = this.b1.inverseInertia;
    this.i2 = this.b2.inverseInertia;
    this.impx = 0;
    this.impy = 0;
    this.impz = 0;
}
OIMO.AngularConstraint.prototype = {
    constructor: OIMO.AngularConstraint,

    preSolve:function(timeStep,invTimeStep){

        this.ii1 = this.i1.clone();
        this.ii2 = this.i2.clone();

        var vv = new OIMO.Mat33().add(this.ii1, this.ii2);

        var v = vv.elements;
        var inv = 1/( v[0]*(v[4]*v[8]-v[7]*v[5])  +  v[3]*(v[7]*v[2]-v[1]*v[8])  +  v[6]*(v[1]*v[5]-v[4]*v[2]) );
        this.dd = new OIMO.Mat33(
            v[4]*v[8]-v[5]*v[7], v[2]*v[7]-v[1]*v[8], v[1]*v[5]-v[2]*v[4],
            v[5]*v[6]-v[3]*v[8], v[0]*v[8]-v[2]*v[6], v[2]*v[3]-v[0]*v[5],
            v[3]*v[7]-v[4]*v[6], v[1]*v[6]-v[0]*v[7], v[0]*v[4]-v[1]*v[3]
        ).multiply(inv);
        
        this.relativeOrientation.invert(this.b1.orientation);// error = b2 - b1 - target
        this.relativeOrientation.mul(this.targetOrientation,this.relativeOrientation);
        this.relativeOrientation.mul(this.b2.orientation,this.relativeOrientation);
        inv = this.relativeOrientation.s*2;
        this.velx = this.relativeOrientation.x*inv;
        this.vely = this.relativeOrientation.y*inv;
        this.velz = this.relativeOrientation.z*inv;
        var len = OIMO.sqrt(this.velx*this.velx+this.vely*this.vely+this.velz*this.velz);
        if(len>0.02){
            len = (0.02-len)/len*invTimeStep*0.05;
            this.velx *= len;
            this.vely *= len;
            this.velz *= len;
        }else{
            this.velx = 0;
            this.vely = 0;
            this.velz = 0;
        }

        var ii1 = this.ii1.elements;
        var ii2 = this.ii2.elements;

        this.a1.x += this.impx*ii1[0]+this.impy*ii1[1]+this.impz*ii1[2];
        this.a1.y += this.impx*ii1[3]+this.impy*ii1[4]+this.impz*ii1[5];
        this.a1.z += this.impx*ii1[6]+this.impy*ii1[7]+this.impz*ii1[8];
        this.a2.x -= this.impx*ii2[0]+this.impy*ii2[1]+this.impz*ii2[2];
        this.a2.y -= this.impx*ii2[3]+this.impy*ii2[4]+this.impz*ii2[5];
        this.a2.z -= this.impx*ii2[6]+this.impy*ii2[7]+this.impz*ii2[8];
    },
    solve:function(){
        var d = this.dd.elements;
        var ii1 = this.ii1.elements;
        var ii2 = this.ii2.elements;
        var rvx = this.a2.x-this.a1.x-this.velx;
        var rvy = this.a2.y-this.a1.y-this.vely;
        var rvz = this.a2.z-this.a1.z-this.velz;
        var nimpx = rvx*d[0]+rvy*d[1]+rvz*d[2];
        var nimpy = rvx*d[3]+rvy*d[4]+rvz*d[5];
        var nimpz = rvx*d[6]+rvy*d[7]+rvz*d[8];
        this.impx += nimpx;
        this.impy += nimpy;
        this.impz += nimpz;
        this.a1.x += nimpx*ii1[0]+nimpy*ii1[1]+nimpz*ii1[2];
        this.a1.y += nimpx*ii1[3]+nimpy*ii1[4]+nimpz*ii1[5];
        this.a1.z += nimpx*ii1[6]+nimpy*ii1[7]+nimpz*ii1[8];
        this.a2.x -= nimpx*ii2[0]+nimpy*ii2[1]+nimpz*ii2[2];
        this.a2.y -= nimpx*ii2[3]+nimpy*ii2[4]+nimpz*ii2[5];
        this.a2.z -= nimpx*ii2[6]+nimpy*ii2[7]+nimpz*ii2[8];
    }
}