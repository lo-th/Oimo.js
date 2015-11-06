/**
 * from OimoPhysics DEV 1.1.0a
 * @author Saharan / http://el-ement.com/
 * 
 * to Oimo.js 2015
 * @author LoTh / http://3dflashlo.wordpress.com/
 */
 
var OIMO = { REVISION: '1.2' };


// body type
OIMO.SHAPE_NULL     = 0;
OIMO.SHAPE_SPHERE   = 1;
OIMO.SHAPE_BOX      = 2;
OIMO.SHAPE_CYLINDER = 3;

// joint type
OIMO.JOINT_NULL            = 0;
OIMO.JOINT_DISTANCE        = 1;
OIMO.JOINT_BALL_AND_SOCKET = 2;
OIMO.JOINT_HINGE           = 3;
OIMO.JOINT_WHEEL           = 4;
OIMO.JOINT_SLIDER          = 5;
OIMO.JOINT_PRISMATIC       = 6;


OIMO.WORLD_SCALE = 100;
OIMO.INV_SCALE = 0.01;

OIMO.TO_RAD = 0.0174532925199432957;

OIMO.AABB_PROX = 0.005;

OIMO.sqrt = Math.sqrt;
OIMO.abs = Math.abs;
OIMO.floor = Math.floor;
OIMO.cos = Math.cos;
OIMO.sin = Math.sin;
OIMO.acos = Math.acos;
OIMO.asin = Math.asin;
OIMO.atan2 = Math.atan2;
OIMO.round = Math.round;
OIMO.pow = Math.pow;
OIMO.max = Math.max;
OIMO.min = Math.min;
OIMO.random = Math.random;

OIMO.lerp = function (a, b, percent) { return a + (b - a) * percent; }
OIMO.rand = function (a, b) { return OIMO.lerp(a, b, OIMO.random()); }
OIMO.randInt = function (a, b, n) { return OIMO.lerp(a, b, OIMO.random()).toFixed(n || 0)*1;}

//OIMO.int = function(x) { return parseInt(x, 10); };
OIMO.int = function(x) { return ~~x; };
OIMO.fix = function(x, n) { n = n || 3; return x.toFixed(n)*1; };

OIMO.CustomError = null;
OIMO.Error = function(Class, Msg){
    if(OIMO.CustomError == null) console.error(Class, Msg);
    else OIMO.CustomError.innerHTML += Class + " - " + Msg + '<br>';

};

OIMO.degtorad = 0.0174532925199432957;
OIMO.radtodeg = 57.295779513082320876;

OIMO.PI     = 3.141592653589793;
OIMO.TwoPI  = 6.283185307179586;
OIMO.PI90   = 1.570796326794896;
OIMO.PI270  = 4.712388980384689;

// Global identification of next shape.
// This will be incremented every time a shape is created.
OIMO.nextID = 0;

var OIMO_ARRAY_TYPE;
if(!OIMO_ARRAY_TYPE) { OIMO_ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array; }