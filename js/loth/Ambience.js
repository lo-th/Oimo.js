/**
 * @author loth / http://3dflashlo.wordpress.com/
 */
'use strict';
var Ambience = function (Pos) {
	var doc = document;
	var left = Pos || 140//140;
	var render3d, scene3d = null;
	var unselect = '-o-user-select:none; -ms-user-select:none; -khtml-user-select:none; -webkit-user-select:none; -moz-user-select: none;'
	var textselect = '-o-user-select:text; -ms-user-select:text; -khtml-user-select:text; -webkit-user-select:text; -moz-user-select: text;'
	var mini = true;
	var type = "color";
	var open = false;
	var startHeight = 416;

    var container = doc.createElement( 'div' );
	container.style.cssText = unselect+'position:absolute; bottom:0px; left:'+left+'px; color:#CCCCCC; font-size:12px; font-family:Consolas; text-align:center; pointer-events:none;';
	container.id = 'Ambience';

	var borderL = '-webkit-border-top-left-radius:20px; border-top-left-radius:20px;';
	var borderR = '-webkit-border-top-right-radius:20px; border-top-right-radius:20px;';
    var effect = 'border:1px solid rgba(255,255,255,0.3);';

	var deco = doc.createElement( 'div' );
	deco.style.cssText = borderL+borderR+effect+'width:140px; margin-left:-70px; height:'+startHeight+'px; position:relative; display:block; overflow:hidden;';
	deco.style.transform='translateY('+(startHeight-30)+'px)';
	deco.style.webkitTransform='translateY('+(startHeight-30)+'px)';
	container.appendChild( deco );

	//----------------------------------------------


	/*var aMini = doc.createElement( 'div' );
	aMini.style.cssText = 'padding:0px 1px; position:relative; display:block;-webkit-border-top-left-radius:20px; border-top-left-radius: 20px;-webkit-border-top-right-radius: 20px; border-top-right-radius: 20px; ';//' background-color:#ff55ff';
	//container.appendChild( aMini );

	var buttonStyle = 'width:20px; position:relative;padding:4px 2px;margin:2px 2px; -webkit-border-radius: 20px; border-radius:20px; border:1px solid rgba(1,1,1,0.2); background-color: rgba(1,1,1,0.1); display:inline-block; text-decoration:none; cursor:pointer;';
	*/

	var bstyle = 'font-size:14px; border-bottom:1px solid rgba(1,1,1,0.3); background:rgba(1,1,1,0.1); height:19px; padding:5px 0px;';
	var buttonActif = 'position:relative; display:inline-block; cursor:pointer; pointer-events:auto;';

	var bnext = doc.createElement( 'div' );
	bnext.style.cssText =bstyle + borderR+buttonActif+'width:30px;';
	bnext.textContent = ">";

	var bprev = doc.createElement( 'div' );
	bprev.style.cssText =bstyle+ borderL+buttonActif+'width:30px;';
	bprev.textContent = "<";

	var bcenter = doc.createElement( 'div' );
	bcenter.style.cssText =bstyle+buttonActif+'width:80px;';
	bcenter.textContent = "AMBIENT";

	deco.appendChild( bprev );
	deco.appendChild( bcenter );
	deco.appendChild( bnext );

	bcenter.addEventListener( 'mousedown', function ( event ) { event.preventDefault(); transforme(); this.style.backgroundColor = 'rgba(55,123,167,0.5)'; }, false );
	bprev.addEventListener( 'mousedown', function ( event ) { event.preventDefault(); if(type==="color") prevGradian(); else prevLocation(); this.style.backgroundColor = 'rgba(55,123,167,0.5)';}, false );
	bnext.addEventListener( 'mousedown', function ( event ) { event.preventDefault(); if(type==="color") nextGradian(); else nextLocation(); this.style.backgroundColor = 'rgba(55,123,167,0.5)';}, false );

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
			displayPannel();
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
			hidePannel();
		}
	}

	// type select

	var bType = doc.createElement( 'div' );
	bType.style.cssText = bstyle+buttonActif+'width:128px';
	bType.textContent = "Colors";

	var bType2 = doc.createElement( 'div' );
	bType2.style.cssText = bstyle+buttonActif+'width:127px; border-left:1px solid rgba(1,1,1,0.3);';
	bType2.textContent = "Real";
	bType.style.color = "#FFFF00";

	var typeSelect = doc.createElement( 'div' );
	typeSelect.style.cssText = ' width:256px; position:relative; display:none;';
	deco.appendChild( typeSelect );

	typeSelect.appendChild( bType );
	typeSelect.appendChild( bType2 );

	bType.addEventListener( 'mouseover', function ( event ) { event.preventDefault();  this.style.backgroundColor = 'rgba(55,123,167,1)';  }, false );
    bType.addEventListener( 'mouseout', function ( event ) { event.preventDefault(); this.style.backgroundColor = 'rgba(1,1,1,0.1)';  }, false );
    bType.addEventListener( 'click', function ( event ) { event.preventDefault(); switchType(1); }, false );

    bType2.addEventListener( 'mouseover', function ( event ) { event.preventDefault();  this.style.backgroundColor = 'rgba(55,123,167,1)';  }, false );
    bType2.addEventListener( 'mouseout', function ( event ) { event.preventDefault();  this.style.backgroundColor = 'rgba(1,1,1,0.1)';  }, false );
    bType2.addEventListener( 'click', function ( event ) { event.preventDefault(); switchType(2); }, false );

    

	//-------------------------------------------------

	
	var bigMap = doc.createElement( 'div' );
	bigMap.style.cssText = 'width:256px; height:256px; position:relative; display:none; ';
	deco.appendChild( bigMap );

	var bigGradian = doc.createElement( 'div' );
	bigGradian.style.cssText = 'width:256px; height:60px; position:relative; display:none; ';
	deco.appendChild( bigGradian );

	var bigColor = doc.createElement( 'div' );
	bigColor.style.cssText = 'width:256px; height:40px; position:relative; display:none; ';
	deco.appendChild( bigColor );

	//-------------------------------------------------

	

	var bigMapGoogle = doc.createElement( 'div' );
	bigMapGoogle.style.cssText = ' width:256px; height:256px; position:relative; display:block; visibility:hidden; pointer-events:auto;';
	deco.appendChild( bigMapGoogle );
	var bigMapInterface = doc.createElement( 'div' );
	bigMapInterface.style.cssText = ' width:256px; height:102px; position:relative; display:none; ';
	deco.appendChild( bigMapInterface );

	//-----------------------------------------------

	var isShowfinalPreset = false;
	var finalPresetButton = doc.createElement( 'div' );
	finalPresetButton.style.cssText = 'font-size:9px; bottom:2px; right:2px; position:absolute; padding:-2px -2px; width:13px; height:13px; -webkit-border-radius: 20px; border-radius:20px; border:1px solid rgba(1,1,1,0.6); background-color: rgba(1,1,1,0.5);cursor:pointer; pointer-events:auto;';
	finalPresetButton.textContent = "+";
	

	var finalPreset = doc.createElement( 'div' );
	finalPreset.style.cssText =  textselect + 'font-size:9px; position:absolute; padding:10px 10px; width:230px; height:300px; bottom:40px; left:138px; border-radius: 10px; border:1px solid #010101; background-color: #111; text-align:left; display:none; pointer-events:auto;';

	container.appendChild( finalPreset );
	finalPresetButton.addEventListener( 'mouseover', function ( e ) { e.preventDefault(); this.style.border = '1px solid rgba(1,1,1,0.6)'; this.style.backgroundColor = 'rgba(1,1,1,0.6)';  }, false );
	finalPresetButton.addEventListener( 'mouseout', function ( e ) { e.preventDefault(); this.style.border = '1px solid rgba(1,1,1,0.2)'; this.style.backgroundColor = 'rgba(1,1,1,0.2)';  }, false );
	finalPresetButton.addEventListener('click',function(e){
		e.preventDefault();
		if(isShowfinalPreset){isShowfinalPreset = false;  finalPreset.style.display = "none";}
		else {isShowfinalPreset=true; finalPreset.style.display = "block"; traceCurrent();}
	});

	//-----------------------------------------------

    var displayPannel = function () {
		typeSelect.style.display = 'block';

		if(type==="color"){
    		bigMap.style.display = 'block';
    		bigGradian.style.display = 'block';
    		bigColor.style.display = 'block';
    		/*if(currentColor!==-1){
    			bigColor.style.display = 'block';
    		}*/
	    } else {
	    	//deco.appendChild( bigMapGoogle );
	    	bigMapGoogle.style.visibility = 'visible';
	    	//bigMapGoogle.style.display = 'block';
    		bigMapInterface.style.display = 'block';
	    }
	}

	var hidePannel = function () {
		typeSelect.style.display = 'none';

		if(type==="color"){
    		bigMap.style.display = 'none';
    		bigGradian.style.display = 'none';
    		bigColor.style.display = 'none';
    		finalPreset.style.display = 'none';
    		//bigOption.style.display = 'none';
	    } else {
	    	//deco.removeChild( bigMapGoogle );
	    	bigMapGoogle.style.visibility = 'hidden';
	    	//bigMapGoogle.style.display = 'none';
    		bigMapInterface.style.display = 'none';
	    }
	}


	//--------------------------------------
    // TYPE PRESET
    //--------------------------------------

    var switchType = function (n){
    	if(n===2){
    		type = "real";
    		pos = locations[ currentPosition ];
    		bcenter.textContent = pos.name;

    		bType.style.color = "#CCCCCC";
    		bType2.style.color = "#FFFF00";

    		bigMap.style.display = 'none';
    		bigGradian.style.display = 'none';
    		bigColor.style.display = 'none';
    		finalPreset.style.display = 'none';

    		//bigMapGoogle.style.display = 'block';
    		bigMapGoogle.style.visibility = 'visible';
    		//deco.appendChild( bigMapGoogle );

	    	bigMapInterface.style.display = 'block';

	    	if(!isMapApiLoaded)loadGoogleMapsAPI();

	    	if(mapCanvas){
	    		texture = new THREE.Texture( mapCanvas );
	    		applyMaterial();
	    	}
    	} else {
    		type = "color";
    		bcenter.textContent = ShaderMapList[currentShader].name;

    		bType.style.color = "#FFFF00";
    		bType2.style.color = "#CCCCCC";

    		//bigMapGoogle.style.display = 'none';
    		//deco.removeChild( bigMapGoogle );
    		bigMapGoogle.style.visibility = 'hidden';
	    	bigMapInterface.style.display = 'none';

    		bigMap.style.display = 'block';
	    	bigGradian.style.display = 'block';
	    	bigColor.style.display = 'block';

	    	texture = new THREE.Texture(canvasSphere[0]);
	    	applyMaterial();
    	}
    }

	//--------------------------------------
    // 3D SIDE
    //--------------------------------------

	var applyMaterial = function () {
		if(texture==null ){
			texture = new THREE.Texture(canvasSphere[0]);
		}
		texture.needsUpdate = true; 
		if(TE) TE.updateBallCamera();
	}

	//--------------------------------------
	//  GOOGLE PANORAMA INIT
	//--------------------------------------

	var loadGoogleMapsAPI = function () {
	    var script = doc.createElement("script");
	    script.type = "text/javascript";
	    script.src = "http://maps.google.com/maps/api/js?sensor=false&callback=initializeGoogleMapsAPI";
	    doc.body.appendChild(script);
	}

	var locations = [
	    { lat: 41.413416092316275, lng: 2.1531126527786455, name:'pos 0' },//port
	    { lat: 35.69143938066447, lng: 139.695139627539, name:'pos 1' },//resto
	    { lat: 41.413416092316275, lng: 2.1531126527786455, name:'pos 2' },//australie
		{ lat: 51.50700703827454, lng: -0.12791916931155356, name:'pos 3' },
		{ lat: 32.6144404, lng: -108.9852017, name:'resto3' },
		{ lat: 39.36382677360614, lng: 8.431220278759724, name:'pos 4' },
		{ lat: 28.240385123352873, lng: -16.629988706884774, name:'pos 5' },
		{ lat: 50.09072314148827, lng: 14.393133454556278, name:'pos 6' },
		{ lat: 41.413416092316275, lng: 2.1531126527786455, name:'pos 7' },
		{ lat: 35.69143938066447, lng: 139.695139627539, name:'pos 8' },
		{ lat: 35.67120372775569, lng: 139.77167914398797, name:'pos 9' },
		{ lat: 54.552083679428065, lng: -3.297380963134742 , name:'pos 10'},
		//{ lat: -1.23920, lng: -90.385735, name:'sea 0' },
		//{ lat: -1.216466, lng: -90.422150, name:'sea 1' },
		//{ lat: -8.737039, lng: 119.412259, name:'sea 2' },
		{ lat: 48.863685, lng: 2.323028, name:'musee 1' },
		{ lat: 19.425750, lng: -99.187024, name:'musee 2' }
	];

	var currentPosition = Math.floor( Math.random() * locations.length );
	var zoom;
	var geocoder;
	var error;
	var message;
	var activeLocation = null;
	var scaleButtons = [];
	var position = { x: 0, y: 0 };
	var pos;
	var GEOloader = null;// = new GSVPANO.PanoLoader();
	var marker = null;
	var map = null;
	var mapCanvas;
	var geoMap;
	var isMapApiLoaded = false;

	var nextLocation = function () {
		currentPosition ++;
		if(currentPosition === locations.length) currentPosition = 0;
		setGeoPosition();
	}

	var prevLocation = function () {
		currentPosition --;
		if(currentPosition < 0) currentPosition = locations.length -1;
		setGeoPosition();
	}

	// search 
	var search = doc.createElement( 'div' );
	search.style.cssText = 'position:absolute;width:192px; height:19px; padding:5px 0px; border-bottom:1px solid rgba(1,1,1,0.3); background:rgba(1,1,1,0.2);';
	bigMapInterface.appendChild( search );

	var searchTxt = doc.createElement( 'input' );
	searchTxt.type = 'text';
	//searchTxt.style.cssText = 'color:#EEEEEE; left:2px; width:180px; padding:4px 2px;margin:2px 2px; height:14px;position:absolute; -webkit-border-radius: 20px; border-radius:20px; border:1px solid rgba(1,1,1,0.5); background-color: rgba(1,1,1,0.2);font-size:12px;font-family:Monospace;text-align:center;';
	searchTxt.style.cssText ='width:184px; position:relative; color:#CCCCCC; background:none; text-shadow: 1px 1px 3px #000;  font-size:14px; height:19px; padding:5px 4px; display:inline-block; pointer-events:auto; border:none; ';
	//search.appendChild( searchTxt );
	bigMapInterface.appendChild( searchTxt );
	searchTxt.addEventListener( 'keydown', function ( e ) { if (e.keyCode == 13)findAddress(); }, false );


	var searchButton = doc.createElement( 'div' );
	searchButton.style.cssText = bstyle+buttonActif+'width:63px; border-left:1px solid rgba(1,1,1,0.3);';//buttonStyle+'width:50px; right:2px;position:absolute;';
	searchButton.textContent = "Search";
	bigMapInterface.appendChild( searchButton );

	searchButton.addEventListener( 'mouseover', function ( e ) { e.preventDefault(); this.style.backgroundColor = 'rgba(55,123,167,1)';  }, false );
    searchButton.addEventListener( 'mouseout', function ( e ) { e.preventDefault();  this.style.backgroundColor = 'rgba(1,1,1,0.1)';  }, false );
    searchButton.addEventListener( 'click', function ( e ) { e.preventDefault(); findAddress(); }, false );

    // scale button
	var scales = [];
	var scalesName = ['low', 'medium', 'high', 'max'];
	for(var i=0; i!==4; i++){
		scales[i] = doc.createElement( 'div' );
		if(i===0)scales[i].style.cssText = bstyle+buttonActif+'width:64px;';
		else scales[i].style.cssText = bstyle+buttonActif+'width:63px; border-left:1px solid rgba(1,1,1,0.3);';//buttonStyle+'width:50px';
		scales[i].textContent = scalesName[i];
		scales[i].name = i+1;
		bigMapInterface.appendChild( scales[i] );
		scales[i].addEventListener( 'mouseover', function ( e ) { e.preventDefault(); this.style.backgroundColor = 'rgba(55,123,167,1)';  }, false );
		scales[i].addEventListener( 'mouseout', function ( e ) { e.preventDefault();  this.style.backgroundColor = 'rgba(1,1,1,0.1)';  }, false );
		scales[i].addEventListener( 'click', function ( e ) { e.preventDefault(); setZoom( this.name ); }, false );
	}


	// loading bar
	var preloader = doc.createElement( 'div' );
	preloader.style.cssText = 'display:block; top:0px; width:256px; height:6px; position:relative; -webkit-border-radius: 20px; border-radius:5px; border-bottom:1px solid rgba(1,1,1,0.3); background-color: rgba(1,1,1,0.1); pointer-events: none;';
	bigMapInterface.appendChild( preloader );

	var bar = doc.createElement( 'div' );
	bar.style.cssText = ' width:256px;height:5px; position:absolute; background-color: rgba(55,123,167,1); pointer-events: none;';
	preloader.appendChild( bar );

	// message
	var messageDiv = doc.createElement( 'div' );
	messageDiv.style.cssText = 'display:block;top:5px;  width:256px; height:30px; position:relative; margin:2px 2px; pointer-events: none;font-size:9px;font-family:Monospace;text-align:center;';
	bigMapInterface.appendChild( messageDiv );


	var setActiveZoom = function (n) {
		for(var i=0; i!==4; i++){
			if(i===(n-1)) scales[i].style.color = "#FFFF00";
			else scales[i].style.color = "#CCCCCC";
		}
	}

	var setGeoPosition = function (n) {
		pos = locations[ currentPosition ];
		var myLatlng = new google.maps.LatLng( pos.lat, pos.lng );
		//setZoom( 2 );
		addMarker( myLatlng );
		map.panTo(myLatlng);
	}


