// three var
var v3d = new V3D.View();
var meshs = [];
var grounds = [];

// oimo var
var world = new OIMO.World(1/60, 2, 8);
var bodys = [];
var type=1;
var infos = document.getElementById("info");

OIMO.WORLD_SCALE = 10;
OIMO.INV_SCALE = 0.1;
populate(1);

setInterval(updateOimoPhysics, 1000/60);
loop();


function loop() {
    requestAnimationFrame( loop );
    //updateOimoPhysics();
    v3d.render();
}

function clearMesh(){
    var i=meshs.length;
    while (i--) v3d.scene.remove(meshs[i]);
    i = grounds.length;
    while (i--) v3d.scene.remove(grounds[i]);
    grounds = [];
    meshs = [];
}

function populate(n) {
    var obj;
    var max = 100;

    if(n===1) type = 1
    else if(n===2) type = 2;
    else if(n===3) type = 3;
    else if(n===4) type = 4;

    // reset old
    clearMesh();
    world.clear();
    bodys=[];

    obj = {size:[400, 40, 390], pos:[0,-20,0], world:world}
    //add ground
    var ground = new OIMO.Body(obj);
    ground[0] = v3d.add(obj);

    //add object
    var x, y, z, w, h, d;
    var i = max;

    while (i--){
        if(type===4) t = Math.floor(Math.random()*3)+1;
        else t = type;
        x = -100 + Math.random()*200;
        z = -100 + Math.random()*200;
        y = 100 + Math.random()*1000;
        w = 10 + Math.random()*10;
        h = 10 + Math.random()*10;
        d = 10 + Math.random()*10;

        if(t===1) obj = {type:'sphere', size:[w*0.5, w*0.5, w*0.5], pos:[x,y,z], move:true, world:world};
        if(t===2) obj = {type:'box', size:[w,h,d], pos:[x,y,z], move:true, world:world};
        if(t===3) obj = {type:'cylinder', size:[w,h,w, w,h,w, w,h,w, w,h,w], pos:[x,y,z, 0,0,0, 0,0,0, 0,0,0], rot:[0,0,0, 0,45,0, 0,22.5,0, 0,-22.5,0], move:true, world:world};
        
        bodys[i] = new OIMO.Body(obj);
        meshs[i] = v3d.add(obj);
    }
}

function updateOimoPhysics() {
    world.step();

    var x, y, z;
    var i = bodys.length;
    var mesh;
    var body; 

    while (i--){
        body = bodys[i];
        mesh = meshs[i];

        if(!body.getSleep()){

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

    infos.innerHTML = world.performance.show();
}

function gravity(g){
    nG = document.getElementById("gravity").value
    world.gravity = new OIMO.Vec3(0, nG, 0);
}