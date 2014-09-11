OIMO.Performance = function(world){
	this.parent = world;
	this.infos = new OIMO_ARRAY_TYPE(13);
	this.f = [0,0,0];

    this.fps=0;
    this.broadPhaseTime=0;
    this.narrowPhaseTime=0;
    this.solvingTime=0;
    this.updatingTime=0;
    this.totalTime=0;
}
OIMO.Performance.prototype = {
	upfps : function(){
		this.f[1] = Date.now();
        if (this.f[1]-1000>this.f[0]){ this.f[0]=this.f[1]; this.fps=this.f[2]; this.f[2]=0; } this.f[2]++;
	},
	show : function(){
		var info =[
            "Oimo.js DEV.1.1.2a<br><br>",
            "FPS: " + this.fps +" fps<br><br>",
            "Rigidbody: "+this.parent.numRigidBodies+"<br>",
            "Contact: "+this.parent.numContacts+"<br>",
            "Pair Check: "+this.parent.broadPhase.numPairChecks+"<br>",
            "Contact Point: "+this.parent.numContactPoints+"<br>",
            "Island: "+this.parent.numIslands +"<br><br>",
            "Broad-Phase Time: "+this.broadPhaseTime + " ms<br>",
            "Narrow-Phase Time: "+this.narrowPhaseTime + " ms<br>",
            "Solving Time: "+this.solvingTime + " ms<br>",
            "Updating Time: "+this.updatingTime + " ms<br>",
            "Total Time: "+this.totalTime + " ms "
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
}