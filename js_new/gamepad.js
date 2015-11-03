"use strict";

var Gamepad = function(){
    //this.info = {};
    this.values = [];
}

Gamepad.prototype = {
    update:function(){
        var i,j,k,l, pad;
        var info = '';
        var fix = this.fix;
        var gamepads = navigator.getGamepads();
        for (i = 0; i < gamepads.length; i++) {
            pad = gamepads[i];
            if(pad){
                k = pad.axes.length;
                l = pad.buttons.length;
                if(l){
                    if(!this.values[i]) this.values[i] = [];
                    // axe
                    for (j = 0; j < k; j++) {
                        this.values[i][j] = fix(pad.axes[j], 0.08 );
                    }
                    // button
                    for (j = 0; j < l; j++) {
                        this.values[i][k+j] = fix(pad.buttons[j].value);
                    }
                    //info += 'gamepad '+i+'| ' + this.values[i]+ '<br>';
                } else {
                    if(this.values[i]) this.values[i] = null;
                }
            }
        }

        //document.getElementById("info").innerHTML = info
    },
    fix:function(v, dead){
        var n = Number((v.toString()).substring(0, 5));
        if(dead && n<dead && n>-dead) n = 0;
        return n;
    }
}