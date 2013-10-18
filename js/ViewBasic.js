var container, renderer, scene, camera, renderLoop;

var camPos = {w: 100, h:100, horizontal: 40, vertical: 60, distance: 2000, automove: false};
var mouse = {x: 0, y: 0, down: false, over:false, ox: 0, oy: 0, h: 0, v: 0};
var center = new THREE.Vector3(0,150,0);

var delta, clock = new THREE.Clock();
var fpstxt, time, time_prev = 0, fps = 0;
var phytxt='' ,time2, time_prev2 = 0, fps2 = 0;

var lights = [];
var meshs = [];
var players = [];
var materials = [];

var currentPlay;
var character=0;
var currentPlayer = 1;
var key = { front:false, back:false, left:false, right:false, jump:false, crouch:false };
var controls = { rotation: 0, speed: 0, vx: 0, vz: 0, maxSpeed: 275, acceleration: 600, angularSpeed: 2.5};
var cursor, cursorUp, cursorDown;

var groundMat, mat01, mat02, mat03, mat04, mat01sleep, mat02sleep, mat03sleep, mat04sleep;

var geo01 = new THREE.CubeGeometry( 1, 1, 1 );
var geo02 = new THREE.SphereGeometry( 1, 22, 26 );
var geo03 = new THREE.CylinderGeometry( 1, 1, 1, 26 );

var ToRad = Math.PI / 180;
var content;

var isOptimized;
var antialias;

//-----------------------------------------------------
//  INIT VIEW
//-----------------------------------------------------

function initThree(option) {
	if(!option)option = {};
	isOptimized = option.optimized || false;
	character = option.n || 1;
	if(!isOptimized)antialias = true;
	else antialias = false

	renderer = new THREE.WebGLRenderer({ antialias:antialias });
	renderer.setClearColor( 0x181818, 1 );
	renderer.physicallyBasedShading = true;
	renderer.gammaOutput = true;
	renderer.gammaInput = true;

	scene = new THREE.Scene();
	
	camera = new THREE.PerspectiveCamera( 60, 1, 1, 4000 );
	scene.add(camera);
	moveCamera();

	container = document.getElementById( "container" );
	resize( container.clientWidth, container.clientHeight);
	container.appendChild( renderer.domElement );

	document.addEventListener( 'mousemove', onMouseMove, false );
	document.addEventListener( 'touchmove', onTouchMove, false );
	document.addEventListener( 'mousedown', onMouseDown, false );
	document.addEventListener( 'mouseup', onMouseUp, false );
	document.addEventListener( 'mousewheel', onMouseWheel, false );
	document.addEventListener( 'DOMMouseScroll', onMouseWheel, false ); // firefox
	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );

	if(option.mouse) customCursor();
	if(option.autoSize){ window.addEventListener( 'resize', rz, false ); rz();}

	content = new THREE.Object3D();
	scene.add(content);

	if(!isOptimized){
	    renderer.shadowMapEnabled = true;
	    renderer.shadowMapSoft = true;
		scene.fog = new THREE.Fog( 0x181818 , 1000, 2000 );
		mirrorGround();
		initLights();
	}

	initMaterial();
	initObject();
	initSea3DMesh();

	onThreeChangeView(45,60,1000);

	fpstxt = document.getElementById( "fps" );

	

    //update();
    startRender();
}

function customCursor() {
	cursorUp = document.getElementById( 'cursorUp' );
	cursorDown = document.getElementById( 'cursorDown' );
	cursor = document.getElementById( 'cursor' );
	container.addEventListener( 'mouseover', onMouseOver, false );
	container.addEventListener( 'mouseout', onMouseOut, false );
}

/*function controlPlayer(n) {
	currentPlayer = n;
}*/

//-----------------------------------------------------
//  MATERIAL
//-----------------------------------------------------
var diceTexture, diceTextureSleep;

