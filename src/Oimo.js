/**
 * from OimoPhysics DEV 1.1.0a AS3
 * @author Saharan / http://el-ement.com/
 * 
 * to Oimo.js 2015 JAVASCRIPT
 * @author LoTh / http://lo-th.github.io/labs/
 */
 
var OIMO = { 
    REVISION: '1.2',

    // Global identification of next shape.
    // This will be incremented every time a shape is created.
    nextID : 0,

    
    BODY_DYNAMIC : 1,
    BODY_STATIC  : 2,


    // body type
    SHAPE_NULL     : 0,
    SHAPE_SPHERE   : 1,
    SHAPE_BOX      : 2,
    SHAPE_CYLINDER : 3,

    // joint type
    JOINT_NULL            : 0,
    JOINT_DISTANCE        : 1,
    JOINT_BALL_AND_SOCKET : 2,
    JOINT_HINGE           : 3,
    JOINT_WHEEL           : 4,
    JOINT_SLIDER          : 5,
    JOINT_PRISMATIC       : 6,

    // this world scale defaut is 0.1 to 10 meters max for dynamique body
    // scale all by 100 so object is between 10 to 10000 three unit.
    WORLD_SCALE : 100,
    INV_SCALE : 0.01,

    // AABB aproximation
    AABB_PROX : 0.005,

    // Math function
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

    lerp : function (a, b, percent) { return a + (b - a) * percent; },
    rand : function (a, b) { return OIMO.lerp(a, b, OIMO.random()); },
    randInt : function (a, b, n) { return OIMO.lerp(a, b, OIMO.random()).toFixed(n || 0)*1;},

    int : function(x) { return ~~x; },
    fix : function(x, n) { return x.toFixed(n || 3, 10); },

    clamp : function ( value, min, max ) { return OIMO.max( min, OIMO.min( max, value ) ); },

    degtorad : 0.0174532925199432957,
    radtodeg : 57.295779513082320876,
    PI     : 3.141592653589793,
    TwoPI  : 6.283185307179586,
    PI90   : 1.570796326794896,
    PI270  : 4.712388980384689,

    CustomError : null,

    Error : function(Class, Msg){ 
        if(OIMO.CustomError == null) console.error(Class, Msg);
        else OIMO.CustomError.innerHTML += Class + " - " + Msg + '<br>';
    }
};

var OIMO_ARRAY_TYPE;
if(!OIMO_ARRAY_TYPE) { OIMO_ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array; }

(function(w){
    var perfNow;
    var perfNowNames = ['now', 'webkitNow', 'msNow', 'mozNow'];
    if(!!w['performance']) for(var i = 0; i < perfNowNames.length; ++i){
        var n = perfNowNames[i];
        if(!!w['performance'][n]){
            perfNow = function(){return w['performance'][n]()};
            break;
        }
    }
    if(!perfNow) perfNow = Date.now;
    //w.perfNow = perfNow;
    OIMO.now = perfNow;
})(window);