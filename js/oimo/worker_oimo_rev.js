/*
OimoPhysics alpha dev 10
Copyright (c) 2012-2013 EL-EMENT saharan

@author Saharan _ http://el-ement.com
@link https://github.com/saharan/OimoPhysics
...
oimo.js worker for three.js 
@author Loth _ http://3dflashlo.wordpress.com/

OimoPhysics use international system units
0.1 to 10 meters max for dynamique body
size and position x100 for three.js
*/
'use strict';
importScripts('runtime_min.js');
importScripts('oimo_rev_min.js');
importScripts('demos.js');

importScripts('vehicle/ball.js');

// main class
var version = "10.REV";
var World, RigidBody, BruteForceBroadPhase, SweepAndPruneBroadPhase;
var Shape, ShapeConfig, BoxShape, SphereShape, CylinderShape;
var Joint, JointConfig, HingeJoint, Hinge2Joint, BallJoint, DistanceJoint;
var Vec3, Quat, Mat33, Mat44;

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
var bodys;
var matrix;
var sleeps;
var types;
var sizes;

var statics;
var staticTypes, staticSizes, staticMatrix;

// array joint 
var joints;
var jointPos;

var infos =new Float32Array(13);
var currentDemo = 0;
var maxDemo = 7;

// Controle by key
var car = null;
var ball = null;

var isTimout = false;

//--------------------------------------------------
//   WORKER MAIN MESSAGE
//--------------------------------------------------

