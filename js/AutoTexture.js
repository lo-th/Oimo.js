//var canvas = document.createElement("canvas");
//-----------------------------------------------------
//  DICE
//-----------------------------------------------------

function createDiceTexture(n) {
	var diceTexture;
	var canvas = document.createElement("canvas");
	canvas.width = canvas.height = 256;
	var ctx = canvas.getContext("2d");
	ctx.fillStyle = "#EEEEEE";
	ctx.fillRect(0, 0, 256, 256);
	ctx.fillStyle = "#333333";
	ctx.fillRect(230, 0, 26, 256);
	ctx.fillStyle = "#ff3333";
	ctx.fillRect(230, 230, 26, 26);
	if(n==0){
		diceTexture = new THREE.Texture(canvas);
		diceTexture.needsUpdate = true;
    }else {
		ctx.fillStyle = 'rgba(0,0,0,0.4)';
	    ctx.fillRect(0, 0, 256, 256);
	    diceTexture = new THREE.Texture(canvas);
	    diceTexture.needsUpdate = true;
	}
	return diceTexture;
}

//-----------------------------------------------------
//  SNAKE
//-----------------------------------------------------

function createSnakeTexture() {
	var canvas = document.createElement("canvas");
	canvas.width = canvas.height = 256;
	var ctx = canvas.getContext("2d");
	var grd=ctx.createLinearGradient(0,0,0,256);
	grd.addColorStop(0,"#00D73C");
	grd.addColorStop(1,"#006600");
	ctx.fillStyle = grd;
	ctx.fillRect(0, 0, 256, 256);
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
	tx.needsUpdate = true;
	return tx;
}