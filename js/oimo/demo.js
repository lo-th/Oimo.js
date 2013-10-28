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
    world.gravity = new Vec3(0, -10, 0);
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


    //addRigid({type:"box", size:[5,1,2], pos:[px,30,pz], sc:sc, move:true, rotation:[90*ToRad, 0, 0*ToRad]});
    for (var i=0; i!==100; ++i ){
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
    sc.restitution = 0.3;

    // ground
    //addRigid({type:"box", size:[25.4,7.6,12.7], pos:[0,-3.8,0], sc:sc});
    addRigid({type:"box", size:[20,10,20], pos:[0,-5,0], sc:sc});
    // wall
    addRigid({type:"box", size:[20,10,1], pos:[0,5,-10], sc:sc});
    addRigid({type:"box", size:[20,10,1], pos:[0,5,10], sc:sc});
    addRigid({type:"box", size:[1,10,20], pos:[-10,5,0], sc:sc});
    addRigid({type:"box", size:[1,10,20], pos:[ 10,5,0], sc:sc});

    // add dynamique object
    sc.density = 1;//0.162;
    var body, px, pz, type = 1;
    for (var i=0; i!==666; ++i ){
        px = -2+Math.random()*4;
        pz = -2+Math.random()*4;
        addRigid({type:"nball", size:[0.286], pos:[px,1+(i*0.3),pz], sc:sc, move:true});
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
        addJoint({body1:bone[i], body2:bone[i+1], pos1:[0,0.5,0], pos2:[0,-0.5,0], upperAngle:1, axis1:[1,0,1], axis2:[1,0,1], collision:true });
    }
}

//--------------------------------------------------
//    SUPERMARKET 
//--------------------------------------------------

function demo4(){
    var sc = new ShapeConfig();
    sc.density = 1;
    sc.friction = 0.5;
    sc.restitution = 0;

    // ground
    addRigid({type:"box", size:[20,10,20], pos:[0,-5,0], sc:sc});

    var width = 6;
    var height = 8;
    var depth = 6;
    var w = 0.75;
    var h = 0.75;
    var d = 0.75;
    var x, y, z;
    for (var i = 0; i < width; i++) {
        for (var j = 0; j < height; j++) {
            for (var k = 0; k < depth; k++) {
                x= (i - (width - 1) * 0.5) * w;
                y= j * (h * 1.01) + h * 0.5;
                z= (k - (depth - 1) * 0.5) * d;
                addRigid({type:"box", size:[w-0.025,h,d-0.025], pos:[x,y,z], sc:sc, move:true});
            }
        }
    }

    sc.density = 5;
    //addRigid({type:"sphere", size:[0.5], pos:[0,300,0], sc:sc, move:true});

    ball = new Ball(5,1,0, world);
}

//--------------------------------------------------
//    SPECIAL
//--------------------------------------------------

function demo5(){
    world.gravity = new Vec3(0, -10, 0);
    var sc = new ShapeConfig();
    sc.density = 1;
    sc.friction = 0.5;
    sc.restitution = 0.5;

    // ground
    addRigid({type:"box", size:[200,10,200], pos:[0,-5,0], sc:sc});

    // Greek temple
    var x = 0, z = 0;
    var width = 6;
    var depth= 4;
    var r1, r2;

    sc.density = 3;
    sc.friction = 0.6;
    sc.restitution = 0.2;

    for(var i =0; i<width; i++){
        for(var j =0; j<depth; j++){
            for(var k =0; k<8;k++){
                x = (i - (width - 1) * 0.5) * 4;
                z = (j - (depth - 1) * 0.5) * 4;
                r1 = (Math.floor((Math.random()*16))*22.5)*ToRad;// rad
                r2 = (Math.floor((Math.random()*4))*90)*ToRad;// rad
                if(k===0)addRigid({type:"columnBase", size:[1.35,1,1.35], pos:[x,0.5,z], sc:sc, move:true, rotation:[0,r2,0]});
                else if(k<7)addRigid({type:"column", size:[0.5,1,0.5], pos:[x,0.5+(1.01*k),z], sc:sc, move:true, rotation:[0,r1,0]});
                else if (k===7)addRigid({type:"columnTop", size:[1.35,1,1.35], pos:[x,0.5+(1.01*k),z], sc:sc, move:true, rotation:[0,r2,0]});
                //else addRigid({type:"box", size:[3.8,1,3.8], pos:[x,1.5+(1*k),z], sc:sc, move:true, sleep:true, rotation:[0,0,0]});
            }
        }
    }

    if(version=="10.DEV"){
        // Car simulator
        car = new Car(0,2,0, world);
    }else{
        // ball controler
        ball = new Ball(0,1,0, world);
    }
}

