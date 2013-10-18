// basic demo

function demo0(n, t){

    var sc = new ShapeConfig();
    sc.density = 1;
    sc.friction = 0.5;
    sc.restitution = 0.5;

    // ground
    addRigid({type:"box", size:[20,10,20], pos:[0,-5,0], sc:sc});

    // wall
    addRigid({type:"box", size:[5,10,1], pos:[0,5,-2.5], sc:sc});
    addRigid({type:"box", size:[5,10,1], pos:[0,5, 2.5], sc:sc});
    addRigid({type:"box", size:[1,10,5], pos:[-2.5,5,0], sc:sc});
    addRigid({type:"box", size:[1,10,5], pos:[ 2.5,5,0], sc:sc});

    // add 66 dynamique object
    var body, px, pz, t;
    var sx, sy, sz;
    for (var i=0; i!==66; ++i ){
        if(version=="10.DEV")t = Math.floor(Math.random()*2)+1;
        else t = Math.floor(Math.random()*3)+1;
        px = -1+Math.random()*2;
        pz = -1+Math.random()*2;

        sx = 0.2+Math.random()*1;
        sy = 0.2+Math.random()*1;
        sz = 0.2+Math.random()*1;
        if(t==1) addRigid({type:"sphere", size:[sx*0.5], pos:[px,30+i,pz], sc:sc, move:true});
        else if(t==2) addRigid({type:"box", size:[sx,sy,sz], pos:[px,30+i,pz], sc:sc, move:true});
        else if(t==3) addRigid({type:"cylinder", size:[sx*0.5,sy,sx*0.5], pos:[px,30+i,pz], sc:sc, move:true});
    }
}

// dice land

function demo1(){
    var sc = new ShapeConfig();
    sc.density = 1;
    sc.friction = 0.5;
    sc.restitution = 0.5;

    // ground
    addRigid({type:"box", size:[20,10,20], pos:[0,-5,0], sc:sc});

    var body, px, pz, s;
    for (var i=0; i!==40; ++i ){
        s = 0.1+Math.random();
        sc.density = s*10;
        px = -1+Math.random()*2;
        pz = -1+Math.random()*2;
        addRigid({type:"dice", size:[s,s,s], pos:[px,1.1*i,pz], sc:sc, move:true});
    }
}






// billard 
// 2.54m * 1.27m  h 0.76m
// 16 billes  diametre 57.2mm pour 162g
// r = 0.0286;

function demo2(){
    //currentDemo = 2;
    var sc = new ShapeConfig();
    sc.density = 1;
    sc.friction = 0.5;
    sc.restitution = 0.5;

    // ground
    addRigid({type:"box", size:[25.4,7.6,12.7], pos:[0,-3.8,0], sc:sc});

    // add dynamique object
    sc.density = 0.0162;
    var body, px, pz, type = 1;
    for (var i=0; i!==16; ++i ){
        px = -2+Math.random()*4;
        pz = -2+Math.random()*4;
        addRigid({type:"sphere", size:[0.286], pos:[px,2+i,pz], sc:sc, move:true});
    }
}