function initMaterial() {
	createDiceTexture(0);
	createDiceTexture(1);
	if(!isOptimized){
		groundMat =  new THREE.MeshPhongMaterial( { color: 0x303030, shininess:100, specular:0x303030} );
		mat01 = new THREE.MeshPhongMaterial( { color: 0xff9933, shininess:100, specular:0xffffff } );
		mat02 = new THREE.MeshPhongMaterial( { color: 0x3399ff, shininess:100, specular:0xffffff } );
		mat03 = new THREE.MeshPhongMaterial( { color: 0x33ff99, shininess:100, specular:0xffffff } );
		mat04 = new THREE.MeshPhongMaterial( { map: diceTexture, shininess:100, specular:0xffffff } );
		mat01sleep = new THREE.MeshPhongMaterial( { color: 0xffd9b2, shininess:100, specular:0xffffff } );
		mat02sleep = new THREE.MeshPhongMaterial( { color: 0xb2d9ff, shininess:100, specular:0xffffff } );
		mat03sleep = new THREE.MeshPhongMaterial( { color: 0xb2ffd9, shininess:100, specular:0xffffff } );
		mat04sleep = new THREE.MeshPhongMaterial( { map: diceTextureSleep, shininess:100, specular:0xffffff } );
	}else{
		groundMat = new THREE.MeshBasicMaterial( { color: 0x303030} );
		mat01 = new THREE.MeshBasicMaterial( { color: 0xff9933} );
		mat02 = new THREE.MeshBasicMaterial( { color: 0x3399ff} );
		mat03 = new THREE.MeshBasicMaterial( { color: 0x33ff99} );
		mat04 = new THREE.MeshBasicMaterial( { map: diceTexture} );
		mat01sleep = new THREE.MeshBasicMaterial( { color: 0xffd9b2} );
		mat02sleep = new THREE.MeshBasicMaterial( { color: 0xb2d9ff} );
		mat03sleep = new THREE.MeshBasicMaterial( { color: 0xb2ffd9} );
		mat04sleep = new THREE.MeshBasicMaterial( { map: diceTextureSleep} );
	}
	mat01.name = "mat01";
	mat02.name = "mat02";
	mat03.name = "mat03";
	mat04.name = "mat04";
	mat01sleep.name = "mat01sleep";
	mat02sleep.name = "mat02sleep";
	mat03sleep.name = "mat03sleep";
	mat04sleep.name = "mat04sleep";
}

function createDiceTexture(n) {
	var canvas = document.createElement("canvas");
	canvas.width = canvas.height = 256;
	var ctx = canvas.getContext("2d");
	ctx.fillStyle = "#EEEEEE";
	ctx.fillRect(0, 0, 256, 256);
	ctx.fillStyle = "#333333";
	ctx.fillRect(230, 0, 26, 256);
	ctx.fillStyle = "#ff3333";
	ctx.fillRect(230, 230, 26, 26);
	if(n==0){
		diceTexture = new THREE.Texture(canvas);
		diceTexture.needsUpdate = true;
    }else {
		ctx.fillStyle = 'rgba(0,0,0,0.4)';
	    ctx.fillRect(0, 0, 256, 256);
	    diceTextureSleep = new THREE.Texture(canvas);
	    diceTextureSleep.needsUpdate = true;
	}
}

//-----------------------------------------------------
//  PHYSICS
//-----------------------------------------------------

function clearContent(){
	var obj, i;
    for ( i = content.children.length - 1; i >= 0 ; i -- ) {
			obj = content.children[ i ];
			content.remove(obj);
	}
}

function addCube(s) {
	if(s==null) s = [50,50,50];//{x:50, y:50, z:50}; 
	var mesh = new THREE.Mesh(geo01, mat01);
	mesh.scale.set( s[0], s[1], s[2] );
	mesh.position.y = -10000;
	content.add( mesh );
	mesh.receiveShadow = true;
	mesh.castShadow = true;
}

function addSphere(s) {
	if(s==null) s = [25,25,25];//{x:25, y:50, z:25};//r = 25;
	var mesh = new THREE.Mesh(geo02, mat02);
	mesh.scale.set( s[0], s[0], s[0] );
	mesh.position.y = -10000;
	content.add( mesh );
	mesh.receiveShadow = true;
	mesh.castShadow = true;
}

function addCylinder(s) {
	if(s==null) s = [25,50,25];//{x:25, y:50, z:25};
	var mesh = new THREE.Mesh(geo03, mat03);
	mesh.scale.set( s[0], s[1], s[2] );
	mesh.position.y = -10000;
	content.add( mesh );
	mesh.receiveShadow = true;
	mesh.castShadow = true;
}

