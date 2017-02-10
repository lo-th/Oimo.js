import { ManifoldPoint } from './ManifoldPoint';
import { Vec3 } from '../../math/Vec3';

/**
* A contact manifold between two shapes.
* @author saharan
* @author lo-th
*/

function ContactManifold () {

    // The first rigid body.
    this.body1 = null;
    // The second rigid body.
    this.body2 = null;
    // The number of manifold points.
    this.numPoints = 0;
    // The manifold points.
    this.points = [
        new ManifoldPoint(),
        new ManifoldPoint(),
        new ManifoldPoint(),
        new ManifoldPoint()
    ];

}

ContactManifold.prototype = {

    constructor: ContactManifold,

    //Reset the manifold.
    reset:function( shape1, shape2 ){

        this.body1 = shape1.parent;
        this.body2 = shape2.parent;
        this.numPoints = 0;

    },

    //  Add a point into this manifold.
    addPointVec: function ( pos, norm, penetration, flip ) {
        
        var p = this.points[ this.numPoints++ ];

        p.position.copy( pos );
        p.localPoint1.sub( pos, this.body1.position ).applyMatrix3( this.body1.rotation );
        p.localPoint2.sub( pos, this.body2.position ).applyMatrix3( this.body2.rotation );

        p.normal.copy( norm );
        if( flip ) p.normal.negate();

        p.normalImpulse = 0;
        p.penetration = penetration;
        p.warmStarted = false;
        
    },

    //  Add a point into this manifold.
    addPoint: function ( x, y, z, nx, ny, nz, penetration, flip ) {
        
        var p = this.points[ this.numPoints++ ];

        p.position.set( x, y, z );
        p.localPoint1.sub( p.position, this.body1.position ).applyMatrix3( this.body1.rotation );
        p.localPoint2.sub( p.position, this.body2.position ).applyMatrix3( this.body2.rotation );

        p.normalImpulse = 0;

        p.normal.set( nx, ny, nz );
        if( flip ) p.normal.negate();

        p.penetration = penetration;
        p.warmStarted = false;
        
    }
}

export { ContactManifold };