/**
 * Oimo.js and Worker for three.js 2014
 * @author LoTh / http://3dflashlo.wordpress.com/
 * 
 * OimoPhysics REV 1.0.0
 * @author Saharan / http://el-ement.com/
 * @Copyright (c) 2012-2013 EL-EMENT saharan
 */

//---------------------------------------------------
//   OimoPhysics use international system units
//   0.1 to 10 meters max for dynamique body
//   size and position x100 for three.js
//---------------------------------------------------

'use strict';
//importScripts('../../build/Oimo.rev.min.js');
importScripts('../../build/Oimo.rev.js');
importScripts('demos.js');

importScripts('vehicle/ball.js');
importScripts('vehicle/player.js');

// main class
var version = "10.REV";
// physics variable
var world;
var dt = 1/60;
var broadPhase = 2; // 1:BRUTE_FORCE, 2:SWEEP_AND_PRUNE; 
var iterations = 8;
var Gravity = -10, newGravity = -10;

var timer, delay, timerStep, timeStart=0;
var ToRad = Math.PI / 180;

// array rigid
var bodys = [];

var matrix = [];
var matrixJoint = [];

var types = [], sizes = [];
var statics = [], staticTypes = [], staticSizes = [], staticMatrix = [];

// array joint 
var joints = [], jointPos = [];

var infos =new Float32Array(13);
var currentDemo = 0;
var maxDemo = 8;

// Controle by key
var car = null;
var ball = null;
var player = null;

var isTimout = false;
var isNeedRemove = false;
var removeTemp = {};

//--------------------------------------------------
//   WORKER MAIN MESSAGE
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
    if(phase === "REMOVE") { isNeedRemove = true; removeTemp = e.data; }; 
    if(phase === "SHOOT") SHOOT(e.data);
    if(phase === "PUSH") PUSH(e.data);
    if(phase === "DRAG"){};

    if(phase === "UPDATE"){if(isTimout) update(); else timer = setInterval(update, timerStep);}
    if(phase === "KEY") userKey(e.data.key);
    if(phase === "CAMERA") userCamera(e.data.cam);
    if(phase === "GRAVITY") newGravity = e.data.G;
    if(phase === "PLAYERMOVE") player.move(e.data.v);
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
    if(data.pos) data.pos = rzOimo(data.pos);
    switch(data.type){
      //  case 'car': car = new Car(data.pos, data.config || [10,0.5,0.5 , 10,4,0.5]); break;
       // case 'van': van = new Van(data.pos); break;
        case 'ball': ball = new Ball(data.pos, 2 ); break;
        case 'droid': ball = new Ball(data.pos, 2, 'droid'); break;
    }
}

var rzOimo = function (ar){
    return [ar[0]*invScale, ar[1]*invScale, ar[2]*invScale];
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
    bullet.applyImpulse(position,force);
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
        //jointPos.splice(n*6,6);
    }else {
        world.removeRigidBody(bodys[n]);
        bodys.splice(n,1);
        matrix.splice(n,1);
        //sleeps.splice(n,1);
        //matrix.splice(n*12,12);
    }
    self.postMessage(removeTemp);
    isNeedRemove=false;
    removeTemp = {};
}

//--------------------------------------------------
//   WORLD UPDATE
//--------------------------------------------------

var update = function(){
    if(isNeedRemove){REMOVE(removeTemp);}
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
    i = bodys.length;
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

    self.postMessage({tell:"RUN", infos: infos, matrix:matrix, matrixJoint:matrixJoint });

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

var getBonesInfo = function (name) {
    bonesPosition = [];
    bonesRotation = [];
    self.postMessage({tell:"GETBONES", name:name })
}

//--------------------------------------------------
//   USER CAMERA
//--------------------------------------------------

var userCamera = function (cam) {
    if(ball !== null ){
        ball.Phi(cam[1]);
    }
}

//--------------------------------------------------
//   USER KEY
//--------------------------------------------------

var userKey = function (key) {
    if(ball !== null ){
        ball.update(key[0], key[1], key[2], key[3]);
    }
}

//--------------------------------------------------
//   OIMO WORLD init
//--------------------------------------------------

var createWorld = function (){

    world = new OIMO.World( dt, broadPhase, iterations);

    timerStep = dt * 1000;
    world.gravity = new OIMO.Vec3(0, Gravity, 0);

    resetArray();
    lookIfNeedInfo();

}

//--------------------------------------------------
//   CLEAR WORLD AND ALL OBJECT
//--------------------------------------------------
 
var clearWorld = function (){

    if(isTimout)clearTimeout(timer);
    else clearInterval(timer);

    world.clear();
    // Clear control object
    if(ball !== null ) ball = null;
    if(player !== null ) player = null;

    resetArray();
    // Clear three object
    self.postMessage({tell:"CLEAR"});

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
        world.iteration = iterations;
    }

    if(data.timestep){
        dt = data.timestep;
        world.timeStep = dt;
        timerStep = dt * 1000;
    }

    if(data.broadphase){
        if(data.broadphase !== broadPhase){
            broadPhase = data.broadphase;
            switch(broadPhase){
                case 1: case 'brute': world.broadPhase = new OIMO.BruteForceBroadPhase(); break;
                case 2: case 'sweep': default : world.broadPhase = new OIMO.SweepAndPruneBroadPhase(); break;
            }
        }
    }

    // ground
    if(data.ground) addRigid({type:"ground", size:[40,1,40], pos:[0,-0.5,0]});

    self.postMessage({tell:"INITSTATIC", types:staticTypes, sizes:staticSizes, matrix:staticMatrix });
    self.postMessage({tell:"INIT", types:types, sizes:sizes, demo:-1, joints:joints.length });
}

