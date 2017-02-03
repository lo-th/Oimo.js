import { CollisionDetector } from './CollisionDetector';
import { _Math } from '../../math/Math';
import { Vec3 } from '../../math/Vec3';

/**
 * A collision detector which detects collisions between two boxes.
 * @author saharan
 */
function BoxBoxCollisionDetector() {

    CollisionDetector.call( this );
    this.clipVertices1 = new Float32Array( 12 ); // 4 x vertices x,y,z
    this.clipVertices2 = new Float32Array( 12 );
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

};

BoxBoxCollisionDetector.prototype = Object.assign( Object.create( CollisionDetector.prototype ), {

    constructor: BoxBoxCollisionDetector,

    tryAxis: function ( ) {

    },

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

        var n = this.n;
        var p = this.p;
        var v = this.v;

        var n1 = this.n1;
        var n2 = this.n2;
        var p1 = this.p1;
        var p2 = this.p2;

        // center of current face
        var c = this.c;
        // face side
        var s1 = this.s1;
        var s2 = this.s2;

        var d = this.d;

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

        //n.sub( b2.position, b1.position );

        p1.copy( b1.position );
        p2.copy( b2.position );

        // diff
        d.sub( p2, p1 );

        // distance
        var w1=b1.halfWidth;
        var h1=b1.halfHeight;
        var d1=b1.halfDepth;
        var w2=b2.halfWidth;
        var h2=b2.halfHeight;
        var d2=b2.halfDepth;
        // direction

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

        var epsilon = _Math.EPZ;
        var mdot = _Math.dotVectors;


        // invalid flags
        var invalid7=false;
        var invalid8=false;
        var invalid9=false;
        var invalida=false;
        var invalidb=false;
        var invalidc=false;
        var invalidd=false;
        var invalide=false;
        var invalidf=false;

        // temporary variables
        
        var len;
        var len1;
        var len2;
        var dot1;
        var dot2;
        var dot3;

        // try axis 1
        len = mdot( v[0], d );
        rights[0]=len>0;
        if(!rights[0])len=-len;
        len1=w1;
        dot1 = mdot( v[0], v[6] );
        dot2 = mdot( v[0], v[7] );
        dot3 = mdot( v[0], v[8] );
        dot1 = dot1 < 0 ? -dot1 : dot1;
        dot2 = dot2 < 0 ? -dot2 : dot2;
        dot3 = dot3 < 0 ? -dot3 : dot3;
        len2 = dot1*w2 + dot2*h2 + dot3*d2;
        overlaps[0] = len-len1-len2;
        if(overlaps[0]>0) return;

        // try axis 2
        len =  mdot( v[1], d );
        rights[1]=len>0;
        if(!rights[1])len=-len;
        len1=h1;
        dot1 = mdot( v[1], v[6] );
        dot2 = mdot( v[1], v[7] );
        dot3 = mdot( v[1], v[8] );
        dot1 = dot1 < 0 ? -dot1 : dot1;
        dot2 = dot2 < 0 ? -dot2 : dot2;
        dot3 = dot3 < 0 ? -dot3 : dot3;
        len2=dot1*w2+dot2*h2+dot3*d2;
        overlaps[1] = len-len1-len2;
        if(overlaps[1]>0) return;

        // try axis 3
        len = mdot( v[2], d );
        rights[2]=len>0;
        if(!rights[2])len=-len;
        len1=d1;
        dot1 = mdot( v[2], v[6] );
        dot2 = mdot( v[2], v[7] );
        dot3 = mdot( v[2], v[8] );
        dot1 = dot1 < 0 ? -dot1 : dot1;
        dot2 = dot2 < 0 ? -dot2 : dot2;
        dot3 = dot3 < 0 ? -dot3 : dot3;
        len2=dot1*w2+dot2*h2+dot3*d2;
        overlaps[2]=len-len1-len2;
        if(overlaps[2]>0)return;

        // try axis 4
        len =  mdot( v[6], d );
        rights[3]=len>0;
        if(!rights[3])len=-len;
        dot1 = mdot( v[6], v[0] );
        dot2 = mdot( v[6], v[1] );
        dot3 = mdot( v[6], v[2] );
        dot1 = dot1 < 0 ? -dot1 : dot1;
        dot2 = dot2 < 0 ? -dot2 : dot2;
        dot3 = dot3 < 0 ? -dot3 : dot3;
        len1=dot1*w1+dot2*h1+dot3*d1;
        len2=w2;
        overlaps[3]=(len-len1-len2)*1.0;
        if(overlaps[3]>0)return;

        // try axis 5
        len =  mdot( v[7], d );
        rights[4]=len>0;
        if(!rights[4])len=-len;
        dot1 = mdot( v[7], v[0] );
        dot2 = mdot( v[7], v[1] );
        dot3 = mdot( v[7], v[2] );
        dot1 = dot1 < 0 ? -dot1 : dot1;
        dot2 = dot2 < 0 ? -dot2 : dot2;
        dot3 = dot3 < 0 ? -dot3 : dot3;
        len1=dot1*w1+dot2*h1+dot3*d1;
        len2=h2;
        overlaps[4]=(len-len1-len2)*1.0;
        if(overlaps[4]>0)return;

        // try axis 6
        len =  mdot( v[8], d ); 
        rights[5]=len>0;
        if(!rights[5])len=-len;
        dot1 = mdot( v[8], v[0] );
        dot2 = mdot( v[8], v[1] );
        dot3 = mdot( v[8], v[2] );
        dot1 = dot1 < 0 ? -dot1 : dot1;
        dot2 = dot2 < 0 ? -dot2 : dot2;
        dot3 = dot3 < 0 ? -dot3 : dot3;
        len1=dot1*w1+dot2*h1+dot3*d1;
        len2=d2;
        overlaps[5]=(len-len1-len2)*1.0;
        if(overlaps[5]>0)return;

        // try axis 7
        len = v[12].lengthSq();
        if( len > epsilon ){

            v[12].multiplyScalar( 1 / _Math.sqrt(len) );
            len = mdot( v[12], d );

            rights[6]=len>0;
            if(!rights[6])len=-len;
            dot1 = mdot( v[12], v[1] );
            dot2 = mdot( v[12], v[2] );
            if(dot1<0)dot1=-dot1;
            if(dot2<0)dot2=-dot2;
            len1=dot1*h1+dot2*d1;
            dot1 = mdot( v[12], v[7] );
            dot2 = mdot( v[12], v[8] );
            if(dot1<0)dot1=-dot1;
            if(dot2<0)dot2=-dot2;
            len2=dot1*h2+dot2*d2;
            overlaps[6]=len-len1-len2;
            if(overlaps[6]>0)return;
        }else{
            rights[6]=false;
            overlaps[6]=0;
            invalid7=true;
        }

        // try axis 8
        len = v[13].lengthSq();
        if(len>epsilon){

            v[13].multiplyScalar( 1 / _Math.sqrt(len) );
            len = mdot( v[13], d );

            rights[7]=len>0;
            if(!rights[7])len=-len;
            dot1 = mdot( v[13], v[1] );
            dot2 = mdot( v[13], v[2] );
            if(dot1<0)dot1=-dot1;
            if(dot2<0)dot2=-dot2;
            len1=dot1*h1+dot2*d1;
            dot1 = mdot( v[13], v[6] );
            dot2 = mdot( v[13], v[8] );
            if(dot1<0)dot1=-dot1;
            if(dot2<0)dot2=-dot2;
            len2=dot1*w2+dot2*d2;
            overlaps[7]=len-len1-len2;
            if(overlaps[7]>0)return;
        }else{
            rights[7]=false;
            overlaps[7]=0;
            invalid8=true;
        }

        // try axis 9
        len = v[14].lengthSq();
        if( len > epsilon ){

            v[14].multiplyScalar( 1 / _Math.sqrt(len) );
            len = mdot( v[14], d );

            rights[8]=len>0;
            if(!rights[8])len=-len;
            dot1 = mdot( v[14], v[1] );
            dot2 = mdot( v[14], v[2] );
            if(dot1<0)dot1=-dot1;
            if(dot2<0)dot2=-dot2;
            len1=dot1*h1+dot2*d1;
            dot1 = mdot( v[14], v[6] );
            dot2 = mdot( v[14], v[7] );
            if(dot1<0)dot1=-dot1;
            if(dot2<0)dot2=-dot2;
            len2=dot1*w2+dot2*h2;
            overlaps[8]=len-len1-len2;
            if(overlaps[8]>0)return;
        }else{
            rights[8]=false;
            overlaps[8]=0;
            invalid9=true;
        }

        // try axis 10
        len = v[15].lengthSq();
        if( len > epsilon ){

            v[15].multiplyScalar( 1 / _Math.sqrt(len) );
            len = mdot( v[15], d );

            rights[9]=len>0;
            if(!rights[9])len=-len;
            dot1 = mdot( v[15], v[0] );
            dot2 = mdot( v[15], v[2] );
            if(dot1<0)dot1=-dot1;
            if(dot2<0)dot2=-dot2;
            len1=dot1*w1+dot2*d1;
            dot1 = mdot( v[15], v[7] );
            dot2 = mdot( v[15], v[8] );
            if(dot1<0)dot1=-dot1;
            if(dot2<0)dot2=-dot2;
            len2=dot1*h2+dot2*d2;
            overlaps[9]=len-len1-len2;
            if(overlaps[9]>0)return;
        }else{
            rights[9]=false;
            overlaps[9]=0;
            invalida=true;
        }

        // try axis 11
        len = v[16].lengthSq();
        if(len>epsilon){

            v[16].multiplyScalar( 1 / _Math.sqrt(len) );
            len = mdot( v[16], d );

            rights[10]=len>0;
            if(!rights[10])len=-len;
            dot1 = mdot( v[16], v[0] );
            dot2 = mdot( v[16], v[2] );
            if(dot1<0)dot1=-dot1;
            if(dot2<0)dot2=-dot2;
            len1=dot1*w1+dot2*d1;
            dot1 = mdot( v[16], v[6] );
            dot2 = mdot( v[16], v[8] );
            if(dot1<0)dot1=-dot1;
            if(dot2<0)dot2=-dot2;
            len2=dot1*w2+dot2*d2;
            overlaps[10]=len-len1-len2;
            if( overlaps[10] > 0 ) return;
        }else{
            rights[10] = false;
            overlaps[10] = 0;
            invalidb = true;
        }

        // try axis 12
        len = v[17].lengthSq();
        if(len>epsilon){

            v[17].multiplyScalar( 1 / _Math.sqrt(len) );
            len = mdot( v[17], d );

            rights[11]=len>0;
            if(!rights[11])len=-len;
            dot1 = mdot( v[17], v[0] );
            dot2 = mdot( v[17], v[2] );
            if(dot1<0)dot1=-dot1;
            if(dot2<0)dot2=-dot2;
            len1=dot1*w1+dot2*d1;
            dot1 = mdot( v[17], v[6] );
            dot2 = mdot( v[17], v[7] );
            if(dot1<0)dot1=-dot1;
            if(dot2<0)dot2=-dot2;
            len2=dot1*w2+dot2*h2;
            overlaps[11]=len-len1-len2;
            if(overlaps[11]>0)return;
        }else{
            rights[11] = false;
            overlaps[11] = 0;
            invalidc=true;
        }

        // try axis 13
        len = v[18].lengthSq();
        if(len>epsilon){

            v[18].multiplyScalar( 1 / _Math.sqrt(len) );
            len = mdot( v[18], d );

            rights[12]=len>0;
            if(!rights[12])len=-len;
            dot1 = mdot( v[18], v[0] );
            dot2 = mdot( v[18], v[1] );
            if(dot1<0)dot1=-dot1;
            if(dot2<0)dot2=-dot2;
            len1=dot1*w1+dot2*h1;
            dot1 = mdot( v[18], v[7] );
            dot2 = mdot( v[18], v[8] );
            if(dot1<0)dot1=-dot1;
            if(dot2<0)dot2=-dot2;
            len2=dot1*h2+dot2*d2;
            overlaps[12]=len-len1-len2;
            if(overlaps[12]>0)return;
        }else{
            rights[12]=false;
            overlaps[12]=0;
            invalidd=true;
        }

        // try axis 14
        len =  v[19].lengthSq();
        if(len>epsilon){

            v[19].multiplyScalar( 1 / _Math.sqrt(len) );
            len = mdot( v[19], d );

            rights[13]=len>0;
            if(!rights[13])len=-len;
            dot1 = mdot( v[19], v[0] );
            dot2 = mdot( v[19], v[1] );
            if(dot1<0)dot1=-dot1;
            if(dot2<0)dot2=-dot2;
            len1=dot1*w1+dot2*h1;
            dot1 = mdot( v[19], v[6] );
            dot2 = mdot( v[19], v[8] );
            if(dot1<0)dot1=-dot1;
            if(dot2<0)dot2=-dot2;
            len2=dot1*w2+dot2*d2;
            overlaps[13]=len-len1-len2;
            if(overlaps[13]>0)return;
        }else{
            rights[13]=false;
            overlaps[13]=0;
            invalide=true;
        }

        // try axis 15
        len = v[20].lengthSq();
        if( len > epsilon ){

            v[20].multiplyScalar( 1 / _Math.sqrt(len) );
            len = mdot( v[20], d );

            rights[14]=len>0;
            if(!rights[14])len=-len;
            dot1 = mdot( v[20], v[0] );
            dot2 = mdot( v[20], v[1] );
            if(dot1<0)dot1=-dot1;
            if(dot2<0)dot2=-dot2;
            len1=dot1*w1+dot2*h1;
            dot1 = mdot( v[20], v[6] );
            dot2 = mdot( v[20], v[7] );
            if(dot1<0)dot1=-dot1;
            if(dot2<0)dot2=-dot2;
            len2=dot1*w2+dot2*h2;
            overlaps[14]=len-len1-len2;
            if(overlaps[14]>0)return;
        }else{
            rights[14]=false;
            overlaps[14]=0;
            invalidf=true;
        }


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
        if(overlaps[6]-0.01>depth2&&!invalid7){
            depth=overlaps[6];
            depth2=overlaps[6]-0.01;
            minIndex=6;
            right=rights[6];
        }
        if(overlaps[7]-0.01>depth2&&!invalid8){
            depth=overlaps[7];
            depth2=overlaps[7]-0.01;
            minIndex=7;
            right=rights[7];
        }
        if(overlaps[8]-0.01>depth2&&!invalid9){
            depth=overlaps[8];
            depth2=overlaps[8]-0.01;
            minIndex=8;
            right=rights[8];
        }
        if(overlaps[9]-0.01>depth2&&!invalida){
            depth=overlaps[9];
            depth2=overlaps[9]-0.01;
            minIndex=9;
            right=rights[9];
        }
        if(overlaps[10]-0.01>depth2&&!invalidb){
            depth=overlaps[10];
            depth2=overlaps[10]-0.01;
            minIndex=10;
            right=rights[10];
        }
        if(overlaps[11]-0.01>depth2&&!invalidc){
            depth=overlaps[11];
            depth2=overlaps[11]-0.01;
            minIndex=11;
            right=rights[11];
        }
        if(overlaps[12]-0.01>depth2&&!invalidd){
            depth=overlaps[12];
            depth2=overlaps[12]-0.01;
            minIndex=12;
            right=rights[12];
        }
        if(overlaps[13]-0.01>depth2&&!invalide){
            depth=overlaps[13];
            depth2=overlaps[13]-0.01;
            minIndex=13;
            right=rights[13];
        }
        if(overlaps[14]-0.01>depth2&&!invalidf){
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

        //var v;
        if(minIndex>5){

            if( !right ) n.negate();
               
            var distance;
            var maxDistance;
            var vx;
            var vy;
            var vz;
            var v1x;
            var v1y;
            var v1z;
            var v2x;
            var v2y;
            var v2z;
            //vertex1;
            v1x=V1[0]; v1y=V1[1]; v1z=V1[2];
            maxDistance=n.x*v1x+n.y*v1y+n.z*v1z;
            //vertex2;
            vx=V1[3]; vy=V1[4]; vz=V1[5];
            distance=n.x*vx+n.y*vy+n.z*vz;
            if(distance>maxDistance){
                maxDistance=distance;
                v1x=vx; v1y=vy; v1z=vz;
            }
            //vertex3;
            vx=V1[6]; vy=V1[7]; vz=V1[8];
            distance=n.x*vx+n.y*vy+n.z*vz;
            if(distance>maxDistance){
                maxDistance=distance;
                v1x=vx; v1y=vy; v1z=vz;
            }
            //vertex4;
            vx=V1[9]; vy=V1[10]; vz=V1[11];
            distance=n.x*vx+n.y*vy+n.z*vz;
            if(distance>maxDistance){
                maxDistance=distance;
                v1x=vx; v1y=vy; v1z=vz;
            }
            //vertex5;
            vx=V1[12]; vy=V1[13]; vz=V1[14];
            distance=n.x*vx+n.y*vy+n.z*vz;
            if(distance>maxDistance){
                maxDistance=distance;
                v1x=vx; v1y=vy; v1z=vz;
            }
            //vertex6;
            vx=V1[15]; vy=V1[16]; vz=V1[17];
            distance=n.x*vx+n.y*vy+n.z*vz;
            if(distance>maxDistance){
                maxDistance=distance;
                v1x=vx; v1y=vy; v1z=vz;
            }
            //vertex7;
            vx=V1[18]; vy=V1[19]; vz=V1[20];
            distance=n.x*vx+n.y*vy+n.z*vz;
            if(distance>maxDistance){
                maxDistance=distance;
                v1x=vx; v1y=vy; v1z=vz;
            }
            //vertex8;
            vx=V1[21]; vy=V1[22]; vz=V1[23];
            distance=n.x*vx+n.y*vy+n.z*vz;
            if(distance>maxDistance){
                maxDistance=distance;
                v1x=vx; v1y=vy; v1z=vz;
            }
            //vertex1;
            v2x=V2[0]; v2y=V2[1]; v2z=V2[2];
            maxDistance=n.x*v2x+n.y*v2y+n.z*v2z;
            //vertex2;
            vx=V2[3]; vy=V2[4]; vz=V2[5];
            distance=n.x*vx+n.y*vy+n.z*vz;
            if(distance<maxDistance){
                maxDistance=distance;
                v2x=vx; v2y=vy; v2z=vz;
            }
            //vertex3;
            vx=V2[6]; vy=V2[7]; vz=V2[8];
            distance=n.x*vx+n.y*vy+n.z*vz;
            if(distance<maxDistance){
                maxDistance=distance;
                v2x=vx; v2y=vy; v2z=vz;
            }
            //vertex4;
            vx=V2[9]; vy=V2[10]; vz=V2[11];
            distance=n.x*vx+n.y*vy+n.z*vz;
            if(distance<maxDistance){
                maxDistance=distance;
                v2x=vx; v2y=vy; v2z=vz;
            }
            //vertex5;
            vx=V2[12]; vy=V2[13]; vz=V2[14];
            distance=n.x*vx+n.y*vy+n.z*vz;
            if(distance<maxDistance){
                maxDistance=distance;
                v2x=vx; v2y=vy; v2z=vz;
            }
            //vertex6;
            vx=V2[15]; vy=V2[16]; vz=V2[17];
            distance=n.x*vx+n.y*vy+n.z*vz;
            if(distance<maxDistance){
                maxDistance=distance;
                v2x=vx; v2y=vy; v2z=vz;
            }
            //vertex7;
            vx=V2[18]; vy=V2[19]; vz=V2[20];
            distance=n.x*vx+n.y*vy+n.z*vz;
            if(distance<maxDistance){
                maxDistance=distance;
                v2x=vx; v2y=vy; v2z=vz;
            }
            //vertex8;
            vx=V2[21]; vy=V2[22]; vz=V2[23];
            distance=n.x*vx+n.y*vy+n.z*vz;
            if(distance<maxDistance){
                maxDistance=distance;
                v2x=vx; v2y=vy; v2z=vz;
            }
            vx=v2x-v1x; vy=v2y-v1y; vz=v2z-v1z;
            dot1=n1.x*n2.x+n1.y*n2.y+n1.z*n2.z;
            var t=(vx*(n1.x-n2.x*dot1)+vy*(n1.y-n2.y*dot1)+vz*(n1.z-n2.z*dot1))/(1-dot1*dot1);

            //n.set( n.x, n.y, n.z );
            p.set(
                v1x+n1.x*t+n.x*depth*0.5,
                v1y+n1.y*t+n.y*depth*0.5,
                v1z+n1.z*t+n.z*depth*0.5
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
        var numClipVertices;
        var numAddedClipVertices;
        var index;
        var x1;
        var y1;
        var z1;
        var x2;
        var y2;
        var z2;

        this.clipVertices1.set( this.qqq );
        numAddedClipVertices=0;
        x1 = this.clipVertices1[9];
        y1 = this.clipVertices1[10];
        z1 = this.clipVertices1[11];
        dot1=(x1-c.x-s1.x)*n1.x+(y1-c.y-s1.y)*n1.y+(z1-c.z-s1.z)*n1.z;

        //var i = 4;
        //while(i--){
        for(var i=0;i<4;i++){
            index=i*3;
            x2=this.clipVertices1[index];
            y2=this.clipVertices1[index+1];
            z2=this.clipVertices1[index+2];
            dot2=(x2-c.x-s1.x)*n1.x+(y2-c.y-s1.y)*n1.y+(z2-c.z-s1.z)*n1.z;
            if(dot1>0){
                if(dot2>0){
                    index=numAddedClipVertices*3;
                    numAddedClipVertices++;
                    this.clipVertices2[index]=x2;
                    this.clipVertices2[index+1]=y2;
                    this.clipVertices2[index+2]=z2;
                }else{
                    index=numAddedClipVertices*3;
                    numAddedClipVertices++;
                    t=dot1/(dot1-dot2);
                    this.clipVertices2[index]=x1+(x2-x1)*t;
                    this.clipVertices2[index+1]=y1+(y2-y1)*t;
                    this.clipVertices2[index+2]=z1+(z2-z1)*t;
                }
            }else{
                if(dot2>0){
                    index=numAddedClipVertices*3;
                    numAddedClipVertices++;
                    t=dot1/(dot1-dot2);
                    this.clipVertices2[index]=x1+(x2-x1)*t;
                    this.clipVertices2[index+1]=y1+(y2-y1)*t;
                    this.clipVertices2[index+2]=z1+(z2-z1)*t;
                    index=numAddedClipVertices*3;
                    numAddedClipVertices++;
                    this.clipVertices2[index]=x2;
                    this.clipVertices2[index+1]=y2;
                    this.clipVertices2[index+2]=z2;
                }
            }
            x1=x2;
            y1=y2;
            z1=z2;
            dot1=dot2;
        }

        numClipVertices=numAddedClipVertices;
        if(numClipVertices==0)return;
        numAddedClipVertices=0;
        index=(numClipVertices-1)*3;
        x1=this.clipVertices2[index];
        y1=this.clipVertices2[index+1];
        z1=this.clipVertices2[index+2];
        dot1=(x1-c.x-s2.x)*n2.x+(y1-c.y-s2.y)*n2.y+(z1-c.z-s2.z)*n2.z;

        //i = numClipVertices;
        //while(i--){
        for(i=0;i<numClipVertices;i++){
            index=i*3;
            x2=this.clipVertices2[index];
            y2=this.clipVertices2[index+1];
            z2=this.clipVertices2[index+2];
            dot2=(x2-c.x-s2.x)*n2.x+(y2-c.y-s2.y)*n2.y+(z2-c.z-s2.z)*n2.z;
            if(dot1>0){
                if(dot2>0){
                    index=numAddedClipVertices*3;
                    numAddedClipVertices++;
                    this.clipVertices1[index]=x2;
                    this.clipVertices1[index+1]=y2;
                    this.clipVertices1[index+2]=z2;
                }else{
                    index=numAddedClipVertices*3;
                    numAddedClipVertices++;
                    t=dot1/(dot1-dot2);
                    this.clipVertices1[index]=x1+(x2-x1)*t;
                    this.clipVertices1[index+1]=y1+(y2-y1)*t;
                    this.clipVertices1[index+2]=z1+(z2-z1)*t;
                }
            }else{
                if(dot2>0){
                    index=numAddedClipVertices*3;
                    numAddedClipVertices++;
                    t=dot1/(dot1-dot2);
                    this.clipVertices1[index]=x1+(x2-x1)*t;
                    this.clipVertices1[index+1]=y1+(y2-y1)*t;
                    this.clipVertices1[index+2]=z1+(z2-z1)*t;
                    index=numAddedClipVertices*3;
                    numAddedClipVertices++;
                    this.clipVertices1[index]=x2;
                    this.clipVertices1[index+1]=y2;
                    this.clipVertices1[index+2]=z2;
                }
            }
            x1=x2;
            y1=y2;
            z1=z2;
            dot1=dot2;
        }

        numClipVertices=numAddedClipVertices;
        if(numClipVertices==0)return;
        numAddedClipVertices=0;
        index=(numClipVertices-1)*3;
        x1=this.clipVertices1[index];
        y1=this.clipVertices1[index+1];
        z1=this.clipVertices1[index+2];
        dot1=(x1-c.x+s1.x)*-n1.x+(y1-c.y+s1.y)*-n1.y+(z1-c.z+s1.z)*-n1.z;

        //i = numClipVertices;
        //while(i--){
        for(i=0;i<numClipVertices;i++){
            index=i*3;
            x2 = this.clipVertices1[index];
            y2 = this.clipVertices1[index+1];
            z2 = this.clipVertices1[index+2];
            dot2=(x2-c.x+s1.x)*-n1.x+(y2-c.y+s1.y)*-n1.y+(z2-c.z+s1.z)*-n1.z;
            if(dot1>0){
                if(dot2>0){
                    index=numAddedClipVertices*3;
                    numAddedClipVertices++;
                    this.clipVertices2[index]=x2;
                    this.clipVertices2[index+1]=y2;
                    this.clipVertices2[index+2]=z2;
                }else{
                    index=numAddedClipVertices*3;
                    numAddedClipVertices++;
                    t=dot1/(dot1-dot2);
                    this.clipVertices2[index]=x1+(x2-x1)*t;
                    this.clipVertices2[index+1]=y1+(y2-y1)*t;
                    this.clipVertices2[index+2]=z1+(z2-z1)*t;
                }
            }else{
                if(dot2>0){
                    index=numAddedClipVertices*3;
                    numAddedClipVertices++;
                    t=dot1/(dot1-dot2);
                    this.clipVertices2[index]=x1+(x2-x1)*t;
                    this.clipVertices2[index+1]=y1+(y2-y1)*t;
                    this.clipVertices2[index+2]=z1+(z2-z1)*t;
                    index=numAddedClipVertices*3;
                    numAddedClipVertices++;
                    this.clipVertices2[index]=x2;
                    this.clipVertices2[index+1]=y2;
                    this.clipVertices2[index+2]=z2;
                }
            }
            x1=x2;
            y1=y2;
            z1=z2;
            dot1=dot2;
        }

        numClipVertices=numAddedClipVertices;
        if(numClipVertices==0)return;
        numAddedClipVertices=0;
        index=(numClipVertices-1)*3;
        x1=this.clipVertices2[index];
        y1=this.clipVertices2[index+1];
        z1=this.clipVertices2[index+2];
        dot1=(x1-c.x+s2.x)*-n2.x+(y1-c.y+s2.y)*-n2.y+(z1-c.z+s2.z)*-n2.z;

        //i = numClipVertices;
        //while(i--){
        for(i=0;i<numClipVertices;i++){
            index=i*3;
            x2=this.clipVertices2[index];
            y2=this.clipVertices2[index+1];
            z2=this.clipVertices2[index+2];
            dot2=(x2-c.x+s2.x)*-n2.x+(y2-c.y+s2.y)*-n2.y+(z2-c.z+s2.z)*-n2.z;
            if(dot1>0){
                if(dot2>0){
                    index=numAddedClipVertices*3;
                    numAddedClipVertices++;
                    this.clipVertices1[index]=x2;
                    this.clipVertices1[index+1]=y2;
                    this.clipVertices1[index+2]=z2;
                }else{
                    index=numAddedClipVertices*3;
                    numAddedClipVertices++;
                    t=dot1/(dot1-dot2);
                    this.clipVertices1[index]=x1+(x2-x1)*t;
                    this.clipVertices1[index+1]=y1+(y2-y1)*t;
                    this.clipVertices1[index+2]=z1+(z2-z1)*t;
                }
            }else{
                if(dot2>0){
                    index=numAddedClipVertices*3;
                    numAddedClipVertices++;
                    t=dot1/(dot1-dot2);
                    this.clipVertices1[index]=x1+(x2-x1)*t;
                    this.clipVertices1[index+1]=y1+(y2-y1)*t;
                    this.clipVertices1[index+2]=z1+(z2-z1)*t;
                    index=numAddedClipVertices*3;
                    numAddedClipVertices++;
                    this.clipVertices1[index]=x2;
                    this.clipVertices1[index+1]=y2;
                    this.clipVertices1[index+2]=z2;
                }
            }
            x1=x2;
            y1=y2;
            z1=z2;
            dot1=dot2;
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

            x1 = (this.qqq[0]+this.qqq[3]+this.qqq[6]+this.qqq[9])*0.25;
            y1 = (this.qqq[1]+this.qqq[4]+this.qqq[7]+this.qqq[10])*0.25;
            z1 = (this.qqq[2]+this.qqq[5]+this.qqq[8]+this.qqq[11])*0.25;
            n1.x = this.qqq[0]-x1;
            n1.y = this.qqq[1]-y1;
            n1.z = this.qqq[2]-z1;
            n2.x = this.qqq[3]-x1;
            n2.y = this.qqq[4]-y1;
            n2.z = this.qqq[5]-z1;

            var index1=0;
            var index2=0;
            var index3=0;
            var index4=0;
            var maxDot=-this.INF;
            minDot=this.INF;

            //i = numClipVertices;
            //while(i--){
            for(i=0;i<numClipVertices;i++){
                this.used[i]=false;
                index=i*3;
                x1=this.clipVertices1[index];
                y1=this.clipVertices1[index+1];
                z1=this.clipVertices1[index+2];
                dot=x1*n1.x+y1*n1.y+z1*n1.z;
                if(dot<minDot){
                    minDot=dot;
                    index1=i;
                }
                if(dot>maxDot){
                    maxDot=dot;
                    index3=i;
                }
            }

            this.used[index1]=true;
            this.used[index3]=true;
            maxDot=-this.INF;
            minDot=this.INF;

            //i = numClipVertices;
            //while(i--){
            for(i=0;i<numClipVertices;i++){
                if(this.used[i])continue;
                index=i*3;
                x1=this.clipVertices1[index];
                y1=this.clipVertices1[index+1];
                z1=this.clipVertices1[index+2];
                dot=x1*n2.x+y1*n2.y+z1*n2.z;
                if(dot<minDot){
                    minDot=dot;
                    index2=i;
                }
                if(dot>maxDot){
                    maxDot=dot;
                    index4=i;
                }
            }

            index=index1*3;
            x1=this.clipVertices1[index];
            y1=this.clipVertices1[index+1];
            z1=this.clipVertices1[index+2];
            p.set( x1, y1, z1 );
            dot = (x1-c.x)*n.x+(y1-c.y)*n.y+(z1-c.z)*n.z;
            if(dot<0) manifold.addPointVec( p, n, dot, flipped );
            
            index=index2*3;
            x1=this.clipVertices1[index];
            y1=this.clipVertices1[index+1];
            z1=this.clipVertices1[index+2];
            p.set( x1, y1, z1 );
            dot=(x1-c.x)*n.x+(y1-c.y)*n.y+(z1-c.z)*n.z;
            if(dot<0) manifold.addPointVec( p, n, dot, flipped );
            
            index=index3*3;
            x1=this.clipVertices1[index];
            y1=this.clipVertices1[index+1];
            z1=this.clipVertices1[index+2];
            p.set( x1, y1, z1 );
            dot=(x1-c.x)*n.x+(y1-c.y)*n.y+(z1-c.z)*n.z;
            if(dot<0) manifold.addPointVec( p, n, dot, flipped );
            
            index=index4*3;
            x1=this.clipVertices1[index];
            y1=this.clipVertices1[index+1];
            z1=this.clipVertices1[index+2];
            p.set( x1, y1, z1 );
            dot=(x1-c.x)*n.x+(y1-c.y)*n.y+(z1-c.z)*n.z;
            if(dot<0) manifold.addPointVec( p, n, dot, flipped );
            
        }else{
            //n.set( n.x, n.y, n.z );
            //i = numClipVertices;
            //while(i--){
            for(i=0;i<numClipVertices;i++){
                index=i*3;
                x1=this.clipVertices1[index];
                y1=this.clipVertices1[index+1];
                z1=this.clipVertices1[index+2];
                p.set( x1, y1, z1 );
                dot=(x1-c.x)*n.x+(y1-c.y)*n.y+(z1-c.z)*n.z;
                if(dot<0) manifold.addPointVec( p, n, dot, flipped );
            }
        }

    }

});

export { BoxBoxCollisionDetector };