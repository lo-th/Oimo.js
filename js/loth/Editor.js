/**
 * @author loth / http://3dflashlo.wordpress.com/
 */
'use strict';
var Editor = function (Pos) {
	var left = Pos || 590;
	var render3d, scene3d = null;
	var unselect = '-o-user-select:none; -ms-user-select:none; -khtml-user-select:none; -webkit-user-select:none; -moz-user-select: none;'
	var textselect = '-o-user-select:text; -ms-user-select:text; -khtml-user-select:text; -webkit-user-select:text; -moz-user-select: text;'
	var mini = true;
	var type = "color";
	var open = false;
	var startHeight = 416;
	var maxWidth = 600;

    var container = document.createElement( 'div' );
	container.style.cssText = unselect+'position:absolute; bottom:0px; left:'+left+'px; color:#CCCCCC; font-size:12px; font-family:SourceCode; text-align:center; pointer-events:none;';
	container.id = 'Editor';

	var borderL = '-webkit-border-top-left-radius:20px; border-top-left-radius:20px;';
	var borderR = '-webkit-border-top-right-radius:20px; border-top-right-radius:20px;';
    var effect = 'box-shadow: 0 0 4px rgba(255,255,255,0.3); ';

	var deco = document.createElement( 'div' );
	deco.id = 'Editor-deco';
	deco.style.cssText = unselect+borderL+borderR+effect+'font-weight:bold; width:140px; margin-left:-70px; height:'+startHeight+'px; position:relative; display:block; overflow:hidden;pointer-events:none;';
	deco.style.transform='translateY('+(startHeight-30)+'px)';
	deco.style.webkitTransform='translateY('+(startHeight-30)+'px)';
	container.appendChild( deco );

	//----------------------------------------------

	var bstyle =unselect+ 'text-shadow: 1px 1px 3px #000; font-weight:bold; font-size:14px; border-bottom:1px solid rgba(1,1,1,0.3); background:rgba(1,1,1,0.1); height:19px; padding:5px 0px;';
	var buttonActif = 'position:relative; display:inline-block; cursor:pointer; pointer-events:auto;';

	/*var bnext = document.createElement( 'div' );
	bnext.id = 'Editor-bnext';
	bnext.style.cssText =bstyle + borderR+buttonActif+'width:30px;';
	bnext.textContent = ">";

	var bprev = document.createElement( 'div' );
	bprev.id = 'Editor-bprev';
	bprev.style.cssText =bstyle+borderL+buttonActif+'width:30px;';
	bprev.textContent = "<";*/

	var bcenter = document.createElement( 'div' );
	bcenter.id = 'Editor-bcenter';
	bcenter.style.cssText =bstyle+borderL+borderR+buttonActif+'width:140px;';
	bcenter.textContent = "EDITOR";

	//deco.appendChild( bprev );
	deco.appendChild( bcenter );
	//deco.appendChild( bnext );

	bcenter.addEventListener( 'mousedown', function ( event ) { event.preventDefault(); transforme(); this.style.backgroundColor = 'rgba(55,123,167,0.5)'; }, false );
	//bprev.addEventListener( 'mousedown', function ( event ) { event.preventDefault(); this.style.backgroundColor = 'rgba(55,123,167,0.5)';}, false );
	//bnext.addEventListener( 'mousedown', function ( event ) { event.preventDefault(); this.style.backgroundColor = 'rgba(55,123,167,0.5)';}, false );

	bcenter.addEventListener( 'mouseover', function ( event ) { event.preventDefault();  this.style.backgroundColor = 'rgba(55,123,167,1)';  }, false ); 
	//bprev.addEventListener( 'mouseover', function ( event ) { event.preventDefault();  this.style.backgroundColor = 'rgba(55,123,167,1)';  }, false );
	//bnext.addEventListener( 'mouseover', function ( event ) { event.preventDefault();  this.style.backgroundColor = 'rgba(55,123,167,1)';  }, false );

    bcenter.addEventListener( 'mouseout', function ( event ) { event.preventDefault(); this.style.backgroundColor = 'rgba(1,1,1,0.1)';  }, false );
    //bprev.addEventListener( 'mouseout', function ( event ) { event.preventDefault(); this.style.backgroundColor ='rgba(1,1,1,0.1)';  }, false );
    //bnext.addEventListener( 'mouseout', function ( event ) { event.preventDefault(); this.style.backgroundColor = 'rgba(1,1,1,0.1)';  }, false );

	var transforme = function(){
	    if(!open){
	    	open = true;
	    	bcenter.style.width= maxWidth+'px';
			deco.style.marginLeft=-maxWidth*0.5+'px';
			deco.style.width= maxWidth+'px';
			deco.style.height= '416px';
			deco.style.transform='translateY(0px)';
			deco.style.transition='transform 250ms ease-out';
			deco.style.webkitTransform='translateY(0px)';
			deco.style.webkitTransition='transform 250ms ease-out';
			//displayPannel();

			decoFrame.style.pointerEvents= 'auto';
			decoFrame.style.display = 'block';
			//decoFrame.appendChild( fs );
			//fs.style.display ='block';
			//fs.style.top = "30px";
		} else {
			open = false;
			var ty = deco.clientHeight-30;
			bcenter.style.width= '140px';
			deco.style.marginLeft='-70px';
			deco.style.width= '140px';
			deco.style.transform='translateY('+ty+'px)';
			deco.style.transition='transform 250ms ease-out';
			deco.style.webkitTransform='translateY('+ty+'px)';
			deco.style.webkitTransition='transform 250ms ease-out';
			if(doc)doc.f.ta.blur(); 
			//bcenter.blur();
			//bcenter.style.pointerEvents= 'none';
			decoFrame.style.pointerEvents= 'none';
			//decoFrame.style.display = 'none';
			//document.body.select();
			//deco.blur();
			//decoFrame.removeChild( fs );
			//hidePannel();
		}
	}

	var bRun = document.createElement( 'div' );
	bRun.id = 'Editor-Run';
	bRun.style.cssText =bstyle+buttonActif+'width:'+maxWidth+'px;';
	bRun.textContent = "RUN SCRIPT";
	deco.appendChild( bRun );

	bRun.addEventListener( 'mousedown', function ( event ) { event.preventDefault(); update(); this.style.backgroundColor = 'rgba(55,123,167,0.5)';}, false );
	bRun.addEventListener( 'mouseover', function ( event ) { event.preventDefault();  this.style.backgroundColor = 'rgba(55,123,167,1)';  }, false );
    bRun.addEventListener( 'mouseout', function ( event ) { event.preventDefault(); this.style.backgroundColor = 'rgba(1,1,1,0.1)';  }, false );

    /*var bImport = document.createElement( 'div' );
	bImport.id = 'Editor-Import';
	bImport.style.cssText =bstyle+buttonActif+'width:'+maxWidth*0.5+'px;';
	bImport.textContent = "IMPORT SCRIPT";
	deco.appendChild( bImport );

	bImport.addEventListener( 'mousedown', function ( event ) { event.preventDefault(); importScript(); this.style.backgroundColor = 'rgba(55,123,167,0.5)';}, false );
	bImport.addEventListener( 'mouseover', function ( event ) { event.preventDefault();  this.style.backgroundColor = 'rgba(55,123,167,1)';  }, false );
    bImport.addEventListener( 'mouseout', function ( event ) { event.preventDefault(); this.style.backgroundColor = 'rgba(1,1,1,0.1)';  }, false );*/

    //-----------------------------------------------------
    //  MENU DEMO
    //-----------------------------------------------------
    
	var bbMenu = [];
	var maxDemo = 6;


	for(var i=0;i!==maxDemo;i++){
		bbMenu[i] = document.createElement( 'div' );
		bbMenu[i].name = 'demo0'+i;
		if(i===0) bbMenu[i].style.cssText = bstyle+buttonActif + " width:"+maxWidth/maxDemo+"px; ";
		else bbMenu[i].style.cssText = bstyle+buttonActif + " width:"+ (maxWidth/maxDemo-1) +"px; border-left:1px solid rgba(1,1,1,0.3);";
		bbMenu[i].textContent = 'DEMO 0'+i;
		bbMenu[i].addEventListener( 'mouseover', function ( event ) { event.preventDefault(); this.style.backgroundColor = 'rgba(55,123,167,1)';  }, false );
		bbMenu[i].addEventListener( 'mouseout', function ( event ) { event.preventDefault();  this.style.backgroundColor = 'rgba(1,1,1,0.1)';  }, false );
		bbMenu[i].addEventListener( 'mousedown', function ( event ) { event.preventDefault(); importScript(this.name); this.style.backgroundColor = 'rgba(55,123,167,0.5)';}, false );

		deco.appendChild( bbMenu[i] );
	}

	//var doc;
	var codeEditor
	var head = document.getElementsByTagName('head')[0];
	var nscript;

	/*var decoFrame = document.createElement( 'div' );
	decoFrame.id = 'decoFrame';
	decoFrame.style.cssText =unselect+'top:0px; position:relative; display:none; height:325px; overflow:hidden; ';
	deco.appendChild( decoFrame );*/

	var MainEditor = document.createElement( 'iframe' );
	MainEditor.id = 'mEditor'
	MainEditor.name = 'MainEditor';
	MainEditor.src = "demos/editor.html";
	MainEditor.style.cssText =unselect+'width:'+maxWidth+'px; height:325px; border:none; overflow:hidden; pointer-events:auto;';
	deco.appendChild( MainEditor );
	//scrollbar-face-color: #000000; scrollbar-shadow-color: #2D2C4D; scrollbar-highlight-color:#7D7E94; scrollbar-3dlight-color: #7D7E94; scrollbar-darkshadow-color: #2D2C4D; scrollbar-track-color: #7D7E94; scrollbar-arrow-color: #C1C1D1;';

	//MainEditor.onload  = function () { doc = window.MainEditor.document;}
	
	var importScript = function(name){
		MainEditor.contentWindow.loadfile(name+".html");
	}

	var update = function ()
	{
		nscript = document.createElement("script");
		nscript.type = "text/javascript";
		nscript.name = "topScript";
		nscript.id = "topScript";
		nscript.charset = "utf-8";
		nscript.text = MainEditor.contentWindow.codeEditor.getValue();
		head.appendChild(nscript);
	}

	return {
		domElement: container,
		importScript:importScript,
		getScript: function () {
			return nscript;
		}
	}

}
