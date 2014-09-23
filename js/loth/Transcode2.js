var Transcode = { REV: 0.2 };

Transcode.Load = function(file, endFunction, root){
	this.result = null;
	this.endFunction = endFunction;
	this.root = root || null;
	var _this = this;
	if(file === file + ''){
		var xhr = new XMLHttpRequest();
		xhr.open( 'GET', file, true );
		xhr.responseType = 'blob';
		xhr.onload = function(e) {
			if (this.readyState == 4 ) {
	    		var blob = this.response;
	    		var img = document.createElement('img');
	    		img.onload = function(e) {
	    			_this.canvas3d(img);
	    		}
	    		img.src = window.URL.createObjectURL(blob);
	    	}
		}
		xhr.send( null );
	} else {
		this.canvas3d(file);
	}
}

Transcode.Load.prototype = {
    constructor: Transcode.Load,
    canvas3d : function (image) {
		var w = image.width;
	    var h = image.height;
	    // Get A WebGL context
	    var c = document.createElement("canvas");
	    c.width = w;
	    c.height = h;

	    var names = ["webgl", "experimental-webgl"];
	    var gl = null;
	    for (var ii = 0; ii < names.length; ++ii) {
	    	try { gl = c.getContext(names[ii]); } catch(e) {}
	        if (gl) break;
	    }
	    if (!gl) this.canvas2d(image);
	    var fs = gl.createShader(gl.FRAGMENT_SHADER);
	    gl.shaderSource(fs, Transcode.bitmapShader.fs);
	    gl.compileShader(fs);
	    var vs = gl.createShader(gl.VERTEX_SHADER);
	    gl.shaderSource(vs, Transcode.bitmapShader.vs);
	    gl.compileShader(vs);
	    var program = gl.createProgram();
	    gl.attachShader(program, vs);
	    gl.attachShader(program, fs);
	    gl.linkProgram(program);
	    var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (!linked)console.error(shader.name, 'Error linking the shader: ' + gl.getProgramInfoLog(program));
	    gl.useProgram(program);
	    var positionLocation = gl.getAttribLocation(program, "a_position");
	    var texCoordLocation = gl.getAttribLocation(program, "a_texCoord");
	    var texCoordBuffer = gl.createBuffer();
	    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
	    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0.0,0.0,1.0,0.0,0.0,1.0,0.0,1.0,1.0,0.0,1.0,1.0]), gl.STATIC_DRAW);
	    gl.enableVertexAttribArray(texCoordLocation);
	    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);
	    var texture = gl.createTexture();
	    gl.bindTexture(gl.TEXTURE_2D, texture);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	    var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
	    gl.uniform2f(resolutionLocation, w, h);
	    var buffer = gl.createBuffer();
	    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	    gl.enableVertexAttribArray(positionLocation);
	    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
	    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0,h,w,h,0,0,0,0,w,h,w,0]), gl.STATIC_DRAW);
	    gl.drawArrays(gl.TRIANGLES, 0, 6);

	    var data = new Uint8Array(w*h*4);
	    gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, data);
	    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
	    gl = null;
	    
	    this.decodeData(data);
	},
	canvas2d : function (image){
		var c = document.createElement("canvas");
	    c.width = image.width;
	    c.height = image.height;
	    c.getContext('2d').drawImage(image, 0, 0);
	    var data = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;

	    this.decodeData(data);
	},
	pngMethode : function (url){ 
		// need libs/png.min.js
	    // work but with uncompressed png
	    // not use script_png
		/*
		PNG.load('three.png', function(pixels) {
		    var pi = pixels.decode();
		    var pix, string ="";
		    for(var i = 0, l = pi.length; i < l; i+=4) {
		        pix = pi[i+1]+32;
		        if(pix===127) pix = 10;
		        if(pix && pix<127 )string += String.fromCharCode(pix);
		    }
		    //document.getElementById('input').innerHTML = st.join("\n");
		    //document.getElementById('input').innerHTML = string;
		    editor.setValue(string);
		})*/
	},
	decodeData : function (data){
	    var color = 0;
	    if(data[1]!==0)color=1;
	    if(data[2]!==0)color=2;
		var pix, string = "";
		for ( var i = 0, l = data.length; i<l; i+=4){
	        pix = data[i+color]+32;
	        if(pix===127) pix = 10;
	        if(pix && pix<127 ) string += String.fromCharCode(pix);
	    }
	    this.result = string;
	    this.endFunction(string, this.root);
	}
}

// SHADER

Transcode.bitmapShader = {
	name:'bitmapShader',
    fs:[
        'precision mediump float;',
        'uniform sampler2D u_image;',
        'varying vec2 v_texCoord;',
        'void main() { gl_FragColor = texture2D(u_image, v_texCoord); }'
    ].join("\n"),
    vs:[
        'attribute vec2 a_position;',
        'attribute vec2 a_texCoord;',
        'uniform vec2 u_resolution;',
        'varying vec2 v_texCoord;',
        'void main() {',
            'vec2 zeroToOne = a_position / u_resolution;',
            'vec2 zeroToTwo = zeroToOne * 2.0;',
            'vec2 clipSpace = zeroToTwo - 1.0;',
            'gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);',
            'v_texCoord = a_texCoord;',
        '}'
    ].join("\n")
}