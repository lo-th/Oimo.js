import { _Math } from './Math';
import { Vec3 } from './Vec3';

function Mat33 ( e00, e01, e02, e10, e11, e12, e20, e21, e22 ){

    this.elements = [
        1, 0, 0,
        0, 1, 0,
        0, 0, 1
    ];

    if ( arguments.length > 0 ) {

        console.error( 'OIMO.Mat33: the constructor no longer reads arguments. use .set() instead.' );

    }

}

Object.assign( Mat33.prototype, {

    Mat33: true,

    set: function ( e00, e01, e02, e10, e11, e12, e20, e21, e22 ){

        var te = this.elements;
        te[0] = e00; te[1] = e01; te[2] = e02;
        te[3] = e10; te[4] = e11; te[5] = e12;
        te[6] = e20; te[7] = e21; te[8] = e22;
        return this;

    },
    
    add: function ( a, b ) {

        if( b !== undefined ) return this.addMatrixs( a, b );

        var e = this.elements, te = a.elements;
        e[0] += te[0]; e[1] += te[1]; e[2] += te[2];
        e[3] += te[3]; e[4] += te[4]; e[5] += te[5];
        e[6] += te[6]; e[7] += te[7]; e[8] += te[8];
        return this;

    },

    addMatrixs: function ( a, b ) {

        var te = this.elements, tem1 = a.elements, tem2 = b.elements;
        te[0] = tem1[0] + tem2[0]; te[1] = tem1[1] + tem2[1]; te[2] = tem1[2] + tem2[2];
        te[3] = tem1[3] + tem2[3]; te[4] = tem1[4] + tem2[4]; te[5] = tem1[5] + tem2[5];
        te[6] = tem1[6] + tem2[6]; te[7] = tem1[7] + tem2[7]; te[8] = tem1[8] + tem2[8];
        return this;

    },

    addEqual: function( m ){

        var te = this.elements, tem = m.elements;
        te[0] += tem[0]; te[1] += tem[1]; te[2] += tem[2];
        te[3] += tem[3]; te[4] += tem[4]; te[5] += tem[5];
        te[6] += tem[6]; te[7] += tem[7]; te[8] += tem[8];
        return this;

    },

    sub: function ( a, b ) {

        if( b !== undefined ) return this.subMatrixs( a, b );

        var e = this.elements, te = a.elements;
        e[0] -= te[0]; e[1] -= te[1]; e[2] -= te[2];
        e[3] -= te[3]; e[4] -= te[4]; e[5] -= te[5];
        e[6] -= te[6]; e[7] -= te[7]; e[8] -= te[8];
        return this;

    },

    subMatrixs: function ( a, b ) {

        var te = this.elements, tem1 = a.elements, tem2 = b.elements;
        te[0] = tem1[0] - tem2[0]; te[1] = tem1[1] - tem2[1]; te[2] = tem1[2] - tem2[2];
        te[3] = tem1[3] - tem2[3]; te[4] = tem1[4] - tem2[4]; te[5] = tem1[5] - tem2[5];
        te[6] = tem1[6] - tem2[6]; te[7] = tem1[7] - tem2[7]; te[8] = tem1[8] - tem2[8];
        return this;

    },

    subEqual: function ( m ) {

        var te = this.elements, tem = m.elements;
        te[0] -= tem[0]; te[1] -= tem[1]; te[2] -= tem[2];
        te[3] -= tem[3]; te[4] -= tem[4]; te[5] -= tem[5];
        te[6] -= tem[6]; te[7] -= tem[7]; te[8] -= tem[8];
        return this;

    },

    scale: function ( m, s ) {

        var te = this.elements, tm = m.elements;
        te[0] = tm[0] * s; te[1] = tm[1] * s; te[2] = tm[2] * s;
        te[3] = tm[3] * s; te[4] = tm[4] * s; te[5] = tm[5] * s;
        te[6] = tm[6] * s; te[7] = tm[7] * s; te[8] = tm[8] * s;
        return this;

    },

    scaleEqual: function ( s ){// multiplyScalar

        var te = this.elements;
        te[0] *= s; te[1] *= s; te[2] *= s;
        te[3] *= s; te[4] *= s; te[5] *= s;
        te[6] *= s; te[7] *= s; te[8] *= s;
        return this;

    },

    multiplyMatrices: function ( m1, m2, transpose ) {

        if( transpose ) m2 = m2.clone().transpose();

        var te = this.elements;
        var tm1 = m1.elements;
        var tm2 = m2.elements;

        var a0 = tm1[0], a3 = tm1[3], a6 = tm1[6];
        var a1 = tm1[1], a4 = tm1[4], a7 = tm1[7];
        var a2 = tm1[2], a5 = tm1[5], a8 = tm1[8];

        var b0 = tm2[0], b3 = tm2[3], b6 = tm2[6];
        var b1 = tm2[1], b4 = tm2[4], b7 = tm2[7];
        var b2 = tm2[2], b5 = tm2[5], b8 = tm2[8];

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

    /*mul: function ( m1, m2, transpose ) {

        if( transpose ) m2 = m2.clone().transpose();

        var te = this.elements;
        var tm1 = m1.elements;
        var tm2 = m2.elements;
        //var tmp;

        var a0 = tm1[0], a3 = tm1[3], a6 = tm1[6];
        var a1 = tm1[1], a4 = tm1[4], a7 = tm1[7];
        var a2 = tm1[2], a5 = tm1[5], a8 = tm1[8];

        var b0 = tm2[0], b3 = tm2[3], b6 = tm2[6];
        var b1 = tm2[1], b4 = tm2[4], b7 = tm2[7];
        var b2 = tm2[2], b5 = tm2[5], b8 = tm2[8];

        /*if( transpose ){

            tmp = b1; b1 = b3; b3 = tmp;
            tmp = b2; b2 = b6; b6 = tmp;
            tmp = b5; b5 = b7; b7 = tmp;

        }

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

    },*/

    transpose: function ( m ) {
        
        if( m !== undefined ){
            var a = m.elements;
            this.set( a[0], a[3], a[6], a[1], a[4], a[7], a[2], a[5], a[8] );
            return this;
        }

        var te = this.elements;
        var a01 = te[1], a02 = te[2], a12 = te[5];
        te[1] = te[3];
        te[2] = te[6];
        te[3] = a01;
        te[5] = te[7];
        te[6] = a02;
        te[7] = a12;
        return this;

    },



    /*mulScale: function ( m, sx, sy, sz, Prepend ) {

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

    transpose: function ( m ) {

        var te = this.elements, tm = m.elements;
        te[0] = tm[0]; te[1] = tm[3]; te[2] = tm[6];
        te[3] = tm[1]; te[4] = tm[4]; te[5] = tm[7];
        te[6] = tm[2]; te[7] = tm[5]; te[8] = tm[8];
        return this;

    },*/

    setQuat: function ( q ) {

        var te = this.elements;
        var x = q.x, y = q.y, z = q.z, w = q.w;
        var x2 = x + x,  y2 = y + y, z2 = z + z;
        var xx = x * x2, xy = x * y2, xz = x * z2;
        var yy = y * y2, yz = y * z2, zz = z * z2;
        var wx = w * x2, wy = w * y2, wz = w * z2;
        
        te[0] = 1 - ( yy + zz );
        te[1] = xy - wz;
        te[2] = xz + wy;

        te[3] = xy + wz;
        te[4] = 1 - ( xx + zz );
        te[5] = yz - wx;

        te[6] = xz - wy;
        te[7] = yz + wx;
        te[8] = 1 - ( xx + yy );

        return this;

    },

    invert: function( m ) {

        var te = this.elements, tm = m.elements,
        a00 = tm[0], a10 = tm[3], a20 = tm[6],
        a01 = tm[1], a11 = tm[4], a21 = tm[7],
        a02 = tm[2], a12 = tm[5], a22 = tm[8],
        b01 = a22 * a11 - a12 * a21,
        b11 = -a22 * a10 + a12 * a20,
        b21 = a21 * a10 - a11 * a20,
        det = a00 * b01 + a01 * b11 + a02 * b21;

        if ( det === 0 ) {
            console.log( "can't invert matrix, determinant is 0");
            return this.identity();
        }

        det = 1.0 / det;
        te[0] = b01 * det;
        te[1] = (-a22 * a01 + a02 * a21) * det;
        te[2] = (a12 * a01 - a02 * a11) * det;
        te[3] = b11 * det;
        te[4] = (a22 * a00 - a02 * a20) * det;
        te[5] = (-a12 * a00 + a02 * a10) * det;
        te[6] = b21 * det;
        te[7] = (-a21 * a00 + a01 * a20) * det;
        te[8] = (a11 * a00 - a01 * a10) * det;
        return this;

    },

    addOffset: function ( m, v ) {

        var relX = v.x;
        var relY = v.y;
        var relZ = v.z;

        var te = this.elements;
        te[0] += m * ( relY * relY + relZ * relZ );
        te[4] += m * ( relX * relX + relZ * relZ );
        te[8] += m * ( relX * relX + relY * relY );
        var xy = m * relX * relY;
        var yz = m * relY * relZ;
        var zx = m * relZ * relX;
        te[1] -= xy;
        te[3] -= xy;
        te[2] -= yz;
        te[6] -= yz;
        te[5] -= zx;
        te[7] -= zx;
        return this;

    },

    subOffset: function ( m, v ) {

        var relX = v.x;
        var relY = v.y;
        var relZ = v.z;

        var te = this.elements;
        te[0] -= m * ( relY * relY + relZ * relZ );
        te[4] -= m * ( relX * relX + relZ * relZ );
        te[8] -= m * ( relX * relX + relY * relY );
        var xy = m * relX * relY;
        var yz = m * relY * relZ;
        var zx = m * relZ * relX;
        te[1] += xy;
        te[3] += xy;
        te[2] += yz;
        te[6] += yz;
        te[5] += zx;
        te[7] += zx;
        return this;

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

        return new Mat33().fromArray( this.elements );

    },

    copy: function ( m ) {

        for ( var i = 0; i < 9; i ++ ) this.elements[ i ] = m.elements[ i ];
        return this;

    },

    determinant: function () {

        var te = this.elements;
        var a = te[ 0 ], b = te[ 1 ], c = te[ 2 ],
            d = te[ 3 ], e = te[ 4 ], f = te[ 5 ],
            g = te[ 6 ], h = te[ 7 ], i = te[ 8 ];

        return a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g;

    },

    fromArray: function ( array, offset ) {

        if ( offset === undefined ) offset = 0;

        for( var i = 0; i < 9; i ++ ) {

            this.elements[ i ] = array[ i + offset ];

        }

        return this;

    },

    toArray: function ( array, offset ) {

        if ( array === undefined ) array = [];
        if ( offset === undefined ) offset = 0;

        var te = this.elements;

        array[ offset ] = te[ 0 ];
        array[ offset + 1 ] = te[ 1 ];
        array[ offset + 2 ] = te[ 2 ];

        array[ offset + 3 ] = te[ 3 ];
        array[ offset + 4 ] = te[ 4 ];
        array[ offset + 5 ] = te[ 5 ];

        array[ offset + 6 ] = te[ 6 ];
        array[ offset + 7 ] = te[ 7 ];
        array[ offset + 8 ] = te[ 8 ];

        return array;

    }


} );

export { Mat33 };