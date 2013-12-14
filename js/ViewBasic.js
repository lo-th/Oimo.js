/*   _     _   _     
    | |___| |_| |__
    | / _ \  _|    |
    |_\___/\__|_||_|
    http://3dflashlo.wordpress.com/
*/
'use strict';
var container, renderer, scene, sceneBG, camera, cameraBG, renderLoop, content;
var camPos = {w: 100, h:100, horizontal: 40, vertical: 60, distance: 2000, automove: false};
var vsize = { x:window.innerWidth, y:window.innerHeight, z:window.innerWidth/window.innerHeight };
var mouse = {x: 0, y: 0, down:false, over:false, ox: 0, oy: 0, h: 0, v: 0, mx:0, my:0};
var center = new THREE.Vector3(0,150,0);

var delta, clock = new THREE.Clock();
var fpstxt, time, time_prev = 0, fps = 0;

var lights = [];
var meshs = [];
var players = [];

var currentPlay;
var character=0;
var currentPlayer = 1;
var controls = { rotation: 0, speed: 0, vx: 0, vz: 0, maxSpeed: 275, acceleration: 600, angularSpeed: 2.5};
var cursor, cursorUp, cursorDown;

var ToRad = Math.PI / 180;
var ToDeg = 180 / Math.PI;
var isOptimized;
var isLoading = true;
var antialias;
var MaxAnistropy;

var raycaster = new THREE.Raycaster();
var projector = new THREE.Projector();
var directionVector = new THREE.Vector3();
var marker;

var isBuffered = true;

//-----------------------------------------------------
//  INIT VIEW
//-----------------------------------------------------

function initThree(option) {
	if(!option) option = {};
	isOptimized = option.optimized || false;
	if(!isOptimized)antialias = true;
	else antialias = false

	renderer = new THREE.WebGLRenderer({ antialias:antialias, alpha: false });
	//renderer.setClearColor( 0x161616, 1 );
	//renderer.autoClearColor = false;
	renderer.physicallyBasedShading = true;
	renderer.gammaOutput = true;
	renderer.gammaInput = true;
	renderer.autoClear = false;

	MaxAnistropy = renderer.getMaxAnisotropy();

	scene = new THREE.Scene();
	sceneBG = new THREE.Scene();
	
	camera = new THREE.PerspectiveCamera( 60, 1, 1, 4000 );
	cameraBG = new THREE.PerspectiveCamera( 60, 1, 1, 6000 );
	
	scene.add(camera);
	sceneBG.add(cameraBG);

	moveCamera();

	container = document.getElementById( "container" );
	container.style.position = "absolute";
	//resize( container.clientWidth, container.clientHeight);
	container.appendChild( renderer.domElement );

	container.addEventListener( 'mousemove', onMouseMove, false );
	container.addEventListener( 'touchmove', onTouchMove, false );
	container.addEventListener( 'mousedown', onMouseDown, false );
	container.addEventListener( 'mouseup', onMouseUp, false );
	container.addEventListener( 'mousewheel', onMouseWheel, false );
	container.addEventListener( 'DOMMouseScroll', onMouseWheel, false ); // firefox
	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );

	if(option.mouse) customCursor();
	//else {cursor = document.getElementById( 'cursor' );}
	if(option.autoSize){ defaultIfResize(); window.addEventListener( 'resize', rz, false ); rz();}
	else{ window.addEventListener( 'resize', rz2, false ); rz2(); };

	// containe all object from simulation
	content = new THREE.Object3D();
	scene.add(content);

	// marker for mouse position
	marker = new THREE.Mesh(new THREE.SphereGeometry(3), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent:true, opacity:1}));
	scene.add(marker);

	if(!isOptimized){
	    renderer.shadowMapEnabled = true;
	    renderer.shadowMapType = THREE.PCFSoftShadowMap;
	    //renderer.shadowMapSoft = true;
		//scene.fog = new THREE.Fog( 0x212121 , 1000, 2000 );
		//mirrorGround();
		initLights();
	}

	initMaterial();
	initObject();
	initSea3DMesh();

	//onThreeChangeView(45,60,1000);

    //update();
    //startRender();
}

function customCursor() {
	cursorUp = document.getElementById( 'cursorUp' );
	cursorDown = document.getElementById( 'cursorDown' );
	cursor = document.getElementById( 'cursor' );
	container.addEventListener( 'mouseover', onMouseOver, false );
	container.addEventListener( 'mouseout', onMouseOut, false );
}

function debugInfo(s){
	 document.getElementById( 'titre' ).innerHTML = s;
}

//-----------------------------------------------------
//  MATERIAL
//-----------------------------------------------------

var groundMat, mat01, mat02, mat03, mat04, mat01sleep, mat02sleep, mat03sleep, mat04sleep, mat05, matBone, matBonesleep, mat06, mat07, mat07sleep, mat08, matGyro; 
var materials = [];
var poolMaterial = [];
//var baseMaterialm baseMaterial2;
var envTexture;
var sphereMaterial;
var renderNoise=.04,nRenderNoise=.04;

function setNoise(n){
	//baseMaterial.uniforms.noise.value=baseMaterial2.uniforms.noise.value=
	sphereMaterial.uniforms.noise.value=n;
}

