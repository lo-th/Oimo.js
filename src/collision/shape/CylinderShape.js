/**
* A cylinder shape.
* @author saharan
* @author loth
*/
OIMO.CylinderShape = function(config,radius,height){
    OIMO.Shape.call( this, config );

    this.radius = radius;
    this.height = height;
    this.halfHeight = height*0.5;
    
    this.normalDirection = new OIMO.Vec3();
    this.halfDirection = new OIMO.Vec3();
    this.type = OIMO.SHAPE_CYLINDER;
};

OIMO.CylinderShape.prototype = Object.create( OIMO.Shape.prototype );

OIMO.CylinderShape.prototype.calculateMassInfo = function(out){
    var mass = OIMO.PI*this.radius*this.radius*this.height*this.density;
    var inertiaXZ = (1/4*this.radius*this.radius+1/12*this.height*this.height)*mass;
    var inertiaY = 1/2*this.radius*this.radius;
    out.mass = mass;
    out.inertia.init( inertiaXZ,0,0,  0,inertiaY,0,  0,0,inertiaXZ );
};

OIMO.CylinderShape.prototype.updateProxy = function(){
    var te = this.rotation.elements;
    var len;
    var wx;
    var hy;
    var dz;
    var dirX=te[1];
    var dirY=te[4];
    var dirZ=te[7];
    var xx=dirX*dirX;
    var yy=dirY*dirY;
    var zz=dirZ*dirZ;
    this.normalDirection.x=dirX;
    this.normalDirection.y=dirY;
    this.normalDirection.z=dirZ;
    this.halfDirection.x=dirX*this.halfHeight;
    this.halfDirection.y=dirY*this.halfHeight;
    this.halfDirection.z=dirZ*this.halfHeight;
    wx=1-dirX*dirX;
    len=OIMO.sqrt(wx*wx+xx*yy+xx*zz);
    if(len>0) len=this.radius/len;
    wx*=len;
    hy=1-dirY*dirY;
    len=OIMO.sqrt(yy*xx+hy*hy+yy*zz);
    if(len>0) len=this.radius/len;
    hy*=len;
    dz=1-dirZ*dirZ;
    len=OIMO.sqrt(zz*xx+zz*yy+dz*dz);
    if(len>0) len=this.radius/len;
    dz*=len;

    var w = (this.halfDirection.x<0) ? -this.halfDirection.x : this.halfDirection.x;
    var h = (this.halfDirection.y<0) ? -this.halfDirection.y : this.halfDirection.y;
    var d = (this.halfDirection.z<0) ? -this.halfDirection.z : this.halfDirection.z;

    w = (wx<0) ? w-wx : w+wx;
    h = (hy<0) ? h-hy : h+hy;
    d = (dz<0) ? d-dz : d+dz;

    var p = OIMO.AABB_PROX;

    this.aabb.init(
        this.position.x-w-p,this.position.x+w+p,
        this.position.y-h-p,this.position.y+h+p,
        this.position.z-d-p,this.position.z+d+p
    );

    if(this.proxy!==null) this.proxy.update();
};