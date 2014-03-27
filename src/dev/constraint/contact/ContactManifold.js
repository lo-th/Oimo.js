OIMO.ContactManifold = function(){
    this.body1 = null;
    this.body2 = null;
    this.numPoints = 0;
    this.points = [];// vector 4
    this.points.length = 4;
    this.points[0] = new OIMO.ManifoldPoint();
    this.points[1] = new OIMO.ManifoldPoint();
    this.points[2] = new OIMO.ManifoldPoint();
    this.points[3] = new OIMO.ManifoldPoint();
}
OIMO.ContactManifold.prototype = {
    constructor: OIMO.ContactManifold,

    reset:function(shape1,shape2){
        this.body1=shape1.parent;
        this.body2=shape2.parent;
        this.numPoints=0;
    },
    addPoint:function(x,y,z,normalX,normalY,normalZ,penetration,flip){
        var p=this.points[this.numPoints++];
        p.position.x=x;
        p.position.y=y;
        p.position.z=z;
        var r=this.body1.rotation;
        var rx=x-this.body1.position.x;
        var ry=y-this.body1.position.y;
        var rz=z-this.body1.position.z;

        var tr = r.elements;
        p.localPoint1.x=rx*tr[0]+ry*tr[3]+rz*tr[6];
        p.localPoint1.y=rx*tr[1]+ry*tr[4]+rz*tr[7];
        p.localPoint1.z=rx*tr[2]+ry*tr[5]+rz*tr[8];
        r=this.body2.rotation;
        rx=x-this.body2.position.x;
        ry=y-this.body2.position.y;
        rz=z-this.body2.position.z;
        p.localPoint2.x=rx*tr[0]+ry*tr[3]+rz*tr[6];
        p.localPoint2.y=rx*tr[1]+ry*tr[4]+rz*tr[7];
        p.localPoint2.z=rx*tr[2]+ry*tr[5]+rz*tr[8];

        p.normalImpulse=0;
        if(flip){
            p.normal.x=-normalX;
            p.normal.y=-normalY;
            p.normal.z=-normalZ;
        }else{
            p.normal.x=normalX;
            p.normal.y=normalY;
            p.normal.z=normalZ;
        }
        p.penetration=penetration;
        p.warmStarted=false;
    }
}