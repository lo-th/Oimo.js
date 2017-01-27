import { printError } from '../core/utils';
import { Vec3 } from '../math/Vec3';

/**
 * The base class of all type of the constraints.
 *
 * @class Constraint
 * @author saharan
 * @author lo-th
 */
function Constraint(){

    /**
     * The parent world of the constraint.
     *
     * @property parent
     * @type {World}
     */
    this.parent = null;

    /**
     * The first body of the constraint.
     *
     * @property body1
     * @type {RigidBody}
     */
    this.body1 = null;

    /**
     * The second body of the constraint.
     *
     * @property body2
     * @type {RigidBody}
     */
    this.body2 = null;

    // Internal
    this.addedToIsland = false;
}

Object.assign( Constraint.prototype, {

    /**
     * Prepare for solving the constraint.
     * @param timeStep
     * @param invTimeStep
     * @return any
     */
    preSolve: function( timeStep, invTimeStep ){
        printError("Constraint", "Inheritance error.");
    },

    /**
     * Solve the constraint.
     * This is usually called iteratively.
     * @param timeStep
     * @param invTimeStep
     * @return any
     */
    solve: function(){
        printError("Constraint", "Inheritance error.");
    },

    /**
     * Do the post-processing.
     * @param timeStep
     * @param invTimeStep
     * @return any
     */
    postSolve: function(){
        printError("Constraint", "Inheritance error.");
    }
});


export { Constraint };