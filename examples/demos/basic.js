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

    var ground = world.add({size:[50, 10, 50], pos:[0,-5,0], density:1 });

    // basic geometry body

    var i = 200, d, h, w, o;
    
    while( i-- ) {

        w = rand(0.3,1);
        h = rand(0.3,4);
        d = rand(0.3,1);

        o = {

            move:true, 
            density:1,
            pos : [ 
                rand(-5,5),
                rand(2,10) + ( i*h ),
                rand(-5,5),
            ],
            rot : [
                randInt(0,360),
                randInt(0,360),
                randInt(0,360),
            ]

        };

        rot = [
            randInt(0,360),
            randInt(0,360),
            randInt(0,360),
        ];

        switch( randInt(0,2) ){

            case 0 : o.type = 'sphere'; o.size = [w]; break;
            case 1 : o.type = 'box';  o.size = [w,w,d]; break;
            case 2 : o.type = 'cylinder'; o.size = [d,h,d]; break;

        }

        // see main.js
        add( o );

    }


    // world internal loop

    world.postLoop = postLoop;
    world.play();

};

function postLoop () {

    //world.step();

    var m;

    bodys.forEach( function ( b, id ) {

        if( b.type === 1 ){

            m = b.mesh;

            if( b.sleeping ) switchMat( m, 'sleep' );
            else switchMat( m, 'move' );

            if( m.position.y < -10 ){
                b.resetPosition( rand(-5,5), 30, rand(-5,5) );
            }
        }

    });

    editor.tell( world.getInfo() );

}