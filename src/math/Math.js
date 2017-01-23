import { Mat33 } from './Mat33';

var _Math = {

    sqrt   : Math.sqrt,
    abs    : Math.abs,
    floor  : Math.floor,
    cos    : Math.cos,
    sin    : Math.sin,
    acos   : Math.acos,
    asin   : Math.asin,
    atan2  : Math.atan2,
    round  : Math.round,
    pow    : Math.pow,
    max    : Math.max,
    min    : Math.min,
    random : Math.random,

    lerp: function ( x, y, t ) { return ( 1 - t ) * x + t * y; },
    randInt: function ( low, high ) { return low + _Math.floor( _Math.random() * ( high - low + 1 ) ); },
    rand: function ( low, high ) { return low + _Math.random() * ( high - low ); },
    //lerp : function ( a, b, percent ) { return a + (b - a) * percent; },
    //rand: function ( a, b ) { return _Math.lerp(a, b, _Math.random()); },
    //randInt: function ( a, b, n ) { return _Math.lerp(a, b, _Math.random()).toFixed(n || 0)*1;},

    int: function( x ) { return _Math.floor(x); },
    fix: function( x, n ) { return x.toFixed(n || 3, 10); },

    clamp: function ( value, min, max ) { return _Math.max( min, _Math.min( max, value ) ); },
    //clamp: function ( x, a, b ) { return ( x < a ) ? a : ( ( x > b ) ? b : x ); },

    degtorad : 0.0174532925199432957,
    radtodeg : 57.295779513082320876,
    PI     : 3.141592653589793,
    TwoPI  : 6.283185307179586,
    PI90   : 1.570796326794896,
    PI270  : 4.712388980384689,

    distance: function( p1, p2 ){

        var xd = p2[0]-p1[0];
        var yd = p2[1]-p1[1];
        var zd = p2[2]-p1[2];
        return _Math.sqrt(xd*xd + yd*yd + zd*zd);

    },

    EulerToAxis: function( ox, oy, oz ){
        
        // angles in radians
        var c1 = _Math.cos(oy*0.5);//heading
        var s1 = _Math.sin(oy*0.5);
        var c2 = _Math.cos(oz*0.5);//altitude
        var s2 = _Math.sin(oz*0.5);
        var c3 = _Math.cos(ox*0.5);//bank
        var s3 = _Math.sin(ox*0.5);
        var c1c2 = c1*c2;
        var s1s2 = s1*s2;
        var w =c1c2*c3 - s1s2*s3;
        var x =c1c2*s3 + s1s2*c3;
        var y =s1*c2*c3 + c1*s2*s3;
        var z =c1*s2*c3 - s1*c2*s3;
        var angle = 2 * _Math.acos(w);
        var norm = x*x+y*y+z*z;
        if (norm < 0.001) {
            x=1;
            y=z=0;
        } else {
            norm = _Math.sqrt(norm);
            x /= norm;
            y /= norm;
            z /= norm;
        }
        return [angle, x, y, z];

    },

    EulerToMatrix: function( ox, oy, oz ) {

        // angles in radians
        var ch = _Math.cos(oy);//heading
        var sh = _Math.sin(oy);
        var ca = _Math.cos(oz);//altitude
        var sa = _Math.sin(oz);
        var cb = _Math.cos(ox);//bank
        var sb = _Math.sin(ox);
        var mtx = new Mat33();

        var te = mtx.elements;
        te[0] = ch * ca;
        te[1] = sh*sb - ch*sa*cb;
        te[2] = ch*sa*sb + sh*cb;
        te[3] = sa;
        te[4] = ca*cb;
        te[5] = -ca*sb;
        te[6] = -sh*ca;
        te[7] = sh*sa*cb + ch*sb;
        te[8] = -sh*sa*sb + ch*cb;
        return mtx;

    },

    MatrixToEuler: function( mtx ){

        // angles in radians
        var te = mtx.elements;
        var x, y, z;
        if (te[3] > 0.998) { // singularity at north pole
            y = _Math.atan2(te[2],te[8]);
            z = _Math.PI/2;
            x = 0;
        } else if (te[3] < -0.998) { // singularity at south pole
            y = _Math.atan2(te[2],te[8]);
            z = -_Math.PI/2;
            x = 0;
        } else {
            y = _Math.atan2(-te[6],te[0]);
            x = _Math.atan2(-te[5],te[4]);
            z = _Math.asin(te[3]);
        }
        return [x, y, z];

    },

    unwrapDegrees: function ( r ) {

        r = r % 360;
        if (r > 180) r -= 360;
        if (r < -180) r += 360;
        return r;

    },

    unwrapRadian: function( r ){

        r = r % _Math.TwoPI;
        if (r > _Math.PI) r -= _Math.TwoPI;
        if (r < -_Math.PI) r += _Math.TwoPI;
        return r;

    },

    acosClamp: function ( cos ) {

        if(cos>1)return 0;
        else if(cos<-1)return _Math.PI;
        else return _Math.acos(cos);

    },

}

export { _Math };