OIMO.Proxy = function(minX,maxX,minY,maxY,minZ,maxZ){
    this.minX=minX || 0;
    this.maxX=maxX || 0;
    this.minY=minY || 0;
    this.maxY=maxY || 0;
    this.minZ=minZ || 0;
    this.maxZ=maxZ || 0;
    this.parent=null;
};
OIMO.Proxy.prototype = {
    constructor: OIMO.Proxy,

    init:function(minX,maxX,minY,maxY,minZ,maxZ){
        this.minX=minX || 0;
        this.maxX=maxX || 0;
        this.minY=minY || 0;
        this.maxY=maxY || 0;
        this.minZ=minZ || 0;
        this.maxZ=maxZ || 0;
    },
    intersect:function(proxy){
        return this.maxX>proxy.minX&&this.minX<proxy.maxX&&this.maxY>proxy.minY&&this.minY<proxy.maxY&&this.maxZ>proxy.minZ&&this.minZ<proxy.maxZ;
    }
}