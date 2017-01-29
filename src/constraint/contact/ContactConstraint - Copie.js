import { Constraint } from '../Constraint';
import { ContactPointDataBuffer } from './ContactPointDataBuffer';
import { Vec3 } from '../../math/Vec3';
import { _Math } from '../../math/Math';

/**
* ...
* @author saharan
*/
function ContactConstraint ( manifold ){
    
    Constraint.call( this );
    // The contact manifold of the constraint.
    this.manifold = manifold;
    // The coefficient of restitution of the constraint.
    this.restitution=NaN;
    // The coefficient of friction of the constraint.
    this.friction=NaN;
    this.p1=null;
    this.p2=null;
    this.lv1=null;
    this.lv2=null;
    this.av1=null;
    this.av2=null;
    this.i1=null;
    this.i2=null;

    this.ii1 = null;
    this.ii2 = null;

    this.m1=NaN;
    this.m2=NaN;
    this.num=0;
    
    this.ps = manifold.points;
    this.cs = new ContactPointDataBuffer();
    this.cs.next = new ContactPointDataBuffer();
    this.cs.next.next = new ContactPointDataBuffer();
    this.cs.next.next.next = new ContactPointDataBuffer();
}

ContactConstraint.prototype = Object.create( Constraint.prototype );
ContactConstraint.prototype.constructor = ContactConstraint;
/**
* Attach the constraint to the bodies.
*/
ContactConstraint.prototype.attach = function(){

    this.p1=this.body1.position;
    this.p2=this.body2.position;
    this.lv1=this.body1.linearVelocity;
    this.av1=this.body1.angularVelocity;
    this.lv2=this.body2.linearVelocity;
    this.av2=this.body2.angularVelocity;
    this.i1=this.body1.inverseInertia;
    this.i2=this.body2.inverseInertia;

}
/**
* Detach the constraint from the bodies.
*/
ContactConstraint.prototype.detach = function(){

    this.p1=null;
    this.p2=null;
    this.lv1=null;
    this.lv2=null;
    this.av1=null;
    this.av2=null;
    this.i1=null;
    this.i2=null;

}

