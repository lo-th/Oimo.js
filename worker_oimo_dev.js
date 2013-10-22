/*
OimoPhysics alpha dev 10
@author Saharan _ http://el-ement.com
@link https://github.com/saharan/OimoPhysics
...
oimo.js worker for three.js 
@author Loth _ http://3dflashlo.wordpress.com/

OimoPhysics use international system units
0.1 to 10 meters max for dynamique body
size and position x100 for three.js
*/

importScripts('js/oimo/runtime_min.js');
importScripts('js/oimo/oimo_dev_min.js');
importScripts('js/oimo/demo.js');
importScripts('js/oimo/car.js');

// main class
var version = "10.DEV";
var World, RigidBody, BroadPhase;
var Shape, ShapeConfig, BoxShape, SphereShape;
var JointConfig, HingeJoint, WheelJoint, DistanceJoint;
var Vec3, Quat;

// physics variable
var world;
var dt = 1/60;
var scale = 100;
var iterations = 8;
var Gravity = -10, newGravity = -10;

var timer, delay, timerStep;
var fps=0, time, time_prev=0, fpsint = 0;
var ToRad = Math.PI / 180;

// array variable
var bodys;
var matrix;
var sleeps;
var types;
var sizes;
var infos = new Float32Array(12);
//var infos =[]; infos.length=12;
var currentDemo = 0;
var maxDemo = 6;
// Controle by key
var car = null;
var bubulle = null;

//--------------------------------------------------
//   WORKER MESSAGE
//--------------------------------------------------

self.onmessage = function (e) {
    var phase = e.data.tell;
    if(phase === "INITWORLD"){
        dt = e.data.dt;
        iterations = e.data.iterations;
        newGravity = e.data.G;
        initClass();
    }
    else if(phase === "UPDATE")update();
    else if(phase === "KEY")userKey(e.data.key);
    else if(phase === "GRAVITY") newGravity = e.data.G;
    else if(phase === "NEXT") initNextDemo();
    else if(phase === "PREV") initPrevDemo();
}

//--------------------------------------------------
//   WORLD UPDATE
//--------------------------------------------------

function update() {
    var t01 = Date.now();

    world.step();

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

    if(Gravity!==newGravity){
        Gravity = newGravity;
        world.gravity = new Vec3(0, Gravity, 0);
        for ( var i = 0; i !== max ; ++i ) bodys[i].awake();
    }

    worldInfo();

    self.postMessage({tell:"RUN", infos: infos, matrix:matrix, sleeps:sleeps  })

    delay = timerStep - (Date.now()-t01);
    timer = setTimeout(update, delay);
}

//--------------------------------------------------
//   USER KEY
//--------------------------------------------------

function userKey(key) {
    if(currentDemo === 5){
        if(car !== null ){
            car.update((key[0]===1 ? 1 : 0) + (key[1]===1 ? -1 : 0), (key[2]===1 ? -1 : 0) + (key[3]===1 ? 1 : 0));
            if(key[5]===1)car.move(0,2,0);
        }
    }

}

//--------------------------------------------------
//   OIMO WORLD INIT
//--------------------------------------------------

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
        timerStep = dt * 1000;
        world.gravity = new Vec3(0, Gravity, 0);
    }
    initDemo();
}

function clearWorld(){
    clearTimeout(timer);
    if(world != null) world.clear();
    // Clear control object
    if(car !== null ) car = null;
    if(bubulle !== null ) bubulle = null;
    // Clear three object
    self.postMessage({tell:"CLEAR"});


}

//--------------------------------------------------
//    DEMO INIT
//--------------------------------------------------

function initNextDemo(){
    clearWorld();
    currentDemo ++;
    if(currentDemo == maxDemo)currentDemo=0;
    initDemo();
}

function initPrevDemo(){
    clearWorld();
    currentDemo --;
    if(currentDemo < 0)currentDemo=maxDemo-1;
    initDemo();
}

function initDemo(){


    bodys = [];
    types = [];
    sizes = [];

    if(currentDemo==0)demo0();
    else if(currentDemo==1)demo1();
    else if(currentDemo==2)demo2();
    else if(currentDemo==3)demo3();
    else if(currentDemo==4)demo4();
    else if(currentDemo==5)demo5();

    var N = bodys.length;
    matrix = new Float32Array(N*12);
    sleeps = new Float32Array(N);

    //matrix = []; matrix.length = N*12;
    //sleeps = []; matrix.length = N;
    
    self.postMessage({tell:"INIT", types:types, sizes:sizes, demo:currentDemo });
}

//--------------------------------------------------
//    BASIC OBJECT
//--------------------------------------------------