function addDice(s) {
	if(s==null) s = [50,50,50];
	var mesh = new THREE.Mesh(meshs[0].geometry, mat04);
	mesh.scale.set( s[0], s[1], -s[2] );
	mesh.position.y = -10000;
	content.add( mesh );
	mesh.receiveShadow = true;
	mesh.castShadow = true;
}


//-----------------------------------------------------
//  MIRROR
//-----------------------------------------------------

var groundMirror;
var verticalMirror;

function mirrorGround(){
	var planeGeo = new THREE.PlaneGeometry( 2000, 2000 );
	groundMirror = new THREE.Mirror( renderer, camera, { clipBias: 0.003, textureWidth: camPos.w, textureHeight: camPos.h, color: 0x303030} );
	groundMirror.receiveShadow = false;
	groundMirror.castShadow = false;

    var blendings = [ "NoBlending", "NormalBlending", "AdditiveBlending", "SubtractiveBlending", "MultiplyBlending", "AdditiveAlphaBlending" ];
	groundMirror.material.transparent = true;
	groundMirror.material.blending = THREE[ "AdditiveBlending" ];

	var mirrorMesh = new THREE.Mesh( planeGeo, groundMirror.material );
	mirrorMesh.add( groundMirror );
	mirrorMesh.rotateX( - Math.PI / 2 );
	mirrorMesh.y = 0;
	scene.add( mirrorMesh );

	verticalMirror = new THREE.Mirror( renderer, camera, { clipBias: 0.003, textureWidth: camPos.w, textureHeight: camPos.h, color:0x999999 } );
				
	var verticalMirrorMesh = new THREE.Mesh( new THREE.PlaneGeometry( 1000, 1000 ), verticalMirror.material );
	verticalMirrorMesh.add( verticalMirror );
	verticalMirrorMesh.position.y = 500;
	verticalMirrorMesh.position.x = -500;
	verticalMirrorMesh.rotation.y = (90)*ToRad;
	scene.add( verticalMirrorMesh );

	verticalMirrorMesh.visible = false;
}

//-----------------------------------------------------
//  LIGHT
//-----------------------------------------------------

function initLights() {
	lights[0] = new THREE.DirectionalLight( 0xffffff );
	lights[0].intensity = 1;
	lights[0].castShadow = true;

	lights[0].shadowCameraNear = 100;
	lights[0].shadowCameraFar = 2000;
	
	lights[0].shadowMapBias = 0.01;
	lights[0].shadowMapDarkness = 0.7;
	lights[0].shadowMapWidth = 1024;
	lights[0].shadowMapHeight = 1024;

	var lightSize = 1000;

	lights[0].shadowCameraLeft = -lightSize;
	lights[0].shadowCameraRight = lightSize;
	lights[0].shadowCameraTop = lightSize;
	lights[0].shadowCameraBottom = -lightSize;

	//sunLight.shadowCameraVisible = true;

	lights[0].position.copy( Orbit(center , 35, 45, 1000));
	lights[0].lookAt(center);

	scene.add(lights[0]);

	lights[1] = new THREE.PointLight( 0xff0000, 1, 800 );
	scene.add( lights[1] );
	lights[2] = new THREE.PointLight( 0x00ff00, 1, 800 );
	scene.add( lights[2] );
	lights[3] = new THREE.PointLight( 0x0000ff, 1, 800 );
	scene.add( lights[3] );

	lights[1].position.copy( Orbit(center , 0, 90, 400));
	lights[2].position.copy( Orbit(center , -120, 90, 400));
	lights[3].position.copy( Orbit(center , 120, 90, 400));
}

//-----------------------------------------------------
//  OBJECT
//-----------------------------------------------------

function initObject() {
	var geometry = new THREE.PlaneGeometry( 2000,2000 );
	var plane = new THREE.Mesh( geometry, groundMat );
	plane.rotation.x = (-90)*ToRad;
	plane.position.y =-2
	scene.add(plane);

	plane.receiveShadow = true;
	plane.castShadow = false;

	geometry = new THREE.SphereGeometry( 10,12,12 );
	var sphereA = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: 0xff0000} ) );
	var sphereB = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: 0x00ff00} ) );
	var sphereC = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: 0x0000ff} ) );
	sphereA.position.copy( Orbit(center , 0, 90, 400));
	sphereB.position.copy( Orbit(center , -120, 90, 400));
	sphereC.position.copy( Orbit(center , 120, 90, 400));
	scene.add(sphereA);
	scene.add(sphereB);
	scene.add(sphereC);
}