function initMaterial() {
	envTexture = Ambience.getTexture();

	// SHADER

	sphereMaterial=new THREE.ShaderMaterial({
		uniforms:THREE.SpShader.uniforms,
		vertexShader:THREE.SpShader.vertexShader,
		fragmentShader:THREE.SpShader.fragmentShader,
		side:THREE.BackSide,
		depthWrite: false
	});
	sphereMaterial.uniforms.resolution.value.set(camPos.w,camPos.h);

	/*baseMaterial=new THREE.ShaderMaterial({
		uniforms: THREE.SphereShader.uniforms,
		vertexShader: THREE.SphereShader.vertexShader,
		fragmentShader: THREE.SphereShader.fragmentShader,
		wrapping:THREE.ClampToEdgeWrapping,
		shading:THREE.SmoothShading
	});
	baseMaterial.uniforms.tMatCap.value = envTexture;
	baseMaterial.uniforms.tMatCap.value.wrapS=baseMaterial.uniforms.tMatCap.value.wrapT=THREE.ClampToEdgeWrapping;
	//baseMaterial.uniforms.tNormal.value.wrapS=baseMaterial.uniforms.tNormal.value.wrapT=THREE.RepeatWrapping;

	baseMaterial2=new THREE.ShaderMaterial({
		uniforms: THREE.SphereShader.uniforms,
		vertexShader: THREE.SphereShader.vertexShader,
		fragmentShader: THREE.SphereShader.fragmentShader,
		wrapping:THREE.ClampToEdgeWrapping,
		shading:THREE.SmoothShading
	});
	baseMaterial2.uniforms.tMatCap.value = envTexture;
	baseMaterial2.uniforms.tMatCap.value.wrapS=baseMaterial2.uniforms.tMatCap.value.wrapT=THREE.ClampToEdgeWrapping;
	//baseMaterial.uniforms.tNormal.value.wrapS=baseMaterial.uniforms.tNormal.value.wrapT=THREE.RepeatWrapping;
	baseMaterial2.uniforms.useRim.value = 10/100;
	baseMaterial2.uniforms.rimPower.value = 1/20;
	*/

	// from AutoTexture
	var snakeTexture = createSnakeTexture();
	var diceTexture = new createDiceTexture(0);
	var diceTextureSleep = new createDiceTexture(1);
	var wheelTexture = new createWheelTexture(0);
	var gyroTexture = THREE.ImageUtils.loadTexture( 'images/gyroscope.jpg'  );

	if(!isOptimized){
		groundMat =  new THREE.MeshBasicMaterial( { color: 0xFFFFFF, transparent:true, opacity:0.5, blending: THREE.MultiplyBlending} );
		mat01 = new THREE.MeshLambertMaterial( { color: 0xff9933, shininess:100, specular:0xffffff } );
		mat02 = new THREE.MeshLambertMaterial( { color: 0x3399ff, shininess:100, specular:0xffffff } );
		mat03 = new THREE.MeshLambertMaterial( { color: 0x33ff99, shininess:100, specular:0xffffff } );
		mat04 = new THREE.MeshLambertMaterial( { map: diceTexture, shininess:10, specular:0xffffff } );
		mat05 = new THREE.MeshLambertMaterial( { map: snakeTexture, shininess:100, specular:0xffffff, skinning: true, transparent:true, opacity:0.9 } ); 
		mat06 = new THREE.MeshLambertMaterial( { map: wheelTexture } );
		mat07 = new THREE.MeshLambertMaterial( { color: 0x7C7B77, shininess:100, specular:0xffffff } );
		mat08 = new THREE.MeshLambertMaterial( { color: 0xe7b37a, shininess:100, specular:0xffffff, skinning: true, transparent:true, opacity:0.5 } );
		mat01sleep = new THREE.MeshLambertMaterial( { color: 0xffd9b2, shininess:100, specular:0xffffff } );
		mat02sleep = new THREE.MeshLambertMaterial( { color: 0xb2d9ff, shininess:100, specular:0xffffff } );
		mat03sleep = new THREE.MeshLambertMaterial( { color: 0xb2ffd9, shininess:100, specular:0xffffff } );
		mat04sleep = new THREE.MeshLambertMaterial( { map: diceTextureSleep, shininess:10, specular:0xffffff } );
		mat07sleep = new THREE.MeshLambertMaterial( { color: 0xAEABA6, shininess:100, specular:0xffffff } );
		matGyro = new THREE.MeshLambertMaterial( { map: gyroTexture, shininess:100, specular:0xffffff } );

		matBone = new THREE.MeshBasicMaterial( { color: 0xffff00, shininess:100, specular:0xffffff, transparent:true, opacity:0.4 } ); 
		matBonesleep = new THREE.MeshBasicMaterial( { color: 0xffffff, shininess:100, specular:0xffffff, transparent:true, opacity:0.4 } );  
		for(var i=0;i!==16;i++){
			poolMaterial[i] = new THREE.MeshLambertMaterial( { map: new eightBall(i), shininess:60, specular:0xffffff } );
		}
        //MeshPhongMaterial
		//MeshLambertMaterial
	}else{
		groundMat = new THREE.MeshBasicMaterial( { color: 0x185E77} );
		mat01 = new THREE.MeshBasicMaterial( { color: 0xff9933} );
		mat02 = new THREE.MeshBasicMaterial( { color: 0x3399ff} );
		mat03 = new THREE.MeshBasicMaterial( { color: 0x33ff99} );
		mat04 = new THREE.MeshBasicMaterial( { map: diceTexture} );
		mat05 = new THREE.MeshBasicMaterial( { map: snakeTexture, skinning: true, transparent:true, opacity:0.9} );
		mat06 = new THREE.MeshBasicMaterial( { map: wheelTexture} );
		mat07 = new THREE.MeshBasicMaterial( { color: 0x7C7B77} );
		mat08 = new THREE.MeshBasicMaterial( { color: 0xAEABA6, skinning: true, transparent:true, opacity:0.5} );
		mat01sleep = new THREE.MeshBasicMaterial( { color: 0xffd9b2} );
		mat02sleep = new THREE.MeshBasicMaterial( { color: 0xb2d9ff} );
		mat03sleep = new THREE.MeshBasicMaterial( { color: 0xb2ffd9} );
		mat04sleep = new THREE.MeshBasicMaterial( { map: diceTextureSleep} );
		mat07sleep = new THREE.MeshBasicMaterial( { color: 0xAEABA6} );
		matGyro = new THREE.MeshBasicMaterial( { map: gyroTexture} );

		matBone = new THREE.MeshBasicMaterial( { color: 0xffff00, transparent:true, opacity:0.1 } ); 
		matBonesleep = new THREE.MeshBasicMaterial( { color: 0xffffff, transparent:true, opacity:0.1 } ); 
		for(var i=0;i!==16;i++){
			poolMaterial[i] = new THREE.MeshBasicMaterial( { map: new eightBall(i) } );
		}
	}

	mat01.name = "mat01";
	mat02.name = "mat02";
	mat03.name = "mat03";
	mat04.name = "mat04";
	mat07.name = "mat07";
	mat01sleep.name = "mat01sleep";
	mat02sleep.name = "mat02sleep";
	mat03sleep.name = "mat03sleep";
	mat04sleep.name = "mat04sleep";
	mat07sleep.name = "mat07sleep";
	matBone.name = "bone";
	matBonesleep.name = "bonesleep";

	// define Ambiante Colors
	var array1=[mat01, mat02, mat03, mat04, mat07, mat01sleep, mat02sleep, mat03sleep, mat04sleep, mat07sleep, mat05, mat06, mat08, matGyro];
	var array2 = array1.concat(poolMaterial)
	//Ambience.begin(scene, [mat01, mat02, mat03,mat04, mat01sleep, mat02sleep, mat03sleep, mat04sleep], 2);
	Ambience.begin(renderer, scene, array2, 500,100);
	//Ambience.update((-camPos.horizontal)*ToRad, (-camPos.vertical-90)*ToRad, renderer, scene);
}

