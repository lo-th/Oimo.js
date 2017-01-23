/**   _   _____ _   _   
*    | | |_   _| |_| |
*    | |_ _| | |  _  |
*    |___|_|_| |_| |_|
*    @author lo.th / http://lo-th.github.io/labs/
*    AMMO worker launcher
*/


// transphere array for AMMO worker

var Ar;

var ArLng = [ 
    10 * 8, // hero
    14 * 56, // cars
    1000 * 8, // rigid
    8192 * 3,  // soft
    100 * 4, // joint
];

var ArPos = [ 
    0, 
    ArLng[0], 
    ArLng[0] + ArLng[1],
    ArLng[0] + ArLng[1] + ArLng[2],
    ArLng[0] + ArLng[1] + ArLng[2] + ArLng[3],
];

var ArMax = ArLng[0] + ArLng[1] + ArLng[2] + ArLng[3] + ArLng[4];



//var Br, Cr, Jr, Hr, Sr;

var oimo = ( function () {

    'use strict';

    var pause = false;

    var worker, callback, blob;
    var isDirect, isBuffer, isDynamic;

    var timestep = 1/60;//0.017;//1/60;
    var substep = 2;//7;

    var timerate = timestep * 1000;
    
    
    var sendTime = 0;
    var delay = 0;

    var time = 0;
    var temp = 0;
    var count = 0;
    var fps = 0;

    var timer = 0;

    var sab, ia;

    var buff;

    oimo = {

        init: function ( Callback, direct, buff ) {

            // test buffer
            //sab = new SharedArrayBuffer( Float32Array.BYTES_PER_ELEMENT * 1024 );
            //sab = new ArrayBuffer( Float32Array.BYTES_PER_ELEMENT * 1024 );
            //ia = new Float32Array(sab);

            //ia[37] = 0.123456;
            //Atomics.store(ia, 37, 123456);

            //console.log(Float32Array.BYTES_PER_ELEMENT)

            isBuffer = buff || false;
            isDirect = direct || false;

            callback = Callback;

            worker = new Worker('./examples/js/worker/oimo.worker.js');
            worker.onmessage = this.message;
            worker.postMessage = worker.webkitPostMessage || worker.postMessage;

            blob = document.location.href.replace(/\/[^/]*$/,"/") + "./build/oimo.js";

            // test transferrables
            /*var ab = new ArrayBuffer(1);
            worker.postMessage(ab, [ab]);
            if (ab.byteLength) isBuffer = false;
            else{ isBuffer = true; isDynamic = false }*/

            worker.postMessage( { m:'init', blob:blob, isBuffer: isBuffer, isDynamic: isDynamic, timestep:timestep, substep:substep, settings:[ ArLng, ArPos, ArMax ] });
            
        },

        onInit: function () {

            window.URL.revokeObjectURL( blob );
            blob = null;

            if( callback ) callback();

        },

        start: function ( o ) {

            if( isBuffer ){ 

                buff = o.aAr;
                Ar = new Float32Array( buff );

                //Ar = o.Ar;
                
                /*Br = o.Br;
                Cr = o.Cr;
                Hr = o.Hr;
                Jr = o.Jr;
                Sr = o.Sr;*/

            }

            pause = false;
            if( isBuffer ) timer = setTimeout( oimo.sendData, 10 );
            else timer = setInterval( oimo.sendData, timerate );
           
        },

        message: function( e ) {

            var data = e.data;

            switch( data.m ){
                case 'init': oimo.onInit(); break;
                case 'step': oimo.step( data ); break;
                case 'ellipsoid': view.ellipsoidMesh( data.o ); break;
                case 'start': oimo.start( data ); break;
            }

        },

        step: function ( o ) {

            if( pause ) return;

            /*if(o.n === 0 ) Ar = [];

            Ar.push(o.result);

            if (o.n === ArMax-1 ) {

                time = Date.now();//now();
                if ( (time - 1000) > temp ){ temp = time; fps = count; count = 0; }; count++;

                view.needUpdate( true );
            }*/

            

            time = Date.now();//now();
            if ( (time - 1000) > temp ){ temp = time; fps = count; count = 0; }; count++;

            /*
            Br = new Float32Array( o.Br );
            Cr = new Float32Array( o.Cr );
            Hr = new Float32Array( o.Hr );
            Jr = new Float32Array( o.Jr );
            Sr = new Float32Array( o.Sr );
            */
            //Ar = [];
            //Ar.push( JSON.parse( o.Ar ) );

            

            //if (Ar.length === o.len) {
                //console.debug("Complete!");
          //      view.needUpdate( true );
            //}

            //Ar = o.Ar;

            /*Br = o.Br;
            Cr = o.Cr;
            Hr = o.Hr;
            Jr = o.Jr;
            Sr = o.Sr;*/

            if( isBuffer ){ 
                buff = o.aAr;
                Ar = new Float32Array( buff );
            }

            else Ar = o.Ar;

            //Ar = JSON.parse( o.Ar );
            
            //Ar = new Float32Array( o.Ar );

            view.needUpdate( true );

            if( isBuffer ){

                delay = ( timerate - ( time - sendTime ));
                delay = delay < 0 ? 0 : delay;
                timer = setTimeout( oimo.sendData, delay );
            }
            
        },

        sendData: function (){

            
            if( isBuffer ){
                sendTime = Date.now();
                //if( isDynamic ) worker.postMessage( { m:'step', key:user.getKey() });
                //else worker.postMessage( { m:'step', key:user.getKey(), Br:Br, Cr:Cr, Hr:Hr, Jr:Jr, Sr:Sr }, [ Br.buffer, Cr.buffer, Hr.buffer, Jr.buffer, Sr.buffer ]);
                //else worker.postMessage( { m:'step', key:user.getKey(), Ar:Ar }, [ Ar.buffer ]);

                worker.postMessage( { m:'step', key:user.getKey(), aAr:buff }, [ buff ]);
                tell( 'THREE '+ view.getFps() + ' | OIMO ' + fps +' | '+ delay.toFixed(1) +' ms' );
            } else { 
                worker.postMessage( { m:'step', key:user.getKey() });
                tell( 'THREE '+ view.getFps() + ' | AMMO ' + fps );
            }
            
            
        },

        send: function ( m, o ) {

            worker.postMessage( { m:m, o:o });

        },

        reset: function( full ) {

            if( isBuffer ) clearTimeout( timer );
            else clearInterval( timer )

            pause = true;
            view.needUpdate( false );

            view.reset();

            sendTime = 0;
            delay = 0;
            worker.postMessage( { m:'reset', full:full });

        },
    }

    return oimo;

})();