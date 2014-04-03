/**
 * @author loth / http://3dflashlo.wordpress.com/
 */
var Editor = function (Pos) {
	'use strict';
	var left = Pos || 310;//590;
	var render3d, scene3d = null;
	var unselect = '-o-user-select:none; -ms-user-select:none; -khtml-user-select:none; -webkit-user-select:none; -moz-user-select: none;'
	var textselect = '-o-user-select:text; -ms-user-select:text; -khtml-user-select:text; -webkit-user-select:text; -moz-user-select: text;'
	var mini = true;
	var type = "color";
	var open = false;

    var container = document.createElement( 'div' );
	container.style.cssText = unselect+'position:absolute; margin:0; padding:0; top:0px; left:50%; color:#CCCCCC; width:50%; height:100%; font-size:12px; font-family:SourceCode;  pointer-events:none; display:none; background: linear-gradient(45deg, #1d1f20, #2f3031);';
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

		if(MainEditor)MainEditor.contentWindow.close()
		window.focus();

	}


	var colors = ['#303030', '#b10dc9', '#0074d9', '#ff851b'];
	var buttonActif = 'position:relative; display:inline-block; cursor:pointer; pointer-events:auto;';
	var bstyle =unselect+ ' font-size:14px; margin-right:4px; -webkit-border-radius:20px; border-radius:20px;  border:2px solid #252525; background:'+colors[0]+'; height:19px; padding:2px 2px; text-align:center;';

	var bbMenu = [];
	var nscript;
	var maxDemo = 11;
	var currentDemo;


	var decoFrame = document.createElement( 'div' );
	decoFrame.id = 'decoFrame';
	decoFrame.style.cssText =unselect+'top:10px; left:130px; position:absolute; display:block; width:calc(100% - 120px); height:60px; overflow:hidden; padding:0;';
	container.appendChild( decoFrame );

    // RUN BUTTON
	var bRun = document.createElement( 'div' );
	bRun.id = 'Editor-Run';
	bRun.style.cssText =bstyle+buttonActif+'top:10px; left:10px; position:absolute; width:100px; height:30px; padding-top:12px;';
	bRun.textContent = "RUN SCRIPT";
	container.appendChild( bRun );
	bRun.addEventListener( 'mousedown', function ( event ) { event.preventDefault(); update(); this.style.backgroundColor = colors[3]; }, false );
	bRun.addEventListener( 'mouseover', function ( event ) { event.preventDefault();  this.style.backgroundColor = colors[2]; }, false );
    bRun.addEventListener( 'mouseout', function ( event ) { event.preventDefault(); this.style.backgroundColor = colors[0]; }, false );

    // MENU DEMO
	for(var i=0;i!==maxDemo;i++){
		bbMenu[i] = document.createElement( 'div' );
		bbMenu[i].style.cssText = bstyle + buttonActif + "width:20px; margin-right=2px;";
		if(i<10){
			bbMenu[i].textContent = '0'+i;
			bbMenu[i].name = 'demo0'+i;
		}else{
			bbMenu[i].textContent = i;
			bbMenu[i].name = 'demo'+i;
		}
		bbMenu[i].addEventListener( 'mousedown', function ( event ) { event.preventDefault(); importScript(this.name); currentDemo=this.name; this.style.backgroundColor =  colors[3];}, false );
		bbMenu[i].addEventListener( 'mouseover', function ( event ) { event.preventDefault(); this.style.backgroundColor = colors[2]; }, false );
		bbMenu[i].addEventListener( 'mouseout', function ( event ) { event.preventDefault();  this.style.backgroundColor = colors[0]; testCurrentDemo(); }, false );		
		decoFrame.appendChild( bbMenu[i] );
	}



	// MAIN EDITOR
	var MainEditor = document.createElement( 'iframe' );
	MainEditor.id = 'mEditor';
	MainEditor.name = 'MainEditor';
	MainEditor.src = "demos/mainEditor.html";
	MainEditor.style.cssText =unselect+"  top:70px; bottom:0px; left:10px; right:0;  margin:0; padding:0; position:absolute; height:calc(100% - 70px); width:calc(100% - 10px); display:block; pointer-events:auto; border:none;"
	container.appendChild( MainEditor );


	var importScript = function(name){
		MainEditor.contentWindow.setBase(Editor);
		MainEditor.contentWindow.loadfile(name+".html");
	}

	var testCurrentDemo = function(){
		for(var i=0, j=bbMenu.length;i!==j;i++){
			if(bbMenu[i].name === currentDemo)bbMenu[i].style.backgroundColor = colors[1];
			else bbMenu[i].style.backgroundColor = colors[0];
		}
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
		update:update,
		domElement: container,
		show:show,
		hide:hide,
		importScript:importScript,
		getScript: function () {
			return nscript;
		}
	}

}