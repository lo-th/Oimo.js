/**
 * @author loth / http://3dflashlo.wordpress.com/
 */
'use strict';
var TinyRadio = function (pos) {
	var left = pos || 380+266;
	var open = false;
	var startHeight = 210;

	var container = document.createElement( 'div' );	
	container.style.cssText = 'position:absolute; left:'+left+'px; bottom:0px; color:#CCCCCC; font-size:12px; font-family:SourceCode; text-align:center; text-shadow: 1px 1px 3px #000; pointer-events:none;';
	container.id = 'TinyRadio';

	var border = '-webkit-border-top-left-radius:20px; border-top-left-radius:20px; -webkit-border-top-right-radius:20px; border-top-right-radius:20px;';
    var effect = 'box-shadow: 0 0 4px rgba(255,255,255,0.3); background-color: rgba(1,1,1,0.1);';

	var deco = document.createElement( 'div' );
	deco.style.cssText = border+effect+'font-weight:bold; width:80px; margin-left:-40px; height:'+startHeight+'px; position:relative; display:block; overflow:hidden;';
	deco.style.transform='translateY('+(startHeight-30)+'px)';
	container.appendChild( deco );

	//----------------------------------------------------------

    var bcenter = document.createElement( 'div' );   
	bcenter.style.cssText =border+'display:block; font-weight:bold; font-size:14px; height:19px; padding:5px 0px; position:relative; cursor:pointer; pointer-events:auto; border-bottom:1px solid rgba(1,1,1,0.3); ';
	bcenter.textContent = "RADIO";
	deco.appendChild( bcenter );

	bcenter.addEventListener( 'mouseover', function ( event ) { event.preventDefault(); this.style.backgroundColor = 'rgba(55,123,167,1)';  }, false );
    bcenter.addEventListener( 'mouseout', function ( event ) { event.preventDefault();  this.style.backgroundColor = 'rgba(1,1,1,0.1)';  }, false );
	bcenter.addEventListener( 'mousedown', function ( event ) { event.preventDefault(); transforme(); this.style.backgroundColor = 'rgba(55,123,167,0.5)';}, false );

	var transforme = function(){
	    if(!open){
	    	open = true;
			deco.style.marginLeft='-90px';
			deco.style.width= '180px';
			deco.style.height= '210px';
			deco.style.transform='translateY(0px)';
			deco.style.transition='transform 250ms ease-out';
			deco.style.webkitTransform='translateY(0px)';
			deco.style.webkitTransition='transform 250ms ease-out';
			displayList();
		} else {
			open = false;
			var ty = deco.clientHeight-30;
			deco.style.marginLeft='-40px';
			deco.style.width= '80px';
			deco.style.transform='translateY('+ty+'px)';
			deco.style.transition='transform 250ms ease-out';
			deco.style.webkitTransform='translateY('+ty+'px)';
			deco.style.webkitTransition='transform 250ms ease-out';
			hideList();
		}
	}

	//-----------------------------------------------------
    //  LIST
    //-----------------------------------------------------

    var radioStyle = [ 'Ambient', 'DrumAndBass', 'Electro', 'Reggae', 'Progressive', 'DownTempo' ];

    var buttonListStyle = "position:relative; width:180px; height:23px; display:block; padding-top:6px;  background:rgba(1,1,1,0.1); pointer-events:auto; cursor:pointer; border-top:1px solid rgba(1,1,1,0.3);"

    var list = document.createElement( 'div' );
    list.style.cssText = 'position:absolute; width:180px; height:180px; display:none;overflow:hidden;';
    deco.appendChild( list );

    var listInner = document.createElement( 'div' );
    listInner.style.cssText = 'position:absolute; ';
    list.appendChild( listInner );

    var listScroll = document.createElement( 'div' );
    listScroll.style.cssText = 'position:absolute; width:29px; height:179px; display:none; top:0px; right:0px;  background:rgba(1,1,1,0.1); border-left:1px solid rgba(1,1,1,0.3); border-top:1px solid rgba(1,1,1,0.3);pointer-events:auto; cursor:pointer;';
    list.appendChild( listScroll );

     var listScrollIn = document.createElement( 'div' );
    listScrollIn.style.cssText = 'position:absolute; width:29px; height:29px;  top:0px; right:0px;  background:rgba(1,1,1,0.3); pointer-events:none;';
    listScroll.appendChild( listScrollIn );

    var listButtons = [];
    var listeHeight = 0;

	var displayList = function(){
		list.style.display = 'block';
		createList(radioStyle, "style");
	}

	var hideList = function(){
		list.style.display = 'none';
		for(var i=0; i!==listButtons.length; i++){
			listInner.removeChild( listButtons[i] );
		}
	}

	var moveScroll = function(e){
		var rect = listScroll.getBoundingClientRect();
		var mid = (listScrollIn.clientHeight *0.5);
		var y = (e.clientY-rect.top)-mid;
		if(y < mid) y = 0;
		else if(y>180-(mid*2)) y = 180-(mid*2);
		listScrollIn.style.top = y +'px';
		listInner.style.top = -((listeHeight/180)*y)+'px';
	}

	var createList = function(array, type){
		var w;
		var max;
		if(array.length>6){
			w = 150;
			listeHeight = 30*array.length;
			listScrollIn.style.height = (180/listeHeight)*180 +'px';
			listScroll.style.display = 'block';
			listScroll.addEventListener( 'mouseup', function ( e ) { e.preventDefault(); this.name = 'no'; this.style.backgroundColor = 'rgba(1,1,1,0.1)'; }, false );
			listScroll.addEventListener( 'mouseout', function ( e ) { e.preventDefault(); this.name = 'no'; this.style.backgroundColor = 'rgba(1,1,1,0.1)'; }, false );
			listScroll.addEventListener( 'mousedown', function ( e ) { e.preventDefault(); this.name = 'drag'; moveScroll(e); this.style.backgroundColor = 'rgba(55,123,167,0.5)'; }, false );
			listScroll.addEventListener( 'mousemove', function ( e ) { e.preventDefault(); if(this.name==="drag")moveScroll(e); }, false );
		} else {
			w = 180;
			listScroll.style.display = 'none';
		};
		for(var i=0; i!==array.length; i++){
			listButtons[i] = document.createElement( 'div' );
			listButtons[i].style.cssText = buttonListStyle;
			listButtons[i].style.width = w+'px';
			listButtons[i].innerHTML = array[i];
			listButtons[i].name = array[i];
			listButtons[i].id = type;
			listInner.appendChild( listButtons[i] );

			listButtons[i].addEventListener( 'mouseover', function ( event ) { event.preventDefault(); this.style.backgroundColor = 'rgba(55,123,167,1)';  }, false );
			listButtons[i].addEventListener( 'mouseout', function ( event ) { event.preventDefault();  this.style.backgroundColor = 'rgba(1,1,1,0.1)';  }, false );
			listButtons[i].addEventListener( 'mousedown', function ( event ) { event.preventDefault(); this.style.backgroundColor = 'rgba(55,123,167,0.5)';}, false );
		}
	}

	//-----------------------------------------------------
    //  AUDIO
    //-----------------------------------------------------

	var audio = new Audio();

	var play = function(url){
		audio.src = url + "/;";
		audio.play();
	}

	//audio.src = "http://173.239.76.148:8032/;";
	//audio.play();
	/*
	audio.onloadeddata = function(){
     	document.getElementById("info").innerHTML += "<br>Sound Launch XX";
    }
	audio.oncanplay = function(){
	  	document.getElementById("info").innerHTML += "<br>Sound Launch";
	  }

	audio.onloadedmetadata = function(e){
	  	document.getElementById("info").innerHTML += "<br>Metadata";
	  	document.getElementById("info").innerHTML += "<br>net: "  + audio.networkState;
	  	document.getElementById("info").innerHTML += "<br>buffered: "  + audio.buffered;
	  	document.getElementById("info").innerHTML += "<br>audioTracks: "  + audio.audioTracks;
	}*/


    return {
		domElement: container
	}
}