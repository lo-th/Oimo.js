OIMO.WheelJoint = function(config){
    OIMO.Joint.call( this, config);

    this.localAxis1=new OIMO.Vec3().normalize(config.localAxis1);
    this.localAxis2=new OIMO.Vec3().normalize(config.localAxis2);
    var len;
    this.localAxis1X=this.localAxis1.x;
    this.localAxis1Y=this.localAxis1.y;
    this.localAxis1Z=this.localAxis1.z;
    this.localAxis2X=this.localAxis2.x;
    this.localAxis2Y=this.localAxis2.y;
    this.localAxis2Z=this.localAxis2.z;
    var dot=this.localAxis1X*this.localAxis2X+this.localAxis1Y*this.localAxis2Y+this.localAxis1Z*this.localAxis2Z;
    if(dot>-1&&dot<1){
        this.localAngAxis1X=this.localAxis2X-dot*this.localAxis1X;
        this.localAngAxis1Y=this.localAxis2Y-dot*this.localAxis1Y;
        this.localAngAxis1Z=this.localAxis2Z-dot*this.localAxis1Z;
        this.localAngAxis2X=this.localAxis1X-dot*this.localAxis2X;
        this.localAngAxis2Y=this.localAxis1Y-dot*this.localAxis2Y;
        this.localAngAxis2Z=this.localAxis1Z-dot*this.localAxis2Z;
        len=1/Math.sqrt(this.localAngAxis1X*this.localAngAxis1X+this.localAngAxis1Y*this.localAngAxis1Y+this.localAngAxis1Z*this.localAngAxis1Z);
        this.localAngAxis1X*=len;
        this.localAngAxis1Y*=len;
        this.localAngAxis1Z*=len;
        len=1/Math.sqrt(this.localAngAxis2X*this.localAngAxis2X+this.localAngAxis2Y*this.localAngAxis2Y+this.localAngAxis2Z*this.localAngAxis2Z);
        this.localAngAxis2X*=len;
        this.localAngAxis2Y*=len;
        this.localAngAxis2Z*=len;
    }else{
        this.localAngAxis1X=this.localAxis1Y*this.localAxis1X-this.localAxis1Z*this.localAxis1Z;
        this.localAngAxis1Y=-this.localAxis1Z*this.localAxis1Y-this.localAxis1X*this.localAxis1X;
        this.localAngAxis1Z=this.localAxis1X*this.localAxis1Z+this.localAxis1Y*this.localAxis1Y;
        len=1/Math.sqrt(this.localAngAxis1X*this.localAngAxis1X+this.localAngAxis1Y*this.localAngAxis1Y+this.localAngAxis1Z*this.localAngAxis1Z);
        this.localAngAxis1X*=len;
        this.localAngAxis1Y*=len;
        this.localAngAxis1Z*=len;
        var arc=new OIMO.Mat33().setQuat(new OIMO.Quat().arc(this.localAxis1,this.localAxis2));
        var tarc = arc.elements;
        this.localAngAxis2X=this.localAngAxis1X*tarc[0]+this.localAngAxis1Y*tarc[1]+this.localAngAxis1Z*tarc[2];
        this.localAngAxis2Y=this.localAngAxis1X*tarc[3]+this.localAngAxis1Y*tarc[4]+this.localAngAxis1Z*tarc[5];
        this.localAngAxis2Z=this.localAngAxis1X*tarc[6]+this.localAngAxis1Y*tarc[7]+this.localAngAxis1Z*tarc[8];
    }
    this.type=this.JOINT_WHEEL;
    this.nor=new OIMO.Vec3();
    this.tan=new OIMO.Vec3();
    this.bin=new OIMO.Vec3();
    this.translationalLimitMotor=new OIMO.LimitMotor(this.tan,true);
    this.translationalLimitMotor.frequency=8;
    this.translationalLimitMotor.dampingRatio=1;
    this.rotationalLimitMotor1=new OIMO.LimitMotor(this.tan,false);
    this.rotationalLimitMotor2=new OIMO.LimitMotor(this.bin,false);
    this.t3=new OIMO.Translational3Constraint(this,new OIMO.LimitMotor(this.nor,true),this.translationalLimitMotor,new OIMO.LimitMotor(this.bin,true));
    this.t3.weight=1;
    this.r3=new OIMO.Rotational3Constraint(this,new OIMO.LimitMotor(this.nor,true),this.rotationalLimitMotor1,this.rotationalLimitMotor2);
}
OIMO.WheelJoint.prototype = Object.create( OIMO.Joint.prototype );
OIMO.WheelJoint.prototype.preSolve = function (timeStep,invTimeStep) {
    var tmpM;
    var tmp1X;
    var tmp1Y;
    var tmp1Z;
    this.updateAnchorPoints();
    tmpM=this.body1.rotation.elements;
    var x1=this.localAxis1X*tmpM[0]+this.localAxis1Y*tmpM[1]+this.localAxis1Z*tmpM[2];
    var y1=this.localAxis1X*tmpM[3]+this.localAxis1Y*tmpM[4]+this.localAxis1Z*tmpM[5];
    var z1=this.localAxis1X*tmpM[6]+this.localAxis1Y*tmpM[7]+this.localAxis1Z*tmpM[8];
    var angAxis1X=this.localAngAxis1X*tmpM[0]+this.localAngAxis1Y*tmpM[1]+this.localAngAxis1Z*tmpM[2];
    var angAxis1Y=this.localAngAxis1X*tmpM[3]+this.localAngAxis1Y*tmpM[4]+this.localAngAxis1Z*tmpM[5];
    var angAxis1Z=this.localAngAxis1X*tmpM[6]+this.localAngAxis1Y*tmpM[7]+this.localAngAxis1Z*tmpM[8];
    tmpM=this.body2.rotation.elements;
    var x2=this.localAxis2X*tmpM[0]+this.localAxis2Y*tmpM[1]+this.localAxis2Z*tmpM[2];
    var y2=this.localAxis2X*tmpM[3]+this.localAxis2Y*tmpM[4]+this.localAxis2Z*tmpM[5];
    var z2=this.localAxis2X*tmpM[6]+this.localAxis2Y*tmpM[7]+this.localAxis2Z*tmpM[8];
    var angAxis2X=this.localAngAxis2X*tmpM[0]+this.localAngAxis2Y*tmpM[1]+this.localAngAxis2Z*tmpM[2];
    var angAxis2Y=this.localAngAxis2X*tmpM[3]+this.localAngAxis2Y*tmpM[4]+this.localAngAxis2Z*tmpM[5];
    var angAxis2Z=this.localAngAxis2X*tmpM[6]+this.localAngAxis2Y*tmpM[7]+this.localAngAxis2Z*tmpM[8];
    
    this.r3.limitMotor1.angle=x1*x2+y1*y2+z1*z2;
    if(
    x1*(angAxis1Y*z2-angAxis1Z*y2)+
    y1*(angAxis1Z*x2-angAxis1X*z2)+
    z1*(angAxis1X*y2-angAxis1Y*x2)<0
    ){
    this.rotationalLimitMotor1.angle=-this.acosClamp(angAxis1X*x2+angAxis1Y*y2+angAxis1Z*z2);
    }else{
    this.rotationalLimitMotor1.angle=this.acosClamp(angAxis1X*x2+angAxis1Y*y2+angAxis1Z*z2);
    }
    if(
    x2*(angAxis2Y*z1-angAxis2Z*y1)+
    y2*(angAxis2Z*x1-angAxis2X*z1)+
    z2*(angAxis2X*y1-angAxis2Y*x1)<0
    ){
    this.rotationalLimitMotor2.angle=this.acosClamp(angAxis2X*x1+angAxis2Y*y1+angAxis2Z*z1);
    }else{
    this.rotationalLimitMotor2.angle=-this.acosClamp(angAxis2X*x1+angAxis2Y*y1+angAxis2Z*z1);
    }
    var nx=y2*z1-z2*y1;
    var ny=z2*x1-x2*z1;
    var nz=x2*y1-y2*x1;
    tmp1X=Math.sqrt(nx*nx+ny*ny+nz*nz);
    if(tmp1X>0)tmp1X=1/tmp1X;
    nx*=tmp1X;
    ny*=tmp1X;
    nz*=tmp1X;
    var tx=ny*z2-nz*y2;
    var ty=nz*x2-nx*z2;
    var tz=nx*y2-ny*x2;
    tmp1X=Math.sqrt(tx*tx+ty*ty+tz*tz);
    if(tmp1X>0)tmp1X=1/tmp1X;
    tx*=tmp1X;
    ty*=tmp1X;
    tz*=tmp1X;
    var bx=y1*nz-z1*ny;
    var by=z1*nx-x1*nz;
    var bz=x1*ny-y1*nx;
    tmp1X=Math.sqrt(bx*bx+by*by+bz*bz);
    if(tmp1X>0)tmp1X=1/tmp1X;
    bx*=tmp1X;
    by*=tmp1X;
    bz*=tmp1X;
    this.nor.init(nx,ny,nz);
    this.tan.init(tx,ty,tz);
    this.bin.init(bx,by,bz);
    this.r3.preSolve(timeStep,invTimeStep);
    this.t3.preSolve(timeStep,invTimeStep);
}
OIMO.WheelJoint.prototype.solve = function () {
    this.r3.solve();
    this.t3.solve();
}
OIMO.WheelJoint.prototype.postSolve = function () {
}
OIMO.WheelJoint.prototype.acosClamp = function(cos){
    if(cos>1)return 0;
    else if(cos<-1)return Math.PI;
    else return Math.acos(cos);
}