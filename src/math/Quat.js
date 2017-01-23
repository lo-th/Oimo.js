import { _Math } from './Math';

function Quat ( x, y, z, w ){

    this.x=x || 0;
    this.y=y || 0;
    this.z=z || 0;
    this.w=( w !== undefined ) ? w : 1;

};

Quat.prototype = {

    constructor: Quat,

    set: function ( x, y, z, w ) {

        
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;

        return this;

    },

    init: function( w, x, y, z ){
        this.w=( w !== undefined ) ? w : 1;
        this.x=x || 0;
        this.y=y || 0;
        this.z=z || 0;
        return this;
    },
    add: function(q1,q2){
        this.w=q1.w+q2.w;
        this.x=q1.x+q2.x;
        this.y=q1.y+q2.y;
        this.z=q1.z+q2.z;
        return this;
    },
    addTime: function(v,t){
        var x = v.x;
        var y = v.y;
        var z = v.z;
        var qw=this.w;
        var qx=this.x;
        var qy=this.y;
        var qz=this.z;
        t*=0.5;
        var ns=(-x*qx - y*qy - z*qz)*t;
        var nx=( x*qw + y*qz - z*qy)*t;
        var ny=(-x*qz + y*qw + z*qx)*t;
        var nz=( x*qy - y*qx + z*qw)*t;
        qw += ns;
        qx += nx;
        qy += ny;
        qz += nz;
        var s= 1 / _Math.sqrt( qw*qw+qx*qx+qy*qy+qz*qz );
        this.w=qw*s;
        this.x=qx*s;
        this.y=qy*s;
        this.z=qz*s;
        return this;
    },
    sub: function(q1,q2){
        this.w=q1.w-q2.w;
        this.x=q1.x-q2.x;
        this.y=q1.y-q2.y;
        this.z=q1.z-q2.z;
        return this;
    },
    scale: function(q,s){
        this.w=q.w*s;
        this.x=q.x*s;
        this.y=q.y*s;
        this.z=q.z*s;
        return this;
    },
    mul: function( q1, q2 ){
        var ax = q1.x, ay = q1.y, az = q1.z, as = q1.w,
        bx = q2.x, by = q2.y, bz = q2.z, bs = q2.w;
        this.x = ax * bs + as * bx + ay * bz - az * by;
        this.y = ay * bs + as * by + az * bx - ax * bz;
        this.z = az * bs + as * bz + ax * by - ay * bx;
        this.w = as * bs - ax * bx - ay * by - az * bz;
        return this;
    },
    arc: function(v1,v2){
        var x1=v1.x;
        var y1=v1.y;
        var z1=v1.z;
        var x2=v2.x;
        var y2=v2.y;
        var z2=v2.z;
        var d=x1*x2+y1*y2+z1*z2;
        if(d==-1){
        x2=y1*x1-z1*z1;
        y2=-z1*y1-x1*x1;
        z2=x1*z1+y1*y1;
        d=1/_Math.sqrt(x2*x2+y2*y2+z2*z2);
        this.w=0;
        this.x=x2*d;
        this.y=y2*d;
        this.z=z2*d;
        return this;
        }
        var cx=y1*z2-z1*y2;
        var cy=z1*x2-x1*z2;
        var cz=x1*y2-y1*x2;
        this.w=_Math.sqrt((1+d)*0.5);
        d=0.5/this.w;
        this.x=cx*d;
        this.y=cy*d;
        this.z=cz*d;
        return this;
    },
    normalize: function(q){
        var len=_Math.sqrt(q.w*q.w+q.x*q.x+q.y*q.y+q.z*q.z);
        if(len>0){len=1/len;}
        this.w=q.w*len;
        this.x=q.x*len;
        this.y=q.y*len;
        this.z=q.z*len;
        return this;
    },
    invert: function(q){
        this.w=q.w;
        this.x=-q.x;
        this.y=-q.y;
        this.z=-q.z;
        return this;
    },
    length: function(){
        return _Math.sqrt(this.w*this.w+this.x*this.x+this.y*this.y+this.z*this.z);
    },
    
    copy: function(q){
        this.w=q.w;
        this.x=q.x;
        this.y=q.y;
        this.z=q.z;
        return this;
    },
    testDiff: function(q){
        if( this.w!==q.w || this.x!==q.x || this.y!==q.y || this.z!==q.z ) return true;
        else return false;
    },
    clone: function(q){
        return new Quat( this.x, this.y, this.z, this.w );
    },
    toString: function(){
        return"Quat["+this.x.toFixed(4)+", ("+this.y.toFixed(4)+", "+this.z.toFixed(4)+", "+this.w.toFixed(4)+")]";
    },

    setFromAxis: function ( rad, ax, ay, az ) {

        var len = ax*ax+ay*ay+az*az; 
        if(len>0){
            len=1/_Math.sqrt(len);
            ax*=len;
            ay*=len;
            az*=len;
        }
        var sin = _Math.sin( rad*0.5 );
        this.x = sin*ax;
        this.y = sin*ay;
        this.z = sin*az;
        this.w = _Math.cos( rad*0.5 );

        return this;

    },

    setFromRotationMatrix: function ( m ) {

        // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm

        // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

        var te = m.elements,

            m11 = te[ 0 ], m12 = te[ 1 ], m13 = te[ 2 ],
            m21 = te[ 3 ], m22 = te[ 4 ], m23 = te[ 5 ],
            m31 = te[ 6 ], m32 = te[ 7 ], m33 = te[ 8 ],

            trace = m11 + m22 + m33,
            s;

        if ( trace > 0 ) {

            s = 0.5 / _Math.sqrt( trace + 1.0 );

            this.w = 0.25 / s;
            this.x = ( m32 - m23 ) * s;
            this.y = ( m13 - m31 ) * s;
            this.z = ( m21 - m12 ) * s;

        } else if ( m11 > m22 && m11 > m33 ) {

            s = 2.0 * _Math.sqrt( 1.0 + m11 - m22 - m33 );

            this.w = ( m32 - m23 ) / s;
            this.x = 0.25 * s;
            this.y = ( m12 + m21 ) / s;
            this.z = ( m13 + m31 ) / s;

        } else if ( m22 > m33 ) {

            s = 2.0 * _Math.sqrt( 1.0 + m22 - m11 - m33 );

            this.w = ( m13 - m31 ) / s;
            this.x = ( m12 + m21 ) / s;
            this.y = 0.25 * s;
            this.z = ( m23 + m32 ) / s;

        } else {

            s = 2.0 * _Math.sqrt( 1.0 + m33 - m11 - m22 );

            this.w = ( m21 - m12 ) / s;
            this.x = ( m13 + m31 ) / s;
            this.y = ( m23 + m32 ) / s;
            this.z = 0.25 * s;

        }

        //this.onChangeCallback();

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

    },
}

export { Quat };

/*
// for three easy export
_Math.Quaternion = function ( x, y, z, w ) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.w = ( w !== undefined ) ? w : 1;
};

_Math.Quaternion.prototype = {

    constructor: _Math.Quaternion,

    
}*/