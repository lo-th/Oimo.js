import { _Math } from '../math/Math';
import { REVISION } from '../constants';


function Error( Class, Msg ){ 

    console.error( Class, Msg );

}

export { Error };

//

/*
function Dictionary () {

    this.data = {};
    this.keys = [];

};

Dictionary.prototype = {

    constructor: Dictionary,

    set: function ( value ) {

        var key = value.id;
        if(!this.get[key]) this.keys.push(key);

        this.data[key] = value;
        
    },

    get: function ( id ) {

        return this.data[ id ];

    },

    del: function ( value ) {
        var k = this.keys;

        var n = k.indexOf( value.id );
         if ( n > -1 ){
            delete this.data[k[n]];
            k.splice( n, 1 );
        }

    },

    reset: function () {

        var data = this.data, keys = this.keys, key;
        while(keys.length > 0){
            key = keys.pop();
            delete data[key];
        }

    }
};

export { Dictionary };
*/

//


function Performance ( world ){

    this.parent = world;
    this.infos = new Float32Array( 13 );
    this.f = [0,0,0];

    this.times = [0,0,0,0];

    this.types = ['None','BruteForce','Sweep & Prune', 'Bounding Volume Tree' ];
    this.broadPhase = this.types[ this.parent.broadPhase.types ];

    this.version = REVISION;

    this.fps = 0;
    this.broadPhaseTime = 0;
    this.narrowPhaseTime = 0;
    this.solvingTime = 0;
    this.totalTime = 0;

};

Performance.prototype = {

    setTime: function ( n ) {

        this.times[ n || 0 ] = performance.now();

    },

    calcBroadPhase: function () {

        this.setTime( 2 );
        this.broadPhaseTime = this.times[ 2 ] - this.times[ 1 ];

    },

    calcNarrowPhase: function () {

        this.setTime( 3 );
        this.narrowPhaseTime = this.times[ 3 ] - this.times[ 2 ];

    },

    calcEnd: function () {

        this.setTime( 2 );
        this.solvingTime = this.times[ 2 ] - this.times[ 1 ];
        this.totalTime = this.times[ 2 ] - this.times[ 0 ];
        this.upfps();

    },


    upfps : function(){

        this.f[1] = Date.now();
        if (this.f[1]-1000>this.f[0]){ this.f[0] = this.f[1]; this.fps = this.f[2]; this.f[2] = 0; } this.f[2]++;

    },

    updatingTime : function(){

        return _Math.fix( this.totalTime-(this.broadPhaseTime+this.narrowPhaseTime+this.solvingTime ));

    },

    show : function(){

        var info =[
            "Oimo.js "+this.version+"<br>",
            this.broadPhase + "<br><br>",
            "FPS: " + this.fps +" fps<br><br>",
            "rigidbody "+this.parent.numRigidBodies+"<br>",
            "contact &nbsp;&nbsp;"+this.parent.numContacts+"<br>",
            "ct-point &nbsp;"+this.parent.numContactPoints+"<br>",
            "paircheck "+this.parent.broadPhase.numPairChecks+"<br>",
            "island &nbsp;&nbsp;&nbsp;"+this.parent.numIslands +"<br><br>",
            "Time in milliseconde<br><br>",
            "broadphase &nbsp;"+ _Math.fix(this.broadPhaseTime) + "<br>",
            "narrowphase "+ _Math.fix(this.narrowPhaseTime) + "<br>",
            "solving &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+ _Math.fix(this.solvingTime) + "<br>",
            "total &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+ _Math.fix(this.totalTime)+ "<br>",
            "updating &nbsp;&nbsp;&nbsp;&nbsp;"+ this.updatingTime() + "<br>"
        ].join("\n");
        return info;

    },

    toArray : function(){

        this.infos[0] = this.parent.broadPhase.types;
        this.infos[1] = this.parent.numRigidBodies;
        this.infos[2] = this.parent.numContacts;
        this.infos[3] = this.parent.broadPhase.numPairChecks;
        this.infos[4] = this.parent.numContactPoints;
        this.infos[5] = this.parent.numIslands;
        this.infos[6] = this.broadPhaseTime;
        this.infos[7] = this.narrowPhaseTime;
        this.infos[8] = this.solvingTime;
        this.infos[9] = this.updatingTime();
        this.infos[10] = this.totalTime;
        this.infos[11] = this.fps;
        return this.infos;

    }

};

export { Performance };



/*

function Link ( o ){

    o = o || {};
    if(!o.world) return;
    if(o.type === undefined) o.type = "jointHinge";
    this.name = o.name || '';
    this.joint = o.world.add(o);
}

Link.prototype = {

    constructor: Link,
    getPosition: function(){ return this.joint.getPosition(); },
    //getMatrix: function(){ return this.joint.getMatrix(); },
    remove: function(){ this.joint.dispose(); },
    awake: function(){ this.joint.awake(); }

}

export { Link };


//


function Body ( o ) {
    
    o = o || {};
    if(!o.world) return;
    if(o.type === undefined) o.type = "box";
    this.name = o.name || '';
    this.body = o.world.add(o);

}

Body.prototype = {

    constructor: Body,
    setPosition:function(pos){ this.body.setPosition(pos); },
    setQuaternion:function(q){ this.body.setQuaternion(q); },
    setRotation:function(rot){ this.body.setRotation(rot); },
    getPosition:function(){ return this.body.getPosition(); },
    getRotation:function(){ return this.body.getRotation(); },
    getQuaternion:function(){ return this.body.getQuaternion(); },
    //getMatrix:function(){ return this.body.getMatrix(); },
    getSleep:function(){ return this.body.sleeping; },
    resetPosition:function(x,y,z){ this.body.resetPosition(x,y,z); },
    resetRotation:function(x,y,z){ this.body.resetRotation(x,y,z); },
    awake:function(){ this.body.awake(); },
    remove:function(){ this.body.dispose(); },
    checkContact:function(name){ this.body.checkContact(name); }

}

export { Body };*/