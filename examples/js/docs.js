/**   _   _____ _   _   
*    | | |_   _| |_| |
*    | |_ _| | |  _  |
*    |___|_|_| |_| |_|
*    @author lo.th / http://lo-th.github.io/labs/
*    AMMO LAB MAIN
*/

'use strict';

var doctext;
/* 
*/
var world = null;
var scene = null;
var bodys = [];
var meshs = [];

var mat, geo;

var demos = [ 
    'world'
];

demos.sort();

var demo;
var update = function () {};
var postUpdate = function () {};

var demoName = 'world';

//////////////////////////////

var direct = false;
var isWithCode = true;
var isDocs = true;

function init(){

    view.init( next );

    mat = view.getMat();
    geo = view.getGeo();
    scene = view.getScene();

    doctext = document.createElement('div');
    doctext.className = 'docContent';
    document.body.appendChild( doctext );

    requestAnimationFrame( loop );

};

function loop () {

    requestAnimationFrame( loop );

    update();
    view.render();

};

function go( name ){

    editor.load('./examples/docs/' + name + '.js');

};

function next(){

    editor.init( launch, reset, isWithCode );
    ready ();

};

function reset () {

    while( meshs.length > 0 ) scene.remove( meshs.pop() );

    view.reset();

    if( world ) world.clear();

    bodys = [];
    meshs = [];

}

function ready () {

    var hash = location.hash.substr( 1 );
    if(hash !=='') demoName = hash;
    editor.load('./examples/docs/' + demoName + '.js');

};

function launch ( name ) {

    editor.load('./examples/docs/' + name + '.htm', displayText );
    demo = new window['demo'];

};

function displayText ( txt ) {

    doctext.innerHTML = txt;

};

function cam ( h,v,d,t ){ view.moveCamera( h, v, d, t || [0,0,0] ); };