ContactConstraint.prototype.preSolve = function( timeStep, invTimeStep ){

    this.m1 = this.body1.inverseMass;
    this.m2 = this.body2.inverseMass;

    this.ii1 = this.i1.clone();
    this.ii2 = this.i2.clone();

    var ii1 = this.ii1.elements;
    var ii2 = this.ii2.elements;

    var p1x=this.p1.x;
    var p1y=this.p1.y;
    var p1z=this.p1.z;
    var p2x=this.p2.x;
    var p2y=this.p2.y;
    var p2z=this.p2.z;

    var m1m2 = this.m1+this.m2;

    this.num = this.manifold.numPoints;

    var c = this.cs;

    for( var i=0; i < this.num; i++ ){

        var p = this.ps[i];
        var tmp1X;
        var tmp1Y;
        var tmp1Z;
        var tmp2X;
        var tmp2Y;
        var tmp2Z;
        tmp1X=p.position.x;
        tmp1Y=p.position.y;
        tmp1Z=p.position.z;
        var rp1X=tmp1X-p1x;
        var rp1Y=tmp1Y-p1y;
        var rp1Z=tmp1Z-p1z;
        var rp2X=tmp1X-p2x;
        var rp2Y=tmp1Y-p2y;
        var rp2Z=tmp1Z-p2z;
        c.rp1X=rp1X;
        c.rp1Y=rp1Y;
        c.rp1Z=rp1Z;
        c.rp2X=rp2X;
        c.rp2Y=rp2Y;
        c.rp2Z=rp2Z;
        c.norImp=p.normalImpulse;
        c.tanImp=p.tangentImpulse;
        c.binImp=p.binormalImpulse;
        var norX=p.normal.x;
        var norY=p.normal.y;
        var norZ=p.normal.z;
        var rvX=(this.lv2.x+this.av2.y*rp2Z-this.av2.z*rp2Y)-(this.lv1.x+this.av1.y*rp1Z-this.av1.z*rp1Y);
        var rvY=(this.lv2.y+this.av2.z*rp2X-this.av2.x*rp2Z)-(this.lv1.y+this.av1.z*rp1X-this.av1.x*rp1Z);
        var rvZ=(this.lv2.z+this.av2.x*rp2Y-this.av2.y*rp2X)-(this.lv1.z+this.av1.x*rp1Y-this.av1.y*rp1X);
        var rvn=norX*rvX+norY*rvY+norZ*rvZ;
        var tanX=rvX-rvn*norX;
        var tanY=rvY-rvn*norY;
        var tanZ=rvZ-rvn*norZ;
        var len=tanX*tanX+tanY*tanY+tanZ*tanZ;
        if(len>0.04){
            len=1/_Math.sqrt(len);
        }else{
            tanX=norY*norX-norZ*norZ;
            tanY=-norZ*norY-norX*norX;
            tanZ=norX*norZ+norY*norY;
            len=1/_Math.sqrt(tanX*tanX+tanY*tanY+tanZ*tanZ);
        }
        tanX*=len;
        tanY*=len;
        tanZ*=len;
        var binX=norY*tanZ-norZ*tanY;
        var binY=norZ*tanX-norX*tanZ;
        var binZ=norX*tanY-norY*tanX;
        c.norX=norX;
        c.norY=norY;
        c.norZ=norZ;
        c.tanX=tanX;
        c.tanY=tanY;
        c.tanZ=tanZ;
        c.binX=binX;
        c.binY=binY;
        c.binZ=binZ;
        c.norU1X=norX*this.m1;
        c.norU1Y=norY*this.m1;
        c.norU1Z=norZ*this.m1;
        c.norU2X=norX*this.m2;
        c.norU2Y=norY*this.m2;
        c.norU2Z=norZ*this.m2;
        c.tanU1X=tanX*this.m1;
        c.tanU1Y=tanY*this.m1;
        c.tanU1Z=tanZ*this.m1;
        c.tanU2X=tanX*this.m2;
        c.tanU2Y=tanY*this.m2;
        c.tanU2Z=tanZ*this.m2;
        c.binU1X=binX*this.m1;
        c.binU1Y=binY*this.m1;
        c.binU1Z=binZ*this.m1;
        c.binU2X=binX*this.m2;
        c.binU2Y=binY*this.m2;
        c.binU2Z=binZ*this.m2;
        var norT1X=rp1Y*norZ-rp1Z*norY;
        var norT1Y=rp1Z*norX-rp1X*norZ;
        var norT1Z=rp1X*norY-rp1Y*norX;
        var norT2X=rp2Y*norZ-rp2Z*norY;
        var norT2Y=rp2Z*norX-rp2X*norZ;
        var norT2Z=rp2X*norY-rp2Y*norX;
        var tanT1X=rp1Y*tanZ-rp1Z*tanY;
        var tanT1Y=rp1Z*tanX-rp1X*tanZ;
        var tanT1Z=rp1X*tanY-rp1Y*tanX;
        var tanT2X=rp2Y*tanZ-rp2Z*tanY;
        var tanT2Y=rp2Z*tanX-rp2X*tanZ;
        var tanT2Z=rp2X*tanY-rp2Y*tanX;
        var binT1X=rp1Y*binZ-rp1Z*binY;
        var binT1Y=rp1Z*binX-rp1X*binZ;
        var binT1Z=rp1X*binY-rp1Y*binX;
        var binT2X=rp2Y*binZ-rp2Z*binY;
        var binT2Y=rp2Z*binX-rp2X*binZ;
        var binT2Z=rp2X*binY-rp2Y*binX;
        var norTU1X=norT1X*ii1[0]+norT1Y*ii1[1]+norT1Z*ii1[2];
        var norTU1Y=norT1X*ii1[3]+norT1Y*ii1[4]+norT1Z*ii1[5];
        var norTU1Z=norT1X*ii1[6]+norT1Y*ii1[7]+norT1Z*ii1[8];
        var norTU2X=norT2X*ii2[0]+norT2Y*ii2[1]+norT2Z*ii2[2];
        var norTU2Y=norT2X*ii2[3]+norT2Y*ii2[4]+norT2Z*ii2[5];
        var norTU2Z=norT2X*ii2[6]+norT2Y*ii2[7]+norT2Z*ii2[8];
        var tanTU1X=tanT1X*ii1[0]+tanT1Y*ii1[1]+tanT1Z*ii1[2];
        var tanTU1Y=tanT1X*ii1[3]+tanT1Y*ii1[4]+tanT1Z*ii1[5];
        var tanTU1Z=tanT1X*ii1[6]+tanT1Y*ii1[7]+tanT1Z*ii1[8];
        var tanTU2X=tanT2X*ii2[0]+tanT2Y*ii2[1]+tanT2Z*ii2[2];
        var tanTU2Y=tanT2X*ii2[3]+tanT2Y*ii2[4]+tanT2Z*ii2[5];
        var tanTU2Z=tanT2X*ii2[6]+tanT2Y*ii2[7]+tanT2Z*ii2[8];
        var binTU1X=binT1X*ii1[0]+binT1Y*ii1[1]+binT1Z*ii1[2];
        var binTU1Y=binT1X*ii1[3]+binT1Y*ii1[4]+binT1Z*ii1[5];
        var binTU1Z=binT1X*ii1[6]+binT1Y*ii1[7]+binT1Z*ii1[8];
        var binTU2X=binT2X*ii2[0]+binT2Y*ii2[1]+binT2Z*ii2[2];
        var binTU2Y=binT2X*ii2[3]+binT2Y*ii2[4]+binT2Z*ii2[5];
        var binTU2Z=binT2X*ii2[6]+binT2Y*ii2[7]+binT2Z*ii2[8];
        c.norT1X=norT1X;
        c.norT1Y=norT1Y;
        c.norT1Z=norT1Z;
        c.tanT1X=tanT1X;
        c.tanT1Y=tanT1Y;
        c.tanT1Z=tanT1Z;
        c.binT1X=binT1X;
        c.binT1Y=binT1Y;
        c.binT1Z=binT1Z;
        c.norT2X=norT2X;
        c.norT2Y=norT2Y;
        c.norT2Z=norT2Z;
        c.tanT2X=tanT2X;
        c.tanT2Y=tanT2Y;
        c.tanT2Z=tanT2Z;
        c.binT2X=binT2X;
        c.binT2Y=binT2Y;
        c.binT2Z=binT2Z;
        c.norTU1X=norTU1X;
        c.norTU1Y=norTU1Y;
        c.norTU1Z=norTU1Z;
        c.tanTU1X=tanTU1X;
        c.tanTU1Y=tanTU1Y;
        c.tanTU1Z=tanTU1Z;
        c.binTU1X=binTU1X;
        c.binTU1Y=binTU1Y;
        c.binTU1Z=binTU1Z;
        c.norTU2X=norTU2X;
        c.norTU2Y=norTU2Y;
        c.norTU2Z=norTU2Z;
        c.tanTU2X=tanTU2X;
        c.tanTU2Y=tanTU2Y;
        c.tanTU2Z=tanTU2Z;
        c.binTU2X=binTU2X;
        c.binTU2Y=binTU2Y;
        c.binTU2Z=binTU2Z;
        tmp1X=norT1X*ii1[0]+norT1Y*ii1[1]+norT1Z*ii1[2];
        tmp1Y=norT1X*ii1[3]+norT1Y*ii1[4]+norT1Z*ii1[5];
        tmp1Z=norT1X*ii1[6]+norT1Y*ii1[7]+norT1Z*ii1[8];
        tmp2X=tmp1Y*rp1Z-tmp1Z*rp1Y;
        tmp2Y=tmp1Z*rp1X-tmp1X*rp1Z;
        tmp2Z=tmp1X*rp1Y-tmp1Y*rp1X;
        tmp1X=norT2X*ii2[0]+norT2Y*ii2[1]+norT2Z*ii2[2];
        tmp1Y=norT2X*ii2[3]+norT2Y*ii2[4]+norT2Z*ii2[5];
        tmp1Z=norT2X*ii2[6]+norT2Y*ii2[7]+norT2Z*ii2[8];
        tmp2X+=tmp1Y*rp2Z-tmp1Z*rp2Y;
        tmp2Y+=tmp1Z*rp2X-tmp1X*rp2Z;
        tmp2Z+=tmp1X*rp2Y-tmp1Y*rp2X;
        var norDen=1/(m1m2+norX*tmp2X+norY*tmp2Y+norZ*tmp2Z);
        tmp1X=tanT1X*ii1[0]+tanT1Y*ii1[1]+tanT1Z*ii1[2];
        tmp1Y=tanT1X*ii1[3]+tanT1Y*ii1[4]+tanT1Z*ii1[5];
        tmp1Z=tanT1X*ii1[6]+tanT1Y*ii1[7]+tanT1Z*ii1[8];
        tmp2X=tmp1Y*rp1Z-tmp1Z*rp1Y;
        tmp2Y=tmp1Z*rp1X-tmp1X*rp1Z;
        tmp2Z=tmp1X*rp1Y-tmp1Y*rp1X;
        tmp1X=tanT2X*ii2[0]+tanT2Y*ii2[1]+tanT2Z*ii2[2];
        tmp1Y=tanT2X*ii2[3]+tanT2Y*ii2[4]+tanT2Z*ii2[5];
        tmp1Z=tanT2X*ii2[6]+tanT2Y*ii2[7]+tanT2Z*ii2[8];
        tmp2X+=tmp1Y*rp2Z-tmp1Z*rp2Y;
        tmp2Y+=tmp1Z*rp2X-tmp1X*rp2Z;
        tmp2Z+=tmp1X*rp2Y-tmp1Y*rp2X;
        var tanDen=1/(m1m2+tanX*tmp2X+tanY*tmp2Y+tanZ*tmp2Z);
        tmp1X=binT1X*ii1[0]+binT1Y*ii1[1]+binT1Z*ii1[2];
        tmp1Y=binT1X*ii1[3]+binT1Y*ii1[4]+binT1Z*ii1[5];
        tmp1Z=binT1X*ii1[6]+binT1Y*ii1[7]+binT1Z*ii1[8];
        tmp2X=tmp1Y*rp1Z-tmp1Z*rp1Y;
        tmp2Y=tmp1Z*rp1X-tmp1X*rp1Z;
        tmp2Z=tmp1X*rp1Y-tmp1Y*rp1X;
        tmp1X=binT2X*ii2[0]+binT2Y*ii2[1]+binT2Z*ii2[2];
        tmp1Y=binT2X*ii2[3]+binT2Y*ii2[4]+binT2Z*ii2[5];
        tmp1Z=binT2X*ii2[6]+binT2Y*ii2[7]+binT2Z*ii2[8];
        tmp2X+=tmp1Y*rp2Z-tmp1Z*rp2Y;
        tmp2Y+=tmp1Z*rp2X-tmp1X*rp2Z;
        tmp2Z+=tmp1X*rp2Y-tmp1Y*rp2X;
        var binDen=1/(m1m2+binX*tmp2X+binY*tmp2Y+binZ*tmp2Z);
        c.norDen=norDen;
        c.tanDen=tanDen;
        c.binDen=binDen;


        if( p.warmStarted ){
            var norImp=p.normalImpulse;
            this.lv1.x+=c.norU1X*norImp;
            this.lv1.y+=c.norU1Y*norImp;
            this.lv1.z+=c.norU1Z*norImp;
            this.av1.x+=norTU1X*norImp;
            this.av1.y+=norTU1Y*norImp;
            this.av1.z+=norTU1Z*norImp;
            this.lv2.x-=c.norU2X*norImp;
            this.lv2.y-=c.norU2Y*norImp;
            this.lv2.z-=c.norU2Z*norImp;
            this.av2.x-=norTU2X*norImp;
            this.av2.y-=norTU2Y*norImp;
            this.av2.z-=norTU2Z*norImp;
            c.norImp=norImp;
            c.tanImp=0;
            c.binImp=0;
            rvn=0; // disable bouncing
        }else{
            c.norImp=0;
            c.tanImp=0;
            c.binImp=0;
        }

        if(rvn>-1){
            rvn=0; // disable bouncing
        }
        var norTar=this.restitution*-rvn;
        var sepV=-(p.penetration+0.005)*invTimeStep*0.05; // allow 0.5cm error
        if(norTar<sepV) norTar=sepV;
        c.norTar=norTar;
        c.last = i==this.num-1;
        c = c.next;
    }
}

