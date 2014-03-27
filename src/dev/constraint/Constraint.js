OIMO.Constraint = function(){
    this.parent=null;
    this.body1=null;
    this.body2=null;
    this.addedToIsland=false;
}

OIMO.Constraint.prototype = {
    constructor: OIMO.Constraint,

    preSolve:function(timeStep,invTimeStep){
        throw new Error("Inheritance error.");
    },
    solve:function(){
        throw new Error("Inheritance error.");
    },
    postSolve:function(){
        throw new Error("Inheritance error.");
    }
}