/**
 * @author loth / http://3dflashlo.wordpress.com/
 */
 'use strict';
var Editor = function (Pos) {
	var doc = document;
	
	var left = Pos || 310;//590;
	var render3d, scene3d = null;
	var unselect = '-o-user-select:none; -ms-user-select:none; -khtml-user-select:none; -webkit-user-select:none; -moz-user-select: none;'
	var textselect = '-o-user-select:text; -ms-user-select:text; -khtml-user-select:text; -webkit-user-select:text; -moz-user-select: text;'
	var mini = true;
	var type = "color";
	var open = false;

    var container = doc.createElement( 'div' );
	container.style.cssText = unselect+'position:absolute; margin:0; padding:0; top:0px; left:50%; color:#CCCCCC; width:50%; height:100%; font-size:12px; font-family:Consolas; pointer-events:none; display:none; background: linear-gradient(45deg, #1d1f20, #2f3031);';
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

	var iconSize2 = 46;
	var iconColor = '#ffffff'

	var icon_update = [
		"<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px'",
		"width='"+iconSize2+"px' height='"+iconSize2+"px' viewBox='0 0 512 512' enable-background='new 0 0 512 512' xml:space='preserve'>",
		"<path id='icon_update' fill='"+iconColor+"' d='M373.223,142.573l-37.252,37.253c-20.225-20.224-48.162-32.731-79.021-32.731",
		"c-61.719,0-111.752,50.056-111.752,111.776c0,0.016,0-0.016,0,0h43.412l-69.342,69.315L50,258.871h42.514c0-0.008,0,0.006,0,0",
		"c0-90.816,73.621-164.46,164.436-164.46C302.357,94.411,343.467,112.816,373.223,142.573z M462,253.129l-69.268-69.316",
		"l-69.342,69.316h43.412c0,0.016,0-0.017,0,0c0,61.72-50.033,111.776-111.752,111.776c-30.859,0-58.797-12.508-79.021-32.731",
		"l-37.252,37.253c29.758,29.757,70.867,48.162,116.273,48.162c90.814,0,164.436-73.644,164.436-164.459c0-0.007,0,0.008,0,0H462z'/></svg>"
	].join("\n");


	var colors = ['#303030', '#b10dc9', '#0074d9', '#ff851b'];
	var buttonActif = 'position:relative; display:inline-block; cursor:pointer; pointer-events:auto;';
	var bstyle =unselect+ ' font-size:14px; margin-right:4px; -webkit-border-radius:40px; border-radius:40px;  border:2px solid #343434; background:'+colors[0]+'; height:19px; padding:2px 2px; text-align:center;';

	var bbMenu = [];
	var nscript;
	var maxDemo = 12;
	var currentDemo;


	var decoFrame = doc.createElement( 'div' );
	decoFrame.id = 'decoFrame';
	decoFrame.style.cssText =unselect+'top:10px; left:130px; position:absolute; display:block; width:calc(100% - 120px); height:60px; overflow:hidden; padding:0;';
	container.appendChild( decoFrame );

    // RUN BUTTON
    var bRun = doc.createElement( 'div' );
	bRun.id = 'Editor-Run';
	bRun.style.cssText = bstyle + buttonActif + 'top:10px; left:20px; position:absolute; width:46px; height:46px;';
	var rvalue = 0;
	var updateTimer;
	var outColor = 'ffffff';
	var selColor = '1a94ff';
	var icColor = doc.createElement( 'div' );
	icColor.style.cssText = "-webkit-border-radius:60px; border-radius:60px; position:absolute; width:46px; height:46px; pointer-events:none; background-color: rgba(0,0,0,0); pointer-events:none;";
	var icRun = doc.createElement( 'div' );
	icRun.style.cssText = "position:absolute; width:46px; height:46px; pointer-events:none;";
	icRun.innerHTML = icon_update; 
	container.appendChild( bRun );
	bRun.appendChild(icColor);
	bRun.appendChild(icRun);
	bRun.addEventListener( 'mousedown', function ( event ) { event.preventDefault(); update(); icColor.style.backgroundColor = 'rgba(0,116,217,0.7)'; }, false );
	bRun.addEventListener( 'mouseover', function ( event ) { event.preventDefault();  icColor.style.backgroundColor = 'rgba(0,116,217,0.1)'; updateTimer = setInterval(rotateUpdate, 10, icRun); doc.getElementById("icon_update").setAttribute('fill','#'+selColor);}, false );
    bRun.addEventListener( 'mouseout', function ( event ) { event.preventDefault(); icColor.style.backgroundColor = 'rgba(0,0,0,0)'; clearInterval(updateTimer); doc.getElementById("icon_update").setAttribute('fill','#'+outColor);}, false );

    var rotateUpdate = function (dom) {
    	rvalue -= 5;
		dom.style.webkitTransform = 'rotate('+rvalue+'deg)';
		dom.style.oTransform = 'rotate('+rvalue+'deg)';
		dom.style.transform = 'rotate('+rvalue+'deg)';
	}
	/*var bRun = doc.createElement( 'div' );
	bRun.id = 'Editor-Run';
	bRun.style.cssText =bstyle+buttonActif+'top:10px; left:10px; position:absolute; width:100px; height:30px; padding-top:12px;';
	bRun.textContent = "RUN SCRIPT";
	container.appendChild( bRun );
	bRun.addEventListener( 'mousedown', function ( event ) { event.preventDefault(); update(); this.style.backgroundColor = colors[3]; }, false );
	bRun.addEventListener( 'mouseover', function ( event ) { event.preventDefault();  this.style.backgroundColor = colors[2]; }, false );
    bRun.addEventListener( 'mouseout', function ( event ) { event.preventDefault(); this.style.backgroundColor = colors[0]; }, false );*/

    // MENU DEMO
	for(var i=0;i!==maxDemo;i++){
		bbMenu[i] = doc.createElement( 'div' );
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
	var MainEditor = doc.createElement( 'iframe' );
	MainEditor.id = 'mEditor';
	MainEditor.name = 'MainEditor';
	MainEditor.src = "demos/mainEditor.html";
	MainEditor.style.cssText = unselect+"  top:70px; bottom:0px; left:0; margin:0; padding:0; position:absolute; height:calc(100% - 74px); width:calc(100% - 4px); display:block; pointer-events:auto; border:none;"
	container.appendChild( MainEditor );


	var importScript = function(name){
		MainEditor.contentWindow.setBase(Editor);
		
		//if(name =='demo00')
			MainEditor.contentWindow.loadfileJS(name+".js");
		//else MainEditor.contentWindow.loadfile(name+".html");
	}

	var testCurrentDemo = function(){
		for(var i=0, j=bbMenu.length;i!==j;i++){
			if(bbMenu[i].name === currentDemo)bbMenu[i].style.backgroundColor = colors[1];
			else bbMenu[i].style.backgroundColor = colors[0];
		}
	}

	var update = function (){
		var head = doc.getElementsByTagName('head')[0];
		nscript = doc.createElement("script");
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