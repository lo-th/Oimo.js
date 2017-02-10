import { CollisionDetector } from './CollisionDetector';
import { _Math } from '../../math/Math';
import { Vec3 } from '../../math/Vec3';

/**
 * A collision detector which detects collisions between two spheres.
 * @author saharan 
 * @author lo-th
 */
 
function BoxPlaneCollisionDetector ( flip ){

    CollisionDetector.call( this );

    this.flip = flip;

    this.n = new Vec3();
    this.p = new Vec3();

    this.dix = new Vec3();
    this.diy = new Vec3();
    this.diz = new Vec3();

    this.cc = new Vec3();
    this.cc2 = new Vec3();

};

BoxPlaneCollisionDetector.prototype = Object.assign( Object.create( CollisionDetector.prototype ), {

    constructor: BoxPlaneCollisionDetector,

    detectCollision: function ( shape1, shape2, manifold ) {

        var n = this.n;
        var p = this.p;
        var cc = this.cc;

        var b = this.flip ? shape2 : shape1;
        var pn = this.flip ? shape1 : shape2;

        var D = b.dimentions;
        var hw = b.halfWidth;
        var hh = b.halfHeight;
        var hd = b.halfDepth;
        var len;
        var overlap = 0;

        this.dix.set( D[0], D[1], D[2] );
        this.diy.set( D[3], D[4], D[5] );
        this.diz.set( D[6], D[7], D[8] );

        n.sub( b.position, pn.position );

        n.x *= pn.normal.x//+ rad;
        n.y *= pn.normal.y;
        n.z *= pn.normal.z//+ rad;

        cc.set(
            _Math.dotVectors( this.dix, n ),
            _Math.dotVectors( this.diy, n ),
            _Math.dotVectors( this.diz, n )
        );


        if( cc.x > hw ) cc.x = hw;
        else if( cc.x < -hw ) cc.x = -hw;
        else overlap = 1;
        
        if( cc.y > hh ) cc.y = hh;
        else if( cc.y < -hh ) cc.y = -hh;
        else overlap |= 2;
        
        if( cc.z > hd ) cc.z = hd;
        else if( cc.z < -hd ) cc.z = -hd;
        else overlap |= 4;

        

        if( overlap === 7 ){

            // center of sphere is in the box
            
            n.set(
                cc.x < 0 ? hw + cc.x : hw - cc.x,
                cc.y < 0 ? hh + cc.y : hh - cc.y,
                cc.z < 0 ? hd + cc.z : hd - cc.z
            )
            
            if( n.x < n.y ){
                if( n.x < n.z ){
                    len = n.x - hw;
                    if( cc.x < 0 ){
                        cc.x = -hw;
                        n.copy( this.dix );
                    }else{
                        cc.x = hw;
                        n.subEqual( this.dix );
                    }
                }else{
                    len = n.z - hd;
                    if( cc.z < 0 ){
                        cc.z = -hd;
                        n.copy( this.diz );
                    }else{
                        cc.z = hd;
                        n.subEqual( this.diz );
                    }
                }
            }else{
                if( n.y < n.z ){
                    len = n.y - hh;
                    if( cc.y < 0 ){
                        cc.y = -hh;
                        n.copy( this.diy );
                    }else{
                        cc.y = hh;
                        n.subEqual( this.diy );
                    }
                }else{
                    len = n.z - hd;
                    if( cc.z < 0 ){
                        cc.z = -hd;
                        n.copy( this.diz );
                    }else{
                        cc.z = hd;
                        n.subEqual( this.diz );
                    }
                }
            }

            p.copy( pn.position ).addScaledVector( n, 1 );
            manifold.addPointVec( p, n, len, this.flip );

        }

    }

});

export { BoxPlaneCollisionDetector };