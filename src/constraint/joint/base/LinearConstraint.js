import { _Math } from '../../../math/Math';
import { Mat33 } from '../../../math/Mat33';

/**
* A linear constraint for all axes for various joints.
* @author saharan
*/
function LinearConstraint ( joint ){

    this.m1=NaN;
    this.m2=NaN;

    this.ii1 = null;
    this.ii2 = null;
    this.dd = null;

    this.r1x=NaN;
    this.r1y=NaN;
    this.r1z=NaN;

    this.r2x=NaN;
    this.r2y=NaN;
    this.r2z=NaN;

    this.ax1x=NaN;
    this.ax1y=NaN;
    this.ax1z=NaN;
    this.ay1x=NaN;
    this.ay1y=NaN;
    this.ay1z=NaN;
    this.az1x=NaN;
    this.az1y=NaN;
    this.az1z=NaN;

    this.ax2x=NaN;
    this.ax2y=NaN;
    this.ax2z=NaN;
    this.ay2x=NaN;
    this.ay2y=NaN;
    this.ay2z=NaN;
    this.az2x=NaN;
    this.az2y=NaN;
    this.az2z=NaN;

    this.vel=NaN;
    this.velx=NaN;
    this.vely=NaN;
    this.velz=NaN;


    this.joint = joint;
    this.r1 = joint.relativeAnchorPoint1;
    this.r2 = joint.relativeAnchorPoint2;
    this.p1 = joint.anchorPoint1;
    this.p2 = joint.anchorPoint2;
    this.b1 = joint.body1;
    this.b2 = joint.body2;
    this.l1 = this.b1.linearVelocity;
    this.l2 = this.b2.linearVelocity;
    this.a1 = this.b1.angularVelocity;
    this.a2 = this.b2.angularVelocity;
    this.i1 = this.b1.inverseInertia;
    this.i2 = this.b2.inverseInertia;
    this.impx = 0;
    this.impy = 0;
    this.impz = 0;

}

