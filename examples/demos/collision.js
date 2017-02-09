function demo() {

    cam ( 0, 10, 40 );

    world = new OIMO.World({ 
        timestep: 1/60, 
        iterations: 8, 
        broadphase: 2, // 1: brute force, 2: sweep & prune, 3: volume tree
        worldscale: 1, 
        random: true, 
        info:true // display statistique
    });


    // just a try !!
    // plane is only with sphere 

    var ground = world.add({type:'plane', pos:[0,0,0], density:1, friction:0.9, restitution:0.1 });
    //var ground = world.add({type:'box', pos:[0,-5,0], size:[50, 10, 50], density:1 })

    // basic geometry body

    var i = 500, d, h, w, o;
    
    while( i-- ) {

        w = Math.rand(0.5,3);
        h = Math.rand(0.1,4);
        d = Math.rand(0.1,1);

        o = {

            move:true, 
            density:1,
            pos : [ 
                Math.rand(-5,5),
                Math.rand(2,20) + ( i*(w*2) ),
                Math.rand(-5,5),
            ],
            rot : [
                Math.randInt(0,360),
                Math.randInt(0,360),
                Math.randInt(0,360),
            ],
            friction:0.9, restitution:0.1

        };

        rot = [
            Math.randInt(0,360),
            Math.randInt(0,360),
            Math.randInt(0,360),
        ];

        switch( 0 ){

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

    var m;

    bodys.forEach( function ( b, id ) {

        if( b.type === 1 ){

            m = b.mesh;

            if( b.sleeping ) switchMat( m, 'sleep' );
            else switchMat( m, 'move' );

            if( m.position.y < -30 ){
                b.resetPosition( Math.rand(-5,5), 30, Math.rand(-5,5) );
            }
        }


    });

    editor.tell( world.getInfo() );

}