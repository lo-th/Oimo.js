/**
* The base class of all type of the constraints.
* @author saharan
*/
OIMO.Constraint = function(){
    // The parent world of the constraint.
    this.parent=null;
    // The first body of the constraint.
    this.body1=null;
    // The second body of the constraint.
    this.body2=null;
    // Internal
    this.addedToIsland=false;
}

OIMO.Constraint.prototype = {
    constructor: OIMO.Constraint,
    /**
    * Prepare for solving the constraint.
    * @param   timeStep
    * @param   invTimeStep
    */
    preSolve:function(timeStep,invTimeStep){
        throw new Error("Inheritance error.");
    },
    /**
    * Solve the constraint.
    * This is usually called iteratively.
    */
    solve:function(){
        throw new Error("Inheritance error.");
    },
    /**
    * Do the post-processing.
    */
    postSolve:function(){
        throw new Error("Inheritance error.");
    }
}