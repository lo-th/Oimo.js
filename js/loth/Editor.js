/**
 * @author loth / http://3dflashlo.wordpress.com/
 */
'use strict';
var Editor = function (Pos) {
	var left = Pos || 500;
	var render3d, scene3d = null;
	var unselect = '-o-user-select:none; -ms-user-select:none; -khtml-user-select:none; -webkit-user-select:none; -moz-user-select: none;'
	var textselect = '-o-user-select:text; -ms-user-select:text; -khtml-user-select:text; -webkit-user-select:text; -moz-user-select: text;'
	var mini = true;
	var type = "color";
	var open = false;
	var startHeight = 416;
	var maxWidth = 500;

    var container = document.createElement( 'div' );
	container.style.cssText = unselect+'position:absolute; bottom:0px; left:'+left+'px; color:#CCCCCC; font-size:12px; font-family:SourceCode; text-align:center; pointer-events:none;';
	container.id = 'Demo';

	var borderL = '-webkit-border-top-left-radius:20px; border-top-left-radius:20px;';
	var borderR = '-webkit-border-top-right-radius:20px; border-top-right-radius:20px;';
    var effect = 'box-shadow: 0 0 4px rgba(255,255,255,0.3); ';

	var deco = document.createElement( 'div' );
	deco.style.cssText = borderL+borderR+effect+'font-weight:bold; width:140px; margin-left:-70px; height:'+startHeight+'px; position:relative; display:block; overflow:hidden;';
	deco.style.transform='translateY('+(startHeight-30)+'px)';
	deco.style.webkitTransform='translateY('+(startHeight-30)+'px)';
	container.appendChild( deco );

	//----------------------------------------------

	var bstyle = 'text-shadow: 1px 1px 3px #000; font-weight:bold; font-size:14px; border-bottom:1px solid rgba(1,1,1,0.3); background:rgba(1,1,1,0.1); height:19px; padding:5px 0px;';
	var buttonActif = 'position:relative; display:inline-block; cursor:pointer; pointer-events:auto;';

	var bnext = document.createElement( 'div' );
	bnext.style.cssText =bstyle + borderR+buttonActif+'width:30px;';
	bnext.textContent = ">";

	var bprev = document.createElement( 'div' );
	bprev.style.cssText =bstyle+ borderL+buttonActif+'width:30px;';
	bprev.textContent = "<";

	var bcenter = document.createElement( 'div' );
	bcenter.style.cssText =bstyle+buttonActif+'width:80px;';
	bcenter.textContent = "EDITOR";

	deco.appendChild( bprev );
	deco.appendChild( bcenter );
	deco.appendChild( bnext );

	bcenter.addEventListener( 'mousedown', function ( event ) { event.preventDefault(); transforme(); this.style.backgroundColor = 'rgba(55,123,167,0.5)'; }, false );
	bprev.addEventListener( 'mousedown', function ( event ) { event.preventDefault(); if(type==="color") prev(); else prevLocation(); this.style.backgroundColor = 'rgba(55,123,167,0.5)';}, false );
	bnext.addEventListener( 'mousedown', function ( event ) { event.preventDefault(); if(type==="color") next(); else nextLocation(); this.style.backgroundColor = 'rgba(55,123,167,0.5)';}, false );

	bcenter.addEventListener( 'mouseover', function ( event ) { event.preventDefault();  this.style.backgroundColor = 'rgba(55,123,167,1)';  }, false ); 
	bprev.addEventListener( 'mouseover', function ( event ) { event.preventDefault();  this.style.backgroundColor = 'rgba(55,123,167,1)';  }, false );
	bnext.addEventListener( 'mouseover', function ( event ) { event.preventDefault();  this.style.backgroundColor = 'rgba(55,123,167,1)';  }, false );

    bcenter.addEventListener( 'mouseout', function ( event ) { event.preventDefault(); this.style.backgroundColor = 'rgba(1,1,1,0.1)';  }, false );
    bprev.addEventListener( 'mouseout', function ( event ) { event.preventDefault(); this.style.backgroundColor ='rgba(1,1,1,0.1)';  }, false );
    bnext.addEventListener( 'mouseout', function ( event ) { event.preventDefault(); this.style.backgroundColor = 'rgba(1,1,1,0.1)';  }, false );

	var transforme = function(){
	    if(!open){
	    	open = true;
	    	bcenter.style.width= maxWidth-60+'px';
			deco.style.marginLeft=-maxWidth*0.5+'px';
			deco.style.width= maxWidth+'px';
			deco.style.height= '416px';
			deco.style.transform='translateY(0px)';
			deco.style.transition='transform 250ms ease-out';
			deco.style.webkitTransform='translateY(0px)';
			deco.style.webkitTransition='transform 250ms ease-out';
			//displayPannel();
			MainEditor.style.display = 'block';
		} else {
			open = false;
			var ty = deco.clientHeight-30;
			bcenter.style.width= '80px';
			deco.style.marginLeft='-70px';
			deco.style.width= '140px';
			deco.style.transform='translateY('+ty+'px)';
			deco.style.transition='transform 250ms ease-out';
			deco.style.webkitTransform='translateY('+ty+'px)';
			deco.style.webkitTransition='transform 250ms ease-out';
			MainEditor.style.display = 'none';
			//hidePannel();
		}
	}

	var editboxHTML = 
'<html class="expand close">' +
'<head>' +
'<style type="text/css">' +
'.expand { width: 100%; height: 100%; }' +
'.close { border: none; margin: 0px; padding: 0px; }' +
'html,body { overflow: hidden; }' +
'@font-face { font-family: "SourceCode"; src: url("images/SourceCodePro.woff") format("woff");}' +
'<\/style>' +
'<\/head>' +
'<body class="expand close" onload="document.f.ta.focus(); document.f.ta.select();">' +
'<form class="expand close" name="f">' +
'<textarea class="expand close" style="background:#000; font-family:SourceCode; letter-spacing:-1px; color:#cccccc;" name="ta" wrap="hard" spellcheck="false" >' +
'<\/textarea>' +
'<\/form>' +
'<\/body>' +
'<\/html>';

	//var MainEditor = document.createElement( 'input' );
	/*var fs = document.createElement( 'frameset' );

	var MainEditor = document.createElement( 'frame' );
	MainEditor.name = 'MainEditor';
	//MainEditor.src = 'javascript:'';';
	//a

	var refEditor = document.createElement( 'frame' );
	refEditor.style.cssText = 'display:none;'
	refEditor.name = 'refEditor';
	refEditor.src = 'demos/demo01.html';
	// init();
	//MainEditor.type = 'text';
	//MainEditor.async = true;
	MainEditor.style.cssText ='width:'+maxWidth+'px; height:256px; display:none; pointer-events:auto; text-align:left; border:none; ';
*/
	
	//deco.appendChild( MainEditor );
/*
	deco.appendChild( fs );
	fs.appendChild( MainEditor );
fs.appendChild( refEditor );
	//window.MainEditor.document.write(editboxHTML);

refEditor.onload = function ()
{
	var doc =window.MainEditor.document;
    var defaultStuff =refEditor.document.documentElement.innerHTML;//.getElementsByTagName('pre')[0].innerHTML//outerHTML  //read(); 
    refEditor.style.cssText = 'display:none;'
     //document.documentElement.innerHTML
    // document.documentElement.outerHTML
  doc.write(editboxHTML);
  doc.close();
 doc.f.ta.value = defaultStuff;
 
	    //document.body.appendChild(script);
 // window.MainEditor.document.f.ta.style.fontFamily = 'SourceCode';
  doc.f.ta.style.fontSize = '10px';
  //update();
}*/
/*var script = document.createElement("script");
	    script.type = "text/javascript";
	    script.src = "demos/demo01.js";
	    doc.f.ta.value = script.documentElement.innerHTML*/
/*function update()
{
  var textarea = window.MainEditor.document.f.ta;
  var d = dynamicframe.document; 

  if (old != textarea.value) {
    old = textarea.value;
    d.open();
    d.write(old);
    if (old.replace(/[\r\n]/g,'') == defaultStuff.replace(/[\r\n]/g,''))
     // d.write(extraStuff);
    d.close();
  }

  window.setTimeout(update, 150);
}*/










    

	return {
		domElement: container
	}

}
