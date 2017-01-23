import { _Math } from './Math';


function Mat44 (n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44 ){

    this.elements = new Float32Array( 16 );
    var te = this.elements;
    te[0] = ( n11 !== undefined ) ? n11 : 1; te[4] = n12 || 0; te[8] = n13 || 0; te[12] = n14 || 0;
    te[1] = n21 || 0; te[5] = ( n22 !== undefined ) ? n22 : 1; te[9] = n23 || 0; te[13] = n24 || 0;
    te[2] = n31 || 0; te[6] = n32 || 0; te[10] = ( n33 !== undefined ) ? n33 : 1; te[14] = n34 || 0;
    te[3] = n41 || 0; te[7] = n42 || 0; te[11] = n43 || 0; te[15] = ( n44 !== undefined ) ? n44 : 1;

};

Mat44.prototype = {

    constructor: Mat44,

    set: function ( n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44 ) {

        var te = this.elements;

        te[0] = n11; te[4] = n12; te[8] = n13; te[12] = n14;
        te[1] = n21; te[5] = n22; te[9] = n23; te[13] = n24;
        te[2] = n31; te[6] = n32; te[10] = n33; te[14] = n34;
        te[3] = n41; te[7] = n42; te[11] = n43; te[15] = n44;

        return this;
    }/*,
    extractRotation: function () {

        var v1 = new THREE.Vector3();

        return function ( m ) {

            var te = this.elements;
            var me = m.elements;

            var scaleX = 1 / v1.set( me[ 0 ], me[ 1 ], me[ 2 ] ).length();
            var scaleY = 1 / v1.set( me[ 4 ], me[ 5 ], me[ 6 ] ).length();
            var scaleZ = 1 / v1.set( me[ 8 ], me[ 9 ], me[ 10 ] ).length();

            te[ 0 ] = me[ 0 ] * scaleX;
            te[ 1 ] = me[ 1 ] * scaleX;
            te[ 2 ] = me[ 2 ] * scaleX;

            te[ 4 ] = me[ 4 ] * scaleY;
            te[ 5 ] = me[ 5 ] * scaleY;
            te[ 6 ] = me[ 6 ] * scaleY;

            te[ 8 ] = me[ 8 ] * scaleZ;
            te[ 9 ] = me[ 9 ] * scaleZ;
            te[ 10 ] = me[ 10 ] * scaleZ;

            return this;

        };

    }() */
}

export { Mat44 };