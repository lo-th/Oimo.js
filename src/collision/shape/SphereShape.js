import { SHAPE_SPHERE, AABB_PROX } from '../../constants';
import { Shape } from './Shape';
import { _Math } from '../../math/Math';

/**
 * A sphere shape.
 *
 * @class SphereShape
 * @constructor
 * @extends Shape
 * @author saharan
 * @author lo-th
 */
function SphereShape( config, radius ) {

    Shape.call( this, config );

    this.type = SHAPE_SPHERE;

    /**
     * The radius of the shape.
     *
     * @property radius
     * @type {Number}
     */
    this.radius = radius;

};

SphereShape.prototype = Object.create( Shape.prototype );
SphereShape.prototype.constructor = SphereShape;

SphereShape.prototype.calculateMassInfo = function ( out ) {

    var mass = 1.333 * _Math.PI * this.radius * this.radius * this.radius * this.density;
    out.mass = mass;
    var inertia = mass * this.radius * this.radius * 0.4;
    out.inertia.set( inertia, 0, 0, 0, inertia, 0, 0, 0, inertia );

};

SphereShape.prototype.updateProxy = function () {

    var p = AABB_PROX;

    this.aabb.set(
        this.position.x - this.radius - p, this.position.x + this.radius + p,
        this.position.y - this.radius - p, this.position.y + this.radius + p,
        this.position.z - this.radius - p, this.position.z + this.radius + p
    );

    if ( this.proxy != null ) this.proxy.update();

};

export { SphereShape };