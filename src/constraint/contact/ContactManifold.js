import { ManifoldPoint } from './ManifoldPoint';
import { Vec3 } from '../../math/Vec3';

/**
* A contact manifold between two shapes.
* @author saharan
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
    /**
    * Reset the manifold.
    * @param   shape1
    * @param   shape2
    */
    reset:function( shape1, shape2 ){

        this.body1 = shape1.parent;
        this.body2 = shape2.parent;
        this.numPoints = 0;

    },
    /**
    * Add a point into this manifold.
    * @param   x
    * @param   y
    * @param   z
    * @param   normalX
    * @param   normalY
    * @param   normalZ
    * @param   penetration
    * @param   flip
    */
    addPoint: function ( x, y, z, nx, ny, nz, penetration, flip ) {
        
        var p = this.points[ this.numPoints++ ];

        p.position.set( x, y, z );

        p.localPoint1.mulManifold( this.body1.rotation, new Vec3().sub( p.position, this.body1.position ) );
        p.localPoint2.mulManifold( this.body2.rotation, new Vec3().sub( p.position, this.body2.position ) );

        /*var r = this.body1.rotation;
        var rx = x-this.body1.position.x;
        var ry = y-this.body1.position.y;
        var rz = z-this.body1.position.z;

        var tr = r.elements;
        p.localPoint1.x = rx*tr[0] + ry*tr[3] + rz*tr[6];
        p.localPoint1.y = rx*tr[1] + ry*tr[4] + rz*tr[7];
        p.localPoint1.z = rx*tr[2] + ry*tr[5] + rz*tr[8];

        r = this.body2.rotation;
        rx = x-this.body2.position.x;
        ry = y-this.body2.position.y;
        rz = z-this.body2.position.z;

        tr = r.elements;
        p.localPoint2.x = rx*tr[0] + ry*tr[3] + rz*tr[6];
        p.localPoint2.y = rx*tr[1] + ry*tr[4] + rz*tr[7];
        p.localPoint2.z = rx*tr[2] + ry*tr[5] + rz*tr[8];*/

        p.normalImpulse = 0;

        p.normal.set( nx, ny, nz );
        if( flip ) p.normal.negate();

        p.penetration = penetration;
        p.warmStarted = false;
    }
}

export { ContactManifold };