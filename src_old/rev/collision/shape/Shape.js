OIMO.Shape = function(){
    this.type=0;
    this.mass=NaN;
    this.friction=NaN;
    this.restitution=NaN;
    this.parent=null;
    this.contactList=null;
    this.numContacts=0;

    this.id=OIMO.nextID++;
    this.position=new OIMO.Vec3();
    this.relativePosition=new OIMO.Vec3();
    this.localRelativePosition=new OIMO.Vec3();

    this.rotation=new OIMO.Mat33();
    this.relativeRotation=new OIMO.Mat33();
    this.localInertia=new OIMO.Mat33();

    this.proxy=new OIMO.Proxy();
    this.proxy.parent=this;
}

OIMO.Shape.prototype = {
    constructor: OIMO.Shape,

     updateProxy:function(){
        throw new Error("Inheritance error.");
    }
}