//-----------------------------------------------------
//  PHYSICS OBJECT IN THREE
//-----------------------------------------------------

function createContentObjects(data){
	//resetBgObject();
	var boneindex=0;
	var max = data.types.length;
	var mesh;
	var m2 = null;
	var m3 = null;
	var meshFlag;
	var s;
    for(var i=0; i!==max; i++){
    	s = data.sizes[i] || [50,50,50];
    	switch(data.types[i]){
    		case 1: mesh=new THREE.Mesh(geo02b, mat02); mesh.scale.set( s[0], s[0], s[0] ); break; // sphere
    		case 2: mesh=new THREE.Mesh(geo01b, mat01); mesh.scale.set( s[0], s[1], s[2] ); break; // box
    		case 3: mesh=new THREE.Mesh(geo03b, mat03); mesh.scale.set( s[0], s[1], s[2] ); break; // Cylinder

    		case 4: mesh=new THREE.Mesh(diceBuffer, mat04); mesh.scale.set( s[0], s[1], s[2] ); break; // dice
    		case 5:
    		    mesh=new THREE.Mesh(getSeaGeometry('wheel'), mat06);
    		    mesh.scale.set( s[0]*2, s[1]*2, s[2]*2 );
    		    //mesh=new THREE.Mesh(getMeshByName('wheel').geometry, mat06);
    		    //mesh.scale.set( s[0]*2, s[1]*2, -s[2]*2 );
    		break; // Wheel
    		case 6:
    		    mesh=new THREE.Mesh(getMeshByName('wheel').geometry, mat06);
    		    mesh.scale.set( -s[0]*2, s[1]*2, -s[2]*2 );
    		break; // Wheel inv

    		case 7: mesh=new THREE.Mesh(colomnBuffer, mat07); mesh.scale.set( s[1], s[1], s[1] ); break; // column
    		case 8: mesh=new THREE.Mesh(colomnBaseBuffer, mat07); mesh.scale.set( s[1], s[1], s[1] ); break; // column base
    		case 9: mesh=new THREE.Mesh(colomnTopBuffer, mat07); mesh.scale.set( s[1], s[1], s[1] ); break; // column top

    		//case 10: mesh=new THREE.Mesh(geo01, matBone); mesh.scale.set( s[0], s[1], s[2] ); break; // bone
    		case 10: 
    		    var axe = new THREE.AxisHelper( 5 );//new THREE.ArrowHelper( new THREE.Vector3( 0, 1, 0 ), new THREE.Vector3( 0, 0, 0 ), 50 );
    		    //mesh=new THREE.Mesh(geo01, matBone); mesh.scale.set( s[0], s[1], s[2] );
    		    mesh = new THREE.Object3D();
    		    var Bmat = new THREE.MeshBasicMaterial( { map: bonesFlag(boneindex), side:THREE.DoubleSide } );
    		    meshFlag=new THREE.Mesh(geo00, Bmat ); mesh.scale.set( s[0], s[1], s[2] ); 
    		    mesh.add(meshFlag);
    		    mesh.add(axe);
    		    boneindex++;
    		break; // bone
    		case 11: mesh = new THREE.Mesh(geo04b, poolMaterial[Math.floor((Math.random()*16))]); mesh.scale.set( s[0], s[0], s[0] ); break; // sphere

    		case 12: mesh = new THREE.Object3D();//new THREE.Mesh(geo02b, mat02);
    		m2 = getMeshByName('gyro');
    		m2.material = matGyro;
    		m2.children[0].material = matGyro;
    		m2.children[0].children[0].material = matGyro;
    		m2.children[0].children[0].children[0].material = matGyro;
    		m2.scale.set( s[0], s[0], s[0] );
    		break; // gyro
    		case 13: 
    		    mesh = new THREE.Mesh(getMeshByName('carBody').geometry, mat02); 
    		    mesh.scale.set( 100, 100, 100 );break; // carBody

    		case 14: 
    		    mesh = new THREE.Object3D();//new THREE.Mesh(geo01b, mat01); 
    		    //mesh.visible = false;
    		   // mesh.scale.set( s[0], s[1], s[2] );
    		    m2 = getMeshByName('vanBody');//new THREE.Mesh(getMeshByName('vanBody').geometry, mat02);  //getSeaGeometry(name, scale, axe);
    		    m2.material = mat02;
    		    m2.children[0].material = mat02;
    		    m2.children[1].material = mat02;
    		    m2.children[2].material = mat02;
    		   // scaleGeometry(m2.geometry,3,'x');
    		    m2.scale.set( 3, 3, 3 );
    		break; // carBody
    		case 15:
    		    mesh = new THREE.Mesh(getMeshByName('vanWheel').geometry, mat03);//getMeshByName('vanWheel', 3, 'x');//
    		    //mesh.material = mat03;
    		    //scaleGeometry(mesh.geometry,1,'x');

    		    mesh.scale.set( 3,3, 3 );
    		break
    	}
    	mesh.position.y = -10000;
    	content.add( mesh );
    	if(m2!==null)content.add( m2 );
    	//if(m3!==null)content.add( m3 );
    	if(data.types[i]!==10){
    		mesh.receiveShadow = true;
    		mesh.castShadow = true;
    	}
    }
    if(data.demo === 3) addSnake();
    if(data.demo === 6) addSila();

   //lightsAnimation(2, 0.5, 0, 90, 500);
    //center = new THREE.Vector3(0,150,0);

   // moveCamera();
    cameraFollow(new THREE.Vector3(0,150,0));

}


