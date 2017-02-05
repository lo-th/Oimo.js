import { CollisionDetector } from './CollisionDetector';
import { _Math } from '../../math/Math';
import { Vec3 } from '../../math/Vec3';

/**
 * A collision detector which detects collisions between two boxes.
 * @author saharan
 */
function BoxBoxCollisionDetector() {

    CollisionDetector.call( this );

    // clip Vertices  8 x vertices x,y,z
    this.cvs1 = new Float32Array( 24 );
    this.cvs2 = new Float32Array( 24 );

    this.qqq = new Float32Array( 12 );
    this.used = new Float32Array( 8 );

    this.v = [];
    var i = 21;
    while( i-- ){
        this.v.push( new Vec3() );
    } 
    
    this.INF = _Math.INF;

    this.n = new Vec3();
    this.n1 = new Vec3();
    this.n2 = new Vec3();
    this.p = new Vec3();
    this.p1 = new Vec3();
    this.p2 = new Vec3();
    this.d = new Vec3();

    this.c = new Vec3();
    this.s1 = new Vec3();
    this.s2 = new Vec3();

    this.d1 = new Vec3();
    this.d2 = new Vec3();

    this.tmp0 = new Vec3();
    this.tmp1 = new Vec3();
    this.tmp2 = new Vec3();

};

