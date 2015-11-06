/**
 * A cylinder shap.
 * @author saharan
 * @author lo-th
 */

OIMO.CylinderShape = function(config,radius,height){

    OIMO.Shape.call( this, config );

    this.type = OIMO.SHAPE_CYLINDER;

    this.radius = radius;
    this.height = height;
    this.halfHeight = height * 0.5;
    
    this.normalDirection = new OIMO.Vec3();
    this.halfDirection = new OIMO.Vec3();
    
};

OIMO.CylinderShape.prototype = Object.create( OIMO.Shape.prototype );
OIMO.CylinderShape.prototype.constructor = OIMO.CylinderShape;

OIMO.CylinderShape.prototype.calculateMassInfo = function(out){

    var mass = OIMO.PI*this.radius*this.radius*this.height*this.density;
    var inertiaXZ = ( (0.25*this.radius*this.radius) + (0.0833*this.height*this.height) ) * mass;
    var inertiaY = 0.5*this.radius*this.radius;
    out.mass = mass;
    out.inertia.init( inertiaXZ,0,0,  0,inertiaY,0,  0,0,inertiaXZ );

};

OIMO.CylinderShape.prototype.updateProxy = function(){

    var te = this.rotation.elements;
    var len, wx, hy, dz, xx, yy, zz, w, h, d, p;

    xx = te[1]*te[1];
    yy = te[4]*te[4];
    zz = te[7]*te[7];

    this.normalDirection.set( te[1], te[4], te[7] );
    this.halfDirection.scale( this.normalDirection, this.halfHeight );

    wx = 1 - xx;
    len = OIMO.sqrt(wx*wx + xx*yy + xx*zz);
    if(len>0) len = this.radius/len;
    wx *= len;
    hy = 1 - yy;
    len = OIMO.sqrt(yy*xx + hy*hy + yy*zz);
    if(len>0) len = this.radius/len;
    hy *= len;
    dz = 1 - zz;
    len = OIMO.sqrt(zz*xx + zz*yy + dz*dz);
    if(len>0) len = this.radius/len;
    dz *= len;

    w = (this.halfDirection.x<0) ? -this.halfDirection.x : this.halfDirection.x;
    h = (this.halfDirection.y<0) ? -this.halfDirection.y : this.halfDirection.y;
    d = (this.halfDirection.z<0) ? -this.halfDirection.z : this.halfDirection.z;

    w = (wx<0) ? w-wx : w+wx;
    h = (hy<0) ? h-hy : h+hy;
    d = (dz<0) ? d-dz : d+dz;

    p = OIMO.AABB_PROX;

    this.aabb.init(
        this.position.x-w-p,this.position.x+w+p,
        this.position.y-h-p,this.position.y+h+p,
        this.position.z-d-p,this.position.z+d+p
    );

    if(this.proxy!==null) this.proxy.update();

};