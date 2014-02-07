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

// main class
var version = "10.REV";
// physics variable
var world;
var dt = 1/60;

var scale = 100;
var invScale = 0.01;

var iterations = 8;
var Gravity = -10, newGravity = -10;

var timer, delay, timerStep;
var fps=0, time, time_prev=0, fpsint = 0, ms, t01;
var ToRad = Math.PI / 180;

// array rigid
var bodys = [];
var matrix = [];
var sleeps = [];
var types = [];
var sizes = [];

var statics = [], staticTypes = [], staticSizes = [], staticMatrix = [];

// array joint 
var joints = [], jointPos = [];

var infos =new Float32Array(13);
var currentDemo = 0;
var maxDemo = 7;

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
        dt = e.data.dt;
        iterations = e.data.iterations;
        newGravity = e.data.G;
        createWorld();
    }

    if(phase === "ADD") ADD(e.data.obj);
    if(phase === "GET") GET(e.data.names);
    if(phase === "REMOVE") { isNeedRemove = true; removeTemp = e.data} //REMOVE(e.data);
    if(phase === "CLEAR") clearWorld();
    if(phase === "BASIC") basicStart(e.data);

    if(phase === "UPDATE"){if(isTimout) update(); else timer = setInterval(update, timerStep);}
    if(phase === "KEY") userKey(e.data.key);
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
    // joint
    if(data.type.substring(0,5) === 'joint'){
        addJoint(data);
    // object
    } else {
        addRigid(data, true);
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
//   REMOVE SOMETING ON FLY
//--------------------------------------------------

var REMOVE = function(data){
    var n = data.n
    if(data.type.substring(0,5) === 'joint'){
        world.removeJoint(joints[n]);
        joints.splice(n,1);
        jointPos.splice(n*6,6);
    }else {
        world.removeRigidBody(bodys[n]);
        bodys.splice(n,1);
        sleeps.splice(n,1);
        matrix.splice(n*12,12);
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
    t01 = Date.now();

    world.step();

    var p1, p2, n;
    var i = bodys.length;
    var maxBody = i;
    var wakeup = false;

    if(Gravity!==newGravity){
        Gravity = newGravity;
        world.gravity = new OIMO.Vec3(0, Gravity, 0);
        wakeup = true;
    }

    while (i--) {
        if( wakeup ) bodys[i].awake();
        if( bodys[i].sleeping) sleeps[i] = 1;
        else{ 
            sleeps[i] = 0;
            matrix[i] = bodys[i].getMatrix();
        }
    }

    i = joints.length;
    var maxJoint = i;
    while (i--) {
        p1 = joints[i].anchorPosition1;
        p2 = joints[i].anchorPosition2;
        n = 6*i;
        jointPos[n+0] = p1.x*scale;
        jointPos[n+1] = p1.y*scale; 
        jointPos[n+2] = p1.z*scale; 
        jointPos[n+3] = p2.x*scale; 
        jointPos[n+4] = p2.y*scale; 
        jointPos[n+5] = p2.z*scale; 
    }

    worldInfo();

    self.postMessage({tell:"RUN", infos: infos, matrix:matrix, sleeps:sleeps, jointPos:jointPos, maxB:maxBody, maxJ:maxJoint });

    if(isTimout){
        delay = timerStep - (Date.now()-t01);
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
    if(world==null){
        world = new OIMO.World();
        world.numIterations = iterations;
        world.timeStep = dt;
        timerStep = dt * 1000;
        world.gravity = new OIMO.Vec3(0, Gravity, 0);
    }
    resetArray();
    lookIfNeedInfo();
}

//--------------------------------------------------
//   CLEAR WORLD AND ALL OBJECT
//--------------------------------------------------
 
var clearWorld = function (){
    if(isTimout)clearTimeout(timer);
    else clearInterval(timer);
    var i;
    var max = world.numRigidBodies;
    for (i = max - 1; i >= 0 ; i -- ) world.removeRigidBody(world.rigidBodies[i]);
    max = world.numJoints;
    for (i = max - 1; i >= 0 ; i -- ) world.removeJoint(world.joints[i]);
    // Clear control object
    if(ball !== null ) ball = null;

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
        world.numIterations = iterations;
    }

    if(data.timestep){
        dt = data.timestep;
        world.timeStep = dt;
        timerStep = dt * 1000;
    }

    if(data.broadphase){
        if(data.BroadPhase==="brute") world.broadphase = OIMO.BROAD_PHASE_BRUTE_FORCE;
        else world.broadphase = OIMO.BROAD_PHASE_SWEEP_AND_PRUNE;
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
    sleeps.length = 0;
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
            staticMatrix.push(b.getMatrix());
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
    joints.push(j.joint);
    return j.joint;
}

//--------------------------------------------------
//   WORLD INFO
//--------------------------------------------------

var worldInfo = function () {

    time = Date.now();
    ms = time - t01;
    if (time - 1000 > time_prev) {
        time_prev = time; fpsint = fps; fps = 0;
    } fps++;

    infos[0] = currentDemo;
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
    
    infos[11] = fpsint;
    infos[12] = ms;
}