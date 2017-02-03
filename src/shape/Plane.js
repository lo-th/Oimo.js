import { SHAPE_PLANE, AABB_PROX } from '../constants';
import { Shape } from './Shape';
import { _Math } from '../math/Math';
import { Vec3 } from '../math/Vec3';

/**
 * Plane shape.
 * @author lo-th
 */

function Plane( config, normal ) {

    Shape.call( this, config );

    this.type = SHAPE_PLANE;

    // radius of the shape.
    this.normal = new Vec3( 0, 1, 0 );

};

Plane.prototype = Object.assign( Object.create( Shape.prototype ), {

    constructor: Plane,

    volume: function () {

        return Number.MAX_VALUE;

    },

    calculateMassInfo: function ( out ) {

        out.mass = this.density;//0.0001;
        var inertia = 1;
        out.inertia.set( inertia, 0, 0, 0, inertia, 0, 0, 0, inertia );

    },

    updateProxy: function () {

        var p = AABB_PROX;

        var min = -_Math.INF;
        var max = _Math.INF;
        var n = this.normal;
        // The plane AABB is infinite, except if the normal is pointing along any axis
        this.aabb.set(
            n.x === -1 ? this.position.x - p : min, n.x === 1 ? this.position.x + p : max,
            n.y === -1 ? this.position.y - p : min, n.y === 1 ? this.position.y + p : max,
            n.z === -1 ? this.position.z - p : min, n.z === 1 ? this.position.z + p : max
        );

        if ( this.proxy != null ) this.proxy.update();

    }

});

export { Plane };