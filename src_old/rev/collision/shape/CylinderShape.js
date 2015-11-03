OIMO.CylinderShape = function(config,radius,height){
    OIMO.Shape.call( this );

    this.radius=radius;
    this.height=height;
    this.halfHeight=height*0.5;
    this.position.copy(config.position);
    this.rotation.copy(config.rotation);
    this.friction=config.friction;
    this.restitution=config.restitution;
    this.mass=Math.PI*radius*radius*height*config.density;
    var inertiaXZ=(1/4*radius*radius+1/12*height*height)*this.mass;
    var inertiaY=1/2*radius*radius;
    this.localInertia.init(
    inertiaXZ,0,0,
    0,inertiaY,0,
    0,0,inertiaXZ
    );
    this.normalDirection=new OIMO.Vec3();
    this.halfDirection=new OIMO.Vec3();
    this.type=OIMO.SHAPE_CYLINDER;
}
OIMO.CylinderShape.prototype = Object.create( OIMO.Shape.prototype );
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
    len=Math.sqrt(wx*wx+xx*yy+xx*zz);
    if(len>0)len=this.radius/len;
    wx*=len;
    hy=1-dirY*dirY;
    len=Math.sqrt(yy*xx+hy*hy+yy*zz);
    if(len>0)len=this.radius/len;
    hy*=len;
    dz=1-dirZ*dirZ;
    len=Math.sqrt(zz*xx+zz*yy+dz*dz);
    if(len>0)len=this.radius/len;
    dz*=len;
    var w;
    var h;
    var d;
    if(this.halfDirection.x<0)w=-this.halfDirection.x;
    else w=this.halfDirection.x;
    if(this.halfDirection.y<0)h=-this.halfDirection.y;
    else h=this.halfDirection.y;
    if(this.halfDirection.z<0)d=-this.halfDirection.z;
    else d=this.halfDirection.z;
    if(wx<0)w-=wx;
    else w+=wx;
    if(hy<0)h-=hy;
    else h+=hy;
    if(dz<0)d-=dz;
    else d+=dz;
    this.proxy.init(
    this.position.x-w,this.position.x+w,
    this.position.y-h,this.position.y+h,
    this.position.z-d,this.position.z+d
    );
}