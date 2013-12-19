/**
 * @author loth / http://3dflashlo.wordpress.com/
 */
'use strict';
var Editor = function (Pos) {
	var left = Pos || 150;
	var render3d, scene3d = null;
	var unselect = '-o-user-select:none; -ms-user-select:none; -khtml-user-select:none; -webkit-user-select:none; -moz-user-select: none;'
	var textselect = '-o-user-select:text; -ms-user-select:text; -khtml-user-select:text; -webkit-user-select:text; -moz-user-select: text;'
	var mini = true;
	var type = "color";
	var open = false;
	var startHeight = 416;

    var container = document.createElement( 'div' );
	container.style.cssText = unselect+'position:absolute; bottom:0px; left:'+left+'px; color:#CCCCCC; font-size:12px; font-family:SourceCode; text-align:center; pointer-events:none;';
	container.id = 'Demo';

	var borderL = '-webkit-border-top-left-radius:20px; border-top-left-radius:20px;';
	var borderR = '-webkit-border-top-right-radius:20px; border-top-right-radius:20px;';
    var effect = 'box-shadow: 0 0 4px rgba(255,255,255,0.3); ';

	var deco = document.createElement( 'div' );
	deco.style.cssText = borderL+borderR+effect+'font-weight:bold; width:140px; margin-left:-70px; height:'+startHeight+'px; position:relative; display:block; overflow:hidden;';
	deco.style.transform='translateY('+(startHeight-30)+'px)';
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
	    	bcenter.style.width= '196px';
			deco.style.marginLeft='-128px';
			deco.style.width= '256px';
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

	var MainEditor = document.createElement( 'input' );
	MainEditor.type = 'text';
	MainEditor.async = true;
	MainEditor.style.cssText ='color:#CCCCCC; padding:4px 4px; width:256px; height:256px; display:none; background:rgba(1,1,1,0.1); pointer-events:auto; text-align:left; border:none;';
	deco.appendChild( MainEditor );













    

	return {
		domElement: container
	}

}