//-----------------------------------------------------
//  SEA3D IMPORT
//-----------------------------------------------------
var seaList = ['dice'];
var seaN = 0;

function initSea3DMesh(){
	var name = seaList[seaN];
	var loader = new THREE.SEA3D(false);
	

	loader.onComplete = function( e ) {
		for (var i=0; i !== loader.meshes.length; i++){
			meshs.push( loader.meshes[i] );
		}
		// load Next
		seaN++;
		if(seaList[seaN]!=null)initSea3DMesh();
		else mainAllObjectLoaded();
	}

	loader.load( 'models/'+name+'.sea' );
}

/*function addSea3DMesh() {
	players[0] = meshs[27+6];
	players[0].scale.set( 10, 10, -10 );
    players[0].position.set(100, 45, -100);
	players[0].material = new THREE.MeshPhongMaterial( { color: 0x808080, shininess:100, specular:0xffffff, skinning:true });
	players[0].play('idle');
	scene.add(players[0]);

	players[1] = meshs[27+character];
	players[1].scale.set( 10, 10, -10 );
	players[1].position.set(-100, 220, 0);
	players[1].material = new THREE.MeshPhongMaterial( { color: 0x808080, shininess:100, specular:0xffffff, skinning:true });
	players[1].play('idle');
	scene.add(players[1]);
	currentPlay = 'idle';
}

function threeChangeAnimation(){
	if (players.length>0){
		if (currentPlay == "idle") {
			currentPlay = "walk";
		} else {
			currentPlay = "idle";
		}
		players[0].play(currentPlay);
		players[1].play(currentPlay);
	}
}*/

//-----------------------------------------------------
//  EVENT
//-----------------------------------------------------

function startRender() {
	requestAnimationFrame( update );
    //if(!renderLoop) renderLoop = setInterval( function () { requestAnimationFrame( update ); }, 1000 / 60 );
}

function stopRender() {
	if(renderLoop) {clearInterval(renderLoop); renderLoop = null;}
}

function update() {
	requestAnimationFrame( update );

	//delta = clock.getDelta();
	//THREE.AnimationHandler.update( delta*0.5 );

	if(!isOptimized) groundMirror.renderWithMirror( verticalMirror );
	//verticalMirror.renderWithMirror( groundMirror );
	//updatePlayerMove();

	renderer.render( scene, camera );
	fpsUpdate();
}


function fpsUpdate() {
    time = Date.now();
    if (time - 1000 > time_prev) {
    	time_prev = time;
    	fpstxt.innerHTML = phytxt + "fps: " + fps;
    	fps = 0;
	} 
    fps++;
}

function resize(x, y) {
	camPos.w = x;
	camPos.h = y;
	camera.aspect = x/y;
	camera.updateProjectionMatrix();
	renderer.setSize( x, y );
}

//-----------------------------------------------------
//  PLAYER MOVE
//-----------------------------------------------------

/*function updatePlayerMove() {
	var n = currentPlayer;
	
	if ( key.front ) controls.speed = clamp( controls.speed + delta * controls.acceleration, -controls.maxSpeed, controls.maxSpeed );
	if ( key.back ) controls.speed = clamp( controls.speed - delta * controls.acceleration, -controls.maxSpeed, controls.maxSpeed );
	if ( key.left ) controls.rotation += delta * controls.angularSpeed;
	if ( key.right ) controls.rotation -= delta * controls.angularSpeed;
	if ( key.right || key.left) controls.speed = clamp( controls.speed + 1 * delta * controls.acceleration, -controls.maxSpeed, controls.maxSpeed );

	// speed decay
	if ( ! ( key.front || key.back) ) {
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
		if (key.front){ if (players[n].currentAnimation.name == "idle") players[n].play("walk");}
		else if (key.back){ if (players[n].currentAnimation.name == "idle") players[n].play("walk");}
		else{ if(players[n].currentAnimation.name == "walk") players[n].play("idle");}
		// camera follow
		center.copy(players[n].position);
	    moveCamera();
	}
}*/

//-----------------------------------------------------
//  KEYBOARD
//-----------------------------------------------------

