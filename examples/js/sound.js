var sound = ( function () {

    'use strict';

    var urls = [ 'hit', 'bop', 'impact', 'low', 'tap' ];

    var snd = [];
    var callback = null;
    var pool = [];

    sound = {

        init: function ( Callback ) {

            callback = Callback || function(){};
            this.load( urls[0] );

        },

        load_next: function () {

            urls.shift();
            if( urls.length === 0 ) callback();
            else sound.load( urls[0] );

        },

        load: function ( name ) {

            var audio = document.createElement('audio');
            audio.style.display = "none";
            audio.src = './examples/assets/sounds/'+ name +'.mp3';
            audio.autoplay = false;

            audio.addEventListener('loadeddata', function(){

                snd[name] = audio;
                sound.load_next();

            }, false);
         
        },

        play: function ( name ) {

            if( snd[ name ] ){

                var id = pool.length;
                pool.push( snd[ name ].cloneNode() );
                pool[id].play();
                pool[id].onended = function(){ pool.splice( pool.indexOf( this ), 1 ); delete this; }

            }

        },

    }

    return sound;

})();