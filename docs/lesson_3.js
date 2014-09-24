
//--------------------------------
//   3 - test
//--------------------------------
var world = new OIMO.World();
world.worldscale(10);
world.gravity = new OIMO.Vec3(0, 0, 0);
var v3d = new V3D.View();
v3d.initLight();
var bodys = [];
var bones = [];
var joints = [];
var meshs = [];
var lines = [];


var ToRad = Math.PI / 180;
var ToDeg = 180 / Math.PI;

var points = {
	p01 : [0,0,0],// origin
    p02 : [1.118,0,0],// origin 2
    p03 : [1.338,0.449,0],
    p04 : [0.443,0.897,0],
    p05 : [0.897,-0.443,0],
    p06 : [-2.342,-1.522,0],
    p07 : [-2.796,-0.183,0],
    p08 : [-3.892,3.051,0],
    p09 : [-6.958,4.552,0],
    p10 : [-2.622,2.429,0],
    p11 : [-4.132,-0.634,0]
}
var links = {
	//l01 : ['p01', 'p02'],
	l02 : ['p02', 'p03'],
	l03 : ['p03', 'p04'],
	l04 : ['p04', 'p01'],
	l05 : ['p01', 'p05'],
	l06 : ['p05', 'p06'],
	l07 : ['p06', 'p07'],
	l08 : ['p07', 'p08'],
	l09 : ['p08', 'p09'],
	l10 : ['p08', 'p10'],
	l11 : ['p10', 'p11'],
	l12 : ['p11', 'p04']
}
var n = 0, p, d, l, o0, o1;
var obj = {type:'sphere', size:[1, 1, 1], move:true, noSleep:true, world:world };
for(var key in points ){
    p = points[key];
    points[key] = [p[0]*10, p[1]*10, 0];
    obj.pos = points[key];
    obj.name = 'p'+ n;
    bodys[n] = new OIMO.Body(obj);
    meshs[n] = v3d.add(obj);
    n++
}
n=0;
for(var key in links ){
    l = links[key];
    d = distance(points[l[0]], points[l[1]]);
    o0 = (l[0].substring(1))-1;
    o1 = (l[1].substring(1))-1;
    bones[n] = new THREE.Mesh(v3d.geos.box, v3d.mats.box );
    bones[n].scale.set(1,1,d);
    if(n==7) bones[n].position.z=-d*0.5;
    else bones[n].position.z=d*0.5;
    meshs[o0].add( bones[n] );
    meshs[o0].lookAt(meshs[o1].position);
    n++;
}

var i = bodys.length;
while (i--){
    bodys[i].setQuaternion(meshs[i].quaternion);
}


//obj={type:"jointHinge", axe1:[0,1,0], axe2:[0,1,0] }

joints[0] = new OIMO.Link({type:"jointHinge", axe1:[0,1,0], axe2:[0,1,0], body1:'p1', body2:'p2', pos1 : [0,0,0], pos2:[11.18,0,0], min:1, max:20, world:world });


//console.log(meshs[0].rotation.y*ToDeg)

function distance(p1, p2)
{
    var x = p2[0]-p1[0];
    var y = p2[1]-p1[1];
    var z = p2[2]-p1[2];
    var d = Math.sqrt(x*x + y*y + z*z);
    if(d<=0)d=0.1;
    return d;
}

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
    world.step();

    var mesh, body;
    var i = bodys.length;
    while (i--){
        body = bodys[i];
        mesh = meshs[i];

        if(i==1){
            mesh.rotation.y +=0.01;
            body.setQuaternion(mesh.quaternion);
            console.log(body.name)

        }else{
            mesh.position.copy(body.getPosition());
            mesh.quaternion.copy(body.getQuaternion());
        }

        
    }

    // oimo stat display
    document.getElementById("info").innerHTML = world.performance.show();
}