function onKeyDown ( event ) {
	switch ( event.keyCode ) {
	    case 38: case 87: case 90: key.front = true; break; // up, W, Z
		case 40: case 83: key.back = true; break;           // down, S
		case 37: case 65: case 81: key.left = true; break;  // left, A, Q
		case 39: case 68: key.right = true; break;          // right, D
		case 17: case 67: key.crouch = false; break;        // ctrl, c
		case 32: key.jump = false; break;                   // space
	}
}

function onKeyUp ( event ) {
	switch( event.keyCode ) {
		case 38: case 87: case 90: key.front = false; break; // up, W, Z
		case 40: case 83: key.back = false; break;           // down, S
		case 37: case 65: case 81: key.left = false; break;  // left, A, Q
		case 39: case 68: key.right = false; break;          // right, D
		case 17: case 67: key.crouch = false; break;         // ctrl, c
		case 32: key.jump = false; break;                    // space
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
	//if(e.clientX > vsize.w+10) return;
	mouse.ox = e.clientX;
	mouse.oy = e.clientY;
	mouse.h = camPos.horizontal;
	mouse.v = camPos.vertical;
	mouse.down = true;
	if(cursor && mouse.over){
		cursorUp.style.visibility = 'hidden';
		cursorDown.style.visibility = 'visible';
	}
}

function onMouseUp(e) {
	mouse.down = false;
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
		mouse.x = e.touches[touchId].clientX;
		mouse.y =  e.touches[touchId].clientY;
		camPos.horizontal = ((mouse.x - mouse.ox) * 0.3) + mouse.h;
		camPos.vertical = (-(mouse.y - mouse.oy) * 0.3) + mouse.v;
		moveCamera();
    }
}

function onMouseWheel(e) {
	var delta = 0;
	var m;
	if ( e.wheelDelta ){ delta = e.wheelDelta; m=true}
	else if ( e.detail ) { delta = - e.detail; m=false}
	if(m)camPos.distance-=delta;
	else camPos.distance-=delta*10;
	moveCamera();
}

//-----------------------------------------------------
//  CAMERA
//-----------------------------------------------------

function moveCamera() {
	camera.position.copy(Orbit(center, camPos.horizontal, camPos.vertical, camPos.distance));
	camera.lookAt(center);
}

function endMove() {
	camPos.automove = false;
}

function onThreeChangeView(h, v, d) {
	TweenLite.to(camPos, 3, {horizontal: h, vertical: v, distance: d, onUpdate: moveCamera, onComplete: endMove });
	camPos.automove = true;
}

//-----------------------------------------------------
//  MATH
//-----------------------------------------------------



function exponentialEaseOut( v ) { return v === 1 ? 1 : - Math.pow( 2, - 10 * v ) + 1; };

function clamp(a,b,c) { return Math.max(b,Math.min(c,a)); }

function Orbit(origine, horizontal, vertical, distance) {
	var p = new THREE.Vector3();
	var phi = unwrapDegrees(vertical)*ToRad;
	var theta = unwrapDegrees(horizontal)*ToRad;
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

var skyCube;

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
}

//-----------------------------------------------------
//  AUTO RESIZE
//-----------------------------------------------------

var divListe= ["container", "info", "fps", "titre", "menu", "debug", "option"];
var sizeListe = [{w:640, h:480, n:0}, {w:1024, h:680, n:1}, {w:1280, h:768, n:2}]
var size =  1;

function rz(){
	var w = window.innerWidth;
	var h = window.innerHeight;
	if(w < 1024 || h < 680 ) fullResize(0);
	else if(w > 1300 && h>830 ) fullResize(2);
	else fullResize(1);
}

function fullResize(n){
	if(n == size) return;
	size = n
	var w = sizeListe[n].w;
	var mw = sizeListe[n].w*0.5;
	var h = sizeListe[n].h;
	var div;
	for(var i=0; i< divListe.length; ++i){
		div = document.getElementById( divListe[i] );
		if(i!==5 && i!==3 && i!==6)div.style.width = w+"px";
		div.style.left = "calc(50% - "+mw+"px)";
		if(i==0)div.style.height = h+"px";
		else if (i!==4 && i!==3 && i!==5 )div.style.top = h+45+"px";
	}
	resize(w,h);
}