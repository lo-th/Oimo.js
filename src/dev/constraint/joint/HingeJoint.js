OIMO.HingeJoint = function(config,lowerAngleLimit,upperAngleLimit){
    OIMO.Joint.call( this, config);

    this.localAxis1=new OIMO.Vec3().normalize(config.localAxis1);
    this.localAxis2=new OIMO.Vec3().normalize(config.localAxis2);
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
    var arc=new OIMO.Mat33().setQuat(new OIMO.Quat().arc(this.localAxis1,this.localAxis2));
    var tarc = arc.elements;
    this.localAngAxis2X=this.localAngAxis1X*tarc[0]+this.localAngAxis1Y*tarc[1]+this.localAngAxis1Z*tarc[2];
    this.localAngAxis2Y=this.localAngAxis1X*tarc[3]+this.localAngAxis1Y*tarc[4]+this.localAngAxis1Z*tarc[5];
    this.localAngAxis2Z=this.localAngAxis1X*tarc[6]+this.localAngAxis1Y*tarc[7]+this.localAngAxis1Z*tarc[8];
    this.type=this.JOINT_HINGE;
    this.nor=new OIMO.Vec3();
    this.tan=new OIMO.Vec3();
    this.bin=new OIMO.Vec3();
    this.limitMotor=new OIMO.LimitMotor(this.nor,false);
    this.limitMotor.lowerLimit=lowerAngleLimit;
    this.limitMotor.upperLimit=upperAngleLimit;
    this.lc=new OIMO.LinearConstraint(this);
    this.r3=new OIMO.Rotational3Constraint(this,this.limitMotor,new OIMO.LimitMotor(this.tan,true),new OIMO.LimitMotor(this.bin,true));
}
OIMO.HingeJoint.prototype = Object.create( OIMO.Joint.prototype );
OIMO.HingeJoint.prototype.preSolve = function (timeStep,invTimeStep) {
    var tmpM;
    var tmp1X;
    var tmp1Y;
    var tmp1Z;
    this.updateAnchorPoints();
    tmpM=this.body1.rotation.elements;
    var axis1X=this.localAxis1X*tmpM[0]+this.localAxis1Y*tmpM[1]+this.localAxis1Z*tmpM[2];
    var axis1Y=this.localAxis1X*tmpM[3]+this.localAxis1Y*tmpM[4]+this.localAxis1Z*tmpM[5];
    var axis1Z=this.localAxis1X*tmpM[6]+this.localAxis1Y*tmpM[7]+this.localAxis1Z*tmpM[8];
    var angAxis1X=this.localAngAxis1X*tmpM[0]+this.localAngAxis1Y*tmpM[1]+this.localAngAxis1Z*tmpM[2];
    var angAxis1Y=this.localAngAxis1X*tmpM[3]+this.localAngAxis1Y*tmpM[4]+this.localAngAxis1Z*tmpM[5];
    var angAxis1Z=this.localAngAxis1X*tmpM[6]+this.localAngAxis1Y*tmpM[7]+this.localAngAxis1Z*tmpM[8];
    tmpM=this.body2.rotation.elements;
    var axis2X=this.localAxis2X*tmpM[0]+this.localAxis2Y*tmpM[1]+this.localAxis2Z*tmpM[2];
    var axis2Y=this.localAxis2X*tmpM[3]+this.localAxis2Y*tmpM[4]+this.localAxis2Z*tmpM[5];
    var axis2Z=this.localAxis2X*tmpM[6]+this.localAxis2Y*tmpM[7]+this.localAxis2Z*tmpM[8];
    var angAxis2X=this.localAngAxis2X*tmpM[0]+this.localAngAxis2Y*tmpM[1]+this.localAngAxis2Z*tmpM[2];
    var angAxis2Y=this.localAngAxis2X*tmpM[3]+this.localAngAxis2Y*tmpM[4]+this.localAngAxis2Z*tmpM[5];
    var angAxis2Z=this.localAngAxis2X*tmpM[6]+this.localAngAxis2Y*tmpM[7]+this.localAngAxis2Z*tmpM[8];
   
    var nx=axis1X*this.body2.inverseMass+axis2X*this.body1.inverseMass;
    var ny=axis1Y*this.body2.inverseMass+axis2Y*this.body1.inverseMass;
    var nz=axis1Z*this.body2.inverseMass+axis2Z*this.body1.inverseMass;
    tmp1X=Math.sqrt(nx*nx+ny*ny+nz*nz);
    if(tmp1X>0)tmp1X=1/tmp1X;
    nx*=tmp1X;
    ny*=tmp1X;
    nz*=tmp1X;
    var tx=ny*nx-nz*nz;
    var ty=-nz*ny-nx*nx;
    var tz=nx*nz+ny*ny;
    tmp1X=1/Math.sqrt(tx*tx+ty*ty+tz*tz);
    tx*=tmp1X;
    ty*=tmp1X;
    tz*=tmp1X;
    var bx=ny*tz-nz*ty;
    var by=nz*tx-nx*tz;
    var bz=nx*ty-ny*tx;
    this.nor.init(nx,ny,nz);
    this.tan.init(tx,ty,tz);
    this.bin.init(bx,by,bz);
    if(
    nx*(angAxis1Y*angAxis2Z-angAxis1Z*angAxis2Y)+
    ny*(angAxis1Z*angAxis2X-angAxis1X*angAxis2Z)+
    nz*(angAxis1X*angAxis2Y-angAxis1Y*angAxis2X)<0
    ){
    this.limitMotor.angle=-this.acosClamp(angAxis1X*angAxis2X+angAxis1Y*angAxis2Y+angAxis1Z*angAxis2Z);
    }else{
    this.limitMotor.angle=this.acosClamp(angAxis1X*angAxis2X+angAxis1Y*angAxis2Y+angAxis1Z*angAxis2Z);
    }
    tmp1X=axis1Y*axis2Z-axis1Z*axis2Y;
    tmp1Y=axis1Z*axis2X-axis1X*axis2Z;
    tmp1Z=axis1X*axis2Y-axis1Y*axis2X;
    this.r3.limitMotor2.angle=tx*tmp1X+ty*tmp1Y+tz*tmp1Z;
    this.r3.limitMotor3.angle=bx*tmp1X+by*tmp1Y+bz*tmp1Z;
    this.r3.preSolve(timeStep,invTimeStep);
    this.lc.preSolve(timeStep,invTimeStep);
}
OIMO.HingeJoint.prototype.solve = function () {
    this.r3.solve();
    this.lc.solve();
}
OIMO.HingeJoint.prototype.postSolve = function () {
}
OIMO.HingeJoint.prototype.acosClamp = function(cos){
    if(cos>1)return 0;
    else if(cos<-1)return Math.PI;
    else return Math.acos(cos);
}