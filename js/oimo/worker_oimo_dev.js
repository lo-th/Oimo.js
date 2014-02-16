/**
 * Oimo.js and Worker for three.js 2014
 * @author LoTh / http://3dflashlo.wordpress.com/
 * 
 * OimoPhysics DEV 1.1.0a
 * @author Saharan / http://el-ement.com/
 * @Copyright (c) 2012-2013 EL-EMENT saharan
 */

//---------------------------------------------------
//   OimoPhysics use international system units
//   0.1 to 10 meters max for dynamique body
//   size and position x100 for three.js
//---------------------------------------------------

'use strict';
//importScripts('../../build/Oimo.min.js');
importScripts('../../build/Oimo.js');
importScripts('demos.js');

importScripts('vehicle/car.js');
importScripts('vehicle/van.js');
importScripts('vehicle/ball.js');
importScripts('vehicle/player.js');

// main class
var version = "10.DEV";

// physics variable
var world;
var dt = 1/60;
var broadPhase = 2; // 1:BRUTE_FORCE, 2:SWEEP_AND_PRUNE, 3:VOLUME_TREE; 
var iterations = 8;
var Gravity = -10, newGravity = -10;

var timer, delay, timerStep, timeStart=0;
var ToRad = Math.PI / 180;

// array variable
var bodys = [];
var joints = [];
var matrix = [];
var matrixJoint = [];

var types = [], sizes = [];
var statics = [], staticTypes = [], staticSizes = [], staticMatrix = [];

var infos = new Float32Array(13);
var currentDemo = 0;
var maxDemo = 10;

// vehicle by key
var car = null;
var van = null;
var ball = null;
var player = null;

var statBegin;

var isTimout = false;
var isNeedRemove = false;
var removeTemp = {};

//--------------------------------------------------
//   WORKER MESSAGE
//--------------------------------------------------

self.onmessage = function (e) {
    var phase = e.data.tell;
    if(phase === "INITWORLD"){
        dt = e.data.dt || 1/60;
        broadPhase = e.data.broadPhase || 2;
        iterations = e.data.iterations || 8;
        newGravity = e.data.G || -10;
        createWorld();
    }
    // from editor
    if(phase === "ADD") ADD(e.data.obj);
    if(phase === "GET") GET(e.data.names);
    if(phase === "CLEAR") clearWorld();
    if(phase === "BASIC") basicStart(e.data);
    // from mouse
    if(phase === "REMOVE"){ isNeedRemove = true; removeTemp = e.data; };
    if(phase === "SHOOT") SHOOT(e.data);
    if(phase === "PUSH") PUSH(e.data);
    if(phase === "DRAG"){};
    

    if(phase === "UPDATE"){ if(isTimout) update(); else timer = setInterval(update, timerStep);  }
    if(phase === "KEY") userKey(e.data.key);
    if(phase === "PLAYERMOVE") if(player !== null)player.move(e.data.v);
    if(phase === "CAMERA") userCamera(e.data.cam);
    if(phase === "GRAVITY") newGravity = e.data.G;
    if(phase === "NEXT") initNextDemo();
    if(phase === "PREV") initPrevDemo();
    if(phase === "BONESLIST"){ 
        bonesPosition = e.data.pos; 
        bonesRotation = e.data.rot;
        startDemo();
    }
}

//--------------------------------------------------
//   ADD SOMETING ON FLY
//--------------------------------------------------

var ADD = function(data){
    if( typeof data.type === 'array' || data.type instanceof Array ){//___ Compound object
        addRigid(data, true);
    } else {
        // joint
        if(data.type.substring(0,5) === 'joint'){
            addJoint(data);
        // object
        } else {
            addRigid(data, true);
        }
    }
}

var GET = function(names){
    var selects = {};
    var name, i, j = names.length;
    while(j--){
        name = names[j];
        i = bodys.length;
        while(i--) if(bodys[i].name === name) selects[name] = bodys[i];
        i = joints.length;
        while(i--) if(joints[i].name === name) selects[name] = joints[i];
    }
    self.postMessage({tell:"SET", selects:selects});
}

var CONTROL = function(data){
    switch(data.type){
        case 'car': car = new Car(data.pos, data.config || [10,0.5,0.5 , 10,4,0.5]); break;
        case 'van': van = new Van(data.pos); break;
        case 'ball': ball = new Ball(data.pos, 2 ); break;
        //case 'droid': ball = new Ball(data.pos, 2, 'droid'); break;
    }
}

