function demo() {

    cam (170,30,50);

    world = new OIMO.World({
        timestep: 1/60,
        iterations: 8,
        broadphase: 2, // 1: brute force, 2: sweep & prune, 3: volume tree
        worldscale: 1,
        random: true,
        info:true // display statistique
    });

    addTower({radius:9,height:20,detail:15,pos:[5,0,5],mass:0.4});

    add({type:'sphere',move:true,density:0.6,size:[2],pos:[-45,25,0]})
    add({size:[2, 40, 50], pos:[-30,10,0], rot:[0,0,60], density:1, restitution:0.2  })
    world.add({size:[50, 10, 50], pos:[0,-5,0], rot:[0,0,0], density:1, restitution:0.5  });

    // world internal loop
    world.postLoop = postLoop;
    world.play();

};

function addTower(o){

	if(o.radius > 45)return;

	var tx, ty, tz;
	var detail = (typeof o.detail === "undefined") ? 10 : o.detail;
	var mass = (typeof o.mass === "undefined") ? 1 : o.mass;

	if(o.pos instanceof Array){
		tx = o.pos[0] || 0;
		ty = o.pos[1] || 0;
		tz = o.pos[2] || 0;
	} else {
		tx = ty = tz = 0;
	}

	var px, py, pz, angle, rad;
	var radius = o.radius || 1;
	var height = o.height || 1;
	var sx = o.thickness || 1, sy = o.sy || 1, sz = radius * 5 / detail;

	for(var j = 0; j < height; j++){
		for(var i = 0; i < detail; i++){
			rad = radius;
			angle = (Math.PI * 2 / detail * (i + (j & 1) * 0.5));
			px = tx + Math.cos(angle) * rad;
			py = (ty + (sy) + j * sy) - (sy*0.5);
			pz = tz + -Math.sin(angle) * rad;

			add({

                type:"box",
                move:true,
                size:[sx,sy,sz],
                pos:[px,py,pz],
                rot:[0,angle*(180 / Math.PI),0],
                density:mass,
                restitution:0.1, 

            });
		}
	}
}

function postLoop () {

    var m;

    bodys.forEach( function ( b, id ) {

        if(b.type===1){

            m = b.mesh;

            if( b.sleeping ) m.material = mat.sleep;
            else m.material = mat.move;

            m.position.copy( b.getPosition() );
            m.quaternion.copy( b.getQuaternion() );

            if( m.position.y<-10 ){
                b.resetPosition( rand(-5,5), 30, rand(-5,5) );
            }
        }


    });

    editor.tell( world.getInfo() );

}