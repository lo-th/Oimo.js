

function demo() {

    cam ( 0, 10, 40 );

    view.hideGrid();
    view.hideGroundShadow();

    world = new OIMO.World({ 
        timestep: 1/60, 
        iterations: 8, 
        broadphase: 2, // 1: brute force, 2: sweep & prune, 3: volume tree
        worldscale: 1, 
        random: true, 
        info:true, // display statistique
        gravity: [0,0,0],
    });

    add({ type:'sphere', geometry: geo.highsphere, size:[10, 10, 10], pos:[0,0,0], density:1 });

    // basic geometry body

    var i = 200, d, h, w, o;
    
    while( i-- ) {

        w = Math.rand(0.3,1);
        h = Math.rand(0.3,4);
        d = Math.rand(0.3,1);


        o = {

            move:true, 
            density:1,
            pos : [ 
                Math.rand(10,100) * ( Math.randInt(0,1) ? -1:1 ),
                Math.rand(10,100) * ( Math.randInt(0,1) ? -1:1 ),
                Math.rand(10,100) * ( Math.randInt(0,1) ? -1:1 ),
            ],
            rot : [
                Math.randInt(0,360),
                Math.randInt(0,360),
                Math.randInt(0,360),
            ]

        };

        switch( Math.randInt(0,2) ){

            case 0 : o.type = 'sphere'; o.size = [w]; break;
            case 1 : o.type = 'box';  o.size = [w,w,d]; break;
            case 2 : o.type = 'cylinder'; o.size = [d,h,d]; break;

        }

        add( o );

    }

    // world internal loop

    world.postLoop = postLoop;
    world.play();

};

function postLoop () {

    var force, m;
    var center = new THREE.Vector3();

    bodys.forEach( function ( b, id ) {

        if( b.type === 1 ){

            m = b.mesh;

            if( b.sleeping ) m.material = mat.sleep;
            else m.material = mat.move;

            force = m.position.clone().negate().normalize().multiplyScalar(0.1);
            b.applyImpulse( center, force );

        }


    });

    editor.tell( world.getInfo() );

}