Object.assign( LinearConstraint.prototype, {

    LinearConstraint: true,

    preSolve: function ( timeStep, invTimeStep ) {
        
        this.r1x = this.r1.x;
        this.r1y = this.r1.y;
        this.r1z = this.r1.z;

        this.r2x = this.r2.x;
        this.r2y = this.r2.y;
        this.r2z = this.r2.z;

        this.m1 = this.b1.inverseMass;
        this.m2 = this.b2.inverseMass;

        this.ii1 = this.i1.clone();
        this.ii2 = this.i2.clone();

        var ii1 = this.ii1.elements;
        var ii2 = this.ii2.elements;

        this.ax1x = this.r1z*ii1[1]+-this.r1y*ii1[2];
        this.ax1y = this.r1z*ii1[4]+-this.r1y*ii1[5];
        this.ax1z = this.r1z*ii1[7]+-this.r1y*ii1[8];
        this.ay1x = -this.r1z*ii1[0]+this.r1x*ii1[2];
        this.ay1y = -this.r1z*ii1[3]+this.r1x*ii1[5];
        this.ay1z = -this.r1z*ii1[6]+this.r1x*ii1[8];
        this.az1x = this.r1y*ii1[0]+-this.r1x*ii1[1];
        this.az1y = this.r1y*ii1[3]+-this.r1x*ii1[4];
        this.az1z = this.r1y*ii1[6]+-this.r1x*ii1[7];
        this.ax2x = this.r2z*ii2[1]+-this.r2y*ii2[2];
        this.ax2y = this.r2z*ii2[4]+-this.r2y*ii2[5];
        this.ax2z = this.r2z*ii2[7]+-this.r2y*ii2[8];
        this.ay2x = -this.r2z*ii2[0]+this.r2x*ii2[2];
        this.ay2y = -this.r2z*ii2[3]+this.r2x*ii2[5];
        this.ay2z = -this.r2z*ii2[6]+this.r2x*ii2[8];
        this.az2x = this.r2y*ii2[0]+-this.r2x*ii2[1];
        this.az2y = this.r2y*ii2[3]+-this.r2x*ii2[4];
        this.az2z = this.r2y*ii2[6]+-this.r2x*ii2[7];

        // calculate point-to-point mass matrix
        // from impulse equation
        // 
        // M = ([/m] - [r^][/I][r^]) ^ -1
        // 
        // where
        // 
        // [/m] = |1/m, 0, 0|
        //        |0, 1/m, 0|
        //        |0, 0, 1/m|
        // 
        // [r^] = |0, -rz, ry|
        //        |rz, 0, -rx|
        //        |-ry, rx, 0|
        // 
        // [/I] = Inverted moment inertia

        var rxx = this.m1+this.m2;

        var kk = new Mat33().set( rxx, 0, 0,  0, rxx, 0,  0, 0, rxx );
        var k = kk.elements;

        k[0] += ii1[4]*this.r1z*this.r1z-(ii1[7]+ii1[5])*this.r1y*this.r1z+ii1[8]*this.r1y*this.r1y;
        k[1] += (ii1[6]*this.r1y+ii1[5]*this.r1x)*this.r1z-ii1[3]*this.r1z*this.r1z-ii1[8]*this.r1x*this.r1y;
        k[2] += (ii1[3]*this.r1y-ii1[4]*this.r1x)*this.r1z-ii1[6]*this.r1y*this.r1y+ii1[7]*this.r1x*this.r1y;
        k[3] += (ii1[2]*this.r1y+ii1[7]*this.r1x)*this.r1z-ii1[1]*this.r1z*this.r1z-ii1[8]*this.r1x*this.r1y;
        k[4] += ii1[0]*this.r1z*this.r1z-(ii1[6]+ii1[2])*this.r1x*this.r1z+ii1[8]*this.r1x*this.r1x;
        k[5] += (ii1[1]*this.r1x-ii1[0]*this.r1y)*this.r1z-ii1[7]*this.r1x*this.r1x+ii1[6]*this.r1x*this.r1y;
        k[6] += (ii1[1]*this.r1y-ii1[4]*this.r1x)*this.r1z-ii1[2]*this.r1y*this.r1y+ii1[5]*this.r1x*this.r1y;
        k[7] += (ii1[3]*this.r1x-ii1[0]*this.r1y)*this.r1z-ii1[5]*this.r1x*this.r1x+ii1[2]*this.r1x*this.r1y;
        k[8] += ii1[0]*this.r1y*this.r1y-(ii1[3]+ii1[1])*this.r1x*this.r1y+ii1[4]*this.r1x*this.r1x;

        k[0] += ii2[4]*this.r2z*this.r2z-(ii2[7]+ii2[5])*this.r2y*this.r2z+ii2[8]*this.r2y*this.r2y;
        k[1] += (ii2[6]*this.r2y+ii2[5]*this.r2x)*this.r2z-ii2[3]*this.r2z*this.r2z-ii2[8]*this.r2x*this.r2y;
        k[2] += (ii2[3]*this.r2y-ii2[4]*this.r2x)*this.r2z-ii2[6]*this.r2y*this.r2y+ii2[7]*this.r2x*this.r2y;
        k[3] += (ii2[2]*this.r2y+ii2[7]*this.r2x)*this.r2z-ii2[1]*this.r2z*this.r2z-ii2[8]*this.r2x*this.r2y;
        k[4] += ii2[0]*this.r2z*this.r2z-(ii2[6]+ii2[2])*this.r2x*this.r2z+ii2[8]*this.r2x*this.r2x;
        k[5] += (ii2[1]*this.r2x-ii2[0]*this.r2y)*this.r2z-ii2[7]*this.r2x*this.r2x+ii2[6]*this.r2x*this.r2y;
        k[6] += (ii2[1]*this.r2y-ii2[4]*this.r2x)*this.r2z-ii2[2]*this.r2y*this.r2y+ii2[5]*this.r2x*this.r2y;
        k[7] += (ii2[3]*this.r2x-ii2[0]*this.r2y)*this.r2z-ii2[5]*this.r2x*this.r2x+ii2[2]*this.r2x*this.r2y;
        k[8] += ii2[0]*this.r2y*this.r2y-(ii2[3]+ii2[1])*this.r2x*this.r2y+ii2[4]*this.r2x*this.r2x;

        var inv=1/( k[0]*(k[4]*k[8]-k[7]*k[5]) + k[3]*(k[7]*k[2]-k[1]*k[8]) + k[6]*(k[1]*k[5]-k[4]*k[2]) );
        this.dd = new Mat33().set(
            k[4]*k[8]-k[5]*k[7], k[2]*k[7]-k[1]*k[8], k[1]*k[5]-k[2]*k[4],
            k[5]*k[6]-k[3]*k[8], k[0]*k[8]-k[2]*k[6], k[2]*k[3]-k[0]*k[5],
            k[3]*k[7]-k[4]*k[6], k[1]*k[6]-k[0]*k[7], k[0]*k[4]-k[1]*k[3]
        ).scaleEqual( inv );

        this.velx = this.p2.x-this.p1.x;
        this.vely = this.p2.y-this.p1.y;
        this.velz = this.p2.z-this.p1.z;
        var len = _Math.sqrt(this.velx*this.velx+this.vely*this.vely+this.velz*this.velz);
        if(len>0.005){
            len = (0.005-len)/len*invTimeStep*0.05;
            this.velx *= len;
            this.vely *= len;
            this.velz *= len;
        }else{
            this.velx = 0;
            this.vely = 0;
            this.velz = 0;
        }

        this.impx *= 0.95;
        this.impy *= 0.95;
        this.impz *= 0.95;
        
        this.l1.x += this.impx*this.m1;
        this.l1.y += this.impy*this.m1;
        this.l1.z += this.impz*this.m1;
        this.a1.x += this.impx*this.ax1x+this.impy*this.ay1x+this.impz*this.az1x;
        this.a1.y += this.impx*this.ax1y+this.impy*this.ay1y+this.impz*this.az1y;
        this.a1.z += this.impx*this.ax1z+this.impy*this.ay1z+this.impz*this.az1z;
        this.l2.x -= this.impx*this.m2;
        this.l2.y -= this.impy*this.m2;
        this.l2.z -= this.impz*this.m2;
        this.a2.x -= this.impx*this.ax2x+this.impy*this.ay2x+this.impz*this.az2x;
        this.a2.y -= this.impx*this.ax2y+this.impy*this.ay2y+this.impz*this.az2y;
        this.a2.z -= this.impx*this.ax2z+this.impy*this.ay2z+this.impz*this.az2z;
    },

    solve: function () {

        var d = this.dd.elements;
        var rvx = this.l2.x-this.l1.x+this.a2.y*this.r2z-this.a2.z*this.r2y-this.a1.y*this.r1z+this.a1.z*this.r1y-this.velx;
        var rvy = this.l2.y-this.l1.y+this.a2.z*this.r2x-this.a2.x*this.r2z-this.a1.z*this.r1x+this.a1.x*this.r1z-this.vely;
        var rvz = this.l2.z-this.l1.z+this.a2.x*this.r2y-this.a2.y*this.r2x-this.a1.x*this.r1y+this.a1.y*this.r1x-this.velz;
        var nimpx = rvx*d[0]+rvy*d[1]+rvz*d[2];
        var nimpy = rvx*d[3]+rvy*d[4]+rvz*d[5];
        var nimpz = rvx*d[6]+rvy*d[7]+rvz*d[8];
        this.impx += nimpx;
        this.impy += nimpy;
        this.impz += nimpz;
        this.l1.x += nimpx*this.m1;
        this.l1.y += nimpy*this.m1;
        this.l1.z += nimpz*this.m1;
        this.a1.x += nimpx*this.ax1x+nimpy*this.ay1x+nimpz*this.az1x;
        this.a1.y += nimpx*this.ax1y+nimpy*this.ay1y+nimpz*this.az1y;
        this.a1.z += nimpx*this.ax1z+nimpy*this.ay1z+nimpz*this.az1z;
        this.l2.x -= nimpx*this.m2;
        this.l2.y -= nimpy*this.m2;
        this.l2.z -= nimpz*this.m2;
        this.a2.x -= nimpx*this.ax2x+nimpy*this.ay2x+nimpz*this.az2x;
        this.a2.y -= nimpx*this.ax2y+nimpy*this.ay2y+nimpz*this.az2y;
        this.a2.z -= nimpx*this.ax2z+nimpy*this.ay2z+nimpz*this.az2z;

    }

} );

export { LinearConstraint };