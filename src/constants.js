/*
 * A list of constants built-in for
 * the physics engine.
 */

export var REVISION = '1.0.9';

// BroadPhase
export var BR_NULL = 0;
export var BR_BRUTE_FORCE = 1;
export var BR_SWEEP_AND_PRUNE = 2;
export var BR_BOUNDING_VOLUME_TREE = 3;

// Body type
export var BODY_NULL = 0;
export var BODY_DYNAMIC = 1;
export var BODY_STATIC = 2;
export var BODY_KINEMATIC = 3;
export var BODY_GHOST = 4;

// Shape type
export var SHAPE_NULL = 0;
export var SHAPE_SPHERE = 1;
export var SHAPE_BOX = 2;
export var SHAPE_CYLINDER = 3;
export var SHAPE_PLANE = 4;
export var SHAPE_PARTICLE = 5;
export var SHAPE_TETRA = 6;

// Joint type
export var JOINT_NULL = 0;
export var JOINT_DISTANCE = 1;
export var JOINT_BALL_AND_SOCKET = 2;
export var JOINT_HINGE = 3;
export var JOINT_WHEEL = 4;
export var JOINT_SLIDER = 5;
export var JOINT_PRISMATIC = 6;

// AABB aproximation
export var AABB_PROX = 0.005;