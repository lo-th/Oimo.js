import { CollisionDetector } from './CollisionDetector';
import { _Math } from '../../math/Math';
import { Vec3 } from '../../math/Vec3';

/**
 * A collision detector which detects collisions between two spheres.
 * @author saharan 
 * @author lo-th
 */
 
function SphereSphereCollisionDetector (){

    CollisionDetector.call( this );

    this.n = new Vec3();
    this.p = new Vec3();

};

SphereSphereCollisionDetector.prototype = Object.assign( Object.create( CollisionDetector.prototype ), {

    constructor: SphereSphereCollisionDetector,

    detectCollision: function ( shape1, shape2, manifold ) {

        var n = this.n;
        var p = this.p;

        var s1 = shape1;
        var s2 = shape2;

        n.sub( s2.position, s1.position );
        var rad = s1.radius + s2.radius;
        var len = n.lengthSq();
        
        if( len > 0 && len < rad * rad ){

            len = _Math.sqrt( len );
            n.scaleEqual( 1/len );

            //n.normalize();
            p.copy( s1.position ).addScaledVector( n, s1.radius );
            manifold.addPointVec( p, n, len - rad, false );

        }

    }

});

export { SphereSphereCollisionDetector };