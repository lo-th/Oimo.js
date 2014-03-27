OIMO.JointConfig = function(){
    this.body1 = null;
    this.body2 = null;
    this.localAnchorPoint1=new OIMO.Vec3();
    this.localAnchorPoint2=new OIMO.Vec3();
    this.localAxis1=new OIMO.Vec3();
    this.localAxis2=new OIMO.Vec3();
    this.allowCollision=false;
}