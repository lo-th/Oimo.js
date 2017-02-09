/**   _   _____ _   _   
*    | | |_   _| |_| |
*    | |_ _| | |  _  |
*    |___|_|_| |_| |_|
*    @author lo.th / http://lo-th.github.io/labs/
*    OIMO LAB MAIN
*/

'use strict';

var world = null;
var scene = null;
var bodys = [];
//var meshs = [];

var mat, geo;

var demos = [ 
    'basic', 'planet', 'donut', 'rotation', 'stacking', 'jewel',
    'empty', 'tower', 'kinematic', 'kinematic2', 'kinematic3',
    'collision', 'test',
];

demos.sort();

var demo;
var update = function () {};
var postUpdate = function () {};

var rand = Math.rand;
var randInt = Math.randInt;

var demoName = 'basic';

//////////////////////////////

var direct = false;
var isWithCode = false;
var isDocs = false;
var isPlaying = true;

function init(){

    user.init();
    sound.init();
    view.init( next );

    mat = view.getMat();
    geo = view.getGeo();
    scene = view.getScene();

    requestAnimationFrame( loop );

};

function next(){

    editor.init( launch, reset, isWithCode );
    ready ();

};

function loop () {

    requestAnimationFrame( loop );

    if( isPlaying ) update();
    view.render();

};

function reset () {

    //while( meshs.length > 0 ) scene.remove( meshs.pop() );

    view.reset();

    if( world ) world.clear();

    bodys = [];
    //meshs = [];

}

function ready () {

    var hash = location.hash.substr( 1 );
    if(hash !=='') demoName = hash;
    editor.load('./examples/demos/' + demoName + '.js');

};

function launch ( name ) {

    demo = new window['demo'];
    isPlaying = true;
    editor.setPlay();

};

// add body to simulation and mesh on three 

function add( o, noMesh ){

    if( world ){
        var b = world.add( o );
        bodys.push( b );
    }

    if( !noMesh ){
        var m = view.add( o );
        if( world ) b.connectMesh( m );
    }

    if( world ) return b;

}


function cam ( h,v,d,t ){ view.moveCamera( h, v, d, t || [0,0,0] ); };

function switchMat ( obj, name ){ view.switchMaterial( obj, name ); };

function play () { if( world !== null ) world.play(); }
function stop () { if( world !== null ) world.stop(); }