function clearContent(){

	var obj, i;
    for ( i = content.children.length - 1; i >= 0 ; i -- ) {
			obj = content.children[ i ];
			content.remove(obj);
	}

	//lightsAnimation(0.5, 0, 180, 90, 0);
}

function addSnake(s) {
	if(s==null) s = [10,10,10];
	var mesh = new THREE.SkinnedMesh( getMeshByName('snake').geometry, mat05 );
	mesh.material = mat05;
	mesh.scale.set( s[0], s[1], -s[2] );
	content.add( mesh );
	mesh.receiveShadow = true;
	mesh.castShadow = true;

	/*var n = mesh.bones.length;
	var e;
	for (var i=0; i!==n ; i++){
	  e = new THREE.AxisHelper( 10 )
		content.add( e );

		e.position.x = mesh.bones[i].position.x;
		e.position.y = mesh.bones[i].position.y+90;
		e.position.z = mesh.bones[i].position.z-30;

		e.rotation.x = mesh.bones[i].rotation.x;
		e.rotation.y = mesh.bones[i].rotation.y;
		e.rotation.z = mesh.bones[i].rotation.z;
	}*/
}


function updateSnake() {
	var mesh = content.children[10];
	var ref, pos, mtx, rot;
	for (var i=0; i!== mesh.bones.length; i++){
		ref = content.children[i];
		rot = ref.rotation;
		pos = ref.position;

		mesh.bones[i].position.set(pos.x/10, pos.y/10, -pos.z /10);

        mesh.bones[i].rotation.set( -rot.x, -rot.y+180*ToRad,-rot.z+90*ToRad);
        //mesh.bones[i].rotation.set( -rot.x, -rot.y+180*ToRad,-rot.z-270*ToRad);
         
		mesh.bones[i].matrixAutoUpdate = true;
		mesh.bones[i].matrixWorldNeedsUpdate = true;
	}
}

// for ragdoll test
function addSila(s) {
	if(s==null) s = [1,1,1];
	var mesh = new THREE.SkinnedMesh( getMeshByName('sila').geometry, mat08 );
	mesh.material = mat08;
	mesh.scale.set( s[0], s[1], s[2] );
	//mesh.position.y=90;
	content.add( mesh );
	mesh.receiveShadow = true;
	mesh.castShadow = true;

	var n = mesh.bones.length;
	var e;
	for (var i=0; i!==n ; i++){
	  e = new THREE.AxisHelper( 10 )
		content.add( e );
		var mtx = mesh.bones[i].matrix//matrixWorld;

		e.position.x = mesh.bones[i].position.x;
		e.position.y = mesh.bones[i].position.y+90;
		e.position.z = mesh.bones[i].position.z-30;

		e.rotation.x = mesh.bones[i].rotation.x;
		e.rotation.y = mesh.bones[i].rotation.y;
		e.rotation.z = mesh.bones[i].rotation.z;

		//e.rotation.setFromRotationMatrix( mtx );
	}
}

function updateSila() {
	var mesh = content.children[23];
	var ref, pos, mtx, rot;
	for (var i=0; i!== mesh.bones.length; i++){
		ref = content.children[i];
		rot = ref.rotation;
		pos = ref.position;

		//mesh.bones[i].position.set(pos.x, pos.y, -pos.z);
		mesh.bones[i].position.set( pos.x, pos.y, pos.z);
	//	mesh.bones[i].rotation.set( rot.x, rot.y, rot.z);
mesh.bones[i].rotation.set( rot.y, rot.x, rot.z);
//mesh.bones[i].rotation.set( rot.z+180*ToRad, rot.x+180*ToRad, rot.y+180*ToRad);
        //mesh.bones[i].rotation.set( -rot.x+0*ToRad, -rot.y-180*ToRad, -rot.z-180*ToRad);
       // mesh.bones[i].rotation.set( -rot.x, -rot.y+180*ToRad,-rot.z-90*ToRad);
         
		mesh.bones[i].matrixAutoUpdate = true;
		mesh.bones[i].matrixWorldNeedsUpdate = true;
	}
}

function getSqueletonStructure(name){
	var mesh = new THREE.SkinnedMesh( getMeshByName(name).geometry, null );
	mesh.scale.set( 1, 1, 1 );
	var pos = [];
	var rot = [];

	if(mesh.bones.length!==0){
		var n = mesh.bones.length;
		for (var i=0; i!==n ; i++){
			//pos[i] = [(mesh.bones[i].position.x*0.01).toFixed(3), ((mesh.bones[i].position.y+90)*0.01).toFixed(3), (mesh.bones[i].position.z*0.01).toFixed(3)];
			//rot[i] = [mesh.bones[i].rotation.x, mesh.bones[i].rotation.y, mesh.bones[i].rotation.z];

			pos[i] = [(mesh.bones[i].position.x*0.01).toFixed(3), ((mesh.bones[i].position.y+90)*0.01).toFixed(3), (mesh.bones[i].position.z*0.01).toFixed(3)];
			//rot[i] = [ mesh.bones[i].rotation.y+0*ToRad, mesh.bones[i].rotation.x+0*ToRad, -mesh.bones[i].rotation.z-0*ToRad];
			rot[i] = [ mesh.bones[i].rotation.x-0*ToRad, mesh.bones[i].rotation.y+0*ToRad, mesh.bones[i].rotation.z+0*ToRad];
			//rot[i] = [ -mesh.bones[i].rotation.x+180*ToRad, mesh.bones[i].rotation.y-180*ToRad, -mesh.bones[i].rotation.z-0*ToRad];
			//rot[i] = [ mesh.bones[i].rotation.y+90*ToRad, mesh.bones[i].rotation.z+180*ToRad, -mesh.bones[i].rotation.x+270*ToRad];
			//rot[i] = [ -mesh.bones[i].rotation.x+90*ToRad, -mesh.bones[i].rotation.y+180*ToRad, -mesh.bones[i].rotation.z+90*ToRad];
			//rot[i] = [ mesh.bones[i].rotation.y+0*ToRad, -mesh.bones[i].rotation.z+0*ToRad, -mesh.bones[i].rotation.x+0*ToRad];
		//}
		}
		OimoWorker.postMessage({tell:"BONESLIST", pos:pos, rot:rot });
	}
}

