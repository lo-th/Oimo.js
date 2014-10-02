
'use strict';
var THREE;
var V3D = {};
V3D.ToRad = Math.PI/180;
V3D.ToDeg = 180 / Math.PI;

V3D.View = function(h,v,d){
	var n = navigator.userAgent;
	this.isMobile = false;
    if (n.match(/Android/i) || n.match(/webOS/i) || n.match(/iPhone/i) || n.match(/iPad/i) || n.match(/iPod/i) || n.match(/BlackBerry/i) || n.match(/Windows Phone/i)) this.isMobile = true;      

	this.w = window.innerWidth;
	this.h = window.innerHeight;
	this.id = 'container';

	this.init(h,v,d);
	this.initBasic();
}

V3D.View.prototype = {
    constructor: V3D.View,
    init:function(h,v,d){
    	this.clock = new THREE.Clock();

    	this.renderer = new THREE.WebGLRenderer({precision: "mediump", antialias:false});
    	this.renderer.setSize( this.w, this.h );
    	this.renderer.setClearColor( 0x1d1f20, 1 );
    	this.camera = new THREE.PerspectiveCamera( 60, this.w/this.h, 0.1, 2000 );
    	this.scene = new THREE.Scene();
    	this.initBackground();
    	
        this.container = document.getElementById(this.id)
        this.container.appendChild( this.renderer.domElement );

        this.nav = new V3D.Navigation(this);
        this.nav.initCamera( h,v,d );

        this.miniMap = null;
        this.player = null;

        //this.projector = new THREE.Projector();
    	//this.raycaster = new THREE.Raycaster();
    },
    initBackground:function(){
    	var buffgeoBack = new THREE.BufferGeometry();
        buffgeoBack.fromGeometry( new THREE.IcosahedronGeometry(1000,1) );
        var back = new THREE.Mesh( buffgeoBack, new THREE.MeshBasicMaterial( { map:this.gradTexture([[0.75,0.6,0.4,0.25], ['#1B1D1E','#3D4143','#72797D', '#b0babf']]), side:THREE.BackSide, depthWrite: false, fog:false }  ));
        back.geometry.applyMatrix(new THREE.Matrix4().makeRotationZ(15*V3D.ToRad));
        this.scene.add( back );
        this.renderer.autoClear = false;
    },
    initLight:function(){
    	if(this.isMobile) return;
    	//this.scene.fog = new THREE.Fog( 0x1d1f20, 100, 600 );
    	//this.scene.add( new THREE.AmbientLight( 0x3D4143 ) );
    	var hemiLight = new THREE.HemisphereLight( 0xffffff, 0x303030, 0.3 );
		this.scene.add( hemiLight );
		var dirLight = new THREE.DirectionalLight( 0xffffff, 1.2 );
		dirLight.position.set( 0.5, 1, 0.5 ).normalize();
		this.scene.add( dirLight );
    },
    initLightShadow:function(){
    	if(this.isMobile) return;
    	this.scene.add( new THREE.AmbientLight( 0x606060 ) );
	    var light = new THREE.DirectionalLight( 0xffffff , 1);
	    light.position.set( 300, 1000, 500 );
	    light.target.position.set( 0, 0, 0 );
	    light.castShadow = true;
	    light.shadowCameraNear = 500;
	    light.shadowCameraFar = 1600;
	    light.shadowCameraFov = 70;
	    light.shadowBias = 0.0001;
	    light.shadowDarkness = 0.7;
	    //light.shadowCameraVisible = true;
	    light.shadowMapWidth = light.shadowMapHeight = 1024;
	    this.scene.add( light );
    },
    initBasic:function(){
    	var geos = {};
		geos['sph'] = new THREE.BufferGeometry();
		geos['box'] = new THREE.BufferGeometry();
		geos['cyl'] = new THREE.BufferGeometry();
	    geos['sph'].fromGeometry( new THREE.SphereGeometry(1,12,10)); 
	    geos['cyl'].fromGeometry( new THREE.CylinderGeometry(0.5,0.5,1,12,1));  
	    geos['box'].fromGeometry( new THREE.BoxGeometry(1,1,1));
	    geos['plane'] = new THREE.PlaneBufferGeometry(1,1);
	    geos['plane'].applyMatrix(new THREE.Matrix4().makeRotationX(-90*V3D.ToRad));

	    var mats = {};
	    mats['sph'] = new THREE.MeshLambertMaterial( { map: this.basicTexture(0), name:'sph' } );
	    mats['ssph'] = new THREE.MeshLambertMaterial( { map: this.basicTexture(1), name:'ssph' } );
	    mats['box'] = new THREE.MeshLambertMaterial( { map: this.basicTexture(2), name:'box' } );
	    mats['sbox'] = new THREE.MeshLambertMaterial( { map: this.basicTexture(3), name:'sbox' } );
	    mats['cyl'] = new THREE.MeshLambertMaterial( { map: this.basicTexture(5), name:'cyl' } );
	    mats['scyl'] = new THREE.MeshLambertMaterial( { map: this.basicTexture(6), name:'scyl' } );
	    mats['static'] = new THREE.MeshLambertMaterial( { map: this.basicTexture(4), name:'static' } );
	    mats['static2'] = new THREE.MeshLambertMaterial( { map: this.basicTexture(4, 6), name:'static2' } );

	    mats['joint']  = new THREE.LineBasicMaterial( { color: 0x00ff00 } );

	    this.mats = mats;
	    this.geos = geos;
    },
    render : function(){
    	this.renderer.render( this.scene, this.camera );
    },
    add : function(obj, target){
    	var type = obj.type || 'box';
    	var size = obj.size || [10,10,10];
    	var pos = obj.pos || [0,0,0];
    	var rot = obj.rot || [0,0,0];
    	var move = obj.move || false;
    	if(obj.flat){ type = 'plane'; pos[1]+=size[1]*0.5; }
    	
    	if(type.substring(0,5) === 'joint'){//_____________ Joint
    		var joint;
    		var pos1 = obj.pos1 || [0,0,0];
    		var pos2 = obj.pos2 || [0,0,0];
			var geo = new THREE.Geometry();
			geo.vertices.push( new THREE.Vector3( pos1[0], pos1[1], pos1[2] ) );
			geo.vertices.push( new THREE.Vector3( pos2[0], pos2[1], pos2[2] ) );
			joint = new THREE.Line( geo, this.mats.joint, THREE.LinePieces );
			if(target) target.add( mesh );
			else this.scene.add( joint );
			return joint;
    	} else {//_____________ Object
    		var mesh;
    		if(type=='box' && move) mesh = new THREE.Mesh( this.geos.box, this.mats.box );
	    	if(type=='box' && !move) mesh = new THREE.Mesh( this.geos.box, this.mats.static);
	    	if(type=='plane' && !move) mesh = new THREE.Mesh( this.geos.plane, this.mats.static2);
	    	if(type=='sphere' && move) mesh = new THREE.Mesh( this.geos.sph, this.mats.sph );
	    	if(type=='sphere' && !move) mesh = new THREE.Mesh( this.geos.sph, this.mats.static);
	    	if(type=='cylinder' && move) mesh = new THREE.Mesh( this.geos.cyl, this.mats.cyl );
	    	if(type=='cylinder' && !move) mesh = new THREE.Mesh( this.geos.cyl, this.mats.static);
	    	mesh.scale.set( size[0], size[1], size[2] );
	        mesh.position.set( pos[0], pos[1], pos[2] );
	        mesh.rotation.set( rot[0]*V3D.ToRad, rot[1]*V3D.ToRad, rot[2]*V3D.ToRad );
	        if(target)target.add( mesh );
	        else this.scene.add( mesh );
	        return mesh;
    	}
    	
    },
    moveLink:function(line, p1, p2){
    	line.geometry.vertices[0].copy( p1 );
        line.geometry.vertices[1].copy( p2 );
        line.geometry.verticesNeedUpdate = true;
    },
    initKeyboard:function(){
    	this.nav.bindKeys();
    },




    customShader:function(shader){
    	var material = new THREE.ShaderMaterial({
			uniforms: shader.uniforms,
			attributes: shader.attributes,
			vertexShader: shader.vs,
			fragmentShader: shader.fs
		});
		return material;
    },

    gradTexture : function(color) {
        var c = document.createElement("canvas");
        var ct = c.getContext("2d");
        c.width = 16; c.height = 128;
        var gradient = ct.createLinearGradient(0,0,0,128);
        var i = color[0].length;
        while(i--){ gradient.addColorStop(color[0][i],color[1][i]); }
        ct.fillStyle = gradient;
        ct.fillRect(0,0,16,128);
        var tx = new THREE.Texture(c);
        tx.needsUpdate = true;
        return tx;
    },
    basicTexture : function (n, r){
        var canvas = document.createElement( 'canvas' );
        canvas.width = canvas.height = 64;
        var ctx = canvas.getContext( '2d' );
        var color;
        if(n===0) color = "#58C3FF";// sphere
        if(n===1) color = "#3580AA";// sphere sleep
        if(n===2) color = "#FFAA58";// box
        if(n===3) color = "#AA8038";// box sleep
        if(n===4) color = "#1d1f20";// static
        if(n===5) color = "#58FFAA";// cyl
        if(n===6) color = "#38AA80";// cyl sleep
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 64, 64);
        ctx.fillStyle = "rgba(0,0,0,0.1);";//colors[1];
        ctx.fillRect(0, 0, 32, 32);
        ctx.fillRect(32, 32, 32, 32);
        var tx = new THREE.Texture(canvas);
        tx.wrapS = tx.wrapT = THREE.RepeatWrapping;
        tx.repeat = new THREE.Vector2( r || 1, r || 1);
        tx.needsUpdate = true;
        return tx;
    }

}



