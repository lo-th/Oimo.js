OIMO.AngularConstraint = function(joint,targetOrientation){
    this.i1e00=NaN;
    this.i1e01=NaN;
    this.i1e02=NaN;
    this.i1e10=NaN;
    this.i1e11=NaN;
    this.i1e12=NaN;
    this.i1e20=NaN;
    this.i1e21=NaN;
    this.i1e22=NaN;
    this.i2e00=NaN;
    this.i2e01=NaN;
    this.i2e02=NaN;
    this.i2e10=NaN;
    this.i2e11=NaN;
    this.i2e12=NaN;
    this.i2e20=NaN;
    this.i2e21=NaN;
    this.i2e22=NaN;
    this.d00=NaN;
    this.d01=NaN;
    this.d02=NaN;
    this.d10=NaN;
    this.d11=NaN;
    this.d12=NaN;
    this.d20=NaN;
    this.d21=NaN;
    this.d22=NaN;
    this.ax=NaN;
    this.ay=NaN;
    this.az=NaN;
    this.velx=NaN;
    this.vely=NaN;
    this.velz=NaN;

    this.joint=joint;
    this.targetOrientation=new OIMO.Quat().invert(targetOrientation);
    this.relativeOrientation=new OIMO.Quat();
    this.b1=joint.body1;
    this.b2=joint.body2;
    this.a1=this.b1.angularVelocity;
    this.a2=this.b2.angularVelocity;
    this.i1=this.b1.inverseInertia;
    this.i2=this.b2.inverseInertia;
    this.impx=0;
    this.impy=0;
    this.impz=0;
}
OIMO.AngularConstraint.prototype = {
    constructor: OIMO.AngularConstraint,

    preSolve:function(timeStep,invTimeStep){
        var ti1 = this.i1.elements;
        var ti2 = this.i2.elements;
        this.i1e00=ti1[0];
        this.i1e01=ti1[1];
        this.i1e02=ti1[2];
        this.i1e10=ti1[3];
        this.i1e11=ti1[4];
        this.i1e12=ti1[5];
        this.i1e20=ti1[6];
        this.i1e21=ti1[7];
        this.i1e22=ti1[8];

        this.i2e00=ti2[0];
        this.i2e01=ti2[1];
        this.i2e02=ti2[2];
        this.i2e10=ti2[3];
        this.i2e11=ti2[4];
        this.i2e12=ti2[5];
        this.i2e20=ti2[6];
        this.i2e21=ti2[7];
        this.i2e22=ti2[8];

        var v00=this.i1e00+this.i2e00;
        var v01=this.i1e01+this.i2e01;
        var v02=this.i1e02+this.i2e02;
        var v10=this.i1e10+this.i2e10;
        var v11=this.i1e11+this.i2e11;
        var v12=this.i1e12+this.i2e12;
        var v20=this.i1e20+this.i2e20;
        var v21=this.i1e21+this.i2e21;
        var v22=this.i1e22+this.i2e22;
        var inv=1/(
        v00*(v11*v22-v21*v12)+
        v10*(v21*v02-v01*v22)+
        v20*(v01*v12-v11*v02)
        );
        this.d00=(v11*v22-v12*v21)*inv;
        this.d01=(v02*v21-v01*v22)*inv;
        this.d02=(v01*v12-v02*v11)*inv;
        this.d10=(v12*v20-v10*v22)*inv;
        this.d11=(v00*v22-v02*v20)*inv;
        this.d12=(v02*v10-v00*v12)*inv;
        this.d20=(v10*v21-v11*v20)*inv;
        this.d21=(v01*v20-v00*v21)*inv;
        this.d22=(v00*v11-v01*v10)*inv;
        this.relativeOrientation.invert(this.b1.orientation);
        this.relativeOrientation.mul(this.targetOrientation,this.relativeOrientation);
        this.relativeOrientation.mul(this.b2.orientation,this.relativeOrientation);
        inv=this.relativeOrientation.s*2;
        this.velx=this.relativeOrientation.x*inv;
        this.vely=this.relativeOrientation.y*inv;
        this.velz=this.relativeOrientation.z*inv;
        var len=Math.sqrt(this.velx*this.velx+this.vely*this.vely+this.velz*this.velz);
        if(len>0.02){
        len=(0.02-len)/len*invTimeStep*0.05;
        this.velx*=len;
        this.vely*=len;
        this.velz*=len;
        }else{
        this.velx=0;
        this.vely=0;
        this.velz=0;
        }
        this.a1.x+=this.impx*this.i1e00+this.impy*this.i1e01+this.impz*this.i1e02;
        this.a1.y+=this.impx*this.i1e10+this.impy*this.i1e11+this.impz*this.i1e12;
        this.a1.z+=this.impx*this.i1e20+this.impy*this.i1e21+this.impz*this.i1e22;
        this.a2.x-=this.impx*this.i2e00+this.impy*this.i2e01+this.impz*this.i2e02;
        this.a2.y-=this.impx*this.i2e10+this.impy*this.i2e11+this.impz*this.i2e12;
        this.a2.z-=this.impx*this.i2e20+this.impy*this.i2e21+this.impz*this.i2e22;
    },
    solve:function(){
        var rvx=this.a2.x-this.a1.x-this.velx;
        var rvy=this.a2.y-this.a1.y-this.vely;
        var rvz=this.a2.z-this.a1.z-this.velz;
        var nimpx=rvx*this.d00+rvy*this.d01+rvz*this.d02;
        var nimpy=rvx*this.d10+rvy*this.d11+rvz*this.d12;
        var nimpz=rvx*this.d20+rvy*this.d21+rvz*this.d22;
        this.impx+=nimpx;
        this.impy+=nimpy;
        this.impz+=nimpz;
        this.a1.x+=nimpx*this.i1e00+nimpy*this.i1e01+nimpz*this.i1e02;
        this.a1.y+=nimpx*this.i1e10+nimpy*this.i1e11+nimpz*this.i1e12;
        this.a1.z+=nimpx*this.i1e20+nimpy*this.i1e21+nimpz*this.i1e22;
        this.a2.x-=nimpx*this.i2e00+nimpy*this.i2e01+nimpz*this.i2e02;
        this.a2.y-=nimpx*this.i2e10+nimpy*this.i2e11+nimpz*this.i2e12;
        this.a2.z-=nimpx*this.i2e20+nimpy*this.i2e21+nimpz*this.i2e22;
    }
}