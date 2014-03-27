OIMO.ShapeConfig = function(){
    this.relativePosition=new OIMO.Vec3();
    this.relativeRotation=new OIMO.Mat33();
    this.friction=0.4;
    this.restitution=0.2;
    this.density=1;
    this.belongsTo=1;
    this.collidesWith=0xffffffff;
}