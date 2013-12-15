/**
 * @author mrdoob / http://mrdoob.com/
 * @author loth / http://3dflashlo.wordpress.com/
 */

var Stats_loth = function () {

	var startTime = Date.now(), prevTime = startTime;
	var ms = 0, msMin = Infinity, msMax = 0;
	var fps = 0, fpsMin = Infinity, fpsMax = 0;
	var frames = 0, mode = 0;

	var container = document.createElement( 'div' );
	container.id = 'stats';
	var unselect = '-o-user-select:none; -ms-user-select:none; -khtml-user-select:none; -webkit-user-select:none; -moz-user-select: none;'
	
	container.style.cssText =unselect+ 'position:absolute;bottom:10px;right:10px; pointer-events:none;';

	var lofpsColor = 'rgba(255,255,0,0.5)';
	var lofpsColorMin = 'rgba(200,200,0,0.1)';
	var lomsColor = 'rgba(0,255,0,0.2)';
	var lomsColorMax = 'rgba(0,200,0,0.1)';

	
	var size = 2;

	var loDiv = document.createElement( 'div' );
	loDiv.id = 'lo';
	loDiv.style.cssText = 'width:'+32*size+'px;height:'+16*size+'px;padding:0 0 0 0;text-align:left;display:block';
	container.appendChild( loDiv );

	var loGraph = document.createElement( 'canvas' );
	loGraph.width = 32*size;
	loGraph.height = 16*size;
	var ctx = loGraph.getContext("2d");
	ctx.beginPath();
	ctx.arc(16*size, 16*size, 16*size, 0, 2 * Math.PI, false);
	ctx.moveTo(0, 16*size);
	ctx.lineTo(32*size, 16*size);
	ctx.lineWidth = 1;
	ctx.strokeStyle = 'rgba(255,255,255,0.2)';
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(16*size, 16*size, 2*size, 0, 2 * Math.PI, false);
	ctx.lineWidth = 1*size;
	ctx.strokeStyle = lomsColor;
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(16*size, 16*size, 1*size, 0, 2 * Math.PI, false);

	ctx.lineWidth = 2*size;
	ctx.strokeStyle =lofpsColor;
	ctx.stroke();

	loDiv.appendChild( loGraph );

	var txt = document.createElement( 'div' );
	txt.style.cssText = 'top:'+6*size+'px;position:absolute;width:'+32*size+'px;height:'+16*size+'px;padding:0 0 0 0;text-align:center;color:rgba(255,255,255,0.2);font-family:Helvetica,Arial,sans-serif;font-size:9px;';
	loDiv.appendChild(txt);
	txt.textContent = "THREE";

	var needleMsMax = document.createElement( 'div' );
	needleMsMax.id = 'nmsx';
	needleMsMax.style.cssText = 'position:absolute;left:'+16*size+'px; bottom:1px;width:'+1*size+'px;height:'+15*size+'px;transform-origin: 0.5px '+15*size+'px;-webkit-transform-origin:1px '+15*size+'px;-o-transform-origin:1px '+15*size+'px;';
	loDiv.appendChild( needleMsMax );

	var l0 = document.createElement( 'div' );
	l0.style.cssText = 'width:'+1*size+'px;height:'+12*size+'px;background-color:'+lomsColorMax+';';
	needleMsMax.appendChild(l0);

	var needleMs = document.createElement( 'div' );
	needleMs.id = 'nms';
	needleMs.style.cssText = 'position:absolute;left:'+16*size+'px; bottom:1px;width:'+1*size+'px;height:'+15*size+'px;transform-origin: 0.5px '+15*size+'px;-webkit-transform-origin: 1px '+15*size+'px;-o-transform-origin:1px '+15*size+'px;';
	loDiv.appendChild( needleMs );

	var l1 = document.createElement( 'div' );
	l1.style.cssText = 'width:'+1*size+'px;height:'+12*size+'px;background-color:'+lomsColor+';';
	needleMs.appendChild(l1);

	var needleFpsMin = document.createElement( 'div' );
	needleFpsMin.id = 'nfpsm';
	needleFpsMin.style.cssText = 'position:absolute;left:'+16*size+'px; bottom:1px;width:'+1*size+'px;height:'+15*size+'px;background-color:'+lofpsColorMin+';transform-origin:1px '+15*size+'px;-webkit-transform-origin:1px '+15*size+'px;-o-transform-origin: 1px '+15*size+'px%;';
	loDiv.appendChild(needleFpsMin);

	var needleFps = document.createElement( 'div' );
	needleFps.id = 'nfps';
	needleFps.style.cssText = 'position:absolute;left:'+16*size+'px; bottom:1px;width:'+1*size+'px;height:'+15*size+'px;background-color:'+lofpsColor+';transform-origin:1px '+15*size+'px;-webkit-transform-origin:1px '+15*size+'px;-o-transform-origin: 1px '+15*size+'px%;';
	loDiv.appendChild(needleFps);



	var rotate = function ( dom, value ) {
		if(value>90)value = 90;
		if(value<-90)value = -90;
		dom.style.webkitTransform = 'rotate('+value+'deg)';
		dom.style.oTransform = 'rotate('+value+'deg)';
		dom.style.transform = 'rotate('+value+'deg)';
	}

	return {

		//REVISION: 11,

		domElement: container,

		//setMode: setMode,

		begin: function () {

			startTime = Date.now();

		},

		end: function () {

			var time = Date.now();

			ms = time - startTime;
			//msMin = Math.min( msMin, ms );
			msMax = Math.max( msMax, ms );

			rotate(needleMs, (ms*3)-90);
			rotate(needleMsMax, (msMax*3)-90);

			frames ++;

			if ( time > prevTime + 1000 ) {

				fps = Math.round( ( frames * 1000 ) / ( time - prevTime ) );

				fpsMin = Math.min( fpsMin, fps );
				//fpsMax = Math.max( fpsMax, fps );

				rotate(needleFps, (fps*3)-90);
				rotate(needleFpsMin, (fpsMin*3)-90);
				/*if(mode===0){}
				else{
					fpsText.textContent = fps + ' FPS (' + fpsMin + '-' + fpsMax + ')';
					updateGraph( fpsGraph, Math.min( 30, 30 - ( fps / 100 ) * 30 ) );
				}*/
				prevTime = time;
				frames = 0;

			}

			return time;

		},

		update: function () {

			startTime = this.end();

		},

		rename: function (name) {

			txt.textContent = name;

		}

	}

};
