var g1, g2, b1, b2;

function demo() {

    cam ( 90, 20, 100 );

    world = new OIMO.World({ info:true });

    g1 = add({ size:[50, 10, 20], pos:[0,-5,12], rot:[0,0,-1], density:1, restitution:0.4 });
    g2 = add({ size:[50, 10, 20], pos:[0,-5,-12], rot:[0,0,1], density:1, restitution:0.6 });

    // basic geometry body
    b1 = add({ type:'sphere', size:[1], pos:[0,60,12], move:true, restitution:0.4 });
    b2 = add({ type:'sphere', size:[1], pos:[0,20,-12], move:true, restitution:0.6 });

    // world internal loop
    world.postLoop = postLoop;
    world.play();

};

function contact () {

    var cA = world.getContact( g1, b1 );
    var cB = world.getContact( g2, b2 );

    if( cA ){ 
        switchMat( b1.mesh, 'contact' );
        if( !cA.close ) sound.play( 'hit' ); 
    } else switchMat( b1.mesh, 'move' );  

    if( cB ){ 
        switchMat( b2.mesh, 'contact' );
        if( !cB.close ) sound.play( 'hit' ); 
    } else switchMat( b2.mesh, 'move' );
        
}

function postLoop () {

    bodys.forEach( function ( b, id ) {

        if( b.type === 1 ){

            m = b.mesh;
            if( m.position.y < -10 ) b.resetPosition( 0, randInt(20,100),m.position.z>0? 11:-11 );
            
        }

    });

    contact();

    editor.tell( world.getInfo() );

}