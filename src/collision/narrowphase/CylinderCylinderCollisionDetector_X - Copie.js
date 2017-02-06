import { CollisionDetector } from './CollisionDetector';
import { _Math } from '../../math/Math';
import { Vec3 } from '../../math/Vec3';


function CylinderCylinderCollisionDetector() {
    
    CollisionDetector.call( this );

    this.n = new Vec3();
    this.p = new Vec3();
    this.d = new Vec3();
    this.p1 = new Vec3();
    this.p2 = new Vec3();

    this.tmp0 = new Vec3();
    this.tmp1 = new Vec3();
    this.tmp2 = new Vec3();
    this.tmp3 = new Vec3();

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


    getSep: function ( c1, c2, sep, pos, dep ) {

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

        p1.copy( c1.position );
        p2.copy( c2.position );

        // diff
        d.sub( p2, p1 );

        var len;

        if( d.lengthSq() === 0 ) d.y = 0.001;
        n.copy( d ).negate();
        
        this.supportPoint( c1, n, tmp1, true );
        this.supportPoint( c2, n, tmp2 );
        tmp0.sub( tmp2, tmp1 );

        if( _Math.dotVectors( tmp0, n ) <= 0 ) return false;

        n.cross( tmp0, d );

        if( n.lengthSq() == 0 ){
            sep.sub( tmp0, d ).normalize();
            pos.add( tmp1, tmp2 ).scaleEqual( 0.5 );
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

            if( ++iterations > 100 ) return false;
            
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
                        sep.copy( n ).negate();
                        pos.add( v[2], v[3] ).scaleEqual( 0.5 );
                        dep.x = separation;
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
        var p1=c1.position;
        var p2=c2.position;
        var p1x=p1.x;
        var p1y=p1.y;
        var p1z=p1.z;
        var p2x=p2.x;
        var p2y=p2.y;
        var p2z=p2.z;
        var h1=c1.halfHeight;
        var h2=c2.halfHeight;
        var n1=c1.normalDirection;
        var n2=c2.normalDirection;
        var d1=c1.halfDirection;
        var d2=c2.halfDirection;
        var r1=c1.radius;
        var r2=c2.radius;
        var n1x=n1.x;
        var n1y=n1.y;
        var n1z=n1.z;
        var n2x=n2.x;
        var n2y=n2.y;
        var n2z=n2.z;
        var d1x=d1.x;
        var d1y=d1.y;
        var d1z=d1.z;
        var d2x=d2.x;
        var d2y=d2.y;
        var d2z=d2.z;
        var dx=p1x-p2x;
        var dy=p1y-p2y;
        var dz=p1z-p2z;
        var len;
        var c1x;
        var c1y;
        var c1z;
        var c2x;
        var c2y;
        var c2z;
        var tx;
        var ty;
        var tz;
        var sx;
        var sy;
        var sz;
        var ex;
        var ey;
        var ez;
        var depth1;
        var depth2;
        var dot;
        var t1;
        var t2;
        var sep=new Vec3();
        var pos=new Vec3();
        var dep=new Vec3();
        if(!this.getSep(c1,c2,sep,pos,dep))return;
        var dot1=sep.x*n1x+sep.y*n1y+sep.z*n1z;
        var dot2=sep.x*n2x+sep.y*n2y+sep.z*n2z;
        var right1=dot1>0;
        var right2=dot2>0;
        if(!right1)dot1=-dot1;
        if(!right2)dot2=-dot2;
        var state=0;
        if(dot1>0.999||dot2>0.999){
        if(dot1>dot2)state=1;
        else state=2;
        }
        var nx;
        var ny;
        var nz;
        var depth=dep.x;
        var r00;
        var r01;
        var r02;
        var r10;
        var r11;
        var r12;
        var r20;
        var r21;
        var r22;
        var px;
        var py;
        var pz;
        var pd;
        var a;
        var b;
        var e;
        var f;
        nx=sep.x;
        ny=sep.y;
        nz=sep.z;
        switch(state){
        case 0:
        manifold.addPoint(pos.x,pos.y,pos.z,nx,ny,nz,depth,false);
        break;
        case 1:
        if(right1){
        c1x=p1x+d1x;
        c1y=p1y+d1y;
        c1z=p1z+d1z;
        nx=n1x;
        ny=n1y;
        nz=n1z;
        }else{
        c1x=p1x-d1x;
        c1y=p1y-d1y;
        c1z=p1z-d1z;
        nx=-n1x;
        ny=-n1y;
        nz=-n1z;
        }
        dot=nx*n2x+ny*n2y+nz*n2z;
        if(dot<0)len=h2;
        else len=-h2;
        c2x=p2x+len*n2x;
        c2y=p2y+len*n2y;
        c2z=p2z+len*n2z;
        if(dot2>=0.999999){
        tx=-ny;
        ty=nz;
        tz=nx;
        }else{
        tx=nx;
        ty=ny;
        tz=nz;
        }
        len=tx*n2x+ty*n2y+tz*n2z;
        dx=len*n2x-tx;
        dy=len*n2y-ty;
        dz=len*n2z-tz;
        len=_Math.sqrt(dx*dx+dy*dy+dz*dz);
        if(len==0)break;
        len=r2/len;
        dx*=len;
        dy*=len;
        dz*=len;
        tx=c2x+dx;
        ty=c2y+dy;
        tz=c2z+dz;
        if(dot<-0.96||dot>0.96){
        r00=n2x*n2x*1.5-0.5;
        r01=n2x*n2y*1.5-n2z*0.866025403;
        r02=n2x*n2z*1.5+n2y*0.866025403;
        r10=n2y*n2x*1.5+n2z*0.866025403;
        r11=n2y*n2y*1.5-0.5;
        r12=n2y*n2z*1.5-n2x*0.866025403;
        r20=n2z*n2x*1.5-n2y*0.866025403;
        r21=n2z*n2y*1.5+n2x*0.866025403;
        r22=n2z*n2z*1.5-0.5;
        px=tx;
        py=ty;
        pz=tz;
        pd=nx*(px-c1x)+ny*(py-c1y)+nz*(pz-c1z);
        tx=px-pd*nx-c1x;
        ty=py-pd*ny-c1y;
        tz=pz-pd*nz-c1z;
        len=tx*tx+ty*ty+tz*tz;
        if(len>r1*r1){
        len=r1/_Math.sqrt(len);
        tx*=len;
        ty*=len;
        tz*=len;
        }
        px=c1x+tx;
        py=c1y+ty;
        pz=c1z+tz;
        manifold.addPoint(px,py,pz,nx,ny,nz,pd,false);
        px=dx*r00+dy*r01+dz*r02;
        py=dx*r10+dy*r11+dz*r12;
        pz=dx*r20+dy*r21+dz*r22;
        px=(dx=px)+c2x;
        py=(dy=py)+c2y;
        pz=(dz=pz)+c2z;
        pd=nx*(px-c1x)+ny*(py-c1y)+nz*(pz-c1z);
        if(pd<=0){
        tx=px-pd*nx-c1x;
        ty=py-pd*ny-c1y;
        tz=pz-pd*nz-c1z;
        len=tx*tx+ty*ty+tz*tz;
        if(len>r1*r1){
        len=r1/_Math.sqrt(len);
        tx*=len;
        ty*=len;
        tz*=len;
        }
        px=c1x+tx;
        py=c1y+ty;
        pz=c1z+tz;
        manifold.addPoint(px,py,pz,nx,ny,nz,pd,false);
        }
        px=dx*r00+dy*r01+dz*r02;
        py=dx*r10+dy*r11+dz*r12;
        pz=dx*r20+dy*r21+dz*r22;
        px=(dx=px)+c2x;
        py=(dy=py)+c2y;
        pz=(dz=pz)+c2z;
        pd=nx*(px-c1x)+ny*(py-c1y)+nz*(pz-c1z);
        if(pd<=0){
        tx=px-pd*nx-c1x;
        ty=py-pd*ny-c1y;
        tz=pz-pd*nz-c1z;
        len=tx*tx+ty*ty+tz*tz;
        if(len>r1*r1){
        len=r1/_Math.sqrt(len);
        tx*=len;
        ty*=len;
        tz*=len;
        }
        px=c1x+tx;
        py=c1y+ty;
        pz=c1z+tz;
        manifold.addPoint(px,py,pz,nx,ny,nz,pd,false);
        }
        }else{
        sx=tx;
        sy=ty;
        sz=tz;
        depth1=nx*(sx-c1x)+ny*(sy-c1y)+nz*(sz-c1z);
        sx-=depth1*nx;
        sy-=depth1*ny;
        sz-=depth1*nz;
        if(dot>0){
        ex=tx+n2x*h2*2;
        ey=ty+n2y*h2*2;
        ez=tz+n2z*h2*2;
        }else{
        ex=tx-n2x*h2*2;
        ey=ty-n2y*h2*2;
        ez=tz-n2z*h2*2;
        }
        depth2=nx*(ex-c1x)+ny*(ey-c1y)+nz*(ez-c1z);
        ex-=depth2*nx;
        ey-=depth2*ny;
        ez-=depth2*nz;
        dx=c1x-sx;
        dy=c1y-sy;
        dz=c1z-sz;
        tx=ex-sx;
        ty=ey-sy;
        tz=ez-sz;
        a=dx*dx+dy*dy+dz*dz;
        b=dx*tx+dy*ty+dz*tz;
        e=tx*tx+ty*ty+tz*tz;
        f=b*b-e*(a-r1*r1);
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
        tx=sx+(ex-sx)*t1;
        ty=sy+(ey-sy)*t1;
        tz=sz+(ez-sz)*t1;
        ex=sx+(ex-sx)*t2;
        ey=sy+(ey-sy)*t2;
        ez=sz+(ez-sz)*t2;
        sx=tx;
        sy=ty;
        sz=tz;
        len=depth1+(depth2-depth1)*t1;
        depth2=depth1+(depth2-depth1)*t2;
        depth1=len;
        if(depth1<0) manifold.addPoint(sx,sy,sz,nx,ny,nz,pd,false);
        if(depth2<0) manifold.addPoint(ex,ey,ez,nx,ny,nz,pd,false);
        
        }
        break;
        case 2:
        if(right2){
        c2x=p2x-d2x;
        c2y=p2y-d2y;
        c2z=p2z-d2z;
        nx=-n2x;
        ny=-n2y;
        nz=-n2z;
        }else{
        c2x=p2x+d2x;
        c2y=p2y+d2y;
        c2z=p2z+d2z;
        nx=n2x;
        ny=n2y;
        nz=n2z;
        }
        dot=nx*n1x+ny*n1y+nz*n1z;
        if(dot<0)len=h1;
        else len=-h1;
        c1x=p1x+len*n1x;
        c1y=p1y+len*n1y;
        c1z=p1z+len*n1z;
        if(dot1>=0.999999){
        tx=-ny;
        ty=nz;
        tz=nx;
        }else{
        tx=nx;
        ty=ny;
        tz=nz;
        }
        len=tx*n1x+ty*n1y+tz*n1z;
        dx=len*n1x-tx;
        dy=len*n1y-ty;
        dz=len*n1z-tz;
        len=_Math.sqrt(dx*dx+dy*dy+dz*dz);
        if(len==0)break;
        len=r1/len;
        dx*=len;
        dy*=len;
        dz*=len;
        tx=c1x+dx;
        ty=c1y+dy;
        tz=c1z+dz;
        if(dot<-0.96||dot>0.96){
        r00=n1x*n1x*1.5-0.5;
        r01=n1x*n1y*1.5-n1z*0.866025403;
        r02=n1x*n1z*1.5+n1y*0.866025403;
        r10=n1y*n1x*1.5+n1z*0.866025403;
        r11=n1y*n1y*1.5-0.5;
        r12=n1y*n1z*1.5-n1x*0.866025403;
        r20=n1z*n1x*1.5-n1y*0.866025403;
        r21=n1z*n1y*1.5+n1x*0.866025403;
        r22=n1z*n1z*1.5-0.5;
        px=tx;
        py=ty;
        pz=tz;
        pd=nx*(px-c2x)+ny*(py-c2y)+nz*(pz-c2z);
        tx=px-pd*nx-c2x;
        ty=py-pd*ny-c2y;
        tz=pz-pd*nz-c2z;
        len=tx*tx+ty*ty+tz*tz;
        if(len>r2*r2){
        len=r2/_Math.sqrt(len);
        tx*=len;
        ty*=len;
        tz*=len;
        }
        px=c2x+tx;
        py=c2y+ty;
        pz=c2z+tz;
        manifold.addPoint(px,py,pz,-nx,-ny,-nz,pd,false);
        px=dx*r00+dy*r01+dz*r02;
        py=dx*r10+dy*r11+dz*r12;
        pz=dx*r20+dy*r21+dz*r22;
        px=(dx=px)+c1x;
        py=(dy=py)+c1y;
        pz=(dz=pz)+c1z;
        pd=nx*(px-c2x)+ny*(py-c2y)+nz*(pz-c2z);
        if(pd<=0){
        tx=px-pd*nx-c2x;
        ty=py-pd*ny-c2y;
        tz=pz-pd*nz-c2z;
        len=tx*tx+ty*ty+tz*tz;
        if(len>r2*r2){
        len=r2/_Math.sqrt(len);
        tx*=len;
        ty*=len;
        tz*=len;
        }
        px=c2x+tx;
        py=c2y+ty;
        pz=c2z+tz;
        manifold.addPoint(px,py,pz,-nx,-ny,-nz,pd,false);
        }
        px=dx*r00+dy*r01+dz*r02;
        py=dx*r10+dy*r11+dz*r12;
        pz=dx*r20+dy*r21+dz*r22;
        px=(dx=px)+c1x;
        py=(dy=py)+c1y;
        pz=(dz=pz)+c1z;
        pd=nx*(px-c2x)+ny*(py-c2y)+nz*(pz-c2z);
        if(pd<=0){
        tx=px-pd*nx-c2x;
        ty=py-pd*ny-c2y;
        tz=pz-pd*nz-c2z;
        len=tx*tx+ty*ty+tz*tz;
        if(len>r2*r2){
        len=r2/_Math.sqrt(len);
        tx*=len;
        ty*=len;
        tz*=len;
        }
        px=c2x+tx;
        py=c2y+ty;
        pz=c2z+tz;
        manifold.addPoint(px,py,pz,-nx,-ny,-nz,pd,false);
        }
        }else{
        sx=tx;
        sy=ty;
        sz=tz;
        depth1=nx*(sx-c2x)+ny*(sy-c2y)+nz*(sz-c2z);
        sx-=depth1*nx;
        sy-=depth1*ny;
        sz-=depth1*nz;
        if(dot>0){
        ex=tx+n1x*h1*2;
        ey=ty+n1y*h1*2;
        ez=tz+n1z*h1*2;
        }else{
        ex=tx-n1x*h1*2;
        ey=ty-n1y*h1*2;
        ez=tz-n1z*h1*2;
        }
        depth2=nx*(ex-c2x)+ny*(ey-c2y)+nz*(ez-c2z);
        ex-=depth2*nx;
        ey-=depth2*ny;
        ez-=depth2*nz;
        dx=c2x-sx;
        dy=c2y-sy;
        dz=c2z-sz;
        tx=ex-sx;
        ty=ey-sy;
        tz=ez-sz;
        a=dx*dx+dy*dy+dz*dz;
        b=dx*tx+dy*ty+dz*tz;
        e=tx*tx+ty*ty+tz*tz;
        f=b*b-e*(a-r2*r2);
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
        tx=sx+(ex-sx)*t1;
        ty=sy+(ey-sy)*t1;
        tz=sz+(ez-sz)*t1;
        ex=sx+(ex-sx)*t2;
        ey=sy+(ey-sy)*t2;
        ez=sz+(ez-sz)*t2;
        sx=tx;
        sy=ty;
        sz=tz;
        len=depth1+(depth2-depth1)*t1;
        depth2=depth1+(depth2-depth1)*t2;
        depth1=len;
        if(depth1<0){
        manifold.addPoint(sx,sy,sz,-nx,-ny,-nz,depth1,false);
        }
        if(depth2<0){
        manifold.addPoint(ex,ey,ez,-nx,-ny,-nz,depth2,false);
        }
        }
        break;
        }

    }

});

export { CylinderCylinderCollisionDetector };