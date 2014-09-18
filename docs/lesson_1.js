
/**
*  1 - RIGIDBODYS
*/

// create oimo world contains all rigidBodys and joint.
var world = new OIMO.World();

// three.js view with geometrys and materials ../js/v3d.js
var v3d = new V3D.View();
v3d.initLight();

// Array to keep reference of rigidbody
var bodys = [];
// Array to keep reference of three mesh
var meshs = [];

// OIMO.Body is the main class of rigidbody
// it use object to define propriety 
var obj = {};
// the world where object is /!\ important
obj.world = world;
// the type of body : box sphere or (cylinder in rev)
obj.type = 'box';
// the start position
obj.pos = [0,200,0];
// the rotation in degree
obj.rot = [0,45,0];
// the size
obj.size = [100,100,50];
// is dynamic or static 
obj.move = true;
// the physics config
obj.config = [
    1, // The density of the shape.
    0.4, // The coefficient of friction of the shape.
    0.2, // The coefficient of restitution of the shape.
    1, // The bits of the collision groups to which the shape belongs.
    0xffffffff // The bits of the collision groups with which the shape collides.
];
// you can choose unique name for each rigidbody
obj.name = 'myName';


// finaly add body 
bodys[0] = new OIMO.Body(obj);
// add Three display mesh
meshs[0] = v3d.add(obj);



//add simple static ground
obj = { size:[400, 40, 390], pos:[0,-20,0], world:world, flat:true }
new OIMO.Body(obj);
v3d.add(obj);


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

    // get rigidbody position and rotation and apply to mesh 
    meshs[0].position.copy(bodys[0].getPosition());
    meshs[0].quaternion.copy(bodys[0].getQuaternion());

    // oimo stat display
    document.getElementById("info").innerHTML = world.performance.show();
}