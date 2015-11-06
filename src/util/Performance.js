OIMO.Performance = function(world){
	this.parent = world;
	this.infos = new OIMO_ARRAY_TYPE(13);
	this.f = [0,0,0];

    this.types = ['None','BruteForce','Sweep & Prune', 'Bounding Volume Tree' ];
    this.broadPhase = this.types[this.parent.broadPhase.types];

    this.version = OIMO.REVISION;

    this.fps = 0;
    this.broadPhaseTime = 0;
    this.narrowPhaseTime = 0;
    this.solvingTime = 0;
    this.updatingTime = 0;
    this.totalTime = 0;
};

OIMO.Performance.prototype = {
	upfps : function(){
		this.f[1] = Date.now();
        if (this.f[1]-1000>this.f[0]){ this.f[0] = this.f[1]; this.fps = this.f[2]; this.f[2] = 0; } this.f[2]++;
	},
	show : function(){
		var info =[
            "Oimo.js "+this.version+"<br>",
            this.broadPhase + "<br><br>",
            "FPS: " + this.fps +" fps<br><br>",
            "rigidbody "+this.parent.numRigidBodies+"<br>",
            "contact &nbsp;&nbsp;"+this.parent.numContacts+"<br>",
            "paircheck "+this.parent.broadPhase.numPairChecks+"<br>",
            "contact &nbsp;&nbsp;"+this.parent.numContactPoints+"<br>",
            "island &nbsp;&nbsp;&nbsp;"+this.parent.numIslands +"<br><br>",
            "Time in ms <br>",
            "broad-phase &nbsp;"+this.broadPhaseTime + "<br>",
            "narrow-phase "+this.narrowPhaseTime + "<br>",
            "solving &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+this.solvingTime + "<br>",
            "updating &nbsp;&nbsp;&nbsp;&nbsp;"+this.updatingTime + "<br>",
            "total &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+this.totalTime
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
	    this.infos[9] = this.updatingTime;
	    this.infos[10] = this.totalTime;
	    this.infos[11] = this.fps;
		return this.infos;
	}
};
