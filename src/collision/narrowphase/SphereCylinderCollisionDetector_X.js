import { CollisionDetector } from './CollisionDetector';
import { _Math } from '../../math/Math';
import { Vec3 } from '../../math/Vec3';

function SphereCylinderCollisionDetector ( flip ){
    
    CollisionDetector.call( this );
    this.flip = flip;

    this.n = new Vec3();
    this.p = new Vec3();

    this.n2 = new Vec3();
    this.cc = new Vec3();

};

SphereCylinderCollisionDetector.prototype = Object.assign( Object.create( CollisionDetector.prototype ), {

    constructor: SphereCylinderCollisionDetector,

    detectCollision: function ( shape1, shape2, manifold ) {

        var s = this.flip ? shape2 : shape1;
        var c = this.flip ? shape1 : shape2;

        var n = this.n;
        var p = this.p;
        var n2 = this.n2;
        var cc = this.cc;

        var rads = s.radius;
        var radc = c.radius;
        var rad2 = rads + radc;
        var halfh = c.halfHeight;
        var len;

        n.sub( s.position, c.position );
        var dot = _Math.dotVectors( n, c.normalDirection );

        if ( dot < -halfh - rads || dot > halfh + rads ) return;

        cc.copy( c.position ).addScaledVector( c.normalDirection, dot );
        n2.sub( s.position, cc );
        len = n2.lengthSq();

        if ( len > rad2 * rad2 ) return;

        if ( len > radc * radc ) {
            len = radc / _Math.sqrt( len );
            n2.scaleEqual( len );
        }

        if( dot < -halfh ) dot = -halfh;
        else if( dot > halfh ) dot = halfh;

        //cc.addEqual( n2 );
        cc.copy( c.position ).addScaledVector( c.normalDirection, dot ).addEqual( n2 );
        n.sub( cc, s.position );
        len = n.lengthSq();

        if ( len > 0 && len < rads * rads ) {

            len = _Math.sqrt( len );
            n.scaleEqual( 1/len );

            //n.normalize();
            p.copy( s.position ).addScaledVector( n, rads );
            manifold.addPointVec( p, n, len - rads, this.flip );

        }

    }

});

export { SphereCylinderCollisionDetector };