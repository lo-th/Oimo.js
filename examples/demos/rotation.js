function demo() {

    cam ( 90, 20, 100 );

    world = new OIMO.World({ info:true });

    add({ size:[50, 10, 20], pos:[0,-5,12], rot:[0,0,-1], density:1, restitution:0.5 });
    add({ size:[50, 10, 20], pos:[0,-5,-12], rot:[0,0,1], density:1, restitution:0.5 });

    // basic geometry body

    add({ type:'sphere', size:[1], pos:[0,20,12], move:true, restitution:0.5 });
    add({ type:'sphere', size:[1], pos:[0,20,-12], move:true, restitution:0.5 });

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

            if(meshs[id].position.y<-10) b.resetPosition(0,20,meshs[id].position.z>0?11:-11);
            
        }


    });

    editor.tell( world.getInfo() );

}