function addRigid(obj){
    var p = obj.pos || [0,0,0];
    var s = obj.size || [1,1,1];
    var r = obj.rot || [0,0,0,0];
    var move = obj.move || false;
    var sc = obj.sc || new ShapeConfig();
    //var alowSleeping  = obj.sleep || true; 
    //var adjustPosition = obj.adjust || true;
    var noSleep  = obj.noSleep || false; 
    var noAdjust = obj.noAdjust || false;
    //var t, i; 
    var shape, t;
    switch(obj.type){
        case "sphere": shape=new SphereShape(sc, s[0]); t=1; break;
        case "box": shape=new BoxShape(sc, s[0], s[1], s[2]); t=2; break;
        case "bone": shape=new BoxShape(sc, s[0], s[1], s[2]); t=10; break;
        case "cylinder": shape = new SphereShape(sc, s[0] ); t=3; break;// fake cylinder
        case "dice": shape=new BoxShape(sc, s[0], s[1], s[2]); t=4; break;  
        case "wheel": shape = new SphereShape(sc, s[0] ); t=5; break;// fake cylinder
        case "wheelinv": shape = new SphereShape(sc, s[0] ); t=6; break;// fake cylinder
    }
    var body = new RigidBody(p[0], p[1], p[2], r[0]*ToRad, r[1], r[2], r[3]);
    if(noSleep)body.allowSleep = false;
    else body.allowSleep = true;

    body.addShape(shape);
    //if(t===5)body.addShape(new BoxShape(sc, s[0] * 2, 0.2, 0.2));

    if(!move)body.setupMass(0x2);
    else{ 
        if(noAdjust)body.setupMass(0x1, false);
        else body.setupMass(0x1, true);
        bodys.push(body);
        types.push(t);
        sizes.push([s[0]*scale, s[1]*scale, s[2]*scale]);
    }
    world.addRigidBody(body);
    return body;
}

//--------------------------------------------------
//    BASIC JOINT
//--------------------------------------------------

function addJoint(obj){
    var jc = new JointConfig();
    var axis1 = obj.axis1 || [1,0,0];
    var axis2 = obj.axis2 || [1,0,0];
    var pos1 = obj.pos1 || [0,0,0];
    var pos2 = obj.pos2 || [0,0,0];
    var minDistance = obj.minDistance || 0.01;
    var maxDistance = obj.maxDistance || 0.1;
    var lowerAngleLimit = obj.lowerAngle || 1;
    var upperAngleLimit = obj.upperAngle || 0;
    var type = obj.type || "hinge";
    var limit = obj.limit || null;
    var spring = obj.spring || null;
    var collision = obj.collision || false;
    jc.allowCollision=collision;
    jc.localAxis1.init(axis1[0], axis1[1], axis1[2]);
    jc.localAxis2.init(axis2[0], axis2[1], axis2[2]);
    jc.localAnchorPoint1.init(pos1[0], pos1[1], pos1[2]);
    jc.localAnchorPoint2.init(pos2[0], pos2[1], pos2[2]);
    jc.body1 = obj.body1;
    jc.body2 = obj.body2;
    var joint;
    switch(type){
        case "distance": joint = new DistanceJoint(jc, minDistance, maxDistance); break;
        case "hinge": joint = new HingeJoint(jc, lowerAngleLimit, upperAngleLimit); break;
        case "wheel": 
            joint = new WheelJoint(jc);  
            if(limit !== null) 
                joint.rotationalLimitMotor1.setLimit(limit[0], limit[1]);
            if(spring !== null) 
                joint.rotationalLimitMotor1.setSpring(spring[0], spring[1]);
        break;
    }

   
    //joint.limitMotor.setSpring(100, 0.9); // soften the joint
    world.addJoint(joint);
    return joint;
}

//--------------------------------------------------
//   WORLD INFO
//--------------------------------------------------

function worldInfo() {

    time = Date.now();
    if (time - 1000 > time_prev) {
        time_prev = time; fpsint = fps; fps = 0;
    } fps++;

    infos[0] = currentDemo;
    infos[1] = world.numRigidBodies;
    infos[2] = world.numContacts;
    infos[3] = world.broadPhase.numPairChecks;
    infos[4] = world.numContactPoints;
    infos[5] = world.numIslands;
    infos[6] = world.performance.broadPhaseTime;
    infos[7] = world.performance.narrowPhaseTime ;
    infos[8] = world.performance.solvingTime;
    infos[9] = world.performance.updatingTime;
    infos[10] = world.performance.totalTime;
    infos[11] = fpsint;
}