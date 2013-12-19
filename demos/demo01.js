CLEAR({ground:false});

function initDemo(){
    // wall
    ADD({ type:"box", size:[450,1000,50], pos:[0,500,-250] });
    ADD({ type:"box", size:[450,1000,50], pos:[0,500, 250] });
    ADD({ type:"box", size:[50,1000,550], pos:[-250,500,0] });
    ADD({ type:"box", size:[50,1000,550], pos:[ 250,500,0] });
    // bottom
    ADD({type:"box", size:[550,400,550], pos:[0,-200,0]});

    // add dynamique object
    var px, pz, t, n;
    var sx, sy, sz;

    for (var i=0; i!==100; ++i ){
        if(version=="DEV") n=2;
        else n=3;
        t = Math.floor(Math.random()*n)+1;
        px = -100+Math.random()*200;
        pz = -100+Math.random()*200;

        sx = 20+Math.random()*100;
        sy = 20+Math.random()*100;
        sz = 20+Math.random()*100;
        if(t==1) ADD({ type:"sphere", size:[sx*0.5], pos:[px,500+i,pz], move:true });
        else if(t==2) ADD({ type:"box", size:[sx,sy,sz], pos:[px,500+i,pz], move:true });
        else if(t==3) ADD({ type:"cylinder", size:[sx*0.5,sy,sx*0.5], pos:[px,500+i,pz], move:true });
    }
}