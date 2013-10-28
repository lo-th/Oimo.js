
//-----------------------------------------------------
//  DICE
//-----------------------------------------------------

function createDiceTexture(n) {
	var canvas = document.createElement("canvas");
	canvas.width = canvas.height = 256;
	var ctx = canvas.getContext("2d");
	ctx.fillStyle = "#EEEEEE";
	ctx.fillRect(0, 0, 256, 256);
	ctx.fillStyle = "#333333";
	ctx.fillRect(174, 0, 82, 256);
	ctx.fillStyle = "#ff3333";
	ctx.fillRect(174, 206, 82, 50);
	if(n!==0){
		ctx.fillStyle = 'rgba(0,0,0,0.4)';
	    ctx.fillRect(0, 0, 256, 256);
	}
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