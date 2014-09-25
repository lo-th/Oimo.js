
V3D.Minimap = function(){
	this.ar8 = typeof Uint8Array!="undefined"?Uint8Array:Array;
	this.miniSize = { w:64, h:64, f:0.25 };
    this.cc = {r:255, g:0, b:0, a:255};   

	this.miniGlCanvas = document.createElement('canvas'); 
	this.miniTop = document.createElement('canvas');
	this.mapTest = document.createElement('canvas');

	this.miniGlCanvas.width = this.miniTop.width = this.miniSize.w;
	this.miniGlCanvas.height = this.miniTop.height = this.miniSize.h;
	this.mapTest.width = 16;
	this.mapTest.height = 16;

	this.miniGlCanvas.style.cssText = 'position:absolute; bottom:10px; left:10px;';
	this.miniTop.style.cssText = 'position:absolute; bottom:10px; left:10px;';
	this.mapTest.style.cssText = 'position:absolute; bottom:32px; left:32px;';

	var body = document.body;

	body.appendChild( this.miniGlCanvas );
	body.appendChild( this.miniTop );
	body.appendChild( this.mapTest );

	this.posY = 0;

	this.init();
};

V3D.Minimap.prototype = {
    constructor: V3D.Minimap,
    init:function() {
	    this.setMapTestSize(8);
		this.renderer = new THREE.WebGLRenderer({ canvas:this.miniGlCanvas, precision: "lowp", antialias: false});
		this.renderer.setSize( this.miniSize.w, this.miniSize.h, true );
		//this.renderer.sortObjects = false;
		//this.renderer.sortElements = false;
		this.renderer.setClearColor( 0xff0000, 1 );
		this.scene = new THREE.Scene();
	    var w = 3;//6;// 500*this.miniSize.f;
	    this.camera = new THREE.OrthographicCamera( -w , w , w , -w , 0.1, 400 );
	    this.camera.position.x = 0;
	    this.camera.position.z = 0;
	    this.camera.position.y = 100;//(200)*this.miniSize.f;
	    this.camera.lookAt( new THREE.Vector3(0,0,0) );

	    this.player = new THREE.Object3D();
	    this.player.position.set(0,0,0);
	    this.scene.add(this.player);
	    this.player.add(this.camera);
	    
	    this.gl = this.renderer.getContext();
	    
	    this.initTopMap();
    },

    updatePosition:function(x,y,z){
    	this.player.position.x = x;
	    this.player.position.z = z;
		this.player.rotation.y = y;
    },

    // ------- GRAD TEXTURES

    createHeightGradMaterial:function(color) {
		var c = document.createElement("canvas");
		var ct = c.getContext("2d");
		c.width = 16; c.height = 256;
		var gradient = ct.createLinearGradient(0,0,0,256);
		var i = color[0].length;
		while(i--){ gradient.addColorStop(color[0][i],color[1][i]); }
		ct.fillStyle = gradient;
		ct.fillRect(0,0,16,256);
		var texture = new THREE.Texture(c);
		texture.needsUpdate = true;
		return texture;
	},

	// ------- MAP 2D

	drawMap:function(){
		this.renderer.render( this.scene, this.camera );
		this.gl.readPixels(this.zsize[0], this.zsize[1], this.zsize[2], this.zsize[2], this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.zone);

		// collision
		var i = 9;
        while(i--){ this.lock[i] = this.colorTest(this.pp[i]); }

		// height
		this.posY = this.zone[this.pp[8]+1]/10;
		this.player.position.y = this.posY;


		if(this.ctxTest) this.drawMapTest();
        
	},

	colorTest:function(n){
		var b=0, z=this.zone, c=this.cc;
        if(z[n]==c.r && z[n+1]==c.g && z[n+2]==c.b && z[n+3]==c.a) b = 1;
        return b;
	},
	heightTest:function(n){
		return this.zone[n] || 0;
	},

	setMapTestSize:function(s){
	    //this.zsize = [(this.miniSize.w*0.5)-s, (this.miniSize.h*0.5)-s, s*2];
	    this.zsize = [(this.miniSize.w*0.5)+s, (this.miniSize.h*0.5)+s, s*2];
		this.lock =  [0,0,0,0, 0,0,0,0];
		var max =((s*2)*(s*2))*4;
		console.log(this.zsize)
        //[          front,  back,  left,        right,                fl,   fr,     bl,  br,       middle];
        //             0       1      2             3                  4     5       6    7         8
        this.pp = [max-(s*4), s*4, max*0.5, max*0.5 + (((s*4)*2)-4), 211*4, 222*4, 34*4, 45*4,  max*0.5+(s*4)];//+ (s*4)];
        this.zone = new this.ar8(max);
	},

	initTopMap:function(){
	    var ctx3 = this.miniTop.getContext("2d");
	    ctx3.fillStyle = 'black';
	    ctx3.fillRect(0, 0, 1, this.miniSize.h);
	    ctx3.fillRect(this.miniSize.w-1, 0, 1, this.miniSize.h);
	    ctx3.fillRect(1, 0, this.miniSize.w-2, 1);
	    ctx3.fillRect(1,this.miniSize.h-1, this.miniSize.w-2, 1);
	    ctx3.save();
		ctx3.translate((this.miniSize.w*0.5), (this.miniSize.h*0.5));
		this.drawPlayer(ctx3);
		ctx3.restore();

	    this.ctxTest = this.mapTest.getContext("2d");
	},

	drawMapTest:function() {
		this.ctxTest.clearRect ( 0 , 0 , 16 , 16 );
		var id = this.ctxTest.createImageData(16,16);
		var d  = id.data;
		var i = 7;
		while(i--)d[i] = 0;

	    if(this.lock[1]) this.dp(d, this.pp[0]);
	    if(this.lock[0]) this.dp(d, this.pp[1]);
	    if(this.lock[2]) this.dp(d, this.pp[2]);
	    if(this.lock[3]) this.dp(d, this.pp[3]);

	    if(this.lock[6]) this.dp(d, this.pp[4]);
	    if(this.lock[7]) this.dp(d, this.pp[5]);
	    if(this.lock[4]) this.dp(d, this.pp[6]);
	    if(this.lock[5]) this.dp(d, this.pp[7]);
		this.ctxTest.putImageData( id, 0, 0);
	},

	dp:function(d, p) {
		d[p] = 255;
		d[p+1] = 255;
		d[p+3] = 255;
	},

	drawPlayer:function(ctx) {
	    ctx.fillStyle = "rgba(255,255,200,0.2)";
	    ctx.globalAlpha = 1.0;
	    ctx.beginPath();
	    ctx.moveTo(0, 0);
	    ctx.lineTo(30, -30);
		ctx.lineTo(-30, -30);
	    ctx.closePath();
	    ctx.fill();
	    ctx.fillStyle = "rgba(200,200,100,1)";
	    ctx.fillRect(-2, -2, 4, 4);
	}

};