//-----------------------------------------------------
//  LIGHT
//-----------------------------------------------------

var lightPos={horizontal: 180, vertical: 90, distance: 0, color:0xffffff};

function initLights() {
	//var ambient = new THREE.AmbientLight( 0xFFFFFF);
	//scene.add( ambient );

	lights[0] = new THREE.DirectionalLight( 0xffffff );
	/*lights[0] = new THREE.SpotLight( 0xffffff, 1, 0, Math.PI/2, 1 );
	lights[0].position.set( 0, 1500, 1000 );
	lights[0].target.position.set( 0, 0, 0 );
	lights[0].shadowCameraNear = 700;
				lights[0].shadowCameraFar = 4000;
				lights[0].shadowCameraFov = 50;

				

				//light.shadowCameraVisible = true;

				lights[0].shadowBias = 0.0001;
				lights[0].shadowDarkness = 0.5;

				lights[0].shadowMapWidth = 1024;
				lights[0].shadowMapHeight = 1024;*/
	lights[0].intensity = 1.3;
	lights[0].castShadow = true;

	lights[0].shadowCameraNear = 500;
	lights[0].shadowCameraFar = 2000;
	
	lights[0].shadowMapBias = 0.0001;
	lights[0].shadowMapDarkness = 0.5;
	lights[0].shadowMapWidth = 1024;
	lights[0].shadowMapHeight = 1024;

	var lightSize = 2000;

	lights[0].shadowCameraLeft = -lightSize;
	lights[0].shadowCameraRight = lightSize;
	lights[0].shadowCameraTop = lightSize;
	lights[0].shadowCameraBottom = -lightSize;

	lights[0].position.copy( Orbit(center , 35, 45, 1000));
	lights[0].target.position.copy(center);
	//lights[0].lookAt(center);

	scene.add(lights[0]);

	/*lights[1] = new THREE.PointLight( 0x303030, 2 );
	//lights[1].position.set( 200, -500, 500 );
	lights[1].position.copy( Orbit(center , -35, -45, 1000));
	scene.add( lights[1] );*/
	/*lights[2] = new THREE.PointLight( 0x00ff00, 1, 800 );
	scene.add( lights[2] );
	lights[3] = new THREE.PointLight( 0x0000ff, 1, 800 );
	scene.add( lights[3] );

	// visible light
	geometry = new THREE.SphereGeometry( 10,12,12 );
	var sphereA = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: 0xff0000, transparent:true, opacity:0.33} ) );
	var sphereB = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: 0x00ff00, transparent:true, opacity:0.33} ) );
	var sphereC = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: 0x0000ff, transparent:true, opacity:0.33} ) );
	sphereA.material.blending = THREE[ "AdditiveBlending" ];
	sphereB.material.blending = THREE[ "AdditiveBlending" ];
	sphereC.material.blending = THREE[ "AdditiveBlending" ];

	lights[1].add(sphereA);
	lights[2].add(sphereB);
	lights[3].add(sphereC);

	lightsAnimation(0, 0, 180, 90, 0);*/
	//lightsAnimation(3, 3, 0, 90, 500);
}

function lightsAnimation(time, delay, h, v, d, c) {
	//TweenLite.to(lightPos, time, {horizontal: h, vertical: v, distance: d, onUpdate: moveLights, delay:delay });
}

function moveLights(vect) {
	lights[0].position.copy( Orbit(center , 35, 45, 1000));
	lights[0].target.position.copy(center);
	//lights[1].position.copy( Orbit(center , 35, 45, -1000));

	/*
	lights[1].position.copy( Orbit(center , lightPos.horizontal, lightPos.vertical, lightPos.distance));
	lights[2].position.copy( Orbit(center , lightPos.horizontal-120, lightPos.vertical, lightPos.distance));
	lights[3].position.copy( Orbit(center , lightPos.horizontal+120, lightPos.vertical, lightPos.distance));
	*/
}

//-----------------------------------------------------
//  BG OBJECT
//-----------------------------------------------------
var planeBG, sphereBG;

function initObject() {
	// ground
	planeBG = new THREE.Mesh( new THREE.PlaneGeometry( 8000,8000 ), groundMat );
	planeBG.rotation.x = (-90)*ToRad;
	//planeBG.position.y =-2
	scene.add(planeBG);
	planeBG.receiveShadow = true;
	planeBG.castShadow = false;

	// bg Sphere
	sphereBG=new THREE.Mesh(new THREE.IcosahedronGeometry(2000,1),sphereMaterial);
	sceneBG.add(sphereBG);
	sphereBG.receiveShadow = false;
	sphereBG.castShadow = false;
}

function resetBgObject(){
	planeBG.position.set(0, 0, 0);
	sphereBG.position.set(0, 0, 0);
}

//-----------------------------------------------------
//  DEFINE FINAL GEOMETRY
//-----------------------------------------------------
var geo00 = new THREE.PlaneGeometry( 1, 1 );
//var geo01 = new THREE.CubeGeometry( 1, 1, 1 );
var geo02 = new THREE.SphereGeometry( 1, 32, 16 );
var geo03 = new THREE.CylinderGeometry( 1, 1, 1, 16 );
var geo04 = new THREE.SphereGeometry( 1, 32, 16 );

var geo00b = THREE.BufferGeometryUtils.fromGeometry( geo00 );
var geo01b; //= THREE.BufferGeometryUtils.fromGeometry( geo01 );
var geo02b = THREE.BufferGeometryUtils.fromGeometry( geo02 );
var geo03b = THREE.BufferGeometryUtils.fromGeometry( geo03 );
var geo04b = THREE.BufferGeometryUtils.fromGeometry( geo04 );
var diceBuffer;
var colomnBuffer;
var colomnBaseBuffer;
var colomnTopBuffer;

