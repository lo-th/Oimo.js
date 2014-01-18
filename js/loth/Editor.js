/**
 * @author loth / http://3dflashlo.wordpress.com/
 */
'use strict';
var Editor = function (Pos) {
	var left = Pos || 310;//590;
	var render3d, scene3d = null;
	var unselect = '-o-user-select:none; -ms-user-select:none; -khtml-user-select:none; -webkit-user-select:none; -moz-user-select: none;'
	var textselect = '-o-user-select:text; -ms-user-select:text; -khtml-user-select:text; -webkit-user-select:text; -moz-user-select: text;'
	var mini = true;
	var type = "color";
	var open = false;

    var container = document.createElement( 'div' );
	container.style.cssText = unselect+'position:absolute; margin:0; padding:0; top:0px; left:50%; color:#CCCCCC; width:50%; height:100%; font-size:12px; font-family:SourceCode;  pointer-events:none; display:none';
	container.id = 'Editor';

	var show = function(mode){
		if(mode === 'v'){
			container.style.top = "0px";
			container.style.left = "50%";
			container.style.height = "100%";
			container.style.width = "50%";
		} else{
			container.style.top = "50%";
			container.style.left = "0px";
			container.style.height = "50%";
			container.style.width = "100%";
		}

	
		container.style.display = "block";

	}

	var hide = function(){
		container.style.display = "none";
	}

	//var borderL = '-webkit-border-top-left-radius:20px; border-top-left-radius:20px;';
	//var borderR = '-webkit-border-top-right-radius:20px; border-top-right-radius:20px;';
    //var effect = 'border:1px solid rgba(255,255,255,0.3);';

	/*var deco = document.createElement( 'div' );
	deco.id = 'Editor-deco';
	deco.style.cssText = unselect+borderL+borderR+effect+' width:140px; margin-left:-70px; height:'+startHeight+'px; position:relative; display:block; overflow:hidden; pointer-events:none;';
	deco.style.transform='translateY('+(startHeight-30)+'px)';
	deco.style.webkitTransform='translateY('+(startHeight-30)+'px)';
	container.appendChild( deco );

	//----------------------------------------------

	
	

	var bcenter = document.createElement( 'div' );
	bcenter.id = 'Editor-bcenter';
	bcenter.style.cssText =bstyle+borderL+borderR+buttonActif+'width:140px;';
	bcenter.textContent = "EDITOR";
	deco.appendChild( bcenter );

	bcenter.addEventListener( 'mousedown', function ( event ) { event.preventDefault(); transforme(); this.style.backgroundColor = 'rgba(55,123,167,0.5)'; }, false );
	bcenter.addEventListener( 'mouseover', function ( event ) { event.preventDefault();  this.style.backgroundColor = 'rgba(55,123,167,1)';  }, false );
    bcenter.addEventListener( 'mouseout', function ( event ) { event.preventDefault(); this.style.backgroundColor = 'rgba(1,1,1,0.1)';  }, false );

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

			addEditor();
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

			removeEditor();
		}
	}*/
   // addEditor();

	var buttonActif = 'position:relative; display:inline-block; cursor:pointer; pointer-events:auto;';
	var bstyle =unselect+ ' font-size:14px; border-bottom:1px solid rgba(255,255,255,0.3); background:rgba(55,123,167,0.1); height:19px; padding:0px 0px; text-align:center;';


	var decoFrame, bRun, bbMenu, maxDemo, codeEditor, nscript, oldScript, MainEditor;

	//var addEditor = function(){
		bbMenu = [];
		maxDemo = 8;
		decoFrame = document.createElement( 'div' );
		decoFrame.id = 'decoFrame';
		decoFrame.style.cssText =unselect+'top:10px; left:120px; position:absolute; display:block; width:calc(100% - 120px); height:60px; overflow:hidden; padding:0;';
		container.appendChild( decoFrame );

		/*var decoFrame2 = document.createElement( 'div' );
		decoFrame2.id = 'decoFrame';
		decoFrame2.style.cssText =unselect+'top:10px; left:90px; position:absolute; display:block; width:calc(100% - 90px); height:40px; overflow:hidden; padding:0;';
		decoFrame.appendChild( decoFrame2 );*/

		bRun = document.createElement( 'div' );
		bRun.id = 'Editor-Run';
		bRun.style.cssText =bstyle+buttonActif+'top:10px; left:10px; position:absolute; width:100px; height:40px; border:1px solid rgba(255,255,255,0.3);';
		bRun.textContent = "RUN SCRIPT";
		container.appendChild( bRun );

		bRun.addEventListener( 'mousedown', function ( event ) { event.preventDefault(); update(); this.style.backgroundColor = 'rgba(55,123,167,0.5)';}, false );
		bRun.addEventListener( 'mouseover', function ( event ) { event.preventDefault();  this.style.backgroundColor = 'rgba(55,123,167,1)';  }, false );
	    bRun.addEventListener( 'mouseout', function ( event ) { event.preventDefault(); this.style.backgroundColor = 'rgba(1,1,1,0.1)';  }, false );

	    //  MENU DEMO
		for(var i=0;i!==maxDemo;i++){
			bbMenu[i] = document.createElement( 'div' );
			bbMenu[i].name = 'demo0'+i;
			//if(i===0) bbMenu[i].style.cssText = bstyle+buttonActif + " width:70px; ";
			//else 
			bbMenu[i].style.cssText = bstyle+buttonActif + " width:70px; border-left:1px solid rgba(255,255,255,0.3);";
			bbMenu[i].textContent = 'demo 0'+i;
			bbMenu[i].addEventListener( 'mouseover', function ( event ) { event.preventDefault(); this.style.backgroundColor = 'rgba(55,123,167,1)';  }, false );
			bbMenu[i].addEventListener( 'mouseout', function ( event ) { event.preventDefault();  this.style.backgroundColor = 'rgba(55,123,167,0.1)';  }, false );
			bbMenu[i].addEventListener( 'mousedown', function ( event ) { event.preventDefault(); importScript(this.name); this.style.backgroundColor = 'rgba(55,123,167,0.5)';}, false );
			decoFrame.appendChild( bbMenu[i] );
		}

		/*var decoEdit = document.createElement( 'div' );
		decoEdit.id = 'decoFrame';
		decoEdit.style.cssText =unselect+'top:90px;bottom:30px; position:absolute; display:block; width:100%; background:#ff0000;';// height:calc(100% + 50px);
		container.appendChild( decoEdit );*/

		MainEditor = document.createElement( 'iframe' );
		MainEditor.id = 'mEditor';
		MainEditor.name = 'MainEditor';
		MainEditor.src = "demos/editor.html";
		//MainEditor.style.cssText =unselect+'width:100%; height:100%; border:none; overflow:hidden; pointer-events:auto; display:block;';

		MainEditor.style.cssText =unselect+"top:70px; bottom:0px; left:10px; right:0;  margin:0; padding:0; position:absolute; height:calc(100% - 70px); width:calc(100% - 10px); display:block; pointer-events:auto; border:none;"
		//MainEditor.style.cssText =unselect+'width:100%; height:100%; border:none; overflow:hidden; pointer-events:auto; display:block;';
		//MainEditor.style.cssText =' bottom:0px; position:absolute; display:block; width:100%; height:calc(100% + 50px); border:none; pointer-events:auto;';
		container.appendChild( MainEditor );

		//if(oldScript) setTimeout(reFileEditor, 1000);
	//}

	/*var reFileEditor = function(){
		MainEditor.contentWindow.codeEditor.setValue(oldScript);
	}

	var removeEditor = function(){
		oldScript = MainEditor.contentWindow.codeEditor.getValue() || '';
		deco.removeChild(MainEditor);
		for(var i=0;i!==maxDemo;i++){
			bbMenu[i].removeEventListener( 'mouseover', function ( event ) { event.preventDefault(); this.style.backgroundColor = 'rgba(55,123,167,1)';  }, false );
			bbMenu[i].removeEventListener( 'mouseout', function ( event ) { event.preventDefault();  this.style.backgroundColor = 'rgba(1,1,1,0.1)';  }, false );
			bbMenu[i].removeEventListener( 'mousedown', function ( event ) { event.preventDefault(); importScript(this.name); this.style.backgroundColor = 'rgba(55,123,167,0.5)';}, false );
			decoFrame.removeChild( bbMenu[i] );
		}
		bRun.removeEventListener( 'mousedown', function ( event ) { event.preventDefault(); update(); this.style.backgroundColor = 'rgba(55,123,167,0.5)';}, false );
		bRun.removeEventListener( 'mouseover', function ( event ) { event.preventDefault();  this.style.backgroundColor = 'rgba(55,123,167,1)';  }, false );
	    bRun.removeEventListener( 'mouseout', function ( event ) { event.preventDefault(); this.style.backgroundColor = 'rgba(1,1,1,0.1)';  }, false );
		decoFrame.removeChild( bRun );
		deco.removeChild( decoFrame );
	}*/

	var importScript = function(name){
		MainEditor.contentWindow.loadfile(name+".html");
	}

	var update = function (){
		var head = document.getElementsByTagName('head')[0];
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
		show:show,
		hide:hide,
		importScript:importScript,
		getScript: function () {
			return nscript;
		}
	}

}
