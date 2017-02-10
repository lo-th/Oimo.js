import { CollisionDetector } from './CollisionDetector';
import { _Math } from '../../math/Math';
import { Vec3 } from '../../math/Vec3';


/**
 * A collision detector which detects collisions between sphere and box.
 * @author saharan
 * @author lo-th
 */

function SphereBoxCollisionDetector ( flip ) {
    
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

SphereBoxCollisionDetector.prototype = Object.assign( Object.create( CollisionDetector.prototype ), {

    constructor: SphereBoxCollisionDetector,

    detectCollision: function ( shape1, shape2, manifold ) {

        var s = this.flip ? shape2 : shape1;
        var b = this.flip ? shape1 : shape2;

        var n = this.n;
        var p = this.p;
        var cc = this.cc;
        var cc2 = this.cc2;

        var D = b.dimentions;
        var hw = b.halfWidth;
        var hh = b.halfHeight;
        var hd = b.halfDepth;
        var rad = s.radius;
        var len;
        var overlap = 0;

        this.dix.set( D[0], D[1], D[2] );
        this.diy.set( D[3], D[4], D[5] );
        this.diz.set( D[6], D[7], D[8] );

        n.sub( s.position, b.position );
        
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

            p.copy( s.position ).addScaledVector( n, rad );
            manifold.addPointVec( p, n, len-rad, this.flip );

        }else{

            cc2.set( 
                cc.x*D[0]+cc.y*D[3]+cc.z*D[6],
                cc.x*D[1]+cc.y*D[4]+cc.z*D[7],
                cc.x*D[2]+cc.y*D[5]+cc.z*D[8]
            ).addEqual( b.position );

            n.sub( cc2, s.position );

            len = n.lengthSq();

            if( len > 0 && len < rad * rad ){

                len = _Math.sqrt( len );
                n.scaleEqual( 1/len );

                p.copy( s.position ).addScaledVector( n, rad );
                manifold.addPointVec( p, n, len-rad, this.flip );

            }
        }

    }

});

export { SphereBoxCollisionDetector };