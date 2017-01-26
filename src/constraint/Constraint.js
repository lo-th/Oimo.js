import { Error } from '../core/Utils';
import { Vec3 } from '../math/Vec3';

/**
* The base class of all type of the constraints.
* @author saharan
*/

function Constraint(){

    // The parent world of the constraint.
    this.parent = null;
    // The first body of the constraint.
    this.body1 = null;
    // The second body of the constraint.
    this.body2 = null;
    // Internal
    this.addedToIsland = false;

}

Object.assign( Constraint.prototype, {

    Constraint: true,
    /**
    * Prepare for solving the constraint.
    * @param   timeStep
    * @param   invTimeStep
    */
    preSolve:function( timeStep, invTimeStep ){
        Error("Constraint", "Inheritance error.");
    },
    /**
    * Solve the constraint.
    * This is usually called iteratively.
    */
    solve:function(){
        Error("Constraint", "Inheritance error.");
    },
    /**
    * Do the post-processing.
    */
    postSolve:function(){
        Error("Constraint", "Inheritance error.");
    }

} );


export { Constraint };