
/**
* OIMO WORLD - basic setup
*/

// The time between each step
var timestep = 1/60;

// Algorithm used for collision
// 1: BruteForceBroadPhase  2: sweep and prune  3: dynamic bounding volume tree
// default is 2 : best speed and lower cpu use.
var boardphase = 2;

// The number of iterations for constraint solvers : default 8.
var Iterations = 8;

// calculate statistique or not
var noStat = false;

// create new oimo world contains all rigidBodys and joint.
var world = new OIMO.World( timestep, boardphase, Iterations, noStat );

// you can choose world gravity 
world.gravity = new OIMO.Vec3(0, -9.8, 0);

// Oimo Physics use international system units 0.1 to 10 meters max for dynamique body.
// for three.js i use by default *100  so object is between 10 to 10000 three unit.
world.worldscale(100);


// basic three.js view with geometrys and materials
var v3d = new V3D.View();


// create array to keep reference of rigidbody
var bodys = [];
// reference to three mesh
var meshs = [];

populate(1);

// start loops
setInterval(oimoLoop, timestep*1000);
renderLoop();

/* three.js render loop */
function renderLoop() {
    requestAnimationFrame( renderLoop );
    v3d.render();
}

function populate(n) {

    var obj;

    //add static ground
    obj = { size:[400, 40, 390], pos:[0,-20,0], world:world }
    new OIMO.Body(obj);
    v3d.add(obj);

    //add random objects
    var x, y, z, w, h, d, t;
    var i = 100;

    while (i--){
        t = Math.floor(Math.random()*3)+1;
        x = -100 + Math.random()*200;
        z = -100 + Math.random()*200;
        y = 100 + Math.random()*1000;
        w = 10 + Math.random()*10;
        h = 10 + Math.random()*10;
        d = 10 + Math.random()*10;

        if(t===1) obj = { type:'sphere', size:[w*0.5, w*0.5, w*0.5], pos:[x,y,z], move:true, world:world };
        if(t===2) obj = { type:'box', size:[w,h,d], pos:[x,y,z], move:true, world:world };
        if(t===3) obj = { type:'cylinder', size:[w,h,w, w,h,w, w,h,w, w,h,w], pos:[x,y,z, 0,0,0, 0,0,0, 0,0,0], rot:[0,0,0, 0,45,0, 0,22.5,0, 0,-22.5,0], move:true, world:world };
        
        bodys[i] = new OIMO.Body(obj);
        meshs[i] = v3d.add(obj);
    }
}

/* oimo loop */
function oimoLoop() {

    // update world
    world.step();

    var x, y, z, mesh, body;
    var i = bodys.length;

    while (i--){
        body = bodys[i];
        mesh = meshs[i];

        if(!body.getSleep()){ // if body didn't sleep

            // apply rigidbody position and rotation to mesh
            mesh.position.copy(body.getPosition());
            mesh.quaternion.copy(body.getQuaternion());

            // change material
            if(mesh.material.name === 'sbox') mesh.material = v3d.mats.box;
            if(mesh.material.name === 'ssph') mesh.material = v3d.mats.sph; 

            // reset position
            if(mesh.position.y<-100){
                x = -100 + Math.random()*200;
                z = -100 + Math.random()*200;
                y = 100 + Math.random()*1000;
                body.resetPosition(x,y,z);
            }
        } else {
            if(mesh.material.name === 'box') mesh.material = v3d.mats.sbox;
            if(mesh.material.name === 'sph') mesh.material = v3d.mats.ssph;
        }
    }

    document.getElementById("info").innerHTML = world.performance.show();
}