self.onmessage = function (e) {
    var phase = e.data.tell;
    if(phase === "INITWORLD"){
        dt = e.data.dt;
        iterations = e.data.iterations;
        newGravity = e.data.G;
        initClass();
    }

    if(phase === "ADD") ADD(e.data);
    if(phase === "REMOVE") REMOVE(e.data);

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

var ADD = function(e){

}

//--------------------------------------------------
//   REMOVE SOMETING ON FLY
//--------------------------------------------------

var REMOVE = function(e){

}

//--------------------------------------------------
//   WORLD UPDATE
//--------------------------------------------------

var update = function(){
    t01 = Date.now();

    world.step();

    var r, p, t, n;
    var p1, p2;
    var i = bodys.length;
    var maxBody = i;
    var wakeup = false;

    if(Gravity!==newGravity){
        Gravity = newGravity;
        world.gravity = new Vec3(0, Gravity, 0);
        wakeup = true;
    }

    while (i--) {
        if( wakeup ) bodys[i].awake();
        if( bodys[i].sleeping) sleeps[i] = 1;
        else{ 
            sleeps[i] = 0;
            r = bodys[i].rotation;
            p = bodys[i].position;
            n = 12*i;

            matrix[n+0]=r.e00; matrix[n+1]=r.e01; matrix[n+2]=r.e02; matrix[n+3]=(p.x*scale).toFixed(2);
            matrix[n+4]=r.e10; matrix[n+5]=r.e11; matrix[n+6]=r.e12; matrix[n+7]=(p.y*scale).toFixed(2);
            matrix[n+8]=r.e20; matrix[n+9]=r.e21; matrix[n+10]=r.e22; matrix[n+11]=(p.z*scale).toFixed(2);
        }
    }

    i = joints.length;
    var maxJoint = i;
    while (i--) {
        p1 = joints[i].anchorPosition1;
        p2 = joints[i].anchorPosition2;
        n = 6*i;
        jointPos[n+0] =(p1.x*scale).toFixed(2);
        jointPos[n+1] =(p1.y*scale).toFixed(2); 
        jointPos[n+2] =(p1.z*scale).toFixed(2); 
        jointPos[n+3] =(p2.x*scale).toFixed(2); 
        jointPos[n+4] =(p2.y*scale).toFixed(2); 
        jointPos[n+5] =(p2.z*scale).toFixed(2); 
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
//   OIMO WORLD init/creat/clear
//--------------------------------------------------

var initClass = function (){
    joo.classLoader.import_("com.element.oimo.physics.OimoPhysics");
    joo.classLoader.complete(function(imports){
        World = com.element.oimo.physics.dynamics.World;
        RigidBody = com.element.oimo.physics.dynamics.RigidBody;
        BruteForceBroadPhase = com.element.oimo.physics.collision.broad.BruteForceBroadPhase;
        SweepAndPruneBroadPhase = com.element.oimo.physics.collision.broad.SweepAndPruneBroadPhase;
        // Shape
        Shape = com.element.oimo.physics.collision.shape.Shape;
        ShapeConfig = com.element.oimo.physics.collision.shape.ShapeConfig;
        BoxShape = com.element.oimo.physics.collision.shape.BoxShape;
        SphereShape = com.element.oimo.physics.collision.shape.SphereShape;
        CylinderShape = com.element.oimo.physics.collision.shape.CylinderShape;
        // Joint
        Joint = com.element.oimo.physics.constraint.joint.Joint;
        JointConfig = com.element.oimo.physics.constraint.joint.JointConfig;
        HingeJoint = com.element.oimo.physics.constraint.joint.HingeJoint;
        Hinge2Joint = com.element.oimo.physics.constraint.joint.Hinge2Joint;
        BallJoint = com.element.oimo.physics.constraint.joint.BallJoint;
        DistanceJoint = com.element.oimo.physics.constraint.joint.DistanceJoint;
        // Math
        Vec3 = com.element.oimo.math.Vec3;
        Quat = com.element.oimo.math.Quat;
        Mat33 = com.element.oimo.math.Mat33;
        Mat44 = com.element.oimo.math.Mat44;

        createWorld();
    });
}

var createWorld = function (){
    if(world==null){
        world = new World();
        world.numIterations = iterations;
        world.timeStep = dt;
        timerStep = dt * 1000;
        world.gravity = new Vec3(0, Gravity, 0);
    }
    lookIfNeedInfo();
}

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
    // Clear three object
    self.postMessage({tell:"CLEAR"});
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

var startDemo = function (){
    bodys = [];
    types = [];
    sizes = [];

    statics = [];
    staticTypes = [];
    staticSizes = [];
    staticMatrix = [];

    joints = [];

    if(currentDemo==0)demo0();
    else if(currentDemo==1)demo1();
    else if(currentDemo==2)demo2();
    else if(currentDemo==3)demo3();
    else if(currentDemo==4)demo4();
    else if(currentDemo==5)demo5();
    else if(currentDemo==6)demo6();

    var N = bodys.length;
    matrix = new Float32Array(N*12);
    sleeps = new Uint8Array(N);

    N = joints.length;
    jointPos = new Float32Array(N*6);
    
    self.postMessage({tell:"INITSTATIC", types:staticTypes, sizes:staticSizes, matrix:staticMatrix });
    self.postMessage({tell:"INIT", types:types, sizes:sizes, demo:currentDemo, joints:N });
}

//--------------------------------------------------
//    BASIC OBJECT
//--------------------------------------------------

var addRigid = function (obj){
    var sc = obj.sc || new ShapeConfig();
    if(obj.config){
        sc.density = obj.config[0] || 1;
        sc.friction = obj.config[1] || 0.5;
        sc.restitution = obj.config[2] || 0.5;
    }
    if(obj.configPos){
        sc.position.set(obj.configPos[0], obj.configPos[1], obj.configPos[2]);
    }
    if(obj.configRot){
        sc.rotation = eulerToMatrix(obj.configRot[0], obj.configRot[1], obj.configRot[2]);
    }

    var p = obj.pos || [0,0,0];
    var s = obj.size || [1,1,1];
    var r = obj.rot || [0,0,0,0];
    var move = obj.move || false;
    var rotation = obj.rotation || null;
    
    var t; 
    var shape;
    //var sleeping = obj.sleep || false;
    var noSleep  = obj.noSleep || false; 

    // rotation x y z in radian
    if(rotation !== null ) r = eulerToAxisAngle(rotation[0], rotation[1], rotation[2]);
    else r[0] = r[0]*ToRad;

    sc.position.init(p[0], p[1], p[2]);
    sc.rotation.init();
    switch(obj.type){
        case "sphere": shape=new SphereShape(s[0], sc); t=1; break;
        case "box": shape=new BoxShape(s[0], s[1], s[2], sc); t=2; break;
        case "bone": shape=new BoxShape(s[0], s[1], s[2], sc); t=10; break;
        case "cylinder": shape=new CylinderShape(s[0], s[1], sc); t=3; break;
        case "dice": shape=new BoxShape(s[0], s[1], s[2], sc); t=4; break;

        case "column": shape = new CylinderShape(s[0], s[1], sc); t=7; break;
        case "columnBase": shape = new BoxShape(s[0], s[1], s[2], sc); t=8; break;
        case "columnTop": shape = new BoxShape(s[0], s[1], s[2], sc); t=9; break;
        case "nball": shape = new SphereShape(s[0], sc); t=11; break;
        case "gyro": shape = new SphereShape(s[0], sc); t=12; break;
    }
    var body = new RigidBody(r[0], r[1], r[2], r[3]);
    body.addShape(shape);
    
    if(move){ 
        body.setupMass(0x0);
        bodys.push(body);
        types.push(t);
        sizes.push([s[0]*scale, s[1]*scale, s[2]*scale]);
        //body.sleeping = sleeping;
        //if(sleeping)body.sleep();
        if(noSleep)body.allowSleep = false;
        else body.allowSleep = true;
    }else{ 
        body.setupMass(0x1);
        statics.push(body);
        staticTypes.push(t);
        staticSizes.push([s[0]*scale, s[1]*scale, s[2]*scale]);
        var sr = body.rotation;
        var sp = body.position;
        staticMatrix.push([sr.e00, sr.e01, sr.e02, (sp.x*scale).toFixed(2), sr.e10, sr.e11, sr.e12, (sp.y*scale).toFixed(2), sr.e20, sr.e21, sr.e22, (sp.z*scale).toFixed(2)]);
    }
    world.addRigidBody(body);
    return body;
}

//--------------------------------------------------
//    BASIC JOINT
//--------------------------------------------------

var addJoint = function (obj){
    var jc = new JointConfig();
    var axis1 = obj.axis1 || [1,0,0];
    var axis2 = obj.axis2 || [1,0,0];
    var pos1 = obj.pos1 || [0,0,0];
    var pos2 = obj.pos2 || [0,0,0];
    var minDistance = obj.minDistance || 0.01;
    var maxDistance = obj.maxDistance || 0.1;
    var type = obj.type || "hinge";
    var collision = obj.collision || false;
    jc.allowCollision=collision;
    jc.localAxis1.init(axis1[0], axis1[1], axis1[2]);
    jc.localAxis2.init(axis2[0], axis2[1], axis2[2]);
    jc.localRelativeAnchorPosition1.init(pos1[0], pos1[1], pos1[2]);
    jc.localRelativeAnchorPosition2.init(pos2[0], pos2[1], pos2[2]);

    var joint;
    switch(type){
        case "distance": joint = new DistanceJoint(obj.body1, obj.body2, maxDistance,jc); break;
        case "hinge": joint = new HingeJoint(obj.body1, obj.body2, jc); break;
    }
    
    //joint.limitMotor.setSpring(1, 10); // soften the joint
    world.addJoint(joint);
    joints.push(joint);
    return joint;
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

//--------------------------------------------------
//   MATH
//--------------------------------------------------

var eulerToAxisAngle = function( x, y, z ){
    // Assuming the angles are in radians.
    var c1 = Math.cos(y*0.5);//heading
    var s1 = Math.sin(y*0.5);
    var c2 = Math.cos(z*0.5);//altitude
    var s2 = Math.sin(z*0.5);
    var c3 = Math.cos(x*0.5);//bank
    var s3 = Math.sin(x*0.5);
    var c1c2 = c1*c2;
    var s1s2 = s1*s2;
    var w =c1c2*c3 - s1s2*s3;
    var x =c1c2*s3 + s1s2*c3;
    var y =s1*c2*c3 + c1*s2*s3;
    var z =c1*s2*c3 - s1*c2*s3;
    var angle = 2 * Math.acos(w);
    var norm = x*x+y*y+z*z;
    if (norm < 0.001) {
        x=1;
        y=z=0;
    } else {
        norm = Math.sqrt(norm);
        x /= norm;
        y /= norm;
        z /= norm;
    }
    return [angle, x, y, z];
}

var matrixToEuler = function(mtx){
    var x, y, z;
    // Assuming the angles are in radians.
    if (mtx.e10 > 0.998) { // singularity at north pole
        y = Math.atan2(mtx.e02,mtx.e22);
        z = Math.PI/2;
        x = 0;
    } else if (mtx.e10 < -0.998) { // singularity at south pole
        y = Math.atan2(mtx.e02,mtx.e22);
        z = -Math.PI/2;
        x = 0;
    } else {
        y = Math.atan2(-mtx.e20,mtx.e00);
        x = Math.atan2(-mtx.e12,mtx.e11);
        z = Math.asin(mtx.e10);
    }
    return [x, y, z];
}

var eulerToMatrix = function( x, y, z ) {
    // Assuming the angles are in radians.
    var ch = Math.cos(y);//heading
    var sh = Math.sin(y);
    var ca = Math.cos(z);//altitude
    var sa = Math.sin(z);
    var cb = Math.cos(x);//bank
    var sb = Math.sin(x);
    var mtx = new Mat33();
    mtx.e00 = ch * ca;
    mtx.e01 = sh*sb - ch*sa*cb;
    mtx.e02 = ch*sa*sb + sh*cb;
    mtx.e10 = sa;
    mtx.e11 = ca*cb;
    mtx.e12 = -ca*sb;
    mtx.e20 = -sh*ca;
    mtx.e21 = sh*sa*cb + ch*sb;
    mtx.e22 = -sh*sa*sb + ch*cb;
    return mtx;
}

var getDistance3d = function(p1, p2) {
    var xd = p2[0]-p1[0];
    var yd = p2[1]-p1[1];
    var zd = p2[2]-p1[2];
    return Math.sqrt(xd*xd + yd*yd + zd*zd);
}