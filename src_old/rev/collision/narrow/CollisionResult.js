OIMO.CollisionResult = function(maxContactInfos){
    this.numContactInfos = 0;
    this.maxContactInfos=maxContactInfos;
    this.contactInfos=[];
}
OIMO.CollisionResult.prototype = {
    constructor: OIMO.CollisionResult,

    addContactInfo:function(positionX,positionY,positionZ,normalX,normalY,normalZ,overlap,shape1,shape2,data1,data2,flip){
        if(this.numContactInfos==this.maxContactInfos)return;
        if(!this.contactInfos[this.numContactInfos]){
            this.contactInfos[this.numContactInfos]=new OIMO.ContactInfo();
        }
        var c=this.contactInfos[this.numContactInfos++];
        c.position.x=positionX;
        c.position.y=positionY;
        c.position.z=positionZ;
        c.normal.x=normalX;
        c.normal.y=normalY;
        c.normal.z=normalZ;
        c.overlap=overlap;
        c.shape1=shape1;
        c.shape2=shape2;
        c.id.data1=data1;
        c.id.data2=data2;
        c.id.flip=flip;
    }
}