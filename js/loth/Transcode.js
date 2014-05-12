/**
* Transcode convert png to script
* @author LoTh / http://3dflashlo.wordpress.com/
*/

var Transcode = { REV: 0.1 };
//window.URL = window.URL || self.URL || window.webkitURL;
Transcode.Loader = function(Files, End, Types){
	this.files = [];
	this.num = 0;
	this.end = End;
	this.head = document.getElementsByTagName('head')[0];
	this.ref = [];// get reference script for worker

	if( this.isArray(Files) ) this.files = Files; 
	else this.files[0] = Files;

	this.types = Types || [];
	for(var i=0; i<this.files.length; i++){
		if(this.types[i] == undefined)this.types[i] = 0;
	}

	this.load(this.files[0]);
}

Transcode.Loader.prototype = {
    constructor: Transcode.Loader,
    isArray:function(subj){
    	try { subj && (subj.length = -1); return false; }
	    catch (er) { return true; }
    },
    load:function(file){
    	var xhr = new XMLHttpRequest();
    	var _this = this;
    	xhr.open( 'GET', file, true );
		xhr.responseType = 'blob';
		xhr.onload = function(e) {
			if (this.readyState == 4 ) {
	    		var blob = this.response;
	    		var img = document.createElement('img');
	    		img.onload = function(e) {
	    			var c = document.createElement("canvas"), pix, i, string = "";
	    			c.width = this.width;
	    			c.height = this.height;
	    			c.getContext('2d').drawImage(this, 0, 0);
	    			var d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
	    			for ( i = 0, l=d.length; i<l; i+=4){
						pix = d[i];
						if( pix<96 ) string += String.fromCharCode(pix+32);
					}
					window.URL.revokeObjectURL(img.src);
					// clear canvas
					c = null; delete c;

					// get script name
					var nn = string.indexOf("var");
					var pn = string.indexOf("=");
					var name = string.substring(nn+4,pn);

					//console.log(name)

					if(_this.types[_this.num] == 0){ // direct script 
						var script = document.createElement("script");
						script.type = "text/javascript";
						script.charset = "utf-8";
						script.async = true;
						script.id = name;
						script.textContent = string;
						_this.head.appendChild(script);
					}
					else {// for worker
						var sblob = new Blob([ string ], {type: "text/javascript;charset=UTF-8"} );
						_this.ref[name] = URL.createObjectURL(sblob);
					}

					string = "";

					// load next or end
	    		    if(_this.num == _this.files.length-1)_this.end();
	    		    else {_this.num++; _this.load(_this.files[_this.num]); }


	    		}
	    		img.src = window.URL.createObjectURL(blob);
	    	}
		}
		xhr.send( null );
    }
}