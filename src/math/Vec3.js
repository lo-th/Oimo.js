import { _Math } from './Math';

function Vec3 ( x, y, z ) {

    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    
}

Object.assign( Vec3.prototype, {

    Vec3: true,

    set: function(x,y,z){

        this.x = x;
        this.y = y;
        this.z = z;
        return this;

    },

    add: function(v1,v2){

        this.x = v1.x + v2.x;
        this.y = v1.y + v2.y;
        this.z = v1.z + v2.z;
        return this;

    },

    addEqual: function ( v ) {

        this.x+=v.x;
        this.y+=v.y;
        this.z+=v.z;
        return this;

    },

    addTime: function ( v, t ) {

        this.x+=v.x*t;
        this.y+=v.y*t;
        this.z+=v.z*t;
        return this;

    },

    sub: function ( v1, v2 ) {

        this.x=v1.x-v2.x;
        this.y=v1.y-v2.y;
        this.z=v1.z-v2.z;
        return this;

    },

    subEqual: function ( v ) {

        this.x-=v.x;
        this.y-=v.y;
        this.z-=v.z;
        return this;

    },

    addScale: function ( v, s ) {

        this.x+=v.x*s;
        this.y+=v.y*s;
        this.z+=v.z*s;
        return this;

    },

    subScale: function ( v, s ) {

        this.x-=v.x*s;
        this.y-=v.y*s;
        this.z-=v.z*s;
        return this;

    },

    scale: function ( v, s ) {

        this.x=v.x*s;
        this.y=v.y*s;
        this.z=v.z*s;
        return this;

    },

    scaleEqual: function( s ){

        this.x*=s;
        this.y*=s;
        this.z*=s;
        return this;

    },
   
    cross: function( a, b ) {

        var ax = a.x, ay = a.y, az = a.z;
        var bx = b.x, by = b.y, bz = b.z;

        this.x = ay * bz - az * by;
        this.y = az * bx - ax * bz;
        this.z = ax * by - ay * bx;

        return this;

    },

    crossVectors: function ( a, b ) {

        var ax = a.x, ay = a.y, az = a.z;
        var bx = b.x, by = b.y, bz = b.z;

        this.x = ay * bz - az * by;
        this.y = az * bx - ax * bz;
        this.z = ax * by - ay * bx;

        return this;

    },

    tangent: function ( a ) {

        var ax = a.x, ay = a.y, az = a.z;

        this.x = ay * ax - az * az;
        this.y = - az * ay - ax * ax;
        this.z = ax * az + ay * ay;

        return this;

    },

    mul: function( o, v, m ){

        var te = m.elements;
        this.x = o.x + v.x*te[0] + v.y*te[1] + v.z*te[2];
        this.y = o.y + v.x*te[3] + v.y*te[4] + v.z*te[5];
        this.z = o.z + v.x*te[6] + v.y*te[7] + v.z*te[8];
        return this;

    },

    mulMat: function( m, v ){

        var te = m.elements;
        this.x = te[0]*v.x + te[1]*v.y + te[2]*v.z;
        this.y = te[3]*v.x + te[4]*v.y + te[5]*v.z;
        this.z = te[6]*v.x + te[7]*v.y + te[8]*v.z;
        return this;

    },

    mulManifold: function ( m, v ) {

        var te = m.elements;
        this.x = te[0]*v.x + te[3]*v.y + te[6]*v.z;
        this.y = te[1]*v.x + te[4]*v.y + te[7]*v.z;
        this.z = te[2]*v.x + te[5]*v.y + te[8]*v.z;
        return this;

    },

    invert: function ( v ) {

        this.x=-v.x;
        this.y=-v.y;
        this.z=-v.z;
        return this;

    },
    /*length: function(){
        var x = this.x, y = this.y, z = this.z;
        return OIMO.sqrt(x*x + y*y + z*z);
    },*/
    
    negate: function () {

        this.x = - this.x;
        this.y = - this.y;
        this.z = - this.z;

        return this;

    },

    dot: function ( v ) {

        return this.x * v.x + this.y * v.y + this.z * v.z;

    },

    

    lengthSq: function () {

        return this.x * this.x + this.y * this.y + this.z * this.z;

    },

    length: function () {

        return _Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );

    },

    /*len: function(){
        var x = this.x, y = this.y, z = this.z;
        return x*x + y*y + z*z;
    },*/

    copy: function( v ){

        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;

    },

    subQuatTime: function( q, t ){

        //

       /* var angle = _Math.acos(q.w);
        var s = _Math.asin(angle);
        var x = q.x / s;
        var y = q.y / s;
        var z = q.z / s;

        q.normalize();

        var angle = 2 * _Math.acos(q.w)
        var len = _Math.sqrt(1-q.w*q.w)
        if(len>0) {len = 0;console.log('out')}//{len=1/len;}
var x = q.x / len
var y = q.y / len
var z = q.z / len*/

      // this.set( x, y, z ).normalize();

       // console.log(this)

        //q.normalize();

        /*var w = 2 * Math.acos( q.w );
        var s = Math.sqrt( 1 - q.w * q.w );

        if ( s < 0.0001 ) {

             this.x = 1;
             this.y = 0;
             this.z = 0;

        } else {

             this.x = q.x / s;
             this.y = q.y / s;
             this.z = q.z / s;

        }*/

        //this.normalize()

     /*   var angle = 2 * _Math.acos(q.w)
var x = q.x / _Math.sqrt(1-q.w*q.w)
var y = q.y / _Math.sqrt(1-q.w*q.w)
var z = q.z / _Math.sqrt(1-q.w*q.w)

var x = 2 * ( q.x * q.z - q.w * q.y )
var y = 2 * ( q.y * q.z + q.w * q.x )
var z = 1 - 2 * ( q.x * q.x + q.y * q.y )*/

        //this.set(0.5,0.5,0)
        //this.set(0,1,0)

        //this.applyQuaternion( new Quat(0,0,0,1) )
        //this.set(0,0,1)
       // this.set(x,y,z);//.normalize()
        this.applyQuaternion( q.scaleEqual(t).normalize() )
       // this.applyQuaternion( q.scaleEqual(t) )
        //this.scaleEqual( 1/t );

        //var v = new Vec3().applyQuaternion( q  );
        //console.log(this)
        //this.scale( v, t );

        /*q.normalize();

        var v = new Vec3(1, 1,1)

        var xx = q.x * q.x;
        var yy = q.y * q.y;
        var zz = q.z * q.z;
        var xy = q.x * q.y;
        var yz = q.y * q.z;
        var xz = q.x * q.z;
        var sx = q.w * q.x;
        var sy = q.w * q.y;
        var sz = q.w * q.z;
        var tx = v.x * (0.5 - yy - zz) + v.y * (xy - sz) + v.z * (xz + sy);
        var ty = v.x * (xy + sz) + v.y * (0.5 - xx - zz) + v.z * (yz - sx);
        var tz = v.x * (xz - sy) + v.y * (yz + sx) + v.z * (0.5 - xx - yy);

        this.x = tx * 2;
        this.y = ty * 2;
        this.z = tz * 2;*/

        //var x = this.x;
        //var y = this.y;
        //var z = this.z;*/

        //this.applyQuaternion( q ).scaleEqual( t )//.//.scaleEqual( t ) );//.normalize()
        //


       /* var qx = q.x;
        var qy = q.y;
        var qz = q.z;
        var qw = q.w;

        t*=0.5;
        var iw=(-x*qx - y*qy - z*qz)*t;
        var ix=( x*qw + y*qz - z*qy)*t;
        var iy=(-x*qz + y*qw + z*qx)*t;
        var iz=( x*qy - y*qx + z*qw)*t;

        this.x = ix * qw + iw * - qx + iy * - qz - iz * - qy;
        this.y = iy * qw + iw * - qy + iz * - qx - ix * - qz;
        this.z = iz * qw + iw * - qz + ix * - qy - iy * - qx;*/

        return this;

    },

    applyMatrix3: function ( m ) {

        var x = this.x, y = this.y, z = this.z;
        var e = m.elements;

        this.x = e[ 0 ] * x + e[ 3 ] * y + e[ 6 ] * z;
        this.y = e[ 1 ] * x + e[ 4 ] * y + e[ 7 ] * z;
        this.z = e[ 2 ] * x + e[ 5 ] * y + e[ 8 ] * z;

        return this;

    },

    applyQuaternion: function ( q ) {

        var x = this.x;
        var y = this.y;
        var z = this.z;

        var qx = q.x;
        var qy = q.y;
        var qz = q.z;
        var qw = q.w;

        // calculate quat * vector

        var ix =  qw * x + qy * z - qz * y;
        var iy =  qw * y + qz * x - qx * z;
        var iz =  qw * z + qx * y - qy * x;
        var iw = - qx * x - qy * y - qz * z;

        // calculate result * inverse quat

        this.x = ix * qw + iw * - qx + iy * - qz - iz * - qy;
        this.y = iy * qw + iw * - qy + iz * - qx - ix * - qz;
        this.z = iz * qw + iw * - qz + ix * - qy - iy * - qx;

        return this;

    },
    testZero: function () {

        if(this.x!==0 || this.y!==0 || this.z!==0) return true;
        else return false;

    },
    testDiff: function( v ){

        return ( ( v.x !== this.x ) || ( v.y !== this.y ) || ( v.z !== this.z ) );
        //if(this.x!==v.x || this.y!==v.y || this.z!==v.z) return true;
        //else return false;
    },

    equals: function ( v ) {

        return ( ( v.x === this.x ) && ( v.y === this.y ) && ( v.z === this.z ) );

    },

    clone: function () {

        return new this.constructor( this.x, this.y, this.z );

    },

    toString: function(){

        return"Vec3["+this.x.toFixed(4)+", "+this.y.toFixed(4)+", "+this.z.toFixed(4)+"]";
        
    },

    multiplyScalar: function ( scalar ) {

        if ( isFinite( scalar ) ) {
            this.x *= scalar;
            this.y *= scalar;
            this.z *= scalar;
        } else {
            this.x = 0;
            this.y = 0;
            this.z = 0;
        }

        return this;

    },

    divideScalar: function ( scalar ) {

        return this.multiplyScalar( 1 / scalar );

    },

    normalize: function () {

        return this.divideScalar( this.length() );

    },

    toArray: function ( array, offset ) {

        if ( offset === undefined ) offset = 0;

        array[ offset ] = this.x;
        array[ offset + 1 ] = this.y;
        array[ offset + 2 ] = this.z;

    },

    fromArray: function( array, offset ){

        if ( offset === undefined ) offset = 0;
        
        this.x = array[ offset ];
        this.y = array[ offset + 1 ];
        this.z = array[ offset + 2 ];
        return this;

    },


} );

export { Vec3 };