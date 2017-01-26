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

    var ground = world.add({size:[50, 10, 50], pos:[0,-5,0], density:1000 });

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

    bodys.push( world.add(o) );
    meshs.push( view.add(o) );

}

function update () {

    world.step();

    bodys.forEach( function ( b, id ) {

        if(b.type===1){

            if( b.sleeping ) meshs[id].material = mat.sleep;
            else meshs[id].material = mat.move;

            meshs[id].position.copy( b.getPosition() );
            meshs[id].quaternion.copy( b.getQuaternion() );

            if(meshs[id].position.y<-10){
                b.resetPosition( Math.rand(-5,5), Math.rand(10,20), Math.rand(-5,5) );
            }
        }


    });

    editor.tell( world.getInfo() );

}