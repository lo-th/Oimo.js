OIMO.Vec3 = function(x,y,z){
    this.x=x || 0;
    this.y=y || 0;
    this.z=z || 0;
};

OIMO.Vec3.prototype = {

    constructor: OIMO.Vec3,

    init: function(x,y,z){
        this.x=x || 0;
        this.y=y || 0;
        this.z=z || 0;
        return this;
    },
    set: function(x,y,z){
        this.x=x;
        this.y=y;
        this.z=z;
        return this;
    },
    add: function(v1,v2){
        this.x=v1.x+v2.x;
        this.y=v1.y+v2.y;
        this.z=v1.z+v2.z;
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
    dot: function(v){
        return this.x*v.x+this.y*v.y+this.z*v.z;
    },
    cross: function(v1,v2){
        var x=v1.y*v2.z-v1.z*v2.y;
        var y=v1.z*v2.x-v1.x*v2.z;
        var z=v1.x*v2.y-v1.y*v2.x;
        this.x=x;
        this.y=y;
        this.z=z;
        return this;
    },
    mul: function(o, v, m){
        var te = m.elements;
        this.x=o.x+v.x*te[0]+v.y*te[1]+v.z*te[2];
        this.y=o.y+v.x*te[3]+v.y*te[4]+v.z*te[5];
        this.z=o.z+v.x*te[6]+v.y*te[7]+v.z*te[8];
        return this;
    },
    mulMat: function(m,v){
        var te = m.elements;
        var x=te[0]*v.x+te[1]*v.y+te[2]*v.z;
        var y=te[3]*v.x+te[4]*v.y+te[5]*v.z;
        var z=te[6]*v.x+te[7]*v.y+te[8]*v.z;
        this.x=x;
        this.y=y;
        this.z=z;
        return this;
    },
    normalize: function(v){
        var length=Math.sqrt(v.x*v.x+v.y*v.y+v.z*v.z);
        if(length>0)length=1/length;
        this.x=v.x*length;
        this.y=v.y*length;
        this.z=v.z*length;
        return this;
    },
    invert: function(v){
        this.x=-v.x;
        this.y=-v.y;
        this.z=-v.z;
        return this;
    },
    length: function(){
        return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z);
    },
    len: function(){
        return (this.x*this.x+this.y*this.y+this.z*this.z);
    },
    copy: function(v){
        this.x=v.x;
        this.y=v.y;
        this.z=v.z;
        return this;
    },
    testZero: function(){
        if(this.x!==0 || this.y!==0 || this.z!==0) return true;
        else return false;
    },
    testDiff: function(v){
        if(this.x!==v.x || this.y!==v.y || this.z!==v.z) return true;
        else return false;
    },
    clone: function(){
        return new OIMO.Vec3(this.x,this.y,this.z);
    },
    toString: function(){
        return"Vec3["+this.x.toFixed(4)+", "+this.y.toFixed(4)+", "+this.z.toFixed(4)+"]";
    }
}