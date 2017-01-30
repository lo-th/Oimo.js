var box, mbox, base;

function demo() {

    cam ( 0, 20, 40 );

    world = new OIMO.World();
    base = world.add({ size:[10, 10, 10], pos:[0,20,0] }); // ground
    var o = { type:'box', size:[10, 10, 10],  pos:[0,0,0], density:1, move:true };
    box = world.add( o );
    mbox = view.add( o ); // three mesh

    world.add({
         type:'jointHinge',
         body1:base, 
         body2:box,
         pos1:[0,-5,0],
         pos2:[0,5,0]
    });

};

function update () {

    world.step();
    mbox.position.copy( box.getPosition() );
    mbox.quaternion.copy( box.getQuaternion() );

}