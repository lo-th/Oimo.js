var PNGtoSCRIPT = { REV: 0.1 };

PNGtoSCRIPT.Loader = function(Files, end){
	this.files = [];
	this.script = [];
	this.end = end;
	this.head = document.getElementsByTagName('head')[0];

	if( this.isArray(Files) ) this.files = Files; 
	else this.files[0] = Files;

	this.load(this.files[0]);
}

PNGtoSCRIPT.Loader.prototype = {
    constructor: PNGtoSCRIPT.Loader,
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
					self.URL.revokeObjectURL(img.src);

					var nn = string.indexOf("var");
					var pn = string.indexOf("=");
					var name = string.substring(nn+4,pn);
					var n = _this.script.length;
					var script = document.createElement("script");
					script.type = "text/javascript";
					script.charset = "utf-8";
					script.async = true;
					script.id = name;
					script.textContent = string;
					_this.head.appendChild(script);

					var n = _this.script.length;
					_this.script[n] = script;

	    		    if(_this.script.length == _this.files.length)_this.end();
	    		    else _this.load(_this.files[n+1]);
	    		}
	    		img.src = self.URL.createObjectURL(blob);
	    	}
		}
		xhr.send( null );
    }
}