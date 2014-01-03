/**
 * @author loth / http://3dflashlo.wordpress.com/
 */

var Interface = function (name) {
	var container = document.createElement( 'div' );
	container.id = 'interface';
	var unselect = '-o-user-select:none; -ms-user-select:none; -khtml-user-select:none; -webkit-user-select:none; -moz-user-select: none;'
	//container.style.cssText = unselect+ 'position:absolute; color:#CCCCCC; font-size:10px; font-family:"Trebuchet MS", Helvetica, sans-serif; width:100%; height:100%; pointer-events:none;';
	container.style.cssText =unselect +  'position:absolute; left:0; right:0; top:0; bottom:0; color:#CCCCCC; font-size:12px; font-family:SourceCode; pointer-events:none;  overflow:hidden;';
	var effect = 'border:1px solid rgba(255,255,255,0.3);';
	var buttonStyle = effect+'font-weight:bold; width:30px; height:28px; position:relative; -webkit-border-radius: 20px; border-radius:20px; text-shadow: 1px 1px 3px #000;background-color: rgba(1,1,1,0.1); display:inline-block; text-align:center; cursor:pointer; pointer-events:auto; font-size:18px; ';
	var bbStyle = 'font-weight:bold; width:170px; height:28px; position:relative; display:inline-block; text-decoration:none; font-size:20px; text-shadow: 1px 1px 1px #000;';

	//-----------------------------------------------------
    //  TITLE
    //-----------------------------------------------------

    var titleLogo = document.createElement( 'div' );
	titleLogo.style.cssText = 'position:absolute; top:10px; left:10px; width:48px; height:48px;';
	titleLogo.innerHTML ="<img id='logo' src='images/logo48.png'/>";
	container.appendChild( titleLogo );

	var title = document.createElement( 'div' );
	title.style.cssText = 'font-weight:bold; position:absolute; color:#CCCCCC; top:17px; left:68px; text-align:left; pointer-events:none; font-size:26px; text-shadow: 1px 1px 2px #000; pointer-events:auto;';
	title.innerHTML ="Oimo.js";
	var linkColor = '#377ba7';
	if(name==='dev') title.innerHTML +="<p style='font-size:14px; display:inline;'> | DEV |</p>";
	else title.innerHTML +="<p style='font-size:14px; display:inline;'>  | <a href='index.html' target='_self' style='color:"+linkColor+"'>DEV</a> |</p>";
	if(name==='devlow') title.innerHTML +="<p style='font-size:14px; display:inline;'> DEV-low |</p>";
	else title.innerHTML +="<p style='font-size:14px; display:inline;'>  <a href='index_low.html' target='_self' style='color:"+linkColor+"'>DEV-low</a> |</p>";
	if(name==='rev') title.innerHTML +="<p style='font-size:14px; display:inline;'> REV |</p>";
	else title.innerHTML +="<p style='font-size:14px; display:inline;'>  <a href='index_rev.html' target='_self' style='color:"+linkColor+"'>REV</a> |</p>";
	if(name==='revlow') title.innerHTML +="<p style='font-size:14px; display:inline;'> REV-low |</p>";
	else title.innerHTML +="<p style='font-size:14px; display:inline;'>  <a href='index_rev_low.html' target='_self' style='color:"+linkColor+"'>REV-low</a> |</p>";
	
	container.appendChild( title );

	//-----------------------------------------------------
    //  OUTPUT
    //-----------------------------------------------------

	var output = document.createElement( 'div' );
	output.id = "output";
	output.style.cssText = 'line-height:12px; letter-spacing:-1px; position:absolute; color:#AAAAAA; top:125px; width:300px; height:400px; left:70px; text-align:left; pointer-events:none;';
	container.appendChild( output );

	//-----------------------------------------------------
    //  COPY
    //-----------------------------------------------------

	var copy = document.createElement( 'div' );
	copy.style.cssText = 'position:absolute; bottom:7px; width:350px; right:10px; text-align:right; pointer-events:auto; color:#777777;';
	copy.innerHTML = "<a href='http://3dflashlo.wordpress.com/' target='_blank' style='color:#888888'>LOTH 2013</a> | <a href='http://threejs.org' target='_blank' style='color:#888888'>THREE.JS</a> | <a href='https://code.google.com/p/sea3d/' target='_blank' style='color:#888888'>SEA3D</a> | <a href='https://github.com/saharan/OimoPhysics' target='_blank' style='color:#888888'>OIMO.PHYSICS</a>";
	container.appendChild( copy );

	//-----------------------------------------------------
    //  MENU DEMO
    //-----------------------------------------------------

    var aMenu = document.createElement( 'div' );
	aMenu.style.cssText = 'left:20px; top:74px;  position:absolute; display:block; text-align:center;';
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

    /*var bMenu = document.createElement( 'div' );
	bMenu.style.cssText = 'right:10px; top:20px;  position:absolute; width:40px; display:block; text-align:center; ';
	container.appendChild( bMenu );

	var bbMenu = [];

	for(var i=0;i!==3;i++){
		bbMenu[i] = document.createElement( 'div' );
		bbMenu[i].style.cssText = buttonStyle + " height:30px; margin-bottom:6px;";
		bbMenu[i].addEventListener( 'mouseover', function ( event ) { event.preventDefault(); this.style.backgroundColor = 'rgba(55,123,167,1)';  }, false );
		bbMenu[i].addEventListener( 'mouseout', function ( event ) { event.preventDefault();  this.style.backgroundColor = 'rgba(1,1,1,0.1)';  }, false );

		bMenu.appendChild( bbMenu[i] );
	}

	bbMenu[0].addEventListener( 'mousedown', function ( event ) { event.preventDefault(); threeEngine.reflection(); this.style.backgroundColor = 'rgba(55,123,167,0.5)';}, false );
	bbMenu[1].addEventListener( 'mousedown', function ( event ) { event.preventDefault(); threeEngine.debug(); this.style.backgroundColor = 'rgba(55,123,167,0.5)';}, false );
	bbMenu[2].addEventListener( 'mousedown', function ( event ) { event.preventDefault(); threeEngine.shadow(); this.style.backgroundColor = 'rgba(55,123,167,0.5)';}, false );
	*/

	/*bbMenu[0].addEventListener( 'mousedown', function ( event ) { event.preventDefault(); threeEngine.setMouseMode('delete'); this.style.backgroundColor = 'rgba(55,123,167,0.5)';}, false );
	bbMenu[1].addEventListener( 'mousedown', function ( event ) { event.preventDefault(); threeEngine.setMouseMode('drag'); this.style.backgroundColor = 'rgba(55,123,167,0.5)';}, false );
	bbMenu[2].addEventListener( 'mousedown', function ( event ) { event.preventDefault(); threeEngine.setMouseMode('shoot'); this.style.backgroundColor = 'rgba(55,123,167,0.5)';}, false );*/


	//-----------------------------------------------------
    //  GRAVITY
    //-----------------------------------------------------

	var G = -10;
	var drag;
	//var finalFunction;

	var loDiv = document.createElement( 'div' );
	loDiv.style.cssText = effect+ 'position:absolute;left:20px; top:120px; width:30px; height:200px; padding:0 0 0 0; display:block; background:rgba(1,1,1,0.1); -webkit-border-radius:20px; border-radius:20px; cursor:ns-resize;text-align:center; pointer-events:auto;';
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
    //  MENU OPTIONS
    //-----------------------------------------------------

	var menu = document.createElement( 'div' );
	menu.style.cssText ='position:absolute; height:600px; width:100%; overflow:hidden; bottom:0px; left:0px; pointer-events:none;';
	container.appendChild( menu );

	//-----------------------------------------------------
    //  RIBBON
    //-----------------------------------------------------

	var ribbon = document.createElement( 'div' );
	ribbon.style.cssText ='position: absolute; top: 0; right: 0; border: 0;  pointer-events:auto;';
	ribbon.innerHTML ="<a href='https://github.com/lo-th/Oimo.js'><img  src='http://s3.amazonaws.com/github/ribbons/forkme_right_gray_6d6d6d.png' alt='Fork me on GitHub' /></a>";
	container.appendChild( ribbon );

    return {
		domElement: container,
		menu:menu,
		setCurrentGravity:setCurrentGravity
	}


}