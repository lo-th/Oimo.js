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
    world.gravity = new OIMO.Vec3(0, -10, 0);

    // ground
    addRigid({type:"ground", size:[550,300,550], pos:[0,-150,0]});

    // wall
    addRigid({ type:"box", size:[450,1000,50], pos:[0,500,-250] });
    addRigid({ type:"box", size:[450,1000,50], pos:[0,500, 250] });
    addRigid({ type:"box", size:[50,1000,550], pos:[-250,500,0] });
    addRigid({ type:"box", size:[50,1000,550], pos:[ 250,500,0] });

    // add dynamique object
    var body, px, pz, t;
    var sx, sy, sz;

    for (var i=0; i!==100; ++i ){
        if(version=="10.DEV")t = Math.floor(Math.random()*2)+1;
        else t = Math.floor(Math.random()*3)+1;
        px = -100+Math.random()*200;
        pz = -100+Math.random()*200;
        sx = 20+Math.random()*100;
        sy = 20+Math.random()*100;
        sz = 20+Math.random()*100;
        if(t==1) addRigid({ type:"sphere", size:[sx*0.5], pos:[px,500+(i*200),pz], move:true });
        else if(t==2) addRigid({ type:"box", size:[sx,sy,sz], pos:[px,500+(i*200),pz], move:true });
        else if(t==3) addRigid({ type:"cylinder", size:[sx*0.5,sy,sx*0.5], pos:[px,500+(i*200),pz], move:true });
    }
}

//--------------------------------------------------
//    DICE FALL
//--------------------------------------------------

function demo1(){
    world.gravity = new OIMO.Vec3(0, -10, 0);

    // ground
    addRigid({ type:"ground", size:[2000,300,2000], pos:[0,-150,0] });
    // wall
    addRigid({ type:"box", size:[2000,1000,100], pos:[ 0,500,950] });
    addRigid({ type:"box", size:[2000,1000,100], pos:[ 0,500,-950] });
    addRigid({ type:"box", size:[100,1000,1800], pos:[-950,500,0] });
    addRigid({ type:"box", size:[100,1000,1800], pos:[ 950,500,0] });

    var body, px, pz, s, r0, r1, r2;
    for (var i=0; i!==333; ++i ){
        s = 20+Math.random()*100;
        px = -800+Math.random()*1600;
        pz = -800+Math.random()*1600;
        r0 = Math.random()*360;
        r1 = Math.random()*360;
        r2 = Math.random()*360;
        addRigid({ type:"dice", size:[s,s,s], pos:[px,100+(100*i),pz], config:[s/100, 0.5, 0.5], rot:[r0,r1,r2], move:true });
    }
}

//--------------------------------------------------
//    MAD POOL
//--------------------------------------------------

function demo2(){
	world.gravity = new OIMO.Vec3(0, -10, 0);

    // ground
    addRigid({ type:"ground", size:[2540,300,1270], pos:[0,-150,0] });
    // wall
    addRigid({ type:"box", size:[2540,500,100], pos:[0,250,-685] });
    addRigid({ type:"box", size:[2540,500,100], pos:[0,250,685] });
    addRigid({ type:"box", size:[100,500,1470], pos:[-1320,250,0] });
    addRigid({ type:"box", size:[100,500,1470], pos:[ 1320,250,0] });

    // add dynamique object
    var body, px, pz, type = 1;
    for (var i=0; i!==333; ++i ){
        px = -200+Math.random()*400;
        pz = -200+Math.random()*400;
        addRigid({ type:"nball", size:[28.6], pos:[px,1+(i*30),pz], config:[1,0.6,0.6], move:true });
    }
}

//--------------------------------------------------
//    JOINT TEST
//--------------------------------------------------

function demo3(){
	world.gravity = new OIMO.Vec3(0, -10, 0);

    var dy=30;
    // ground
    addRigid({ type:"ground", size:[2000,200,2000], pos:[0,-100+dy,0] });
    // wall
    addRigid({ type:"box", size:[2000,1000,100], pos:[0,500+dy,-950] });
    addRigid({ type:"box", size:[2000,1000,100], pos:[0,500+dy,950] });
    addRigid({ type:"box", size:[100,1000,1800], pos:[-950,500+dy,0] });
    addRigid({ type:"box", size:[100,1000,1800], pos:[ 950,500+dy,0] });

    // add dynamique object
    dy+=1;
    var i;
    
    // bones
    var bone = [];
    for ( i = 0; i!==10; ++i){
        bone[i] = addRigid({ type:"bone", size:[25,100,25], pos:[0,dy+50+(i*100.1),0], config:[10,0.4,0.4], move:true, rot:[0,0,0]});
    }
    //joints
    for ( i = 0; i!==9; ++i){
        addJoint({type:"jointHinge", body1:bone[i], body2:bone[i+1], pos1:[0,50,0], pos2:[0,-50,0], min:20, max:60, axe1:[1,0,1], axe2:[1,0,1], collision:true });
    }
}

