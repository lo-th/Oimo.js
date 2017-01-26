/**
* A three-axis rotational constraint for various joints.
* @author saharan
*/

function Rotational3Constraint ( joint, limitMotor1, limitMotor2, limitMotor3 ) {
    
    this.cfm1=NaN;
    this.cfm2=NaN;
    this.cfm3=NaN;
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
    this.ax1=NaN;
    this.ay1=NaN;
    this.az1=NaN;
    this.ax2=NaN;
    this.ay2=NaN;
    this.az2=NaN;
    this.ax3=NaN;
    this.ay3=NaN;
    this.az3=NaN;

    this.a1x1=NaN; // jacoians
    this.a1y1=NaN;
    this.a1z1=NaN;
    this.a2x1=NaN;
    this.a2y1=NaN;
    this.a2z1=NaN;
    this.a1x2=NaN;
    this.a1y2=NaN;
    this.a1z2=NaN;
    this.a2x2=NaN;
    this.a2y2=NaN;
    this.a2z2=NaN;
    this.a1x3=NaN;
    this.a1y3=NaN;
    this.a1z3=NaN;
    this.a2x3=NaN;
    this.a2y3=NaN;
    this.a2z3=NaN;

    this.lowerLimit1=NaN;
    this.upperLimit1=NaN;
    this.limitVelocity1=NaN;
    this.limitState1=0; // -1: at lower, 0: locked, 1: at upper, 2: free
    this.enableMotor1=false;
    this.motorSpeed1=NaN;
    this.maxMotorForce1=NaN;
    this.maxMotorImpulse1=NaN;
    this.lowerLimit2=NaN;
    this.upperLimit2=NaN;
    this.limitVelocity2=NaN;
    this.limitState2=0; // -1: at lower, 0: locked, 1: at upper, 2: free
    this.enableMotor2=false;
    this.motorSpeed2=NaN;
    this.maxMotorForce2=NaN;
    this.maxMotorImpulse2=NaN;
    this.lowerLimit3=NaN;
    this.upperLimit3=NaN;
    this.limitVelocity3=NaN;
    this.limitState3=0; // -1: at lower, 0: locked, 1: at upper, 2: free
    this.enableMotor3=false;
    this.motorSpeed3=NaN;
    this.maxMotorForce3=NaN;
    this.maxMotorImpulse3=NaN;

    this.k00=NaN; // K = J*M*JT
    this.k01=NaN;
    this.k02=NaN;
    this.k10=NaN;
    this.k11=NaN;
    this.k12=NaN;
    this.k20=NaN;
    this.k21=NaN;
    this.k22=NaN;

    this.kv00=NaN; // diagonals without CFMs
    this.kv11=NaN;
    this.kv22=NaN;

    this.dv00=NaN; // ...inverted
    this.dv11=NaN;
    this.dv22=NaN;

    this.d00=NaN;  // K^-1
    this.d01=NaN;
    this.d02=NaN;
    this.d10=NaN;
    this.d11=NaN;
    this.d12=NaN;
    this.d20=NaN;
    this.d21=NaN;
    this.d22=NaN;

    this.limitMotor1=limitMotor1;
    this.limitMotor2=limitMotor2;
    this.limitMotor3=limitMotor3;
    this.b1=joint.body1;
    this.b2=joint.body2;
    this.a1=this.b1.angularVelocity;
    this.a2=this.b2.angularVelocity;
    this.i1=this.b1.inverseInertia;
    this.i2=this.b2.inverseInertia;
    this.limitImpulse1=0;
    this.motorImpulse1=0;
    this.limitImpulse2=0;
    this.motorImpulse2=0;
    this.limitImpulse3=0;
    this.motorImpulse3=0;

}

