OIMO.AABB = function(minX,maxX,minY,maxY,minZ,maxZ){
    this.minX=minX || 0;
    this.maxX=maxX || 0;
    this.minY=minY || 0;
    this.maxY=maxY || 0;
    this.minZ=minZ || 0;
    this.maxZ=maxZ || 0;
}

OIMO.AABB.prototype = {

    constructor: OIMO.AABB,

    init:function(minX,maxX,minY,maxY,minZ,maxZ){
        this.minX=minX;
        this.maxX=maxX;
        this.minY=minY;
        this.maxY=maxY;
        this.minZ=minZ;
        this.maxZ=maxZ;
    },
    combine:function(aabb1,aabb2){
        this.minX = (aabb1.minX<aabb2.minX) ? aabb1.minX : aabb2.minX;
        this.maxX = (aabb1.maxX>aabb2.maxX) ? aabb1.maxX : aabb2.maxX;
        this.minY = (aabb1.minY<aabb2.minY) ? aabb1.minY : aabb2.minY;
        this.maxY = (aabb1.maxY>aabb2.maxY) ? aabb1.maxY : aabb2.maxY;
        this.minZ = (aabb1.minZ<aabb2.minZ) ? aabb1.minZ : aabb2.minZ;
        this.maxZ = (aabb1.maxZ>aabb2.maxZ) ? aabb1.maxZ : aabb2.maxZ;

        /*var margin=0;
        this.minX-=margin;
        this.minY-=margin;
        this.minZ-=margin;
        this.maxX+=margin;
        this.maxY+=margin;
        this.maxZ+=margin;*/
    },
    surfaceArea:function(){
        var h=this.maxY-this.minY;
        var d=this.maxZ-this.minZ;
        return 2*((this.maxX-this.minX)*(h+d)+h*d);
    },
    intersectsWithPoint:function(x,y,z){
        return x>=this.minX&&x<=this.maxX&&y>=this.minY&&y<=this.maxY&&z>=this.minZ&&z<=this.maxZ;
    }
}