OIMO.SAPProxy = function(sap,shape){
    OIMO.Proxy.call( this, shape);

    this.belongsTo = 0;
    this.max = [];
    this.min = [];
    
    this.sap=sap;
    this.min[0]=new OIMO.SAPElement(this,false);
    this.max[0]=new OIMO.SAPElement(this,true);
    this.min[1]=new OIMO.SAPElement(this,false);
    this.max[1]=new OIMO.SAPElement(this,true);
    this.min[2]=new OIMO.SAPElement(this,false);
    this.max[2]=new OIMO.SAPElement(this,true);
    this.max[0].pair=this.min[0];
    this.max[1].pair=this.min[1];
    this.max[2].pair=this.min[2];
    this.min[0].min1=this.min[1];
    this.min[0].max1=this.max[1];
    this.min[0].min2=this.min[2];
    this.min[0].max2=this.max[2];
    this.min[1].min1=this.min[0];
    this.min[1].max1=this.max[0];
    this.min[1].min2=this.min[2];
    this.min[1].max2=this.max[2];
    this.min[2].min1=this.min[0];
    this.min[2].max1=this.max[0];
    this.min[2].min2=this.min[1];
    this.min[2].max2=this.max[1];
};
OIMO.SAPProxy.prototype = Object.create( OIMO.Proxy.prototype );
OIMO.SAPProxy.prototype.isDynamic = function () {
    var body=this.shape.parent;
    return body.isDynamic&&!body.sleeping;
}
OIMO.SAPProxy.prototype.update = function () {
    this.min[0].value=this.aabb.minX;
    this.max[0].value=this.aabb.maxX;
    this.min[1].value=this.aabb.minY;
    this.max[1].value=this.aabb.maxY;
    this.min[2].value=this.aabb.minZ;
    this.max[2].value=this.aabb.maxZ;
    if(this.belongsTo==1&&!this.isDynamic()||this.belongsTo==2&&this.isDynamic()){
        this.sap.removeProxy(this);
        this.sap.addProxy(this);
    }
}