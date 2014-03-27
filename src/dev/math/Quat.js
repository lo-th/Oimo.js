OIMO.Quat = function( s, x, y, z){
    this.s=( s !== undefined ) ? s : 1;
    this.x=x || 0;
    this.y=y || 0;
    this.z=z || 0;
};

OIMO.Quat.prototype = {

    constructor: OIMO.Quat,

    init: function(s,x,y,z){
        this.s=( s !== undefined ) ? s : 1;
        this.x=x || 0;
        this.y=y || 0;
        this.z=z || 0;
        return this;
    },
    add: function(q1,q2){
        this.s=q1.s+q2.s;
        this.x=q1.x+q2.x;
        this.y=q1.y+q2.y;
        this.z=q1.z+q2.z;
        return this;
    },
    sub: function(q1,q2){
        this.s=q1.s-q2.s;
        this.x=q1.x-q2.x;
        this.y=q1.y-q2.y;
        this.z=q1.z-q2.z;
          return this;
    },
    scale: function(q,s){
        this.s=q.s*s;
        this.x=q.x*s;
        this.y=q.y*s;
        this.z=q.z*s;
        return this;
    },
    mul: function(q1,q2){
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
        d=1/Math.sqrt(x2*x2+y2*y2+z2*z2);
        this.s=0;
        this.x=x2*d;
        this.y=y2*d;
        this.z=z2*d;
        return this;
        }
        var cx=y1*z2-z1*y2;
        var cy=z1*x2-x1*z2;
        var cz=x1*y2-y1*x2;
        this.s=Math.sqrt((1+d)*0.5);
        d=0.5/this.s;
        this.x=cx*d;
        this.y=cy*d;
        this.z=cz*d;
        return this;
    },
    normalize: function(q){
        var len=Math.sqrt(q.s*q.s+q.x*q.x+q.y*q.y+q.z*q.z);
        if(len>0){len=1/len;}
        this.s=q.s*len;
        this.x=q.x*len;
        this.y=q.y*len;
        this.z=q.z*len;
        return this;
    },
    invert: function(q){
        this.s=q.s;
        this.x=-q.x;
        this.y=-q.y;
        this.z=-q.z;
        return this;
    },
    length: function(){
        return Math.sqrt(this.s*this.s+this.x*this.x+this.y*this.y+this.z*this.z);
    },
    copy: function(q){
        this.s=q.s;
        this.x=q.x;
        this.y=q.y;
        this.z=q.z;
        return this;
    },
    clone: function(q){
        return new OIMO.Quat(this.s,this.x,this.y,this.z);
    },
    toString: function(){
        return"Quat["+this.s.toFixed(4)+", ("+this.x.toFixed(4)+", "+this.y.toFixed(4)+", "+this.z.toFixed(4)+")]";
    }
}