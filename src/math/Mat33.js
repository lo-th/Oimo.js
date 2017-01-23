import { _Math } from './Math';
import { Vec3 } from './Vec3';
import { Quat } from './Quat';

function Mat33 (e00,e01,e02,e10,e11,e12,e20,e21,e22){

    this.elements = new Float32Array(9);
    //var te = this.elements;

    this.init(
        ( e00 !== undefined ) ? e00 : 1, e01 || 0, e02 || 0,
        e10 || 0, ( e11 !== undefined ) ? e11 : 1, e12 || 0,
        e20 || 0, e21 || 0, ( e22 !== undefined ) ? e22 : 1
    );

};

Mat33.prototype = {

    constructor: Mat33,

    set: function( e00, e01, e02, e10, e11, e12, e20, e21, e22 ){

        var te = this.elements;

        te[0] = e00; te[1] = e01; te[2] = e02;
        te[3] = e10; te[4] = e11; te[5] = e12;
        te[6] = e20; te[7] = e21; te[8] = e22;

        return this;

    },

    init: function( e00, e01, e02, e10, e11, e12, e20, e21, e22 ){
        var te = this.elements;
        te[0] = e00; te[1] = e01; te[2] = e02;
        te[3] = e10; te[4] = e11; te[5] = e12;
        te[6] = e20; te[7] = e21; te[8] = e22;
        return this;
    },

    

    multiply: function(s){
        var te = this.elements;
        te[0] *= s; te[1] *= s; te[2] *= s;
        te[3] *= s; te[4] *= s; te[5] *= s;
        te[6] *= s; te[7] *= s; te[8] *= s;
        return this;
    },

    
    add: function(m1,m2){
        var te = this.elements, tem1 = m1.elements, tem2 = m2.elements;
        te[0] = tem1[0] + tem2[0]; te[1] = tem1[1] + tem2[1]; te[2] = tem1[2] + tem2[2];
        te[3] = tem1[3] + tem2[3]; te[4] = tem1[4] + tem2[4]; te[5] = tem1[5] + tem2[5];
        te[6] = tem1[6] + tem2[6]; te[7] = tem1[7] + tem2[7]; te[8] = tem1[8] + tem2[8];
        return this;
    },
    addEqual: function(m){
        var te = this.elements, tem = m.elements;
        te[0] += tem[0]; te[1] += tem[1]; te[2] += tem[2];
        te[3] += tem[3]; te[4] += tem[4]; te[5] += tem[5];
        te[6] += tem[6]; te[7] += tem[7]; te[8] += tem[8];
        return this;
    },
    sub: function(m1,m2){
        var te = this.elements, tem1 = m1.elements, tem2 = m2.elements;
        te[0] = tem1[0] - tem2[0]; te[1] = tem1[1] - tem2[1]; te[2] = tem1[2] - tem2[2];
        te[3] = tem1[3] - tem2[3]; te[4] = tem1[4] - tem2[4]; te[5] = tem1[5] - tem2[5];
        te[6] = tem1[6] - tem2[6]; te[7] = tem1[7] - tem2[7]; te[8] = tem1[8] - tem2[8];
        return this;
    },
    subEqual:function(m){
        var te = this.elements, tem = m.elements;
        te[0] -= tem[0]; te[1] -= tem[1]; te[2] -= tem[2];
        te[3] -= tem[3]; te[4] -= tem[4]; te[5] -= tem[5];
        te[6] -= tem[6]; te[7] -= tem[7]; te[8] -= tem[8];
        return this;
    },
    scale: function(m,s){
        var te = this.elements, tm = m.elements;
        te[0] = tm[0] * s; te[1] = tm[1] * s; te[2] = tm[2] * s;
        te[3] = tm[3] * s; te[4] = tm[4] * s; te[5] = tm[5] * s;
        te[6] = tm[6] * s; te[7] = tm[7] * s; te[8] = tm[8] * s;
        return this;
    },
    scaleEqual: function(s){
        var te = this.elements;
        te[0] *= s; te[1] *= s; te[2] *= s;
        te[3] *= s; te[4] *= s; te[5] *= s;
        te[6] *= s; te[7] *= s; te[8] *= s;
        return this;
    },
    mul: function(m1,m2){
        var te = this.elements, tm1 = m1.elements, tm2 = m2.elements,
        a0 = tm1[0], a3 = tm1[3], a6 = tm1[6],
        a1 = tm1[1], a4 = tm1[4], a7 = tm1[7],
        a2 = tm1[2], a5 = tm1[5], a8 = tm1[8],
        b0 = tm2[0], b3 = tm2[3], b6 = tm2[6],
        b1 = tm2[1], b4 = tm2[4], b7 = tm2[7],
        b2 = tm2[2], b5 = tm2[5], b8 = tm2[8];
        te[0] = a0*b0 + a1*b3 + a2*b6;
        te[1] = a0*b1 + a1*b4 + a2*b7;
        te[2] = a0*b2 + a1*b5 + a2*b8;
        te[3] = a3*b0 + a4*b3 + a5*b6;
        te[4] = a3*b1 + a4*b4 + a5*b7;
        te[5] = a3*b2 + a4*b5 + a5*b8;
        te[6] = a6*b0 + a7*b3 + a8*b6;
        te[7] = a6*b1 + a7*b4 + a8*b7;
        te[8] = a6*b2 + a7*b5 + a8*b8;
        return this;
    },
    mulScale: function(m,sx,sy,sz,Prepend){
        var prepend = Prepend || false;
        var te = this.elements, tm = m.elements;
        if(prepend){
            te[0] = sx*tm[0]; te[1] = sx*tm[1]; te[2] = sx*tm[2];
            te[3] = sy*tm[3]; te[4] = sy*tm[4]; te[5] = sy*tm[5];
            te[6] = sz*tm[6]; te[7] = sz*tm[7]; te[8] = sz*tm[8];
        }else{
            te[0] = tm[0]*sx; te[1] = tm[1]*sy; te[2] = tm[2]*sz;
            te[3] = tm[3]*sx; te[4] = tm[4]*sy; te[5] = tm[5]*sz;
            te[6] = tm[6]*sx; te[7] = tm[7]*sy; te[8] = tm[8]*sz;
        }
        return this;
    },
    mulRotate: function(m,rad,ax,ay,az,Prepend){
        var prepend = Prepend || false;
        var s=_Math.sin(rad);
        var c=_Math.cos(rad);
        var c1=1-c;
        var r00=ax*ax*c1+c;
        var r01=ax*ay*c1-az*s;
        var r02=ax*az*c1+ay*s;
        var r10=ay*ax*c1+az*s;
        var r11=ay*ay*c1+c;
        var r12=ay*az*c1-ax*s;
        var r20=az*ax*c1-ay*s;
        var r21=az*ay*c1+ax*s;
        var r22=az*az*c1+c;

        var tm = m.elements;

        var a0 = tm[0], a3 = tm[3], a6 = tm[6];
        var a1 = tm[1], a4 = tm[4], a7 = tm[7];
        var a2 = tm[2], a5 = tm[5], a8 = tm[8];

        var te = this.elements;
        
        if(prepend){
            te[0]=r00*a0+r01*a3+r02*a6;
            te[1]=r00*a1+r01*a4+r02*a7;
            te[2]=r00*a2+r01*a5+r02*a8;
            te[3]=r10*a0+r11*a3+r12*a6;
            te[4]=r10*a1+r11*a4+r12*a7;
            te[5]=r10*a2+r11*a5+r12*a8;
            te[6]=r20*a0+r21*a3+r22*a6;
            te[7]=r20*a1+r21*a4+r22*a7;
            te[8]=r20*a2+r21*a5+r22*a8;
        }else{
            te[0]=a0*r00+a1*r10+a2*r20;
            te[1]=a0*r01+a1*r11+a2*r21;
            te[2]=a0*r02+a1*r12+a2*r22;
            te[3]=a3*r00+a4*r10+a5*r20;
            te[4]=a3*r01+a4*r11+a5*r21;
            te[5]=a3*r02+a4*r12+a5*r22;
            te[6]=a6*r00+a7*r10+a8*r20;
            te[7]=a6*r01+a7*r11+a8*r21;
            te[8]=a6*r02+a7*r12+a8*r22;
        }
        return this;
    },
    transpose: function(m){
        var te = this.elements, tm = m.elements;
        te[0] = tm[0]; te[1] = tm[3]; te[2] = tm[6];
        te[3] = tm[1]; te[4] = tm[4]; te[5] = tm[7];
        te[6] = tm[2]; te[7] = tm[5]; te[8] = tm[8];
        return this;
    },
    setQuat: function(q){
        var te = this.elements,
        x2=2*q.x,  y2=2*q.y,  z2=2*q.z,
        xx=q.x*x2, yy=q.y*y2, zz=q.z*z2,
        xy=q.x*y2, yz=q.y*z2, xz=q.x*z2,
        sx=q.w*x2, sy=q.w*y2, sz=q.w*z2;
        
        te[0]=1-yy-zz;
        te[1]=xy-sz;
        te[2]=xz+sy;
        te[3]=xy+sz;
        te[4]=1-xx-zz;
        te[5]=yz-sx;
        te[6]=xz-sy;
        te[7]=yz+sx;
        te[8]=1-xx-yy;
        return this;
    },
    invert: function(m){
        var te = this.elements, tm = m.elements,
        a0 = tm[0], a3 = tm[3], a6 = tm[6],
        a1 = tm[1], a4 = tm[4], a7 = tm[7],
        a2 = tm[2], a5 = tm[5], a8 = tm[8],
        b01 = a4*a8-a7*a5,
        b11 = a7*a2-a1*a8,
        b21 = a1*a5-a4*a2,
        dt= a0 * (b01) + a3 * (b11) + a6 * (b21);

        if(dt!=0){dt=1.0/dt;}
        te[0] = dt*b01;//(a4*a8 - a5*a7);
        te[1] = dt*b11;//(a2*a7 - a1*a8);
        te[2] = dt*b21;//(a1*a5 - a2*a4);
        te[3] = dt*(a5*a6 - a3*a8);
        te[4] = dt*(a0*a8 - a2*a6);
        te[5] = dt*(a2*a3 - a0*a5);
        te[6] = dt*(a3*a7 - a4*a6);
        te[7] = dt*(a1*a6 - a0*a7);
        te[8] = dt*(a0*a4 - a1*a3);
        return this;
    },
    /*copy: function(m){
        var te = this.elements, tem = m.elements;
        te[0] = tem[0]; te[1] = tem[1]; te[2] = tem[2];
        te[3] = tem[3]; te[4] = tem[4]; te[5] = tem[5];
        te[6] = tem[6]; te[7] = tem[7]; te[8] = tem[8];
        return this;
    },*/
    toEuler: function(){ // not work !!
        function clamp( x ) {
            return _Math.min( _Math.max( x, -1 ), 1 );
        }
        var te = this.elements;
        var m11 = te[0], m12 = te[3], m13 = te[6];
        var m22 = te[4], m23 = te[7];
        var m32 = te[5], m33 = te[8];
        //var m21 = te[1], m22 = te[4], m23 = te[7];
        //var m31 = te[2], m32 = te[5], m33 = te[8];

        var p = new Vec3();
        //var d = new Quat();
        //var s;

        p.y = _Math.asin( clamp( m13 ) );

        if ( _Math.abs( m13 ) < 0.99999 ) {
            p.x = _Math.atan2( - m23, m33 );
            p.z = _Math.atan2( - m12, m11 );
        } else {
            p.x = _Math.atan2( m32, m22 );
            p.z = 0;
        }
        
        return p;
    },
    /*clone: function(){
        var te = this.elements;

        return new _Math.Mat33(
            te[0], te[1], te[2],
            te[3], te[4], te[5],
            te[6], te[7], te[8]
        );
    },*/

    toString: function(){
        var te = this.elements;
        var text=
        "Mat33|"+te[0].toFixed(4)+", "+te[1].toFixed(4)+", "+te[2].toFixed(4)+"|\n"+
        "     |"+te[3].toFixed(4)+", "+te[4].toFixed(4)+", "+te[5].toFixed(4)+"|\n"+
        "     |"+te[6].toFixed(4)+", "+te[7].toFixed(4)+", "+te[8].toFixed(4)+"|" ;
        return text;
    },

    // OK 

    multiplyScalar: function ( s ) {

        var te = this.elements;

        te[ 0 ] *= s; te[ 3 ] *= s; te[ 6 ] *= s;
        te[ 1 ] *= s; te[ 4 ] *= s; te[ 7 ] *= s;
        te[ 2 ] *= s; te[ 5 ] *= s; te[ 8 ] *= s;

        return this;

    },

    

    identity: function () {

        this.set( 1, 0, 0, 0, 1, 0, 0, 0, 1 );

        return this;

    },


    clone: function () {

        return new this.constructor().fromArray( this.elements );

    },

    copy: function ( m ) {

        var me = m.elements;

        this.set(

            me[ 0 ], me[ 3 ], me[ 6 ],
            me[ 1 ], me[ 4 ], me[ 7 ],
            me[ 2 ], me[ 5 ], me[ 8 ]

        );

        return this;

    },

    fromArray: function ( array ) {

        this.elements.set( array );

        return this;

    },

    toArray: function () {

        var te = this.elements;

        return [
            te[ 0 ], te[ 1 ], te[ 2 ],
            te[ 3 ], te[ 4 ], te[ 5 ],
            te[ 6 ], te[ 7 ], te[ 8 ]
        ];

    }


};

export { Mat33 };