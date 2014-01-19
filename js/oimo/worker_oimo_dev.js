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
//importScripts('Oimo.dev.new.js');
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

var scale = 100;
var invScale = 0.01;

var iterations = 8;
var Gravity = -10, newGravity = -10;

var timer, delay, timerStep;
var fps=0, time, time_prev=0, fpsint = 0, ms, t01;
var ToRad = Math.PI / 180;

// array variable
var bodys = [];
var matrix = [];
var matrixs = [];
var sleeps = [];
var types = [];
var sizes = [];
var infos = new Float32Array(13);
var currentDemo = 0;
var maxDemo = 10;

var statics = [], staticTypes = [], staticSizes = [], staticMatrix = [];

// array joint 
var joints = [], jointPos = [];

// vehicle by key
var car = null;
var van = null;
var ball = null;
var player = null;

var statBegin;

var isTimout = false;
var isNeedRemove = false;
var removeTemp = {};

var isPlayerMove = false;
var playerSet = {};

//--------------------------------------------------
//   WORKER MESSAGE
//--------------------------------------------------

self.onmessage = function (e) {
    var phase = e.data.tell;
    if(phase === "INITWORLD"){
        dt = e.data.dt;
        iterations = e.data.iterations;
        newGravity = e.data.G;
        createWorld();
    }

    if(phase === "ADD") ADD(e.data);
    if(phase === "REMOVE"){ isNeedRemove = true; removeTemp = e.data};
    if(phase === "CLEAR") clearWorld();
    if(phase === "BASIC") basicStart(e.data);

    if(phase === "UPDATE"){ if(isTimout) update(); else timer = setInterval(update, timerStep);  }
    if(phase === "KEY") userKey(e.data.key);
    if(phase === "PLAYERMOVE"){isPlayerMove= true; playerSet = e.data;}
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
    if(data.type.substring(0,5) === 'joint'){
        if(data.pos1) data.pos1 = rzOimo(data.pos1);
        if(data.pos2) data.pos2 = rzOimo(data.pos2);
        if(data.minDistance) data.minDistance = data.minDistance*invScale;
        if(data.maxDistance) data.maxDistance = data.maxDistance*invScale;
        addJoint(data);
    } else {
        if(data.size) data.size = rzOimo(data.size);
        if(data.pos) data.pos = rzOimo(data.pos);
        addRigid(data, true);
    }
}

