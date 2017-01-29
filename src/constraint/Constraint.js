import { printError } from '../core/Utils';
import { Vec3 } from '../math/Vec3';

/**
 * The base class of all type of the constraints.
 *
 * @author saharan
 * @author lo-th
 */

function Constraint(){

    // parent world of the constraint.
    this.parent = null;

    // first body of the constraint.
    this.body1 = null;

    // second body of the constraint.
    this.body2 = null;

    // Internal
    this.addedToIsland = false;
    
}

Object.assign( Constraint.prototype, {

    Constraint: true,

    // Prepare for solving the constraint
    preSolve: function( timeStep, invTimeStep ){

        printError("Constraint", "Inheritance error.");

    },

    // Solve the constraint. This is usually called iteratively.
    solve: function(){

        printError("Constraint", "Inheritance error.");

    },

    // Do the post-processing.
    postSolve: function(){

        printError("Constraint", "Inheritance error.");

    }

});


export { Constraint };