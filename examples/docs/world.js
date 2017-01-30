function demo() {

    cam ( 0, 20, 40 );

    world = new OIMO.World({ 
        timestep: 1/60,
        iterations: 8,
        broadphase: 2,
        worldscale: 1,
        random: true,
        info:false,
        gravity: [0,-9.8,0]
    });

};

function update () {

    world.step();

}