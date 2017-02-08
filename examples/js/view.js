/**   _   _____ _   _   
*    | | |_   _| |_| |
*    | |_ _| | |  _  |
*    |___|_|_| |_| |_|
*    @author lo.th / http://lo-th.github.io/labs/
*    THREE manager
*/

'use strict';
// MATH ADD
Math.torad = 0.0174532925199432957;
Math.todeg = 57.295779513082320876;
Math.degtorad = 0.0174532925199432957;
Math.radtodeg = 57.295779513082320876;
Math.Pi = 3.141592653589793;
Math.TwoPI = 6.283185307179586;
Math.PI90 = 1.570796326794896;
Math.PI270 = 4.712388980384689;
Math.int = function(x) { return Math.floor(x); };
Math.lerp = function ( x, y, t ) { return ( 1 - t ) * x + t * y; };
Math.rand = function ( low, high ) { return low + Math.random() * ( high - low ); };
Math.randInt = function ( low, high ) { return low + Math.floor( Math.random() * ( high - low + 1 ) ); };
Math.distanceVector = function ( a, b ) { 
    var x = b.x-a.x;
    var y = b.y-a.y;
    var z = b.z-a.z;
    var d = Math.sqrt( x*x + y*y + z*z );
    //if(d <= 0 ) d = 0.1;
    return d;
}


