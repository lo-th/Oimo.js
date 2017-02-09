var paddle, rpaddle;

function demo() {

    cam ( 0, 30, 40 );

    world = new OIMO.World({ info:true });

    var ground = world.add({size:[50, 10, 50], pos:[0,-5,0], density:1000 });

    paddle = add({ type:'box', size:[50, 2, 2], pos:[0,1,0], density:1, move:true, kinematic:true, material:'kinematic' });
    rpaddle = view.add({ type:'box', pos:[0,1,0], material:'hide' });

    // basic geometry body

    var i = 60, d, h, w, x, z;
    
    while( i-- ) {

        w = Math.rand(1,3);
        h = Math.rand(1,3);
        d = Math.rand(1,3);
        x = Math.rand(-10,10);
        z = Math.rand(-10,10);

        add( { type:'box', size:[w,h,d], pos:[x,h*0.5,z], move:true } );

    }

    // world internal loop
    world.postLoop = postLoop;
    world.play();

};

function update () {
    rpaddle.rotation.y += 0.01;
}

function postLoop () {

    paddle.setQuaternion( rpaddle.quaternion );

    var m;

    bodys.forEach( function ( b, id ) {

        if( b.type === 1 ){

            m = b.mesh;

            if(!b.isKinematic){
                if( b.sleeping ) switchMat( m, 'sleep' );
                else switchMat( m, 'move' );
            }

            if( m.position.y < -10 ){
                b.resetPosition( Math.rand(-5,5), Math.rand(10,20), Math.rand(-5,5) );
            }
        }


    });

    
    editor.tell( world.getInfo() );


}