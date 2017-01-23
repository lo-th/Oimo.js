//----------------------------------
//  VIEW CONTROL
//----------------------------------

var camPos = { h: 90, v: 60, distance: 400, automove: false  };
var mouse = { ox:0, oy:0, h:0, v:0, mx:0, my:0, down:false, over:false, moving:true, button:0 };
var vsize = {w:window.innerWidth, h:window.innerHeight}
var center = {x:0, y:0, z:0};
var rayTest = null;

var initCamera = function (h,v,d) {
    camPos.h = h || 90;
    camPos.v = v || 60;
    camPos.distance = d || 400;
    moveCamera();
}

var moveCamera = function () {
    camera.position.copy(Orbit(center, camPos.h, camPos.v, camPos.distance));
    camera.lookAt(center);
}

var Orbit = function (origine, h, v, distance) {
    origine = origine || new THREE.Vector3();
    var p = new THREE.Vector3();
    var phi = v*Math.PI / 180;
    var theta = h*Math.PI / 180;
    p.x = (distance * Math.sin(phi) * Math.cos(theta)) + origine.x;
    p.z = (distance * Math.sin(phi) * Math.sin(theta)) + origine.z;
    p.y = (distance * Math.cos(phi)) + origine.y;
    return p;
}

var initEvents = function (){
    container.addEventListener( 'mousemove', onMouseMove, false );
    container.addEventListener( 'mousedown', onMouseDown, false );
    container.addEventListener( 'mouseout',  onMouseUp, false );
    container.addEventListener( 'mouseup', onMouseUp, false );

    container.addEventListener( 'touchstart', onMouseDown, false );
    container.addEventListener( 'touchend', onMouseUp, false );
    container.addEventListener( 'touchmove', onMouseMove, false );

    container.addEventListener( 'mousewheel', onMouseWheel, false );
    container.addEventListener( 'DOMMouseScroll', onMouseWheel, false );
    window.addEventListener( 'resize', onWindowResize, false );
}

var onMouseRay = function(x,y){
    mouse.mx = ( x / vsize.w ) * 2 - 1;
    mouse.my = - ( y / vsize.h ) * 2 + 1;
    rayTest();
}

var onMouseMove = function(e){
    e.preventDefault();
    var px, py;
    if(e.touches){
        px = e.clientX || e.touches[ 0 ].pageX;
        py = e.clientY || e.touches[ 0 ].pageY;
    } else {
        px = e.clientX;
        py = e.clientY;
    }
    if(rayTest !== null) onMouseRay(px,py);
    if (mouse.down ) {
        document.body.style.cursor = 'move';
        camPos.h = ((px - mouse.ox) * 0.3) + mouse.h;
        camPos.v = (-(py - mouse.oy) * 0.3) + mouse.v;
        moveCamera();
    }
}

var onMouseDown = function(e){
    e.preventDefault();
    var px, py;
    if(e.touches){
        px = e.clientX || e.touches[ 0 ].pageX;
        py = e.clientY || e.touches[ 0 ].pageY;
    } else {
        px = e.clientX;
        py = e.clientY;
        // 0: default  1: left  2: middle  3: right
        mouse.button = e.which;
    }
    mouse.ox = px;
    mouse.oy = py;
    mouse.h = camPos.h;
    mouse.v = camPos.v;
    mouse.down = true;
    if(rayTest !== null) onMouseRay(px,py);
}

var onMouseUp = function(e){
    mouse.down = false;
    document.body.style.cursor = 'auto';
}

var onMouseWheel = function (e) {
    var delta = 0;
    if(e.wheelDeltaY){delta=e.wheelDeltaY*0.01;}
    else if(e.wheelDelta){delta=e.wheelDelta*0.05;}
    else if(e.detail){delta=-e.detail*1.0;}
    camPos.distance-=(delta*10);
    moveCamera();   
}

var onWindowResize = function () {
    vsize.w = window.innerWidth;
    vsize.h = window.innerHeight;
    camera.aspect = vsize.w / vsize.h;
    camera.updateProjectionMatrix();
    renderer.setSize( vsize.w, vsize.h );
}