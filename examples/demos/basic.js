

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

    var i = 200, pos = [], s, d, h, w, rot = [0,0,90], o;
    
    while( i-- ) {

        w = Math.rand(0.1,1);
        h = Math.rand(0.1,4);
        d = Math.rand(0.1,1);

        pos[0] = Math.rand(-5,5); 
        pos[1] = Math.rand(2,20) + ( i*h );
        pos[2] = Math.rand(-5,5);

        o = { type:'', size:[ d, d, d ], pos:pos, rot:rot, move:true, density:d };

        switch( Math.randInt(0,2) ){

            case 0 : o.type = 'sphere'; break;
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
                x = Math.rand(-5,5);
                z = Math.rand(-5,5);
                y = Math.rand(10,20);
                b.resetPosition(x,y,z);
            }
        }


    });

    editor.tell( world.getInfo() );

}
