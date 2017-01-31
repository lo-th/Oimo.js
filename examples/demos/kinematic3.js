var mixer, bones, skeletonHelper, mid, boneContainer, loaded = false, scale = 0.5;

function demo() {

    cam ( 20, 20, 70, [0,20,0] );

    world = new OIMO.World({ info:true });

    var ground = world.add({size:[50, 10, 50], pos:[0,-5,0], density:1000 });

    view.load_bvh( 'action', initAnimation );

};

function initAnimation ( result ){

    var skeleton = result.skeleton;
    bones = skeleton.bones;

    skeletonHelper = new THREE.SkeletonHelper( bones[ 0 ] );
    skeletonHelper.skeleton = skeleton; // allow animation mixer to bind to SkeletonHelper directly

    skeletonHelper.visible = false;

    boneContainer = new THREE.Group();
    boneContainer.add( bones[ 0 ] );
    boneContainer.scale.multiplyScalar( scale );

    view.addMesh( skeletonHelper );
    view.addMesh( boneContainer );

    initSkeleton();

    // play animation
    mixer = new THREE.AnimationMixer( skeletonHelper );
    mixer.clipAction( result.clip ).setEffectiveWeight( 1.0 ).play();

};

function initSkeleton () {

    mid = [];

    var p1 = new THREE.Vector3();
    var p2 = new THREE.Vector3();
    var i = bones.length, name, bone, child, o, d, w;

    while(i--){

        bone = bones[i];
        name = bone.name;
        d = 1;
        p1.copy(bone.getWorldPosition());

        if( i===0 || i===1 || i===2 || i===4 ) w=4;
        else w=2;

        if( bone.children.length > 0 ) child = bone.children[0];
        else child = null;

        if( child !== null ){

            p2.copy(child.getWorldPosition());
            d = Math.distanceVector( p1, p2 ) * scale;

        }

        if( i===4 ) d*=2;

        mid[i] = d * 0.5;

        o = {
            name:name,
            size:[w,d,w],
            pos:p1.toArray(),
            move: true,
            kinematic: true,
            material:'donut'
        }

        addID( o , i );

        //console.log(name, i);

    }

    loaded = true;

    addExtra();

}

function addExtra () {

    var i = 60, d, h, w, x, z, y;

    
    while( i-- ) {

        w = Math.rand(3,6);
        h = Math.rand(3,6);
        d = Math.rand(3,6);
        x = Math.rand(-10,10);
        z = Math.rand(-10,10);
        y = Math.rand(60,100)

        add( { type:'box', size:[w,h,d], pos:[x,y,z], move:true } );

    }
}

function updateSkeleton () {

    var boneMatrix = new THREE.Matrix4();
    var matrixWorldInv = new THREE.Matrix4().getInverse( boneContainer.matrixWorld );

    var pm = new THREE.Matrix4();
    var rm0 = new THREE.Matrix4().makeRotationZ( Math.PI );
    var rm1 = new THREE.Matrix4().makeRotationZ( Math.PI*0.5 );
    var rm2 = new THREE.Matrix4().makeRotationZ( -Math.PI*0.5 );
    var rm3 = new THREE.Matrix4().makeRotationZ( Math.PI*0.03 );
    var rm4 = new THREE.Matrix4().makeRotationZ( -Math.PI*0.03 );
    var m = new THREE.Matrix4();
    var p = new THREE.Vector3();
    var s = new THREE.Vector3();
    var q = new THREE.Quaternion();

    var i = bones.length, bone, body, name;
    while(i--){

        bone = bones[i];
        body = bodys[i];
        name = bone.name;
        
        m.identity().multiplyMatrices( bone.matrixWorld, matrixWorldInv );

        // adjust rotation
        if(i===0 || i===1 || i===2 || i===3 || i===4 ) m.multiply( rm0 );
        if(i===6 || i===8 || i===7 || i===9 ) m.multiply( rm1 );
        if(i===11 ||i===13 || i===12 || i===14 ) m.multiply( rm2 );
        if(i===20 ) m.multiply( rm3 );
        if(i===16 ) m.multiply( rm4 );

        // adjuste position
        pm.identity().makeTranslation( 0, -mid[i], 0 );
        m.multiply( pm );

        m.decompose( p, q, s );

        // apply to physics body
        body.setPosition( p );
        body.setQuaternion( q );

    }

}

function add( o ){

    bodys.push( world.add(o) );
    meshs.push( view.add(o) );

}

function addID( o, i ){

    bodys[i] = world.add(o);
    meshs[i] = view.add(o);

}

function update () {

    world.step();

    if ( mixer ) mixer.update( 0.003 );
    if ( loaded ){ 

        //skeletonHelper.update();
        updateSkeleton();

    }

    var m;

    bodys.forEach( function ( b, id ) {

        if( b.type === 1 ){

            m = meshs[id];

            if( !b.isKinematic ){
                if( b.sleeping ) switchMat( m, 'sleep' );
                else switchMat( m, 'move' );
            }

            m.position.copy( b.getPosition() );
            m.quaternion.copy( b.getQuaternion() );

            if( m.position.y < -10 ){
                b.resetPosition( Math.rand(-10,10), Math.rand(60,100), Math.rand(-10,10) );
            }
        }


    });

    editor.tell( world.getInfo() );

}