var defineGeometry = function(){
	if(isBuffered){
		geo01b = THREE.BufferGeometryUtils.fromGeometry(getSeaGeometry('box'));
		diceBuffer = THREE.BufferGeometryUtils.fromGeometry(getSeaGeometry('dice'));
		colomnBuffer = THREE.BufferGeometryUtils.fromGeometry(getSeaGeometry('column'));
		colomnBaseBuffer = THREE.BufferGeometryUtils.fromGeometry(getSeaGeometry('columnBase'));
		colomnTopBuffer = THREE.BufferGeometryUtils.fromGeometry(getSeaGeometry('columnTop'));
    } else {
    	geo01b = getSeaGeometry('box');
    	diceBuffer = getSeaGeometry('dice');
		colomnBuffer = getSeaGeometry('column');
		colomnBaseBuffer = getSeaGeometry('columnBase');
		colomnTopBuffer = getSeaGeometry('columnTop');
    }
}

//-----------------------------------------------------
//  SEA3D IMPORT
//-----------------------------------------------------

var seaList = ['dice_low', 'snake', 'wheel', 'column', 'sila', 'gyro', 'van', 'box'];
var seaN = 0;

var initSea3DMesh = function (){
	var name = seaList[seaN];
	var SeaLoader = new THREE.SEA3D(true);
	
	SeaLoader.onComplete = function( e ) {
		for (var i=0; i !== SeaLoader.meshes.length; i++){
			if(SeaLoader.meshes[i].name ==="carBody"){scaleGeometry(SeaLoader.meshes[i].geometry)}
			if(SeaLoader.meshes[i].name ==="wheel"){scaleGeometry(SeaLoader.meshes[i].geometry)}
			if(SeaLoader.meshes[i].name ==="vanWheel")scaleGeometry(SeaLoader.meshes[i].geometry);
			if(SeaLoader.meshes[i].name ==="vanBody"){
				scaleGeometry(SeaLoader.meshes[i].geometry, 1, 'x');
				scaleGeometry(SeaLoader.meshes[i].children[0].geometry, 1, 'z');
    		    scaleGeometry(SeaLoader.meshes[i].children[1].geometry, 1, 'z');
    		    scaleGeometry(SeaLoader.meshes[i].children[2].geometry, 1, 'x');
			}
			if(SeaLoader.meshes[i].name ==="gyro"){
				scaleGeometry(SeaLoader.meshes[i].geometry, 1, 'x');
				scaleGeometry(SeaLoader.meshes[i].children[0].geometry, 1, 'z');
    		    scaleGeometry(SeaLoader.meshes[i].children[0].children[0].geometry, 1, 'z');
    		    scaleGeometry(SeaLoader.meshes[i].children[0].children[0].children[0].geometry, 1, 'x');
			}
			meshs.push( SeaLoader.meshes[i] );
		}
		// load Next
		seaN++;
		if(seaList[seaN]!=null)initSea3DMesh();
		else{
			defineGeometry();
			mainAllObjectLoaded();
			isLoading = false;

			onThreeChangeView(45,60,1000);
			update();
		} 
	}

	SeaLoader.load( 'models/'+name+'.sea' );
	loadInfo.innerHTML = "Loading sea3d model : "+ name;
}

var getSeaGeometry = function (name, scale, axe){
	var a = axe || "z";
	var s = scale || 1;
	var g = getMeshByName(name).geometry;
	scaleGeometry(g, s, a);
	return g;
}

var getMeshByName = function (name){
	//var s = scale || -1;
	for (var i=0; i !== meshs.length; i++){
		if(meshs[i].name === name){
			//if(s!==-1)scaleGeometry(meshs[i].geometry, scale, axe);
			return meshs[i];
		} 
	} 
}

var scaleGeometry = function (geometry, scale, Axe) {
	var s = 1;//scale || 1;
	var axe = Axe || 'z' 
	for( var i = 0; i < geometry.vertices.length; i++) {
		var vertex	= geometry.vertices[i];
		if(axe==='x')vertex.x *= -s;
		else vertex.x *= s;
		if(axe==='y')vertex.y *= -s;
		else vertex.y *= s;
		if(axe==='z')vertex.z *= -s;
		else vertex.z *= s;
	}
	geometry.computeFaceNormals();
	geometry.computeCentroids();
	geometry.computeVertexNormals();
	geometry.verticesNeedUpdate = true;
}

//-----------------------------------------------------
//  EVENT
//-----------------------------------------------------

function startRender() {
    if(!renderLoop) renderLoop = setInterval( function () { requestAnimationFrame( update ); }, 1000 / 60 );
}

function stopRender() {
	if(renderLoop) {clearInterval(renderLoop); renderLoop = null;}
}

function update() {
	//var delta = clock.getDelta();

	requestAnimationFrame( update, renderer.domElement );
	stats.begin();


	
	renderNoise+=(nRenderNoise-renderNoise)*.2;
	setNoise(renderNoise);

	//render(delta);

	/*collisionDetector ();

	//delta = clock.getDelta();
	//THREE.AnimationHandler.update( delta*0.5 );
	//updatePlayerMove();

	if(!isOptimized){
	// groundMirror.renderWithMirror( verticalMirror );
	//verticalMirror.renderWithMirror( groundMirror );
	}*/
	//renderer.clear();
	renderer.render( sceneBG, cameraBG );
	renderer.render( scene, camera );
	
	//Ambience.update((-camPos.horizontal-180)*ToRad, (camPos.vertical-135)*ToRad);

	stats.end();
	//fpsUpdate();
}

function viewRender() {
	renderer.render( scene, camera );
	fpsUpdate();
}

function fpsUpdate() {
    time = Date.now();
    if (time - 1000 > time_prev) { time_prev = time; fpstxt = fps; fps = 0; } 
    fps++;
}



//-----------------------------------------------------
//  PLAYER MOVE
//-----------------------------------------------------