//--------------------------------------------------
//    DEMO INIT
//--------------------------------------------------

var initNextDemo = function (){
    clearWorld();
    currentDemo ++;
    if(currentDemo == maxDemo)currentDemo=0;
    lookIfNeedInfo();
}

var initPrevDemo = function (){
    clearWorld();
    currentDemo --;
    if(currentDemo < 0)currentDemo=maxDemo-1;
    lookIfNeedInfo();
}

var lookIfNeedInfo = function (){
    if(currentDemo==6){
        getBonesInfo('sila');
    } else {
        startDemo();
    }
}

var resetArray = function (){
    bodys.length = 0;
    types.length = 0;
    sizes.length = 0;

    statics.length = 0;
    staticTypes.length = 0;
    staticSizes.length = 0;
    staticMatrix.length = 0;

    joints.length = 0;

    // sending array
    matrix.length = 0;
    matrixJoint.length = 0;
    //sleeps.length = 0;
    jointPos.length = 0;
}

var startDemo = function (){

    if(currentDemo==0)demo0();
    else if(currentDemo==1)demo1();
    else if(currentDemo==2)demo2();
    else if(currentDemo==3)demo3();
    else if(currentDemo==4)demo4();
    else if(currentDemo==5)demo5();
    else if(currentDemo==6)demo6();
    else if(currentDemo==7)demo9();

    // start engine
    
    self.postMessage({tell:"INITSTATIC", types:staticTypes, sizes:staticSizes, matrix:staticMatrix });
    self.postMessage({tell:"INIT", types:types, sizes:sizes, demo:currentDemo, joints:joints.length });
}

//--------------------------------------------------
//    BASIC OBJECT
//--------------------------------------------------

var addRigid = function (obj, OO){

    var noNeedSendSetting = OO || false;
    var move = obj.move || false;
    var s = obj.size || [1,1,1];
    var t;
    if( typeof obj.type === 'string' || obj.type instanceof String ){
        switch(obj.type){
            case "sphere": t=1; break;
            case "box": t=2; break;
            case "ground": t=22; break;
            case "bone": t=10; break;
            case "cylinder": t=3; break;
            case "dice": t=4; break; 
            case "column": t=7; break;
            case "columnBase": t=8; break;
            case "columnTop": t=9; break;
            case "nball": t=11; break;
            case "gyro": t=12; break;
            case "droid": t=16; break;
        }
     
        if (t===1 || t===11 || t===12 || t===16) obj.type = "sphere";
        else if ( t===3 || t===7) obj.type = "cylinder";
        else obj.type = "box";
    }

    obj.world = world;
    var b = new OIMO.Body(obj);

    if(move){
        bodys.push(b.body);
        if(!noNeedSendSetting){
            types.push(t);
            sizes.push([s[0], s[1], s[2]]);
        }
    } else {
        statics.push(b.body);
        if(!noNeedSendSetting){
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

var addJoint = function (obj){

    obj.world = world;
    var j = new OIMO.Link(obj);
    if(obj.type === "jointDistance" || obj.show ) joints.push(j.joint);
    return j.joint;
}

//--------------------------------------------------
//   WORLD INFO
//--------------------------------------------------

var worldInfo = function () {

    infos[0] = world.broadPhase.types;
    infos[1] = world.numRigidBodies;
    infos[2] = world.numContacts;
    infos[3] = world.numShapes;
    infos[4] = world.numJoints;
    infos[5] = world.numIslands;
    infos[6] = world.performance.broadPhaseTime;
    infos[7] = world.performance.narrowPhaseTime ;
    infos[8] = world.performance.solvingTime;
    infos[9] = world.performance.updatingTime;
    infos[10] = world.performance.totalTime;
    infos[11] = world.performance.fpsint;

}