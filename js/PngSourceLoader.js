
var PngSourceLoader  = function (file, end) {
	var xhr = new XMLHttpRequest();
	xhr.open( 'GET', file, true );
	xhr.responseType = 'blob';
	xhr.onload = function(e) {
		if (this.readyState == 4 ) {
    		var blob = this.response;
    		var img = document.createElement('img');
    		img.onload = function(e) {
    			var c=document.createElement("canvas"), pix, i, string = "";
    			c.width = this.width;
    			c.height = this.height;
    			c.getContext('2d').drawImage(this, 0, 0);
    			var d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
    			for ( i = 0, l=d.length; i<l; i+=4){
					pix = d[i];
					if( pix<96 ) string += String.fromCharCode(pix+32);
				}

				var nn = string.indexOf("var");
				var pn = string.indexOf("=");
				var name = string.substring(nn+4,pn);
				var sc = document.createElement("script");
				sc.type = "text/javascript";
				sc.id = name;
				sc.charset = "utf-8";
				sc.async = true;
				sc.textContent = string;
				document.getElementsByTagName('head')[0].appendChild(sc);

				end();

    		    window.URL.revokeObjectURL(img.src); // Clean up after yourself.
    		}
    		img.src = window.URL.createObjectURL(blob);
    	}
	}
	xhr.send( null );
}