/*function updatePlayerMove() {
	var n = currentPlayer;
	
	if ( key[0] ) controls.speed = clamp( controls.speed + delta * controls.acceleration, -controls.maxSpeed, controls.maxSpeed );
	if ( key[1] ) controls.speed = clamp( controls.speed - delta * controls.acceleration, -controls.maxSpeed, controls.maxSpeed );
	if ( key[2] ) controls.rotation += delta * controls.angularSpeed;
	if ( key[3] ) controls.rotation -= delta * controls.angularSpeed;
	if ( key[3] || key[2]) controls.speed = clamp( controls.speed + 1 * delta * controls.acceleration, -controls.maxSpeed, controls.maxSpeed );

	// speed decay
	if ( ! ( key[0] || key[1]) ) {
		if ( controls.speed > 0 ) {
			var k = exponentialEaseOut( controls.speed / controls.maxSpeed );
			controls.speed = clamp( controls.speed - k * delta * controls.acceleration, 0, controls.maxSpeed );
		} else {
			var k = exponentialEaseOut( controls.speed / (-controls.maxSpeed) );
			controls.speed = clamp( controls.speed + k * delta * controls.acceleration, -controls.maxSpeed, 0 );
		}
	}

	// displacement
	var forwardDelta = controls.speed * delta;
	controls.vx = Math.sin( controls.rotation ) * forwardDelta;
	controls.vz = Math.cos( controls.rotation ) * forwardDelta;

	if(players[n]){
		players[n].rotation.y = controls.rotation;
		players[n].position.x += controls.vx;
		players[n].position.z += controls.vz;
		// animation
		if (key[0]){ if (players[n].currentAnimation.name == "idle") players[n].play("walk");}
		else if (key[1]){ if (players[n].currentAnimation.name == "idle") players[n].play("walk");}
		else{ if(players[n].currentAnimation.name == "walk") players[n].play("idle");}
		// camera follow
		center.copy(players[n].position);
	    moveCamera();
	}
}*/

//-----------------------------------------------------
//  KEYBOARD
//-----------------------------------------------------

var key = [0, 0, 0, 0, 0, 0, 0, 0];

function onKeyDown ( event ) {
	switch ( event.keyCode ) {
	    case 38: case 87: case 90: key[0]=1; break; // up, W, Z
		case 40: case 83:          key[1]=1; break; // down, S
		case 37: case 65: case 81: key[2]=1; break; // left, A, Q
		case 39: case 68:          key[3]=1; break; // right, D
		case 69:                   key[4]=1; break; // E
		case 82:                   key[5]=1; break; // R
		case 32:                   key[6]=1; break; // space
		case 17: case 67:          key[7]=1; break; // ctrl, C
	}
	sendKey();
}

function onKeyUp ( event ) {
	switch( event.keyCode ) {
		case 38: case 87: case 90: key[0]=0; break; // up, W, Z
		case 40: case 83:          key[1]=0; break; // down, S
		case 37: case 65: case 81: key[2]=0; break; // left, A, Q
		case 39: case 68:          key[3]=0; break; // right, D
		case 69:                   key[4]=0; break; // E
		case 82:                   key[5]=0; break; // R
		case 32:                   key[6]=0; break; // space          
		case 17: case 67:          key[7]=0; break; // ctrl, C
	}
	sendKey();
}

//-----------------------------------------------------
//  MOUSE COLLISION DETECTION
//-----------------------------------------------------

function rayTest(sh) {
	if ( content.children.length ) {
		var vector = new THREE.Vector3( mouse.mx, mouse.my, 1 );
		projector.unprojectVector( vector, camera );
		raycaster.set( camera.position, vector.sub( camera.position ).normalize() );
		var intersects = raycaster.intersectObjects( content.children, true );
		if ( intersects.length ) {
			//marker.position.set( 0, 0, 0 );
			//if(intersects[0].face!==null)marker.lookAt(intersects[0].face.normal);
			marker.position.copy( intersects[0].point );
			
			//if(sh)shoot();
	    }
	}
}

//-----------------------------------------------------
//  MOUSE
//-----------------------------------------------------

function onMouseOut() {
	if(cursor){
	    document.body.style.cursor = 'auto';
	    cursorUp.style.visibility = 'hidden';
	    cursorDown.style.visibility = 'hidden';
	    mouse.over = false;
	}
}

function onMouseOver() {
	if(cursor){
		document.body.style.cursor = 'none';
    	cursorUp.style.visibility = 'visible';
    	mouse.over = true;
    }
}

function onMouseDown(e) {
	if(vue_size!==-1){if(e.clientY > (sizeListe[vue_size].h+50)) return;}
	mouse.ox = e.clientX;
	mouse.oy = e.clientY;
	mouse.h = camPos.horizontal;
	mouse.v = camPos.vertical;

	
	//var decalx = (vsize.x - sizeListe[vue_size].w)*0.5;
	//var decaly = (vsize.y - sizeListe[vue_size].h)*0.5;

    mouse.mx = ( e.clientX / vsize.x ) * 2 - 1;
	//mouse.my = - ( e.clientY / (vsize.y+50) ) * 2 + 1;

	//
	//mouse.mx = ( e.clientX / sizeListe[size].w ) * 2 - 1;
	if(vue_size!==-1){
		mouse.mx = ( e.clientX / vsize.x ) * 2 - 1;
		mouse.my = - ( e.clientY / (sizeListe[vue_size].h+100) ) * 2 + 1;
	}
	else {
		mouse.mx = ( e.clientX / vsize.x ) * 2 - 1;
		mouse.my = - ( e.clientY / vsize.y ) * 2 + 1;
	}

	//mouse.mx = ( (e.clientX-decalx) / (sizeListe[size].w) ) * 2 - 1;
	//mouse.my = - ( (e.clientY) / (sizeListe[size].h+decaly) ) * 2 + 1;


	mouse.down = true;

	rayTest(false);

	if(cursor && mouse.over){
		cursorUp.style.visibility = 'hidden';
		cursorDown.style.visibility = 'visible';
	}
}

function onMouseUp(e) {
	mouse.down = false;
	document.body.style.cursor = 'auto';
	if(cursor && mouse.over){
		cursorUp.style.visibility = 'visible';
		cursorDown.style.visibility = 'hidden';
	}
}

function onMouseMove(e) {
	e.preventDefault();
	if(cursor && mouse.over){
	    cursor.style.left = e.clientX+"px";
	    cursor.style.top = e.clientY+"px";
    } 
	if (mouse.down && !camPos.automove ) {
		document.body.style.cursor = 'move';
		mouse.x = e.clientX;
		mouse.y = e.clientY;
		camPos.horizontal = ((mouse.x - mouse.ox) * 0.3) + mouse.h;
		camPos.vertical = (-(mouse.y - mouse.oy) * 0.3) + mouse.v;
		moveCamera();
	}
}

