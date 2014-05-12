OIMO.SphereShape = function(config,radius){
    OIMO.Shape.call( this, config);
    this.radius=radius;
    this.type=OIMO.SHAPE_SPHERE;
}
OIMO.SphereShape.prototype = Object.create( OIMO.Shape.prototype );
OIMO.SphereShape.prototype.calculateMassInfo = function(out){
    var mass=4/3*Math.PI*this.radius*this.radius*this.radius*this.density;
    out.mass=mass;
    var inertia=mass*this.radius*this.radius*2/5;
    out.inertia.init( inertia,0,0, 0,inertia,0, 0,0,inertia );
}
OIMO.SphereShape.prototype.updateProxy = function(){
    this.aabb.init(
        this.position.x-this.radius-0.005,this.position.x+this.radius+0.005,
        this.position.y-this.radius-0.005,this.position.y+this.radius+0.005,
        this.position.z-this.radius-0.005,this.position.z+this.radius+0.005
    );
    if(this.proxy!==null){ this.proxy.update(); }
}