import { CollisionDetector } from './CollisionDetector';
import { _Math } from '../../math/Math';
import { Vec3 } from '../../math/Vec3';
import { Mat33 } from '../../math/Mat33';

function CylinderCylinderCollisionDetector() {
    
    CollisionDetector.call( this );

    this.n = new Vec3();
    this.n1 = new Vec3();
    this.n2 = new Vec3();
    this.p = new Vec3();
    this.d = new Vec3();
    this.d1 = new Vec3();
    this.d2 = new Vec3();
    this.p1 = new Vec3();
    this.p2 = new Vec3();

    this.cc1 = new Vec3();
    this.cc2 = new Vec3();

    this.tmp0 = new Vec3();
    this.tmp1 = new Vec3();
    this.tmp2 = new Vec3();
    this.tmp3 = new Vec3();

    this.rtt = new Mat33();

    this.sep = 0;

    this.v = [];
    var i = 13;
    while( i-- ){
        this.v.push( new Vec3() );
    } 



};

CylinderCylinderCollisionDetector.prototype = Object.assign( Object.create( CollisionDetector.prototype ), {

    constructor: CylinderCylinderCollisionDetector,

    crossX: function ( a, b, c ) {

        this.tmp3.crossVectors( a, b ).scaleVectorEqual( c );
        return this.tmp3.x+this.tmp3.y+this.tmp3.z;

    },


    getSep: function ( c1, c2 ) {

        var n = this.n;
        var p = this.p;
        var d = this.d;
        var p1 = this.p1;
        var p2 = this.p2;

        var tmp0 = this.tmp0;
        var tmp1 = this.tmp1;
        var tmp2 = this.tmp2;

        var v = this.v;

        var b0, b1, b2, b3, sum, inv, separation;
        var len;

        if( d.lengthSq() === 0 ) d.y = 0.001;
        n.copy( d ).negate();
        
        this.supportPoint( c1, n, tmp1, true );
        this.supportPoint( c2, n, tmp2 );
        tmp0.sub( tmp2, tmp1 );

        if( _Math.dotVectors( tmp0, n ) <= 0 ) return false;

        n.cross( tmp0, d );

        if( n.lengthSq() == 0 ){
            n.sub( tmp0, d ).normalize();
            p.add( tmp1, tmp2 ).scaleEqual( 0.5 );
            return true;
        }

        this.supportPoint( c1, n, v[4], true );
        this.supportPoint( c2, n, v[5] );
        v[6].sub( v[5], v[4] );

        if( _Math.dotVectors( v[6], n ) <= 0 ) return false;

        v[0].sub( tmp0, d.x );
        v[1].sub( v[6], d.x );

        n.crossVectors( v[0], v[1] );
        
        if( n.lengthSq() > 0 ){

            v[0].copy( tmp0 );
            tmp0.copy( v[6] );
            v[6].copy( v[0] );
            v[0].copy( tmp1 );
            tmp1.copy( v[4] );
            v[4].copy( v[0] );
            v[0].copy( tmp2 );
            tmp2.copy( v[5] );
            v[5].copy( v[0] );

            n.negate();

        }

        var iterations=0;

        while(true){

            if( ++iterations > 8 ) return false;
            //if( ++iterations > 100 ) return false;
            
            this.supportPoint( c1, n, v[7], true );
            this.supportPoint( c2, n, v[8] );
            v[9].sub( v[8], v[7] );

            if( _Math.dotVectors( v[9], n ) <= 0 ) return false;
            
            if( this.crossX( tmp0, v[9], d ) < 0 ){

                v[6].copy( v[9] );
                v[4].copy( v[7] );
                v[5].copy( v[8] );
                v[0].sub( tmp0, d );
                v[1].sub( v[9], d );

                n.crossVectors( v[0], v[1] );

                continue;
            }

            if( this.crossX( v[9], v[6], d ) < 0 ){

                tmp0.copy( v[9] );
                tmp1.copy( v[7] );
                tmp1.copy( v[8] );
                v[0].sub( v[9], d );
                v[1].sub( v[6], d );

                n.crossVectors( v[0], v[1] );

                continue;
            }

            var hit = false;

            while( true ){

                v[0].sub( v[6], tmp0 );
                v[1].sub( v[9], tmp0 );

                n.crossVectors( v[0], v[1] );

                len = 1 / n.length();
                n.x*=len;
                n.y*=len;
                n.z*=len;

                if( _Math.dotVectors( n, tmp0 ) >= 0 && !hit ){

                    b0 = this.crossX( tmp0, v[6], v[9] );
                    b1 = this.crossX( v[9], v[6], d );
                    b2 = this.crossX( d, tmp0, v[9] );
                    b3 = this.crossX( v[6], tmp0, d );
                    sum = b0+b1+b2+b3;
                    if(sum<=0){
                        b0 = 0;
                        b1 = this.crossX( v[6], v[9], n );
                        b2 = this.crossX( v[9], v[6], n );
                        b3 = this.crossX( tmp0, v[6], n );
                        sum = b1+b2+b3;
                    }
                    inv = 1/sum;
                    v[2].set(
                        ( p1.x*b0 + tmp1.x*b1 + v[4].x*b2 + v[7].x*b3 ) * inv,
                        ( p1.y*b0 + tmp1.y*b1 + v[4].y*b2 + v[7].y*b3 ) * inv,
                        ( p1.z*b0 + tmp1.z*b1 + v[4].z*b2 + v[7].z*b3 ) * inv
                    )
                    v[3].set(
                        ( p2.x*b0 + tmp2.x*b1 + v[5].x*b2 + v[8].x*b3 ) * inv,
                        ( p2.y*b0 + tmp2.y*b1 + v[5].y*b2 + v[8].y*b3 ) * inv,
                        ( p2.z*b0 + tmp2.z*b1 + v[5].z*b2 + v[8].z*b3 ) * inv
                    )
                    hit = true;

                }

                this.supportPoint( c1, n, v[10], true);
                this.supportPoint( c2, n, v[11] );
                v[12].sub( v[11], v[10] );

                separation = -_Math.dotVectors( v[12], n );

                if( (v[12].x-v[9].x)*n.x + (v[12].y-v[9].y)*n.y + (v[12].z-v[9].z)*n.z <= 0.01 || separation >= 0 ){

                    if( hit ){
                        n.negate();
                        p.add( v[2], v[3] ).scaleEqual( 0.5 );
                        this.sep = separation;
                        return true;
                    }

                    return false;

                }

                if( this.crossX( v[12], tmp0, d ) < 0 ){

                    if( this.crossX( v[12], v[6], d ) < 0 ){

                        tmp0.copy( v[12] );
                        tmp1.copy( v[10] );
                        tmp2.copy( v[11] );

                    }else{

                        v[9].copy( v[12] );
                        v[7].copy( v[10] );
                        v[8].copy( v[11] );

                    }

                }else{

                    if( this.crossX( v[12], v[9], d ) < 0 ){

                        v[6].copy( v[12] );
                        v[4].copy( v[10] );
                        v[5].copy( v[11] );

                    }else{

                        tmp0.copy( v[12] );
                        tmp1.copy( v[10] );
                        tmp2.copy( v[11] );

                    }
                }
            }
        }
        
        return false;
    },

    supportPoint: function ( c, n, out, revers ) {
        
        var ld = n.clone();
        var o = new Vec3();
        if( revers ) ld.negate();

        ld.applyMatrix3( c.rotation );

        var len = ld.x*ld.x + ld.z*ld.z;
     
        if( len === 0 ){
            o.set( c.radius, 0, 0 );
        }else{
            len = c.radius/_Math.sqrt( len );
            o.set( ld.x*len, 0, ld.z*len );
        }

        o.y = ld.y < 0 ? -c.halfHeight : c.halfHeight;
        ld.mulMat( c.rotation, o ).addEqual( c.position );
        out.set( ld.x, ld.y, ld.z );

    },

    detectCollision: function ( shape1, shape2, manifold ) {

        var c1;
        var c2;
        if(shape1.id<shape2.id){
            c1=shape1;
            c2=shape2;
        }else{
            c1=shape2;
            c2=shape1;
        }

        var p = this.p;
        var p1 = this.p1;
        var p2 = this.p2;
        var n = this.n;
        var n1 = this.n1;
        var n2 = this.n2;
        var d1 = this.d1;
        var d2 = this.d2;
        var cc1 = this.cc1;
        var cc2 = this.cc2;
        var d = this.d;
        var v = this.v;

        var rtt = this.rtt;

        p1.copy( c1.position );
        p2.copy( c2.position );

        n1.copy( c1.normalDirection );
        n2.copy( c2.normalDirection );

        d1.copy( c1.halfDirection );
        d2.copy( c2.halfDirection );



         // diff
        d.sub( p2, p1 );


        var h1 = c1.halfHeight;
        var h2 = c2.halfHeight;
        var r1 = c1.radius;
        var r2 = c2.radius;

        var len;
        var depth1;
        var depth2;
        var dot;
        var t1;
        var t2;

        if( !this.getSep( c1, c2 ) ) return;

        var dot1 = _Math.dotVectors( n, n1 );
        var dot2 = _Math.dotVectors( n, n2 );
        var right1 = dot1>0;
        var right2 = dot2>0;
        if(!right1) dot1=-dot1;
        if(!right2) dot2=-dot2;
        var state=0;
        if( dot1 > 0.999 || dot2 > 0.999 ){
            if( dot1 > dot2 ) state = 1;
            else state = 2;
        }

        var depth = this.sep;//dep.x;

        var pd;
        var a;
        var b;
        var e;
        var f;

        switch( state ){
            case 0:
                manifold.addPointVec( p, n, depth, false );
            break;
            case 1:
                if( right1 ){
                    cc1.add( p1, d1 );
                    n.copy( n1 );
                }else{
                    cc1.sub( p1, d1 );
                    n.copy( n1 ).negate();
                }
                dot = _Math.dotVectors( n, n2 );
                if(dot<0)len=h2;
                else len=-h2;

                cc2.x = p2.x+len*n2.x;
                cc2.y = p2.y+len*n2.y;
                cc2.z = p2.z+len*n2.z;
                v[0].copy( n );

                if(dot2>=0.999999) v[0].x=-n.y;
                

                len = _Math.dotVectors( v[0], n2 );
                d.x=len*n2.x-v[0].x;
                d.y=len*n2.y-v[0].y;
                d.z=len*n2.z-v[0].z;
                len = d.length();
                if(len==0) break;
                len=r2/len;
                d.x*=len;
                d.y*=len;
                d.z*=len;
                v[0].x=cc2.x+d.x;
                v[0].y=cc2.y+d.y;
                v[0].z=cc2.z+d.z;


                if(dot<-0.96||dot>0.96){
                    rtt.set(
                        n2.x*n2.x*1.5-0.5,
                        n2.x*n2.y*1.5-n2.z*0.866025403,
                        n2.x*n2.z*1.5+n2.y*0.866025403,
                        n2.y*n2.x*1.5+n2.z*0.866025403,
                        n2.y*n2.y*1.5-0.5,
                        n2.y*n2.z*1.5-n2.x*0.866025403,
                        n2.z*n2.x*1.5-n2.y*0.866025403,
                        n2.z*n2.y*1.5+n2.x*0.866025403,
                        n2.z*n2.z*1.5-0.5
                    )

                    v[3].copy( v[0] );
                    v[5].sub( v[3], cc1 ).scaleVectorEqual( n );

                    pd = v[5].lengthSq();

                    //pd = n.x*(v[3].x-cc1.x)+n.y*(v[3].y-cc1.y)+n.z*(v[3].z-cc1.z);
                    v[0].x=v[3].x-pd*n.x-cc1.x;
                    v[0].y=v[3].y-pd*n.y-cc1.y;
                    v[0].z=v[3].z-pd*n.z-cc1.z;
                    len= v[0].lengthSq();
                    if(len>r1*r1){
                        len=r1/_Math.sqrt(len);
                        v[0].x*=len;
                        v[0].y*=len;
                        v[0].z*=len;
                    }
                    v[3].x=cc1.x+v[0].x;
                    v[3].y=cc1.y+v[0].y;
                    v[3].z=cc1.z+v[0].z;
                    manifold.addPointVec( v[3], n, pd, false );

                    d.applyMatrix3( rtt );
                    v[3].add( d, cc2 );
                    v[5].sub( v[3], cc1 ).scaleVectorEqual( n );
                    //v[3].copy(d).applyMatrix3( rtt );

                    //v[3].x=(d.x=v[3].x)+cc2.x;
                    //v[3].y=(d.y=v[3].y)+cc2.y;
                    //v[3].z=(d.z=v[3].z)+cc2.z;

                    pd = v[5].lengthSq();//n.x*(v[3].x-cc1.x)+n.y*(v[3].y-cc1.y)+n.z*(v[3].z-cc1.z);
                    if(pd<=0){
                        v[0].x=v[3].x - pd*n.x - cc1.x;
                        v[0].y=v[3].y - pd*n.y - cc1.y;
                        v[0].z=v[3].z - pd*n.z - cc1.z;
                        len=v[0].x*v[0].x+v[0].y*v[0].y+v[0].z*v[0].z;
                        if(len>r1*r1){
                            len=r1/_Math.sqrt(len);
                            v[0].x*=len;
                            v[0].y*=len;
                            v[0].z*=len;
                        }
                        v[3].add( cc1, v[0] );
                        manifold.addPointVec( v[3], n, pd, false );
                    }

                    d.applyMatrix3( rtt );
                    v[3].add( d, cc2 );
                    v[5].sub( v[3], cc1 ).scaleVectorEqual( n );

                    /*v[3].copy(d).applyMatrix3( rtt );
                    d.copy( v[3] );

                    v[3].x=(d.x=v[3].x)+cc2.x;
                    v[3].y=(d.y=v[3].y)+cc2.y;
                    v[3].z=(d.z=v[3].z)+cc2.z;*/
                    pd = v[5].lengthSq();//n.x*(v[3].x-cc1.x)+n.y*(v[3].y-cc1.y)+n.z*(v[3].z-cc1.z);
                    if( pd <= 0 ){
                        v[0].x=v[3].x-pd*n.x-cc1.x;
                        v[0].y=v[3].y-pd*n.y-cc1.y;
                        v[0].z=v[3].z-pd*n.z-cc1.z;
                        len = v[0].lengthSq();
                        if(len>r1*r1){
                            len=r1/_Math.sqrt(len);
                            v[0].x*=len;
                            v[0].y*=len;
                            v[0].z*=len;
                        }
                        v[3].add( cc1, v[0] );
                        //.x=cc1.x+v[0].x;
                        //v[3].y=cc1.y+v[0].y;
                        //v[3].z=cc1.z+v[0].z;
                        manifold.addPointVec( v[3], n, pd, false );
                    }
                }else{

                    v[1].copy( v[0] );
                    v[5].sub( v[1], cc1 ).scaleVectorEqual( n );
                    depth1 = v[5].lengthSq();// n.x*(v[1].x-cc1.x)+n.y*(v[1].y-cc1.y)+n.z*(v[1].z-cc1.z);
                    v[1].x-=depth1*n.x;
                    v[1].y-=depth1*n.y;
                    v[1].z-=depth1*n.z;
                    if(dot>0){
                        v[2].add( v[0], n2 ).scaleEqual( h2*2 );
                        //v[2].x=v[0].x+n2.x*h2*2;
                        //v[2].y=v[0].y+n2.y*h2*2;
                        //v[2].z=v[0].z+n2.z*h2*2;
                    }else{
                        v[2].sub( v[0], n2 ).scaleEqual( h2*2 );
                        //v[2].x=v[0].x-n2.x*h2*2;
                        //v[2].y=v[0].y-n2.y*h2*2;
                        //v[2].z=v[0].z-n2.z*h2*2;
                    }
                    v[5].sub( v[2], cc1 ).scaleVectorEqual( n );
                    depth2 = v[5].lengthSq();//n.x*(v[2].x-cc1.x)+n.y*(v[2].y-cc1.y)+n.z*(v[2].z-cc1.z);
                    v[2].x-=depth2*n.x;
                    v[2].y-=depth2*n.y;
                    v[2].z-=depth2*n.z;

                    d.sub( cc1, v[1] );
                    v[0].sub( v[2], v[1] );

                    a = d.lengthSq();
                    b = _Math.dotVectors( d, v[0] );
                    e = v[0].lengthSq();
                    f = b*b-e*(a-r1*r1);
                    if(f<0)break;
                    f=_Math.sqrt(f);
                    t1=(b+f)/e;
                    t2=(b-f)/e;
                    if(t2<t1){
                        len=t1;
                        t1=t2;
                        t2=len;
                    }
                    if(t2>1)t2=1;
                    if(t1<0)t1=0;
                    v[0].x=v[1].x+(v[2].x-v[1].x)*t1;
                    v[0].y=v[1].y+(v[2].y-v[1].y)*t1;
                    v[0].z=v[1].z+(v[2].z-v[1].z)*t1;
                    v[2].x=v[1].x+(v[2].x-v[1].x)*t2;
                    v[2].y=v[1].y+(v[2].y-v[1].y)*t2;
                    v[2].z=v[1].z+(v[2].z-v[1].z)*t2;
                    v[1].x=v[0].x;
                    v[1].y=v[0].y;
                    v[1].z=v[0].z;
                    len=depth1+(depth2-depth1)*t1;
                    depth2=depth1+(depth2-depth1)*t2;
                    depth1=len;
                    if(depth1<0) manifold.addPointVec( v[1], n, pd, false );
                    if(depth2<0) manifold.addPointVec( v[2], n, pd, false );
                
                }
            break;
            case 2:
                if(right2){
                    cc2.sub( p2, d2 );
                    n.copy( n2 ).negate();
                }else{
                    cc2.add( p2, d2 );
                    n.copy( n2 );
                }

                dot = _Math.dotVectors( n, n1 );
                if( dot<0 ) len=h1;
                else len=-h1;
                cc1.x = p1.x+len*n1.x;
                cc1.y = p1.y+len*n1.y;
                cc1.z = p1.z+len*n1.z;

                v[0].copy( n );
                if( dot1 >= 0.999999 ){
                    v[0].x=-n.y;
                }

                len = _Math.dotVectors( v[0], n1 );
                d.x = len*n1.x-v[0].x;
                d.y = len*n1.y-v[0].y;
                d.z = len*n1.z-v[0].z;
                len = d.length();
                if( len === 0 ) break;
                len=r1/len;
                d.x*=len;
                d.y*=len;
                d.z*=len;
                v[0].add( cc1, d );

                if(dot<-0.96||dot>0.96){

                    rtt.set(
                        n1.x*n1.x*1.5-0.5,
                        n1.x*n1.y*1.5-n1.z*0.866025403,
                        n1.x*n1.z*1.5+n1.y*0.866025403,
                        n1.y*n1.x*1.5+n1.z*0.866025403,
                        n1.y*n1.y*1.5-0.5,
                        n1.y*n1.z*1.5-n1.x*0.866025403,
                        n1.z*n1.x*1.5-n1.y*0.866025403,
                        n1.z*n1.y*1.5+n1.x*0.866025403,
                        n1.z*n1.z*1.5-0.5
                    )

                    v[3].copy( v[0] );
                    v[5].sub( v[3], cc2 ).scaleVectorEqual( n );

                    pd = v[5].lengthSq();//   )n.x*(v[3].x-cc2.x)+n.y*(v[3].y-cc2.y)+n.z*(v[3].z-cc2.z);
                    v[0].x=v[3].x-pd*n.x-cc2.x;
                    v[0].y=v[3].y-pd*n.y-cc2.y;
                    v[0].z=v[3].z-pd*n.z-cc2.z;
                    len = v[0].lengthSq();//  .x*v[0].x+v[0].y*v[0].y+v[0].z*v[0].z;
                    if(len>r2*r2){
                        len = r2/_Math.sqrt(len);
                        v[0].x*=len;
                        v[0].y*=len;
                        v[0].z*=len;
                    }
                    v[3].add( cc2, v[0] );
                    //v[3].x=cc2.x+v[0].x;
                    //v[3].y=cc2.y+v[0].y;
                    //v[3].z=cc2.z+v[0].z;
                    manifold.addPointVec( v[3], n.negate(), pd, false );

                    d.applyMatrix3( rtt );
                    v[3].add( d, cc1 );
                    v[5].sub( v[3], cc2 ).scaleVectorEqual( n );

                    //v[3].copy(d).applyMatrix3( rtt );

                    //v[3].x=(d.x=v[3].x)+cc1.x;
                    //v[3].y=(d.y=v[3].y)+cc1.y;
                    //v[3].z=(d.z=v[3].z)+cc1.z;
                    pd = v[5].lengthSq();//n.x*(v[3].x-cc2.x)+n.y*(v[3].y-cc2.y)+n.z*(v[3].z-cc2.z);
                    if(pd<=0){
                        v[0].x=v[3].x-pd*n.x-cc2.x;
                        v[0].y=v[3].y-pd*n.y-cc2.y;
                        v[0].z=v[3].z-pd*n.z-cc2.z;
                        len=v[0].x*v[0].x+v[0].y*v[0].y+v[0].z*v[0].z;
                        if(len>r2*r2){
                            len=r2/_Math.sqrt(len);
                            v[0].x*=len;
                            v[0].y*=len;
                            v[0].z*=len;
                        }
                        v[3].add( cc2, v[0] );
                        manifold.addPointVec( v[3], n.negate(), pd, false );
                    }

                    d.applyMatrix3( rtt );
                    v[3].add( d, cc1 );
                    v[6].sub( v[3], cc2 ).scaleVectorEqual( n );

                    //v[3].copy(d).applyMatrix3( rtt );

                    //v[3].x=(d.x=v[3].x)+cc1.x;
                    //v[3].y=(d.y=v[3].y)+cc1.y;
                    //v[3].z=(d.z=v[3].z)+cc1.z;
                    pd = v[6].lengthSq();// n.x*(v[3].x-cc2.x)+n.y*(v[3].y-cc2.y)+n.z*(v[3].z-cc2.z);
                    if(pd<=0){
                        v[0].x=v[3].x - pd*n.x - cc2.x;
                        v[0].y=v[3].y - pd*n.y - cc2.y;
                        v[0].z=v[3].z - pd*n.z - cc2.z;
                        len = v[0].lengthSq();
                        if(len>r2*r2){
                            len = r2/_Math.sqrt(len);
                            v[0].x*=len;
                            v[0].y*=len;
                            v[0].z*=len;
                        }
                        v[3].add( cc2, v[0] );
                        manifold.addPointVec( v[3], n.negate(), pd, false );
                    }
                }else{
                    v[1].copy( v[0] );
                    depth1=n.x*(v[1].x-cc2.x)+n.y*(v[1].y-cc2.y)+n.z*(v[1].z-cc2.z);
                    v[1].x-=depth1*n.x;
                    v[1].y-=depth1*n.y;
                    v[1].z-=depth1*n.z;
                    if(dot>0) v[2].add( v[0], n1 ).scaleEqual( h1*2 );
                    else v[2].sub( v[0], n1 ).scaleEqual( h1*2 );
                    
                    depth2 = n.x*(v[2].x-cc2.x)+n.y*(v[2].y-cc2.y)+n.z*(v[2].z-cc2.z);
                    v[2].x-=depth2*n.x;
                    v[2].y-=depth2*n.y;
                    v[2].z-=depth2*n.z;
                    d.sub( cc2, v[1] );
                    v[0].sub( v[2], v[1] );
                    a = d.lengthSq();
                    b = _Math.dotVectors( d, v[0] );
                    e = v[0].lengthSq();
                    f = b*b - e*(a-r2*r2);
                    if( f < 0 ) break;
                    f = _Math.sqrt( f );
                    t1 = (b+f)/e;
                    t2 = (b-f)/e;
                    if( t2 < t1 ){
                        len = t1;
                        t1 = t2;
                        t2 = len;
                    }
                    if( t2 > 1 ) t2 = 1;
                    if( t1 < 0 ) t1 = 0;

                    v[4].sub( v[2], v[1] );

                    v[0].copy( v[4] ).scaleEqual(t1).addEqual( v[1] );
                    v[2].copy( v[4] ).scaleEqual(t2).addEqual( v[1] );
                    v[1].copy( v[0] );
              
                    len = depth1+(depth2-depth1)*t1;
                    depth2 = depth1+(depth2-depth1)*t2;
                    depth1 = len;
                    if( depth1 < 0 ) manifold.addPointVec( v[1], n.negate(), depth1, false );
                    if( depth2 < 0 ) manifold.addPointVec( v[2], n.negate(), depth2, false );
                
                }
            break;
        }

    }

});

export { CylinderCylinderCollisionDetector };