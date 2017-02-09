

function demo() {

    cam ( 0, 30, 35 );

    world = new OIMO.World({ 
        timestep: 1/60, 
        iterations: 8, 
        broadphase: 3, // 1: brute force, 2: sweep & prune, 3: volume tree
        worldscale: 1, 
        random: true, 
        info:true, // display statistique
    });

    var ground = world.add({size:[50, 10, 50], pos:[0,-5,0], density:1 });

    // basic geometry body

    var i, j, k, pos;

    var d = 1;
    var s = 2;
    var x = 6, y = 10, z = 6;
    var m = 0.01;

    var decaleX = - ((x*0.5) * d) + (d*0.5);
    var decaleZ = - ((z*0.5) * d) + (d*0.5);

    for(k = 0; k<y; k++){
    for(j = 0; j<z; j++){
    for(i = 0; i<x; i++){
        pos = [ i*d + decaleX, (k*d + d)-0.5, j*d + decaleZ ];
        add ({ type:'box', geometry:geo.dice, size:[d-m,d-m,d-m], pos:pos, friction:0.4, restitution:0.1, move:true, sleep:0 });
        //add ({ type:'cylinder', size:[(d-m)*0.5,d-m,(d-m)*0.5], pos:pos, friction:0.4, restitution:0.1, move:true, sleep:0 });
        //add ({ type:'sphere', size:[(d-m)*0.5], pos:pos, friction:0.4, restitution:0.1, move:true, sleep:0 });
    }}}

    add({ type:'sphere', geometry: geo.highsphere, size:[s], pos:[0,100,0], move:true, density:10, friction:0.3, restitution:0.3 });

    // world internal loop
    world.postLoop = postLoop;
    world.play();

};

function postLoop () {

    var force;
    var center = new THREE.Vector3();

    bodys.forEach( function ( b, id ) {

        if( b.type === 1 ){

            m = b.mesh;

            if( b.sleeping ) m.material = mat.sleep;
            else m.material = mat.move;

            if(m.position.y<-10){
                b.resetPosition( rand(-5,5), rand(10,20), rand(-5,5) );
            }

        }


    });

    editor.tell( world.getInfo() );

}
