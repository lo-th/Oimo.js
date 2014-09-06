'use strict';
var UI = {};

UI.Slide = function(target, name, endFunction, value, set ,max){
	this.colors = ['rgba(220,220,220,1)', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.6)', 'rgba(200,200,200,0.6)', 'rgba(200,200,200,1)'];
	this.radius = "-moz-border-radius: 16px; -webkit-border-radius: 16px; border-radius: 16px;";
	this.max = max || 100;
	this.set = set || [20,100, 180, 20];
	this.endFunction = endFunction || null; 
	this.w = this.set[2]-10;
	this.add(target, name, value);
};

UI.Slide.prototype = {
    constructor: UI.Slide,
	add:function(target, name, value){
	    var _this = this;
	    var name = name || "slider";
	    var value = value || 0;
	    var txt = document.createElement( 'div' );
	    var bg = document.createElement( 'div' );
	    var sel = document.createElement( 'div' );
	    bg.style.cssText = this.radius+'position:absolute; left:'+this.set[0]+'px; top:'+this.set[1]+'px; padding:0; cursor:w-resize; pointer-events:auto; width:'+this.set[2]+'px; height:'+this.set[3]+'px; background-color:'+ this.colors[1]+';';
	    txt.style.cssText ='position:absolute; left:0px; top:-18px; pointer-events:none; width:'+this.set[2]+'px; height:20px; font-size:12px; color:'+this.colors[0]+'; text-align:center;';
	    sel.style.cssText = this.radius+'position:absolute; pointer-events:none; margin:5px; width:100px; height:10px; background-color:'+this.colors[3]+';';
	    
	    bg.appendChild( sel );
	    bg.appendChild( txt );
	    bg.name = name;
	    bg.id = name;

	    target.appendChild( bg );

	    txt.innerHTML = name+" : "+value+'%';
	    
	    sel.style.width = this.w*(value/this.max)+'px';
	    bg.className = "up";

	    bg.addEventListener( 'mouseout',  function(e){ e.preventDefault(); this.className = "up"; this.style.backgroundColor = _this.colors[1]; this.childNodes[0].style.backgroundColor = _this.colors[3]; }, false );
	    bg.addEventListener( 'mouseover', function(e){ e.preventDefault(); this.style.backgroundColor = _this.colors[2]; this.childNodes[0].style.backgroundColor = _this.colors[4];}, false );
	    bg.addEventListener( 'mouseup',   function(e){ e.preventDefault(); this.className = "up"; }, false );
	    bg.addEventListener( 'mousedown', function(e){ e.preventDefault(); this.className = "down"; _this.drag(this, e.clientX); }, false );
	    bg.addEventListener( 'mousemove', function(e){ e.preventDefault(); _this.drag(this, e.clientX); } , false );
	},

	setValue:function(value){
	    var children = this.childNodes;
	    children[0].style.width = this.w *(value/this.max)+'px';
	    children[1].innerHTML = name+" "+value+'%';
	},

	drag:function(t, x){
	    if(t.className == "down"){
	        var children = t.childNodes;
	        var rect = t.getBoundingClientRect();
	        var value = Math.round(((x-rect.left)/this.w)*this.max);
	        if(value<0) value = 0;
	        if(value>this.max) value = this.max;
	        children[0].style.width = this.w*(value/this.max)+'px';
	        children[1].innerHTML = t.name+" "+value+'%';

	        if(this.endFunction!==null)this.endFunction(value);

	        /*switch(t.name){
	            case 'Taxe': children[1].innerHTML = t.name+" "+value+'%'; this.taxRate = value; break;
	            case 'Roads': children[1].innerHTML = t.name+" "+value+'% of '+this.roadFund+"$ = " + Math.floor(this.roadFund * (value / 100))+"$"; this.roadRate = value; break;
	            case 'Fire': children[1].innerHTML = t.name+" "+value+'% of '+this.fireFund+"$ = " + Math.floor(this.fireFund * (value / 100))+"$"; this.fireRate = value; break;
	            case 'Police': children[1].innerHTML = t.name+" "+value+'% of '+this.policeFund+"$ = " + Math.floor(this.policeFund * (value / 100))+"$"; this.policeRate = value; break;
	        }*/
	    }
	}
};