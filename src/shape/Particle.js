import { SHAPE_PARTICLE, AABB_PROX } from '../constants';
import { Shape } from './Shape';
import { _Math } from '../math/Math';
import { Vec3 } from '../math/Vec3';

/**
 * A Particule shape
 * @author lo-th
 */

function Particle( config, normal ) {

    Shape.call( this, config );

    this.type = SHAPE_PARTICLE;

};

Particle.prototype = Object.assign( Object.create( Shape.prototype ), {

    constructor: Particle,

    volume: function () {

        return Number.MAX_VALUE;

    },

    calculateMassInfo: function ( out ) {

        var inertia = 0;
        out.inertia.set( inertia, 0, 0, 0, inertia, 0, 0, 0, inertia );

    },

    updateProxy: function () {

        var p = 0;//AABB_PROX;

        this.aabb.set(
            this.position.x - p, this.position.x + p,
            this.position.y - p, this.position.y + p,
            this.position.z - p, this.position.z + p
        );

        if ( this.proxy != null ) this.proxy.update();

    }

});

export { Particle };