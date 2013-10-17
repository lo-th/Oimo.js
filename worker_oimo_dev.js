importScripts('js/oimo/runtime_min.js');
importScripts('js/oimo/oimo_dev.js');
//importScripts('js/oimo/oimo_dev_min.js');
importScripts('js/oimo/demo.js');

/*
OimoPhysics alpha dev 10
@author Saharan _ http://el-ement.com
@link https://github.com/saharan/OimoPhysics
...
Compact engine for three.js by Loth

OimoPhysics use international system units
0.1 to 10 meters max for dynamique body

size and position x100 for three.js
*/
var version = "10.DEV";
// main class
var World, RigidBody, BroadPhase, Shape, ShapeConfig, BoxShape, SphereShape
var JointConfig, HingeJoint, WheelJoint, DistanceJoint, Vec3, Quat;

// physics variable
var scale = 100;
var world;
var bodys;
var N = 100;
var dt = 1/60;
var iterations = 8;
var info = "info test";
var fps=0, time, time_prev=0, fpsint = 0;
var timeint = 0;

var matrix;
var sleeps;
var types;
var sizes;
var infos =[];
var currentDemo = 0;
//var isDemo = false;
//var matrix = new Float32Array(N*12);

self.onmessage = function (e) {
    var phase = e.data.tell;
    if(phase === "INITWORLD"){
        dt = e.data.dt;
        iterations = e.data.iterations;
        initClass();
    }

    else if(phase === "UPDATE"){
        update();
    } 

    else if(phase === "CLEAR"){
        clearWorld();
    }
}

function update() {
    world.step();

    var t01 = Date.now();
    var r, p, t, n;
    var max = bodys.length;

    for ( var i = 0; i !== max ; ++i ) {
        if( bodys[i].sleeping) sleeps[i] = 1;
        else{ 
            sleeps[i] = 0;
            r = bodys[i].rotation;
            p = bodys[i].position;
            n = 12*i;
            matrix[n+0]=r.e00; matrix[n+1]=r.e01; matrix[n+2]=r.e02; matrix[n+3]=p.x;
            matrix[n+4]=r.e10; matrix[n+5]=r.e11; matrix[n+6]=r.e12; matrix[n+7]=p.y;
            matrix[n+8]=r.e20; matrix[n+9]=r.e21; matrix[n+10]=r.e22; matrix[n+11]=p.z;
        }
    }
    var t02 = Date.now();

    timeint = t02-t01;
    fpsUpdate();
    worldInfo();

    self.postMessage({tell:"RUN", infos: infos, matrix:matrix, sleeps:sleeps  })
}

function worldInfo() {
    infos[0] = world.numRigidBodies;
    infos[1] = world.numContacts;
    infos[2] = world.broadPhase.numPairChecks;
    infos[3] = world.numContactPoints;
    infos[4] = world.numIslands;
    infos[5] = world.performance.broadPhaseTime;
    infos[6] = world.performance.narrowPhaseTime ;
    infos[7] = world.performance.solvingTime;
    infos[8] = world.performance.updatingTime;
    infos[9] = world.performance.totalTime;
    infos[10] = fpsint;
    infos[11] = timeint;
}

function fpsUpdate(){
    time = Date.now();
    if (time - 1000 > time_prev) {
        time_prev = time; fpsint = fps; fps = 0;
    } fps++;
}


function initClass(){
    with(joo.classLoader) {
        import_("com.elementdev.oimo.physics.OimoPhysics");
        complete(function(imports){with(imports){
            World = com.elementdev.oimo.physics.dynamics.World;
            RigidBody = com.elementdev.oimo.physics.dynamics.RigidBody;
            BroadPhase = com.elementdev.oimo.physics.collision.broadphase.BroadPhase;
            // Shape
            Shape = com.elementdev.oimo.physics.collision.shape.Shape;
            ShapeConfig = com.elementdev.oimo.physics.collision.shape.ShapeConfig;
            BoxShape = com.elementdev.oimo.physics.collision.shape.BoxShape;
            SphereShape = com.elementdev.oimo.physics.collision.shape.SphereShape;
            // Joint
            JointConfig = com.elementdev.oimo.physics.constraint.joint.JointConfig;
            HingeJoint = com.elementdev.oimo.physics.constraint.joint.HingeJoint;
            WheelJoint = com.elementdev.oimo.physics.constraint.joint.WheelJoint;
            DistanceJoint = com.elementdev.oimo.physics.constraint.joint.DistanceJoint;
            // Math
            Vec3 = com.elementdev.oimo.math.Vec3;
            Quat = com.elementdev.oimo.math.Quat;

            initWorld();
        }});
    }
}

function initWorld(){
    if(world==null){
        world = new World();

        //world.broadphase = BroadPhase.BROAD_PHASE_BRUTE_FORCE;
        //world.broadphase = BroadPhase.BROAD_PHASE_SWEEP_AND_PRUNE;
        //world.broadphase = BroadPhase.BROAD_PHASE_DYNAMIC_BOUNDING_VOLUME_TREE;
        
        world.numIterations = iterations;
        world.timeStep = dt;
        world.gravity = new Vec3(0, -10, 0);
    }
    //startOimoTest();

    sleeps = [];
    infos = [];

    initDemo();
}

function initDemo(){

    bodys = [];
    types = [];
    sizes = [];
    matrix = [];

    demo01();
    self.postMessage({tell:"INIT", types:types, sizes:sizes });
}

function clearWorld(){
    if(world != null) world.clear();
    bodys = [];
    sleeps = [];
    types = [];
    infos = [];
    self.postMessage({tell:"CLEAR"});
}

//--------------------------------------------------
//    BASIC OBJECT
//--------------------------------------------------

function addRigid(obj){
    var p = obj.pos || [0,0,0];
    var s = obj.size || [1,1,1];
    var r = obj.rot || [0,0,0];
    var move = obj.move || false;
    var sc = obj.sc || new ShapeConfig();
    var t, i; 
    var shape;
    switch(obj.type){
        case "box": shape=new BoxShape(sc, s[0], s[1], s[2]); t=2; break;
        case "sphere": shape=new SphereShape(sc, s[0]); t=1; break;
    }
    var body = new RigidBody(p[0], p[1], p[2], 0, 0, 0, 0);
    body.addShape(shape);
    if(!move)body.setupMass(0x2);
    else{ 
        body.setupMass(0x1);
        bodys.push(body);
        types.push(t);
        sizes.push([s[0]*scale, s[1]*scale, s[2]*scale]);
    }
    world.addRigidBody(body);
}