BoxBoxCollisionDetector.prototype = Object.assign( Object.create( CollisionDetector.prototype ), {

    constructor: BoxBoxCollisionDetector,

    tryAxisOO: function ( f ) {

        var v = this.v;
        var mdot = _Math.dotVectors;
        var len, len1, len2, dot1, dot2, dot3, right;

        len = mdot( v[f[0]], this.d );

        right = len > 0 ? true : false;
        len = right ? len : -len;
        
        dot1 = mdot( v[f[0]], v[f[1]] );
        dot2 = mdot( v[f[0]], v[f[2]] );
        dot3 = mdot( v[f[0]], v[f[3]] );
        dot1 = dot1 < 0 ? -dot1 : dot1;
        dot2 = dot2 < 0 ? -dot2 : dot2;
        dot3 = dot3 < 0 ? -dot3 : dot3;

        len1 = f[4];
        len2 = dot1*f[5] + dot2*f[6] + dot3*f[7];
        
        return { o:len - len1 - len2, r: right };

    },

    tryAxisCompOO: function ( f ) {

        var v = this.v;
        var mdot = _Math.dotVectors;
        var epsilon = _Math.EPZ;
        var len, len1, len2, dot1, dot2, right;

        len = v[f[0]].lengthSq();

        if( len > epsilon ){

            v[f[0]].multiplyScalar( 1 / _Math.sqrt( len ) );

            len = mdot( v[f[0]], this.d );

            right = len > 0 ? true : false;
            len = right ? len : -len;

            dot1 = mdot( v[f[0]], v[f[1]] );
            dot2 = mdot( v[f[0]], v[f[2]] );
            dot1 = dot1 < 0 ? -dot1 : dot1;
            dot2 = dot2 < 0 ? -dot2 : dot2;

            len1 = dot1*f[5] + dot2*f[6];

            dot1 = mdot( v[f[0]], v[f[3]] );
            dot2 = mdot( v[f[0]], v[f[4]] );
            dot1 = dot1 < 0 ? -dot1 : dot1;
            dot2 = dot2 < 0 ? -dot2 : dot2;

            len2 = dot1*f[7] + dot2*f[8];

            return { o: len - len1 - len2, r: right, inv:false };

        } else {

            return { o: 0, r: false, inv: true };

        }

    },

    /*tryAxis: function ( n, a, b, c, d, axe1, axe2, axe3, axe4, rights, overlaps, rev ) {

        var v = this.v;
        var mdot = _Math.dotVectors;
        var len, len1, len2, dot1, dot2, dot3, cross;

        len = mdot( v[a], this.d );

        rights[n] = len > 0 ? true : false;
        len = rights[n] ? len : -len;
        
        dot1 = mdot( v[a], v[b] );
        dot2 = mdot( v[a], v[c] );
        dot3 = mdot( v[a], v[d] );
        dot1 = dot1 < 0 ? -dot1 : dot1;
        dot2 = dot2 < 0 ? -dot2 : dot2;
        dot3 = dot3 < 0 ? -dot3 : dot3;

        cross = dot1*axe2 + dot2*axe3 + dot3*axe4;

        len1 = axe1;//rev ? cross : axe;
        len2 = cross;//rev ? axe : cross;
        
        overlaps[n] = len - len1 - len2;

    },

    tryAxisComp: function ( n, a, b, c, d, e, axe1, axe2, axe3, axe4, rights, overlaps, invalid ) {

        var v = this.v;
        var mdot = _Math.dotVectors;
        var epsilon = _Math.EPZ;
        var len, len1, len2, dot1, dot2;

        len = v[a].lengthSq();

        if( len > epsilon ){

            v[a].multiplyScalar( 1 / _Math.sqrt( len ) );

            len = mdot( v[a], this.d );

            rights[n] = len > 0 ? true : false;
            len = rights[n] ? len : -len;

            dot1 = mdot( v[a], v[b] );
            dot2 = mdot( v[a], v[c] );
            dot1 = dot1 < 0 ? -dot1 : dot1;
            dot2 = dot2 < 0 ? -dot2 : dot2;

            len1 = dot1*axe1 + dot2*axe2;

            dot1 = mdot( v[a], v[d] );
            dot2 = mdot( v[a], v[e] );
            dot1 = dot1 < 0 ? -dot1 : dot1;
            dot2 = dot2 < 0 ? -dot2 : dot2;

            len2 = dot1*axe3 + dot2*axe4;

            overlaps[n] = len - len1 - len2;
            invalid[n] = false;

        } else {

            overlaps[n] = 0;
            invalid[n] = true;
            rights[n] = false;

        }

    },*/

    detectCollision: function ( shape1, shape2, manifold ) {
        // What you are doing 
        // · I to prepare a separate axis of the fifteen 
        //-Six in each of three normal vectors of the xyz direction of the box both 
        // · Remaining nine 3x3 a vector perpendicular to the side of the box 2 and the side of the box 1 
        // · Calculate the depth to the separation axis 

        // Calculates the distance using the inner product and put the amount of embedment 
        // · However a vertical separation axis and side to weight a little to avoid vibration 
        // And end when there is a separate axis that is remote even one 
        // · I look for separation axis with little to dent most 
        // Men and if separation axis of the first six - end collision 
        // Heng If it separate axis of nine other - side collision 
        // Heng - case of a side collision 
        // · Find points of two sides on which you made ​​the separation axis 

        // Calculates the point of closest approach of a straight line consisting of separate axis points obtained, and the collision point 
        //-Surface - the case of the plane crash 
        //-Box A, box B and the other a box of better made ​​a separate axis 
        // • The surface A and the plane that made the separation axis of the box A, and B to the surface the face of the box B close in the opposite direction to the most isolated axis 

        // When viewed from the front surface A, and the cut part exceeding the area of the surface A is a surface B 
        //-Plane B becomes the 3-8 triangle, I a candidate for the collision point the vertex of surface B 
        // • If more than one candidate 5 exists, scraping up to four 

        // For potential collision points of all, to examine the distance between the surface A 
        // • If you were on the inside surface of A, and the collision point

        var i, k;


        var n = this.n;
        var p = this.p;
        var v = this.v;
        var d = this.d;

        var n1 = this.n1;
        var n2 = this.n2;
        var p1 = this.p1;
        var p2 = this.p2;

        var d1 = this.d1;
        var d2 = this.d2;

        var tmp0 = this.tmp0;
        var tmp1 = this.tmp1;
        var tmp2 = this.tmp2;

        // center of current face
        var c = this.c;
        // face side
        var s1 = this.s1;
        var s2 = this.s2;

        

        var b1;
        var b2;

        if(shape1.id<shape2.id){
            b1=shape1;
            b2=shape2;
        }else{
            b1=shape2;
            b2=shape1;
        }

        var V1 = b1.elements;
        var V2 = b2.elements;

        var D1 = b1.dimentions;
        var D2 = b2.dimentions;

        var dot1, dot2;

        //n.sub( b2.position, b1.position );

        p1.copy( b1.position );
        p2.copy( b2.position );

        // diff
        d.sub( p2, p1 );

        // mid distance
        d1.set( b1.halfWidth, b1.halfHeight, b1.halfDepth );
        d2.set( b2.halfWidth, b2.halfHeight, b2.halfDepth );

        // ----------------------------
        // 15 separating axes
        // 1~6: face
        // 7~f: edge
        // http://marupeke296.com/COL_3D_No13_OBBvsOBB.html
        // ----------------------------

        v[0].set( D1[0], D1[1], D1[2] );
        v[1].set( D1[3], D1[4], D1[5] );
        v[2].set( D1[6], D1[7], D1[8] );
        v[3].set( D1[9], D1[10], D1[11] );
        v[4].set( D1[12], D1[13], D1[14] );
        v[5].set( D1[15], D1[16], D1[17] );

        v[6].set( D2[0], D2[1], D2[2] );
        v[7].set( D2[3], D2[4], D2[5] );
        v[8].set( D2[6], D2[7], D2[8] );
        v[9].set( D2[9], D2[10], D2[11] );
        v[10].set( D2[12], D2[13], D2[14] );
        v[11].set( D2[15], D2[16], D2[17] );

        v[12].crossVectors( v[0], v[6] );
        v[13].crossVectors( v[0], v[7] );
        v[14].crossVectors( v[0], v[8] );

        v[15].crossVectors( v[1], v[6] );
        v[16].crossVectors( v[1], v[7] );
        v[17].crossVectors( v[1], v[8] );

        v[18].crossVectors( v[2], v[6] );
        v[19].crossVectors( v[2], v[7] );
        v[20].crossVectors( v[2], v[8] );

        // right or left flags
        var rights = [];
        // overlapping distances
        var overlaps = [];
        // invalid flags
        var invalid = [];

        var faces = [

            [ 0, 6, 7, 8, d1.x, d2.x, d2.y, d2.z ],
            [ 1, 6, 7, 8, d1.y, d2.x, d2.y, d2.z ],
            [ 2, 6, 7, 8, d1.z, d2.x, d2.y, d2.z ],

            [ 6, 0, 1, 2, d2.x, d1.x, d1.y, d1.z ],
            [ 7, 0, 1, 2, d2.y, d1.x, d1.y, d1.z ],
            [ 8, 0, 1, 2, d2.z, d1.x, d1.y, d1.z ],

            [ 12, 1, 2, 7, 8, d1.y, d1.z, d2.y, d2.z ],
            [ 13, 1, 2, 6, 8, d1.y, d1.z, d2.x, d2.z ],
            [ 14, 1, 2, 6, 7, d1.y, d1.z, d2.x, d2.y ],

            [ 15, 0, 2, 7, 8, d1.x, d1.z, d2.y, d2.z ],
            [ 16, 0, 2, 6, 8, d1.x, d1.z, d2.x, d2.z ],
            [ 17, 0, 2, 6, 7, d1.x, d1.z, d2.x, d2.y ],

            [ 18, 0, 1, 7, 8, d1.x, d1.y, d2.y, d2.z ],
            [ 19, 0, 1, 6, 8, d1.x, d1.y, d2.x, d2.z ],
            [ 20, 0, 1, 6, 7, d1.x, d1.y, d2.x, d2.y ],

        ];

        var mdot = _Math.dotVectors;

        var no = false, over;

        for( i = 0; i < 15; i++ ){

            if( i < 6 ){

                over = this.tryAxisOO( faces[i] );
                if( over.o > 0 ) { no = true; break; }
                else{ 
                    overlaps[i] = over.o;
                    rights[i] = over.r;
                }

            } else {

                over = this.tryAxisCompOO( faces[i] );
                if( !over.inv && over.o > 0 ) { no = true; break; }
                else{ 
                    overlaps[i] = over.o;
                    rights[i] = over.r;
                    invalid[i] = over.inv;
                }

            }
        }

        if( no ) return;

        // try axis 1
        /*this.tryAxis( 0, 0, 6, 7, 8, d1.x, d2.x, d2.y, d2.z, rights, overlaps );
        if( overlaps[0] > 0 ) return;

        // try axis 2
        this.tryAxis( 1, 1, 6, 7, 8, d1.y, d2.x, d2.y, d2.z, rights, overlaps );
        if( overlaps[1] > 0 ) return;

        // try axis 3
        this.tryAxis( 2, 2, 6, 7, 8, d1.z, d2.x, d2.y, d2.z, rights, overlaps );
        if( overlaps[2] > 0 ) return;

        // try axis 4
        this.tryAxis( 3, 6, 0, 1, 2, d2.x, d1.x, d1.y, d1.z, rights, overlaps, true );
        if( overlaps[3] > 0 ) return;

        // try axis 5
        this.tryAxis( 4, 7, 0, 1, 2, d2.y, d1.x, d1.y, d1.z, rights, overlaps, true );
        if( overlaps[4] > 0 ) return;

        // try axis 6
        this.tryAxis( 5, 8, 0, 1, 2, d2.z, d1.x, d1.y, d1.z, rights, overlaps, true );
        if( overlaps[5] > 0 ) return;

        //

        // try axis 7
        this.tryAxisComp( 6, 12, 1, 2, 7, 8, d1.y, d1.z, d2.y, d2.z, rights, overlaps, invalid );
        if( !invalid[6] && overlaps[6] > 0 ) return;

        // try axis 8
        this.tryAxisComp( 7, 13, 1, 2, 6, 8, d1.y, d1.z, d2.x, d2.z, rights, overlaps, invalid );
        if( !invalid[7] && overlaps[7] > 0 ) return;

        // try axis 9
        this.tryAxisComp( 8, 14, 1, 2, 6, 7, d1.y, d1.z, d2.x, d2.y, rights, overlaps, invalid );
        if( !invalid[8] && overlaps[8] > 0 ) return;

        // try axis 10
        this.tryAxisComp( 9, 15, 0, 2, 7, 8, d1.x, d1.z, d2.y, d2.z, rights, overlaps, invalid );
        if( !invalid[9] && overlaps[9] > 0 ) return;

        // try axis 11
        this.tryAxisComp( 10, 16, 0, 2, 6, 8, d1.x, d1.z, d2.x, d2.z, rights, overlaps, invalid );
        if( !invalid[10] && overlaps[10] > 0 ) return;

        // try axis 12
        this.tryAxisComp( 11, 17, 0, 2, 6, 7, d1.x, d1.z, d2.x, d2.y, rights, overlaps, invalid );
        if( !invalid[11] && overlaps[11] > 0 ) return;

        // try axis 13
        this.tryAxisComp( 12, 18, 0, 1, 7, 8, d1.x, d1.y, d2.y, d2.z, rights, overlaps, invalid );
        if( !invalid[12] && overlaps[12] > 0 ) return;

        // try axis 14
        this.tryAxisComp( 13, 19, 0, 1, 6, 8, d1.x, d1.y, d2.x, d2.z, rights, overlaps, invalid );
        if( !invalid[13] && overlaps[13] > 0 ) return;

        // try axis 15
        this.tryAxisComp( 14, 20, 0, 1, 6, 7, d1.x, d1.y, d2.x, d2.y, rights, overlaps, invalid );
        if( !invalid[14] && overlaps[14] > 0 ) return;
*/
        // boxes are overlapping
        var depth=overlaps[0];
        var depth2=overlaps[0];
        var minIndex=0;
        var right=rights[0];
        
        if(overlaps[1]>depth2){
            depth=overlaps[1];
            depth2=overlaps[1];
            minIndex=1;
            right=rights[1];
        }
        if(overlaps[2]>depth2){
            depth=overlaps[2];
            depth2=overlaps[2];
            minIndex=2;
            right=rights[2];
        }
        if(overlaps[3]>depth2){
            depth=overlaps[3];
            depth2=overlaps[3];
            minIndex=3;
            right=rights[3];
        }
        if(overlaps[4]>depth2){
            depth=overlaps[4];
            depth2=overlaps[4];
            minIndex=4;
            right=rights[4];
        }
        if(overlaps[5]>depth2){
            depth=overlaps[5];
            depth2=overlaps[5];
            minIndex=5;
            right=rights[5];
        }
        if(overlaps[6]-0.01>depth2&&!invalid[6]){
            depth=overlaps[6];
            depth2=overlaps[6]-0.01;
            minIndex=6;
            right=rights[6];
        }
        if(overlaps[7]-0.01>depth2&&!invalid[7]){
            depth=overlaps[7];
            depth2=overlaps[7]-0.01;
            minIndex=7;
            right=rights[7];
        }
        if(overlaps[8]-0.01>depth2&&!invalid[8]){
            depth=overlaps[8];
            depth2=overlaps[8]-0.01;
            minIndex=8;
            right=rights[8];
        }
        if(overlaps[9]-0.01>depth2&&!invalid[9]){
            depth=overlaps[9];
            depth2=overlaps[9]-0.01;
            minIndex=9;
            right=rights[9];
        }
        if(overlaps[10]-0.01>depth2&&!invalid[10]){
            depth=overlaps[10];
            depth2=overlaps[10]-0.01;
            minIndex=10;
            right=rights[10];
        }
        if(overlaps[11]-0.01>depth2&&!invalid[11]){
            depth=overlaps[11];
            depth2=overlaps[11]-0.01;
            minIndex=11;
            right=rights[11];
        }
        if(overlaps[12]-0.01>depth2&&!invalid[12]){
            depth=overlaps[12];
            depth2=overlaps[12]-0.01;
            minIndex=12;
            right=rights[12];
        }
        if(overlaps[13]-0.01>depth2&&!invalid[13]){
            depth=overlaps[13];
            depth2=overlaps[13]-0.01;
            minIndex=13;
            right=rights[13];
        }
        if(overlaps[14]-0.01>depth2&&!invalid[14]){
            depth=overlaps[14];
            minIndex=14;
            right=rights[14];
        }
    
        // swap b1 b2
        var swap = false;

        //_______________________________________

        switch ( minIndex ){
            case 0:// b1.x * b2
                n.copy( v[0] );
                if( right ){
                    c.add( p1, v[3] );
                }else{
                    c.sub( p1, v[3] );
                    n.negate();
                }
                s1.copy( v[4] );
                s2.copy( v[5] );
                n1.copy( v[1] ).negate();
                n2.copy( v[2] ).negate();
            break;
            case 1:// b1.y * b2
                n.copy( v[1] );
                if( right ){
                    c.add( p1, v[4] );
                }else{
                    c.sub( p1, v[4] );
                    n.negate();
                }
                s1.copy( v[3] );
                s2.copy( v[5] );
                n1.copy( v[0] ).negate();
                n2.copy( v[2] ).negate();
            break;
            case 2:// b1.z * b2
                n.copy( v[2] );
                if( right ){
                    c.add( p1, v[5] );
                }else{
                    c.sub( p1, v[5] );
                    n.negate();
                }
                s1.copy( v[3] );
                s2.copy( v[4] );
                n1.copy( v[0] ).negate();
                n2.copy( v[1] ).negate();
            break;
            case 3:// b2.x * b1
                n.copy( v[6] );
                if( !right ){
                    c.add( p2, v[9] );
                }else{
                    c.sub( p2, v[9] );
                    n.negate();
                }
                s1.copy( v[10] );
                s2.copy( v[11] );
                n1.copy( v[7] ).negate();
                n2.copy( v[8] ).negate();
                swap = true;
            break;
            case 4:// b2.y * b1
                n.copy( v[7] );
                if( !right ){
                    c.add( p2, v[10] );
                }else{
                    c.sub( p2, v[10] );;
                    n.negate();
                }
                s1.copy( v[9] );
                s2.copy( v[11] );
                n1.copy( v[6] ).negate();
                n2.copy( v[8] ).negate();
                swap = true;
            break;
            case 5:// b2.z * b1
                n.copy( v[8] );
                if( !right ){
                    c.add( p2, v[11] );
                }else{
                    c.sub( p2, v[11] );
                    n.negate();
                }
                s1.copy( v[9] );
                s2.copy( v[10] );
                n1.copy( v[6] ).negate();
                n2.copy( v[7] ).negate();
                swap = true;
            break;
            case 6:// b1.x * b2.x
                n.copy( v[12] );
                n1.copy( v[0] );
                n2.copy( v[6] );
            break;
            case 7:// b1.x * b2.y
                n.copy( v[13] );
                n1.copy( v[0] );
                n2.copy( v[7] );
            break;
            case 8:// b1.x * b2.z
                n.copy( v[14] );
                n1.copy( v[0] );
                n2.copy( v[8] );
            break;
            case 9:// b1.y * b2.x
                n.copy( v[15] );
                n1.copy( v[1] );
                n2.copy( v[6] );
            break;
            case 10:// b1.y * b2.y
                n.copy( v[16] );
                n1.copy( v[1] );
                n2.copy( v[7] );
            break;
            case 11:// b1.y * b2.z
                n.copy( v[17] );
                n1.copy( v[1] );
                n2.copy( v[8] );
            break;
            case 12:// b1.z * b2.x
                n.copy( v[18] );
                n1.copy( v[2] );
                n2.copy( v[6] );
            break;
            case 13:// b1.z * b2.y
                n.copy( v[19] );
                n1.copy( v[2] );
                n2.copy( v[7] );
            break;
            case 14:// b1.z * b2.z
                n.copy( v[20] );
                n1.copy( v[2] );
                n2.copy( v[8] );
            break;

        }

        //__________________________________________

        var distance, maxD1, maxD2, t;

        //var v;
        if( minIndex > 5 ){

            if( !right ) n.negate();
               
            tmp1.set( V1[0], V1[1], V1[2] );
            maxD1 = mdot( n, tmp1 );

            tmp2.set( V2[0], V2[1], V2[2] );
            maxD2 = mdot( n, tmp2 );;

            for( i = 1; i < 8; i++ ){

                k = i * 3;

                tmp0.set( V1[k], V1[k+1], V1[k+2] );
                distance = mdot( n, tmp0 );

                if( distance > maxD1 ){

                    maxD1 = distance;
                    tmp1.copy( tmp0 );

                }

                tmp0.set( V2[k], V2[k+1], V2[k+2] );
                distance = mdot( n, tmp0 );

                if( distance > maxD2 ){

                    maxD2 = distance;
                    tmp2.copy( tmp0 );

                }

            }

            tmp0.sub( tmp2, tmp1 );
            dot1 = mdot( n1, n2 );
            t = ( tmp0.x*(n1.x-n2.x*dot1) + tmp0.y*(n1.y-n2.y*dot1) + tmp0.z*(n1.z-n2.z*dot1) ) / ( 1-dot1*dot1 );

            //n.set( n.x, n.y, n.z );
            p.set(
                tmp1.x + n1.x*t + n.x*depth*0.5,
                tmp1.y + n1.y*t + n.y*depth*0.5,
                tmp1.z + n1.z*t + n.z*depth*0.5
            );
            manifold.addPointVec( p, n, depth, false );
            return;
        }

        // now detect face-face collision...
        // target quad
        var ar;
        // search support face and vertex
        var minDot = 1;
        var dot = 0;
        var minDotId = 0;

        if( swap ){

            dot = mdot( v[0], n );
            if(dot<minDot){ minDot = dot; minDotId = 0; }
            if(-dot<minDot){  minDot = -dot; minDotId = 1; }

            dot = mdot( v[1], n ); 
            if(dot<minDot){ minDot = dot;  minDotId = 2; }
            if(-dot<minDot){ minDot = -dot; minDotId = 3; }

            dot = mdot( v[2], n );
            if(dot<minDot){ minDot = dot; minDotId = 4; }
            if(-dot<minDot){ minDot = -dot; minDotId = 5; }

            ar = V1;

        }else{

            dot = mdot( v[6], n );
            if(dot<minDot){ minDot = dot; minDotId = 0; }
            if(-dot<minDot){ minDot=-dot; minDotId = 1; }

            dot = mdot( v[7], n );
            if(dot<minDot){ minDot=dot; minDotId = 2; }
            if(-dot<minDot){ minDot=-dot; minDotId = 3; }

            dot = mdot( v[8], n );
            if(dot<minDot){ minDot=dot; minDotId = 4; }
            if(-dot<minDot){ minDot=-dot; minDotId = 5; }

            ar = V2;
      
        }

        switch ( minDotId ){

            case 0: this.qqq.set( [ ar[0], ar[1], ar[2], ar[6], ar[7], ar[8], ar[9], ar[10], ar[11], ar[3], ar[4], ar[5] ] );           break; // x+ face  vertex 1 3 4 2
            case 1: this.qqq.set( [ ar[15], ar[16], ar[17], ar[21], ar[22], ar[23], ar[18], ar[19], ar[20], ar[12], ar[13], ar[14] ] ); break; // x- face vertex 6 8 7 5
            case 2: this.qqq.set( [ ar[12], ar[13], ar[14], ar[0], ar[1], ar[2], ar[3], ar[4], ar[5], ar[15], ar[16], ar[17] ] );       break; // y+ face vertex 5 1 2 6
            case 3: this.qqq.set( [ ar[21], ar[22], ar[23], ar[9], ar[10], ar[11], ar[6], ar[7], ar[8], ar[18], ar[19], ar[20] ] );     break; // y- face vertex 8 4 3 7
            case 4: this.qqq.set( [ ar[12], ar[13], ar[14], ar[18], ar[19], ar[20], ar[6], ar[7], ar[8], ar[0], ar[1], ar[2] ] );       break; // z+ face vertex 5 7 3 1
            case 5: this.qqq.set( [ ar[3], ar[4], ar[5], ar[9], ar[10], ar[11], ar[21], ar[22], ar[23], ar[15], ar[16], ar[17] ] );     break; // z- face vertex 2 4 8 6
            
        }


        // clip vertices
        var cvs1 = this.cvs1;
        var cvs2 = this.cvs2;

        var numClipVertices;
        var numAddedClipVertices;
        //var k;

        cvs1.set( this.qqq );
        numAddedClipVertices=0;
        tmp1.set( cvs1[9], cvs1[10], cvs1[11] )
   
        dot1=(tmp1.x-c.x-s1.x)*n1.x + (tmp1.y-c.y-s1.y)*n1.y + (tmp1.z-c.z-s1.z)*n1.z;

        //var i = 4;
        //while(i--){
        for(var i=0;i<4;i++){
            k=i*3;
            tmp2.set( cvs1[k], cvs1[k+1], cvs1[k+2] );
            dot2=(tmp2.x-c.x-s1.x)*n1.x+(tmp2.y-c.y-s1.y)*n1.y+(tmp2.z-c.z-s1.z)*n1.z;
            if(dot1>0){
                if(dot2>0){
                    k=numAddedClipVertices*3;
                    numAddedClipVertices++;
                    cvs2[k]=tmp2.x;
                    cvs2[k+1]=tmp2.y;
                    cvs2[k+2]=tmp2.z;
                }else{
                    k=numAddedClipVertices*3;
                    numAddedClipVertices++;
                    t=dot1/(dot1-dot2);
                    cvs2[k]=tmp1.x+(tmp2.x-tmp1.x)*t;
                    cvs2[k+1]=tmp1.y+(tmp2.y-tmp1.y)*t;
                    cvs2[k+2]=tmp1.z+(tmp2.z-tmp1.z)*t;
                }
            }else{
                if(dot2>0){
                    k=numAddedClipVertices*3;
                    numAddedClipVertices++;
                    t=dot1/(dot1-dot2);
                    cvs2[k]=tmp1.x+(tmp2.x-tmp1.x)*t;
                    cvs2[k+1]=tmp1.y+(tmp2.y-tmp1.y)*t;
                    cvs2[k+2]=tmp1.z+(tmp2.z-tmp1.z)*t;
                    k=numAddedClipVertices*3;
                    numAddedClipVertices++;
                    cvs2[k]=tmp2.x;
                    cvs2[k+1]=tmp2.y;
                    cvs2[k+2]=tmp2.z;
                }
            }

            tmp1.copy( tmp2 );
            dot1 = dot2;
        }

        numClipVertices = numAddedClipVertices;
        if( numClipVertices === 0 ) return;

        numAddedClipVertices = 0;
        k=(numClipVertices-1)*3;
        tmp1.set( cvs2[k], cvs2[k+1], cvs2[k+2] );
        dot1=(tmp1.x-c.x-s2.x)*n2.x+(tmp1.y-c.y-s2.y)*n2.y+(tmp1.z-c.z-s2.z)*n2.z;

        //i = numClipVertices;
        //while(i--){
        for(i=0;i<numClipVertices;i++){
            k=i*3;
            tmp2.set( cvs2[k], cvs2[k+1], cvs2[k+2] );
            dot2=(tmp2.x-c.x-s2.x)*n2.x+(tmp2.y-c.y-s2.y)*n2.y+(tmp2.z-c.z-s2.z)*n2.z;
            if(dot1>0){
                if(dot2>0){
                    k=numAddedClipVertices*3;
                    numAddedClipVertices++;
                    cvs1[k]=tmp2.x;
                    cvs1[k+1]=tmp2.y;
                    cvs1[k+2]=tmp2.z;
                }else{
                    k=numAddedClipVertices*3;
                    numAddedClipVertices++;
                    t=dot1/(dot1-dot2);
                    cvs1[k]=tmp1.x+(tmp2.x-tmp1.x)*t;
                    cvs1[k+1]=tmp1.y+(tmp2.y-tmp1.y)*t;
                    cvs1[k+2]=tmp1.z+(tmp2.z-tmp1.z)*t;
                }
            }else{
                if(dot2>0){
                    k=numAddedClipVertices*3;
                    numAddedClipVertices++;
                    t=dot1/(dot1-dot2);
                    cvs1[k]=tmp1.x+(tmp2.x-tmp1.x)*t;
                    cvs1[k+1]=tmp1.y+(tmp2.y-tmp1.y)*t;
                    cvs1[k+2]=tmp1.z+(tmp2.z-tmp1.z)*t;
                    k=numAddedClipVertices*3;
                    numAddedClipVertices++;
                    cvs1[k]=tmp2.x;
                    cvs1[k+1]=tmp2.y;
                    cvs1[k+2]=tmp2.z;
                }
            }

            tmp1.copy( tmp2 );
            dot1 = dot2;

        }

        numClipVertices=numAddedClipVertices;
        if(numClipVertices==0)return;
        numAddedClipVertices=0;
        k=(numClipVertices-1)*3;
        tmp1.set( cvs1[k], cvs1[k+1], cvs1[k+2] );
        dot1=(tmp1.x-c.x+s1.x)*-n1.x+(tmp1.y-c.y+s1.y)*-n1.y+(tmp1.z-c.z+s1.z)*-n1.z;

        //i = numClipVertices;
        //while(i--){
        for(i=0;i<numClipVertices;i++){
            k=i*3;
            tmp2.set( cvs1[k], cvs1[k+1], cvs1[k+2] );
            dot2=(tmp2.x-c.x+s1.x)*-n1.x+(tmp2.y-c.y+s1.y)*-n1.y+(tmp2.z-c.z+s1.z)*-n1.z;
            if(dot1>0){
                if(dot2>0){
                    k=numAddedClipVertices*3;
                    numAddedClipVertices++;
                    cvs2[k]=tmp2.x;
                    cvs2[k+1]=tmp2.y;
                    cvs2[k+2]=tmp2.z;
                }else{
                    k=numAddedClipVertices*3;
                    numAddedClipVertices++;
                    t=dot1/(dot1-dot2);
                    cvs2[k]=tmp1.x+(tmp2.x-tmp1.x)*t;
                    cvs2[k+1]=tmp1.y+(tmp2.y-tmp1.y)*t;
                    cvs2[k+2]=tmp1.z+(tmp2.z-tmp1.z)*t;
                }
            }else{
                if(dot2>0){
                    k=numAddedClipVertices*3;
                    numAddedClipVertices++;
                    t=dot1/(dot1-dot2);
                    cvs2[k]=tmp1.x+(tmp2.x-tmp1.x)*t;
                    cvs2[k+1]=tmp1.y+(tmp2.y-tmp1.y)*t;
                    cvs2[k+2]=tmp1.z+(tmp2.z-tmp1.z)*t;
                    k=numAddedClipVertices*3;
                    numAddedClipVertices++;
                    cvs2[k]=tmp2.x;
                    cvs2[k+1]=tmp2.y;
                    cvs2[k+2]=tmp2.z;
                }
            }

            tmp1.copy( tmp2 );
            dot1 = dot2;

        }

        numClipVertices=numAddedClipVertices;
        if(numClipVertices==0)return;
        numAddedClipVertices=0;
        k=(numClipVertices-1)*3;
        tmp1.set( cvs2[k], cvs2[k+1], cvs2[k+2] );
        dot1=(tmp1.x-c.x+s2.x)*-n2.x+(tmp1.y-c.y+s2.y)*-n2.y+(tmp1.z-c.z+s2.z)*-n2.z;

        //i = numClipVertices;
        //while(i--){
        for(i=0;i<numClipVertices;i++){
            k=i*3;
            tmp2.set( cvs2[k], cvs2[k+1], cvs2[k+2] );
            dot2=(tmp2.x-c.x+s2.x)*-n2.x+(tmp2.y-c.y+s2.y)*-n2.y+(tmp2.z-c.z+s2.z)*-n2.z;
            if(dot1>0){
                if(dot2>0){
                    k=numAddedClipVertices*3;
                    numAddedClipVertices++;
                    cvs1[k]=tmp2.x;
                    cvs1[k+1]=tmp2.y;
                    cvs1[k+2]=tmp2.z;
                }else{
                    k=numAddedClipVertices*3;
                    numAddedClipVertices++;
                    t=dot1/(dot1-dot2);
                    cvs1[k]=tmp1.x+(tmp2.x-tmp1.x)*t;
                    cvs1[k+1]=tmp1.y+(tmp2.y-tmp1.y)*t;
                    cvs1[k+2]=tmp1.z+(tmp2.z-tmp1.z)*t;
                }
            }else{
                if(dot2>0){
                    k=numAddedClipVertices*3;
                    numAddedClipVertices++;
                    t=dot1/(dot1-dot2);
                    cvs1[k]=tmp1.x+(tmp2.x-tmp1.x)*t;
                    cvs1[k+1]=tmp1.y+(tmp2.y-tmp1.y)*t;
                    cvs1[k+2]=tmp1.z+(tmp2.z-tmp1.z)*t;
                    k=numAddedClipVertices*3;
                    numAddedClipVertices++;
                    cvs1[k]=tmp2.x;
                    cvs1[k+1]=tmp2.y;
                    cvs1[k+2]=tmp2.z;
                }
            }

            tmp1.copy( tmp2 );
            dot1 = dot2;

        }

        numClipVertices = numAddedClipVertices;
        if(swap){
            var tb=b1;
            b1=b2;
            b2=tb;
        }
        if(numClipVertices==0) return;

        var flipped = b1!=shape1;

        //n.set( n.x, n.y, n.z );

        if( numClipVertices > 4 ){

            tmp1.x = (this.qqq[0]+this.qqq[3]+this.qqq[6]+this.qqq[9])*0.25;
            tmp1.y = (this.qqq[1]+this.qqq[4]+this.qqq[7]+this.qqq[10])*0.25;
            tmp1.z = (this.qqq[2]+this.qqq[5]+this.qqq[8]+this.qqq[11])*0.25;
            n1.x = this.qqq[0]-tmp1.x;
            n1.y = this.qqq[1]-tmp1.y;
            n1.z = this.qqq[2]-tmp1.z;
            n2.x = this.qqq[3]-tmp1.x;
            n2.y = this.qqq[4]-tmp1.y;
            n2.z = this.qqq[5]-tmp1.z;

            var id_1=0;
            var id_2=0;
            var id_3=0;
            var id_4=0;
            var maxDot=-this.INF;
            minDot=this.INF;

            //i = numClipVertices;
            //while(i--){
            for(i=0;i<numClipVertices;i++){
                this.used[i]=false;
                k=i*3;
                tmp1.x=cvs1[k];
                tmp1.y=cvs1[k+1];
                tmp1.z=cvs1[k+2];
                dot=tmp1.x*n1.x+tmp1.y*n1.y+tmp1.z*n1.z;
                if(dot<minDot){
                    minDot=dot;
                    id_1=i;
                }
                if(dot>maxDot){
                    maxDot=dot;
                    id_3=i;
                }
            }

            this.used[id_1]=true;
            this.used[id_3]=true;
            maxDot=-this.INF;
            minDot=this.INF;

            for( i=0; i<numClipVertices; i++ ){

                if( this.used[i] ) continue;
                k=i*3;
                tmp1.x=cvs1[k];
                tmp1.y=cvs1[k+1];
                tmp1.z=cvs1[k+2];
                dot=tmp1.x*n2.x+tmp1.y*n2.y+tmp1.z*n2.z;
                if(dot<minDot){
                    minDot=dot;
                    id_2=i;
                }
                if(dot>maxDot){
                    maxDot=dot;
                    id_4=i;
                }

            }

            k = id_1*3;
            tmp1.set( cvs1[k], cvs1[k+1], cvs1[k+2] );
            p.copy( tmp1 );
            dot = (tmp1.x-c.x)*n.x+(tmp1.y-c.y)*n.y+(tmp1.z-c.z)*n.z;
            if( dot < 0 ) manifold.addPointVec( p, n, dot, flipped );
            
            k = id_2*3;
            tmp1.set( cvs1[k], cvs1[k+1], cvs1[k+2] );
            p.copy( tmp1 );
            dot = (tmp1.x-c.x)*n.x+(tmp1.y-c.y)*n.y+(tmp1.z-c.z)*n.z;
            if( dot < 0 ) manifold.addPointVec( p, n, dot, flipped );
            
            k = id_3*3;
            tmp1.set( cvs1[k], cvs1[k+1], cvs1[k+2] );
            p.copy( tmp1 );
            dot = (tmp1.x-c.x)*n.x+(tmp1.y-c.y)*n.y+(tmp1.z-c.z)*n.z;
            if( dot < 0 ) manifold.addPointVec( p, n, dot, flipped );
            
            k = id_4*3;
            tmp1.set( cvs1[k], cvs1[k+1], cvs1[k+2] );
            p.copy( tmp1 );
            dot = (tmp1.x-c.x)*n.x+(tmp1.y-c.y)*n.y+(tmp1.z-c.z)*n.z;
            if( dot < 0 ) manifold.addPointVec( p, n, dot, flipped );
            
        }else{

            for( i = 0; i < numClipVertices; i++ ){

                k = i*3;
                tmp1.set( cvs1[k], cvs1[k+1], cvs1[k+2] );
                
                p.copy( tmp1 );
                dot = (tmp1.x-c.x)*n.x + (tmp1.y-c.y)*n.y + (tmp1.z-c.z)*n.z;
                if( dot < 0 ) manifold.addPointVec( p, n, dot, flipped );

            }

        }

    }

});

export { BoxBoxCollisionDetector };