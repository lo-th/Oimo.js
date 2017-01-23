import { JOINT_BALL_AND_SOCKET } from '../../constants';
import { Joint } from './Joint';
import { LinearConstraint } from './base/LinearConstraint';

/**
 * A ball-and-socket joint limits relative translation on two anchor points on rigid bodies.
 * @author saharan
 * @author lo-th
 */

function BallAndSocketJoint ( config ){

    Joint.call( this, config );

    this.type = JOINT_BALL_AND_SOCKET;
    
    this.lc = new LinearConstraint( this );

};

BallAndSocketJoint.prototype = Object.create( Joint.prototype );
BallAndSocketJoint.prototype.constructor = BallAndSocketJoint;

BallAndSocketJoint.prototype.preSolve = function ( timeStep, invTimeStep ) {

    this.updateAnchorPoints();
    this.lc.preSolve(timeStep,invTimeStep);

};

BallAndSocketJoint.prototype.solve = function () {

    this.lc.solve();

};

BallAndSocketJoint.prototype.postSolve = function () {

};

export { BallAndSocketJoint };