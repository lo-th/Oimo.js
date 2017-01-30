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
    'basic', 'planet', 'donut', 'rotation', 'stacking', 'jewel', 'empty', 'tower'
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

//function add ( o ) { return view.add( o ); };

/*function joint ( o ) { o.type = o.type == undefined ? 'joint' : o.type; view.add( o ); };

function character ( o ) { view.character( o ); };

function car ( o ) { view.vehicle( o ); };

function drive ( name ) { view.setDriveCar( name ); };

function follow ( name ) { view.setFollow( name ); };

function substep ( substep ) { ammo.send( 'substep', {substep:substep} ) ; };



function tell ( str ) { editor.tell( str ); };

function load ( name, callback ) { view.load( name, callback ); };

function anchor ( o ) { ammo.send( 'anchor', o ); };

function gravity ( a ) { ammo.send( 'gravity', {g:a} ); };

function water ( o ) { ammo.send( 'gravity', o ); };*/