var view = ( function () {

'use strict';

var _V;

var time = 0;
var temp = 0;
var count = 0;
var fps = 0;

var canvas, renderer, scene, camera, controls, debug;
var ray, mTarget, mouse, content, targetMouse, rayCallBack, moveplane, isWithRay = false;;
var vs = { w:1, h:1, l:0, x:0 };

var helper;

var extraGeo = [];

var byName = {};


// camera
var isCamFollow = false;
var currentFollow = null;
var cameraGroup;

var extraMesh;
var matStatic;

//var azimut = 0, oldAzimut = 0;
//var polar = 0, oldPolar = 0;

var cam = { theta:0, phi:0, oTheta:0, oPhi:0 };

var geo, mat;

var urls = [];
var callback_load = null;
//var seaLoader = null;
var results = {};



var imagesLoader;
//var currentCar = -1;

var isWithShadow = false;
var shadowGround, light, ambient;
var spy = -0.01;

var perlin = null;

var environment, envcontext, nEnv = 1, isWirframe = true;
var envLists = [ 'wireframe','chrome','ceramic','plastic','smooth','metal','brush','black','glow','red','sky' ];
var envMap;


view = {

    //--------------------------------------
    //
    //   LOOP
    //
    //--------------------------------------

    render: function () {

        //requestAnimationFrame( _V.render );


        TWEEN.update();
        //THREE.SEA3D.AnimationHandler.update( 0.017 );

        //update();

        renderer.render( scene, camera );

        //time = performance.now();//now();
        //if ( (time - 1000) > temp ){ temp = time; fps = count; count = 0; }; count++;

    },

    addMesh: function ( m ) {

        extraMesh.add( m );

    },

    //--------------------------------------
    //
    //   RESET
    //
    //--------------------------------------

    reset: function () {

        postUpdate = function () {};
        update = function () {};

        this.removeRay();
        this.resetCamera();
        this.setShadowPosY(-0.01);
        helper.visible = true;

        while( extraMesh.children.length > 0 ) scene.remove( extraMesh.children.pop() );

        byName = {};

    },

    init: function ( callback ) {

        canvas = document.createElement("canvas");
        canvas.className = 'canvas3d';
        canvas.oncontextmenu = function(e){ e.preventDefault(); };
        canvas.ondrop = function(e) { e.preventDefault(); };
        document.body.appendChild( canvas );


        _V = this;



        // RENDERER

        try {
            renderer = new THREE.WebGLRenderer({ canvas:canvas, antialias:true, alpha:false });
            //renderer = new THREE.WebGLRenderer({ canvas:canvas, precision:"mediump", antialias:true, alpha:false });
        } catch( error ) {
            if(intro !== null ) intro.message('<p>Sorry, your browser does not support WebGL.</p>'
                        + '<p>This application uses WebGL to quickly draw'
                        + ' AMMO Physics.</p>'
                        + '<p>AMMO Physics can be used without WebGL, but unfortunately'
                        + ' this application cannot.</p>'
                        + '<p>Have a great day!</p>');
            return;
        }

        if( intro !== null ) intro.clear();

        renderer.setClearColor( 0x252525, 1 );
        renderer.setPixelRatio( window.devicePixelRatio );

        // TONE MAPPING

        renderer.gammaInput = true;
        renderer.gammaOutput = true;

        renderer.toneMapping = THREE.Uncharted2ToneMapping;
        renderer.toneMappingExposure = 3.0;
        renderer.toneMappingWhitePoint = 5.0;

        // SCENE

        scene = new THREE.Scene();

        content = new THREE.Group();
        scene.add( content );

        extraMesh = new THREE.Group();
        scene.add( extraMesh );

        // CAMERA / CONTROLER

        camera = new THREE.PerspectiveCamera( 60 , 1 , 1, 1000 );
        camera.position.set( 0, 0, 30 );

        controls = new THREE.OrbitControls( camera, canvas );
        controls.target.set( 0, 0, 0 );
        controls.enableKeys = false;
        controls.update();

        cameraGroup = new THREE.Group();
        scene.add( cameraGroup );
        cameraGroup.add( camera );

        // LIGHTS

        this.addLights();

        // IMAGE LOADER

        imagesLoader = new THREE.TextureLoader();

        // RAYCAST

        ray = new THREE.Raycaster();
        mouse = new THREE.Vector2();
        mTarget = new THREE.Vector3();

        // GEOMETRY

        geo = {

            plane:      new THREE.PlaneBufferGeometry( 1, 1 ),
            box:        new THREE.BoxBufferGeometry(1,1,1),
            hardbox:    new THREE.BoxBufferGeometry(1,1,1),
            cone:       new THREE.CylinderBufferGeometry( 0,1,0.5 ),
            wheel:      new THREE.CylinderBufferGeometry( 1,1,1, 18 ),
            sphere:     new THREE.SphereBufferGeometry( 1, 24, 18 ),
            highsphere: new THREE.SphereBufferGeometry( 1, 32, 24 ),
            cylinder:   new THREE.CylinderBufferGeometry( 1,1,1,12,1 ),

            mouse:      new THREE.CylinderBufferGeometry( 0.25,0,0.5 ),

        }

        geo.plane.rotateX( -Math.PI90 );
        geo.wheel.rotateZ( -Math.PI90 ); 
        geo.mouse.translate( 0,0.25,0 );

        // MATERIAL

        mat = {

            shadow: new THREE.ShaderMaterial( THREE.ShaderShadow ),
            hide: new THREE.MeshBasicMaterial({ transparent:true, opacity:0 }),
            mouse: new THREE.MeshBasicMaterial({ name:'mouse', color:0xFF0000 }),

            move: new THREE.MeshBasicMaterial({ name:'move', color:0x999999 }),
            contact: new THREE.MeshBasicMaterial({ name:'contact', color:0xA8BB19 }),
            sleep: new THREE.MeshBasicMaterial({ name:'sleep', color:0x9999FF }),
            statique: new THREE.MeshBasicMaterial({ name:'statique', color:0x333399, transparent:true, opacity:0.6 }),
            donut: new THREE.MeshBasicMaterial({ name:'donut', color:0xFFD700 }),
            kinematic: new THREE.MeshBasicMaterial({ name:'kinematic', color:0x33AA33, transparent:true, opacity:0.6 }),

        }

        matStatic = [ 'hide', 'shadow', 'mouse' ];

        // GROUND

        helper = new THREE.GridHelper( 50, 20, 0xFFFFFF, 0x333333 );
        helper.material = new THREE.LineBasicMaterial( { vertexColors: THREE.VertexColors, transparent:true, opacity:0.1 } );
        scene.add( helper );

        if( !isDocs ) this.initEnv();

        this.resize();

        window.addEventListener( 'resize', _V.resize, false );

        //this.render();

        this.load ( 'basic', callback );

        //if( callback ) callback();

    },

    switchMaterial: function ( m, name ){

        if( m.material.name !== name ) m.material = mat[name];

    },

    resize: function () {

        vs.h = isDocs ? 400 : window.innerHeight;
        vs.w = window.innerWidth - vs.x;

        canvas.style.left = vs.x +'px';
        camera.aspect = vs.w / vs.h;
        camera.updateProjectionMatrix();
        renderer.setSize( vs.w, vs.h );

        if( editor ) editor.resizeMenu( vs.w );

    },

    setLeft: function ( x ) { 

        vs.x = x; 

    },

    getFps: function () {

        return fps;

    },

    getInfo: function () {

        return renderer.info.programs.length;

    },

    addMap: function( name, matName ) {

        var map = imagesLoader.load( './examples/assets/textures/' + name );
        map.flipY = false;
        mat[matName].map = map;

    },

    getGeo: function () {

        return geo;

    },

    getMat: function () {

        return mat;

    },

    getScene: function () {

        return scene;

    },

    //--------------------------------------
    //
    //     RAYCAST
    //
    //--------------------------------------

    removeRay: function(){

        if( !isWithRay ) return;

        isWithRay = false;

        canvas.removeEventListener( 'mousemove', _V.rayTest, false );
        rayCallBack = null;

        if( moveplane ) content.remove( moveplane );
        if( targetMouse ) scene.remove( targetMouse );

    },

    activeRay: function ( callback ) {

        isWithRay = true;

        moveplane = new THREE.Mesh( geo.plane, mat.hide );
        moveplane.scale.multiplyScalar( 100 );
        content.add(moveplane);
        //moveplane.visible = false;

        targetMouse = new THREE.Mesh( geo.mouse, mat.mouse );
        scene.add( targetMouse );

        canvas.addEventListener( 'mousemove', _V.rayTest, false );

        rayCallBack = callback;

    },

    rayTest: function (e) {

        mouse.x = ( (e.clientX- vs.x )/ vs.w ) * 2 - 1;
        mouse.y = - ( e.clientY / vs.h ) * 2 + 1;

        ray.setFromCamera( mouse, camera );
        var intersects = ray.intersectObjects( content.children, true );

        if ( intersects.length ) {

            mTarget.copy( intersects[0].point );
            targetMouse.position.copy( mTarget );
            rayCallBack( targetMouse );

        }
    },

    //--------------------------------------
    //
    //     MATERIAL
    //
    //--------------------------------------
    
    changeMaterial: function ( type ) {

        var m, matType, name, i, j, k;

        if( type === 0 ) {
            isWirframe = true;
            matType = 'MeshBasicMaterial';
            this.removeShadow();
        }else{
            isWirframe = false;
            matType = 'MeshStandardMaterial';
            this.addShadow();
        }

        // create new material

        for( var old in mat ) {

            m = mat[ old ];
            name = m.name;

            if( matStatic.indexOf( name ) === -1 ){
                mat[ name ] = new THREE[ matType ]({ 
                    name:name, 
                    envMap:null,
                    map:m.map || null, 
                    vertexColors:m.vertexColors || false, 
                    color: m.color === undefined ? 0xFFFFFF : m.color.getHex(),
                    wireframe:isWirframe, 
                    transparent: m.transparent || false, 
                    opacity: m.opacity || 1, 
                    side: m.side || THREE.FrontSide 
                });
                if( !isWirframe ){
                    mat[name].envMap = envMap;
                    mat[name].metalness = 0.6;
                    mat[name].roughness = 0.4;
                }

                m.dispose();
            }

        }

        this.reApplyMaterial();

    },

    reApplyMaterial: function () {

        var i = extraMesh.children.length, m, name;

        while( i-- ){
            m = extraMesh.children[i];
            name = m.material.name; 
            if( mat[ name ] ) m.material = mat[ name ];
        }

    },

    needFocus: function () {

        canvas.addEventListener('mouseover', editor.unFocus, false );

    },

    haveFocus: function () {

        canvas.removeEventListener('mouseover', editor.unFocus, false );

    },

    //--------------------------------------
    //
    //     ENVMAP
    //
    //--------------------------------------

    initEnv: function () {

        var env = document.createElement( 'div' );
        env.className = 'env';
        var canvas = document.createElement( 'canvas' );
        canvas.width = canvas.height = 64;
        env.appendChild( canvas );
        document.body.appendChild( env );
        envcontext = canvas.getContext('2d');
        env.onclick = this.loadEnv;
        env.oncontextmenu = this.loadEnv;
        this.loadEnv();

    },

    loadEnv: function ( e ) {

        var b = 0;

        if(e){ 
            e.preventDefault();
            b = e.button;
            if( b === 0 ) nEnv++;
            else nEnv--;
            if( nEnv == envLists.length ) nEnv = 0;
            if( nEnv < 0 ) nEnv = envLists.length-1;
        }

        var img = new Image();
        img.onload = function(){
            
            envcontext.drawImage(img,0,0,64,64);
            
            envMap = new THREE.Texture( img );
            envMap.mapping = THREE.SphericalReflectionMapping;
            envMap.format = THREE.RGBFormat;
            envMap.needsUpdate = true;

            if( nEnv === 0 && !isWirframe ) _V.changeMaterial( 0 );
            if( nEnv !== 0  ) {
                if( isWirframe ) _V.changeMaterial( 1 );
                else{
                    for( var mm in mat ){
                       mat[mm].envMap = envMap;
                    }
                }
            }
        }

        img.src = './examples/assets/textures/spherical/'+ envLists[nEnv] +'.jpg';

    },

    // GRID

    hideGrid: function(){

        if( helper.visible ) helper.visible = false;
        else helper.visible = true;

    },

    //--------------------------------------
    //
    //   LOAD SEA3D / BVH
    //
    //--------------------------------------

    load: function( Urls, Callback ){

        if ( typeof Urls == 'string' || Urls instanceof String ) urls.push( Urls );
        else urls = urls.concat( Urls );

        callback_load = Callback || function(){};

        _V.load_sea( urls[0] );

    },

    load_next: function () {

        urls.shift();
        if( urls.length === 0 ) callback_load();
        else _V.load_sea( urls[0] );

    },

    load_sea: function ( n ) {

        var l = new THREE.SEA3D();

        l.onComplete = function( e ) {

            results[ n ] = l.meshes;

            var i = l.geometries.length, g;
            while( i-- ){
                g = l.geometries[i];
                geo[ g.name ] = g;
            };

            _V.load_next();

        };

        l.load( './examples/assets/models/'+ n +'.sea' );

    },

    getResult : function(){

        return results;

    },

    load_bvh: function ( file, callback ) {

        var bvhLoader = new THREE.BVHLoader();
        var xml = new XMLHttpRequest();
        xml.responseType = 'arraybuffer';

        xml.onload = function (  ) {

            callback( bvhLoader.parse( SEA3D.File.LZMAUncompress( xml.response ) ) );

        }

        xml.open( 'GET', './examples/assets/bvh/'+ file +'.z', true );
        xml.send( null );

    },


    //--------------------------------------
    //
    //   CAMERA AND CONTROL
    //
    //--------------------------------------

    controlUpdate: function(){

        if( !isCamFollow ) return;
        if( currentFollow === null ) return;

        var h, v;
        var mesh = currentFollow;
        var type = mesh.userData.type;
        var speed = mesh.userData.speed;

        v = (-70) * Math.torad;

        if( type === 'car' ) {

            
            
            if( speed < 10 && speed > -10 ){ 

                this.setControle( true );
                return;

            } else {

                this.setControle( false );

            }
        }

        var matrix = new THREE.Matrix4();
        matrix.extractRotation( mesh.matrix );

        var front = new THREE.Vector3( 0, 0, 1 );
        front.applyMatrix4( matrix );
        //matrix.multiplyVector3( front );

        var target = mesh.position;
        h = Math.atan2( front.x, front.z );


        this.autoCamera( h, v, 10, 0.3, target );

    },

    setFollow: function ( name ) {

        currentFollow = this.getByName( name );
        if( currentFollow !== null ) {
            isCamFollow = true;
        }

    },

    setTarget: function ( target ) {

        controls.target.copy( target );
        controls.update();

    },

    autoCamera:function ( h, v, d, l, target ) {

        l = l || 1;
        //if( target ) controls.target.set( target.x || 0, target.y || 0, target.z || 0 );
        //camera.position.copy( this.orbit( h, v, d ) );
        camera.position.lerp( this.orbit( h, v, d ), l );

        if( target ) this.setTarget( target );
        //controls.update();

    },

    moveCamera: function ( h, v, d, target ) {

        /*l = l || 1;
       // if( target ) controls.target.set( target.x || 0, target.y || 0, target.z || 0 );
        camera.position.lerp( this.orbit( (h+180) * Math.torad, (v-90) * Math.torad, d ), l );
        //controls.update();



        if( target ) this.setTarget( target );*/

        var dest = this.orbit( (h+180) * Math.torad, (v-90) * Math.torad, d );


        new TWEEN.Tween( camera.position ).to( { x: dest.x, y: dest.y, z: dest.z }, 400 )
                    .easing( TWEEN.Easing.Quadratic.Out )
                    //.onUpdate( function(){ isMove = true; } )
                    //.onComplete( function(){ current = rubrique; isMove = false; } )
                    .start();


        new TWEEN.Tween( controls.target ).to( { x: target[0], y: target[1], z: target[2] }, 400 )
                    .easing( TWEEN.Easing.Quadratic.Out )
                    .onUpdate( function(){ controls.update(); } )
                    //.onComplete( function(){ current = rubrique; isMove = false; } )
                    .start();
        
    },

    orbit: function( h, v, d ) {

        var offset = new THREE.Vector3();
        
        var phi = v;
        var theta = h;
        offset.x =  d * Math.sin(phi) * Math.sin(theta);
        offset.y =  d * Math.cos(phi);
        offset.z =  d * Math.sin(phi) * Math.cos(theta);

        var p = new THREE.Vector3();
        p.copy( controls.target ).add( offset );
        /*
        p.x = ( d * Math.sin(phi) * Math.cos(theta)) + controls.target.x;
        p.y = ( d * Math.cos(phi)) + controls.target.y;
        p.z = ( d * Math.sin(phi) * Math.sin(theta)) + controls.target.z;*/

        //key[8] = theta;
        
        return p;

    },

    setControle: function( b ){

        if( controls.enableRotate === b ) return;
        
        controls.enableRotate = b;
        controls.enableZoom = b;
        controls.enablePan = b;

    },

    resetCamera: function(){

        _V.setControle( true );
        currentFollow = null;

    },

    toRad: function ( r ) {

        var i = r.length;
        while(i--) r[i] *= Math.torad;
        return r;

    },



    //--------------------------------------
    //
    //   ADD
    //
    //--------------------------------------

    add: function ( o ) {

        var isCustomGeometry = false;

        o.move = o.move === undefined ? false : o.move;
        o.type = o.type === undefined ? 'box' : o.type;

        // position
        o.pos = o.pos == undefined ? [0,0,0] : o.pos;

        // size
        o.size = o.size == undefined ? [1,1,1] : o.size;
        if(o.size.length == 1){ o.size[1] = o.size[0]; }
        if(o.size.length == 2){ o.size[2] = o.size[0]; }

        if(o.geoSize){
            if(o.geoSize.length == 1){ o.geoSize[1] = o.geoSize[0]; }
            if(o.geoSize.length == 2){ o.geoSize[2] = o.geoSize[0]; }
        }

        // rotation is in degree
        o.rot = o.rot == undefined ? [0,0,0] : this.toRad(o.rot);
        o.quat = new THREE.Quaternion().setFromEuler( new THREE.Euler().fromArray( o.rot ) ).toArray();

        if(o.rotA) o.quatA = new THREE.Quaternion().setFromEuler( new THREE.Euler().fromArray( this.toRad( o.rotA ) ) ).toArray();
        if(o.rotB) o.quatB = new THREE.Quaternion().setFromEuler( new THREE.Euler().fromArray( this.toRad( o.rotB ) ) ).toArray();

        if(o.angUpper) o.angUpper = this.toRad( o.angUpper );
        if(o.angLower) o.angLower = this.toRad( o.angLower );

        var mesh = null;

        if(o.type.substring(0,5) === 'joint') {

            //ammo.send( 'add', o );
            return;

        }

        

        var material;
        if(o.material !== undefined) material = mat[o.material];
        else material = o.move ? mat.move : mat.statique;
        
        if(o.geometry){
            if(o.geoRot || o.geoScale) o.geometry = o.geometry.clone();
            // rotation only geometry
            if(o.geoRot){ o.geometry.applyMatrix(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler().fromArray(this.toRad(o.geoRot))));}

        
            // scale only geometry
            if(o.geoScale){ 
                o.geometry.applyMatrix( new THREE.Matrix4().makeScale( o.geoScale[0], o.geoScale[1], o.geoScale[2] ) );
                //material = mat['back'];//material.clone();
                //material.side = THREE.BackSide;
           }
        }

        if( !o.move && o.type === 'box' ) mesh = new THREE.Mesh( o.geometry || geo['hardbox'], material );
        else mesh = new THREE.Mesh( o.geometry || geo[o.type], material );

        if( o.geometry ){
            extraGeo.push(o.geometry);
            if(o.geoSize) mesh.scale.fromArray( o.geoSize );
            if(!o.geoSize && o.size) mesh.scale.fromArray( o.size );
            isCustomGeometry = true;
        }


        if( mesh ){

            if( !isCustomGeometry ) mesh.scale.fromArray( o.size );

            mesh.position.fromArray( o.pos );
            mesh.quaternion.fromArray( o.quat );

            mesh.receiveShadow = true;
            mesh.castShadow = o.move;
            
            //view.setName( o, mesh );

            if( o.parent !== undefined ) o.parent.add( mesh );
            else extraMesh.add( mesh );

            
        }

        if( o.shape ) delete( o.shape );
        if( o.geometry ) delete( o.geometry );
        if( o.material ) delete( o.material );

        if(mesh) return mesh;

    },
    
    getGeoByName: function ( name, Buffer ) {

        var g;
        var i = geo.length;
        var buffer = Buffer || false;
        while(i--){
            if( name == geo[i].name) g = geo[i];
        }
        if( buffer ) g = new THREE.BufferGeometry().fromGeometry( g );
        return g;

    },

    //--------------------------------------
    //
    //   LIGHT
    //
    //--------------------------------------


    addLights: function(){

        light = new THREE.DirectionalLight( 0xffffff, 1 );
        light.position.set( -3, 100, 5 );
        light.lookAt( new THREE.Vector3() );
        scene.add( light );

        ambient = new THREE.AmbientLight( 0x444444 );
        scene.add( ambient );

    },

    //--------------------------------------
    //
    //   SHADOW
    //
    //--------------------------------------

    removeShadow: function(){

        if( !isWithShadow ) return;

        isWithShadow = false;
        renderer.shadowMap.enabled = false;
        if( shadowGround ) scene.remove( shadowGround );

    },

    hideGroundShadow: function(){

        shadowGround.visible = false;

    },

    setShadowPosY: function( y ){

        spy = y;
        if( shadowGround ){ 
            shadowGround.position.y = spy;
            shadowGround.visible = true;
        }

    },

    addShadow: function(){

       if( isWithShadow ) return;

        isWithShadow = true;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.soft = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.shadowMap.renderReverseSided = false;

        shadowGround = new THREE.Mesh( geo.plane, mat.shadow );
        shadowGround.scale.multiplyScalar( 500 );
        shadowGround.position.y = spy;
        shadowGround.castShadow = false;
        shadowGround.receiveShadow = true;
        scene.add( shadowGround );

        light.castShadow = true;
        var d = 100;
        var camShadow = new THREE.OrthographicCamera( d, -d, d, -d,  25, 170 );
        light.shadow = new THREE.LightShadow( camShadow );
        light.shadow.mapSize.width = 512;//1024;
        light.shadow.mapSize.height = 512;//1024;
        //light.shadow.bias = 0.0001;

    },

}

return view;

})();