//--------------------------------------------------
//    SUPERMARKET 
//--------------------------------------------------

function demo4(){
	world.gravity = new OIMO.Vec3(0, -10, 0);

    // ground
    addRigid({ type:"ground", size:[10000,400,10000], pos:[0,-200,0] });

    var width = 6;
    var height = 6;
    var depth = 6;
    var w = 75;
    var h = 75;
    var d = 75;
    var x, y, z;
    for (var i = 0; i < width; i++) {
        for (var j = 0; j < height; j++) {
            for (var k = 0; k < depth; k++) {
                x= (i - (width - 1) * 0.5) * w;
                y= j * (h * 1) + h * 0.5;
                z= (k - (depth - 1) * 0.5) * d;
                addRigid({type:"box", size:[w-2.5,h,d-2.5], pos:[x,y,z], move:true});
            }
        }
    }

    ball = new Ball([500,100,0]);
}

//--------------------------------------------------
//    SPECIAL
//--------------------------------------------------

function demo5(){
    world.gravity = new OIMO.Vec3(0, -10, 0);

    // ground
    addRigid({ type:"ground", size:[10000,400,10000], pos:[0,-200,0] });

    // Greek temple
    var x = 0, z = 0;
    var width = 6;
    var depth= 4;
    var r1, r2;

    for(var i =0; i<width; i++){
        for(var j =0; j<depth; j++){
            for(var k =0; k<8;k++){
                x = (i - (width - 1) * 0.5) * 400;
                z = (j - (depth - 1) * 0.5) * 400;
                r1 = (Math.floor((Math.random()*16))*22.5);
                r2 = (Math.floor((Math.random()*4))*90);
                if(k===0)addRigid({ type:"columnBase", size:[135,100,135], pos:[x,50,z], config:[3,0.6,0.2], move:true, rot:[0,r2,0] });
                else if(k<7)addRigid({ type:"column", size:[50,100,50], pos:[x,50+(101*k),z], config:[3,0.6,0.2], move:true, rot:[0,r1,0] });
                else if (k===7)addRigid({ type:"columnTop", size:[135,100,135], pos:[x,50+(101*k),z], config:[3,0.6,0.2], move:true, rot:[0,r2,0] });
                //else addRigid({type:"box", size:[3.8,1,3.8], pos:[x,1.5+(1*k),z], sc:sc, move:true, sleep:true, rot:[0,0,0]});
            }
        }
    }

    if(version=="10.DEV"){
        // Car simulator
        car = new Car([0,200,0]);
        
    }else{
        // ball controler
        ball = new Ball([0,100,0]);
    }
}

//--------------------------------------------------
//    RAGDOLL
//--------------------------------------------------

