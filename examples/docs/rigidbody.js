var box, mbox;

function demo() {

    cam ( 0, 20, 40 );

    world = new OIMO.World();
    world.add({ size:[50, 10, 50], pos:[0,-5,0] }); // ground

    var options = {
        type:'box',
        size:[10, 10, 10],
        pos:[0,20,0],
        density:1,
        move:true
    }

    box = world.add( options );
    mbox = view.add( options ); // three mesh

};

function update () {

    world.step();
    mbox.position.copy( box.getPosition() );
    mbox.quaternion.copy( box.getQuaternion() );

}