var newCanvas;

    window.initializeGoogleMapsAPI = function () {
		isMapApiLoaded = true;
		GEOloader = new GSVPANO.PanoLoader();
		pos = locations[ currentPosition ];
		bcenter.textContent = pos.name;
		var myLatlng = new google.maps.LatLng( pos.lat, pos.lng );
		var myOptions = { zoom: 18, center:myLatlng, mapTypeId: google.maps.MapTypeId.HYBRID, streetViewControl:false, mapTypeControl:false, zoomControl:false, panControl:false, overviewMapControl:false};

		map = new google.maps.Map( bigMapGoogle, myOptions);
		google.maps.event.addListener(map, 'click', function(event) { addMarker(event.latLng); });
		geocoder = new google.maps.Geocoder();

		setZoom( 2 );
		addMarker( myLatlng );
	//}
		GEOloader.onProgress = function( p ) {
			setProgress( p );
		};
		
		GEOloader.onPanoramaData = function( result ) {
			showProgress( true );
			showMessage( 'Panorama OK. Loading and composing tiles...' );
		}
		
		GEOloader.onNoPanoramaData = function( status ) {
			showMessage('Panorama ERROR. reason: ' + status);
		}
		
		GEOloader.onPanoramaLoad = function(e) {
			activeLocation = this.location;
			bcenter.textContent = pos.name;

			if(locations[ currentPosition ].name.slice(0,3) === 'sea'){
				newCanvas = doc.createElement('canvas');
				var w = Math.round(this.canvas.width*0.7127);
				var decal = this.canvas.width-w

				newCanvas.width = w;
				newCanvas.height = Math.round(this.canvas.height*0.7127);
				var ctx = newCanvas.getContext('2d');

				ctx.drawImage(this.canvas, -decal, 0);

				mapCanvas = newCanvas;

				//doc.body.appendChild( this.canvas );

			}

			//textureNeedUpdate = true;

			// update basic material
			//texture = new THREE.Texture( this.canvas ); 
			else mapCanvas = this.canvas;

			//texture.needsUpdate = true;
			// get final image
			//envSphere.rotation.y = 0;
			//envSphere.rotation.z = 0;

			setTimeout(function(){
			
			//var ct = mapCanvas.getContext("2d");
			//var image = ct.getImageData(0, 0, mapCanvas.width, mapCanvas.height);
			texture = new THREE.Texture( mapCanvas );
			//texture.needsUpdate = true;
			//threeEngine.changeBallMap();
			applyMaterial();
			//envMaterial.map = geoMap;
			//geoMap.needsUpdate = true;

			//envMaterial.map = new THREE.Texture( mapCanvas ); 
			//envMaterial.map.needsUpdate = true;

			//updateCamera();

		//	renderNeedUpdate = true;
		},10);

			//updateCamera();

			// get final image
			/*canvas = this.canvas;
			var ct = canvas.getContext("2d");
			image = ct.getImageData(0, 0, canvas.width, canvas.height);

			// change png alpha
			changeAlpha();

			// need update refection
			isReflect = true;*/

			showMessage( 'Panorama loaded.');
			console.log(  "{ lat: "+ pos.lat + ", lng: "+ pos.lng +" },");
			console.log(this.canvas.width+"/"+this.canvas.height+"   __" +length);
			if(newCanvas) console.log("new: "+newCanvas.width+"/"+newCanvas.height+"   __" +length);
			showProgress( false );
		};

		//setZoom( 2 );
		//addMarker( myLatlng );
	}

	//var changeAlpha = function (){
		/*var imageData = image.data, length = imageData.length;
		var perc = imageConfig.alpha;
		for(var i=3; i < length; i+=4){ imageData[i] =  255/(100/perc); }
		image.data = imageData;

	    textureHDR = new THREE.Texture( image );
	    textureHDR.minFilter = THREE.LinearFilter;
      	textureHDR.magFilter = THREE.NearestFilter;
      	materialHDR.uniforms.tDiffuse.value = textureHDR;
	    materialHDR.uniforms.tDiffuse.value.needsUpdate = true; */
	//}

	/*function lightup(imageobject, opacity){
		if (navigator.appName.indexOf("Netscape")!=-1 && parseInt(navigator.appVersion)>=5)
			imageobject.style.MozOpacity=opacity/100
		else if (navigator.appName.indexOf("Microsoft")!= -1 && parseInt(navigator.appVersion)>=4)
			imageobject.filters.alpha.opacity=opacity
	}*/

	var setProgress = function ( progress ) {
		bar.style.width = ( preloader.clientWidth ) * progress / 100 + 'px';
	}
	
	var showProgress = function ( show ) {
		//preloader.style.opacity = ( show == true )?1:0;
		preloader.style.display = ( show == true )?'block':'none';
	}
	
	var setZoom = function ( z ) {
		zoom = z;
		GEOloader.setZoom( z );
		setActiveZoom( z );
		if( activeLocation ) GEOloader.load( activeLocation );
	}
	
	var geoSuccess = function ( position ) {
		var currentLocation = new google.maps.LatLng( position.coords.latitude, position.coords.longitude );
		map.panTo( currentLocation );
		addMarker( currentLocation ); // move to position (thanks @theCole!)
	}
	
	var findAddress = function () {
		if( searchTxt.value ){
		var address = searchTxt.value;
	
		showMessage( 'Getting coordinates...' );
		geocoder.geocode( { 'address': address}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				map.setCenter(results[0].geometry.location);
				showMessage( 'Address found.' );
				addMarker( results[0].geometry.location ); // move to position (thanks @jocabola!)
			} else {
				showMessage("Geocode ERROR reason: " + status);
				showProgress( false );
			}
		});
	}
	}
	
	var showMessage = function ( message ) {
		messageDiv.innerHTML = message;
	}
	
	var addMarker = function (location) {
		if( marker ) marker.setMap( null );
		marker = new google.maps.Marker({ position: location, map: map });
		marker.setMap( map ); 
		showMessage( 'Loading panorama for zoom ' + zoom + '...' );
		GEOloader.load( location );
	}

    //--------------------------------------
    // SHADER COLOR PRESET
    //--------------------------------------

    var canvasSphere, ctxSphere;
    var canvasSphere2, ctxSphere2;
    var canvasSphere3, ctxSphere3;
    var alphaset, alphatxt;
    var lineset, linetxt;
	var canvasSphere=[];
	var canvasHelper=[];
	var canvasColors=[];

	var mh = [];
	var grd = [];
	var cac = [];
	var drag2 = false;
	var drag3 = false;

	
	var currentColor = -1;


	var ctxs=[];
	var ctxh=[];
	var ctxc=[];
	var dragcc=[];
	var grads = [];

	var texture;
    var currentShader = 0;
    var tweenner = [];
    var GRD ={
		name:'Default' ,line:1, alpha:1,
		ranging:{
		r0:0.0, r1:0.5, r2:0.60, r3:0.8,
		r4:0.05, r5:0.3, r6:0.95, r7:1.00,
		r8:0.2, r9:0.35, r10:0.95, r11:1.00
		},
		positions:{
		p0:64, p1:60, p2:128, p3:128,
		p4:178, p5:212, p6:128, p7:128
		},
		colors:{
		r0:60, v0:85, b0:87, a0:1,
		r1:107, v1:125, b1:127, a1:1,
		//r2:29, v2:31, b2:32, a2:1,
		//r3:47, v3:48, b3:49, a3:1,
		r2:47, v2:48, b2:49, a2:1,
		r3:29, v3:31, b3:32, a3:1,

		r4:197, v4:209, b4:209, a4:1,
		r5:197, v5:209, b5:209, a5:0,
		r6:197, v6:209, b6:209, a6:0,

		r7:50, v7:56, b7:57, a7:1,
		r8:50, v8:56, b8:57, a8:0,
		r9:50, v9:56, b9:57, a9:0,

		r10:30, v10:30, b10:30, a10:0,
		r11:17, v11:17, b11:17, a11:0
	}};
    /*var GRD ={
		name:'Default' ,line:1, alpha:1,
		ranging:{
		r0:0.21, r1:0.57, r2:0.62, r3:1.00,
		r4:0.14, r5:0.49, r6:0.95, r7:1.00,
		r8:0.00, r9:0.31, r10:0.95, r11:1.00
		},
		positions:{
		p0:165, p1:92, p2:128, p3:128,
		p4:48, p5:206, p6:128, p7:128
		},
		colors:{
		r0:26, v0:26, b0:26, a0:1,
		r1:83, v1:83, b1:80, a1:1,
		r2:26, v2:26, b2:26, a2:1,
		r3:26, v3:26, b3:26, a3:1,
		r4:180, v4:180, b4:180, a4:1,
		r5:80, v5:80, b5:80, a5:0,
		r6:30, v6:30, b6:30, a6:0,
		r7:17, v7:17, b7:17, a7:0,
		r8:80, v8:80, b8:80, a8:1,
		r9:60, v9:60, b9:60, a9:0,
		r10:30, v10:30, b10:30, a10:0,
		r11:17, v11:17, b11:17, a11:0
	}};*/

	var initInterface = function (){
		mh[0]= doc.createElement( 'div' );//doc.getElementById('mh0');
		mh[1]= doc.createElement( 'div' );//doc.getElementById('mh1');
		mh[2]= doc.createElement( 'div' );//doc.getElementById('mh2');
		mh[3]= doc.createElement( 'div' );//doc.getElementById('mh3');

		mh[0].style.cssText = mh[1].style.cssText ='pointer-events:none; position:absolute; margin-left:-64px; margin-top:-64px;';
		mh[2].style.cssText = mh[3].style.cssText ='position:absolute; margin-left:-10px; margin-top:-10px; cursor:move; pointer-events:auto;';

		initSphereGradian();
		drawSphereGradian();
		initColorSelector();

		mh[0].appendChild(canvasHelper[0]);
		mh[1].appendChild(canvasHelper[1]);
		mh[2].appendChild(canvasHelper[2]);
		mh[3].appendChild(canvasHelper[3]);

		mh[2].addEventListener( 'mousedown', function(e){ drag2 = true; currentColor = 4; getColorSelector();}, false );
		mh[2].addEventListener( 'mouseout', function(e){ drag2 = false; }, false );
		mh[2].addEventListener( 'mouseup', function(e){ drag2 = false; }, false );
		mh[2].addEventListener( 'mousemove', function(e){
			var rect = canvasSphere[0].getBoundingClientRect();
			if(drag2){
				GRD.positions['p'+0] = parseInt(e.clientX-rect.left);
				GRD.positions['p'+1] = parseInt(e.clientY-rect.top);
				placeHelper();
				drawSphereGradian();
			}
		} , false );

		mh[3].addEventListener( 'mousedown', function(e){ drag3 = true; currentColor = 8; getColorSelector();}, false );
		mh[3].addEventListener( 'mouseout', function(e){ drag3 = false; }, false );
		mh[3].addEventListener( 'mouseup', function(e){ drag3 = false; }, false );
		mh[3].addEventListener( 'mousemove', function(e){
			
			var rect = canvasSphere[0].getBoundingClientRect();
			if(drag3){
				GRD.positions['p'+4] = parseInt(e.clientX-rect.left);
				GRD.positions['p'+5] = parseInt(e.clientY-rect.top);
				placeHelper();
				drawSphereGradian();
			}
		} , false );

		grd[0]=doc.createElement( 'div' );
		grd[1]=doc.createElement( 'div' );
		grd[2]=doc.createElement( 'div' );
		grd[0].style.cssText = grd[1].style.cssText = grd[2].style.cssText ='position:relative; display:block; height:20px;';

		bigMap.appendChild(canvasSphere[0]);
		bigMap.appendChild(mh[0]);
		bigMap.appendChild(mh[1]);
		bigMap.appendChild(mh[2]);
		bigMap.appendChild(mh[3]);

		bigGradian.appendChild(grd[0]);
		bigGradian.appendChild(grd[1]);
		bigGradian.appendChild(grd[2]);

		grd[0].appendChild(canvasSphere[3]);
		grd[1].appendChild(canvasSphere[4]);
		grd[2].appendChild(canvasSphere[5]);

		var ccIn;
		var ccIn2;
		//_____ color helper
		for(var i=0; i!==12; i++){
			dragcc[i] = false;
			cac[i]= doc.createElement( 'div' ); //doc.getElementById('cc'+i);
			cac[i].style.cssText = 'width:20px; height:18px; position:absolute; margin-top:-33px; margin-left:-10px; cursor:w-resize; background-color: rgba(1,1,1,0); pointer-events:auto;';

			ccIn= doc.createElement( 'div' ); //doc.getElementById('cc'+i);
			ccIn.style.cssText = 'width:2px; height:18px; position:absolute; margin-left:9px; background-color: rgba(255,255,0,1);pointer-events:none;';
			
			ccIn2= doc.createElement( 'div' ); //doc.getElementById('cc'+i);
			ccIn2.style.cssText = 'width:4px; height:18px; position:absolute; margin-left:8px; background-color: rgba(0,0,0,0.3);pointer-events:none;';
			cac[i].appendChild(ccIn2);
			cac[i].appendChild(ccIn);

			if(i<4) grd[0].appendChild(cac[i]);
			else if(i<8) grd[1].appendChild(cac[i]);
			else grd[2].appendChild(cac[i]);

			cac[i].name = i;
			dragcc[i] = false;
			cac[i].addEventListener( 'mousedown', function(e){e.preventDefault(); dragcc[this.name] = true; currentColor = this.name; getColorSelector();}, false );
		}

		for(var i=0; i!==3; i++){
			
			/**/
			if(i==0){
				grd[i].addEventListener( 'mouseout', function(e){e.preventDefault(); dragcc[0] = false;dragcc[1] = false;dragcc[2] = false;dragcc[3] = false; }, false );
				grd[i].addEventListener( 'mouseup', function(e){e.preventDefault(); dragcc[0] = false;dragcc[1] = false;dragcc[2] = false;dragcc[3] = false; }, false );
			}else if(i==1){
				grd[i].addEventListener( 'mouseout', function(e){e.preventDefault(); dragcc[4] = false;dragcc[5] = false;dragcc[6] = false;dragcc[7] = false; }, false );
				grd[i].addEventListener( 'mouseup', function(e){e.preventDefault(); dragcc[4] = false;dragcc[5] = false;dragcc[6] = false;dragcc[7] = false; }, false );
			}else {
				grd[i].addEventListener( 'mouseout', function(e){e.preventDefault(); dragcc[8] = false;dragcc[9] = false;dragcc[10] = false;dragcc[11] = false; }, false );
				grd[i].addEventListener( 'mouseup', function(e){e.preventDefault(); dragcc[8] = false;dragcc[9] = false;dragcc[10] = false;dragcc[11] = false; }, false );
			}
			grd[i].addEventListener( 'mousemove', function(e){e.preventDefault(); moveCurrentColor(e); } , false );
		}

		placeColors();
	}

	var moveCurrentColor = function (e){
		var rect = canvasSphere[0].getBoundingClientRect();
		var pos;
		if( dragcc[currentColor]){
			pos = (e.clientX-rect.left);
			if(pos<0)pos = 0;
			if(pos>256)pos=256;
			cac[currentColor].style.left = pos+'px';
			getColorsRange();
		}
	}

	var prevGradian = function (){
		if(currentShader!==0)currentShader--;
		else currentShader = ShaderMapList.length-1;
		bcenter.textContent = ShaderMapList[currentShader].name;
		tweenToPreset(  ShaderMapList[currentShader] );
	}
	var nextGradian = function (){
		if(currentShader!==ShaderMapList.length-1) currentShader++;
		else currentShader = 0;
		bcenter.textContent = ShaderMapList[currentShader].name;
		tweenToPreset(  ShaderMapList[currentShader] );
	}

	var tweenToPreset = function (obj){
		tweenner[0] = TweenLite.to(GRD, 4, { line:obj.line, alpha:obj.alpha});
		tweenner[1] = TweenLite.to(GRD.positions, 4, {
			p0:obj.positions.p0, p1:obj.positions.p1, p2:obj.positions.p2, p3:obj.positions.p3,
			p4:obj.positions.p4, p5:obj.positions.p5, p6:obj.positions.p6, p7:obj.positions.p7,
			onUpdate: placeHelper
		});
		tweenner[2] = TweenLite.to(GRD.ranging, 4, {
			r0:obj.ranging.r0, r1:obj.ranging.r1, r2:obj.ranging.r2, r3:obj.ranging.r3,
			r4:obj.ranging.r4, r5:obj.ranging.r5, r6:obj.ranging.r6, r7:obj.ranging.r7,
			r8:obj.ranging.r8, r9:obj.ranging.r9, r10:obj.ranging.r10, r11:obj.ranging.r11,
			onUpdate: placeColors
		});
		tweenner[3] = TweenLite.to(GRD.colors, 4, {
			r0:obj.colors.r0, v0:obj.colors.v0, b0:obj.colors.b0, a0:obj.colors.a0,
			r1:obj.colors.r1, v1:obj.colors.v1, b1:obj.colors.b1, a1:obj.colors.a1,
			r2:obj.colors.r2, v2:obj.colors.v2, b2:obj.colors.b2, a2:obj.colors.a2,
			r3:obj.colors.r3, v3:obj.colors.v3, b3:obj.colors.b3, a3:obj.colors.a3,
			r4:obj.colors.r4, v4:obj.colors.v4, b4:obj.colors.b4, a4:obj.colors.a4,
			r5:obj.colors.r5, v5:obj.colors.v5, b5:obj.colors.b5, a5:obj.colors.a5,
			r6:obj.colors.r6, v6:obj.colors.v6, b6:obj.colors.b6, a6:obj.colors.a6,
			r7:obj.colors.r7, v7:obj.colors.v7, b7:obj.colors.b7, a7:obj.colors.a7,
			r8:obj.colors.r8, v8:obj.colors.v8, b8:obj.colors.b8, a8:obj.colors.a8,
			r9:obj.colors.r9, v9:obj.colors.v9, b9:obj.colors.b9, a9:obj.colors.a9,
			r10:obj.colors.r10, v10:obj.colors.v10, b10:obj.colors.b10, a10:obj.colors.a10,
			r11:obj.colors.r11, v11:obj.colors.v11, b11:obj.colors.b11, a11:obj.colors.a11,
			onUpdate: drawSphereGradian
		});
	}

	var placeColors = function (){
		for(var i=0;i!==12; i++){
			cac[i].style.left = parseInt(256*GRD.ranging['r'+i])+'px';
		}
	}

	var setActiveColor = function (){
		for(var i=0;i!==12; i++){
			if(i!==currentColor){cac[i].style.border='none';}
			else {
				cac[i].style.border='1px solid #33FFFF';
			}
		}
	}

	var getColorsRange = function (){
		setActiveColor();
		for(var i=0;i!==12; i++){
			GRD.ranging['r'+i] = (parseInt((cac[i].style.left).replace('px', ''))/256).toFixed(2);
		}
		drawHelper2();
		drawSphereGradian();
	}

	var initSphereGradian = function (){
		canvasHelper[0] = doc.createElement("canvas");
		canvasHelper[1] = doc.createElement("canvas");
		canvasHelper[2] = doc.createElement("canvas");
		canvasHelper[3] = doc.createElement("canvas");

		canvasHelper[0].width = canvasHelper[0].height = 128;
		canvasHelper[1].width = canvasHelper[1].height = 128;
		canvasHelper[2].width = canvasHelper[2].height = 20;
		canvasHelper[3].width = canvasHelper[3].height = 20;

		ctxh[0] = canvasHelper[0].getContext("2d");
		ctxh[1] = canvasHelper[1].getContext("2d");
		ctxh[2] = canvasHelper[2].getContext("2d");
		ctxh[3] = canvasHelper[3].getContext("2d");

		drawHelper();

		canvasSphere[0] = doc.createElement("canvas");
		canvasSphere[1] = doc.createElement("canvas");
		canvasSphere[2] = doc.createElement("canvas"); 
		canvasSphere[0].width = canvasSphere[0].height = 256;
		canvasSphere[1].width = canvasSphere[1].height = 256;
		canvasSphere[2].width = canvasSphere[2].height = 256;
		ctxs[0] = canvasSphere[0].getContext("2d");
		ctxs[1] = canvasSphere[1].getContext("2d");
		ctxs[2] = canvasSphere[2].getContext("2d");
		ctxs[2].scale(0.5, 0.5);
		//__________linear degrad
		canvasSphere[3] = doc.createElement("canvas"); 
		canvasSphere[4] = doc.createElement("canvas");
		canvasSphere[5] = doc.createElement("canvas");

		canvasSphere[3].width = canvasSphere[4].width = canvasSphere[5].width =256;
		canvasSphere[3].height = canvasSphere[4].height = canvasSphere[5].height =30;
		ctxs[3] = canvasSphere[3].getContext("2d");
		ctxs[4] = canvasSphere[4].getContext("2d");
		ctxs[5] = canvasSphere[5].getContext("2d");
	}

	var drawHelper = function (){
		ctxh[2].beginPath();
	    ctxh[2].arc(10, 10, 8, 0, 2 * Math.PI, false);
	    ctxh[2].lineWidth = 4;
	    ctxh[2].strokeStyle = 'rgba(225,225,0,0.8)';
	    ctxh[2].stroke();
	    ctxh[2].fillStyle = 'rgba(225,225,0,0.1)';
	    ctxh[2].fill();

	    ctxh[3].beginPath();
	    ctxh[3].arc(10, 10, 8, 0, 2 * Math.PI, false);
	    ctxh[3].lineWidth = 4;
	    ctxh[3].strokeStyle = 'rgba(225,225,0,0.8)';
	    ctxh[3].stroke();
	    ctxh[3].fillStyle = 'rgba(225,225,0,0.1)';
	    ctxh[3].fill();

	    placeHelper();
	    drawHelper2();
	}

	var drawHelper2 = function (){
		ctxh[0].clearRect(0, 0, 128, 128);
		ctxh[1].clearRect(0, 0, 128, 128);
		var r0 = GRD.ranging['r'+4]*128;
		var r1 = GRD.ranging['r'+8]*128;
		
		ctxh[0].beginPath();
	    ctxh[0].arc(64, 64, r0, 0, 2 * Math.PI, false);
	    ctxh[0].lineWidth = 1;
	    ctxh[0].strokeStyle = 'rgba(225,225,0,0.3)';
	    ctxh[0].stroke();

	    ctxh[1].beginPath();
	    ctxh[1].arc(64, 64, r1, 0, 2 * Math.PI, false);
	    ctxh[1].lineWidth = 1;
	    ctxh[1].strokeStyle = 'rgba(225,225,0,0.3)';
	    ctxh[1].stroke();
	}

	var placeHelper = function (){
		mh[0].style.left = mh[2].style.left = parseInt(GRD.positions['p'+0])+'px' ;
		mh[0].style.top = mh[2].style.top = parseInt(GRD.positions['p'+1])+'px' ;
		mh[1].style.left = mh[3].style.left = parseInt(GRD.positions['p'+4])+'px' ;
		mh[1].style.top = mh[3].style.top = parseInt(GRD.positions['p'+5])+'px' ;
	}

	var drawSphereGradian = function (){
		var i;
		var color;
		ctxs[0].clearRect(0, 0, 256, 256);
		ctxs[1].clearRect(0, 0, 256, 256);
		grads[0] = ctxs[0].createLinearGradient(0,0,0,256);
		grads[5] = ctxs[0].createLinearGradient(0,0,256,0);
		grads[3] = ctxs[0].createLinearGradient(0,0,256,0);
		grads[4] = ctxs[0].createLinearGradient(0,0,256,0);
		grads[1] = ctxs[0].createRadialGradient(parseInt(GRD.positions['p'+0]),parseInt(GRD.positions['p'+1]),parseInt(GRD.ranging['r'+4]*128),parseInt(GRD.positions['p'+2]),parseInt(GRD.positions['p'+3]),parseInt(GRD.ranging['r'+7]*192));
		grads[2] = ctxs[0].createRadialGradient(parseInt(GRD.positions['p'+4]),parseInt(GRD.positions['p'+5]),parseInt(GRD.ranging['r'+8]*128),parseInt(GRD.positions['p'+6]),parseInt(GRD.positions['p'+7]),parseInt(GRD.ranging['r'+11]*192));

		for(i=0; i!==4; i++){
			color = 'rgba('+parseInt(GRD.colors['r'+i])+','+parseInt(GRD.colors['v'+i])+','+parseInt(GRD.colors['b'+i])+','+parseFloat(GRD.colors['a'+i]).toFixed(2)+')';
			grads[0].addColorStop(parseFloat(GRD.ranging['r'+i]).toFixed(2), color);
			grads[5].addColorStop(parseFloat(GRD.ranging['r'+i]).toFixed(2), color);
	    }

		for(i=0; i!==4; i++){
			color = 'rgba('+parseInt(GRD.colors['r'+(i+4)])+','+parseInt(GRD.colors['v'+(i+4)])+','+parseInt(GRD.colors['b'+(i+4)])+','+parseFloat(GRD.colors['a'+(i+4)]).toFixed(2)+')';
			grads[1].addColorStop(parseFloat(GRD.ranging['r'+(i+4)]).toFixed(2), color);
			grads[3].addColorStop(parseFloat(GRD.ranging['r'+(i+4)]).toFixed(2), color);
	    }

		for(i=0; i!==4; i++){
			color = 'rgba('+parseInt(GRD.colors['r'+(i+8)])+','+parseInt(GRD.colors['v'+(i+8)])+','+parseInt(GRD.colors['b'+(i+8)])+','+parseFloat(GRD.colors['a'+(i+8)]).toFixed(2)+')';
			grads[2].addColorStop(parseFloat(GRD.ranging['r'+(i+8)]).toFixed(2), color);
			grads[4].addColorStop(parseFloat(GRD.ranging['r'+(i+8)]).toFixed(2), color);
	    }
	    
	    ctxs[0].fillStyle = grads[0];
		ctxs[0].fillRect(0, 0, 256, 256);

	    ctxs[0].fillStyle = grads[1];
		ctxs[0].fillRect(0, 0, 256, 256);

		ctxs[0].fillStyle = grads[2];
		ctxs[0].fillRect(0, 0, 256, 256);

		//______________linear gradian
		ctxs[3].clearRect(0, 0, 256, 20);
		ctxs[4].clearRect(0, 0, 256, 20);
		ctxs[5].clearRect(0, 0, 256, 20);

		ctxs[3].fillStyle = grads[5];
		ctxs[3].fillRect(0, 0, 256, 20);

		ctxs[4].fillStyle = grads[3];
		ctxs[4].fillRect(0, 0, 256, 20);

		ctxs[5].fillStyle = grads[4];
		ctxs[5].fillRect(0, 0, 256, 20);

		//_____________stroke line
		/*ctxs[1].beginPath();
	    ctxs[1].arc(128, 128, 128, 0, 2 * Math.PI, false);
	    ctxs[1].lineWidth = GRD.line;
	    ctxs[1].strokeStyle = grads[0];
	    ctxs[1].stroke();

	    //_____________border line
	    ctxs[0].drawImage( canvasSphere[1], 0, 0 );
	    ctxs[0].globalAlpha = GRD.alpha;*/

		applyMaterial();
		if(isShowfinalPreset) traceCurrent();
	}

	var traceCurrent = function (){
		var finalshade = "var Map_"+ShaderMapList[currentShader].name+" ={<br> name:'"+ShaderMapList[currentShader].name+"' ,line:"+GRD.line+", alpha:"+GRD.alpha+", <br>";
		finalshade += " ranging:{<br>"+" r0:"+GRD.ranging.r0+", r1:"+GRD.ranging.r1+", r2:"+GRD.ranging.r2+", r3:"+GRD.ranging.r3+",<br>";
		finalshade += " r4:"+GRD.ranging.r4+", r5:"+GRD.ranging.r5+", r6:"+GRD.ranging.r6+", r7:"+GRD.ranging.r7+",<br>";
		finalshade += " r8:"+GRD.ranging.r8+", r9:"+GRD.ranging.r9+", r10:"+GRD.ranging.r10+", r11:"+GRD.ranging.r11+"<br>},<br>";
		finalshade += " positions:{<br>"+" p0:"+GRD.positions.p0+", p1:"+GRD.positions.p1+", p2:"+GRD.positions.p2+", p3:"+GRD.positions.p3+",<br>";
		finalshade += " p4:"+GRD.positions.p4+", p5:"+GRD.positions.p5+", p6:"+GRD.positions.p6+", p7:"+GRD.positions.p7+"<br>},<br>";

		finalshade += " colors:{<br>"+" r0:"+GRD.colors.r0+", v0:"+GRD.colors.v0+", b0:"+GRD.colors.b0+", a0:"+GRD.colors.a0+",<br>";
		finalshade += " r1:"+GRD.colors.r1+", v1:"+GRD.colors.v1+", b1:"+GRD.colors.b1+", a1:"+GRD.colors.a1+",<br>";
		finalshade += " r2:"+GRD.colors.r2+", v2:"+GRD.colors.v2+", b2:"+GRD.colors.b2+", a2:"+GRD.colors.a2+",<br>";
		finalshade += " r3:"+GRD.colors.r3+", v3:"+GRD.colors.v3+", b3:"+GRD.colors.b3+", a3:"+GRD.colors.a3+",<br>";

		finalshade += " r4:"+GRD.colors.r4+", v4:"+GRD.colors.v4+", b4:"+GRD.colors.b4+", a4:"+GRD.colors.a4+",<br>";
		finalshade += " r5:"+GRD.colors.r5+", v5:"+GRD.colors.v5+", b5:"+GRD.colors.b5+", a5:"+GRD.colors.a5+",<br>";
		finalshade += " r6:"+GRD.colors.r6+", v6:"+GRD.colors.v6+", b6:"+GRD.colors.b6+", a6:"+GRD.colors.a6+",<br>";
		finalshade += " r7:"+GRD.colors.r7+", v7:"+GRD.colors.v7+", b7:"+GRD.colors.b7+", a7:"+GRD.colors.a7+",<br>";

		finalshade += " r8:"+GRD.colors.r8+", v8:"+GRD.colors.v8+", b8:"+GRD.colors.b8+", a8:"+GRD.colors.a8+",<br>";
		finalshade += " r9:"+GRD.colors.r9+", v9:"+GRD.colors.v9+", b9:"+GRD.colors.b9+", a9:"+GRD.colors.a9+",<br>";
		finalshade += " r10:"+GRD.colors.r10+", v10:"+GRD.colors.v10+", b10:"+GRD.colors.b10+", a10:"+GRD.colors.a10+",<br>";
		finalshade += " r11:"+GRD.colors.r11+", v11:"+GRD.colors.v11+", b11:"+GRD.colors.b11+", a11:"+GRD.colors.a11+"<br>}};";
		finalPreset.innerHTML = finalshade;
	}

	//--------------------------------------
    // COLOR SELECTOR
    //--------------------------------------

    var ddDrag =  [];
	var ddcolors = [];
	var ddselect = [];
	var ddDiv = [];
	var ddSel = [];
	var ddOutColor;
	var ccFactor;
	var cclong;

	var initColorSelector = function (){
		var ccw = 40;
		var cch = (ccw/4);
		cclong = 256-ccw;
		ccFactor = (255/cclong).toFixed(2);
		var ctx;
		var grd;

		ddOutColor =  doc.createElement( 'div' );//doc.getElementById('finalColor');
		ddOutColor.style.cssText ='position:absolute; margin:0; padding:0; top:0px; right:0; pointer-events:none; width:'+ccw+'px; height:'+ccw+'px;';
		ddOutColor.style.background = 'rgba(0,0,0,0)';

		bigColor.appendChild( ddOutColor );
		bigColor.appendChild( finalPresetButton );
		
		for(var i=0;i!==4; i++){
			ddDiv[i] = doc.createElement( 'div' );
			ddSel[i] = doc.createElement( 'div' );
			ddDiv[i].style.cssText ='position:absolute; margin-top:-2px; padding:0; cursor:w-resize; pointer-events:auto;  height:'+cch+'px;';
			ddSel[i].style.cssText ='position:absolute; pointer-events:none; margin-left:0.5px; width:1px; height:'+cch+'px; background-color:#FFFF00';
			bigColor.appendChild( ddDiv[i] );
			bigColor.appendChild( ddSel[i] );
			ddDiv[i].style.top = i*cch+'px';
			ddSel[i].style.top = i*cch+'px';

			ddcolors[i] = doc.createElement("canvas");
			ddcolors[i].width = cclong;
			ddcolors[i].height = cch;
			ctx = ddcolors[i].getContext("2d");
			grd = ctx.createLinearGradient(0,0,cclong,0);
			grd.addColorStop(0,'rgba(0,0,0,0)');
			if(i==0)grd.addColorStop(1,'rgba(255,0,0,1)');
			if(i==1)grd.addColorStop(1,'rgba(0,255,0,1)');
			if(i==2)grd.addColorStop(1,'rgba(0,0,255,1)');
			if(i==3)grd.addColorStop(1,'rgba(0,0,0,1)');

			ctx.fillStyle = grd;
			ctx.fillRect(0, 0, cclong, cch);

			ddDiv[i].appendChild(ddcolors[i]);
			ddDiv[i].name = i;
			ddDrag[i] = false;

			ddDiv[i].addEventListener( 'mouseout', function(e){ ddDrag[this.name] = false; }, false );
			ddDiv[i].addEventListener( 'mouseup', function(e){ ddDrag[this.name] = false; }, false );
			ddDiv[i].addEventListener( 'mousedown', function(e){ ddDrag[this.name] = true; moveColorSelector(this.name, e.clientX);}, false );
			ddDiv[i].addEventListener( 'mousemove', function(e){ moveColorSelector(this.name, e.clientX); } , false );
		}
	}

	var drawColorSelector = function (){
		var c= GRD.colors;
		var n= currentColor;
		ddOutColor.style.background = 'rgba('+c['r'+n]+','+c['v'+n]+','+c['b'+n]+','+c['a'+n]+')';
		drawSphereGradian();
	}

	var getColorSelector = function (){
		displayColorChoose();
		var c= GRD.colors;
		var n= currentColor;
		setActiveColor();
		ddOutColor.style.background = 'rgba('+c['r'+n]+','+c['v'+n]+','+c['b'+n]+','+c['a'+n]+')';
		for(var i=0;i!==4; i++){
			if(i===0) ddSel[i].style.left = (c['r'+n]/ccFactor).toFixed(0)+'px';
			if(i===1) ddSel[i].style.left = (c['v'+n]/ccFactor).toFixed(0)+'px';
			if(i===2) ddSel[i].style.left = (c['b'+n]/ccFactor).toFixed(0)+'px';
			if(i===3) ddSel[i].style.left = (c['a'+n]*cclong).toFixed(0)+'px';
		}
	}

	var moveColorSelector = function (n, px){
		var rect = ddcolors[n].getBoundingClientRect();
		if( ddDrag[n]){
			ddSel[n].style.left = (px-rect.left)+'px';
			if(currentColor!==-1){
				if(n===0) GRD.colors['r'+currentColor] = ((px-rect.left)*ccFactor).toFixed(0);
				if(n===1) GRD.colors['v'+currentColor] = ((px-rect.left)*ccFactor).toFixed(0);
				if(n===2) GRD.colors['b'+currentColor] = ((px-rect.left)*ccFactor).toFixed(0);
				if(n===3) GRD.colors['a'+currentColor] = ((px-rect.left)/cclong).toFixed(2);
				drawColorSelector();
			}
		}
	}

	var displayColorChoose = function (){
		if(currentColor!==-1){
			bigColor.style.display = 'block';
			bigColor.style.visibility = 'visible';
		} else {
			bigColor.style.display = 'none';
			bigColor.style.visibility = 'hidden';
		}
		
	}


	











	initInterface();











    

	return {

		domElement: container,

		getTexture: function () {
			return texture;
		}
	}

}

