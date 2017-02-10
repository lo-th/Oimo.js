import { _Math } from './Math';
import { Vec3 } from './Vec3';

function Quat ( x, y, z, w ){

    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.w = ( w !== undefined ) ? w : 1;

}

Object.assign( Quat.prototype, {

    Quat: true,

    set: function ( x, y, z, w ) {

        
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;

        return this;

    },

    addTime: function( v, t ){

        var ax = v.x, ay = v.y, az = v.z;
        var qw = this.w, qx = this.x, qy = this.y, qz = this.z;
        t *= 0.5;    
        this.x += t * (  ax*qw + ay*qz - az*qy );
        this.y += t * (  ay*qw + az*qx - ax*qz );
        this.z += t * (  az*qw + ax*qy - ay*qx );
        this.w += t * ( -ax*qx - ay*qy - az*qz );
        this.normalize();
        return this;

    },

    /*mul: function( q1, q2 ){

        var ax = q1.x, ay = q1.y, az = q1.z, as = q1.w,
        bx = q2.x, by = q2.y, bz = q2.z, bs = q2.w;
        this.x = ax * bs + as * bx + ay * bz - az * by;
        this.y = ay * bs + as * by + az * bx - ax * bz;
        this.z = az * bs + as * bz + ax * by - ay * bx;
        this.w = as * bs - ax * bx - ay * by - az * bz;
        return this;

    },*/

    multiply: function ( q, p ) {

        if ( p !== undefined ) return this.multiplyQuaternions( q, p );
        return this.multiplyQuaternions( this, q );

    },

    multiplyQuaternions: function ( a, b ) {

        var qax = a.x, qay = a.y, qaz = a.z, qaw = a.w;
        var qbx = b.x, qby = b.y, qbz = b.z, qbw = b.w;

        this.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
        this.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
        this.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
        this.w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;
        return this;

    },

    setFromUnitVectors: function( v1, v2 ) {

        var vx = new Vec3();
        var r = v1.dot( v2 ) + 1;

        if ( r < _Math.EPS2 ) {

            r = 0;
            if ( _Math.abs( v1.x ) > _Math.abs( v1.z ) ) vx.set( - v1.y, v1.x, 0 );
            else vx.set( 0, - v1.z, v1.y );

        } else {

            vx.crossVectors( v1, v2 );

        }

        this._x = vx.x;
        this._y = vx.y;
        this._z = vx.z;
        this._w = r;

        return this.normalize();

    },

    arc: function( v1, v2 ){

        var x1 = v1.x;
        var y1 = v1.y;
        var z1 = v1.z;
        var x2 = v2.x;
        var y2 = v2.y;
        var z2 = v2.z;
        var d = x1*x2 + y1*y2 + z1*z2;
        if( d==-1 ){
            x2 = y1*x1 - z1*z1;
            y2 = -z1*y1 - x1*x1;
            z2 = x1*z1 + y1*y1;
            d = 1 / _Math.sqrt( x2*x2 + y2*y2 + z2*z2 );
            this.w = 0;
            this.x = x2*d;
            this.y = y2*d;
            this.z = z2*d;
            return this;
        }
        var cx = y1*z2 - z1*y2;
        var cy = z1*x2 - x1*z2;
        var cz = x1*y2 - y1*x2;
        this.w = _Math.sqrt( ( 1 + d) * 0.5 );
        d = 0.5 / this.w;
        this.x = cx * d;
        this.y = cy * d;
        this.z = cz * d;
        return this;

    },

    normalize: function(){

        var l = this.length();
        if ( l === 0 ) {
            this.set( 0, 0, 0, 1 );
        } else {
            l = 1 / l;
            this.x = this.x * l;
            this.y = this.y * l;
            this.z = this.z * l;
            this.w = this.w * l;
        }
        return this;

    },

    inverse: function () {

        return this.conjugate().normalize();

    },

    invert: function ( q ) {

        this.x = q.x;
        this.y = q.y;
        this.z = q.z;
        this.w = q.w;
        this.conjugate().normalize();
        return this;

    },

    conjugate: function () {

        this.x *= - 1;
        this.y *= - 1;
        this.z *= - 1;
        return this;

    },

    length: function(){

        return _Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w  );

    },

    lengthSq: function () {

        return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;

    },
    
    copy: function( q ){
        
        this.x = q.x;
        this.y = q.y;
        this.z = q.z;
        this.w = q.w;
        return this;

    },

    clone: function( q ){

        return new Quat( this.x, this.y, this.z, this.w );

    },

    testDiff: function ( q ) {

        return this.equals( q ) ? false : true;

    },

    equals: function ( q ) {

        return this.x === q.x && this.y === q.y && this.z === q.z && this.w === q.w;

    },

    toString: function(){

        return"Quat["+this.x.toFixed(4)+", ("+this.y.toFixed(4)+", "+this.z.toFixed(4)+", "+this.w.toFixed(4)+")]";
        
    },

    setFromEuler: function ( x, y, z ){

        var c1 = Math.cos( x * 0.5 );
        var c2 = Math.cos( y * 0.5 );
        var c3 = Math.cos( z * 0.5 );
        var s1 = Math.sin( x * 0.5 );
        var s2 = Math.sin( y * 0.5 );
        var s3 = Math.sin( z * 0.5 );

        // XYZ
        this.x = s1 * c2 * c3 + c1 * s2 * s3;
        this.y = c1 * s2 * c3 - s1 * c2 * s3;
        this.z = c1 * c2 * s3 + s1 * s2 * c3;
        this.w = c1 * c2 * c3 - s1 * s2 * s3;

        return this;

    },
    
    setFromAxis: function ( axis, rad ) {

        axis.normalize();
        rad = rad * 0.5;
        var s = _Math.sin( rad );
        this.x = s * axis.x;
        this.y = s * axis.y;
        this.z = s * axis.z;
        this.w = _Math.cos( rad );
        return this;

    },

    setFromMat33: function ( m ) {

        var trace = m[0] + m[4] + m[8];
        var s;

        if ( trace > 0 ) {

            s = _Math.sqrt( trace + 1.0 );
            this.w = 0.5 / s;
            s = 0.5 / s;
            this.x = ( m[5] - m[7] ) * s;
            this.y = ( m[6] - m[2] ) * s;
            this.z = ( m[1] - m[3] ) * s;

        } else {

            var out = [];
            var i = 0;
            if ( m[4] > m[0] ) i = 1;
            if ( m[8] > m[i*3+i] ) i = 2;

            var j = (i+1)%3;
            var k = (i+2)%3;
            
            s = _Math.sqrt( m[i*3+i] - m[j*3+j] - m[k*3+k] + 1.0 );
            out[i] = 0.5 * fRoot;
            s = 0.5 / fRoot;
            this.w = ( m[j*3+k] - m[k*3+j] ) * s;
            out[j] = ( m[j*3+i] + m[i*3+j] ) * s;
            out[k] = ( m[k*3+i] + m[i*3+k] ) * s;

            this.x = out[1];
            this.y = out[2];
            this.z = out[3];

        }

        return this;

    },

    toArray: function ( array, offset ) {

        offset = offset || 0;

        array[ offset ] = this.x;
        array[ offset + 1 ] = this.y;
        array[ offset + 2 ] = this.z;
        array[ offset + 3 ] = this.w;

    },

    fromArray: function( array, offset ){

        offset = offset || 0;
        this.set( array[ offset ], array[ offset + 1 ], array[ offset + 2 ], array[ offset + 3 ] );
        return this;

    }

});

export { Quat };