'use strict';

var cc0 = ['#00a78d', '#35c9dc','#aa5edf','#df5ebb','#dc5135','#eda124','#f0d927', '#1a1a1a'];
var cc1 = ['#00937c', '#2fb4c9','#9653cc','#cc53a6','#c9472f','#de8e20','#e3c522', '#171717'];
var cc2 = ['#007461', '#2492a6','#7640aa','#aa4084','#a63824','#c07019','#c5a21a', '#121212'];
var cc3 = ['#007461', '#208499','#6a389d','#9d3877','#993020','#b46316','#ba9518', '#101010'];

var doc = document;
    
function basicTexture(n){
    var canvas = doc.createElement( 'canvas' );
    canvas.width = canvas.height = 64;
    var ctx = canvas.getContext( '2d' );
   

    var colors = [];
    if(n===0){ // sphere
        colors[0] = cc0[1];
        colors[1] = cc1[1];
    }
    if(n===1){ // sphere sleep
        colors[0] = cc2[1];
        colors[1] = cc3[1];
    }
    if(n===2){ // box
        colors[0] = cc0[4];
        colors[1] = cc1[4];
    }
    if(n===3){ // box sleep
        colors[0] = cc2[4];
        colors[1] = cc3[4];
    }
    if(n===4){ // cyl sleep
        colors[0] = cc0[0];
        colors[1] = cc1[0];
    }
    if(n===5){ // cyl sleep
        colors[0] = cc2[0];
        colors[1] = cc3[0];
    }
    if(n===6){ // col sleep
        colors[0] = cc1[6];
        colors[1] = cc1[6];
    }
    if(n===7){ // col sleep
        colors[0] = cc2[6];
        colors[1] = cc2[6];
    }
    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, 64, 64);
    ctx.fillStyle = colors[1];
    ctx.fillRect(0, 0, 32, 32);
    ctx.fillRect(32, 32, 32, 32);

    var tx = new THREE.Texture(canvas);
    tx.needsUpdate = true;
    return tx;
}

function nullTexture(){
    var canvas = doc.createElement( 'canvas' );
    canvas.width = canvas.height = 64;
    var ctx = canvas.getContext( '2d' );
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, 64, 64);

    var tx = new THREE.Texture(canvas);
    tx.needsUpdate = true;
    return tx;
}
//-----------------------------------------------------
//  DICE
//-----------------------------------------------------

function createDiceTexture(n) {
	var canvas = doc.createElement("canvas");
	canvas.width = canvas.height = 256;
	var ctx = canvas.getContext("2d");
	if(n===0){
		ctx.fillStyle = "#FDF8E4";
		ctx.fillRect(0, 0, 256, 256);
		ctx.fillStyle = "#191919";
		ctx.fillRect(174, 0, 82, 256);
		ctx.fillStyle = "#ff1919";
		ctx.fillRect(174, 206, 82, 50);
	} else{
		ctx.fillStyle = "#191919";
		ctx.fillRect(0, 0, 256, 256);
		ctx.fillStyle = "#FDF8E4";
		ctx.fillRect(174, 0, 82, 256);
		ctx.fillStyle = "#FDFDE4";
		ctx.fillRect(174, 206, 82, 50);
	}
	/*if(n!==0){
		ctx.fillStyle = 'rgba(0,0,0,0.4)';
	    ctx.fillRect(0, 0, 256, 256);
	}*/
	var tx = new THREE.Texture(canvas);
	tx.anisotropy = TE.getAnistropy;
	tx.needsUpdate = true;
	return tx;
}

//-----------------------------------------------------
//  GYRO
//-----------------------------------------------------

function createGyroTexture() {
	var canvas = doc.createElement("canvas");
	canvas.width = canvas.height = 512;
	var ctx = canvas.getContext("2d");
	
	ctx.fillStyle = "#808080";
	ctx.fillRect(0, 0, 512, 512);
	ctx.fillStyle = "#A17E02";
	ctx.fillRect(0, 486, 512, 26);
	ctx.fillRect(279, 0, 233, 87);
	ctx.beginPath();
	ctx.arc(140,281,78,0,2*Math.PI);
	ctx.arc(372,281,78,0,2*Math.PI);
	ctx.fill();
	
	var tx = new THREE.Texture(canvas);
	tx.anisotropy = TE.getAnistropy;
	tx.needsUpdate = true;
	return tx;
}

//-----------------------------------------------------
//  WHEEL
//-----------------------------------------------------

function createWheelTexture(n) {
	var canvas = doc.createElement("canvas");
	canvas.width = canvas.height = 256;
	var ctx = canvas.getContext("2d");
	
	ctx.fillStyle = "#EEEEEE";
	ctx.fillRect(0, 0, 256, 256);
	var grd;
	
	grd=ctx.createLinearGradient(0,100,0,163);
	grd.addColorStop(0,"#EEEEEE");
	grd.addColorStop(0.2,"#AAAAAA");
	grd.addColorStop(0.8,"#AAAAAA");
	grd.addColorStop(1,"#EEEEEE");
	ctx.fillStyle = grd;
	ctx.fillRect(0, 100, 256, 163);

    grd=ctx.createLinearGradient(0,163,0,256);
	grd.addColorStop(0,"#222222");
	grd.addColorStop(0.2,"#555555");
	grd.addColorStop(0.8,"#555555");
	grd.addColorStop(1,"#222222");
	ctx.fillStyle = grd;
	ctx.fillRect(0, 163, 256, 256);

	var tx = new THREE.Texture(canvas);
	tx.anisotropy = TE.getAnistropy;
	tx.needsUpdate = true;
	return tx;
}

