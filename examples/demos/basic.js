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

        w = Math.rand(0.1,1);
        h = Math.rand(0.1,4);
        d = Math.rand(0.1,1);

        o = {

            move:true, 
            density:1,
            pos : [ 
                Math.rand(-5,5),
                Math.rand(2,20) + ( i*h ),
                Math.rand(-5,5),
            ],
            rot : [
                Math.randInt(0,360),
                Math.randInt(0,360),
                Math.randInt(0,360),
            ]

        };

        rot = [
            Math.randInt(0,360),
            Math.randInt(0,360),
            Math.randInt(0,360),
        ];

        switch( Math.randInt(0,2) ){

            case 0 : o.type = 'sphere'; o.size = [w]; break;
            case 1 : o.type = 'box';  o.size = [w,w,d]; break;
            case 2 : o.type = 'cylinder'; o.size = [d,h,d]; break;

        }

        add( o );

    }

};

function add( o ){

    var b = world.add(o);
    var m = view.add(o);

    // ! \\ update directly mesh matrix
    b.connectMesh( m );

    bodys.push( b );
    //meshs.push( m );

}

function update () {

    world.step();

    var m;

    bodys.forEach( function ( b, id ) {

        if( b.type === 1 ){

            m = b.mesh;//meshs[id];

            if( b.sleeping ) switchMat( m, 'sleep' );
            else switchMat( m, 'move' );

            //m.position.copy( b.getPosition() );
            //m.quaternion.copy( b.getQuaternion() );

            if( m.position.y < -10 ){
                b.resetPosition( Math.rand(-5,5), 30, Math.rand(-5,5) );
            }
        }


    });

    editor.tell( world.getInfo() );

}