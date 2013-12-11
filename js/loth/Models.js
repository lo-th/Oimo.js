/**
 * @author loth / http://3dflashlo.wordpress.com/
 */

var Models = function () {
	var unselect = '-o-user-select:none; -ms-user-select:none; -khtml-user-select:none; -webkit-user-select:none; -moz-user-select: none; '
	var mini = true;


    var container = document.createElement( 'div' );
	container.id = 'Models';
	container.style.cssText = unselect+'width:260px; position:absolute; bottom:10px; left:10px; color:#CCCCCC;font-size:12px;font-family:Monospace;text-align:center;';//pointer-events:none;

	var aMini = document.createElement( 'div' );
	aMini.style.cssText = 'padding:0px 1px; position:relative; display:block;-webkit-border-top-left-radius:20px; border-top-left-radius: 20px;-webkit-border-top-right-radius: 20px; border-top-right-radius: 20px;';//' background-color:#ff55ff';
	container.appendChild( aMini );

	var buttonStyle = 'width:20px; position:relative;padding:4px 2px;margin:2px 2px; -webkit-border-radius: 20px; border-radius:20px; border:1px solid rgba(1,1,1,0.2); background-color: rgba(1,1,1,0.2); display:inline-block; text-decoration:none; cursor:pointer;';
	
	var bnext = document.createElement( 'div' );
	bnext.style.cssText = buttonStyle;
	bnext.textContent = ">";

	var bprev = document.createElement( 'div' );
	bprev.style.cssText = buttonStyle;
	bprev.textContent = "<";

	var bcenter = document.createElement( 'div' );
	bcenter.style.cssText = buttonStyle+'width:80px';
	bcenter.textContent = "Models";

	aMini.appendChild( bprev );
	aMini.appendChild( bcenter );
	aMini.appendChild( bnext );

	var bigMap = document.createElement( 'div' );
	bigMap.style.cssText = ' width:256px;height:256px; position:relative;margin:2px 0px; display:none; background-color:#0055ff; visibility:hidden';
	aMini.appendChild( bigMap );

	bcenter.addEventListener( 'mousedown', function ( event ) { event.preventDefault(); openPannel() }, false );

    bcenter.addEventListener( 'mouseover', function ( event ) { event.preventDefault(); this.style.border = '1px solid rgba(1,1,1,0.6)'; this.style.backgroundColor = 'rgba(1,1,1,0.6)';  }, false );
    bcenter.addEventListener( 'mouseout', function ( event ) { event.preventDefault(); this.style.border = '1px solid rgba(1,1,1,0.2)'; this.style.backgroundColor = 'rgba(1,1,1,0.2)';  }, false );
    bprev.addEventListener( 'mouseover', function ( event ) { event.preventDefault(); this.style.border = '1px solid rgba(1,1,1,0.6)'; this.style.backgroundColor = 'rgba(1,1,1,0.6)';  }, false );
    bprev.addEventListener( 'mouseout', function ( event ) { event.preventDefault(); this.style.border = '1px solid rgba(1,1,1,0.2)'; this.style.backgroundColor = 'rgba(1,1,1,0.2)';  }, false );
    bnext.addEventListener( 'mouseover', function ( event ) { event.preventDefault(); this.style.border = '1px solid rgba(1,1,1,0.6)'; this.style.backgroundColor = 'rgba(1,1,1,0.6)';  }, false );
    bnext.addEventListener( 'mouseout', function ( event ) { event.preventDefault(); this.style.border = '1px solid rgba(1,1,1,0.2)'; this.style.backgroundColor = 'rgba(1,1,1,0.2)';  }, false );
    
    var openPannel = function () {
    	if(mini){
    		mini=false;
    		aMini.style.border = '1px solid #010101';
    		container.style.bottom = '-1px';

    		bigMap.style.display = 'block';
    		bigMap.style.visibility = 'visible';

    	}else{
    		mini=true;
    		aMini.style.border = 'none';
    		container.style.bottom = '8px';
    		
    		bigMap.style.display = 'none';
    		bigMap.style.visibility = 'hidden';
    	}
	}

	return {

		domElement: container,

		begin: function () {

			//startTime = Date.now();

		}
	}

}
