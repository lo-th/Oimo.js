function demo() {

    cam ( 90, 20, 100 );

    world = new OIMO.World({ 
        timestep: 1/60, 
        iterations: 8, 
        broadphase: 2, // 1: brute force, 2: sweep & prune, 3: volume tree
        worldscale: 1, 
        random: true, 
        info:true // display statistique
    });

    

    // basic geometry body

    var i, x, y, z, s, b;

    var mx = 250;

    for( i = 0; i < mx; i++){

        x = Math.sin(i*0.025) * 40;
        y = 60 + Math.sin(i*0.5) * 15;
        z = Math.cos(i*0.025) * 40;

        add({ type:'sphere', size:[1], pos:[x, y, z], move:true });

       

        if( i > 0 ) world.add({ type:'jointHinge', body1:(i-1), body2:i, pos1:[0,-1,0], pos2:[0,1,0], collision:true });
        if( i === mx-1 ) world.add({ type:'jointHinge', body1:0, body2:mx-1, pos1:[0,-1,0], pos2:[0,1,0], collision:true });

    }

    var ground = world.add({size:[1000, 10, 1000], pos:[0,-5,0], density:1 });

    
    
    for( i = 0; i<40; i++ ){
        x = Math.rand(-50, 50);
        z = Math.rand(-50, 50);
        s = Math.rand(5, 15);
        add({ type:'box', geometry:geo.dice, size:[s,s,s], pos:[x,s*0.5,z], move:true });
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