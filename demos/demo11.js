CLEAR({timer:false, timestep:1/60, iteration:8, broadphase:2, G:-10});

function initDemo()
{
    demoName("Blobs");

    CAM(90,80,4000);

    ADD({type:"blob", resolution:25, subtract:12, strength:0.8, size:[1000,1000,1000], pos:[0,0,0]});
    // ground
    ADD({ type:"ground", size:[2000,200,2000], pos:[0,-1000,0] });
    // wall
    ADD({ type:"box", size:[2000,2000,100], pos:[0,0,-950] });
    ADD({ type:"box", size:[2000,2000,100], pos:[0,0,950] });
    ADD({ type:"box", size:[100,2000,1800], pos:[-950,0,0] });
    ADD({ type:"box", size:[100,2000,1800], pos:[ 950,0,0] });

    var px, pz
    for (var i=0; i!==20; ++i ){
        px = -300+Math.random()*600;
        pz = -300+Math.random()*600;
        ADD({ type:"sphere", size:[100], pos:[px,1000+(i*110),pz], move:true, hide:true });
    }

}