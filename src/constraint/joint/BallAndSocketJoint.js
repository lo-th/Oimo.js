import { JOINT_BALL_AND_SOCKET } from '../../constants';
import { Joint } from './Joint';
import { LinearConstraint } from './base/LinearConstraint';

/**
 * A ball-and-socket joint limits relative translation on two anchor points on rigid bodies.
 *
 * @author saharan
 * @author lo-th
 */

function BallAndSocketJoint ( config ){

    Joint.call( this, config );

    this.type = JOINT_BALL_AND_SOCKET;
    
    this.lc = new LinearConstraint( this );

};

BallAndSocketJoint.prototype = Object.assign( Object.create( Joint.prototype ), {

    constructor: BallAndSocketJoint,

    preSolve: function ( timeStep, invTimeStep ) {

        this.updateAnchorPoints();

        // preSolve

        this.lc.preSolve( timeStep, invTimeStep );

    },

    solve: function () {

        this.lc.solve();

    },

    postSolve: function () {

    }

});

export { BallAndSocketJoint };