function demo6(){
	world.gravity = new OIMO.Vec3(0, -0.01, 0);

    // ground
    addRigid({ type:"ground", size:[2000,100,2000], pos:[0,-50,0] });

    // test ragdoll stucture
    var bones =[];
    var joints =[];

    for(var i=0; i!==bonesPosition.length; ++i){
        bones[i] = addRigid({ type:"bone", size:[5,3,3], pos:bonesPosition[i], rot:bonesRotation[i] , move:true});
    }

    var type = "jointHinge"; //"distance"

    var d = OIMO.Distance3d(bonesPosition[0], bonesPosition[1]);
    addJoint({type:type, body1:bones[0], body2:bones[1], pos1:[0,0,0], pos2:[-d,0,0], axe1:[1,0,0], axe2:[1,0,0], min:10, max:20, collision:false, show:true });// 
    d = OIMO.Distance3d(bonesPosition[0], bonesPosition[5]);
    addJoint({type:type, body1:bones[0], body2:bones[5], pos1:[0,0,0], pos2:[d,0,0], axe1:[1,0,0], axe2:[1,0,0], min:10, max:20, collision:false, show:true});// 

    //leg Right
    d = OIMO.Distance3d(bonesPosition[1], bonesPosition[2]);
    addJoint({type:type, body1:bones[1], body2:bones[2], pos1:[0,0,0], pos2:[0,-d,0], axe1:[1,0,0], axe2:[1,0,0], collision:false, min:10, max:20, show:true  });
    d = OIMO.Distance3d(bonesPosition[2], bonesPosition[3]);
    addJoint({type:type, body1:bones[2], body2:bones[3], pos1:[0,0,0], pos2:[0,-d,0], axe1:[1,0,0], axe2:[1,0,0], collision:false, min:10, max:20, show:true  });
    d = OIMO.Distance3d(bonesPosition[3], bonesPosition[4]);
    addJoint({type:type, body1:bones[3], body2:bones[4], pos1:[0,0,0], pos2:[0,-d,0], axe1:[1,0,0], axe2:[1,0,0], collision:false, min:10, max:20, show:true  });

    //leg Left
    d = OIMO.Distance3d(bonesPosition[5], bonesPosition[6]);
    addJoint({type:type, body1:bones[5], body2:bones[6], pos1:[0,0,0], pos2:[0,-d,0], axe1:[1,0,0], axe2:[1,0,0], collision:false, min:10, max:20, show:true });
    d = OIMO.Distance3d(bonesPosition[6], bonesPosition[7]);
    addJoint({type:type, body1:bones[6], body2:bones[7], pos1:[0,0,0], pos2:[0,-d,0], axe1:[1,0,0], axe2:[1,0,0], collision:false, min:10, max:20, show:true });
    d = OIMO.Distance3d(bonesPosition[7], bonesPosition[8]);
    addJoint({type:type, body1:bones[7], body2:bones[8], pos1:[0,0,0], pos2:[0,-d,0], axe1:[1,0,0], axe2:[1,0,0], collision:false, min:10, max:20, show:true });

    // spine
    d = OIMO.Distance3d(bonesPosition[0], bonesPosition[9]);
    addJoint({type:type, body1:bones[0], body2:bones[9], pos1:[0,0,0], pos2:[0,-d,0], axe1:[1,0,0], axe2:[1,0,0], collision:false, min:10, max:40, show:true });
    d = OIMO.Distance3d(bonesPosition[9], bonesPosition[10]);
    addJoint({type:type, body1:bones[9], body2:bones[10], pos1:[0,0,0], pos2:[0,-d,0], axe1:[1,0,0], axe2:[1,0,0], collision:false, min:10, max:40, show:true });
    d = OIMO.Distance3d(bonesPosition[10], bonesPosition[11]);
    addJoint({type:type, body1:bones[10], body2:bones[11], pos1:[0,0,0], pos2:[0,-d,0], axe1:[1,0,0], axe2:[1,0,0], collision:false, min:10, max:40, show:true });
    d = OIMO.Distance3d(bonesPosition[11], bonesPosition[12]);
    addJoint({type:type, body1:bones[11], body2:bones[12], pos1:[0,0,0], pos2:[0,-d,0], axe1:[1,0,0], axe2:[1,0,0], collision:false, min:10, max:40, show:true });
    d = OIMO.Distance3d(bonesPosition[12], bonesPosition[13]);
    addJoint({type:type, body1:bones[12], body2:bones[13], pos1:[0,0,0], pos2:[0,-d,0], axe1:[1,0,0], axe2:[1,0,0], collision:false, min:10, max:40, show:true });
    d = OIMO.Distance3d(bonesPosition[13], bonesPosition[14]);
    addJoint({type:type, body1:bones[13], body2:bones[14], pos1:[0,0,0], pos2:[0,-d,0], axe1:[1,0,0], axe2:[1,0,0], collision:false, min:10, max:40, show:true });

    // arm right
    d = OIMO.Distance3d(bonesPosition[13], bonesPosition[19]);
    addJoint({type:type, body1:bones[13], body2:bones[19], pos1:[0,0,0], pos2:[0,-d,0], axe1:[1,0,0], axe2:[1,0,0], collision:false, min:10, max:20, show:true  });
    d = OIMO.Distance3d(bonesPosition[19], bonesPosition[20]);
    addJoint({type:type, body1:bones[19], body2:bones[20], pos1:[0,0,0], pos2:[0,-d,0], axe1:[1,0,0], axe2:[1,0,0], collision:false, min:10, max:20, show:true  });
    d = OIMO.Distance3d(bonesPosition[20], bonesPosition[21]);
    addJoint({type:type, body1:bones[20], body2:bones[21], pos1:[0,0,0], pos2:[0,-d,0], axe1:[1,0,0], axe2:[1,0,0], collision:false, min:10, max:20, show:true  });
    d = OIMO.Distance3d(bonesPosition[21], bonesPosition[22]);
    addJoint({type:type, body1:bones[21], body2:bones[22], pos1:[0,0,0], pos2:[0,-d,0], axe1:[1,0,0], axe2:[1,0,0], collision:false, min:10, max:20, show:true  });

    // arm left
    d = OIMO.Distance3d(bonesPosition[13], bonesPosition[15]);
    addJoint({type:type, body1:bones[13], body2:bones[15], pos1:[0,0,0], pos2:[0,d,0], axe1:[1,0,0], axe2:[1,0,0], collision:false, min:10, max:20, show:true });
    d = OIMO.Distance3d(bonesPosition[15], bonesPosition[16]);
    addJoint({type:type, body1:bones[15], body2:bones[16], pos1:[0,0,0], pos2:[0,d,0], axe1:[1,0,0], axe2:[1,0,0], collision:false, min:10, max:20, show:true  });
    d = OIMO.Distance3d(bonesPosition[16], bonesPosition[17]);
    addJoint({type:type, body1:bones[16], body2:bones[17], pos1:[0,0,0], pos2:[0,d,0], axe1:[1,0,0], axe2:[1,0,0], collision:false, min:10, max:20, show:true  });
    d = OIMO.Distance3d(bonesPosition[17], bonesPosition[18]);
    addJoint({type:type, body1:bones[17], body2:bones[18], pos1:[0,0,0], pos2:[0,d,0], axe1:[1,0,0], axe2:[1,0,0], collision:false, min:10, max:20, show:true  });

}