Object.assign( Rotational3Constraint.prototype, {

    Rotational3Constraint: true,

    preSolve: function( timeStep, invTimeStep ){

        this.ax1=this.limitMotor1.axis.x;
        this.ay1=this.limitMotor1.axis.y;
        this.az1=this.limitMotor1.axis.z;
        this.ax2=this.limitMotor2.axis.x;
        this.ay2=this.limitMotor2.axis.y;
        this.az2=this.limitMotor2.axis.z;
        this.ax3=this.limitMotor3.axis.x;
        this.ay3=this.limitMotor3.axis.y;
        this.az3=this.limitMotor3.axis.z;
        this.lowerLimit1=this.limitMotor1.lowerLimit;
        this.upperLimit1=this.limitMotor1.upperLimit;
        this.motorSpeed1=this.limitMotor1.motorSpeed;
        this.maxMotorForce1=this.limitMotor1.maxMotorForce;
        this.enableMotor1=this.maxMotorForce1>0;
        this.lowerLimit2=this.limitMotor2.lowerLimit;
        this.upperLimit2=this.limitMotor2.upperLimit;
        this.motorSpeed2=this.limitMotor2.motorSpeed;
        this.maxMotorForce2=this.limitMotor2.maxMotorForce;
        this.enableMotor2=this.maxMotorForce2>0;
        this.lowerLimit3=this.limitMotor3.lowerLimit;
        this.upperLimit3=this.limitMotor3.upperLimit;
        this.motorSpeed3=this.limitMotor3.motorSpeed;
        this.maxMotorForce3=this.limitMotor3.maxMotorForce;
        this.enableMotor3=this.maxMotorForce3>0;

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

        var frequency1=this.limitMotor1.frequency;
        var frequency2=this.limitMotor2.frequency;
        var frequency3=this.limitMotor3.frequency;
        var enableSpring1=frequency1>0;
        var enableSpring2=frequency2>0;
        var enableSpring3=frequency3>0;
        var enableLimit1=this.lowerLimit1<=this.upperLimit1;
        var enableLimit2=this.lowerLimit2<=this.upperLimit2;
        var enableLimit3=this.lowerLimit3<=this.upperLimit3;
        var angle1=this.limitMotor1.angle;
        if(enableLimit1){
            if(this.lowerLimit1==this.upperLimit1){
                if(this.limitState1!=0){
                    this.limitState1=0;
                    this.limitImpulse1=0;
                }
                this.limitVelocity1=this.lowerLimit1-angle1;
            }else if(angle1<this.lowerLimit1){
                if(this.limitState1!=-1){
                    this.limitState1=-1;
                    this.limitImpulse1=0;
                }
                this.limitVelocity1=this.lowerLimit1-angle1;
            }else if(angle1>this.upperLimit1){
                if(this.limitState1!=1){
                    this.limitState1=1;
                    this.limitImpulse1=0;
                }
                this.limitVelocity1=this.upperLimit1-angle1;
            }else{
                this.limitState1=2;
                this.limitImpulse1=0;
                this.limitVelocity1=0;
            }
            if(!enableSpring1){
                if(this.limitVelocity1>0.02)this.limitVelocity1-=0.02;
                else if(this.limitVelocity1<-0.02)this.limitVelocity1+=0.02;
                else this.limitVelocity1=0;
            }
        }else{
            this.limitState1=2;
            this.limitImpulse1=0;
        }

        var angle2=this.limitMotor2.angle;
        if(enableLimit2){
            if(this.lowerLimit2==this.upperLimit2){
                if(this.limitState2!=0){
                    this.limitState2=0;
                    this.limitImpulse2=0;
                }
                this.limitVelocity2=this.lowerLimit2-angle2;
            }else if(angle2<this.lowerLimit2){
                if(this.limitState2!=-1){
                    this.limitState2=-1;
                    this.limitImpulse2=0;
                }
                this.limitVelocity2=this.lowerLimit2-angle2;
            }else if(angle2>this.upperLimit2){
                if(this.limitState2!=1){
                    this.limitState2=1;
                    this.limitImpulse2=0;
                }
                this.limitVelocity2=this.upperLimit2-angle2;
            }else{
                this.limitState2=2;
                this.limitImpulse2=0;
                this.limitVelocity2=0;
            }
            if(!enableSpring2){
                if(this.limitVelocity2>0.02)this.limitVelocity2-=0.02;
                else if(this.limitVelocity2<-0.02)this.limitVelocity2+=0.02;
                else this.limitVelocity2=0;
            }
        }else{
            this.limitState2=2;
            this.limitImpulse2=0;
        }

        var angle3=this.limitMotor3.angle;
        if(enableLimit3){
            if(this.lowerLimit3==this.upperLimit3){
                if(this.limitState3!=0){
                    this.limitState3=0;
                    this.limitImpulse3=0;
                }
                this.limitVelocity3=this.lowerLimit3-angle3;
            }else if(angle3<this.lowerLimit3){
                if(this.limitState3!=-1){
                    this.limitState3=-1;
                    this.limitImpulse3=0;
                }
                this.limitVelocity3=this.lowerLimit3-angle3;
            }else if(angle3>this.upperLimit3){
                if(this.limitState3!=1){
                    this.limitState3=1;
                    this.limitImpulse3=0;
                }
                this.limitVelocity3=this.upperLimit3-angle3;
            }else{
                this.limitState3=2;
                this.limitImpulse3=0;
                this.limitVelocity3=0;
                }
            if(!enableSpring3){
                if(this.limitVelocity3>0.02)this.limitVelocity3-=0.02;
                else if(this.limitVelocity3<-0.02)this.limitVelocity3+=0.02;
                else this.limitVelocity3=0;
            }
        }else{
            this.limitState3=2;
            this.limitImpulse3=0;
        }

        if(this.enableMotor1&&(this.limitState1!=0||enableSpring1)){
            this.maxMotorImpulse1=this.maxMotorForce1*timeStep;
        }else{
            this.motorImpulse1=0;
            this.maxMotorImpulse1=0;
        }
        if(this.enableMotor2&&(this.limitState2!=0||enableSpring2)){
            this.maxMotorImpulse2=this.maxMotorForce2*timeStep;
        }else{
            this.motorImpulse2=0;
            this.maxMotorImpulse2=0;
        }
        if(this.enableMotor3&&(this.limitState3!=0||enableSpring3)){
            this.maxMotorImpulse3=this.maxMotorForce3*timeStep;
        }else{
            this.motorImpulse3=0;
            this.maxMotorImpulse3=0;
        }

        // build jacobians
        this.a1x1=this.ax1*this.i1e00+this.ay1*this.i1e01+this.az1*this.i1e02;
        this.a1y1=this.ax1*this.i1e10+this.ay1*this.i1e11+this.az1*this.i1e12;
        this.a1z1=this.ax1*this.i1e20+this.ay1*this.i1e21+this.az1*this.i1e22;
        this.a2x1=this.ax1*this.i2e00+this.ay1*this.i2e01+this.az1*this.i2e02;
        this.a2y1=this.ax1*this.i2e10+this.ay1*this.i2e11+this.az1*this.i2e12;
        this.a2z1=this.ax1*this.i2e20+this.ay1*this.i2e21+this.az1*this.i2e22;

        this.a1x2=this.ax2*this.i1e00+this.ay2*this.i1e01+this.az2*this.i1e02;
        this.a1y2=this.ax2*this.i1e10+this.ay2*this.i1e11+this.az2*this.i1e12;
        this.a1z2=this.ax2*this.i1e20+this.ay2*this.i1e21+this.az2*this.i1e22;
        this.a2x2=this.ax2*this.i2e00+this.ay2*this.i2e01+this.az2*this.i2e02;
        this.a2y2=this.ax2*this.i2e10+this.ay2*this.i2e11+this.az2*this.i2e12;
        this.a2z2=this.ax2*this.i2e20+this.ay2*this.i2e21+this.az2*this.i2e22;

        this.a1x3=this.ax3*this.i1e00+this.ay3*this.i1e01+this.az3*this.i1e02;
        this.a1y3=this.ax3*this.i1e10+this.ay3*this.i1e11+this.az3*this.i1e12;
        this.a1z3=this.ax3*this.i1e20+this.ay3*this.i1e21+this.az3*this.i1e22;
        this.a2x3=this.ax3*this.i2e00+this.ay3*this.i2e01+this.az3*this.i2e02;
        this.a2y3=this.ax3*this.i2e10+this.ay3*this.i2e11+this.az3*this.i2e12;
        this.a2z3=this.ax3*this.i2e20+this.ay3*this.i2e21+this.az3*this.i2e22;

        // build an impulse matrix
        this.k00=this.ax1*(this.a1x1+this.a2x1)+this.ay1*(this.a1y1+this.a2y1)+this.az1*(this.a1z1+this.a2z1);
        this.k01=this.ax1*(this.a1x2+this.a2x2)+this.ay1*(this.a1y2+this.a2y2)+this.az1*(this.a1z2+this.a2z2);
        this.k02=this.ax1*(this.a1x3+this.a2x3)+this.ay1*(this.a1y3+this.a2y3)+this.az1*(this.a1z3+this.a2z3);
        this.k10=this.ax2*(this.a1x1+this.a2x1)+this.ay2*(this.a1y1+this.a2y1)+this.az2*(this.a1z1+this.a2z1);
        this.k11=this.ax2*(this.a1x2+this.a2x2)+this.ay2*(this.a1y2+this.a2y2)+this.az2*(this.a1z2+this.a2z2);
        this.k12=this.ax2*(this.a1x3+this.a2x3)+this.ay2*(this.a1y3+this.a2y3)+this.az2*(this.a1z3+this.a2z3);
        this.k20=this.ax3*(this.a1x1+this.a2x1)+this.ay3*(this.a1y1+this.a2y1)+this.az3*(this.a1z1+this.a2z1);
        this.k21=this.ax3*(this.a1x2+this.a2x2)+this.ay3*(this.a1y2+this.a2y2)+this.az3*(this.a1z2+this.a2z2);
        this.k22=this.ax3*(this.a1x3+this.a2x3)+this.ay3*(this.a1y3+this.a2y3)+this.az3*(this.a1z3+this.a2z3);

        this.kv00=this.k00;
        this.kv11=this.k11;
        this.kv22=this.k22;
        this.dv00=1/this.kv00;
        this.dv11=1/this.kv11;
        this.dv22=1/this.kv22;

        if(enableSpring1&&this.limitState1!=2){
            var omega=6.2831853*frequency1;
            var k=omega*omega*timeStep;
            var dmp=invTimeStep/(k+2*this.limitMotor1.dampingRatio*omega);
            this.cfm1=this.kv00*dmp;
            this.limitVelocity1*=k*dmp;
        }else{
            this.cfm1=0;
            this.limitVelocity1*=invTimeStep*0.05;
        }

        if(enableSpring2&&this.limitState2!=2){
            omega=6.2831853*frequency2;
            k=omega*omega*timeStep;
            dmp=invTimeStep/(k+2*this.limitMotor2.dampingRatio*omega);
            this.cfm2=this.kv11*dmp;
            this.limitVelocity2*=k*dmp;
        }else{
            this.cfm2=0;
            this.limitVelocity2*=invTimeStep*0.05;
        }

        if(enableSpring3&&this.limitState3!=2){
            omega=6.2831853*frequency3;
            k=omega*omega*timeStep;
            dmp=invTimeStep/(k+2*this.limitMotor3.dampingRatio*omega);
            this.cfm3=this.kv22*dmp;
            this.limitVelocity3*=k*dmp;
        }else{
            this.cfm3=0;
            this.limitVelocity3*=invTimeStep*0.05;
        }

        this.k00+=this.cfm1;
        this.k11+=this.cfm2;
        this.k22+=this.cfm3;

        var inv=1/(
        this.k00*(this.k11*this.k22-this.k21*this.k12)+
        this.k10*(this.k21*this.k02-this.k01*this.k22)+
        this.k20*(this.k01*this.k12-this.k11*this.k02)
        );
        this.d00=(this.k11*this.k22-this.k12*this.k21)*inv;
        this.d01=(this.k02*this.k21-this.k01*this.k22)*inv;
        this.d02=(this.k01*this.k12-this.k02*this.k11)*inv;
        this.d10=(this.k12*this.k20-this.k10*this.k22)*inv;
        this.d11=(this.k00*this.k22-this.k02*this.k20)*inv;
        this.d12=(this.k02*this.k10-this.k00*this.k12)*inv;
        this.d20=(this.k10*this.k21-this.k11*this.k20)*inv;
        this.d21=(this.k01*this.k20-this.k00*this.k21)*inv;
        this.d22=(this.k00*this.k11-this.k01*this.k10)*inv;
        
        this.limitImpulse1*=0.95;
        this.motorImpulse1*=0.95;
        this.limitImpulse2*=0.95;
        this.motorImpulse2*=0.95;
        this.limitImpulse3*=0.95;
        this.motorImpulse3*=0.95;
        var totalImpulse1=this.limitImpulse1+this.motorImpulse1;
        var totalImpulse2=this.limitImpulse2+this.motorImpulse2;
        var totalImpulse3=this.limitImpulse3+this.motorImpulse3;
        this.a1.x+=totalImpulse1*this.a1x1+totalImpulse2*this.a1x2+totalImpulse3*this.a1x3;
        this.a1.y+=totalImpulse1*this.a1y1+totalImpulse2*this.a1y2+totalImpulse3*this.a1y3;
        this.a1.z+=totalImpulse1*this.a1z1+totalImpulse2*this.a1z2+totalImpulse3*this.a1z3;
        this.a2.x-=totalImpulse1*this.a2x1+totalImpulse2*this.a2x2+totalImpulse3*this.a2x3;
        this.a2.y-=totalImpulse1*this.a2y1+totalImpulse2*this.a2y2+totalImpulse3*this.a2y3;
        this.a2.z-=totalImpulse1*this.a2z1+totalImpulse2*this.a2z2+totalImpulse3*this.a2z3;
    },
    solve_:function(){

        var rvx=this.a2.x-this.a1.x;
        var rvy=this.a2.y-this.a1.y;
        var rvz=this.a2.z-this.a1.z;

        this.limitVelocity3=30;
        var rvn1=rvx*this.ax1+rvy*this.ay1+rvz*this.az1-this.limitVelocity1;
        var rvn2=rvx*this.ax2+rvy*this.ay2+rvz*this.az2-this.limitVelocity2;
        var rvn3=rvx*this.ax3+rvy*this.ay3+rvz*this.az3-this.limitVelocity3;

        var dLimitImpulse1=rvn1*this.d00+rvn2*this.d01+rvn3*this.d02;
        var dLimitImpulse2=rvn1*this.d10+rvn2*this.d11+rvn3*this.d12;
        var dLimitImpulse3=rvn1*this.d20+rvn2*this.d21+rvn3*this.d22;

        this.limitImpulse1+=dLimitImpulse1;
        this.limitImpulse2+=dLimitImpulse2;
        this.limitImpulse3+=dLimitImpulse3;

        this.a1.x+=dLimitImpulse1*this.a1x1+dLimitImpulse2*this.a1x2+dLimitImpulse3*this.a1x3;
        this.a1.y+=dLimitImpulse1*this.a1y1+dLimitImpulse2*this.a1y2+dLimitImpulse3*this.a1y3;
        this.a1.z+=dLimitImpulse1*this.a1z1+dLimitImpulse2*this.a1z2+dLimitImpulse3*this.a1z3;
        this.a2.x-=dLimitImpulse1*this.a2x1+dLimitImpulse2*this.a2x2+dLimitImpulse3*this.a2x3;
        this.a2.y-=dLimitImpulse1*this.a2y1+dLimitImpulse2*this.a2y2+dLimitImpulse3*this.a2y3;
        this.a2.z-=dLimitImpulse1*this.a2z1+dLimitImpulse2*this.a2z2+dLimitImpulse3*this.a2z3;
    },
    solve:function(){

        var rvx=this.a2.x-this.a1.x;
        var rvy=this.a2.y-this.a1.y;
        var rvz=this.a2.z-this.a1.z;

        var rvn1=rvx*this.ax1+rvy*this.ay1+rvz*this.az1;
        var rvn2=rvx*this.ax2+rvy*this.ay2+rvz*this.az2;
        var rvn3=rvx*this.ax3+rvy*this.ay3+rvz*this.az3;

        var oldMotorImpulse1=this.motorImpulse1;
        var oldMotorImpulse2=this.motorImpulse2;
        var oldMotorImpulse3=this.motorImpulse3;

        var dMotorImpulse1=0;
        var dMotorImpulse2=0;
        var dMotorImpulse3=0;

        if(this.enableMotor1){
            dMotorImpulse1=(rvn1-this.motorSpeed1)*this.dv00;
            this.motorImpulse1+=dMotorImpulse1;
            if(this.motorImpulse1>this.maxMotorImpulse1){ // clamp motor impulse
            this.motorImpulse1=this.maxMotorImpulse1;
            }else if(this.motorImpulse1<-this.maxMotorImpulse1){
            this.motorImpulse1=-this.maxMotorImpulse1;
            }
            dMotorImpulse1=this.motorImpulse1-oldMotorImpulse1;
        }
        if(this.enableMotor2){
            dMotorImpulse2=(rvn2-this.motorSpeed2)*this.dv11;
            this.motorImpulse2+=dMotorImpulse2;
            if(this.motorImpulse2>this.maxMotorImpulse2){ // clamp motor impulse
                this.motorImpulse2=this.maxMotorImpulse2;
            }else if(this.motorImpulse2<-this.maxMotorImpulse2){
                this.motorImpulse2=-this.maxMotorImpulse2;
            }
            dMotorImpulse2=this.motorImpulse2-oldMotorImpulse2;
        }
        if(this.enableMotor3){
            dMotorImpulse3=(rvn3-this.motorSpeed3)*this.dv22;
            this.motorImpulse3+=dMotorImpulse3;
            if(this.motorImpulse3>this.maxMotorImpulse3){ // clamp motor impulse
                this.motorImpulse3=this.maxMotorImpulse3;
            }else if(this.motorImpulse3<-this.maxMotorImpulse3){
                this.motorImpulse3=-this.maxMotorImpulse3;
            }
            dMotorImpulse3=this.motorImpulse3-oldMotorImpulse3;
        }

        // apply motor impulse to relative velocity
        rvn1+=dMotorImpulse1*this.kv00+dMotorImpulse2*this.k01+dMotorImpulse3*this.k02;
        rvn2+=dMotorImpulse1*this.k10+dMotorImpulse2*this.kv11+dMotorImpulse3*this.k12;
        rvn3+=dMotorImpulse1*this.k20+dMotorImpulse2*this.k21+dMotorImpulse3*this.kv22;

        // subtract target velocity and applied impulse
        rvn1-=this.limitVelocity1+this.limitImpulse1*this.cfm1;
        rvn2-=this.limitVelocity2+this.limitImpulse2*this.cfm2;
        rvn3-=this.limitVelocity3+this.limitImpulse3*this.cfm3;

        var oldLimitImpulse1=this.limitImpulse1;
        var oldLimitImpulse2=this.limitImpulse2;
        var oldLimitImpulse3=this.limitImpulse3;

        var dLimitImpulse1=rvn1*this.d00+rvn2*this.d01+rvn3*this.d02;
        var dLimitImpulse2=rvn1*this.d10+rvn2*this.d11+rvn3*this.d12;
        var dLimitImpulse3=rvn1*this.d20+rvn2*this.d21+rvn3*this.d22;

        this.limitImpulse1+=dLimitImpulse1;
        this.limitImpulse2+=dLimitImpulse2;
        this.limitImpulse3+=dLimitImpulse3;

        // clamp
        var clampState=0;
        if(this.limitState1==2||this.limitImpulse1*this.limitState1<0){
            dLimitImpulse1=-oldLimitImpulse1;
            rvn2+=dLimitImpulse1*this.k10;
            rvn3+=dLimitImpulse1*this.k20;
            clampState|=1;
        }
        if(this.limitState2==2||this.limitImpulse2*this.limitState2<0){
            dLimitImpulse2=-oldLimitImpulse2;
            rvn1+=dLimitImpulse2*this.k01;
            rvn3+=dLimitImpulse2*this.k21;
            clampState|=2;
        }
        if(this.limitState3==2||this.limitImpulse3*this.limitState3<0){
            dLimitImpulse3=-oldLimitImpulse3;
            rvn1+=dLimitImpulse3*this.k02;
            rvn2+=dLimitImpulse3*this.k12;
            clampState|=4;
        }

        // update un-clamped impulse
        // TODO: isolate division
        var det;
        switch(clampState){
            case 1: // update 2 3
            det=1/(this.k11*this.k22-this.k12*this.k21);
            dLimitImpulse2=(this.k22*rvn2+-this.k12*rvn3)*det;
            dLimitImpulse3=(-this.k21*rvn2+this.k11*rvn3)*det;
            break;
            case 2: // update 1 3
            det=1/(this.k00*this.k22-this.k02*this.k20);
            dLimitImpulse1=(this.k22*rvn1+-this.k02*rvn3)*det;
            dLimitImpulse3=(-this.k20*rvn1+this.k00*rvn3)*det;
            break;
            case 3: // update 3
            dLimitImpulse3=rvn3/this.k22;
            break;
            case 4: // update 1 2
            det=1/(this.k00*this.k11-this.k01*this.k10);
            dLimitImpulse1=(this.k11*rvn1+-this.k01*rvn2)*det;
            dLimitImpulse2=(-this.k10*rvn1+this.k00*rvn2)*det;
            break;
            case 5: // update 2
            dLimitImpulse2=rvn2/this.k11;
            break;
            case 6: // update 1
            dLimitImpulse1=rvn1/this.k00;
            break;
        }

        this.limitImpulse1=dLimitImpulse1+oldLimitImpulse1;
        this.limitImpulse2=dLimitImpulse2+oldLimitImpulse2;
        this.limitImpulse3=dLimitImpulse3+oldLimitImpulse3;

        var dImpulse1=dMotorImpulse1+dLimitImpulse1;
        var dImpulse2=dMotorImpulse2+dLimitImpulse2;
        var dImpulse3=dMotorImpulse3+dLimitImpulse3;

        // apply impulse
        this.a1.x+=dImpulse1*this.a1x1+dImpulse2*this.a1x2+dImpulse3*this.a1x3;
        this.a1.y+=dImpulse1*this.a1y1+dImpulse2*this.a1y2+dImpulse3*this.a1y3;
        this.a1.z+=dImpulse1*this.a1z1+dImpulse2*this.a1z2+dImpulse3*this.a1z3;
        this.a2.x-=dImpulse1*this.a2x1+dImpulse2*this.a2x2+dImpulse3*this.a2x3;
        this.a2.y-=dImpulse1*this.a2y1+dImpulse2*this.a2y2+dImpulse3*this.a2y3;
        this.a2.z-=dImpulse1*this.a2z1+dImpulse2*this.a2z2+dImpulse3*this.a2z3;
        rvx=this.a2.x-this.a1.x;
        rvy=this.a2.y-this.a1.y;
        rvz=this.a2.z-this.a1.z;

        rvn2=rvx*this.ax2+rvy*this.ay2+rvz*this.az2;
    }
    
} );

export { Rotational3Constraint };