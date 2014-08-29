CLEAR({timer:false, timestep:1/60, iteration:8, broadphase:2, G:-10});

function initDemo()
{
    demoName("In the box");
    // ground
    ADD({type:"ground", size:[550,300,550], pos:[0,-150,0]});
    // wall
    ADD({ type:"box", size:[450,1000,50], pos:[0,500,-250] });
    ADD({ type:"box", size:[450,1000,50], pos:[0,500, 250] });
    ADD({ type:"box", size:[50,1000,550], pos:[-250,500,0] });
    ADD({ type:"box", size:[50,1000,550], pos:[ 250,500,0] });
    
    // dynamique object
    var max = 200;
    var px, pz, t, n;
    var sx, sy, sz;

    for (var i=0; i!==max; ++i ){
        if(version=="DEV") n=2;
        else n=3;
        t = Math.floor(Math.random()*n)+1;
        px = -100+Math.random()*200;
        pz = -100+Math.random()*200;

        sx = 20+Math.random()*100;
        sy = 20+Math.random()*100;
        sz = 20+Math.random()*100;
        if(t==1) ADD({ type:"sphere", size:[sx*0.5], pos:[px,100*i,pz], move:true });
        else if(t==2) ADD({ type:"box", size:[sx,sy,sz], pos:[px,100*i,pz], move:true });
        else if(t==3) ADD({ type:"cylinder", size:[sx*0.5,sy,sx*0.5], pos:[px,100*i,pz], move:true });
    }
}