ContactConstraint.prototype.solve = function(){
    var lv1x=this.lv1.x;
    var lv1y=this.lv1.y;
    var lv1z=this.lv1.z;
    var lv2x=this.lv2.x;
    var lv2y=this.lv2.y;
    var lv2z=this.lv2.z;
    var av1x=this.av1.x;
    var av1y=this.av1.y;
    var av1z=this.av1.z;
    var av2x=this.av2.x;
    var av2y=this.av2.y;
    var av2z=this.av2.z;
    var c=this.cs;
    while(true){
        var oldImp1;
        var newImp1;
        var oldImp2;
        var newImp2;
        var rvn;
        var norImp=c.norImp;
        var tanImp=c.tanImp;
        var binImp=c.binImp;
        var max=-norImp*this.friction;
        var rvX=lv2x-lv1x;
        var rvY=lv2y-lv1y;
        var rvZ=lv2z-lv1z;
        rvn=
        rvX*c.tanX+rvY*c.tanY+rvZ*c.tanZ+
        av2x*c.tanT2X+av2y*c.tanT2Y+av2z*c.tanT2Z-
        av1x*c.tanT1X-av1y*c.tanT1Y-av1z*c.tanT1Z
        ;
        oldImp1=tanImp;
        newImp1=rvn*c.tanDen;
        tanImp+=newImp1;
        rvn=
        rvX*c.binX+rvY*c.binY+rvZ*c.binZ+
        av2x*c.binT2X+av2y*c.binT2Y+av2z*c.binT2Z-
        av1x*c.binT1X-av1y*c.binT1Y-av1z*c.binT1Z
        ;
        oldImp2=binImp;
        newImp2=rvn*c.binDen;
        binImp+=newImp2;

        // cone friction clamp
        var len=tanImp*tanImp+binImp*binImp;
        if(len>max*max){
            len=max/_Math.sqrt(len);
            tanImp*=len;
            binImp*=len;
        }
        newImp1=tanImp-oldImp1;
        newImp2=binImp-oldImp2;

        lv1x+=c.tanU1X*newImp1+c.binU1X*newImp2;
        lv1y+=c.tanU1Y*newImp1+c.binU1Y*newImp2;
        lv1z+=c.tanU1Z*newImp1+c.binU1Z*newImp2;
        av1x+=c.tanTU1X*newImp1+c.binTU1X*newImp2;
        av1y+=c.tanTU1Y*newImp1+c.binTU1Y*newImp2;
        av1z+=c.tanTU1Z*newImp1+c.binTU1Z*newImp2;
        lv2x-=c.tanU2X*newImp1+c.binU2X*newImp2;
        lv2y-=c.tanU2Y*newImp1+c.binU2Y*newImp2;
        lv2z-=c.tanU2Z*newImp1+c.binU2Z*newImp2;
        av2x-=c.tanTU2X*newImp1+c.binTU2X*newImp2;
        av2y-=c.tanTU2Y*newImp1+c.binTU2Y*newImp2;
        av2z-=c.tanTU2Z*newImp1+c.binTU2Z*newImp2;

        // restitution part
        rvn=
        (lv2x-lv1x)*c.norX+(lv2y-lv1y)*c.norY+(lv2z-lv1z)*c.norZ+
        av2x*c.norT2X+av2y*c.norT2Y+av2z*c.norT2Z-
        av1x*c.norT1X-av1y*c.norT1Y-av1z*c.norT1Z;

        oldImp1=norImp;
        newImp1=(rvn-c.norTar)*c.norDen;
        norImp+=newImp1;
        if(norImp>0)norImp=0;
        newImp1=norImp-oldImp1;
        lv1x+=c.norU1X*newImp1;
        lv1y+=c.norU1Y*newImp1;
        lv1z+=c.norU1Z*newImp1;
        av1x+=c.norTU1X*newImp1;
        av1y+=c.norTU1Y*newImp1;
        av1z+=c.norTU1Z*newImp1;
        lv2x-=c.norU2X*newImp1;
        lv2y-=c.norU2Y*newImp1;
        lv2z-=c.norU2Z*newImp1;
        av2x-=c.norTU2X*newImp1;
        av2y-=c.norTU2Y*newImp1;
        av2z-=c.norTU2Z*newImp1;

        c.norImp=norImp;
        c.tanImp=tanImp;
        c.binImp=binImp;

        if(c.last)break;
        c=c.next;
    }
    this.lv1.x=lv1x;
    this.lv1.y=lv1y;
    this.lv1.z=lv1z;
    this.lv2.x=lv2x;
    this.lv2.y=lv2y;
    this.lv2.z=lv2z;
    this.av1.x=av1x;
    this.av1.y=av1y;
    this.av1.z=av1z;
    this.av2.x=av2x;
    this.av2.y=av2y;
    this.av2.z=av2z;
}

ContactConstraint.prototype.postSolve = function(){
    var c=this.cs;
    var i = this.num;
    while(i--){
    //for(var i=0;i<this.num;i++){
        var p=this.ps[i];
        p.normal.x=c.norX;
        p.normal.y=c.norY;
        p.normal.z=c.norZ;
        p.tangent.x=c.tanX;
        p.tangent.y=c.tanY;
        p.tangent.z=c.tanZ;
        p.binormal.x=c.binX;
        p.binormal.y=c.binY;
        p.binormal.z=c.binZ;
        p.normalImpulse=c.norImp;
        p.tangentImpulse=c.tanImp;
        p.binormalImpulse=c.binImp;
        p.normalDenominator=c.norDen;
        p.tangentDenominator=c.tanDen;
        p.binormalDenominator=c.binDen;
        c=c.next;
    }
}

export { ContactConstraint };