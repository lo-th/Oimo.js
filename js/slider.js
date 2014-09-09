'use strict';
var UI = {};

UI.Slide = function(target, name, endFunction, value, set , max, min, type, num){
	this.colors = ['rgba(220,220,220,1)', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.6)', 'rgba(200,200,200,0.6)', 'rgba(200,200,200,1)'];
	this.radius = "-moz-border-radius: 16px; -webkit-border-radius: 16px; border-radius: 16px;";
	this.num = num || 0;
	this.min = min || 0;
	this.max = max || 100;
	this.name = name || "slider";
	this.type = type || '%';
	this.valueRange = this.max - this.min;
	this.set = set || [20,100,180,20];
	this.endFunction = endFunction || null; 
	this.w = this.set[2]-10;
	this.value = value || 0;
	this.add(target);
};

UI.Slide.prototype = {
    constructor: UI.Slide,
	add:function(target, name){
	    var _this = this;
	    var txt = document.createElement( 'div' );
	    var bg = document.createElement( 'div' );
	    var sel = document.createElement( 'div' );
	    bg.style.cssText = this.radius+'position:absolute; left:'+this.set[0]+'px; top:'+this.set[1]+'px; padding:0; cursor:w-resize; pointer-events:auto; width:'+this.set[2]+'px; height:'+this.set[3]+'px; background-color:'+ this.colors[1]+';';
	    txt.style.cssText ='position:absolute; left:0px; top:-18px; pointer-events:none; width:'+this.set[2]+'px; height:20px; font-size:12px; color:'+this.colors[0]+'; text-align:center;';
	    sel.style.cssText = this.radius+'position:absolute; pointer-events:none; margin:5px; width:100px; height:10px; background-color:'+this.colors[3]+';';
	    
	    bg.appendChild( sel );
	    bg.appendChild( txt );
	    bg.name = this.name;
	    bg.id = this.name;

	    target.appendChild( bg );
	    bg.className = "up";
	    bg.addEventListener( 'mouseout',  function(e){ e.preventDefault(); this.className = "up"; this.style.backgroundColor = _this.colors[1]; this.childNodes[0].style.backgroundColor = _this.colors[3]; }, false );
	    bg.addEventListener( 'mouseover', function(e){ e.preventDefault(); this.style.backgroundColor = _this.colors[2]; this.childNodes[0].style.backgroundColor = _this.colors[4];}, false );
	    bg.addEventListener( 'mouseup',   function(e){ e.preventDefault(); this.className = "up"; }, false );
	    bg.addEventListener( 'mousedown', function(e){ e.preventDefault(); this.className = "down"; _this.drag(this, e.clientX); }, false );
	    bg.addEventListener( 'mousemove', function(e){ e.preventDefault(); _this.drag(this, e.clientX); } , false );

	    this.sel = sel;
	    this.txt = txt;
	    this.updatePosition();
	},

	updatePosition:function(){
	    this.sel.style.width = (this.w * ((this.value-this.min)/this.valueRange))+'px';
	    this.txt.innerHTML = this.name+" "+this.value+this.type;
	},

	drag:function(t, x){
	    if(t.className == "down"){
	        var rect = t.getBoundingClientRect();
	        this.value = ((((x-rect.left)/this.w)*this.valueRange+this.min).toFixed(this.num))/1;
	        if(this.value<this.min) this.value = this.min;
	        if(this.value>this.max) this.value = this.max;
	        this.updatePosition();
	        if(this.endFunction!==null)this.endFunction(this.value);
	    }
	}
};