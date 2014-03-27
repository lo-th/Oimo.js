OIMO.BoxShape = function(config,width,height,depth){
    OIMO.Shape.call( this );

    this.width=width;
    this.halfWidth=width*0.5;
    this.height=height;
    this.halfHeight=height*0.5;
    this.depth=depth;
    this.halfDepth=depth*0.5;
    this.position.copy(config.position);
    this.rotation.copy(config.rotation);
    this.friction=config.friction;
    this.restitution=config.restitution;
    this.mass=width*height*depth*config.density;
    var inertia=this.mass/12;
    this.localInertia.init(
    inertia*(height*height+depth*depth),0,0,
    0,inertia*(width*width+depth*depth),0,
    0,0,inertia*(width*width+height*height)
    );
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
    this.vertex1.x=x+wx+hx+dx;
    this.vertex1.y=y+wy+hy+dy;
    this.vertex1.z=z+wz+hz+dz;
    this.vertex2.x=x+wx+hx-dx;
    this.vertex2.y=y+wy+hy-dy;
    this.vertex2.z=z+wz+hz-dz;
    this.vertex3.x=x+wx-hx+dx;
    this.vertex3.y=y+wy-hy+dy;
    this.vertex3.z=z+wz-hz+dz;
    this.vertex4.x=x+wx-hx-dx;
    this.vertex4.y=y+wy-hy-dy;
    this.vertex4.z=z+wz-hz-dz;
    this.vertex5.x=x-wx+hx+dx;
    this.vertex5.y=y-wy+hy+dy;
    this.vertex5.z=z-wz+hz+dz;
    this.vertex6.x=x-wx+hx-dx;
    this.vertex6.y=y-wy+hy-dy;
    this.vertex6.z=z-wz+hz-dz;
    this.vertex7.x=x-wx-hx+dx;
    this.vertex7.y=y-wy-hy+dy;
    this.vertex7.z=z-wz-hz+dz;
    this.vertex8.x=x-wx-hx-dx;
    this.vertex8.y=y-wy-hy-dy;
    this.vertex8.z=z-wz-hz-dz;
    var w;
    var h;
    var d;
    if(this.halfDirectionWidth.x<0){
    w=-this.halfDirectionWidth.x;
    }else{
    w=this.halfDirectionWidth.x;
    }
    if(this.halfDirectionWidth.y<0){
    h=-this.halfDirectionWidth.y;
    }else{
    h=this.halfDirectionWidth.y;
    }
    if(this.halfDirectionWidth.z<0){
    d=-this.halfDirectionWidth.z;
    }else{
    d=this.halfDirectionWidth.z;
    }
    if(this.halfDirectionHeight.x<0){
    w-=this.halfDirectionHeight.x;
    }else{
    w+=this.halfDirectionHeight.x;
    }
    if(this.halfDirectionHeight.y<0){
    h-=this.halfDirectionHeight.y;
    }else{
    h+=this.halfDirectionHeight.y;
    }
    if(this.halfDirectionHeight.z<0){
    d-=this.halfDirectionHeight.z;
    }else{
    d+=this.halfDirectionHeight.z;
    }
    if(this.halfDirectionDepth.x<0){
    w-=this.halfDirectionDepth.x;
    }else{
    w+=this.halfDirectionDepth.x;
    }
    if(this.halfDirectionDepth.y<0){
    h-=this.halfDirectionDepth.y;
    }else{
    h+=this.halfDirectionDepth.y;
    }
    if(this.halfDirectionDepth.z<0){
    d-=this.halfDirectionDepth.z;
    }else{
    d+=this.halfDirectionDepth.z;
    }
    this.proxy.init(
    this.position.x-w,this.position.x+w,
    this.position.y-h,this.position.y+h,
    this.position.z-d,this.position.z+d
    );
}