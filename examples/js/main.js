/**   _   _____ _   _   
*    | | |_   _| |_| |
*    | |_ _| | |  _  |
*    |___|_|_| |_| |_|
*    @author lo.th / http://lo-th.github.io/labs/
*    AMMO LAB MAIN
*/

'use strict';

var world = null;
var scene = null;
var bodys = [];
var meshs = [];

var mat, geo;

var demos = [ 
    'basic', 'planet', 'donut', 'rotation', 'stacking', 'jewel', 'empty', 'tower', 'kinematic', 'kinematic2'
];

demos.sort();

var demo;
var update = function () {};
var postUpdate = function () {};

var demoName = 'basic';

//////////////////////////////

var direct = false;
var isWithCode = false;
var isDocs = false;

function init(){

    view.init( next );

    mat = view.getMat();
    geo = view.getGeo();
    scene = view.getScene();

};

function next(){

    editor.init( launch, reset, isWithCode );
    ready ();

};

/*function loop () {

    requestAnimationFrame( loop );
    //view.update();
    //user.update( true );
    update();
    view.render();

};*/

function reset () {

    //while( meshs.length > 0 ) scene.remove( meshs.pop() );

    view.reset();

    if( world ) world.clear();

    bodys = [];
    meshs = [];

}

function ready () {

    var hash = location.hash.substr( 1 );
    if(hash !=='') demoName = hash;
    editor.load('./examples/demos/' + demoName + '.js');

};

function launch ( name ) {

    demo = new window['demo'];

};

function cam ( h,v,d,t ){ view.moveCamera( h, v, d, t || [0,0,0] ); };

function switchMat ( obj, name ){ view.switchMaterial( obj, name ); };
