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
    addEqual: function(v){
        this.x+=v.x;
        this.y+=v.y;
        this.z+=v.z;
        return this;
    },
    addTime: function(v, t){
        this.x+=v.x*t;
        this.y+=v.y*t;
        this.z+=v.z*t;
        return this;
    },
    sub: function(v1,v2){
        this.x=v1.x-v2.x;
        this.y=v1.y-v2.y;
        this.z=v1.z-v2.z;
        return this;
    },
    subEqual: function(v){
        this.x-=v.x;
        this.y-=v.y;
        this.z-=v.z;
        return this;
    },
    addScale: function(v,s){
        this.x+=v.x*s;
        this.y+=v.y*s;
        this.z+=v.z*s;
        return this;
    },
    scale: function(v,s){
        this.x=v.x*s;
        this.y=v.y*s;
        this.z=v.z*s;
        return this;
    },
    scaleEqual: function(s){
        this.x*=s;
        this.y*=s;
        this.z*=s;
        return this;
    },
    /*dot: function(v){
        return this.x*v.x+this.y*v.y+this.z*v.z;
    },*/
    cross: function( v1, v2 ) {

        var ax = v1.x, ay = v1.y, az = v1.z, 
        bx = v2.x, by = v2.y, bz = v2.z;
        this.x = ay * bz - az * by;
        this.y = az * bx - ax * bz;
        this.z = ax * by - ay * bx;
        return this;

    },

    mul: function( o, v, m ){

        var te = m.elements;
        this.x= o.x + v.x*te[0] + v.y*te[1] + v.z*te[2];
        this.y= o.y + v.x*te[3] + v.y*te[4] + v.z*te[5];
        this.z= o.z + v.x*te[6] + v.y*te[7] + v.z*te[8];
        return this;

    },

    mulMat: function(m,v){

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

    normalize: function(v){
        var x = v.x, y = v.y, z = v.z;
        var l = x*x + y*y + z*z;
        if (l > 0) {
            l = 1 / _Math.sqrt(l);
            this.x = x*l;
            this.y = y*l;
            this.z = z*l;
        }
        return this;
    },
    /*norm: function(){
        var x = this.x, y = this.y, z = this.z;
        var l = x*x + y*y + z*z;
        if (l > 0) {
            l = 1 / OIMO.sqrt(l);
            this.x = x*l;
            this.y = y*l;
            this.z = z*l;
        }
        return this;
    },*/
    invert: function(v){
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
    testDiff: function(v){

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

    // TODO rename to normalize
    norm: function () {

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