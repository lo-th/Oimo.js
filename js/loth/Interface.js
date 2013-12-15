/**
 * @author loth / http://3dflashlo.wordpress.com/
 */

var Interface = function (name) {
	var container = document.createElement( 'div' );
	container.id = 'interface';
	var unselect = '-o-user-select:none; -ms-user-select:none; -khtml-user-select:none; -webkit-user-select:none; -moz-user-select: none;'
	
	container.style.cssText = unselect+ 'position:absolute; color:#CCCCCC; font-size:11px; font-family:Monospace; width:100%; height:100%; pointer-events:none;';

	var titleLogo = document.createElement( 'div' );
	titleLogo.style.cssText = 'position:absolute; top:10px; left:10px; width:64px; height:64px;';
	titleLogo.innerHTML ="<img id='logo' src='images/logo64.png'/>";
	container.appendChild( titleLogo );


	var title = document.createElement( 'div' );
	title.style.cssText = 'font-weight:bold; position:absolute; color:#606060; top:15px; left:84px; text-align:left; pointer-events:none; font-size:28px; pointer-events:auto;';
	if(name==='dev')title.innerHTML ="<a href='https://github.com/lo-th/Oimo.js' target='_blank' style='color:#926240'>OIMO.JS</a><p style='font-size:18px; display:inline'> DEV/<a href='index_rev.html' target='_self' style='color:#926240'>REV</a></p>";
	else title.innerHTML ="<a href='https://github.com/lo-th/Oimo.js' target='_blank' style='color:#926240'>OIMO.JS</a><p style='font-size:18px; display:inline'> REV/<a href='index.html' target='_self' style='color:#926240'>DEV</a></p>";
	container.appendChild( title );

	var buttonStyle = 'font-weight:bold;width:32px; height:24px; position:relative; padding:4px 2px;margin:0px 4px; -webkit-border-radius: 20px; border-radius:20px; border:2px solid rgba(255,255,255,0.2); background-color: rgba(255,255,255,0); display:inline-block; text-decoration:none; cursor:pointer; pointer-events:auto;font-size:20px;';
	var bbStyle = 'font-weight:bold;width:200px; height:24px; position:relative; padding:4px 2px;margin:0px 4px; display:inline-block; text-decoration:none; font-size:20px;';
	
	var aMenu = document.createElement( 'div' );
	aMenu.style.cssText = 'left:84px; top:48px;  position:absolute; display:block; text-align:center;';
	container.appendChild( aMenu );

	

	var output = document.createElement( 'div' );
	output.id = "output";
	output.style.cssText = 'font-family:Monospace; position:absolute; color:#AAAAAA; top:100px; width:300px; height:400px; left:60px; text-align:left; pointer-events:none;';
	container.appendChild( output );

	//________________________________COPY

	var copy = document.createElement( 'div' );
	copy.style.cssText = 'position:absolute; bottom:7px; width:350px; right:10px; text-align:right; pointer-events:auto; color:#888888;';
	copy.innerHTML = "<a href='http://3dflashlo.wordpress.com/' target='_blank' style='color:#888888'>LOTH 2013</a> | <a href='http://threejs.org' target='_blank' style='color:#888888'>THREE.JS</a> | <a href='https://code.google.com/p/sea3d/' target='_blank' style='color:#888888'>SEA3D</a> | <a href='https://github.com/saharan/OimoPhysics' target='_blank' style='color:#888888'>OIMO.PHYSICS</a>";
	container.appendChild( copy );

	//________________________________MENU

	var bnext = document.createElement( 'div' );
	bnext.style.cssText = buttonStyle;
	bnext.textContent = ">";

	var bprev = document.createElement( 'div' );
	bprev.style.cssText = buttonStyle;
	bprev.textContent = "<";

	var bcenter = document.createElement( 'div' );
	bcenter.id = "demoName";
	bcenter.style.cssText = bbStyle;
	bcenter.textContent = "Basic shape";

	
	aMenu.appendChild( bcenter );
	aMenu.appendChild( bprev );
	aMenu.appendChild( bnext );

    bprev.addEventListener( 'mouseover', function ( event ) { event.preventDefault();this.style.color ='#000000'; this.style.border = '2px solid rgba(255,255,1,0.6)'; this.style.backgroundColor = 'rgba(255,255,1,0.6)';  }, false );
    bprev.addEventListener( 'mouseout', function ( event ) { event.preventDefault();this.style.color ='#CCCCCC'; this.style.border = '2px solid rgba(255,255,255,0.2)'; this.style.backgroundColor = 'rgba(1,1,1,0)';  }, false );
    bnext.addEventListener( 'mouseover', function ( event ) { event.preventDefault();this.style.color ='#000000'; this.style.border = '2px solid rgba(255,255,1,0.6)'; this.style.backgroundColor = 'rgba(255,255,1,0.6)';  }, false );
    bnext.addEventListener( 'mouseout', function ( event ) { event.preventDefault();this.style.color ='#CCCCCC'; this.style.border = '2px solid rgba(255,255,255,0.2)'; this.style.backgroundColor = 'rgba(1,1,1,0)';  }, false );

	bprev.addEventListener( 'mousedown', function ( event ) { event.preventDefault(); prevDemo(); }, false );
	bnext.addEventListener( 'mousedown', function ( event ) { event.preventDefault(); nextDemo(); }, false );


	//______________GRAVITY

	var G = -10;
	var drag;
	//var finalFunction;

	var loDiv = document.createElement( 'div' );
	loDiv.style.cssText = 'position:absolute;left:10px; top:100px; width:40px; height:200px; padding:0 0 0 0; display:block; background:rgba(255,255,255,0.0); border:1px solid rgba(255,255,255,0.2);-webkit-border-radius:20px; border-radius:20px; cursor:ns-resize;text-align:center; pointer-events:auto;';
	container.appendChild( loDiv );

	var loDiv2 = document.createElement( 'div' );
	loDiv2.style.cssText = 'position:absolute; left:10px; bottom:0px; width:20px; height:200px; display:block; background:rgba(255,255,0,0.05);-webkit-border-radius:10px; border-radius:10px; pointer-events:none;';
	loDiv.appendChild( loDiv2 );
	

	var center = document.createElement( 'div' );
	center.style.cssText = 'position:absolute;width:30px;left:5px;height:1px;padding:0 0 0 0; background:rgba(255,255,255,0.2); top:100px; pointer-events:none;';
	loDiv.appendChild( center );

	var select = document.createElement( 'div' );
	select.style.cssText = 'position:absolute;width:30px;left:5px;height:1px;padding:0 0 0 0; background:rgba(255,255,1,0.8); top:100px; pointer-events:none;';
	loDiv.appendChild( select );

	var txt = document.createElement( 'div' );
	txt.style.cssText = 'position:absolute;width:40px;height:30px;padding:0 0 0 0; top:105px; pointer-events:none;';
	loDiv.appendChild( txt );

	var txt2 = document.createElement( 'div' );
	txt2.style.cssText = 'position:absolute;width:40px;height:30px;padding:0 0 0 0; top:85px; pointer-events:none;';
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
				select.style.left = '15px';
			}else{
				select.style.width = '30px';
				select.style.left = '5px';
			}
		}
	}

	var moveDef =  function ( g ) {
		var rect = loDiv.getBoundingClientRect();
		var pos = (((-g)*10)+100);

		G = g;
		txt.textContent = G;
		select.style.top = pos +"px";
		loDiv2.style.height = 200-pos +"px";

		if(pos<10 || pos>190){ 
			select.style.width = '10px';
			select.style.left = '15px';
		}else{
			select.style.width = '30px';
			select.style.left = '5px';
		}
	}

	moveDef(G);




    return {
		domElement: container
	}


}