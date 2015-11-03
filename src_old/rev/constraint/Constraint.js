OIMO.Constraint = function(){
    this.parent=null;
    this.body1=null;
    this.body2=null;
    this.addedToIsland=false;
    this.sleeping=false;
}

OIMO.Constraint.prototype = {
    constructor: OIMO.Constraint,

    preSolve:function(timeStep,invTimeStep){
        throw new Error("preSolve Method is not inherited");
    },
    solve:function(){
        throw new Error("solve Method is not inherited");
    },
    postSolve:function(){
        throw new Error("postSolve Method is not inherited");
    }
}