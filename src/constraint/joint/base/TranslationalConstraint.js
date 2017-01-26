/**
* A translational constraint for various joints.
* @author saharan
*/
function TranslationalConstraint ( joint, limitMotor ){
    this.cfm=NaN;
    this.m1=NaN;
    this.m2=NaN;
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
    this.motorDenom=NaN;
    this.invMotorDenom=NaN;
    this.invDenom=NaN;
    this.ax=NaN;
    this.ay=NaN;
    this.az=NaN;
    this.r1x=NaN;
    this.r1y=NaN;
    this.r1z=NaN;
    this.r2x=NaN;
    this.r2y=NaN;
    this.r2z=NaN;
    this.t1x=NaN;
    this.t1y=NaN;
    this.t1z=NaN;
    this.t2x=NaN;
    this.t2y=NaN;
    this.t2z=NaN;
    this.l1x=NaN;
    this.l1y=NaN;
    this.l1z=NaN;
    this.l2x=NaN;
    this.l2y=NaN;
    this.l2z=NaN;
    this.a1x=NaN;
    this.a1y=NaN;
    this.a1z=NaN;
    this.a2x=NaN;
    this.a2y=NaN;
    this.a2z=NaN;
    this.lowerLimit=NaN;
    this.upperLimit=NaN;
    this.limitVelocity=NaN;
    this.limitState=0; // -1: at lower, 0: locked, 1: at upper, 2: free
    this.enableMotor=false;
    this.motorSpeed=NaN;
    this.maxMotorForce=NaN;
    this.maxMotorImpulse=NaN;

    this.limitMotor=limitMotor;
    this.b1=joint.body1;
    this.b2=joint.body2;
    this.p1=joint.anchorPoint1;
    this.p2=joint.anchorPoint2;
    this.r1=joint.relativeAnchorPoint1;
    this.r2=joint.relativeAnchorPoint2;
    this.l1=this.b1.linearVelocity;
    this.l2=this.b2.linearVelocity;
    this.a1=this.b1.angularVelocity;
    this.a2=this.b2.angularVelocity;
    this.i1=this.b1.inverseInertia;
    this.i2=this.b2.inverseInertia;
    this.limitImpulse=0;
    this.motorImpulse=0;
}

