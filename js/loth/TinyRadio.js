/**
 * @author loth / http://3dflashlo.wordpress.com/
 */

var TinyRadio = function (name) {
	var container = document.createElement( 'div' );
	container.id = 'TinyRadio';
	container.style.cssText = 'position:absolute; left:400px; bottom:0px; color:#CCCCCC; font-size:10px; font-family:"Trebuchet MS", Helvetica, sans-serif; pointer-events:none;';

	var buttonStyle = 'font-weight:bold; width:40px; height:28px; position:relative; -webkit-border-radius: 20px; border-radius:20px;  box-shadow: 0 0 4px rgba(255,255,255,0.3); text-shadow: 1px 1px 3px #000;background-color: rgba(1,1,1,0.1); display:inline-block; text-align:left; cursor:pointer; pointer-events:auto;font-size:20px; letter-spacing:-4px;';
	
    var bcenter = document.createElement( 'div' );
	bcenter.style.cssText ='font-weight:bold; width:80px; height:40px; position:relative; display:block; font-size:14px; text-shadow: 1px 1px 3px #000;';
	bcenter.textContent = "RADIO";

	//-----------------------------------------------------
    //  AUDIO
    //-----------------------------------------------------

	var audio = new Audio();
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