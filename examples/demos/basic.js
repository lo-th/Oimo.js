

function demo() {

    cam ( 0, 10, 40 );

    world = new OIMO.World({ timestep:1/60, iterations:8, broadphase:2, worldscale:1, random:true, info:true });

    var ground = world.add({size:[50, 10, 50], pos:[0,-5,0], density:1000 });

    // basic geometry body

    var i = 200, pos = [], s, d, rot = [0,0,90];
    
    while( i-- ) {

        h = Math.rand(0.1,4);
        d = Math.rand(0.1,1);

        pos[0] = Math.rand(-5,5); 
        pos[1] = Math.rand(2,20) + ( i*h );
        pos[2] = Math.rand(-5,5);

        switch( Math.randInt(0,2) ){

            case 0 : add({ type:'sphere',   size:[d,d,d], pos:pos, move:true, density:d }); break;
            case 1 : add({ type:'box',      size:[d,d,d], pos:pos, move:true, density:d }); break;
            case 2 : add({ type:'cylinder', size:[d,h,d], rot:rot, pos:pos, move:true, density:d }); break;

        }

    }

};

function add( o ){

    bodys.push( world.add(o) );
    meshs.push( view.add(o) );

}

function update () {

    world.step();

    bodys.forEach( function ( b, id ) {

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


    });

    editor.tell( world.getInfo() );

}
