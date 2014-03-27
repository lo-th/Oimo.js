OIMO.ManifoldPoint = function(){
    this.warmStarted=false;
    this.position=new OIMO.Vec3();
    this.localPoint1=new OIMO.Vec3();
    this.localPoint2=new OIMO.Vec3();
    this.normal=new OIMO.Vec3();
    this.tangent=new OIMO.Vec3();
    this.binormal=new OIMO.Vec3();
    this.normalImpulse=0;
    this.tangentImpulse=0;
    this.binormalImpulse=0;
    this.normalDenominator=0;
    this.tangentDenominator=0;
    this.binormalDenominator=0;
    this.penetration=0;
}