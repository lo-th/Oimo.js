import { CollisionDetector } from './CollisionDetector';
import { _Math } from '../../math/Math';
import { Vec3 } from '../../math/Vec3';

/**
 * A collision detector which detects collisions between two spheres.
 * @author saharan 
 * @author lo-th
 */
 
function SpherePlaneCollisionDetector ( flip ){

    CollisionDetector.call( this );

    this.flip = flip;

    this.n = new Vec3();
    this.p = new Vec3();

};

SpherePlaneCollisionDetector.prototype = Object.assign( Object.create( CollisionDetector.prototype ), {

    constructor: SpherePlaneCollisionDetector,

    detectCollision: function ( shape1, shape2, manifold ) {

        var n = this.n;
        var p = this.p;

        var s = this.flip ? shape2 : shape1;
        var pn = this.flip ? shape1 : shape2;
        var rad = s.radius;
        var len;

        n.sub( s.position, pn.position );
        //var h = _Math.dotVectors( pn.normal, n );

        n.x *= pn.normal.x//+ rad;
        n.y *= pn.normal.y;
        n.z *= pn.normal.z//+ rad;

        
        var len = n.lengthSq();
        
        if( len > 0 && len < rad * rad){//&& h > rad*rad ){

            
            len = _Math.sqrt( len );
            //len = _Math.sqrt( h );
            n.copy(pn.normal).negate();
            //n.scaleEqual( 1/len );

            //(0, -1, 0)

            //n.normalize();
            p.copy( s.position ).addScaledVector( n, rad );
            manifold.addPointVec( p, n, len - rad, this.flip );

        }

    }

});

export { SpherePlaneCollisionDetector };