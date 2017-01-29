import { CollisionDetector } from './CollisionDetector';
import { _Math } from '../../math/Math';
import { Vec3 } from '../../math/Vec3';


function CylinderCylinderCollisionDetector() {
    
    CollisionDetector.call( this );

};

CylinderCylinderCollisionDetector.prototype = Object.assign( Object.create( CollisionDetector.prototype ), {

    constructor: CylinderCylinderCollisionDetector,


    getSep: function ( c1, c2, sep, pos, dep ) {

        var t1x;
        var t1y;
        var t1z;
        var t2x;
        var t2y;
        var t2z;
        var sup=new Vec3();
        var len;
        var p1x;
        var p1y;
        var p1z;
        var p2x;
        var p2y;
        var p2z;
        var v01x=c1.position.x;
        var v01y=c1.position.y;
        var v01z=c1.position.z;
        var v02x=c2.position.x;
        var v02y=c2.position.y;
        var v02z=c2.position.z;
        var v0x=v02x-v01x;
        var v0y=v02y-v01y;
        var v0z=v02z-v01z;
        if(v0x*v0x+v0y*v0y+v0z*v0z==0)v0y=0.001;
        var nx=-v0x;
        var ny=-v0y;
        var nz=-v0z;
        this.supportPoint(c1,-nx,-ny,-nz,sup);
        var v11x=sup.x;
        var v11y=sup.y;
        var v11z=sup.z;
        this.supportPoint(c2,nx,ny,nz,sup);
        var v12x=sup.x;
        var v12y=sup.y;
        var v12z=sup.z;
        var v1x=v12x-v11x;
        var v1y=v12y-v11y;
        var v1z=v12z-v11z;
        if(v1x*nx+v1y*ny+v1z*nz<=0){
        return false;
        }
        nx=v1y*v0z-v1z*v0y;
        ny=v1z*v0x-v1x*v0z;
        nz=v1x*v0y-v1y*v0x;
        if(nx*nx+ny*ny+nz*nz==0){
        sep.set( v1x-v0x, v1y-v0y, v1z-v0z ).normalize();
        pos.set( (v11x+v12x)*0.5, (v11y+v12y)*0.5, (v11z+v12z)*0.5 );
        return true;
        }
        this.supportPoint(c1,-nx,-ny,-nz,sup);
        var v21x=sup.x;
        var v21y=sup.y;
        var v21z=sup.z;
        this.supportPoint(c2,nx,ny,nz,sup);
        var v22x=sup.x;
        var v22y=sup.y;
        var v22z=sup.z;
        var v2x=v22x-v21x;
        var v2y=v22y-v21y;
        var v2z=v22z-v21z;
        if(v2x*nx+v2y*ny+v2z*nz<=0){
        return false;
        }
        t1x=v1x-v0x;
        t1y=v1y-v0y;
        t1z=v1z-v0z;
        t2x=v2x-v0x;
        t2y=v2y-v0y;
        t2z=v2z-v0z;
        nx=t1y*t2z-t1z*t2y;
        ny=t1z*t2x-t1x*t2z;
        nz=t1x*t2y-t1y*t2x;
        if(nx*v0x+ny*v0y+nz*v0z>0){
        t1x=v1x;
        t1y=v1y;
        t1z=v1z;
        v1x=v2x;
        v1y=v2y;
        v1z=v2z;
        v2x=t1x;
        v2y=t1y;
        v2z=t1z;
        t1x=v11x;
        t1y=v11y;
        t1z=v11z;
        v11x=v21x;
        v11y=v21y;
        v11z=v21z;
        v21x=t1x;
        v21y=t1y;
        v21z=t1z;
        t1x=v12x;
        t1y=v12y;
        t1z=v12z;
        v12x=v22x;
        v12y=v22y;
        v12z=v22z;
        v22x=t1x;
        v22y=t1y;
        v22z=t1z;
        nx=-nx;
        ny=-ny;
        nz=-nz;
        }
        var iterations=0;
        while(true){
        if(++iterations>100){
        return false;
        }
        this.supportPoint(c1,-nx,-ny,-nz,sup);
        var v31x=sup.x;
        var v31y=sup.y;
        var v31z=sup.z;
        this.supportPoint(c2,nx,ny,nz,sup);
        var v32x=sup.x;
        var v32y=sup.y;
        var v32z=sup.z;
        var v3x=v32x-v31x;
        var v3y=v32y-v31y;
        var v3z=v32z-v31z;
        if(v3x*nx+v3y*ny+v3z*nz<=0){
        return false;
        }
        if((v1y*v3z-v1z*v3y)*v0x+(v1z*v3x-v1x*v3z)*v0y+(v1x*v3y-v1y*v3x)*v0z<0){
        v2x=v3x;
        v2y=v3y;
        v2z=v3z;
        v21x=v31x;
        v21y=v31y;
        v21z=v31z;
        v22x=v32x;
        v22y=v32y;
        v22z=v32z;
        t1x=v1x-v0x;
        t1y=v1y-v0y;
        t1z=v1z-v0z;
        t2x=v3x-v0x;
        t2y=v3y-v0y;
        t2z=v3z-v0z;
        nx=t1y*t2z-t1z*t2y;
        ny=t1z*t2x-t1x*t2z;
        nz=t1x*t2y-t1y*t2x;
        continue;
        }
        if((v3y*v2z-v3z*v2y)*v0x+(v3z*v2x-v3x*v2z)*v0y+(v3x*v2y-v3y*v2x)*v0z<0){
        v1x=v3x;
        v1y=v3y;
        v1z=v3z;
        v11x=v31x;
        v11y=v31y;
        v11z=v31z;
        v12x=v32x;
        v12y=v32y;
        v12z=v32z;
        t1x=v3x-v0x;
        t1y=v3y-v0y;
        t1z=v3z-v0z;
        t2x=v2x-v0x;
        t2y=v2y-v0y;
        t2z=v2z-v0z;
        nx=t1y*t2z-t1z*t2y;
        ny=t1z*t2x-t1x*t2z;
        nz=t1x*t2y-t1y*t2x;
        continue;
        }
        var hit=false;
        while(true){
        t1x=v2x-v1x;
        t1y=v2y-v1y;
        t1z=v2z-v1z;
        t2x=v3x-v1x;
        t2y=v3y-v1y;
        t2z=v3z-v1z;
        nx=t1y*t2z-t1z*t2y;
        ny=t1z*t2x-t1x*t2z;
        nz=t1x*t2y-t1y*t2x;
        len=1/_Math.sqrt(nx*nx+ny*ny+nz*nz);
        nx*=len;
        ny*=len;
        nz*=len;
        if(nx*v1x+ny*v1y+nz*v1z>=0&&!hit){
        var b0=(v1y*v2z-v1z*v2y)*v3x+(v1z*v2x-v1x*v2z)*v3y+(v1x*v2y-v1y*v2x)*v3z;
        var b1=(v3y*v2z-v3z*v2y)*v0x+(v3z*v2x-v3x*v2z)*v0y+(v3x*v2y-v3y*v2x)*v0z;
        var b2=(v0y*v1z-v0z*v1y)*v3x+(v0z*v1x-v0x*v1z)*v3y+(v0x*v1y-v0y*v1x)*v3z;
        var b3=(v2y*v1z-v2z*v1y)*v0x+(v2z*v1x-v2x*v1z)*v0y+(v2x*v1y-v2y*v1x)*v0z;
        var sum=b0+b1+b2+b3;
        if(sum<=0){
        b0=0;
        b1=(v2y*v3z-v2z*v3y)*nx+(v2z*v3x-v2x*v3z)*ny+(v2x*v3y-v2y*v3x)*nz;
        b2=(v3y*v2z-v3z*v2y)*nx+(v3z*v2x-v3x*v2z)*ny+(v3x*v2y-v3y*v2x)*nz;
        b3=(v1y*v2z-v1z*v2y)*nx+(v1z*v2x-v1x*v2z)*ny+(v1x*v2y-v1y*v2x)*nz;
        sum=b1+b2+b3;
        }
        var inv=1/sum;
        p1x=(v01x*b0+v11x*b1+v21x*b2+v31x*b3)*inv;
        p1y=(v01y*b0+v11y*b1+v21y*b2+v31y*b3)*inv;
        p1z=(v01z*b0+v11z*b1+v21z*b2+v31z*b3)*inv;
        p2x=(v02x*b0+v12x*b1+v22x*b2+v32x*b3)*inv;
        p2y=(v02y*b0+v12y*b1+v22y*b2+v32y*b3)*inv;
        p2z=(v02z*b0+v12z*b1+v22z*b2+v32z*b3)*inv;
        hit=true;
        }
        this.supportPoint(c1,-nx,-ny,-nz,sup);
        var v41x=sup.x;
        var v41y=sup.y;
        var v41z=sup.z;
        this.supportPoint(c2,nx,ny,nz,sup);
        var v42x=sup.x;
        var v42y=sup.y;
        var v42z=sup.z;
        var v4x=v42x-v41x;
        var v4y=v42y-v41y;
        var v4z=v42z-v41z;
        var separation=-(v4x*nx+v4y*ny+v4z*nz);
        if((v4x-v3x)*nx+(v4y-v3y)*ny+(v4z-v3z)*nz<=0.01||separation>=0){
        if(hit){
        sep.set( -nx, -ny, -nz );
        pos.set( (p1x+p2x)*0.5, (p1y+p2y)*0.5, (p1z+p2z)*0.5 );
        dep.x=separation;
        return true;
        }
        return false;
        }
        if(
        (v4y*v1z-v4z*v1y)*v0x+
        (v4z*v1x-v4x*v1z)*v0y+
        (v4x*v1y-v4y*v1x)*v0z<0
        ){
        if(
        (v4y*v2z-v4z*v2y)*v0x+
        (v4z*v2x-v4x*v2z)*v0y+
        (v4x*v2y-v4y*v2x)*v0z<0
        ){
        v1x=v4x;
        v1y=v4y;
        v1z=v4z;
        v11x=v41x;
        v11y=v41y;
        v11z=v41z;
        v12x=v42x;
        v12y=v42y;
        v12z=v42z;
        }else{
        v3x=v4x;
        v3y=v4y;
        v3z=v4z;
        v31x=v41x;
        v31y=v41y;
        v31z=v41z;
        v32x=v42x;
        v32y=v42y;
        v32z=v42z;
        }
        }else{
        if(
        (v4y*v3z-v4z*v3y)*v0x+
        (v4z*v3x-v4x*v3z)*v0y+
        (v4x*v3y-v4y*v3x)*v0z<0
        ){
        v2x=v4x;
        v2y=v4y;
        v2z=v4z;
        v21x=v41x;
        v21y=v41y;
        v21z=v41z;
        v22x=v42x;
        v22y=v42y;
        v22z=v42z;
        }else{
        v1x=v4x;
        v1y=v4y;
        v1z=v4z;
        v11x=v41x;
        v11y=v41y;
        v11z=v41z;
        v12x=v42x;
        v12y=v42y;
        v12z=v42z;
        }
        }
        }
        }
        //return false;
    },

    supportPoint: function ( c, dx, dy, dz, out ) {

        var rot=c.rotation.elements;
        var ldx=rot[0]*dx+rot[3]*dy+rot[6]*dz;
        var ldy=rot[1]*dx+rot[4]*dy+rot[7]*dz;
        var ldz=rot[2]*dx+rot[5]*dy+rot[8]*dz;
        var radx=ldx;
        var radz=ldz;
        var len=radx*radx+radz*radz;
        var rad=c.radius;
        var hh=c.halfHeight;
        var ox;
        var oy;
        var oz;
        if(len==0){
        if(ldy<0){
        ox=rad;
        oy=-hh;
        oz=0;
        }else{
        ox=rad;
        oy=hh;
        oz=0;
        }
        }else{
        len=c.radius/_Math.sqrt(len);
        if(ldy<0){
        ox=radx*len;
        oy=-hh;
        oz=radz*len;
        }else{
        ox=radx*len;
        oy=hh;
        oz=radz*len;
        }
        }
        ldx=rot[0]*ox+rot[1]*oy+rot[2]*oz+c.position.x;
        ldy=rot[3]*ox+rot[4]*oy+rot[5]*oz+c.position.y;
        ldz=rot[6]*ox+rot[7]*oy+rot[8]*oz+c.position.z;
        out.set( ldx, ldy, ldz );

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