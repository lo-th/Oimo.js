/**
* A rotational constraint for various joints.
* @author saharan
*/

function RotationalConstraint ( joint, limitMotor ){

    this.cfm=NaN;
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
    this.a1x=NaN;
    this.a1y=NaN;
    this.a1z=NaN;
    this.a2x=NaN;
    this.a2y=NaN;
    this.a2z=NaN;
    this.enableLimit=false;
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
    this.a1=this.b1.angularVelocity;
    this.a2=this.b2.angularVelocity;
    this.i1=this.b1.inverseInertia;
    this.i2=this.b2.inverseInertia;
    this.limitImpulse=0;
    this.motorImpulse=0;
}

Object.assign( RotationalConstraint.prototype, {

    RotationalConstraint: true,

    preSolve:function(timeStep,invTimeStep){
        this.ax=this.limitMotor.axis.x;
        this.ay=this.limitMotor.axis.y;
        this.az=this.limitMotor.axis.z;
        this.lowerLimit=this.limitMotor.lowerLimit;
        this.upperLimit=this.limitMotor.upperLimit;
        this.motorSpeed=this.limitMotor.motorSpeed;
        this.maxMotorForce=this.limitMotor.maxMotorForce;
        this.enableMotor=this.maxMotorForce>0;

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

        var frequency=this.limitMotor.frequency;
        var enableSpring=frequency>0;
        var enableLimit=this.lowerLimit<=this.upperLimit;
        var angle=this.limitMotor.angle;
        if(enableLimit){
            if(this.lowerLimit==this.upperLimit){
                if(this.limitState!=0){
                    this.limitState=0;
                    this.limitImpulse=0;
                }
                this.limitVelocity=this.lowerLimit-angle;
            }else if(angle<this.lowerLimit){
                if(this.limitState!=-1){
                    this.limitState=-1;
                    this.limitImpulse=0;
                }
                this.limitVelocity=this.lowerLimit-angle;
            }else if(angle>this.upperLimit){
                if(this.limitState!=1){
                    this.limitState=1;
                    this.limitImpulse=0;
                }
                this.limitVelocity=this.upperLimit-angle;
            }else{
                this.limitState=2;
                this.limitImpulse=0;
                this.limitVelocity=0;
            }
            if(!enableSpring){
                if(this.limitVelocity>0.02)this.limitVelocity-=0.02;
                else if(this.limitVelocity<-0.02)this.limitVelocity+=0.02;
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

        this.a1x=this.ax*this.i1e00+this.ay*this.i1e01+this.az*this.i1e02;
        this.a1y=this.ax*this.i1e10+this.ay*this.i1e11+this.az*this.i1e12;
        this.a1z=this.ax*this.i1e20+this.ay*this.i1e21+this.az*this.i1e22;
        this.a2x=this.ax*this.i2e00+this.ay*this.i2e01+this.az*this.i2e02;
        this.a2y=this.ax*this.i2e10+this.ay*this.i2e11+this.az*this.i2e12;
        this.a2z=this.ax*this.i2e20+this.ay*this.i2e21+this.az*this.i2e22;
        this.motorDenom=this.ax*(this.a1x+this.a2x)+this.ay*(this.a1y+this.a2y)+this.az*(this.a1z+this.a2z);
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
        
        this.limitImpulse*=0.95;
        this.motorImpulse*=0.95;
        var totalImpulse=this.limitImpulse+this.motorImpulse;
        this.a1.x+=totalImpulse*this.a1x;
        this.a1.y+=totalImpulse*this.a1y;
        this.a1.z+=totalImpulse*this.a1z;
        this.a2.x-=totalImpulse*this.a2x;
        this.a2.y-=totalImpulse*this.a2y;
        this.a2.z-=totalImpulse*this.a2z;
    },

    solve:function(){

        var rvn=this.ax*(this.a2.x-this.a1.x)+this.ay*(this.a2.y-this.a1.y)+this.az*(this.a2.z-this.a1.z);

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
        this.a1.x+=totalImpulse*this.a1x;
        this.a1.y+=totalImpulse*this.a1y;
        this.a1.z+=totalImpulse*this.a1z;
        this.a2.x-=totalImpulse*this.a2x;
        this.a2.y-=totalImpulse*this.a2y;
        this.a2.z-=totalImpulse*this.a2z;

    }

} );

export { RotationalConstraint };