//-----------------------------------------------------
//  SNAKE
//-----------------------------------------------------

function createSnakeTexture() {
	var canvas = doc.createElement("canvas");
	canvas.width = canvas.height = 256;
	var ctx = canvas.getContext("2d");
	var grd=ctx.createLinearGradient(0,0,0,256);
	grd.addColorStop(0,"#794947");
	grd.addColorStop(0.3,"#9E624A");
	grd.addColorStop(0.6,"#BD8F78");
	grd.addColorStop(1,"#D3AE91");
	ctx.fillStyle = grd;
	ctx.fillRect(0, 0, 256, 256);
	ctx.fillStyle ="#9E624A";
	for(var i=0;i<38;++i){
		ctx.fillRect(0, i*6, 256, 1);
	}
	//eye
	grd=ctx.createRadialGradient(231,230,10,231,230,50);
	grd.addColorStop(0,"white");
	grd.addColorStop(1,"red");
	ctx.fillStyle=grd;
	ctx.fillRect(206, 204, 50, 52);
	grd=ctx.createRadialGradient(231,178,10,231,178,50);
	grd.addColorStop(0,"white");
	grd.addColorStop(1,"red");
	ctx.fillStyle=grd;
	ctx.fillRect(206, 152, 50, 52);
	//iris
	ctx.beginPath();
	ctx.arc(231,230,3,0,2*Math.PI);
	ctx.arc(231,178,3,0,2*Math.PI);
	ctx.fillStyle = "#010101";
	ctx.fill();

	var tx = new THREE.Texture(canvas);
	tx.anisotropy = TE.getAnistropy;
	tx.needsUpdate = true;
	return tx;
}

//-----------------------------------------------------
//  BONES FLAG
//-----------------------------------------------------

function bonesFlag(text) {
	var canvas = doc.createElement("canvas");
	canvas.width = 64; canvas.height = 64;
	var ctx = canvas.getContext("2d");

	ctx.font = 'bold '+30+'pt Monospace';
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillStyle = "#AAAAAA";
	ctx.fillText(text, canvas.width*0.5, canvas.height*0.5);

	var tx = new THREE.Texture(canvas);
	//tx.anisotropy = MaxAnistropy;
	tx.needsUpdate = true;
	return tx;
}

//-----------------------------------------------------
//  8 BALL
//-----------------------------------------------------

function eightBall(n) {
	var canvas = doc.createElement("canvas");
	canvas.width = 256; canvas.height = 128;
	var ctx = canvas.getContext("2d");

	ctx.fillStyle = "#FDF8E4";
	ctx.fillRect(0, 0, 256, 128);

	if(n===1 || n===9) ctx.fillStyle = "#EDCC42";
	if(n===2 || n===10) ctx.fillStyle = "#CA2230";
	if(n===3 || n===11) ctx.fillStyle = "#304067";
	if(n===4 || n===12) ctx.fillStyle = "#68305B";
	if(n===5 || n===13) ctx.fillStyle = "#DD7A34";
	if(n===6 || n===14) ctx.fillStyle = "#2B6A49";
	if(n===7 || n===15) ctx.fillStyle = "#AE252F";
	if(n===8) ctx.fillStyle = "#111111";

    // line or full
    if (n<9) ctx.fillRect(0,0,256,128);
    else ctx.fillRect(0,32,256,64)

    // number
	if(n!==0){
		ctx.beginPath();
		ctx.arc(64,64,20,0,2*Math.PI);
		ctx.fillStyle = "#FDF8E4";
		ctx.fill();


		ctx.font = 20+'pt Arial';
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillStyle = "#111111";
		ctx.fillText(n, canvas.width*0.5*0.5, canvas.height*0.5);
	}

	var tx = new THREE.Texture(canvas);
	tx.anisotropy = TE.getAnistropy;
	tx.needsUpdate = true;
	return tx;
}

//-----------------------------------------------------
//  8 BALL
//-----------------------------------------------------

function createDroidTexture() {
	var canvas = doc.createElement("canvas");
	canvas.width = 512; canvas.height = 512;
	var ctx = canvas.getContext("2d");
	ctx.fillStyle = "#a2c239";
	ctx.fillRect(0, 0, 512, 512);

	//iris
	ctx.beginPath();
	ctx.arc(161,96,30,0,2*Math.PI);
	ctx.arc(351,96,30,0,2*Math.PI);
	ctx.fillStyle = "#EEEEEE";
	ctx.fill();

	var tx = new THREE.Texture(canvas);
	tx.anisotropy = TE.getAnistropy;
	tx.needsUpdate = true;
	return tx;
}