//--------------------------------------------------
//    RAGDOLL
//--------------------------------------------------

function demo6(){
    world.gravity = new Vec3(0, 0, 0);
    var sc = new ShapeConfig();
    sc.density = 1;
    sc.friction = 0.5;
    sc.restitution = 0.5;

    var bones =[];
    var joints =[];

    for(var i=0; i!==bonesPosition.length; ++i){
        bones[i] = addRigid({type:"bone", size:[0.04,0.02,0.02], pos:bonesPosition[i], sc:sc, move:true, rotation:bonesRotation[i]});
    }

    var d = getDistance3d(bonesPosition[0], bonesPosition[1]);
    addJoint({type:"distance", body1:bones[0], body2:bones[1], pos1:[0,0,0], pos2:[0,0,0], upperAngle:1, axis1:[0,0,0], axis2:[1,0,1], collision:false, minDistance:d, maxDistance:d });
    d = getDistance3d(bonesPosition[0], bonesPosition[5]);
    addJoint({type:"distance", body1:bones[0], body2:bones[5], pos1:[0,0,0], pos2:[0,0,0], upperAngle:1, axis1:[0,0,0], axis2:[1,0,1], collision:false, minDistance:d, maxDistance:d });

    //leg Right
    d = getDistance3d(bonesPosition[1], bonesPosition[2]);
    addJoint({type:"distance", body1:bones[1], body2:bones[2], pos1:[0,0,0], pos2:[0,0,0], upperAngle:1, axis1:[0,0,0], axis2:[1,0,1], collision:false, minDistance:d, maxDistance:d });
    d = getDistance3d(bonesPosition[2], bonesPosition[3]);
    addJoint({type:"distance", body1:bones[2], body2:bones[3], pos1:[0,0,0], pos2:[0,0,0], upperAngle:1, axis1:[0,0,0], axis2:[1,0,1], collision:false, minDistance:d, maxDistance:d });
    d = getDistance3d(bonesPosition[3], bonesPosition[4]);
    addJoint({type:"distance", body1:bones[3], body2:bones[4], pos1:[0,0,0], pos2:[0,0,0], upperAngle:1, axis1:[0,0,0], axis2:[1,0,1], collision:false, minDistance:d, maxDistance:d });

    //leg Left
    d = getDistance3d(bonesPosition[5], bonesPosition[6]);
    addJoint({type:"distance", body1:bones[5], body2:bones[6], pos1:[0,0,0], pos2:[0,0,0], upperAngle:1, axis1:[0,0,0], axis2:[1,0,1], collision:false, minDistance:d, maxDistance:d });
    d = getDistance3d(bonesPosition[6], bonesPosition[7]);
    addJoint({type:"distance", body1:bones[6], body2:bones[7], pos1:[0,0,0], pos2:[0,0,0], upperAngle:1, axis1:[0,0,0], axis2:[1,0,1], collision:false, minDistance:d, maxDistance:d });
    d = getDistance3d(bonesPosition[7], bonesPosition[8]);
    addJoint({type:"distance", body1:bones[7], body2:bones[8], pos1:[0,0,0], pos2:[0,0,0], upperAngle:1, axis1:[0,0,0], axis2:[1,0,1], collision:false, minDistance:d, maxDistance:d });

    // spine
    d = getDistance3d(bonesPosition[0], bonesPosition[9]);
    addJoint({type:"distance", body1:bones[0], body2:bones[9], pos1:[0,0,0], pos2:[0,0,0], upperAngle:1, axis1:[0,0,0], axis2:[1,0,1], collision:false, minDistance:d, maxDistance:d });
    d = getDistance3d(bonesPosition[9], bonesPosition[10]);
    addJoint({type:"distance", body1:bones[9], body2:bones[10], pos1:[0,0,0], pos2:[0,0,0], upperAngle:1, axis1:[0,0,0], axis2:[1,0,1], collision:false, minDistance:d, maxDistance:d });
    d = getDistance3d(bonesPosition[10], bonesPosition[11]);
    addJoint({type:"distance", body1:bones[10], body2:bones[11], pos1:[0,0,0], pos2:[0,0,0], upperAngle:1, axis1:[0,0,0], axis2:[1,0,1], collision:false, minDistance:d, maxDistance:d });
    d = getDistance3d(bonesPosition[11], bonesPosition[12]);
    addJoint({type:"distance", body1:bones[11], body2:bones[12], pos1:[0,0,0], pos2:[0,0,0], upperAngle:1, axis1:[0,0,0], axis2:[1,0,1], collision:false, minDistance:d, maxDistance:d });
    d = getDistance3d(bonesPosition[12], bonesPosition[13]);
    addJoint({type:"distance", body1:bones[12], body2:bones[13], pos1:[0,0,0], pos2:[0,0,0], upperAngle:1, axis1:[0,0,0], axis2:[1,0,1], collision:false, minDistance:d, maxDistance:d });
    d = getDistance3d(bonesPosition[13], bonesPosition[14]);
    addJoint({type:"distance", body1:bones[13], body2:bones[14], pos1:[0,0,0], pos2:[0,0,0], upperAngle:1, axis1:[0,0,0], axis2:[1,0,1], collision:false, minDistance:d, maxDistance:d });

    // arm right
    d = getDistance3d(bonesPosition[12], bonesPosition[19]);
    addJoint({type:"distance", body1:bones[12], body2:bones[19], pos1:[0,0,0], pos2:[0,0,0], upperAngle:1, axis1:[0,0,0], axis2:[1,0,1], collision:false, minDistance:d, maxDistance:d });
    d = getDistance3d(bonesPosition[19], bonesPosition[20]);
    addJoint({type:"distance", body1:bones[19], body2:bones[20], pos1:[0,0,0], pos2:[0,0,0], upperAngle:1, axis1:[0,0,0], axis2:[1,0,1], collision:false, minDistance:d, maxDistance:d });
    d = getDistance3d(bonesPosition[20], bonesPosition[21]);
    addJoint({type:"distance", body1:bones[20], body2:bones[21], pos1:[0,0,0], pos2:[0,0,0], upperAngle:1, axis1:[0,0,0], axis2:[1,0,1], collision:false, minDistance:d, maxDistance:d });
    d = getDistance3d(bonesPosition[21], bonesPosition[22]);
    addJoint({type:"distance", body1:bones[21], body2:bones[22], pos1:[0,0,0], pos2:[0,0,0], upperAngle:1, axis1:[0,0,0], axis2:[1,0,1], collision:false, minDistance:d, maxDistance:d });

    // arm left
    d = getDistance3d(bonesPosition[12], bonesPosition[15]);
    addJoint({type:"distance", body1:bones[12], body2:bones[15], pos1:[0,0,0], pos2:[0,0,0], upperAngle:1, axis1:[0,0,0], axis2:[1,0,1], collision:false, minDistance:d, maxDistance:d });
    d = getDistance3d(bonesPosition[15], bonesPosition[16]);
    addJoint({type:"distance", body1:bones[15], body2:bones[16], pos1:[0,0,0], pos2:[0,0,0], upperAngle:1, axis1:[0,0,0], axis2:[1,0,1], collision:false, minDistance:d, maxDistance:d });
    d = getDistance3d(bonesPosition[16], bonesPosition[17]);
    addJoint({type:"distance", body1:bones[16], body2:bones[17], pos1:[0,0,0], pos2:[0,0,0], upperAngle:1, axis1:[0,0,0], axis2:[1,0,1], collision:false, minDistance:d, maxDistance:d });
    d = getDistance3d(bonesPosition[17], bonesPosition[18]);
    addJoint({type:"distance", body1:bones[17], body2:bones[18], pos1:[0,0,0], pos2:[0,0,0], upperAngle:1, axis1:[0,0,0], axis2:[1,0,1], collision:false, minDistance:d, maxDistance:d });

}