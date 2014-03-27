
var PngSourceLoader  = function (Files, end) {
	var files = [];
	var xhr = [];
	var script = [];

	if( isArray(Files) ) files = Files; 
	else files[0] = Files;

	for(var j = 0, list = files.length; j<list; j++){
		xhr[j] = new XMLHttpRequest();
		xhr[j].open( 'GET', files[j], true );
		xhr[j].responseType = 'blob';
		xhr[j].onload = function(e) {
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

					var nn = string.indexOf("var");
					var pn = string.indexOf("=");
					var name = string.substring(nn+4,pn);
					var n = script.length;
					script[n] = document.createElement("script");
					script[n].type = "text/javascript";
					script[n].id = name;
					//console.log(n, script[n].id);
					script[n].charset = "utf-8";
					script[n].async = true;
					script[n].textContent = string;
					document.getElementsByTagName('head')[0].appendChild(script[n]);

	    		    window.URL.revokeObjectURL(img.src); // Clean up after yourself.
	    		}
	    		img.src = window.URL.createObjectURL(blob);
	    	}
		}
		xhr[j].send( null );
	}

	var test = setInterval(function(){
		if(files.length === script.length){ end(); clearInterval(test); }
	},100);

}

var isArray = function (subj) {
    try {
        subj && (subj.length = -1);
        return false;
    }
    catch (er) {
        return true;
    }
}