//--------------------------------------------------
//   SHOOT SOME BULLETS
//--------------------------------------------------

var SHOOT = function(data){
    var target = data.target.map(function(x) { return x * OIMO.INV_SCALE; });
    var bullet = addRigid(data.obj, true);

    var position = new OIMO.Vec3();
    //var position = new OIMO.Vec3(data.obj.pos[0], data.obj.pos[1], data.obj.pos[2]);
    var force = new OIMO.Vec3(target[0],target[1], target[2]);
    bullet.applyImpulse(position,force)

}

var PUSH = function(data){
    var target = data.target.map(function(x) { return x * OIMO.INV_SCALE; });
    var position = new OIMO.Vec3();
    //var position = new OIMO.Vec3(data.obj.pos[0], data.obj.pos[1], data.obj.pos[2]);
    var force = new OIMO.Vec3(target[0],target[1], target[2]);
    bodys[data.n].applyImpulse(position,force)
}

//--------------------------------------------------
//   REMOVE SOMETING ON FLY
//--------------------------------------------------

var REMOVE = function(data){
    var n = data.n
    if(data.type.substring(0,5) === 'joint'){
        world.removeJoint(joints[n]);
        joints.splice(n,1);
        matrixJoint.splice(n,1);
    }else {
        world.removeRigidBody(bodys[n]);
        bodys.splice(n,1);
        matrix.splice(n,1);
    }
    self.postMessage(removeTemp);
    isNeedRemove=false;
    removeTemp = {};
}

//--------------------------------------------------
//   WORLD UPDATE
//--------------------------------------------------

var maxBody, maxJoint;

var update = function(){

    if(isNeedRemove) REMOVE(removeTemp); 
    if(isTimout) timeStart = Date.now();

    world.step();
    
    var i;
    var wakeup = false;

    if(Gravity!==newGravity){
        Gravity = newGravity;
        world.gravity = new OIMO.Vec3(0, Gravity, 0);
        wakeup = true;
    }

    // body info
    i =  bodys.length;
    while (i--) {
        if( wakeup ) bodys[i].awake();
        matrix[i] = bodys[i].getMatrix();
    }

    // joint info
    i = joints.length;
    while (i--) {
        matrixJoint[i] = joints[i].getMatrix();
    }
   
    worldInfo();

    self.postMessage({tell:"RUN", infos:infos, matrix:matrix, matrixJoint:matrixJoint });

    if(isTimout){
        delay = timerStep - (Date.now()-timeStart);
        timer = setTimeout(update, delay);
    }

}

//--------------------------------------------------
//   GET BONES STUCTURE
//--------------------------------------------------

var bonesPosition;
var bonesRotation;

var getBonesInfo = function(name){
    self.postMessage({tell:"GETBONES", name:name })
}

//--------------------------------------------------
//   USER CAMERA
//--------------------------------------------------

var userCamera = function(cam){
    if(ball !== null ){
        ball.Phi(cam[1]);
    }
}

//--------------------------------------------------
//   USER KEY
//--------------------------------------------------

var userKey = function(key){
    if(van !== null ){
        van.update((key[0]===1 ? 1 : 0) + (key[1]===1 ? -1 : 0), (key[2]===1 ? -1 : 0) + (key[3]===1 ? 1 : 0));
        if(key[5]===1)van.move(0,2,0);
    }
    if(car !== null ){
        car.update((key[0]===1 ? 1 : 0) + (key[1]===1 ? -1 : 0), (key[2]===1 ? -1 : 0) + (key[3]===1 ? 1 : 0));
        if(key[5]===1)car.move(0,2,0);
    }
    if(ball !== null ){
        ball.update(key[0], key[1], key[2], key[3]);
    }
}

//--------------------------------------------------
//   OIMO WORLD init
//--------------------------------------------------

var createWorld = function(){

    world = new OIMO.World( dt, broadPhase, iterations );

    timerStep = dt * 1000;
    world.gravity = new OIMO.Vec3(0, Gravity, 0);
    
    resetArray();
    lookIfNeedInfo();

}

//--------------------------------------------------
//   CLEAR WORLD AND ALL OBJECT
//--------------------------------------------------
  
var clearWorld = function(){

    if(isTimout)clearTimeout(timer);
    else clearInterval(timer);

    world.clear();
    // Clear control object
    if(car !== null ) car = null;
    if(van !== null ) van = null;
    if(ball !== null ) ball = null;
    if(player !== null ) player = null;

    resetArray();
    // Clear three object
    self.postMessage({tell:"CLEAR"});

}

