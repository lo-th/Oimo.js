OIMO.BoxShape = function(config,Width,Height,Depth){
    OIMO.Shape.call( this, config);
  
    this.width=Width;
    this.halfWidth=Width*0.5;
    this.height=Height;
    this.halfHeight=Height*0.5;
    this.depth=Depth;
    this.halfDepth=Depth*0.5;
    this.normalDirectionWidth=new OIMO.Vec3();
    this.normalDirectionHeight=new OIMO.Vec3();
    this.normalDirectionDepth=new OIMO.Vec3();
    this.halfDirectionWidth=new OIMO.Vec3();
    this.halfDirectionHeight=new OIMO.Vec3();
    this.halfDirectionDepth=new OIMO.Vec3();
    this.vertex1=new OIMO.Vec3();
    this.vertex2=new OIMO.Vec3();
    this.vertex3=new OIMO.Vec3();
    this.vertex4=new OIMO.Vec3();
    this.vertex5=new OIMO.Vec3();
    this.vertex6=new OIMO.Vec3();
    this.vertex7=new OIMO.Vec3();
    this.vertex8=new OIMO.Vec3();
    this.type=OIMO.SHAPE_BOX;
}
OIMO.BoxShape.prototype = Object.create( OIMO.Shape.prototype );
OIMO.BoxShape.prototype.calculateMassInfo = function(out){
    var mass=this.width*this.height*this.depth*this.density;
    out.mass=mass;
    out.inertia.init(
        mass*(this.height*this.height+this.depth*this.depth)/12,0,0,
        0,mass*(this.width*this.width+this.depth*this.depth)/12,0,
        0,0,mass*(this.width*this.width+this.height*this.height)/12
    );
}
OIMO.BoxShape.prototype.updateProxy = function(){
    var te = this.rotation.elements;
    this.normalDirectionWidth.x=te[0];
    this.normalDirectionWidth.y=te[3];
    this.normalDirectionWidth.z=te[6];
    this.normalDirectionHeight.x=te[1];
    this.normalDirectionHeight.y=te[4];
    this.normalDirectionHeight.z=te[7];
    this.normalDirectionDepth.x=te[2];
    this.normalDirectionDepth.y=te[5];
    this.normalDirectionDepth.z=te[8];
    this.halfDirectionWidth.x=te[0]*this.halfWidth;
    this.halfDirectionWidth.y=te[3]*this.halfWidth;
    this.halfDirectionWidth.z=te[6]*this.halfWidth;
    this.halfDirectionHeight.x=te[1]*this.halfHeight;
    this.halfDirectionHeight.y=te[4]*this.halfHeight;
    this.halfDirectionHeight.z=te[7]*this.halfHeight;
    this.halfDirectionDepth.x=te[2]*this.halfDepth;
    this.halfDirectionDepth.y=te[5]*this.halfDepth;
    this.halfDirectionDepth.z=te[8]*this.halfDepth;

    var wx=this.halfDirectionWidth.x;
    var wy=this.halfDirectionWidth.y;
    var wz=this.halfDirectionWidth.z;
    var hx=this.halfDirectionHeight.x;
    var hy=this.halfDirectionHeight.y;
    var hz=this.halfDirectionHeight.z;
    var dx=this.halfDirectionDepth.x;
    var dy=this.halfDirectionDepth.y;
    var dz=this.halfDirectionDepth.z;
    var x=this.position.x;
    var y=this.position.y;
    var z=this.position.z;

    this.vertex1.x = x+wx+hx+dx;
    this.vertex1.y = y+wy+hy+dy;
    this.vertex1.z = z+wz+hz+dz;
    this.vertex2.x = x+wx+hx-dx;
    this.vertex2.y = y+wy+hy-dy;
    this.vertex2.z = z+wz+hz-dz;
    this.vertex3.x = x+wx-hx+dx;
    this.vertex3.y = y+wy-hy+dy;
    this.vertex3.z = z+wz-hz+dz;
    this.vertex4.x = x+wx-hx-dx;
    this.vertex4.y = y+wy-hy-dy;
    this.vertex4.z = z+wz-hz-dz;
    this.vertex5.x = x-wx+hx+dx;
    this.vertex5.y = y-wy+hy+dy;
    this.vertex5.z = z-wz+hz+dz;
    this.vertex6.x = x-wx+hx-dx;
    this.vertex6.y = y-wy+hy-dy;
    this.vertex6.z = z-wz+hz-dz;
    this.vertex7.x = x-wx-hx+dx;
    this.vertex7.y = y-wy-hy+dy;
    this.vertex7.z = z-wz-hz+dz;
    this.vertex8.x = x-wx-hx-dx;
    this.vertex8.y = y-wy-hy-dy;
    this.vertex8.z = z-wz-hz-dz;

    var w = (this.halfDirectionWidth.x<0) ? -this.halfDirectionWidth.x : this.halfDirectionWidth.x; 
    var h = (this.halfDirectionWidth.y<0) ? -this.halfDirectionWidth.y : this.halfDirectionWidth.y;
    var d = (this.halfDirectionWidth.z<0) ? -this.halfDirectionWidth.z : this.halfDirectionWidth.z;

    w = (this.halfDirectionHeight.x<0) ? w-this.halfDirectionHeight.x : w+this.halfDirectionHeight.x; 
    h = (this.halfDirectionHeight.y<0) ? h-this.halfDirectionHeight.y : h+this.halfDirectionHeight.y;
    d = (this.halfDirectionHeight.z<0) ? d-this.halfDirectionHeight.z : d+this.halfDirectionHeight.z;

    w = (this.halfDirectionDepth.x<0) ? w-this.halfDirectionDepth.x : w+this.halfDirectionDepth.x; 
    h = (this.halfDirectionDepth.y<0) ? h-this.halfDirectionDepth.y : h+this.halfDirectionDepth.y;
    d = (this.halfDirectionDepth.z<0) ? d-this.halfDirectionDepth.z : d+this.halfDirectionDepth.z;
    
    this.aabb.init(
        this.position.x-w-0.005,this.position.x+w+0.005,
        this.position.y-h-0.005,this.position.y+h+0.005,
        this.position.z-d-0.005,this.position.z+d+0.005
    );
    if(this.proxy!==null){
        this.proxy.update();
    }
}