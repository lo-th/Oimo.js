/*   _     _   _     
    | |___| |_| |__
    | / _ \  _|    |
    |_\___/\__|_||_|
    http://3dflashlo.wordpress.com/
*/

//--------------------------------------------------
//    BASIC SHAPE
//--------------------------------------------------

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

    // add dynamique object
    var body, px, pz, t;
    var sx, sy, sz;
    for (var i=0; i!==200; ++i ){
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

//--------------------------------------------------
//    DICE FALL
//--------------------------------------------------

function demo1(){
    var sc = new ShapeConfig();
    sc.density = 1;
    sc.friction = 0.5;
    sc.restitution = 0.5;

    // ground
    addRigid({type:"box", size:[20,10,20], pos:[0,-5,0], sc:sc});
    // wall
    addRigid({type:"box", size:[20,10,1], pos:[0,5,-10], sc:sc});
    addRigid({type:"box", size:[20,10,1], pos:[0,5,10], sc:sc});
    addRigid({type:"box", size:[1,10,20], pos:[-10,5,0], sc:sc});
    addRigid({type:"box", size:[1,10,20], pos:[ 10,5,0], sc:sc});

    var body, px, pz, s;
    for (var i=0; i!==333; ++i ){
        s = 0.1+Math.random();
        sc.density = s*10;
        px = -1+Math.random()*2;
        pz = -1+Math.random()*2;
        addRigid({type:"dice", size:[s,s,s], pos:[px,1+(1.1*i),pz], sc:sc, move:true});
    }
}

//--------------------------------------------------
//    BALL POOL
//--------------------------------------------------

function demo2(){
    var sc = new ShapeConfig();
    sc.density = 1;
    sc.friction = 0.5;
    sc.restitution = 0.5;

    // ground
    //addRigid({type:"box", size:[25.4,7.6,12.7], pos:[0,-3.8,0], sc:sc});
    addRigid({type:"box", size:[20,10,20], pos:[0,-5,0], sc:sc});
    // wall
    addRigid({type:"box", size:[20,10,1], pos:[0,5,-10], sc:sc});
    addRigid({type:"box", size:[20,10,1], pos:[0,5,10], sc:sc});
    addRigid({type:"box", size:[1,10,20], pos:[-10,5,0], sc:sc});
    addRigid({type:"box", size:[1,10,20], pos:[ 10,5,0], sc:sc});

    // add dynamique object
    sc.density = 0.162;
    var body, px, pz, type = 1;
    for (var i=0; i!==333; ++i ){
        px = -2+Math.random()*4;
        pz = -2+Math.random()*4;
        addRigid({type:"sphere", size:[0.286], pos:[px,2+i,pz], sc:sc, move:true});
    }
}

//--------------------------------------------------
//    JOINT TEST
//--------------------------------------------------

function demo3(){
    var sc = new ShapeConfig();
    sc.density = 1;
    sc.friction = 0.5;
    sc.restitution = 0.5;

    var dy=0.3;
    // ground
    addRigid({type:"box", size:[20,10,20], pos:[0,-5+dy,0], sc:sc});
    // wall
    addRigid({type:"box", size:[20,10,1], pos:[0,5+dy,-10], sc:sc});
    addRigid({type:"box", size:[20,10,1], pos:[0,5+dy, 10], sc:sc});
    addRigid({type:"box", size:[1,10,20], pos:[-10,5+dy,0], sc:sc});
    addRigid({type:"box", size:[1,10,20], pos:[ 10,5+dy,0], sc:sc});

    sc.density = 10;
    sc.friction = 0.4;
    sc.restitution = 0.4;

    // add dynamique object
    dy+=1;
    var i;
    
    // bones
    var bone = [];
    for ( i = 0; i!==10; ++i){
        bone[i] = addRigid({type:"bone", size:[0.25,1,0.25], pos:[0,dy+0.5+(i*1.001),0], sc:sc, move:true, rot:[0,0,0,0]});
    }
    //joints
    for ( i = 0; i!==9; ++i){
        addJoint({body1:bone[i], body2:bone[i+1], pos1:[0,0.5,0], pos2:[0,-0.5,0], upperAngle:1, axis1:[1,0,1], axis2:[1,0,1] });
    }
}

//--------------------------------------------------
//    TEMPLE
//--------------------------------------------------

function demo4(){
    var sc = new ShapeConfig();
    sc.density = 1;
    sc.friction = 0.5;
    sc.restitution = 0.5;

}

//--------------------------------------------------
//    RAGDOLL
//--------------------------------------------------

function demo4(){
    var sc = new ShapeConfig();
    sc.density = 1;
    sc.friction = 0.5;
    sc.restitution = 0.5;

}