var resetArray = function (){

    types.length = 0;
    sizes.length = 0;

    staticTypes.length = 0;
    staticSizes.length = 0;
    staticMatrix.length = 0;

    bodys.length = 0;
    joints.length = 0;
    statics.length = 0;

    // sending array
    matrix.length = 0;
    matrixJoint.length = 0;

}

//--------------------------------------------------
//   INIT WORLD FOR EDITOR
//--------------------------------------------------

var basicStart = function(data){
    
    isTimout = data.timer || false;

    if(data.G || data.G===0){
        Gravity = data.G;
        newGravity = Gravity;
        world.gravity = new OIMO.Vec3(0, Gravity, 0);
        self.postMessage({tell:"GRAVITY", G:Gravity});
    }

    if(data.iteration){
        iterations = data.iteration;
        world.numIterations = iterations;
    }

    if(data.timestep){
        dt = data.timestep;
        world.timeStep = dt;
        timerStep = dt * 1000;
    }

    if(data.broadphase){
        if(data.broadphase !== broadPhase){
            broadPhase = data.broadphase;
            switch(data.broadphase){
                case 1: case 'brute': world.broadPhase = new OIMO.BruteForceBroadPhase(); break;
                case 2: case 'sweep': default : world.broadPhase = new OIMO.SAPBroadPhase(); break;    
                case 3: case 'tree' : world.broadPhase = new OIMO.DBVTBroadPhase(); break;
            }
        }
    }

    self.postMessage({tell:"INITSTATIC", types:staticTypes, sizes:staticSizes, matrix:staticMatrix });
    self.postMessage({tell:"INIT", types:types, sizes:sizes, demo:-1, joints:joints.length });
}

//--------------------------------------------------
//    DEMO INIT
//--------------------------------------------------

var initNextDemo = function(){
    clearWorld();
    currentDemo ++;
    if(currentDemo === maxDemo)currentDemo=0;
    lookIfNeedInfo();
}

var initPrevDemo = function(){
    clearWorld();
    currentDemo --;
    if(currentDemo < 0) currentDemo=maxDemo-1;
    lookIfNeedInfo();
}

var lookIfNeedInfo = function(){
    if(currentDemo===6) getBonesInfo('sila');
    else startDemo();
}

var startDemo = function(){

    // start new demo
    eval("demo"+currentDemo)();

    // start engine
    self.postMessage({tell:"INITSTATIC", types:staticTypes, sizes:staticSizes, matrix:staticMatrix });
    self.postMessage({tell:"INIT", types:types, sizes:sizes, demo:currentDemo, joints:joints.length });

}

//--------------------------------------------------
//    BASIC OBJECT
//--------------------------------------------------

var addRigid = function(obj, OO){

    var notNeedSendToTHREE = OO || false;
    var move = obj.move || false;
    var s = obj.size || [1,1,1];
    var sendType = obj.type || "box";

    if( typeof obj.type === 'string' || obj.type instanceof String ){
        var t = obj.type;
        if( t === 'column') {s[0] = s[0]*2; s[2] = s[2]*2; obj.size = s; }
        if ( t==="sphere"  || t==="wheel" || t==="wheelinv" || t==="nball" || t==="gyro" || t==="vanwheel" || t==="droid") obj.type = "sphere";
        else obj.type = "box";
    }

    obj.world = world;
    var b = new OIMO.Body(obj);

    if(move){
        bodys.push(b.body);
        if(!notNeedSendToTHREE){
            types.push(sendType);
            sizes.push([s[0], s[1], s[2]]);
        }
    } else {
        statics.push(b.body);
        if(!notNeedSendToTHREE){
            staticTypes.push(t);
            staticSizes.push([s[0], s[1], s[2]]);
            staticMatrix.push(b.body.getMatrix());
        }
    }
    return b.body;

}

//--------------------------------------------------
//    BASIC JOINT
//--------------------------------------------------

var addJoint = function(obj){

    obj.world = world;
    var j = new OIMO.Link(obj);
    if(obj.type === "jointDistance" || obj.show )joints.push(j.joint);
    return j.joint;

}

//--------------------------------------------------
//   WORLD INFO
//--------------------------------------------------

var worldInfo = function(){

    infos[0] = world.broadPhase.types;
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
    infos[11] = world.performance.fpsint;

}