var GSVPANO=GSVPANO||{};
GSVPANO.PanoLoader=function(g){var g=g||{},doc=document,d,k,m=new google.maps.StreetViewService,f=0,h=0,a=doc.createElement("canvas"),i=a.getContext("2d");this.setProgress=function(b){if(this.onProgress)this.onProgress(b)};this.throwError=function(b){if(this.onError)this.onError(b);else console.error(b)};this.adaptTextureToZoom=function(){var b=416*Math.pow(2,d),c=416*Math.pow(2,d-1);a.width=b;a.height=c;i.translate(a.width,0);i.scale(-1,1)};this.composeFromTile=function(b,c,j){i.drawImage(j,512*b,512*c);
f++;this.setProgress(Math.round(100*f/h));if(f===h&&(this.canvas=a,this.onPanoramaLoad))this.onPanoramaLoad()};this.composePanorama=function(){this.setProgress(0);console.log("Loading panorama for zoom "+d+"...");var b=Math.pow(2,d),c=Math.pow(2,d-1),j=this,l,a,e;f=0;h=b*c;for(e=0;e<c;e++)for(a=0;a<b;a++)l="http://maps.google.com/cbk?output=tile&panoid="+k+"&zoom="+d+"&x="+a+"&y="+e+"&"+Date.now(),function(b,c){var a=new Image;a.addEventListener("load",function(){j.composeFromTile(b,c,this)});a.crossOrigin=
"";a.src=l}(a,e)};this.load=function(b){console.log("Load for",b);var c=this;m.getPanoramaByLocation(b,50,function(a,d){if(d===google.maps.StreetViewStatus.OK){if(c.onPanoramaData)c.onPanoramaData(a);google.maps.geometry.spherical.computeHeading(b,a.location.latLng);c.copyright=a.copyright;k=a.location.pano;c.location=b;c.composePanorama()}else{if(c.onNoPanoramaData)c.onNoPanoramaData(d);c.throwError("Could not retrieve panorama for the following reason: "+d)}})};this.setZoom=function(a){d=a;this.adaptTextureToZoom()};
this.setZoom(g.zoom||1)};