//--------------------------------------------------
//    VAN
//--------------------------------------------------

function demo7(){
	world.gravity = new OIMO.Vec3(0, -10, 0);

    // ground
    addRigid({ type:"ground", size:[200000,1000,200000], pos:[0,-500,0] });

    if(version=="10.DEV"){
        // test new vehicle
        van = new Van([0,200,0]);
    }
}

//--------------------------------------------------
//    BRIDGE
//--------------------------------------------------

function demo8(){
	world.gravity = new OIMO.Vec3(0, -10, 0);

	// ground
    addRigid({ type:"ground", size:[20000,1000,20000], pos:[0,-500,0] });

    var length = 40;
    var width = 400, heigth = 40, depth = 100;
    var x = 0, y = 300, z = (depth*length)*0.5;
    var moving = false;
    var n=0;

    for (var i = 0; i <= length; i++) {
        if(i === length || i===0) moving = false;
        else moving = true;
        addRigid({ type:"box", size:[width, heigth, depth], pos:[x,y,z - (i + 1) * depth], config:[2,0.5,0.5], move:moving, name:'b'+i});
        if(i!==0)addJoint({type:"jointHinge", body1:'b'+(i-1), body2:'b'+i, pos1:[0, 0, -depth * 0.5], pos2:[0, 0, depth * 0.5], upperAngle:0, axe1:[1,0,0], axe2:[1,0,0], collision:false });

        // Fixation
        var L = i.toString();
        if(L.charAt(L.length-1) === '0' && moving===true){
            addRigid({type:"sphere", size:[20], pos:[x, y + 400, z - (i + 1) * depth], move:false, name:'s'+n});
            var dist = 500;
            addJoint({type:"jointDistance", body1:'b'+i, body2:'s'+n, pos1:[-width * 0.5, 0, 0], axe1:[1,0,0], axe2:[1,0,0], min:100, max:dist , spring:[2, 0.5] });
            addJoint({type:"jointDistance", body1:'b'+i, body2:'s'+n, pos1:[width * 0.5, 0, 0], axe1:[1,0,0], axe2:[1,0,0], min:100, max:dist , spring:[2, 0.5] });
            n++;
        }
    }
    
    box = addRigid({type:"box", size:[120, 120, 120], pos:[x, y + 100, z - 600],  config:[1,0.5,0.5], move:true});
    ball = new Ball([x, y + 100, z-100], 2); 
}

//--------------------------------------------------
//    DROID
//--------------------------------------------------

function demo9(){
    world.gravity = new OIMO.Vec3(0, -10, 0);

    // ground
    addRigid({ type:"ground", size:[10000,300,10000], pos:[0,-150,0] });
    // wall
    addRigid({ type:"box", size:[1000,200,100], pos:[0,100,-800] });
    addRigid({ type:"box", size:[100,200,1400], pos:[-500,100,0] });

    var box, px, pz, sx, sy, sz;
    
    for(var i=0; i!==40; ++i){
        sx = 50+Math.random()*200;
        sy = 50+Math.random()*200;
        sz = 50+Math.random()*200;
        px = -3000+Math.random()*6000;
        pz = -3000+Math.random()*6000;
        box= addRigid({type:"box", size:[sx, sy, sz], pos:[px, sy*0.5, pz],  config:[1,0.5,0.5], move:true});
    }
    player = new Player([0, 100, 0]);
}