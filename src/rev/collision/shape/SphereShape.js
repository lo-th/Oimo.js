OIMO.SphereShape = function(config,radius){
    OIMO.Shape.call( this );

    this.radius=radius;
    this.position.copy(config.position);
    this.rotation.copy(config.rotation);
    this.friction=config.friction;
    this.restitution=config.restitution;
    this.mass=4/3*Math.PI*radius*radius*radius*config.density;
    var inertia=2/5*radius*radius*this.mass;
    this.localInertia.init(
        inertia,0,0,
        0,inertia,0,
        0,0,inertia
    );
    this.type=OIMO.SHAPE_SPHERE;
}
OIMO.SphereShape.prototype = Object.create( OIMO.Shape.prototype );
OIMO.SphereShape.prototype.updateProxy = function(){
    this.proxy.init(
        this.position.x-this.radius,this.position.x+this.radius,
        this.position.y-this.radius,this.position.y+this.radius,
        this.position.z-this.radius,this.position.z+this.radius
    );
}