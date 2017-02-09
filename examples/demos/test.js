var g1, g2, b1, b2;

function demo() {

    cam ( 90, 20, 100 );

    world = new OIMO.World({ info:true });

    g1 = add({ size:[50, 10, 50], pos:[0,-5,0] });

    // basic geometry body
    b1 = add({ type:'box', size:[10,10,10], pos:[0,5,0], move:true, material:'statique' });
    b2 = add({ type:'box', size:[1,1,1], pos:[0,5,0], move:true, material:'statique' });

    // world internal loop
    world.postLoop = postLoop;
    world.play();

};

function postLoop () {

    bodys.forEach( function ( b, id ) {

        if( b.type === 1 ){

            m = b.mesh;
            if( m.position.y < -10 ) b.resetPosition( 0, randInt(20,100), 0 );
            
        }

    });

    editor.tell( world.getInfo() );

}