function onTouchMove(e) { 
	e.preventDefault();
	var touchId = e.changedTouches[0].identifier;
	if(cursor){
	    cursor.style.left = e.touches[touchId].clientX+"px";
	    cursor.style.top = e.touches[touchId].clientY+"px";
    }
    if (mouse.down && !camPos.automove ) {
    	document.body.style.cursor = 'move';
		mouse.x = e.touches[touchId].clientX;
		mouse.y =  e.touches[touchId].clientY;
		camPos.horizontal = (-(mouse.x - mouse.ox) * 0.3) + mouse.h;
		camPos.vertical = (-(mouse.y - mouse.oy) * 0.3) + mouse.v;
		moveCamera();
    }
}

/*function onMouseWheel(e) {
	var delta = 0;
	var m;
	if ( e.wheelDelta ){ delta = e.wheelDelta; m=true}
	else if ( e.detail ) { delta = - e.detail; m=false}
	if(m)camPos.distance-=delta;
	else camPos.distance-=delta*10;
	moveCamera();
}*/

function onMouseWheel(e) {
	var delta = 0;
	if(e.wheelDeltaY){delta=e.wheelDeltaY*0.01;}
	else if(e.wheelDelta){delta=e.wheelDelta*0.05;}
	else if(e.detail){delta=-e.detail*1.0;}
	camPos.distance-=(delta*10);
	moveCamera();
}

//-----------------------------------------------------
//  CAMERA
//-----------------------------------------------------
var cam = [0,0];

function moveCamera() {
	camera.position.copy(Orbit(center, camPos.horizontal, camPos.vertical, camPos.distance, true));
	camera.lookAt(center);

	cameraBG.position.copy(Orbit(center, camPos.horizontal, camPos.vertical, camPos.distance, true));
	cameraBG.lookAt(center);

	sendCameraOrientation();
}

function endMove() {
	camPos.automove = false;
}

function onThreeChangeView(h, v, d) {
	TweenLite.to(camPos, 3, {horizontal: h, vertical: v, distance: d, onUpdate: moveCamera, onComplete: endMove });
	camPos.automove = true;
}

function cameraFollow(vec){
	center.copy(vec);
	planeBG.position.set(vec.x, 0, vec.z);
	sphereBG.position.copy(vec);
	moveLights();
	moveCamera();
}



//-----------------------------------------------------
//  MATH
//-----------------------------------------------------

function exponentialEaseOut( v ) { return v === 1 ? 1 : - Math.pow( 2, - 10 * v ) + 1; };

function clamp(a,b,c) { return Math.max(b,Math.min(c,a)); }

function Orbit(origine, horizontal, vertical, distance, isCamera) {
	var p = new THREE.Vector3();
	//var phi = vertical*ToRad;
	//var theta = horizontal*ToRad;
	var phi = unwrapDegrees(vertical)*ToRad;
	var theta = unwrapDegrees(horizontal)*ToRad;
	if(isCamera!==null){
		cam[0] = phi;
		cam[1] = theta;
	}
	p.x = (distance * Math.sin(phi) * Math.cos(theta)) + origine.x;
	p.z = (distance * Math.sin(phi) * Math.sin(theta)) + origine.z;
	p.y = (distance * Math.cos(phi)) + origine.y;
	return p;
}

function unwrapDegrees(r) {
	r = r % 360;
	if (r > 180) r -= 360;
	if (r < -180) r += 360;
	return r;
}

function getDistance (x1, y1, x2, y2) {
	return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
}

//-----------------------------------------------------
//  SKY BOX
//-----------------------------------------------------

/*var skyCube;

function addSkyBox() {
	var r = "textures/cube/sky5/";
	var urls = [ r + "posx.jpg", r + "negx.jpg",
				 r + "posy.jpg", r + "negy.jpg",
				 r + "posz.jpg", r + "negz.jpg" ];

	skyCube = THREE.ImageUtils.loadTextureCube( urls );
	skyCube.format = THREE.RGBFormat;
	var shader = THREE.ShaderLib[ "cube" ];
	shader.uniforms[ "tCube" ].value = skyCube;

	var material = new THREE.ShaderMaterial( {
	fragmentShader: shader.fragmentShader,
	vertexShader: shader.vertexShader,
	uniforms: shader.uniforms,
	depthWrite: false,
	side: THREE.BackSide
	} );

	var sky = new THREE.Mesh( new THREE.CubeGeometry( FAR, FAR, FAR ), material );
	scene.add( sky );
}*/

//-----------------------------------------------------
//  RESIZE
//-----------------------------------------------------
//                 0          1       2      3       4        5           6
var divListe= ["container", "info", "titre", "menu", "debug", "option", "loader"];
var sizeListe = [{w:640, h:480, n:0}, {w:1024, h:640, n:1}, {w:1280, h:768, n:2}];
var vue_size =  -1;

function resize(w, h) {
	vsize = { x:w, y:h, z:w/h };
	camPos.w = w;
	camPos.h = h;
	
	camera.aspect = w/h;
	camera.updateProjectionMatrix();
	cameraBG.aspect = w/h;
	cameraBG.updateProjectionMatrix();
	renderer.setSize( w, h );
	if(sphereMaterial)sphereMaterial.uniforms.resolution.value.set(w,h);
}

function rz2(){
	var w = window.innerWidth;
	var h = window.innerHeight;
	resize(w,h);
}

function defaultIfResize(){
	container.style.top = "50px";
	container.style.border = "1px solid #303030";
}

function rz(){
	var w = window.innerWidth;
	var h = window.innerHeight;
	vsize = { x:w, y:h, z:w/h };
	if(w < 1024 || h < 680 ) fullResize(0);
	else if(w > 1300 && h>830 ) fullResize(2);
	else fullResize(1);
}

function fullResize(n){
	if(n === vue_size) return;
	vue_size = n;
	var w = sizeListe[n].w;
	var mw = sizeListe[n].w*0.5;
	var h = sizeListe[n].h;
	var div;
	for(var i=0; i< divListe.length; ++i){
		div = document.getElementById( divListe[i] );
		if(i!==2 && i!==4 && i!==5)div.style.width = w+"px";
		div.style.left = "calc(50% - "+mw+"px)";
		if(i==0)div.style.height = h+"px";
		if(i==6 && isLoading)div.style.height = h+"px";
		else if (i==1 || i==5 )div.style.top = h+55+"px";
	}
	resize(w,h);
}