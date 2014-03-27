OIMO.SphereBoxCollisionDetector = function(flip){
    OIMO.CollisionDetector.call( this );
    this.flip=flip;
}
OIMO.SphereBoxCollisionDetector.prototype = Object.create( OIMO.CollisionDetector.prototype );
OIMO.SphereBoxCollisionDetector.prototype.detectCollision = function(shape1,shape2,manifold){
    var s;
    var b;
    if(this.flip){
        s=(shape2);
        b=(shape1);
    }else{
        s=(shape1);
        b=(shape2);
    }
    var ps=s.position;
    var psx=ps.x;
    var psy=ps.y;
    var psz=ps.z;
    var pb=b.position;
    var pbx=pb.x;
    var pby=pb.y;
    var pbz=pb.z;
    var rad=s.radius;
    var nw=b.normalDirectionWidth;
    var nh=b.normalDirectionHeight;
    var nd=b.normalDirectionDepth;
    var hw=b.halfWidth;
    var hh=b.halfHeight;
    var hd=b.halfDepth;
    var dx=psx-pbx;
    var dy=psy-pby;
    var dz=psz-pbz;
    var sx=nw.x*dx+nw.y*dy+nw.z*dz;
    var sy=nh.x*dx+nh.y*dy+nh.z*dz;
    var sz=nd.x*dx+nd.y*dy+nd.z*dz;
    var cx;
    var cy;
    var cz;
    var len;
    var invLen;
    var overlap=0;
    if(sx>hw){
        sx=hw;
    }else if(sx<-hw){
        sx=-hw;
    }else{
        overlap=1;
    }
    if(sy>hh){
        sy=hh;
    }else if(sy<-hh){
        sy=-hh;
    }else{
        overlap|=2;
    }
    if(sz>hd){
        sz=hd;
    }else if(sz<-hd){
        sz=-hd;
    }else{
        overlap|=4;
    }
    if(overlap==7){
        if(sx<0){
            dx=hw+sx;
        }else{
            dx=hw-sx;
        }
        if(sy<0){
            dy=hh+sy;
        }else{
            dy=hh-sy;
        }
        if(sz<0){
            dz=hd+sz;
        }else{
            dz=hd-sz;
        }
        if(dx<dy){
            if(dx<dz){
                len=dx-hw;
            if(sx<0){
                sx=-hw;
                dx=nw.x;
                dy=nw.y;
                dz=nw.z;
            }else{
                sx=hw;
                dx=-nw.x;
                dy=-nw.y;
                dz=-nw.z;
            }
        }else{
            len=dz-hd;
            if(sz<0){
                sz=-hd;
                dx=nd.x;
                dy=nd.y;
                dz=nd.z;
            }else{
                sz=hd;
                dx=-nd.x;
                dy=-nd.y;
                dz=-nd.z;
            }
        }
        }else{
            if(dy<dz){
                len=dy-hh;
                if(sy<0){
                    sy=-hh;
                    dx=nh.x;
                    dy=nh.y;
                    dz=nh.z;
                }else{
                    sy=hh;
                    dx=-nh.x;
                    dy=-nh.y;
                    dz=-nh.z;
                }
            }else{
                len=dz-hd;
                if(sz<0){
                    sz=-hd;
                    dx=nd.x;
                    dy=nd.y;
                    dz=nd.z;
                }else{
                    sz=hd;
                    dx=-nd.x;
                    dy=-nd.y;
                    dz=-nd.z;
            }
        }
    }
    cx=pbx+sx*nw.x+sy*nh.x+sz*nd.x;
    cy=pby+sx*nw.y+sy*nh.y+sz*nd.y;
    cz=pbz+sx*nw.z+sy*nh.z+sz*nd.z;
    manifold.addPoint(psx+rad*dx,psy+rad*dy,psz+rad*dz,dx,dy,dz,len-rad,this.flip);
    }else{
        cx=pbx+sx*nw.x+sy*nh.x+sz*nd.x;
        cy=pby+sx*nw.y+sy*nh.y+sz*nd.y;
        cz=pbz+sx*nw.z+sy*nh.z+sz*nd.z;
        dx=cx-ps.x;
        dy=cy-ps.y;
        dz=cz-ps.z;
        len=dx*dx+dy*dy+dz*dz;
        if(len>0&&len<rad*rad){
            len=Math.sqrt(len);
            invLen=1/len;
            dx*=invLen;
            dy*=invLen;
            dz*=invLen;
            manifold.addPoint(psx+rad*dx,psy+rad*dy,psz+rad*dz,dx,dy,dz,len-rad,this.flip);
        }
    }

}