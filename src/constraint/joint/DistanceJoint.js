import { JOINT_DISTANCE } from '../../constants';
import { Joint } from './Joint';
import { LimitMotor } from './LimitMotor';
import { Vec3 } from '../../math/Vec3';

import { TranslationalConstraint } from './base/TranslationalConstraint';


/**
 * A distance joint limits the distance between two anchor points on rigid bodies.
 * @author saharan
 * @author lo-th
 */

function DistanceJoint ( config, minDistance, maxDistance ){

    Joint.call( this, config );

    this.type = JOINT_DISTANCE;
    
    this.normal = new Vec3();
    //this.nr = new Vec3(); 

    // The limit and motor information of the joint.
    this.limitMotor = new LimitMotor( this.normal, true );
    this.limitMotor.lowerLimit = minDistance;
    this.limitMotor.upperLimit = maxDistance;

    this.t = new TranslationalConstraint( this, this.limitMotor );

};

DistanceJoint.prototype = Object.create( Joint.prototype );
DistanceJoint.prototype.constructor = DistanceJoint;


DistanceJoint.prototype.preSolve = function ( timeStep, invTimeStep ) {

    this.updateAnchorPoints();

    //var nr = this.nr;

    //this.nr.sub( this.anchorPoint2, this.anchorPoint1 );
    //var len = OIMO.sqrt( nr.x*nr.x + nr.y*nr.y + nr.z*nr.z );
    //if(len>0) len = 1/len;
    //this.normal.scale( nr, len );

    //this.normal.normalize( this.nr );

    this.normal.sub( this.anchorPoint2, this.anchorPoint1 ).normalize();



    this.t.preSolve( timeStep, invTimeStep );

};

DistanceJoint.prototype.solve = function () {

    this.t.solve();

};

DistanceJoint.prototype.postSolve = function () {
};

export { DistanceJoint };