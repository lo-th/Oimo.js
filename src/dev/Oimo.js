/**
 * OimoPhysics DEV 1.1.0a
 * @author Saharan / http://el-ement.com/
 * 
 * Oimo.js 2014
 * @author LoTh / http://3dflashlo.wordpress.com/
 */
 
var OIMO = { REVISION: 'DEV.1.1.1a' };

OIMO.SHAPE_SPHERE = 0x1;
OIMO.SHAPE_BOX = 0x2;

OIMO.WORLD_SCALE = 100;
OIMO.INV_SCALE = 0.01;

OIMO.TO_RAD = Math.PI / 180;

OIMO.nextID = 0;

var OIMO_ARRAY_TYPE;
if(!OIMO_ARRAY_TYPE) { OIMO_ARRAY_TYPE = (typeof Float32Array !== 'undefined') ? Float32Array : Array; }