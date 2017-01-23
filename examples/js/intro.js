var intro = ( function () {

    intro = function () {};

    var content;
    var txt;

    intro.init = function () {

        content = document.createElement( 'img' );
        content.style.cssText = "position:absolute; margin:0; padding:0; top:50%; left:50%; width:500px; height:200px; margin-left:-250px; margin-top:-100px; display:block; pointer-events:none";
        content.src = 'examples/assets/img/logo.png';
        document.body.appendChild( content );

        txt = document.createElement( 'div' );
        txt.style.cssText = "text-align:center; position:absolute; margin:0; padding:0; top:50%; left:50%; width:500px; height:20px; margin-left:-250px; margin-top:100px; display:block; pointer-events:none";
        txt.innerHTML = 'loading...';
        document.body.appendChild( txt );

    };

    intro.clear = function () {

        document.body.removeChild( content );
        document.body.removeChild( txt );

    };

    intro.message = function ( str ) {

        txt.innerHTML = str;

    }

    return intro;

})();