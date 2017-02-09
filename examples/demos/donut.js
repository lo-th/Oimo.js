var donutsGeo = [];
var donuts = [];
var maxp = 0;
var maxPoint = 16;

var pos = [];

function demo() {

    cam ( 90, 20, 100 );

    world = new OIMO.World({ 
        timestep: 1/60, 
        iterations: 8, 
        broadphase: 2, // 1: brute force, 2: sweep & prune, 3: volume tree
        worldscale: 1, 
        random: true, 
        info:true // display statistique
    });

   

    // basic geometry body

    var i, j, n, x, y, z, s, b;
    var px, py, pz;
    var radius = 3;
    var margin = 0.3;
    var num = 10;
    var mx = maxPoint;
    var rayon = 8;
    var a = (360/mx) * Math.torad;
    var spring = [2, 0.3];// soften the joint ex: 100, 0.2
    var isBall = true;

    for( i = 0; i < num; i++){



        n = i*mx;
        py = (60 + (i*10));
        px = rand(-40, 40);
        pz = rand(-40, 40);

        isBall = randInt(0, 1);

        donutsGeo[i] = new THREE.Tubular({ start:[px,0,pz], end:[px,-40,pz+40], numSegment:mx }, (mx)*3, radius, 12, true );
        donuts[i] = new THREE.Mesh( donutsGeo[i], mat.donut );
        donuts[i].castShadow = true;
        donuts[i].receiveShadow = true;
        view.addMesh( donuts[i] );

        pos.push([])

        for( j = 0; j < mx; j++){

            x = (Math.sin(j*a) * rayon) + px;
            y = py; //+ Math.sin(j*0.5);
            z = (Math.cos(j*a) * rayon) + pz;

            add({ type:'sphere', size:[radius], pos:[x, y, z], move:1 }, true );

            if(isBall){

                if( j > 0 ) world.add({ type:'jointBall', body1:n+(j-1), body2:n+j, pos1:[-(radius+margin),0, 0], pos2:[(radius+margin),0, 0], collision:true  });
                if( j === mx-1 ) world.add({ type:'jointBall', body1:n+(mx-1), body2:n, pos1:[-(radius+margin),0, 0], pos2:[(radius+margin),0, 0], collision:true  });

            } else {

                if( j > 0 ) world.add({ type:'jointHinge', body1:n+(j-1), body2:n+j, pos1:[-(radius+margin),0, 0], pos2:[(radius+margin),0, 0], collision:false, spring:spring, min:90, max:-90  });
                if( j === mx-1 ) world.add({ type:'jointHinge', body1:n+(mx-1), body2:n, pos1:[-(radius+margin),0, 0], pos2:[(radius+margin),0, 0], collision:false, spring:spring, min:90, max:-90  });

            }

        }
    }

    maxp = world.numRigidBodies;

    //console.log(maxp)


    var ground = world.add({size:[1000, 10, 1000], pos:[0,-5,0], density:1 });

    
    
    for( i = 0; i<40; i++ ){
        x = rand(-50, 50);
        z = rand(-50, 50);
        s = rand(5, 15);
        add({ type:'box', geometry:geo.dice, size:[s,s,s], pos:[x,s*0.5,z], move:true });
    }

    // world internal loop
    world.postLoop = postLoop;
    world.play();

};

function postLoop () {

    //world.step();

    var v, n, cx, m;

    bodys.forEach( function ( b, id ) {

        if(b.type===1){

            if(id < maxp){

                cx = Math.floor( id / maxPoint );
                n = (id) - (cx*maxPoint);
                
                donutsGeo[cx].positions[n].copy( b.getPosition() );

            } else {

                var mid = id - maxp

                m = b.mesh;//meshs[mid]; 

                if( b.sleeping ) switchMat( m, 'sleep');
                else switchMat( m, 'move');

                //m.position.copy( b.getPosition() );
                //m.quaternion.copy( b.getQuaternion() );

                if( m.position.y < -10 ){
                    b.resetPosition(rand(-5,5),rand(10,20),rand(-5,5));
                }
            }
        }


    });

    donutsGeo.forEach( function ( b, id ) {

        b.updatePath();

    });

    editor.tell( world.getInfo() );

}