
/**
*  2 - JOINTS _ LINK
*/

// create oimo world contains all rigidBodys and joint.
var world = new OIMO.World();

// three.js view with geometrys and materials ../js/v3d.js
var v3d = new V3D.View();

// Array to keep reference of rigidbody
var bodys = [];
// Array to keep reference of three mesh
var meshs = [];

populate(1);

// start loops
setInterval(oimoLoop, 1000/60);
renderLoop();

/* three.js render loop */
function renderLoop()
{
    requestAnimationFrame( renderLoop );
    v3d.render();
}

/* oimo loop */
function oimoLoop() 
{  
    world.step();// update world

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
                x = rand(-100,100);
                z = rand(-100,100);
                y = rand(100,1000);
                body.resetPosition(x,y,z);
            }
        } else {
            if(mesh.material.name === 'box') mesh.material = v3d.mats.sbox;
            if(mesh.material.name === 'sph') mesh.material = v3d.mats.ssph;
        }
    }
    // oimo stat display
    document.getElementById("info").innerHTML = world.performance.show();
}

/* add random object */
function populate(n) 
{
    var obj;

    //add static ground
    obj = { size:[400, 40, 390], pos:[0,-20,0], world:world }
    new OIMO.Body(obj);
    v3d.add(obj);

    //add random objects
    var x, y, z, w, h, d, t;
    var i = 100;

    while (i--){
        t = rand(1,3);
        x = rand(-100,100);
        z = rand(-100,100);
        y = rand(100,1000);
        w = rand(10,20);
        h = rand(10,20);
        d = rand(10,20);

        if(t===1) obj = { type:'sphere', size:[w*0.5, w*0.5, w*0.5], pos:[x,y,z], move:true, world:world };
        if(t===2) obj = { type:'box', size:[w,h,d], pos:[x,y,z], move:true, world:world };
        if(t===3) obj = { type:'cylinder', size:[w,h,w, w,h,w, w,h,w, w,h,w], pos:[x,y,z], rot:[0,0,0, 0,45,0, 0,22.5,0, 0,-22.5,0], move:true, world:world };
        
        bodys[i] = new OIMO.Body(obj);
        meshs[i] = v3d.add(obj);
    }
}

/* random number */
function rand(min, max, n)
{
    var r, n = n||0;
    if (min < 0) r = min + Math.random() * (Math.abs(min)+max);
    else r = min + Math.random() * max;
    return r.toFixed(n)*1;
}