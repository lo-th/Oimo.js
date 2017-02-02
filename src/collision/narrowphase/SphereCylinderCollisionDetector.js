import { CollisionDetector } from './CollisionDetector';
import { _Math } from '../../math/Math';

function SphereCylinderCollisionDetector ( flip ){
    
    CollisionDetector.call( this );
    this.flip = flip;

};

SphereCylinderCollisionDetector.prototype = Object.assign( Object.create( CollisionDetector.prototype ), {

    constructor: SphereCylinderCollisionDetector,

    detectCollision: function ( shape1, shape2, manifold ) {
        
        var s;
        var c;
        if( this.flip ){
            s = shape2;
            c = shape1;
        }else{
            s = shape1;
            c = shape2;
        }
        var ps = s.position;
        var psx = ps.x;
        var psy = ps.y;
        var psz = ps.z;
        var pc = c.position;
        var pcx = pc.x;
        var pcy = pc.y;
        var pcz = pc.z;
        var dirx = c.normalDirection.x;
        var diry = c.normalDirection.y;
        var dirz = c.normalDirection.z;
        var rads = s.radius;
        var radc = c.radius;
        var rad2 = rads + radc;
        var halfh = c.halfHeight;
        var dx = psx - pcx;
        var dy = psy - pcy;
        var dz = psz - pcz;
        var dot = dx * dirx + dy * diry + dz * dirz;
        if ( dot < -halfh - rads || dot > halfh + rads ) return;
        var cx = pcx + dot * dirx;
        var cy = pcy + dot * diry;
        var cz = pcz + dot * dirz;
        var d2x = psx - cx;
        var d2y = psy - cy;
        var d2z = psz - cz;
        var len = d2x * d2x + d2y * d2y + d2z * d2z;
        if ( len > rad2 * rad2 ) return;
        if ( len > radc * radc ) {
            len = radc / _Math.sqrt( len );
            d2x *= len;
            d2y *= len;
            d2z *= len;
        }
        if( dot < -halfh ) dot = -halfh;
        else if( dot > halfh ) dot = halfh;
        cx = pcx + dot * dirx + d2x;
        cy = pcy + dot * diry + d2y;
        cz = pcz + dot * dirz + d2z;
        dx = cx - psx;
        dy = cy - psy;
        dz = cz - psz;
        len = dx * dx + dy * dy + dz * dz;
        var invLen;
        if ( len > 0 && len < rads * rads ) {
            len = _Math.sqrt(len);
            invLen = 1 / len;
            dx *= invLen;
            dy *= invLen;
            dz *= invLen;
            ///result.addContactInfo(psx+dx*rads,psy+dy*rads,psz+dz*rads,dx,dy,dz,len-rads,s,c,0,0,false);
            manifold.addPoint( psx + dx * rads, psy + dy * rads, psz + dz * rads, dx, dy, dz, len - rads, this.flip );
        }

    }


});

export { SphereCylinderCollisionDetector };