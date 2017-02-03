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
        this.v[i] = new Vec3();
    } 
    
    this.INF = _Math.INF;

    this.n = new Vec3();
    this.p = new Vec3();

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

        var p1=b1.position;
        var p2=b2.position;
        var p1x=p1.x;
        var p1y=p1.y;
        var p1z=p1.z;
        var p2x=p2.x;
        var p2y=p2.y;
        var p2z=p2.z;
        // diff
        var dx = p2x-p1x;
        var dy = p2y-p1y;
        var dz = p2z-p1z;
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
        /*var a1 = new Vec3();
        var a2 = new Vec3();
        var a3 = new Vec3();

        var a4 = new Vec3();
        var a5 = new Vec3();
        var a6 = new Vec3();

        var a7 = new Vec3();
        var a8 = new Vec3();
        var a9 = new Vec3();

        var aa = new Vec3();
        var ab = new Vec3();
        var ac = new Vec3();

        var ad = new Vec3();
        var ae = new Vec3();
        var af = new Vec3();

        var d1 = new Vec3();
        var d2 = new Vec3();
        var d3 = new Vec3();

        var d4 = new Vec3();
        var d5 = new Vec3();
        var d3 = new Vec3();*/

        
        var a1x=D1[0];
        var a1y=D1[1];
        var a1z=D1[2];

        var a2x=D1[3];
        var a2y=D1[4];
        var a2z=D1[5];

        var a3x=D1[6];
        var a3y=D1[7];
        var a3z=D1[8];

        var d1x=D1[9];
        var d1y=D1[10];
        var d1z=D1[11];

        var d2x=D1[12];
        var d2y=D1[13];
        var d2z=D1[14];

        var d3x=D1[15];
        var d3y=D1[16];
        var d3z=D1[17];

        //

        var a4x=D2[0];
        var a4y=D2[1];
        var a4z=D2[2];

        var a5x=D2[3];
        var a5y=D2[4];
        var a5z=D2[5];

        var a6x=D2[6];
        var a6y=D2[7];
        var a6z=D2[8];

        var d4x=D2[9];
        var d4y=D2[10];
        var d4z=D2[11];

        var d5x=D2[12];
        var d5y=D2[13];
        var d5z=D2[14];

        var d6x=D2[15];
        var d6y=D2[16];
        var d6z=D2[17];
        
        var a7x=a1y*a4z-a1z*a4y;
        var a7y=a1z*a4x-a1x*a4z;
        var a7z=a1x*a4y-a1y*a4x;

        var a8x=a1y*a5z-a1z*a5y;
        var a8y=a1z*a5x-a1x*a5z;
        var a8z=a1x*a5y-a1y*a5x;

        var a9x=a1y*a6z-a1z*a6y;
        var a9y=a1z*a6x-a1x*a6z;
        var a9z=a1x*a6y-a1y*a6x;

        var aax=a2y*a4z-a2z*a4y;
        var aay=a2z*a4x-a2x*a4z;
        var aaz=a2x*a4y-a2y*a4x;

        var abx=a2y*a5z-a2z*a5y;
        var aby=a2z*a5x-a2x*a5z;
        var abz=a2x*a5y-a2y*a5x;

        var acx=a2y*a6z-a2z*a6y;
        var acy=a2z*a6x-a2x*a6z;
        var acz=a2x*a6y-a2y*a6x;

        var adx=a3y*a4z-a3z*a4y;
        var ady=a3z*a4x-a3x*a4z;
        var adz=a3x*a4y-a3y*a4x;

        var aex=a3y*a5z-a3z*a5y;
        var aey=a3z*a5x-a3x*a5z;
        var aez=a3x*a5y-a3y*a5x;

        var afx=a3y*a6z-a3z*a6y;
        var afy=a3z*a6x-a3x*a6z;
        var afz=a3x*a6y-a3y*a6x;

        // right or left flags
        var rights = [];
        // overlapping distances
        var overlaps = [];

        var epsilon = _Math.EPZ;


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
        len=a1x*dx+a1y*dy+a1z*dz;
        rights[0]=len>0;
        if(!rights[0])len=-len;
        len1=w1;
        dot1=a1x*a4x+a1y*a4y+a1z*a4z;
        dot2=a1x*a5x+a1y*a5y+a1z*a5z;
        dot3=a1x*a6x+a1y*a6y+a1z*a6z;
        if(dot1<0)dot1=-dot1;
        if(dot2<0)dot2=-dot2;
        if(dot3<0)dot3=-dot3;
        len2=dot1*w2+dot2*h2+dot3*d2;
        overlaps[0] = len-len1-len2;
        if(overlaps[0]>0) return;

        // try axis 2
        len=a2x*dx+a2y*dy+a2z*dz;
        rights[1]=len>0;
        if(!rights[1])len=-len;
        len1=h1;
        dot1=a2x*a4x+a2y*a4y+a2z*a4z;
        dot2=a2x*a5x+a2y*a5y+a2z*a5z;
        dot3=a2x*a6x+a2y*a6y+a2z*a6z;
        if(dot1<0)dot1=-dot1;
        if(dot2<0)dot2=-dot2;
        if(dot3<0)dot3=-dot3;
        len2=dot1*w2+dot2*h2+dot3*d2;
        overlaps[1] = len-len1-len2;
        if(overlaps[1]>0) return;

        // try axis 3
        len=a3x*dx+a3y*dy+a3z*dz;
        rights[2]=len>0;
        if(!rights[2])len=-len;
        len1=d1;
        dot1=a3x*a4x+a3y*a4y+a3z*a4z;
        dot2=a3x*a5x+a3y*a5y+a3z*a5z;
        dot3=a3x*a6x+a3y*a6y+a3z*a6z;
        if(dot1<0)dot1=-dot1;
        if(dot2<0)dot2=-dot2;
        if(dot3<0)dot3=-dot3;
        len2=dot1*w2+dot2*h2+dot3*d2;
        overlaps[2]=len-len1-len2;
        if(overlaps[2]>0)return;

        // try axis 4
        len=a4x*dx+a4y*dy+a4z*dz;
        rights[3]=len>0;
        if(!rights[3])len=-len;
        dot1=a4x*a1x+a4y*a1y+a4z*a1z;
        dot2=a4x*a2x+a4y*a2y+a4z*a2z;
        dot3=a4x*a3x+a4y*a3y+a4z*a3z;
        if(dot1<0)dot1=-dot1;
        if(dot2<0)dot2=-dot2;
        if(dot3<0)dot3=-dot3;
        len1=dot1*w1+dot2*h1+dot3*d1;
        len2=w2;
        overlaps[3]=(len-len1-len2)*1.0;
        if(overlaps[3]>0)return;

        // try axis 5
        len=a5x*dx+a5y*dy+a5z*dz;
        rights[4]=len>0;
        if(!rights[4])len=-len;
        dot1=a5x*a1x+a5y*a1y+a5z*a1z;
        dot2=a5x*a2x+a5y*a2y+a5z*a2z;
        dot3=a5x*a3x+a5y*a3y+a5z*a3z;
        if(dot1<0)dot1=-dot1;
        if(dot2<0)dot2=-dot2;
        if(dot3<0)dot3=-dot3;
        len1=dot1*w1+dot2*h1+dot3*d1;
        len2=h2;
        overlaps[4]=(len-len1-len2)*1.0;
        if(overlaps[4]>0)return;

        // try axis 6
        len=a6x*dx+a6y*dy+a6z*dz;
        rights[5]=len>0;
        if(!rights[5])len=-len;
        dot1=a6x*a1x+a6y*a1y+a6z*a1z;
        dot2=a6x*a2x+a6y*a2y+a6z*a2z;
        dot3=a6x*a3x+a6y*a3y+a6z*a3z;
        if(dot1<0)dot1=-dot1;
        if(dot2<0)dot2=-dot2;
        if(dot3<0)dot3=-dot3;
        len1=dot1*w1+dot2*h1+dot3*d1;
        len2=d2;
        overlaps[5]=(len-len1-len2)*1.0;
        if(overlaps[5]>0)return;

        // try axis 7
        len=a7x*a7x+a7y*a7y+a7z*a7z;
        if(len>epsilon){
            len=1/_Math.sqrt(len);
            a7x*=len;
            a7y*=len;
            a7z*=len;
            len=a7x*dx+a7y*dy+a7z*dz;
            rights[6]=len>0;
            if(!rights[6])len=-len;
            dot1=a7x*a2x+a7y*a2y+a7z*a2z;
            dot2=a7x*a3x+a7y*a3y+a7z*a3z;
            if(dot1<0)dot1=-dot1;
            if(dot2<0)dot2=-dot2;
            len1=dot1*h1+dot2*d1;
            dot1=a7x*a5x+a7y*a5y+a7z*a5z;
            dot2=a7x*a6x+a7y*a6y+a7z*a6z;
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
        len=a8x*a8x+a8y*a8y+a8z*a8z;
        if(len>epsilon){
            len=1/_Math.sqrt(len);
            a8x*=len;
            a8y*=len;
            a8z*=len;
            len=a8x*dx+a8y*dy+a8z*dz;
            rights[7]=len>0;
            if(!rights[7])len=-len;
            dot1=a8x*a2x+a8y*a2y+a8z*a2z;
            dot2=a8x*a3x+a8y*a3y+a8z*a3z;
            if(dot1<0)dot1=-dot1;
            if(dot2<0)dot2=-dot2;
            len1=dot1*h1+dot2*d1;
            dot1=a8x*a4x+a8y*a4y+a8z*a4z;
            dot2=a8x*a6x+a8y*a6y+a8z*a6z;
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
        len=a9x*a9x+a9y*a9y+a9z*a9z;
        if( len > epsilon ){
            len=1/_Math.sqrt(len);
            a9x*=len;
            a9y*=len;
            a9z*=len;
            len=a9x*dx+a9y*dy+a9z*dz;
            rights[8]=len>0;
            if(!rights[8])len=-len;
            dot1=a9x*a2x+a9y*a2y+a9z*a2z;
            dot2=a9x*a3x+a9y*a3y+a9z*a3z;
            if(dot1<0)dot1=-dot1;
            if(dot2<0)dot2=-dot2;
            len1=dot1*h1+dot2*d1;
            dot1=a9x*a4x+a9y*a4y+a9z*a4z;
            dot2=a9x*a5x+a9y*a5y+a9z*a5z;
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
        len=aax*aax+aay*aay+aaz*aaz;
        if( len > epsilon ){
            len=1/_Math.sqrt(len);
            aax*=len;
            aay*=len;
            aaz*=len;
            len=aax*dx+aay*dy+aaz*dz;
            rights[9]=len>0;
            if(!rights[9])len=-len;
            dot1=aax*a1x+aay*a1y+aaz*a1z;
            dot2=aax*a3x+aay*a3y+aaz*a3z;
            if(dot1<0)dot1=-dot1;
            if(dot2<0)dot2=-dot2;
            len1=dot1*w1+dot2*d1;
            dot1=aax*a5x+aay*a5y+aaz*a5z;
            dot2=aax*a6x+aay*a6y+aaz*a6z;
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
        len=abx*abx+aby*aby+abz*abz;
        if(len>epsilon){
            len=1/_Math.sqrt(len);
            abx*=len;
            aby*=len;
            abz*=len;
            len=abx*dx+aby*dy+abz*dz;
            rights[10]=len>0;
            if(!rights[10])len=-len;
            dot1=abx*a1x+aby*a1y+abz*a1z;
            dot2=abx*a3x+aby*a3y+abz*a3z;
            if(dot1<0)dot1=-dot1;
            if(dot2<0)dot2=-dot2;
            len1=dot1*w1+dot2*d1;
            dot1=abx*a4x+aby*a4y+abz*a4z;
            dot2=abx*a6x+aby*a6y+abz*a6z;
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
        len=acx*acx+acy*acy+acz*acz;
        if(len>epsilon){
            len=1/_Math.sqrt(len);
            acx*=len;
            acy*=len;
            acz*=len;
            len=acx*dx+acy*dy+acz*dz;
            rights[11]=len>0;
            if(!rights[11])len=-len;
            dot1=acx*a1x+acy*a1y+acz*a1z;
            dot2=acx*a3x+acy*a3y+acz*a3z;
            if(dot1<0)dot1=-dot1;
            if(dot2<0)dot2=-dot2;
            len1=dot1*w1+dot2*d1;
            dot1=acx*a4x+acy*a4y+acz*a4z;
            dot2=acx*a5x+acy*a5y+acz*a5z;
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
        len=adx*adx+ady*ady+adz*adz;
        if(len>epsilon){
            len=1/_Math.sqrt(len);
            adx*=len;
            ady*=len;
            adz*=len;
            len=adx*dx+ady*dy+adz*dz;
            rights[12]=len>0;
            if(!rights[12])len=-len;
            dot1=adx*a1x+ady*a1y+adz*a1z;
            dot2=adx*a2x+ady*a2y+adz*a2z;
            if(dot1<0)dot1=-dot1;
            if(dot2<0)dot2=-dot2;
            len1=dot1*w1+dot2*h1;
            dot1=adx*a5x+ady*a5y+adz*a5z;
            dot2=adx*a6x+ady*a6y+adz*a6z;
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
        len=aex*aex+aey*aey+aez*aez;
        if(len>epsilon){
            len=1/_Math.sqrt(len);
            aex*=len;
            aey*=len;
            aez*=len;
            len=aex*dx+aey*dy+aez*dz;
            rights[13]=len>0;
            if(!rights[13])len=-len;
            dot1=aex*a1x+aey*a1y+aez*a1z;
            dot2=aex*a2x+aey*a2y+aez*a2z;
            if(dot1<0)dot1=-dot1;
            if(dot2<0)dot2=-dot2;
            len1=dot1*w1+dot2*h1;
            dot1=aex*a4x+aey*a4y+aez*a4z;
            dot2=aex*a6x+aey*a6y+aez*a6z;
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
        len=afx*afx+afy*afy+afz*afz;
        if(len>epsilon){
            len=1/_Math.sqrt(len);
            afx*=len;
            afy*=len;
            afz*=len;
            len=afx*dx+afy*dy+afz*dz;
            rights[14]=len>0;
            if(!rights[14])len=-len;
            dot1=afx*a1x+afy*a1y+afz*a1z;
            dot2=afx*a2x+afy*a2y+afz*a2z;
            if(dot1<0)dot1=-dot1;
            if(dot2<0)dot2=-dot2;
            len1=dot1*w1+dot2*h1;
            dot1=afx*a4x+afy*a4y+afz*a4z;
            dot2=afx*a5x+afy*a5y+afz*a5z;
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
        // normal
        //var n.x=0;
        //var n.y=0;
        //var n.z=0;
        // edge line or face side normal
        var n1x=0;
        var n1y=0;
        var n1z=0;
        var n2x=0;
        var n2y=0;
        var n2z=0;
        // center of current face
        var cx=0;
        var cy=0;
        var cz=0;
        // face side
        var s1x=0;
        var s1y=0;
        var s1z=0;
        var s2x=0;
        var s2y=0;
        var s2z=0;
        // swap b1 b2
        var swap=false;

        //_______________________________________

        switch ( minIndex ){
            case 0:// b1.x * b2
                n.set( a1x, a1y, a1z );
                if( right ){
                    cx=p1x+d1x; cy=p1y+d1y;  cz=p1z+d1z;
                }else{
                    cx=p1x-d1x; cy=p1y-d1y; cz=p1z-d1z;
                    n.negate();
                }
                s1x=d2x; s1y=d2y; s1z=d2z;
                n1x=-a2x; n1y=-a2y; n1z=-a2z;
                s2x=d3x; s2y=d3y; s2z=d3z;
                n2x=-a3x; n2y=-a3y; n2z=-a3z;
            break;
            case 1:// b1.y * b2
                n.set( a2x, a2y, a2z );
                if( right ){
                    cx=p1x+d2x; cy=p1y+d2y; cz=p1z+d2z;
                }else{
                    cx=p1x-d2x; cy=p1y-d2y; cz=p1z-d2z;
                    n.negate();
                }
                s1x=d1x; s1y=d1y; s1z=d1z;
                n1x=-a1x; n1y=-a1y; n1z=-a1z;
                s2x=d3x; s2y=d3y; s2z=d3z;
                n2x=-a3x; n2y=-a3y; n2z=-a3z;
            break;
            case 2:// b1.z * b2
                n.set( a3x, a3y, a3z );
                if( right ){
                    cx=p1x+d3x; cy=p1y+d3y; cz=p1z+d3z;
                }else{
                    cx=p1x-d3x; cy=p1y-d3y; cz=p1z-d3z;
                    n.negate();
                }
                s1x=d1x; s1y=d1y; s1z=d1z;
                n1x=-a1x; n1y=-a1y; n1z=-a1z;
                s2x=d2x; s2y=d2y; s2z=d2z;
                n2x=-a2x; n2y=-a2y; n2z=-a2z;
            break;
            case 3:// b2.x * b1
                n.set( a4x, a4y, a4z );
                if( !right ){
                    cx=p2x+d4x; cy=p2y+d4y; cz=p2z+d4z;
                }else{
                    cx=p2x-d4x; cy=p2y-d4y; cz=p2z-d4z;
                    n.negate();
                }
                s1x=d5x; s1y=d5y; s1z=d5z;
                n1x=-a5x; n1y=-a5y; n1z=-a5z;
                s2x=d6x; s2y=d6y; s2z=d6z;
                n2x=-a6x; n2y=-a6y; n2z=-a6z;
                swap = true;
            break;
            case 4:// b2.y * b1
                n.set( a5x, a5y, a5z );
                if( !right ){
                    cx=p2x+d5x; cy=p2y+d5y; cz=p2z+d5z; 
                }else{
                    cx=p2x-d5x; cy=p2y-d5y; cz=p2z-d5z;
                    n.negate();
                }
                s1x=d4x; s1y=d4y; s1z=d4z;
                n1x=-a4x; n1y=-a4y; n1z=-a4z;
                s2x=d6x; s2y=d6y; s2z=d6z;
                n2x=-a6x; n2y=-a6y; n2z=-a6z;
                swap = true;
            break;
            case 5:// b2.z * b1
                n.set( a6x, a6y, a6z );
                if( !right ){
                    cx=p2x+d6x; cy=p2y+d6y; cz=p2z+d6z;
                }else{
                    cx=p2x-d6x; cy=p2y-d6y; cz=p2z-d6z;
                    n.negate();
                }
                s1x=d4x; s1y=d4y; s1z=d4z;
                n1x=-a4x; n1y=-a4y; n1z=-a4z;
                s2x=d5x; s2y=d5y; s2z=d5z;
                n2x=-a5x; n2y=-a5y; n2z=-a5z;
                swap = true;
            break;
            case 6:// b1.x * b2.x
                n.set( a7x, a7y, a7z );
                n1x=a1x; n1y=a1y; n1z=a1z;
                n2x=a4x; n2y=a4y; n2z=a4z;
            break;
            case 7:// b1.x * b2.y
                n.set( a8x, a8y, a8z );
                n1x=a1x; n1y=a1y; n1z=a1z;
                n2x=a5x; n2y=a5y; n2z=a5z;
            break;
            case 8:// b1.x * b2.z
                n.set( a9x, a9y, a9z );
                n1x=a1x; n1y=a1y; n1z=a1z;
                n2x=a6x; n2y=a6y; n2z=a6z;
            break;
            case 9:// b1.y * b2.x
                n.set( aax, aay, aaz );
                n1x=a2x; n1y=a2y; n1z=a2z;
                n2x=a4x; n2y=a4y; n2z=a4z
            break;
            case 10:// b1.y * b2.y
                n.set( abx, aby, abz );
                n1x=a2x; n1y=a2y; n1z=a2z;
                n2x=a5x; n2y=a5y; n2z=a5z;
            break;
            case 11:// b1.y * b2.z
                n.set( acx, acy, acz );
                n1x=a2x; n1y=a2y; n1z=a2z;
                n2x=a6x; n2y=a6y; n2z=a6z;
            break;
            case 12:// b1.z * b2.x
                n.set( adx, ady, adz );
                n1x=a3x; n1y=a3y; n1z=a3z;
                n2x=a4x; n2y=a4y; n2z=a4z;
            break;
            case 13:// b1.z * b2.y
                n.set( aex, aey, aez );
                n1x=a3x; n1y=a3y; n1z=a3z;
                n2x=a5x; n2y=a5y; n2z=a5z;
            break;
            case 14:// b1.z * b2.z
                n.set( afx, afy, afz );
                n1x=a3x; n1y=a3y; n1z=a3z;
                n2x=a6x; n2y=a6y; n2z=a6z;
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
            dot1=n1x*n2x+n1y*n2y+n1z*n2z;
            var t=(vx*(n1x-n2x*dot1)+vy*(n1y-n2y*dot1)+vz*(n1z-n2z*dot1))/(1-dot1*dot1);

            //n.set( n.x, n.y, n.z );
            p.set(
                v1x+n1x*t+n.x*depth*0.5,
                v1y+n1y*t+n.y*depth*0.5,
                v1z+n1z*t+n.z*depth*0.5
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

            dot = a1x*n.x + a1y*n.y + a1z*n.z;
            if(dot<minDot){ minDot = dot; minDotId = 0; }
            if(-dot<minDot){  minDot = -dot; minDotId = 1; }

            dot = a2x*n.x + a2y*n.y + a2z*n.z;
            if(dot<minDot){ minDot = dot;  minDotId = 2; }
            if(-dot<minDot){ minDot = -dot; minDotId = 3; }

            dot = a3x*n.x + a3y*n.y + a3z*n.z;
            if(dot<minDot){ minDot = dot; minDotId = 4; }
            if(-dot<minDot){ minDot = -dot; minDotId = 5; }

            ar = V1;

        }else{

            dot = a4x*n.x + a4y*n.y + a4z*n.z;
            if(dot<minDot){ minDot = dot; minDotId = 0; }
            if(-dot<minDot){ minDot=-dot; minDotId = 1; }

            dot = a5x*n.x + a5y*n.y + a5z*n.z;
            if(dot<minDot){ minDot=dot; minDotId = 2; }
            if(-dot<minDot){ minDot=-dot; minDotId = 3; }

            dot = a6x*n.x + a6y*n.y + a6z*n.z;
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
        dot1=(x1-cx-s1x)*n1x+(y1-cy-s1y)*n1y+(z1-cz-s1z)*n1z;

        //var i = 4;
        //while(i--){
        for(var i=0;i<4;i++){
            index=i*3;
            x2=this.clipVertices1[index];
            y2=this.clipVertices1[index+1];
            z2=this.clipVertices1[index+2];
            dot2=(x2-cx-s1x)*n1x+(y2-cy-s1y)*n1y+(z2-cz-s1z)*n1z;
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
        dot1=(x1-cx-s2x)*n2x+(y1-cy-s2y)*n2y+(z1-cz-s2z)*n2z;

        //i = numClipVertices;
        //while(i--){
        for(i=0;i<numClipVertices;i++){
            index=i*3;
            x2=this.clipVertices2[index];
            y2=this.clipVertices2[index+1];
            z2=this.clipVertices2[index+2];
            dot2=(x2-cx-s2x)*n2x+(y2-cy-s2y)*n2y+(z2-cz-s2z)*n2z;
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
        dot1=(x1-cx+s1x)*-n1x+(y1-cy+s1y)*-n1y+(z1-cz+s1z)*-n1z;

        //i = numClipVertices;
        //while(i--){
        for(i=0;i<numClipVertices;i++){
            index=i*3;
            x2 = this.clipVertices1[index];
            y2 = this.clipVertices1[index+1];
            z2 = this.clipVertices1[index+2];
            dot2=(x2-cx+s1x)*-n1x+(y2-cy+s1y)*-n1y+(z2-cz+s1z)*-n1z;
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
        dot1=(x1-cx+s2x)*-n2x+(y1-cy+s2y)*-n2y+(z1-cz+s2z)*-n2z;

        //i = numClipVertices;
        //while(i--){
        for(i=0;i<numClipVertices;i++){
            index=i*3;
            x2=this.clipVertices2[index];
            y2=this.clipVertices2[index+1];
            z2=this.clipVertices2[index+2];
            dot2=(x2-cx+s2x)*-n2x+(y2-cy+s2y)*-n2y+(z2-cz+s2z)*-n2z;
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
            n1x = this.qqq[0]-x1;
            n1y = this.qqq[1]-y1;
            n1z = this.qqq[2]-z1;
            n2x = this.qqq[3]-x1;
            n2y = this.qqq[4]-y1;
            n2z = this.qqq[5]-z1;

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
                dot=x1*n1x+y1*n1y+z1*n1z;
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
                dot=x1*n2x+y1*n2y+z1*n2z;
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
            dot = (x1-cx)*n.x+(y1-cy)*n.y+(z1-cz)*n.z;
            if(dot<0) manifold.addPointVec( p, n, dot, flipped );
            
            index=index2*3;
            x1=this.clipVertices1[index];
            y1=this.clipVertices1[index+1];
            z1=this.clipVertices1[index+2];
            p.set( x1, y1, z1 );
            dot=(x1-cx)*n.x+(y1-cy)*n.y+(z1-cz)*n.z;
            if(dot<0) manifold.addPointVec( p, n, dot, flipped );
            
            index=index3*3;
            x1=this.clipVertices1[index];
            y1=this.clipVertices1[index+1];
            z1=this.clipVertices1[index+2];
            p.set( x1, y1, z1 );
            dot=(x1-cx)*n.x+(y1-cy)*n.y+(z1-cz)*n.z;
            if(dot<0) manifold.addPointVec( p, n, dot, flipped );
            
            index=index4*3;
            x1=this.clipVertices1[index];
            y1=this.clipVertices1[index+1];
            z1=this.clipVertices1[index+2];
            p.set( x1, y1, z1 );
            dot=(x1-cx)*n.x+(y1-cy)*n.y+(z1-cz)*n.z;
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
                dot=(x1-cx)*n.x+(y1-cy)*n.y+(z1-cz)*n.z;
                if(dot<0) manifold.addPointVec( p, n, dot, flipped );
            }
        }

    }

});

export { BoxBoxCollisionDetector };