//----------------------------------
//  NAVIGATION
//----------------------------------

V3D.Navigation = function(root){
	this.parent = root;
	this.camPos = { h: 90, v: 60, distance: 400, automove: false  };
	this.mouse = { x:0, y:0, ox:0, oy:0, h:0, v:0, mx:0, my:0, down:false, over:false, moving:true, button:0 };
	this.vsize = { w:this.parent.w, h:this.parent.h};
	this.center = { x:0, y:0, z:0 };
	this.key = [0,0,0,0,0,0,0];
	this.rayTest = null;

	this.initEvents();
}
V3D.Navigation.prototype = {
    constructor: V3D.Navigation,
	initCamera : function (h,v,d) {
	    this.camPos.h = h || 90;
	    this.camPos.v = v || 60;
	    this.camPos.distance = d || 400;
	    this.moveCamera();
	},
	moveCamera : function () {
	    this.parent.camera.position.copy(this.Orbit(this.center, this.camPos.h, this.camPos.v, this.camPos.distance));
	    this.parent.camera.lookAt(this.center);
	},
	Orbit : function (origine, h, v, distance) {
	    origine = origine || new THREE.Vector3();
	    var p = new THREE.Vector3();
	    var phi = v*V3D.ToRad;
	    var theta = h*V3D.ToRad;
	    p.x = (distance * Math.sin(phi) * Math.cos(theta)) + origine.x;
	    p.z = (distance * Math.sin(phi) * Math.sin(theta)) + origine.z;
	    p.y = (distance * Math.cos(phi)) + origine.y;
	    return p;
	},
	unwrapDegrees:function(r){
		r = r % 360;
		if (r > 180) r -= 360;
		if (r < -180) r += 360;
		return r;
	},
	initEvents : function (){
		var _this = this;
		// disable context menu
        document.addEventListener("contextmenu", function(e){ e.preventDefault(); }, false);

	    this.parent.container.addEventListener( 'mousemove', function(e) {_this.onMouseMove(e)}, false );
	    this.parent.container.addEventListener( 'mousedown', function(e) {_this.onMouseDown(e)}, false );
	    this.parent.container.addEventListener( 'mouseout',  function(e) {_this.onMouseUp(e)}, false );
	    this.parent.container.addEventListener( 'mouseup', function(e) {_this.onMouseUp(e)}, false );

	    if (typeof window.ontouchstart !== 'undefined') {
		    this.parent.container.addEventListener( 'touchstart', function(e) {_this.onMouseDown(e)}, false );
		    this.parent.container.addEventListener( 'touchend', function(e) {_this.onMouseUp(e)}, false );
		    this.parent.container.addEventListener( 'touchmove', function(e) {_this.onMouseMove(e)}, false );
		}

	    this.parent.container.addEventListener( 'mousewheel', function(e) {_this.onMouseWheel(e)}, false );
	    this.parent.container.addEventListener( 'DOMMouseScroll', function(e) {_this.onMouseWheel(e)}, false );
	    window.addEventListener( 'resize', function(e) {_this.onWindowResize(e)}, false );
	},
	onMouseRay : function(x,y){
	    this.mouse.mx = ( this.mouse.x / this.vsize.w ) * 2 - 1;
	    this.mouse.my = - ( this.mouse.y / this.vsize.h ) * 2 + 1;
	    this.rayTest();
	},
	onMouseMove : function(e){
	    e.preventDefault();
	    var px, py;
	    if(e.touches){
	        this.mouse.x = e.clientX || e.touches[ 0 ].pageX;
	        this.mouse.y = e.clientY || e.touches[ 0 ].pageY;
	    } else {
	        this.mouse.x = e.clientX;
	        this.mouse.y = e.clientY;
	    }
	    if(this.rayTest !== null) this.onMouseRay();
	    if (this.mouse.down ) {
	        document.body.style.cursor = 'move';
	        this.camPos.h = ((this.mouse.x - this.mouse.ox) * 0.3) + this.mouse.h;
	        this.camPos.v = (-(this.mouse.y - this.mouse.oy) * 0.3) + this.mouse.v;
	        this.moveCamera();
	    }
	},
	onMouseDown : function(e){
	    e.preventDefault();
	    var px, py;
	    if(e.touches){
	        px = e.clientX || e.touches[ 0 ].pageX;
	        py = e.clientY || e.touches[ 0 ].pageY;
	    } else {
	        px = e.clientX;
	        py = e.clientY;
	        // 0: default  1: left  2: middle  3: right
	        this.mouse.button = e.which;
	    }
	    this.mouse.ox = px;
	    this.mouse.oy = py;
	    this.mouse.h = this.camPos.h;
	    this.mouse.v = this.camPos.v;
	    this.mouse.down = true;
	    if(this.rayTest !== null) this.onMouseRay(px,py);
	},
	onMouseUp : function(e){
	    this.mouse.down = false;
	    document.body.style.cursor = 'auto';
	},
	onMouseWheel : function (e) {
	    var delta = 0;
	    if(e.wheelDeltaY){delta=e.wheelDeltaY*0.01;}
	    else if(e.wheelDelta){delta=e.wheelDelta*0.05;}
	    else if(e.detail){delta=-e.detail*1.0;}
	    this.camPos.distance-=(delta*10);
	    this.moveCamera();   
	},
	onWindowResize : function () {
	    this.vsize.w = window.innerWidth;
	    this.vsize.h = window.innerHeight;
	    this.parent.camera.aspect = this.vsize.w / this.vsize.h;
	    this.parent.camera.updateProjectionMatrix();
	    this.parent.renderer.setSize( this.vsize.w, this.vsize.h );
	},
	// ACTIVE KEYBOARD
	bindKeys:function(){
		var _this = this;
		document.onkeydown = function(e) {
		    e = e || window.event;
			switch ( e.keyCode ) {
			    case 38: case 87: case 90: _this.key[0] = 1; break; // up, W, Z
				case 40: case 83:          _this.key[1] = 1; break; // down, S
				case 37: case 65: case 81: _this.key[2] = 1; break; // left, A, Q
				case 39: case 68:          _this.key[3] = 1; break; // right, D
				case 17: case 67:          _this.key[4] = 1; break; // ctrl, C
				case 69:                   _this.key[5] = 1; break; // E
				case 32:                   _this.key[6] = 1; break; // space
				case 16:                   _this.key[7] = 1; break; // shift
			}
		}
		document.onkeyup = function(e) {
		    e = e || window.event;
			switch( e.keyCode ) {
				case 38: case 87: case 90: _this.key[0] = 0; break; // up, W, Z
				case 40: case 83:          _this.key[1] = 0; break; // down, S
				case 37: case 65: case 81: _this.key[2] = 0; break; // left, A, Q
				case 39: case 68:          _this.key[3] = 0; break; // right, D
				case 17: case 67:          _this.key[4] = 0; break; // ctrl, C
				case 69:                   _this.key[5] = 0; break; // E
				case 32:                   _this.key[6] = 0; break; // space
				case 16:                   _this.key[7] = 0; break; // shift
			}
		}
	    //self.focus();
	}
}



//----------------------------------
//  LOADER IMAGE/SEA3D
//----------------------------------

// POOL move to sea3D is more logical