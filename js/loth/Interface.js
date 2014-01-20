/**
 * @author loth / http://3dflashlo.wordpress.com/
 */

var Interface = function (name) {
	var container = document.createElement( 'div' );
	container.id = 'interface';
	var unselect = '-o-user-select:none; -ms-user-select:none; -khtml-user-select:none; -webkit-user-select:none; -moz-user-select: none; user-select: none;'
	//container.style.cssText = unselect+ 'position:absolute; color:#CCCCCC; font-size:10px; font-family:"Trebuchet MS", Helvetica, sans-serif; width:100%; height:100%; pointer-events:none;';
	container.style.cssText =unselect +  'position:absolute; left:0; right:0; top:0; bottom:0; color:#CCCCCC; font-size:12px; font-family:SourceCode; pointer-events:none;  overflow:hidden;';
	var effect = 'border:1px solid rgba(255,255,255,0.3);';
	var buttonStyle = effect+'width:30px; height:28px; position:relative; -webkit-border-radius: 20px; border-radius:20px; background-color: rgba(1,1,1,0.1); display:inline-block; text-align:center; cursor:pointer; pointer-events:auto; font-size:18px; ';
	var bbStyle = 'width:170px; height:28px; position:relative; display:inline-block; text-decoration:none; font-size:18px; ';

	//-----------------------------------------------------
    //  ICON
    //-----------------------------------------------------
    var iconSize = 48;
    var iconColor = '#ffffff';

    var icon_logos = [
	    "<svg version='1.1' id='oimo' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px'",
	    "width='48px' height='48px' viewBox='0 0 512 512' enable-background='new 0 0 512 512' xml:space='preserve'>",
        "<path fill='none' stroke='#FFFFFF' stroke-width='40' stroke-miterlimit='10' d='M310.215,82.307",
	    "c-40.867-12.279-86.859-5.284-105.407,6.843c-45.29,29.612-34.695,57.513-63.106,107.836",
	    "c-28.035,49.658-46.876,76.344-40.464,124.752c6.61,49.901,24.723,98.776,121.386,116.684s145.224-25.592,159.089-65.439",
	    "c17.737-50.974-1.591-91.972-6.908-134.5c-4.861-38.877,17.96-77.561-3.27-112.521C350.714,91.678,310.215,82.307,310.215,82.307z'/>",
        "<circle fill='#FFFFFF' stroke='none' cx='245.424' cy='153.905' r='16'/>",
        "<circle fill='#FFFFFF' stroke='none' cx='302.593' cy='168.211' r='10'/></svg>"
    ].join("\n");

    var icon_github= [
	    "<svg version='1.1' id='Calque_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px'",
		"width='"+iconSize+"px' height='"+iconSize+"px' viewBox='0 0 512 512' enable-background='new 0 0 512 512' xml:space='preserve'>",
	    "<path id='icon_github' fill='"+iconColor+"' d='M256,90c44.34,0,86.026,17.267,117.38,48.62C404.733,169.974,422,211.66,422,256",
		"s-17.267,86.026-48.62,117.38C342.026,404.732,300.34,422,256,422s-86.026-17.268-117.38-48.62C107.267,342.026,90,300.34,90,256",
		"s17.267-86.026,48.62-117.38C169.974,107.267,211.66,90,256,90 M256,50C142.229,50,50,142.229,50,256s92.229,206,206,206",
		"s206-92.229,206-206S369.771,50,256,50L256,50z M391.25,266.53l0.238-2.476c-14.836-1.439-29.593-1.567-43.927-0.473",
		"c2.304-7.354,3.518-15.659,3.43-25.104c-0.188-20.065-6.879-35.692-17.394-48.662c2.02-12.216,0.498-24.431-3.312-36.651",
		"c-15.024,1.23-28.547,6.151-40.587,14.7c-22.502-4.564-45.001-4.855-67.503,0c-14.044-9.479-27.835-14.127-41.413-14.7",
		"c-4.025,13.456-4.646,26.719-1.242,39.76c-11.846,12.57-16.373,27.828-16.151,44.724c0.127,9.672,1.617,18.279,4.367,25.888",
		"c-14.125-1.036-28.643-0.896-43.244,0.518l0.239,2.476c14.869-1.443,29.652-1.563,44.012-0.439c0.527,1.278,1.058,2.552,1.663,3.769",
		"c-15.559-0.41-29.561,0.941-42.674,4.166l0.592,2.412c13.31-3.271,27.566-4.588,43.485-4.053",
		"c10.527,18.703,30.794,29.693,60.306,33.182c-6.856,5.568-10.543,12.137-11.492,19.57c0,0-3.103,0-15.63,0",
		"c-20.992,0-26.715-26.766-48.457-24.125c21.093,10.461,16.88,43.896,50.633,43.896c11.343,0,13.755,0,14.181,0v30.648",
		"c0.15,4.952-2.006,8.265-5.488,10.56c12.088,1.221,21.172-4.814,21.172-12.217s0-36.902,0-40.512s3.779-3.889,3.779-3.889v47.3",
		"c0.16,4.707-2.128,7.383-4.556,9.939c10.649,0.425,20.666-1.702,21.12-10.766c0,0,0-42.993,0-45.269s3.729-2.332,3.729,0",
		"s0,43.145,0,43.145c0.11,7.646,6.714,13.845,20.705,12.89c-3.743-3.013-4.892-6.059-4.892-10.466c0-4.406,0-46.773,0-46.773",
		"s3.856-0.196,3.856,3.889c0,4.086,0,32.614,0,39.451c0,8.779,10.54,12.402,22.569,12.062c-3.94-2.952-6.608-6.474-6.625-11.182",
		"v-47.443c-0.407-6.974-3.242-13.548-8.802-19.673c26.978-4.142,46.422-14.91,56.104-34.211c15.971-0.549,30.271,0.766,43.615,4.047",
		"l0.592-2.412c-13.215-3.248-27.333-4.599-43.037-4.157c0.543-1.226,1.082-2.456,1.547-3.749",
		"C361.268,264.955,376.216,265.069,391.25,266.53z'/></svg>"
    ].join("\n");

    var icon_gear = [
        "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px'",
        "width='"+iconSize+"px' height='"+iconSize+"px' viewBox='0 0 512 512' enable-background='new 0 0 512 512' xml:space='preserve'>",
        "<path id='icon_gear' fill='"+iconColor+"' d='M462,283.742v-55.485l-49.249-17.514c-3.4-11.792-8.095-23.032-13.919-33.563l22.448-47.227",
        "l-39.234-39.234l-47.226,22.449c-10.53-5.824-21.772-10.52-33.564-13.919L283.741,50h-55.484l-17.515,49.25",
        "c-11.792,3.398-23.032,8.094-33.563,13.918l-47.227-22.449l-39.234,39.234l22.45,47.227c-5.824,10.531-10.521,21.771-13.919,33.563",
        "L50,228.257v55.485l49.249,17.514c3.398,11.792,8.095,23.032,13.919,33.563l-22.45,47.227l39.234,39.234l47.227-22.449",
        "c10.531,5.824,21.771,10.52,33.563,13.92L228.257,462h55.484l17.515-49.249c11.792-3.398,23.034-8.095,33.564-13.919l47.226,22.448",
        "l39.234-39.234l-22.448-47.226c5.824-10.53,10.521-21.772,13.919-33.564L462,283.742z M256,331.546",
        "c-41.724,0-75.548-33.823-75.548-75.546s33.824-75.547,75.548-75.547c41.723,0,75.546,33.824,75.546,75.547",
        "S297.723,331.546,256,331.546z'/></svg>"
    ].join("\n");

    var icon_material = [
	    "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px'",
		"width='"+iconSize+"px' height='"+iconSize+"px' viewBox='0 0 512 512' enable-background='new 0 0 512 512' xml:space='preserve'>",
	    "<path id='icon_material' fill='"+iconColor+"' d='M255.5,156c-55.141,0-100,44.86-100,100c0,55.141,44.859,100,100,100s100-44.859,100-100",
		"C355.5,200.86,310.641,156,255.5,156z M255.5,316c-33.084,0-60-26.916-60-60s26.916-60,60-60s60,26.916,60,60S288.584,316,255.5,316",
		"z M150.779,179.064l-54.586-54.586l28.285-28.284l54.664,54.664C168.305,158.75,158.73,168.272,150.779,179.064z M332.436,151.28",
		"l55.086-55.086l28.285,28.284l-55.164,55.165C352.75,168.805,343.229,159.229,332.436,151.28z M127.039,276H50v-40h77.039",
		"c-1.012,6.521-1.539,13.2-1.539,20C125.5,262.801,126.027,269.479,127.039,276z M236,127.463V50h40v77.622",
		"c-6.68-1.062-13.525-1.622-20.5-1.622C248.873,126,242.362,126.502,236,127.463z M179.143,361.143l-54.664,54.664l-28.285-28.285",
		"l54.586-54.585C158.729,343.729,168.305,353.251,179.143,361.143z M462,236v40h-78.039c1.012-6.521,1.539-13.199,1.539-20",
		"c0-6.8-0.527-13.479-1.539-20H462z M276,384.378V462h-40v-77.463c6.362,0.962,12.873,1.463,19.5,1.463",
		"C262.475,386,269.32,385.441,276,384.378z M360.643,332.357l55.164,55.164l-28.285,28.285l-55.086-55.086",
		"C343.229,352.771,352.751,343.195,360.643,332.357z'/></svg>"
    ].join("\n");

    var icon_shadow = [
	    "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px'",
		"width='"+iconSize+"px' height='"+iconSize+"px' viewBox='0 0 512 512' enable-background='new 0 0 512 512' xml:space='preserve'>",
	    "<path id='icon_shadow' fill='"+iconColor+"' d='M256,90c44.342,0,86.027,17.267,117.381,48.62S422,211.66,422,256.001",
		"c0,44.34-17.266,86.026-48.619,117.379C342.027,404.733,300.342,422,256,422c-44.34,0-86.027-17.267-117.379-48.62",
		"C107.268,342.027,90,300.341,90,256.001c0-44.341,17.268-86.027,48.621-117.381C169.973,107.267,211.66,90,256,90z M256,50",
		"C142.229,50,50,142.229,50,256.001C50,369.771,142.229,462,256,462s206-92.229,206-205.999C462,142.229,369.771,50,256,50z M256,392",
		"c-36.328,0-70.48-14.146-96.166-39.833C134.146,326.48,120,292.328,120,256.001c0-36.328,14.146-70.48,39.834-96.168",
		"C185.52,134.146,219.672,120,256,120V392z'/></svg>"
    ].join("\n");

    var icon_env = [
	    "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px'",
		"width='"+iconSize+"px' height='"+iconSize+"px' viewBox='0 0 512 512' enable-background='new 0 0 512 512' xml:space='preserve'>",
	    "<path id='icon_env' fill='"+iconColor+"'  d='M256.417,90c44.34,0,86.026,17.267,117.38,48.62c31.354,31.354,48.62,73.04,48.62,117.38",
		"c0,44.34-17.267,86.026-48.62,117.38c-31.354,31.353-73.04,48.62-117.38,48.62s-86.026-17.268-117.38-48.62",
		"c-31.354-31.354-48.62-73.04-48.62-117.38c0-44.34,17.267-86.026,48.62-117.38C170.391,107.267,212.077,90,256.417,90 M256.417,50",
		"c-113.771,0-206,92.229-206,206s92.229,206,206,206s206-92.229,206-206S370.188,50,256.417,50L256.417,50z M342.41,237.25",
		"c-1.479-36.569-31.577-65.765-68.508-65.765c-25.183,0-47.183,13.583-59.107,33.814c-5.449-3.39-11.857-5.379-18.746-5.379",
		"c-19.566,0-35.432,15.795-35.57,35.33c-17.266,8.197-29.206,25.79-29.206,46.173c0,28.22,22.872,51.092,51.091,51.092H333.51",
		"c26.537,0,48.052-21.513,48.052-48.05C381.562,260.969,364.692,241.425,342.41,237.25z'/></svg>"
    ].join("\n");



	//-----------------------------------------------------
    //  TITLE
    //-----------------------------------------------------

    var titleLogo = document.createElement( 'svg' );
	titleLogo.style.cssText = 'position:absolute; top:5px; left:5px; width:48x; height:48px;';
    titleLogo.innerHTML = icon_logos;

	var title = document.createElement( 'div' );
	title.style.cssText = 'position:absolute; color:#FFFFFF; top:12px; left:60px; text-align:left; font-weight:bold; font-size:22px; pointer-events:none;';
	title.innerHTML ="Oimo.js";

	var titleLink = document.createElement( 'div' );
	titleLink.style.cssText = 'position:absolute; color:#CCCCCC; top:20px; left:170px; text-align:left; pointer-events:auto; font-size:14px;';

	var linkStyle = "color:#dbae77; cursor:pointer;";
	var sep = " . ";
	
	var txt = "";
	if(name==='dev') txt +="DEV";
	else txt += "<a href='index.html' target='_self' style='"+linkStyle+"'>DEV</a>";
	txt += sep;
	if(name==='rev') txt +="REV";
	else txt += "<a href='index_rev.html' target='_self' style='"+linkStyle+"'>REV</a>";
	
	titleLink.innerHTML = txt;

	container.appendChild( titleLogo );
	container.appendChild( title );
	container.appendChild( titleLink );

	//-----------------------------------------------------
    //  OUTPUT
    //-----------------------------------------------------

	var output = document.createElement( 'div' );
	output.id = "output";
	output.style.cssText = 'line-height:12px; letter-spacing:0px; position:absolute; color:#808080; top:115px; width:200px; height:200px; left:60px; text-align:left; pointer-events:none;';
	container.appendChild( output );

	//-----------------------------------------------------
    //  COPY
    //-----------------------------------------------------

	var copy = document.createElement( 'div' );
	copy.style.cssText = 'position:absolute; bottom:0px; width:350px; right:0px; text-align:right; pointer-events:auto; color:#777777; margin-right:10px; margin-bottom:5px;';
	copy.innerHTML = "<a href='http://3dflashlo.wordpress.com/' target='_blank' style='color:#888888'>LOTH 2014</a> |  <a href='https://github.com/saharan/OimoPhysics' target='_blank' style='color:#888888'>OIMO.PHYSICS</a> | <a href='http://threejs.org' target='_blank' style='color:#888888'>THREE.JS</a> | <a href='https://code.google.com/p/sea3d/' target='_blank' style='color:#888888'>SEA3D</a>";
	container.appendChild( copy );

	//-----------------------------------------------------
    //  MENU DEMO
    //-----------------------------------------------------

    var aMenu = document.createElement( 'div' );
	aMenu.style.cssText = 'left:10px; top:60px; position:absolute; display:block; text-align:center; ';
	container.appendChild( aMenu );

	var bnext = document.createElement( 'div' );
	bnext.style.cssText = buttonStyle;
	bnext.innerHTML = "&raquo;";

	var bprev = document.createElement( 'div' );
	bprev.style.cssText = buttonStyle;
	bprev.innerHTML = "&laquo;";

	var bcenter = document.createElement( 'div' );
	bcenter.id = "demoName";
	bcenter.style.cssText = bbStyle;
	bcenter.textContent = "Basic shape";

	var demoName =  function (name) {
		bcenter.textContent = name;
	}

	aMenu.appendChild( bprev );
	aMenu.appendChild( bcenter );
	aMenu.appendChild( bnext );

    bprev.addEventListener( 'mouseover', function ( event ) { event.preventDefault(); this.style.backgroundColor = 'rgba(55,123,167,1)';  }, false );
    bprev.addEventListener( 'mouseout', function ( event ) { event.preventDefault();  this.style.backgroundColor = 'rgba(1,1,1,0.1)';  }, false );
    bnext.addEventListener( 'mouseover', function ( event ) { event.preventDefault(); this.style.backgroundColor = 'rgba(55,123,167,1)';  }, false );
    bnext.addEventListener( 'mouseout', function ( event ) { event.preventDefault();  this.style.backgroundColor = 'rgba(1,1,1,0.1)';  }, false );

	bprev.addEventListener( 'mousedown', function ( event ) { event.preventDefault(); prevDemo(); this.style.backgroundColor = 'rgba(55,123,167,0.5)';}, false );
	bnext.addEventListener( 'mousedown', function ( event ) { event.preventDefault(); nextDemo(); this.style.backgroundColor = 'rgba(55,123,167,0.5)';}, false );

	//-----------------------------------------------------
    //  MENU DEMO
    //-----------------------------------------------------

    var bMenu = document.createElement( 'div' );
	bMenu.style.cssText = 'right:0px; top:160px; position:absolute; width:60px; display:block; text-align:center;  margin-right:10px;';
	container.appendChild( bMenu );

	var bbMenu = [];
	var bbMenu2 = [];

	var bbMenuNames = ["source", "editor", "material", "reflect", "shadow"];
	var bbMenuIcons = ["icon_github", "icon_gear", "icon_material", "icon_env", "icon_shadow"];

	for(var i=0;i!==5;i++){

		bbMenu[i] = document.createElement( 'div' );
		bbMenu[i].name = i;
		bbMenu[i].style.cssText = "margin-left:6px; width:48px; height:48px; margin-bottom:0px; pointer-events:auto;  ";

		bbMenu2[i] = document.createElement( 'div' );
		bbMenu2[i].name = i;
		bbMenu2[i].style.cssText = "width:60px; height:20px; margin-bottom:0px; color:#7fdbff;";
		bbMenu2[i].style.visibility = "hidden";
		bbMenu2[i].innerHTML =bbMenuNames[i];
		//else bbMenu[i].style.cssText = buttonStyle + "width:120px; height:30px; margin-bottom:6px;";
		bbMenu[i].addEventListener( 'mouseover', function ( event ) { event.preventDefault(); overColor(this.name);  }, false );
		bbMenu[i].addEventListener( 'mouseout', function ( event ) { event.preventDefault(); outColor(this.name); }, false );
		bMenu.appendChild( bbMenu[i] );
		bMenu.appendChild( bbMenu2[i] );
	}


	bbMenu[0].innerHTML = icon_github;
	bbMenu[1].innerHTML = icon_gear;
	bbMenu[2].innerHTML = icon_material;
	bbMenu[3].innerHTML = icon_env;
	bbMenu[4].innerHTML = icon_shadow;

	//bbMenu[0].style.color = "#ffffff";
	/*var overColor = function (n) {
		if(document.getElementById(bbMenuIcons[n]))document.getElementById(bbMenuIcons[n]).setAttribute('fill','#0074d9');
		bbMenu2[n].style.visibility = "visible";
	}*/

	var overColor = function (n) {
		if(document.getElementById(bbMenuIcons[n]))document.getElementById(bbMenuIcons[n]).setAttribute('fill','#7fdbff');
		bbMenu2[n].style.visibility = "visible";
		bbMenu2[n].style.color = "#7fdbff";
	}
	var outColor = function (n) {
		if(document.getElementById(bbMenuIcons[n]))document.getElementById(bbMenuIcons[n]).setAttribute('fill','#ffffff');
		bbMenu2[n].style.visibility = "hidden";
	}
	var clickColor = function (n) {
		if(document.getElementById(bbMenuIcons[n]))document.getElementById(bbMenuIcons[n]).setAttribute('fill','#ff851b');
		bbMenu2[n].style.color = "#ff851b";
	}
	//bbMenu[4].innerHTML = "E";

	bbMenu[0].addEventListener( 'mousedown', function ( event ) { event.preventDefault(); clickColor(this.name); }, false );
	bbMenu[1].addEventListener( 'mousedown', function ( event ) { event.preventDefault(); showCode(); clickColor(this.name); }, false );
	bbMenu[2].addEventListener( 'mousedown', function ( event ) { event.preventDefault(); TE.changeMaterialType(); clickColor(this.name); }, false );
	bbMenu[3].addEventListener( 'mousedown', function ( event ) { event.preventDefault(); TE.reflection(); clickColor(this.name); }, false );
	bbMenu[4].addEventListener( 'mousedown', function ( event ) { event.preventDefault(); TE.shadow(); clickColor(this.name); }, false );
	
	//bbMenu[4].addEventListener( 'mousedown', function ( event ) { event.preventDefault(); threeEngine.shadow(); this.style.backgroundColor = 'rgba(55,123,167,0.5)';}, false );
	

	/*bbMenu[0].addEventListener( 'mousedown', function ( event ) { event.preventDefault(); threeEngine.setMouseMode('delete'); this.style.backgroundColor = 'rgba(55,123,167,0.5)';}, false );
	bbMenu[1].addEventListener( 'mousedown', function ( event ) { event.preventDefault(); threeEngine.setMouseMode('drag'); this.style.backgroundColor = 'rgba(55,123,167,0.5)';}, false );
	bbMenu[2].addEventListener( 'mousedown', function ( event ) { event.preventDefault(); threeEngine.setMouseMode('shoot'); this.style.backgroundColor = 'rgba(55,123,167,0.5)';}, false );*/
    var showCode = function () {
    	TE.viewDivid();
    	var mode = TE.getViewMode();

    	if(mode==='no'){
    		ribbon.style.right = '0';
    		bMenu.style.right = '0';
    		copy.style.right = '0';
    		copy.style.bottom = '0';
    		menu.style.bottom = '0';

    		Editor.hide();
    	} else {
    		if(mode==="v"){
    			ribbon.style.right = '50%';
    			bMenu.style.right = '50%';
    			copy.style.right = '50%';

    		} else {
    			copy.style.bottom = '50%'
    			menu.style.bottom = '50%';
    		}
    	    Editor.show(mode);
    	}
    }




	//-----------------------------------------------------
    //  GRAVITY
    //-----------------------------------------------------

	var G = -10;
	var drag;
	//var finalFunction;

	var loDiv = document.createElement( 'div' );
	loDiv.style.cssText = effect+ 'position:absolute; left:10px; top:110px; width:30px; height:200px; padding:0 0 0 0; display:block; background:rgba(1,1,1,0.1); -webkit-border-radius:20px; border-radius:20px; cursor:ns-resize;text-align:center; pointer-events:auto;';
	container.appendChild( loDiv );

	var loDiv2 = document.createElement( 'div' );
	loDiv2.style.cssText = 'position:absolute; left:5px; bottom:0px; width:20px; height:200px; display:block; background:rgba(255,255,0,0.05);-webkit-border-radius:10px; border-radius:10px; pointer-events:none;';
	loDiv.appendChild( loDiv2 );
	

	var center = document.createElement( 'div' );
	center.style.cssText = 'position:absolute;width:30px;left:0px;height:1px;padding:0 0 0 0; background:rgba(255,255,255,0.2); top:100px; pointer-events:none;';
	loDiv.appendChild( center );

	var select = document.createElement( 'div' );
	select.style.cssText = 'position:absolute;width:30px;left:0px;height:1px;padding:0 0 0 0; background:rgba(255,255,1,0.8); top:100px; pointer-events:none;';
	loDiv.appendChild( select );

	var txt = document.createElement( 'div' );
	txt.style.cssText = 'position:absolute;width:30px;height:30px; padding:0 0 0 0; top:105px; pointer-events:none; font-size:10px;';
	loDiv.appendChild( txt );

	var txt2 = document.createElement( 'div' );
	txt2.style.cssText = 'position:absolute;width:30px;height:30px; padding:0 0 0 0; top:85px; pointer-events:none; font-size:10px;';
	loDiv.appendChild( txt2 );
	txt2.textContent ="G";

	loDiv.addEventListener( 'mousedown', function(e){ drag = true; move(e); }, false );
	loDiv.addEventListener( 'mouseout', function(e){ drag = false; }, false );
	loDiv.addEventListener( 'mouseup', function(e){ drag = false; }, false );
	loDiv.addEventListener( 'mousemove', function(e){ move(e); } , false );

	var move =  function ( e ) {
		var rect = loDiv.getBoundingClientRect();
		var pos;
		if(drag){
			pos = parseInt(e.clientY-rect.top);
			if(pos<0)pos=0;
			if(pos>200)pos=200;
			select.style.top = pos+"px";
			loDiv2.style.height = 200-pos +"px";
			G = -(pos-100)/10;
			txt.textContent =G;
			if(changeGravity)changeGravity(G);

			if(pos<10 || pos>190){ 
				select.style.width = '10px';
				select.style.left = '10px';
			}else{
				select.style.width = '30px';
				select.style.left = '0px';
			}
		}
	}

	var setCurrentGravity =  function ( g ) {
		var rect = loDiv.getBoundingClientRect();
		var pos = (((-g)*10)+100);

		G = g;
		txt.textContent = G;
		select.style.top = pos +"px";
		loDiv2.style.height = 200-pos +"px";

		if(pos<10 || pos>190){ 
			select.style.width = '10px';
			select.style.left = '10px';
		}else{
			select.style.width = '30px';
			select.style.left = '0px';
		}
	}

	setCurrentGravity(G);

	//-----------------------------------------------------
    //  MENU OPTIONS BOTTOM
    //-----------------------------------------------------

	var menu = document.createElement( 'div' );
	menu.style.cssText ='position:absolute; height:600px; width:100%; overflow:hidden; bottom:0px; left:0px; pointer-events:none;';
	container.appendChild( menu );

	//-----------------------------------------------------
    //  RIBBON
    //-----------------------------------------------------

	var ribbon = document.createElement( 'div' );
	ribbon.style.cssText ='position: absolute; top: 0; right: 0; border: 0;  pointer-events:auto;';
	ribbon.innerHTML ="<a href='https://github.com/lo-th/Oimo.js'  target='_blank' ><img  src='images/ribbon0.png' alt='Fork me on GitHub' /></a>";
	container.appendChild( ribbon );

    return {
		domElement: container,
		menu:menu,
		setCurrentGravity:setCurrentGravity,
		demoName:demoName
	}


	


}