Object.assign( TranslationalConstraint.prototype, {

    TranslationalConstraint: true,

    preSolve:function(timeStep,invTimeStep){
        this.ax=this.limitMotor.axis.x;
        this.ay=this.limitMotor.axis.y;
        this.az=this.limitMotor.axis.z;
        this.lowerLimit=this.limitMotor.lowerLimit;
        this.upperLimit=this.limitMotor.upperLimit;
        this.motorSpeed=this.limitMotor.motorSpeed;
        this.maxMotorForce=this.limitMotor.maxMotorForce;
        this.enableMotor=this.maxMotorForce>0;
        this.m1=this.b1.inverseMass;
        this.m2=this.b2.inverseMass;

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

        var dx=this.p2.x-this.p1.x;
        var dy=this.p2.y-this.p1.y;
        var dz=this.p2.z-this.p1.z;
        var d=dx*this.ax+dy*this.ay+dz*this.az;
        var frequency=this.limitMotor.frequency;
        var enableSpring=frequency>0;
        var enableLimit=this.lowerLimit<=this.upperLimit;
        if(enableSpring&&d>20||d<-20){
            enableSpring=false;
        }

        if(enableLimit){
            if(this.lowerLimit==this.upperLimit){
                if(this.limitState!=0){
                    this.limitState=0;
                    this.limitImpulse=0;
                }
                this.limitVelocity=this.lowerLimit-d;
                if(!enableSpring)d=this.lowerLimit;
            }else if(d<this.lowerLimit){
                if(this.limitState!=-1){
                    this.limitState=-1;
                    this.limitImpulse=0;
                }
                this.limitVelocity=this.lowerLimit-d;
                if(!enableSpring)d=this.lowerLimit;
            }else if(d>this.upperLimit){
                if(this.limitState!=1){
                    this.limitState=1;
                    this.limitImpulse=0;
                }
                this.limitVelocity=this.upperLimit-d;
                if(!enableSpring)d=this.upperLimit;
            }else{
                this.limitState=2;
                this.limitImpulse=0;
                this.limitVelocity=0;
            }
            if(!enableSpring){
                if(this.limitVelocity>0.005)this.limitVelocity-=0.005;
                else if(this.limitVelocity<-0.005)this.limitVelocity+=0.005;
                else this.limitVelocity=0;
            }
        }else{
            this.limitState=2;
            this.limitImpulse=0;
        }

        if(this.enableMotor&&(this.limitState!=0||enableSpring)){
            this.maxMotorImpulse=this.maxMotorForce*timeStep;
        }else{
            this.motorImpulse=0;
            this.maxMotorImpulse=0;
        }

        var rdx=d*this.ax;
        var rdy=d*this.ay;
        var rdz=d*this.az;
        var w1=this.m1/(this.m1+this.m2);
        var w2=1-w1;
        this.r1x=this.r1.x+rdx*w1;
        this.r1y=this.r1.y+rdy*w1;
        this.r1z=this.r1.z+rdz*w1;
        this.r2x=this.r2.x-rdx*w2;
        this.r2y=this.r2.y-rdy*w2;
        this.r2z=this.r2.z-rdz*w2;

        this.t1x=this.r1y*this.az-this.r1z*this.ay;
        this.t1y=this.r1z*this.ax-this.r1x*this.az;
        this.t1z=this.r1x*this.ay-this.r1y*this.ax;
        this.t2x=this.r2y*this.az-this.r2z*this.ay;
        this.t2y=this.r2z*this.ax-this.r2x*this.az;
        this.t2z=this.r2x*this.ay-this.r2y*this.ax;
        this.l1x=this.ax*this.m1;
        this.l1y=this.ay*this.m1;
        this.l1z=this.az*this.m1;
        this.l2x=this.ax*this.m2;
        this.l2y=this.ay*this.m2;
        this.l2z=this.az*this.m2;
        this.a1x=this.t1x*this.i1e00+this.t1y*this.i1e01+this.t1z*this.i1e02;
        this.a1y=this.t1x*this.i1e10+this.t1y*this.i1e11+this.t1z*this.i1e12;
        this.a1z=this.t1x*this.i1e20+this.t1y*this.i1e21+this.t1z*this.i1e22;
        this.a2x=this.t2x*this.i2e00+this.t2y*this.i2e01+this.t2z*this.i2e02;
        this.a2y=this.t2x*this.i2e10+this.t2y*this.i2e11+this.t2z*this.i2e12;
        this.a2z=this.t2x*this.i2e20+this.t2y*this.i2e21+this.t2z*this.i2e22;
        this.motorDenom=
        this.m1+this.m2+
            this.ax*(this.a1y*this.r1z-this.a1z*this.r1y+this.a2y*this.r2z-this.a2z*this.r2y)+
            this.ay*(this.a1z*this.r1x-this.a1x*this.r1z+this.a2z*this.r2x-this.a2x*this.r2z)+
            this.az*(this.a1x*this.r1y-this.a1y*this.r1x+this.a2x*this.r2y-this.a2y*this.r2x);

        this.invMotorDenom=1/this.motorDenom;

        if(enableSpring&&this.limitState!=2){
            var omega=6.2831853*frequency;
            var k=omega*omega*timeStep;
            var dmp=invTimeStep/(k+2*this.limitMotor.dampingRatio*omega);
            this.cfm=this.motorDenom*dmp;
            this.limitVelocity*=k*dmp;
        }else{
            this.cfm=0;
            this.limitVelocity*=invTimeStep*0.05;
        }

        this.invDenom=1/(this.motorDenom+this.cfm);

        var totalImpulse=this.limitImpulse+this.motorImpulse;
        this.l1.x+=totalImpulse*this.l1x;
        this.l1.y+=totalImpulse*this.l1y;
        this.l1.z+=totalImpulse*this.l1z;
        this.a1.x+=totalImpulse*this.a1x;
        this.a1.y+=totalImpulse*this.a1y;
        this.a1.z+=totalImpulse*this.a1z;
        this.l2.x-=totalImpulse*this.l2x;
        this.l2.y-=totalImpulse*this.l2y;
        this.l2.z-=totalImpulse*this.l2z;
        this.a2.x-=totalImpulse*this.a2x;
        this.a2.y-=totalImpulse*this.a2y;
        this.a2.z-=totalImpulse*this.a2z;
    },
    solve:function(){
        var rvn=
            this.ax*(this.l2.x-this.l1.x)+this.ay*(this.l2.y-this.l1.y)+this.az*(this.l2.z-this.l1.z)+
            this.t2x*this.a2.x-this.t1x*this.a1.x+this.t2y*this.a2.y-this.t1y*this.a1.y+this.t2z*this.a2.z-this.t1z*this.a1.z;

        // motor part
        var newMotorImpulse;
        if(this.enableMotor){
            newMotorImpulse=(rvn-this.motorSpeed)*this.invMotorDenom;
            var oldMotorImpulse=this.motorImpulse;
            this.motorImpulse+=newMotorImpulse;
            if(this.motorImpulse>this.maxMotorImpulse)this.motorImpulse=this.maxMotorImpulse;
            else if(this.motorImpulse<-this.maxMotorImpulse)this.motorImpulse=-this.maxMotorImpulse;
            newMotorImpulse=this.motorImpulse-oldMotorImpulse;
            rvn-=newMotorImpulse*this.motorDenom;
        }else newMotorImpulse=0;

        // limit part
        var newLimitImpulse;
        if(this.limitState!=2){
            newLimitImpulse=(rvn-this.limitVelocity-this.limitImpulse*this.cfm)*this.invDenom;
            var oldLimitImpulse=this.limitImpulse;
            this.limitImpulse+=newLimitImpulse;
            if(this.limitImpulse*this.limitState<0)this.limitImpulse=0;
            newLimitImpulse=this.limitImpulse-oldLimitImpulse;
        }else newLimitImpulse=0;
        
        var totalImpulse=newLimitImpulse+newMotorImpulse;
        this.l1.x+=totalImpulse*this.l1x;
        this.l1.y+=totalImpulse*this.l1y;
        this.l1.z+=totalImpulse*this.l1z;
        this.a1.x+=totalImpulse*this.a1x;
        this.a1.y+=totalImpulse*this.a1y;
        this.a1.z+=totalImpulse*this.a1z;
        this.l2.x-=totalImpulse*this.l2x;
        this.l2.y-=totalImpulse*this.l2y;
        this.l2.z-=totalImpulse*this.l2z;
        this.a2.x-=totalImpulse*this.a2x;
        this.a2.y-=totalImpulse*this.a2y;
        this.a2.z-=totalImpulse*this.a2z;
    }
} );

export { TranslationalConstraint };