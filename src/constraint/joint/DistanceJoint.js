import { JOINT_DISTANCE } from '../../constants';
import { Joint } from './Joint';
import { LimitMotor } from './LimitMotor';
import { Vec3 } from '../../math/Vec3';

import { TranslationalConstraint } from './base/TranslationalConstraint';


/**
 * A distance joint limits the distance between two anchor points on rigid bodies.
 *
 * @author saharan
 * @author lo-th
 */

function DistanceJoint ( config, minDistance, maxDistance ){

    Joint.call( this, config );

    this.type = JOINT_DISTANCE;
    
    this.nor = new Vec3();

    // The limit and motor information of the joint.
    this.limitMotor = new LimitMotor( this.nor, true );
    this.limitMotor.lowerLimit = minDistance;
    this.limitMotor.upperLimit = maxDistance;

    this.t = new TranslationalConstraint( this, this.limitMotor );

};

DistanceJoint.prototype = Object.assign( Object.create( Joint.prototype ), {

    constructor: DistanceJoint,

    preSolve: function ( timeStep, invTimeStep ) {

        this.updateAnchorPoints();

        this.nor.sub( this.anchorPoint2, this.anchorPoint1 ).normalize();

        // preSolve

        this.t.preSolve( timeStep, invTimeStep );

    },

    solve: function () {

        this.t.solve();

    },

    postSolve: function () {

    }

});

export { DistanceJoint };