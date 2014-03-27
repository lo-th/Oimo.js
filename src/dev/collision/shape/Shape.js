OIMO.Shape = function(config){
    this.prev=null;
    this.next=null;
    this.type=0;
    this.proxy=null;
    this.parent=null;
    this.contactLink=null;
    this.numContacts=0;

    this.id=OIMO.nextID++;
    this.position=new OIMO.Vec3();
    this.relativePosition=new OIMO.Vec3().copy(config.relativePosition);
    this.rotation=new OIMO.Mat33();
    this.relativeRotation=new OIMO.Mat33().copy(config.relativeRotation);
    this.aabb=new OIMO.AABB();
    this.density=config.density;
    this.friction=config.friction;
    this.restitution=config.restitution;
    this.belongsTo=config.belongsTo;
    this.collidesWith=config.collidesWith;
}

OIMO.Shape.prototype = {
    constructor: OIMO.Shape,

    calculateMassInfo:function(out){
        throw new Error("Inheritance error.");
    },
     updateProxy:function(){
        throw new Error("Inheritance error.");
    }
}