import { CollisionDetector } from './CollisionDetector';
import { _Math } from '../../math/Math';


/**
 * A collision detector which detects collisions between sphere and box.
 * @author saharan
 */
function SphereBoxCollisionDetector ( flip ) {
    
    CollisionDetector.call( this );
    this.flip = flip;

};

SphereBoxCollisionDetector.prototype = Object.assign( Object.create( CollisionDetector.prototype ), {

    constructor: SphereBoxCollisionDetector,

    detectCollision: function ( shape1, shape2, manifold ) {

        var s;
        var b;
        if(this.flip){
            s=(shape2);
            b=(shape1);
        }else{
            s=(shape1);
            b=(shape2);
        }

        var D = b.dimentions;

        var ps=s.position;
        var psx=ps.x;
        var psy=ps.y;
        var psz=ps.z;
        var pb=b.position;
        var pbx=pb.x;
        var pby=pb.y;
        var pbz=pb.z;
        var rad=s.radius;

        var hw=b.halfWidth;
        var hh=b.halfHeight;
        var hd=b.halfDepth;

        var dx=psx-pbx;
        var dy=psy-pby;
        var dz=psz-pbz;
        var sx=D[0]*dx+D[1]*dy+D[2]*dz;
        var sy=D[3]*dx+D[4]*dy+D[5]*dz;
        var sz=D[6]*dx+D[7]*dy+D[8]*dz;
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
            // center of sphere is in the box
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
                    dx=D[0];
                    dy=D[1];
                    dz=D[2];
                }else{
                    sx=hw;
                    dx=-D[0];
                    dy=-D[1];
                    dz=-D[2];
                }
            }else{
                len=dz-hd;
                if(sz<0){
                    sz=-hd;
                    dx=D[6];
                    dy=D[7];
                    dz=D[8];
                }else{
                    sz=hd;
                    dx=-D[6];
                    dy=-D[7];
                    dz=-D[8];
                }
            }
            }else{
                if(dy<dz){
                    len=dy-hh;
                    if(sy<0){
                        sy=-hh;
                        dx=D[3];
                        dy=D[4];
                        dz=D[5];
                    }else{
                        sy=hh;
                        dx=-D[3];
                        dy=-D[4];
                        dz=-D[5];
                    }
                }else{
                    len=dz-hd;
                    if(sz<0){
                        sz=-hd;
                        dx=D[6];
                        dy=D[7];
                        dz=D[8];
                    }else{
                        sz=hd;
                        dx=-D[6];
                        dy=-D[7];
                        dz=-D[8];
                }
            }
        }
        cx=pbx+sx*D[0]+sy*D[3]+sz*D[6];
        cy=pby+sx*D[1]+sy*D[4]+sz*D[7];
        cz=pbz+sx*D[2]+sy*D[5]+sz*D[8];
        manifold.addPoint(psx+rad*dx,psy+rad*dy,psz+rad*dz,dx,dy,dz,len-rad,this.flip);
        }else{
            cx=pbx+sx*D[0]+sy*D[3]+sz*D[6];
            cy=pby+sx*D[1]+sy*D[4]+sz*D[7];
            cz=pbz+sx*D[2]+sy*D[5]+sz*D[8];
            dx=cx-ps.x;
            dy=cy-ps.y;
            dz=cz-ps.z;
            len=dx*dx+dy*dy+dz*dz;
            if(len>0&&len<rad*rad){
                len=_Math.sqrt(len);
                invLen=1/len;
                dx*=invLen;
                dy*=invLen;
                dz*=invLen;
                manifold.addPoint(psx+rad*dx,psy+rad*dy,psz+rad*dz,dx,dy,dz,len-rad,this.flip);
            }
        }

    }

});

export { SphereBoxCollisionDetector };