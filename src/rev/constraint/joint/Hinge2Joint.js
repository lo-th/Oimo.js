OIMO.Hinge2Joint = function(config,rigid1,rigid2){
    OIMO.Joint.call( this );

    this.limitTorque1=NaN;
    this.motorTorque1=NaN;
    this.limitTorque2=NaN;
    this.motorTorque2=NaN;
    this.enableLimits1=false;
    this.lowerLimit1=NaN;
    this.upperLimit1=NaN;
    this.limitSign1=0;
    this.enableLimits2=false;
    this.lowerLimit2=NaN;
    this.upperLimit2=NaN;
    this.limitSign2=0;
    this.enableMotor1=false;
    this.motorSpeed1=NaN;
    this.maxMotorTorque1=NaN;
    this.stepMotorTorque1=NaN;
    this.enableMotor2=false;
    this.motorSpeed2=NaN;
    this.maxMotorTorque2=NaN;
    this.stepMotorTorque2=NaN;
    this.tanX=NaN;
    this.tanY=NaN;
    this.tanZ=NaN;
    this.binX=NaN;
    this.binY=NaN;
    this.binZ=NaN;
    this.angAxis1X=NaN;
    this.angAxis1Y=NaN;
    this.angAxis1Z=NaN;
    this.angAxis2X=NaN;
    this.angAxis2Y=NaN;
    this.angAxis2Z=NaN;
    this.norX=NaN;
    this.norY=NaN;
    this.norZ=NaN;
    this.angle1=NaN;
    this.angle2=NaN;
    this.relPos1X=NaN;
    this.relPos1Y=NaN;
    this.relPos1Z=NaN;
    this.relPos2X=NaN;
    this.relPos2Y=NaN;
    this.relPos2Z=NaN;
    this.xTorqueUnit1X=NaN;
    this.xTorqueUnit1Y=NaN;
    this.xTorqueUnit1Z=NaN;
    this.xTorqueUnit2X=NaN;
    this.xTorqueUnit2Y=NaN;
    this.xTorqueUnit2Z=NaN;
    this.yTorqueUnit1X=NaN;
    this.yTorqueUnit1Y=NaN;
    this.yTorqueUnit1Z=NaN;
    this.yTorqueUnit2X=NaN;
    this.yTorqueUnit2Y=NaN;
    this.yTorqueUnit2Z=NaN;
    this.zTorqueUnit1X=NaN;
    this.zTorqueUnit1Y=NaN;
    this.zTorqueUnit1Z=NaN;
    this.zTorqueUnit2X=NaN;
    this.zTorqueUnit2Y=NaN;
    this.zTorqueUnit2Z=NaN;
    this.invI1e00=NaN;
    this.invI1e01=NaN;
    this.invI1e02=NaN;
    this.invI1e10=NaN;
    this.invI1e11=NaN;
    this.invI1e12=NaN;
    this.invI1e20=NaN;
    this.invI1e21=NaN;
    this.invI1e22=NaN;
    this.invI2e00=NaN;
    this.invI2e01=NaN;
    this.invI2e02=NaN;
    this.invI2e10=NaN;
    this.invI2e11=NaN;
    this.invI2e12=NaN;
    this.invI2e20=NaN;
    this.invI2e21=NaN;
    this.invI2e22=NaN;
    this.d00=NaN;
    this.d01=NaN;
    this.d02=NaN;
    this.d10=NaN;
    this.d11=NaN;
    this.d12=NaN;
    this.d20=NaN;
    this.d21=NaN;
    this.d22=NaN;
    this.norDenominator=NaN;
    this.tanDenominator=NaN;
    this.binDenominator=NaN;
    this.invTanDenominator=NaN;
    this.invBinDenominator=NaN;
    this.targetVelX=NaN;
    this.targetVelY=NaN;
    this.targetVelZ=NaN;
    this.targetAngVelNor=NaN;
    this.targetAngVelTan=NaN;
    this.targetAngVelBin=NaN;

    this.body1=rigid1;
    this.body2=rigid2;
    this.connection1.connected=rigid2;
    this.connection2.connected=rigid1;
    this.localAxis1=new OIMO.Vec3();
    this.localAxis2=new OIMO.Vec3();
    this.localAxis1.normalize(config.localAxis1);
    this.localAxis2.normalize(config.localAxis2);
    var len;
    this.localAxis1X=this.localAxis1.x;
    this.localAxis1Y=this.localAxis1.y;
    this.localAxis1Z=this.localAxis1.z;
    this.localAngAxis1X=this.localAxis1Y*this.localAxis1X-this.localAxis1Z*this.localAxis1Z;
    this.localAngAxis1Y=-this.localAxis1Z*this.localAxis1Y-this.localAxis1X*this.localAxis1X;
    this.localAngAxis1Z=this.localAxis1X*this.localAxis1Z+this.localAxis1Y*this.localAxis1Y;
    len=1/Math.sqrt(this.localAngAxis1X*this.localAngAxis1X+this.localAngAxis1Y*this.localAngAxis1Y+this.localAngAxis1Z*this.localAngAxis1Z);
    this.localAngAxis1X*=len;
    this.localAngAxis1Y*=len;
    this.localAngAxis1Z*=len;
    this.localAxis2X=this.localAxis2.x;
    this.localAxis2Y=this.localAxis2.y;
    this.localAxis2Z=this.localAxis2.z;
    this.localAngAxis2X=this.localAxis2Y*this.localAxis2X-this.localAxis2Z*this.localAxis2Z;
    this.localAngAxis2Y=-this.localAxis2Z*this.localAxis2Y-this.localAxis2X*this.localAxis2X;
    this.localAngAxis2Z=this.localAxis2X*this.localAxis2Z+this.localAxis2Y*this.localAxis2Y;
    len=1/Math.sqrt(this.localAngAxis2X*this.localAngAxis2X+this.localAngAxis2Y*this.localAngAxis2Y+this.localAngAxis2Z*this.localAngAxis2Z);
    this.localAngAxis2X*=len;
    this.localAngAxis2Y*=len;
    this.localAngAxis2Z*=len;
    this.allowCollision=config.allowCollision;
    this.localRelativeAnchorPosition1.copy(config.localRelativeAnchorPosition1);
    this.localRelativeAnchorPosition2.copy(config.localRelativeAnchorPosition2);
    this.type=this.JOINT_HINGE2;
    this.lVel1=this.body1.linearVelocity;
    this.lVel2=this.body2.linearVelocity;
    this.aVel1=this.body1.angularVelocity;
    this.aVel2=this.body2.angularVelocity;
    this.invM1=this.body1.invertMass;
    this.invM2=this.body2.invertMass;
    this.impulse=new OIMO.Vec3();
    this.torque=new OIMO.Vec3();
    this.impulseX=0;
    this.impulseY=0;
    this.impulseZ=0;
    this.limitTorque1=0;
    this.motorTorque1=0;
    this.limitTorque2=0;
    this.motorTorque2=0;
    this.torqueX=0;
    this.torqueY=0;
    this.torqueZ=0;
    this.torqueNor=0;
}
OIMO.Hinge2Joint.prototype = Object.create( OIMO.Joint.prototype );
OIMO.Hinge2Joint.prototype.preSolve = function (timeStep,invTimeStep) {
    var tmpM;
    var tmp1X;
    var tmp1Y;
    var tmp1Z;
    var tmp2X;
    var tmp2Y;
    var tmp2Z;
    var t00;
    var t01;
    var t02;
    var t10;
    var t11;
    var t12;
    var t20;
    var t21;
    var t22;
    var u00;
    var u01;
    var u02;
    var u10;
    var u11;
    var u12;
    var u20;
    var u21;
    var u22;
    tmpM=this.body1.rotation.elements;
    this.tanX=this.localAxis1X*tmpM[0]+this.localAxis1Y*tmpM[1]+this.localAxis1Z*tmpM[2];
    this.tanY=this.localAxis1X*tmpM[3]+this.localAxis1Y*tmpM[4]+this.localAxis1Z*tmpM[5];
    this.tanZ=this.localAxis1X*tmpM[6]+this.localAxis1Y*tmpM[7]+this.localAxis1Z*tmpM[8];
    this.angAxis1X=this.localAngAxis1X*tmpM[0]+this.localAngAxis1Y*tmpM[1]+this.localAngAxis1Z*tmpM[2];
    this.angAxis1Y=this.localAngAxis1X*tmpM[3]+this.localAngAxis1Y*tmpM[4]+this.localAngAxis1Z*tmpM[5];
    this.angAxis1Z=this.localAngAxis1X*tmpM[6]+this.localAngAxis1Y*tmpM[7]+this.localAngAxis1Z*tmpM[8];
    tmp1X=this.localRelativeAnchorPosition1.x;
    tmp1Y=this.localRelativeAnchorPosition1.y;
    tmp1Z=this.localRelativeAnchorPosition1.z;
    this.relPos1X=this.relativeAnchorPosition1.x=tmp1X*tmpM[0]+tmp1Y*tmpM[1]+tmp1Z*tmpM[2];
    this.relPos1Y=this.relativeAnchorPosition1.y=tmp1X*tmpM[3]+tmp1Y*tmpM[4]+tmp1Z*tmpM[5];
    this.relPos1Z=this.relativeAnchorPosition1.z=tmp1X*tmpM[6]+tmp1Y*tmpM[7]+tmp1Z*tmpM[8];
    tmpM=this.body2.rotation.elements;
    this.binX=this.localAxis2X*tmpM[0]+this.localAxis2Y*tmpM[1]+this.localAxis2Z*tmpM[2];
    this.binY=this.localAxis2X*tmpM[3]+this.localAxis2Y*tmpM[4]+this.localAxis2Z*tmpM[5];
    this.binZ=this.localAxis2X*tmpM[6]+this.localAxis2Y*tmpM[7]+this.localAxis2Z*tmpM[8];
    this.angAxis2X=this.localAngAxis2X*tmpM[0]+this.localAngAxis2Y*tmpM[1]+this.localAngAxis2Z*tmpM[2];
    this.angAxis2Y=this.localAngAxis2X*tmpM[3]+this.localAngAxis2Y*tmpM[4]+this.localAngAxis2Z*tmpM[5];
    this.angAxis2Z=this.localAngAxis2X*tmpM[6]+this.localAngAxis2Y*tmpM[7]+this.localAngAxis2Z*tmpM[8];
    tmp1X=this.localRelativeAnchorPosition2.x;
    tmp1Y=this.localRelativeAnchorPosition2.y;
    tmp1Z=this.localRelativeAnchorPosition2.z;
    this.relPos2X=this.relativeAnchorPosition2.x=tmp1X*tmpM[0]+tmp1Y*tmpM[1]+tmp1Z*tmpM[2];
    this.relPos2Y=this.relativeAnchorPosition2.y=tmp1X*tmpM[3]+tmp1Y*tmpM[4]+tmp1Z*tmpM[5];
    this.relPos2Z=this.relativeAnchorPosition2.z=tmp1X*tmpM[6]+tmp1Y*tmpM[7]+tmp1Z*tmpM[8];
    this.anchorPosition1.x=this.relPos1X+this.body1.position.x;
    this.anchorPosition1.y=this.relPos1Y+this.body1.position.y;
    this.anchorPosition1.z=this.relPos1Z+this.body1.position.z;
    this.anchorPosition2.x=this.relPos2X+this.body2.position.x;
    this.anchorPosition2.y=this.relPos2Y+this.body2.position.y;
    this.anchorPosition2.z=this.relPos2Z+this.body2.position.z;
    this.norX=this.binY*this.tanZ-this.binZ*this.tanY;
    this.norY=this.binZ*this.tanX-this.binX*this.tanZ;
    this.norZ=this.binX*this.tanY-this.binY*this.tanX;
    tmp1X=Math.sqrt(this.norX*this.norX+this.norY*this.norY+this.norZ*this.norZ);
    if(tmp1X>0)tmp1X=1/tmp1X;
    this.norX*=tmp1X;
    this.norY*=tmp1X;
    this.norZ*=tmp1X;
    if(
    this.tanX*(this.angAxis1Y*this.binZ-this.angAxis1Z*this.binY)+
    this.tanY*(this.angAxis1Z*this.binX-this.angAxis1X*this.binZ)+
    this.tanZ*(this.angAxis1X*this.binY-this.angAxis1Y*this.binX)<0
    ){
    this.angle1=-Math.acos(this.angAxis1X*this.binX+this.angAxis1Y*this.binY+this.angAxis1Z*this.binZ);
    }else{
    this.angle1=Math.acos(this.angAxis1X*this.binX+this.angAxis1Y*this.binY+this.angAxis1Z*this.binZ);
    }
    if(
    this.binX*(this.angAxis2Y*this.tanZ-this.angAxis2Z*this.tanY)+
    this.binY*(this.angAxis2Z*this.tanX-this.angAxis2X*this.tanZ)+
    this.binZ*(this.angAxis2X*this.tanY-this.angAxis2Y*this.tanX)<0
    ){
    this.angle2=Math.acos(this.angAxis2X*this.tanX+this.angAxis2Y*this.tanY+this.angAxis2Z*this.tanZ);
    }else{
    this.angle2=-Math.acos(this.angAxis2X*this.tanX+this.angAxis2Y*this.tanY+this.angAxis2Z*this.tanZ);
    }
    tmpM=this.body1.invertInertia.elements;
    this.invI1e00=tmpM[0];
    this.invI1e01=tmpM[1];
    this.invI1e02=tmpM[2];
    this.invI1e10=tmpM[3];
    this.invI1e11=tmpM[4];
    this.invI1e12=tmpM[5];
    this.invI1e20=tmpM[6];
    this.invI1e21=tmpM[7];
    this.invI1e22=tmpM[8];
    tmpM=this.body2.invertInertia.elements;
    this.invI2e00=tmpM[0];
    this.invI2e01=tmpM[1];
    this.invI2e02=tmpM[2];
    this.invI2e10=tmpM[3];
    this.invI2e11=tmpM[4];
    this.invI2e12=tmpM[5];
    this.invI2e20=tmpM[6];
    this.invI2e21=tmpM[7];
    this.invI2e22=tmpM[8];
    this.xTorqueUnit1X=this.relPos1Z*this.invI1e01-this.relPos1Y*this.invI1e02;
    this.xTorqueUnit1Y=this.relPos1Z*this.invI1e11-this.relPos1Y*this.invI1e12;
    this.xTorqueUnit1Z=this.relPos1Z*this.invI1e21-this.relPos1Y*this.invI1e22;
    this.xTorqueUnit2X=this.relPos2Z*this.invI2e01-this.relPos2Y*this.invI2e02;
    this.xTorqueUnit2Y=this.relPos2Z*this.invI2e11-this.relPos2Y*this.invI2e12;
    this.xTorqueUnit2Z=this.relPos2Z*this.invI2e21-this.relPos2Y*this.invI2e22;
    this.yTorqueUnit1X=-this.relPos1Z*this.invI1e00+this.relPos1X*this.invI1e02;
    this.yTorqueUnit1Y=-this.relPos1Z*this.invI1e10+this.relPos1X*this.invI1e12;
    this.yTorqueUnit1Z=-this.relPos1Z*this.invI1e20+this.relPos1X*this.invI1e22;
    this.yTorqueUnit2X=-this.relPos2Z*this.invI2e00+this.relPos2X*this.invI2e02;
    this.yTorqueUnit2Y=-this.relPos2Z*this.invI2e10+this.relPos2X*this.invI2e12;
    this.yTorqueUnit2Z=-this.relPos2Z*this.invI2e20+this.relPos2X*this.invI2e22;
    this.zTorqueUnit1X=this.relPos1Y*this.invI1e00-this.relPos1X*this.invI1e01;
    this.zTorqueUnit1Y=this.relPos1Y*this.invI1e10-this.relPos1X*this.invI1e11;
    this.zTorqueUnit1Z=this.relPos1Y*this.invI1e20-this.relPos1X*this.invI1e21;
    this.zTorqueUnit2X=this.relPos2Y*this.invI2e00-this.relPos2X*this.invI2e01;
    this.zTorqueUnit2Y=this.relPos2Y*this.invI2e10-this.relPos2X*this.invI2e11;
    this.zTorqueUnit2Z=this.relPos2Y*this.invI2e20-this.relPos2X*this.invI2e21;
    this.d00=this.invM1+this.invM2;
    this.d01=0;
    this.d02=0;
    this.d10=0;
    this.d11=this.d00;
    this.d12=0;
    this.d20=0;
    this.d21=0;
    this.d22=this.d00;
    t01=-this.relPos1Z;
    t02=this.relPos1Y;
    t10=this.relPos1Z;
    t12=-this.relPos1X;
    t20=-this.relPos1Y;
    t21=this.relPos1X;
    u00=this.invI1e01*t10+this.invI1e02*t20;
    u01=this.invI1e00*t01+this.invI1e02*t21;
    u02=this.invI1e00*t02+this.invI1e01*t12;
    u10=this.invI1e11*t10+this.invI1e12*t20;
    u11=this.invI1e10*t01+this.invI1e12*t21;
    u12=this.invI1e10*t02+this.invI1e11*t12;
    u20=this.invI1e21*t10+this.invI1e22*t20;
    u21=this.invI1e20*t01+this.invI1e22*t21;
    u22=this.invI1e20*t02+this.invI1e21*t12;
    this.d00-=t01*u10+t02*u20;
    this.d01-=t01*u11+t02*u21;
    this.d02-=t01*u12+t02*u22;
    this.d10-=t10*u00+t12*u20;
    this.d11-=t10*u01+t12*u21;
    this.d12-=t10*u02+t12*u22;
    this.d20-=t20*u00+t21*u10;
    this.d21-=t20*u01+t21*u11;
    this.d22-=t20*u02+t21*u12;
    t01=-this.relPos2Z;
    t02=this.relPos2Y;
    t10=this.relPos2Z;
    t12=-this.relPos2X;
    t20=-this.relPos2Y;
    t21=this.relPos2X;
    u00=this.invI2e01*t10+this.invI2e02*t20;
    u01=this.invI2e00*t01+this.invI2e02*t21;
    u02=this.invI2e00*t02+this.invI2e01*t12;
    u10=this.invI2e11*t10+this.invI2e12*t20;
    u11=this.invI2e10*t01+this.invI2e12*t21;
    u12=this.invI2e10*t02+this.invI2e11*t12;
    u20=this.invI2e21*t10+this.invI2e22*t20;
    u21=this.invI2e20*t01+this.invI2e22*t21;
    u22=this.invI2e20*t02+this.invI2e21*t12;
    this.d00-=t01*u10+t02*u20;
    this.d01-=t01*u11+t02*u21;
    this.d02-=t01*u12+t02*u22;
    this.d10-=t10*u00+t12*u20;
    this.d11-=t10*u01+t12*u21;
    this.d12-=t10*u02+t12*u22;
    this.d20-=t20*u00+t21*u10;
    this.d21-=t20*u01+t21*u11;
    this.d22-=t20*u02+t21*u12;
    tmp1X=1/(this.d00*(this.d11*this.d22-this.d21*this.d12)+this.d10*(this.d21*this.d02-this.d01*this.d22)+this.d20*(this.d01*this.d12-this.d11*this.d02));
    t00=(this.d11*this.d22-this.d12*this.d21)*tmp1X;
    t01=(this.d02*this.d21-this.d01*this.d22)*tmp1X;
    t02=(this.d01*this.d12-this.d02*this.d11)*tmp1X;
    t10=(this.d12*this.d20-this.d10*this.d22)*tmp1X;
    t11=(this.d00*this.d22-this.d02*this.d20)*tmp1X;
    t12=(this.d02*this.d10-this.d00*this.d12)*tmp1X;
    t20=(this.d10*this.d21-this.d11*this.d20)*tmp1X;
    t21=(this.d01*this.d20-this.d00*this.d21)*tmp1X;
    t22=(this.d00*this.d11-this.d01*this.d10)*tmp1X;
    this.d00=t00;
    this.d01=t01;
    this.d02=t02;
    this.d10=t10;
    this.d11=t11;
    this.d12=t12;
    this.d20=t20;
    this.d21=t21;
    this.d22=t22;
    t00=this.invI1e00+this.invI2e00;
    t01=this.invI1e01+this.invI2e01;
    t02=this.invI1e02+this.invI2e02;
    t10=this.invI1e10+this.invI2e10;
    t11=this.invI1e11+this.invI2e11;
    t12=this.invI1e12+this.invI2e12;
    t20=this.invI1e20+this.invI2e20;
    t21=this.invI1e21+this.invI2e21;
    t22=this.invI1e22+this.invI2e22;
    this.norDenominator=
    1/(
    this.norX*(this.norX*t00+this.norY*t01+this.norZ*t02)+
    this.norY*(this.norX*t10+this.norY*t11+this.norZ*t12)+
    this.norZ*(this.norX*t20+this.norY*t21+this.norZ*t22)
    )
    ;
    this.invTanDenominator=
    this.tanX*(this.tanX*t00+this.tanY*t01+this.tanZ*t02)+
    this.tanY*(this.tanX*t10+this.tanY*t11+this.tanZ*t12)+
    this.tanZ*(this.tanX*t20+this.tanY*t21+this.tanZ*t22)
    ;
    this.tanDenominator=1/this.invTanDenominator;
    this.invBinDenominator=
    this.binX*(this.binX*t00+this.binY*t01+this.binZ*t02)+
    this.binY*(this.binX*t10+this.binY*t11+this.binZ*t12)+
    this.binZ*(this.binX*t20+this.binY*t21+this.binZ*t22)
    ;
    this.binDenominator=1/this.invBinDenominator;
    if(this.enableLimits1){
    if(this.angle1<this.lowerLimit1){
    if(this.limitSign1!=-1)this.limitTorque1=0;
    this.limitSign1=-1;
    }else if(this.angle1>this.upperLimit1){
    if(this.limitSign1!=1)this.limitTorque1=0;
    this.limitSign1=1;
    }else{
    this.limitSign1=0;
    this.limitTorque1=0;
    }
    }else{
    this.limitSign1=0;
    this.limitTorque1=0;
    }
    if(this.enableLimits2){
    if(this.angle2<this.lowerLimit2){
    if(this.limitSign2!=-1)this.limitTorque2=0;
    this.limitSign2=-1;
    }else if(this.angle2>this.upperLimit2){
    if(this.limitSign2!=1)this.limitTorque2=0;
    this.limitSign2=1;
    }else{
    this.limitSign2=0;
    this.limitTorque2=0;
    }
    }else{
    this.limitSign2=0;
    this.limitTorque2=0;
    }
    if(this.enableMotor1){
    this.stepMotorTorque1=timeStep*this.maxMotorTorque1;
    }
    if(this.enableMotor2){
    this.stepMotorTorque2=timeStep*this.maxMotorTorque2;
    }
    this.torqueNor*=0.95;
    this.motorTorque1*=0.95;
    this.limitTorque1*=0.95;
    this.motorTorque2*=0.95;
    this.limitTorque2*=0.95;
    tmp1X=this.motorTorque1+this.limitTorque1;
    tmp1Y=this.motorTorque2+this.limitTorque2;
    this.torqueX=this.torqueNor*this.norX+tmp1X*this.tanX+tmp1Y*this.binX;
    this.torqueY=this.torqueNor*this.norY+tmp1X*this.tanY+tmp1Y*this.binY;
    this.torqueZ=this.torqueNor*this.norZ+tmp1X*this.tanZ+tmp1Y*this.binZ;
    this.lVel1.x+=this.impulseX*this.invM1;
    this.lVel1.y+=this.impulseY*this.invM1;
    this.lVel1.z+=this.impulseZ*this.invM1;
    this.aVel1.x+=this.xTorqueUnit1X*this.impulseX+this.yTorqueUnit1X*this.impulseY+this.zTorqueUnit1X*this.impulseZ+this.torqueX*this.invI1e00+this.torqueY*this.invI1e01+this.torqueZ*this.invI1e02;
    this.aVel1.y+=this.xTorqueUnit1Y*this.impulseX+this.yTorqueUnit1Y*this.impulseY+this.zTorqueUnit1Y*this.impulseZ+this.torqueX*this.invI1e10+this.torqueY*this.invI1e11+this.torqueZ*this.invI1e12;
    this.aVel1.z+=this.xTorqueUnit1Z*this.impulseX+this.yTorqueUnit1Z*this.impulseY+this.zTorqueUnit1Z*this.impulseZ+this.torqueX*this.invI1e20+this.torqueY*this.invI1e21+this.torqueZ*this.invI1e22;
    this.lVel2.x-=this.impulseX*this.invM2;
    this.lVel2.y-=this.impulseY*this.invM2;
    this.lVel2.z-=this.impulseZ*this.invM2;
    this.aVel2.x-=this.xTorqueUnit2X*this.impulseX+this.yTorqueUnit2X*this.impulseY+this.zTorqueUnit2X*this.impulseZ+this.torqueX*this.invI2e00+this.torqueY*this.invI2e01+this.torqueZ*this.invI2e02;
    this.aVel2.y-=this.xTorqueUnit2Y*this.impulseX+this.yTorqueUnit2Y*this.impulseY+this.zTorqueUnit2Y*this.impulseZ+this.torqueX*this.invI2e10+this.torqueY*this.invI2e11+this.torqueZ*this.invI2e12;
    this.aVel2.z-=this.xTorqueUnit2Z*this.impulseX+this.yTorqueUnit2Z*this.impulseY+this.zTorqueUnit2Z*this.impulseZ+this.torqueX*this.invI2e20+this.torqueY*this.invI2e21+this.torqueZ*this.invI2e22;
    this.targetVelX=this.anchorPosition2.x-this.anchorPosition1.x;
    this.targetVelY=this.anchorPosition2.y-this.anchorPosition1.y;
    this.targetVelZ=this.anchorPosition2.z-this.anchorPosition1.z;
    tmp1X=Math.sqrt(this.targetVelX*this.targetVelX+this.targetVelY*this.targetVelY+this.targetVelZ*this.targetVelZ);
    if(tmp1X<0.005){
    this.targetVelX=0;
    this.targetVelY=0;
    this.targetVelZ=0;
    }else{
    tmp1X=(0.005-tmp1X)/tmp1X*invTimeStep*0.05;
    this.targetVelX*=tmp1X;
    this.targetVelY*=tmp1X;
    this.targetVelZ*=tmp1X;
    }
    this.targetAngVelNor=-(this.tanX*this.binX+this.tanY*this.binY+this.tanZ*this.binZ);
    if(this.targetAngVelNor>0.02)this.targetAngVelNor=(this.targetAngVelNor-0.02)*invTimeStep*0.05;
    else if(this.targetAngVelNor<-0.02)this.targetAngVelNor=(this.targetAngVelNor+0.02)*invTimeStep*0.05;
    else this.targetAngVelNor=0;
    if(this.limitSign1==-1){
    this.targetAngVelTan=this.lowerLimit1-this.angle1;
    if(this.targetAngVelTan<0.02)this.targetAngVelTan=0;
    else this.targetAngVelTan=(this.targetAngVelTan-0.02)*invTimeStep*0.05;
    }else if(this.limitSign1==1){
    this.targetAngVelTan=this.upperLimit1-this.angle1;
    if(this.targetAngVelTan>-0.02)this.targetAngVelTan=0;
    else this.targetAngVelTan=(this.targetAngVelTan+0.02)*invTimeStep*0.05;
    }else{
    this.targetAngVelTan=0;
    }
    if(this.limitSign2==-1){
    this.targetAngVelBin=this.lowerLimit2-this.angle2;
    if(this.targetAngVelBin<0.02)this.targetAngVelBin=0;
    else this.targetAngVelBin=(this.targetAngVelBin-0.02)*invTimeStep*0.05;
    }else if(this.limitSign2==1){
    this.targetAngVelBin=this.upperLimit2-this.angle2;
    if(this.targetAngVelBin>-0.02)this.targetAngVelBin=0;
    else this.targetAngVelBin=(this.targetAngVelBin+0.02)*invTimeStep*0.05;
    }else{
    this.targetAngVelBin=0;
    }
}
OIMO.Hinge2Joint.prototype.solve = function () {
    var relVelX;
    var relVelY;
    var relVelZ;
    var tmp;
    var newImpulseX;
    var newImpulseY;
    var newImpulseZ;
    var newTorqueNor;
    var newTorqueTan;
    var newTorqueBin;
    var oldMotorTorque1;
    var newMotorTorque1;
    var oldLimitTorque1;
    var newLimitTorque1;
    var oldMotorTorque2;
    var newMotorTorque2;
    var oldLimitTorque2;
    var newLimitTorque2;
    relVelX=this.lVel2.x-this.lVel1.x+this.aVel2.y*this.relPos2Z-this.aVel2.z*this.relPos2Y-this.aVel1.y*this.relPos1Z+this.aVel1.z*this.relPos1Y-this.targetVelX;
    relVelY=this.lVel2.y-this.lVel1.y+this.aVel2.z*this.relPos2X-this.aVel2.x*this.relPos2Z-this.aVel1.z*this.relPos1X+this.aVel1.x*this.relPos1Z-this.targetVelY;
    relVelZ=this.lVel2.z-this.lVel1.z+this.aVel2.x*this.relPos2Y-this.aVel2.y*this.relPos2X-this.aVel1.x*this.relPos1Y+this.aVel1.y*this.relPos1X-this.targetVelZ;
    newImpulseX=relVelX*this.d00+relVelY*this.d01+relVelZ*this.d02;
    newImpulseY=relVelX*this.d10+relVelY*this.d11+relVelZ*this.d12;
    newImpulseZ=relVelX*this.d20+relVelY*this.d21+relVelZ*this.d22;
    this.impulseX+=newImpulseX;
    this.impulseY+=newImpulseY;
    this.impulseZ+=newImpulseZ;
    this.lVel1.x+=newImpulseX*this.invM1;
    this.lVel1.y+=newImpulseY*this.invM1;
    this.lVel1.z+=newImpulseZ*this.invM1;
    this.aVel1.x+=this.xTorqueUnit1X*newImpulseX+this.yTorqueUnit1X*newImpulseY+this.zTorqueUnit1X*newImpulseZ;
    this.aVel1.y+=this.xTorqueUnit1Y*newImpulseX+this.yTorqueUnit1Y*newImpulseY+this.zTorqueUnit1Y*newImpulseZ;
    this.aVel1.z+=this.xTorqueUnit1Z*newImpulseX+this.yTorqueUnit1Z*newImpulseY+this.zTorqueUnit1Z*newImpulseZ;
    this.lVel2.x-=newImpulseX*this.invM2;
    this.lVel2.y-=newImpulseY*this.invM2;
    this.lVel2.z-=newImpulseZ*this.invM2;
    this.aVel2.x-=this.xTorqueUnit2X*newImpulseX+this.yTorqueUnit2X*newImpulseY+this.zTorqueUnit2X*newImpulseZ;
    this.aVel2.y-=this.xTorqueUnit2Y*newImpulseX+this.yTorqueUnit2Y*newImpulseY+this.zTorqueUnit2Y*newImpulseZ;
    this.aVel2.z-=this.xTorqueUnit2Z*newImpulseX+this.yTorqueUnit2Z*newImpulseY+this.zTorqueUnit2Z*newImpulseZ;
    relVelX=this.aVel2.x-this.aVel1.x;
    relVelY=this.aVel2.y-this.aVel1.y;
    relVelZ=this.aVel2.z-this.aVel1.z;
    tmp=relVelX*this.tanX+relVelY*this.tanY+relVelZ*this.tanZ;
    if(this.enableMotor1){
    newMotorTorque1=(tmp-this.motorSpeed1)*this.tanDenominator;
    oldMotorTorque1=this.motorTorque1;
    this.motorTorque1+=newMotorTorque1;
    if(this.motorTorque1>this.stepMotorTorque1)this.motorTorque1=this.stepMotorTorque1;
    else if(this.motorTorque1<-this.stepMotorTorque1)this.motorTorque1=-this.stepMotorTorque1;
    newMotorTorque1=this.motorTorque1-oldMotorTorque1;
    tmp-=newMotorTorque1*this.invTanDenominator;
    }else newMotorTorque1=0;
    if(this.limitSign1!=0){
    newLimitTorque1=(tmp-this.targetAngVelTan)*this.tanDenominator;
    oldLimitTorque1=this.limitTorque1;
    this.limitTorque1+=newLimitTorque1;
    if(this.limitTorque1*this.limitSign1<0)this.limitTorque1=0;
    newLimitTorque1=this.limitTorque1-oldLimitTorque1;
    }else newLimitTorque1=0;
    tmp=relVelX*this.binX+relVelY*this.binY+relVelZ*this.binZ;
    if(this.enableMotor2){
    newMotorTorque2=(tmp-this.motorSpeed2)*this.binDenominator;
    oldMotorTorque2=this.motorTorque2;
    this.motorTorque2+=newMotorTorque2;
    if(this.motorTorque2>this.stepMotorTorque2)this.motorTorque2=this.stepMotorTorque2;
    else if(this.motorTorque2<-this.stepMotorTorque2)this.motorTorque2=-this.stepMotorTorque2;
    newMotorTorque2=this.motorTorque2-oldMotorTorque2;
    tmp-=newMotorTorque2*this.invBinDenominator;
    }else newMotorTorque2=0;
    if(this.limitSign2!=0){
    newLimitTorque2=(tmp-this.targetAngVelBin)*this.binDenominator;
    oldLimitTorque2=this.limitTorque2;
    this.limitTorque2+=newLimitTorque2;
    if(this.limitTorque2*this.limitSign2<0)this.limitTorque2=0;
    newLimitTorque2=this.limitTorque2-oldLimitTorque2;
    }else newLimitTorque2=0;
    newTorqueNor=(relVelX*this.norX+relVelY*this.norY+relVelZ*this.norZ-this.targetAngVelNor)*this.norDenominator;
    newTorqueTan=newMotorTorque1+newLimitTorque1;
    newTorqueBin=newMotorTorque2+newLimitTorque2;
    this.torqueNor+=newTorqueNor;
    newImpulseX=newTorqueNor*this.norX+newTorqueTan*this.tanX+newTorqueBin*this.binX;
    newImpulseY=newTorqueNor*this.norY+newTorqueTan*this.tanY+newTorqueBin*this.binY;
    newImpulseZ=newTorqueNor*this.norZ+newTorqueTan*this.tanZ+newTorqueBin*this.binZ;
    this.aVel1.x+=this.invI1e00*newImpulseX+this.invI1e01*newImpulseY+this.invI1e02*newImpulseZ;
    this.aVel1.y+=this.invI1e10*newImpulseX+this.invI1e11*newImpulseY+this.invI1e12*newImpulseZ;
    this.aVel1.z+=this.invI1e20*newImpulseX+this.invI1e21*newImpulseY+this.invI1e22*newImpulseZ;
    this.aVel2.x-=this.invI2e00*newImpulseX+this.invI2e01*newImpulseY+this.invI2e02*newImpulseZ;
    this.aVel2.y-=this.invI2e10*newImpulseX+this.invI2e11*newImpulseY+this.invI2e12*newImpulseZ;
    this.aVel2.z-=this.invI2e20*newImpulseX+this.invI2e21*newImpulseY+this.invI2e22*newImpulseZ;
}
OIMO.Hinge2Joint.prototype.postSolve = function () {
    this.impulse.x=this.impulseX;
    this.impulse.y=this.impulseY;
    this.impulse.z=this.impulseZ;
    this.torque.x=this.torqueX;
    this.torque.y=this.torqueY;
    this.torque.z=this.torqueZ;
}