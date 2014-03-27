OIMO.Quat = function( s, x, y, z){
    this.s=( s !== undefined ) ? s : 1;
    this.x=x || 0;
    this.y=y || 0;
    this.z=z || 0;
};

OIMO.Quat.prototype = {

    constructor: OIMO.Quat,

    init:function(s,x,y,z){
        this.s=( s !== undefined ) ? s : 1;
        this.x=x || 0;
        this.y=y || 0;
        this.z=z || 0;
        return this;
    },
    add:function(q1,q2){
        this.s=q1.s+q2.s;
        this.x=q1.x+q2.x;
        this.y=q1.y+q2.y;
        this.z=q1.z+q2.z;
        return this;
    },
    sub:function(q1,q2){
        this.s=q1.s-q2.s;
        this.x=q1.x-q2.x;
        this.y=q1.y-q2.y;
        this.z=q1.z-q2.z;
        return this;
    },
    scale:function(q,s){
        this.s=q.s*s;
        this.x=q.x*s;
        this.y=q.y*s;
        this.z=q.z*s;
        return this;
    },
    mul:function(q1,q2){
        var s=q1.s*q2.s-q1.x*q2.x-q1.y*q2.y-q1.z*q2.z;
        var x=q1.s*q2.x+q1.x*q2.s+q1.y*q2.z-q1.z*q2.y;
        var y=q1.s*q2.y-q1.x*q2.z+q1.y*q2.s+q1.z*q2.x;
        var z=q1.s*q2.z+q1.x*q2.y-q1.y*q2.x+q1.z*q2.s;
        this.s=s;
        this.x=x;
        this.y=y;
        this.z=z;
        return this;
    },
    normalize:function(q){
        var len=Math.sqrt(q.s*q.s+q.x*q.x+q.y*q.y+q.z*q.z);
        if(len>0)len=1/len;
        this.s=q.s*len;
        this.x=q.x*len;
        this.y=q.y*len;
        this.z=q.z*len;
        return this;
    },
    invert:function(q){
        this.s=-q.s;
        this.x=-q.x;
        this.y=-q.y;
        this.z=-q.z;
        return this;
    },
    length:function(){
        return Math.sqrt(this.s*this.s+this.x*this.x+this.y*this.y+this.z*this.z);
    },
    copy:function(q){
        this.s=q.s;
        this.x=q.x;
        this.y=q.y;
        this.z=q.z;
        return this;
    },
    clone:function(q){
        return new OIMO.Quat(this.s,this.x,this.y,this.z);
    },
    toString:function(){
        return"Quat["+this.s.toFixed(4)+", ("+this.x.toFixed(4)+", "+this.y.toFixed(4)+", "+this.z.toFixed(4)+")]";
    }
}