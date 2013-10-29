
//-----------------------------------------------------
//  DICE
//-----------------------------------------------------

function createDiceTexture(n) {
	var canvas = document.createElement("canvas");
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
	tx.anisotropy = MaxAnistropy;
	tx.needsUpdate = true;
	return tx;
}

//-----------------------------------------------------
//  WHEEL
//-----------------------------------------------------

function createWheelTexture(n) {
	var canvas = document.createElement("canvas");
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
	tx.anisotropy = MaxAnistropy;
	tx.needsUpdate = true;
	return tx;
}

//-----------------------------------------------------
//  SNAKE
//-----------------------------------------------------

function createSnakeTexture() {
	var canvas = document.createElement("canvas");
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
	tx.anisotropy = MaxAnistropy;
	tx.needsUpdate = true;
	return tx;
}

//-----------------------------------------------------
//  BONES FLAG
//-----------------------------------------------------

function bonesFlag(text) {
	var canvas = document.createElement("canvas");
	canvas.width = 64; canvas.height = 64;
	ctx = canvas.getContext("2d");

	ctx.font = 'bold '+30+'pt Monospace';
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillStyle = "#AAAAAA";
	ctx.fillText(text, canvas.width*0.5, canvas.height*0.5);

	var tx = new THREE.Texture(canvas);
	tx.anisotropy = MaxAnistropy;
	tx.needsUpdate = true;
	return tx;
}

//-----------------------------------------------------
//  8 BALL
//-----------------------------------------------------

function eightBall(n) {
	var canvas = document.createElement("canvas");
	canvas.width = 256; canvas.height = 128;
	ctx = canvas.getContext("2d");

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
	tx.anisotropy = MaxAnistropy;
	tx.needsUpdate = true;
	return tx;
}