var CONTROL = function(data){
    if(data.pos) data.pos = rzOimo(data.pos);
    switch(data.type){
        case 'car': car = new Car(data.pos, data.config || [10,0.5,0.5 , 10,4,0.5]); break;
        case 'van': van = new Van(data.pos); break;
        case 'ball': ball = new Ball(data.pos, 2 ); break;
        //case 'droid': ball = new Ball(data.pos, 2, 'droid'); break;
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

var maxBody, maxJoint;

var update = function(){
    if(isNeedRemove){ REMOVE(removeTemp); }
    t01 = Date.now();

    world.step();
    
    var r, p, t, n;
    var p1, p2;
    var i =  bodys.length;
    maxBody = i;

    var wakeup = false;

    if(Gravity!==newGravity){
        Gravity = newGravity;
        world.gravity = new OIMO.Vec3(0, Gravity, 0);
        wakeup = true;
    }

    if(isPlayerMove && player!==null){
        player.move(playerSet.x, playerSet.y, playerSet.z, playerSet.rot); isPlayerMove = false;
    }

    while (i--) {

        if( wakeup ) bodys[i].awake();
        if( bodys[i].sleeping ){ sleeps[i] = 1; }
        else{ 
            sleeps[i] = 0;
            matrix[i] = bodys[i].getMatrix();
        }
    }

    i = joints.length;
    //var 
    maxJoint = i;
    while (i--) {
        p1 = joints[i].anchorPoint1;
        p2 = joints[i].anchorPoint2;
        n = 6*i;
        jointPos[n+0] = p1.x*scale;
        jointPos[n+1] = p1.y*scale; 
        jointPos[n+2] = p1.z*scale; 

        jointPos[n+3] = p2.x*scale; 
        jointPos[n+4] = p2.y*scale; 
        jointPos[n+5] = p2.z*scale; 
    }

   
    worldInfo();

    self.postMessage({tell:"RUN", infos:infos, matrix:matrix, sleeps:sleeps, jointPos:jointPos, maxBody:maxBody, maxJ:maxJoint })

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
//   USER PLAYER
//--------------------------------------------------

/*var playerMove = function(data){
    player.move(data.x, data.y, data.z, data.rot);
}*/


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
    if(world==null){
        world = new OIMO.World();

        //world.broadphase = OIMO.BROAD_PHASE_BRUTE_FORCE;
        //world.broadphase = OIMO.BROAD_PHASE_SWEEP_AND_PRUNE;
        //world.broadphase = OIMO.BROAD_PHASE_DYNAMIC_BOUNDING_VOLUME_TREE;
        
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
  
var clearWorld = function(){
    if(isTimout)clearTimeout(timer);
    else clearInterval(timer);
    if(world !== null) world.clear();
    // Clear control object
    if(car !== null ) car = null;
    if(van !== null ) van = null;
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
        world.numIterations = iterations;
    }

    if(data.timestep){
        dt = data.timestep;
        world.timeStep = dt;
        timerStep = dt * 1000;
    }

    if(data.broadphase){
        if(data.broadphase==="brute") world.broadphase = OIMO.BROAD_PHASE_BRUTE_FORCE;
        else if(data.broadphase==="sweep") world.broadphase = OIMO.BROAD_PHASE_SWEEP_AND_PRUNE;
        else world.broadphase = OIMO.BROAD_PHASE_DYNAMIC_BOUNDING_VOLUME_TREE;
    }

    // ground
    if(data.ground) addRigid({type:"ground", size:[40,1,40], pos:[0,-0.5,0]});

    self.postMessage({tell:"INITSTATIC", types:staticTypes, sizes:staticSizes, matrix:staticMatrix });
    self.postMessage({tell:"INIT", types:types, sizes:sizes, demo:-1, joints:joints.length });
}

//--------------------------------------------------
//    DEMO INIT
//--------------------------------------------------

var initNextDemo = function(){
    clearWorld();
    currentDemo ++;
    if(currentDemo == maxDemo)currentDemo=0;
    lookIfNeedInfo();
}

var initPrevDemo = function(){
    clearWorld();
    currentDemo --;
    if(currentDemo < 0)currentDemo=maxDemo-1;
    lookIfNeedInfo();
}

var lookIfNeedInfo = function(){
    if(currentDemo==6){
        getBonesInfo('sila');
    } else {
        startDemo();
    }
}

var resetArray = function (){
    bodys.length = 0; // = [];
    types.length = 0; // = [];
    sizes.length = 0; // = [];

    statics.length = 0; // = [];
    staticTypes.length = 0; // = [];
    staticSizes.length = 0; // = [];
    staticMatrix.length = 0; // = [];

    joints.length = 0; // = [];

    // sending array
    matrix.length = 0; // = new Array();//Float32Array(100000);// [];
    sleeps.length = 0; // = new Array();//new Float32Array(100000);//[];
    jointPos.length = 0; // = new Array();//new Float32Array(100000);//[];
}

var startDemo = function(){

    if(currentDemo==0)demo0();
    else if(currentDemo==1)demo1();
    else if(currentDemo==2)demo2();
    else if(currentDemo==3)demo3();
    else if(currentDemo==4)demo4();
    else if(currentDemo==5)demo5();
    else if(currentDemo==6)demo6();
    else if(currentDemo==7)demo7();
    else if(currentDemo==8)demo8();
    else if(currentDemo==9)demo9();

    // start engine

    self.postMessage({tell:"INITSTATIC", types:staticTypes, sizes:staticSizes, matrix:staticMatrix });
    self.postMessage({tell:"INIT", types:types, sizes:sizes, demo:currentDemo, joints:joints.length });

}

//--------------------------------------------------
//    BASIC OBJECT
//--------------------------------------------------


var addRigid = function(obj, OO){
    var notSaveSetting = OO || false;

    var sc = obj.sc || new OIMO.ShapeConfig();
    if(obj.config){
        sc.density = obj.config[0] || 1;
        sc.friction = obj.config[1] || 0.4;
        sc.restitution = obj.config[2] || 0.2;
        sc.belongsTo = obj.config[3] || 1;
        sc.collidesWith = obj.config[4] || 0xffffffff;
    }
    if(obj.configPos){
        sc.relativePosition.set(obj.configPos[0], obj.configPos[1], obj.configPos[2]);
    }
    if(obj.configRot){
        sc.relativeRotation = OIMO.EulerToMatrix(obj.configRot[0], obj.configRot[1], obj.configRot[2]);
    }
    var name = obj.name || '';
    var p = obj.pos || [0,0,0];
    var s = obj.size || [1,1,1];
    var rot = obj.rot || [];
    var r = OIMO.EulerToAxis(rot[0] || 0, rot[1] || 0, rot[2] || 0);
    var move = obj.move || false;
    var noSleep  = obj.noSleep || false; 
    var noAdjust = obj.noAdjust || false;

    var shape, t;
    //var shape2 = null;
    switch(obj.type){
        case "sphere": shape=new OIMO.SphereShape(sc, s[0]); t=1; break;
        case "box": shape=new OIMO.BoxShape(sc, s[0], s[1], s[2]); t=2; break;
        case "ground": shape=new OIMO.BoxShape(sc, s[0], s[1], s[2]); t=22; break;
        case "bone": shape=new OIMO.BoxShape(sc, s[0], s[1], s[2]); t=10; break;
        case "cylinder": shape = new OIMO.SphereShape(sc, s[0] ); t=3; break;// fake cylinder
        //case "cylinder": shape=new OIMO.CylinderShape(sc, s[0], s[1] ); t=3; break;
        case "dice": shape=new OIMO.BoxShape(sc, s[0], s[1], s[2]); t=4; break;  
        case "wheel": shape = new OIMO.SphereShape(sc, s[0] ); t=5; break;// fake cylinder
        case "wheelinv": shape = new OIMO.SphereShape(sc, s[0] ); t=6; break;// fake cylinder

        case "column": shape = new OIMO.BoxShape(sc, s[0]*2, s[1], s[2]*2);  t=7; break;// fake cylinder
        case "columnBase": shape = new OIMO.BoxShape(sc, s[0], s[1], s[2]); t=8; break;
        case "columnTop": shape = new OIMO.BoxShape(sc, s[0], s[1], s[2]); t=9; break;
        case "nball": shape = new OIMO.SphereShape(sc, s[0]); t=11; break;
        case "gyro": shape = new OIMO.SphereShape(sc, s[0]); t=12; break;
        case "carBody": shape=new OIMO.BoxShape(sc, s[0], s[1], s[2]); t=13; break;

        case "vanBody": shape=new OIMO.BoxShape(sc, s[0], s[1], s[2]); t=14; break;
        case "vanwheel": shape = new OIMO.SphereShape(sc, s[0] ); t=15; break;// fake cylinder

       // case "droid": shape=new OIMO.BoxShape(sc, s[0], s[1], s[2]); t=16; break;// droid
        case "droid": shape=new OIMO.SphereShape(sc, s[0]); t=16; break;// droid
        

    }
    var body = new OIMO.RigidBody(p[0], p[1], p[2], r[0], r[1], r[2], r[3]);
    
    body.addShape(shape);

    if(move){
        if(noAdjust)body.setupMass(0x1, false);
        else body.setupMass(0x1, true);
        bodys.push(body);
        if(!notSaveSetting){
            types.push(t);
            sizes.push([s[0]*scale, s[1]*scale, s[2]*scale]);
        }
        if(noSleep) body.allowSleep = false;
        else body.allowSleep = true;
    } else {
        body.setupMass(0x2);
        statics.push(body);
        if(!notSaveSetting){
            staticTypes.push(t);
            staticSizes.push([s[0]*scale, s[1]*scale, s[2]*scale]);
            var sr = body.rotation.elements;
            var sp = body.position;
            //staticMatrix.push([sr.e00, sr.e01, sr.e02, (sp.x*scale).toFixed(2), sr.e10, sr.e11, sr.e12, (sp.y*scale).toFixed(2), sr.e20, sr.e21, sr.e22, (sp.z*scale).toFixed(2)]);
            staticMatrix.push([sr[0], sr[1], sr[2], (sp.x*scale).toFixed(2), sr[3], sr[4], sr[5], (sp.y*scale).toFixed(2), sr[6], sr[7], sr[8], (sp.z*scale).toFixed(2)]);
        }
    }
    body.name = name;
    world.addRigidBody(body);
    return body;
}

var getBodyByName = function(name){
    var i;
    var body;
    for(i=0; i!==bodys.length; i++){
        if(bodys[i].name === name ) body = bodys[i];
    }
    for(i=0; i!==statics.length; i++){
        if(statics[i].name === name ) body = statics[i];
    }
    return body;
}

//--------------------------------------------------
//    BASIC JOINT
//--------------------------------------------------

var addJoint = function(obj){
    var jc = new OIMO.JointConfig();
    var axis1 = obj.axis1 || [1,0,0];
    var axis2 = obj.axis2 || [1,0,0];
    var pos1 = obj.pos1 || [0,0,0];
    var pos2 = obj.pos2 || [0,0,0];
    var minDistance = 0.01;
    var maxDistance = obj.maxDistance || 0.1;
    var lowerAngleLimit = obj.lowerAngle || 1;
    var upperAngleLimit = obj.upperAngle || 0;
    var lowerTranslation = obj.lowerTranslation || 1;
    var upperTranslation = obj.upperTranslation || 0;
    var type = obj.type || "hinge";
    var limit = obj.limit || null;
    var spring = obj.spring || null;
    var collision = obj.collision || false;
    jc.allowCollision=collision;
    jc.localAxis1.init(axis1[0], axis1[1], axis1[2]);
    jc.localAxis2.init(axis2[0], axis2[1], axis2[2]);
    jc.localAnchorPoint1.init(pos1[0], pos1[1], pos1[2]);
    jc.localAnchorPoint2.init(pos2[0], pos2[1], pos2[2]);
    if (typeof obj.body1 == 'string' || obj.body1 instanceof String) obj.body1 = getBodyByName(obj.body1);
    if (typeof obj.body2 == 'string' || obj.body2 instanceof String) obj.body2 = getBodyByName(obj.body2);
    jc.body1 = obj.body1;
    jc.body2 = obj.body2;
    var joint;
    switch(type){
        case "distance": case "jointDistance": joint = new OIMO.DistanceJoint(jc, minDistance, maxDistance); break;
        case "hinge": case "jointHinge": joint = new OIMO.HingeJoint(jc, lowerAngleLimit, upperAngleLimit); break;
        case "prisme": case "jointPrisme": joint = new OIMO.PrismaticJoint(jc, lowerTranslation, upperTranslation); break;
        case "slide": case "jointSlide": joint = new OIMO.SliderJoint(jc, lowerTranslation, upperTranslation); break;
        case "ball": case "jointBall": joint = new OIMO.BallAndSocketJoint(jc); break;
        case "wheel": case "jointWheel": 
            joint = new OIMO.WheelJoint(jc);  
            if(limit !== null) 
                joint.rotationalLimitMotor1.setLimit(limit[0], limit[1]);
            if(spring !== null) 
                joint.rotationalLimitMotor1.setSpring(spring[0], spring[1]);
        break;
    }
    //joint.limitMotor.setSpring(100, 0.9); // soften the joint
    world.addJoint(joint);
    joints.push(joint);
    return joint;
}

//--------------------------------------------------
//   WORLD INFO
//--------------------------------------------------

var worldInfo = function(){

    time = Date.now();
    ms = time - t01;
    if (time - 1000 > time_prev) {
        time_prev = time; fpsint = fps; fps = 0;
    } fps++;

    infos[0] = 0;//currentDemo;
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
    infos[12] = ms;
}