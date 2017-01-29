import { JOINT_PRISMATIC } from '../../constants';
import { Joint } from './Joint';
import { LimitMotor } from './LimitMotor';
import { Vec3 } from '../../math/Vec3';
import { Quat } from '../../math/Quat';
import { _Math } from '../../math/Math';

import { AngularConstraint } from './base/AngularConstraint';
import { Translational3Constraint } from './base/Translational3Constraint';


/**
 * A prismatic joint allows only for relative translation of rigid bodies along the axis.
 *
 * @author saharan
 * @author lo-th
 */

function PrismaticJoint( config, lowerTranslation, upperTranslation ){

    Joint.call( this, config );

    this.type = JOINT_PRISMATIC;

    // The axis in the first body's coordinate system.
    this.localAxis1 = config.localAxis1.clone().normalize();
    // The axis in the second body's coordinate system.
    this.localAxis2 = config.localAxis2.clone().normalize();

    this.ax1 = new Vec3();
    this.ax2 = new Vec3();
    this.tmpNor = new Vec3();
    
    this.nor = new Vec3();
    this.tan = new Vec3();
    this.bin = new Vec3();

    this.ac = new AngularConstraint( this, new Quat().arc( this.localAxis1, this.localAxis2 ) );

    // The translational limit and motor information of the joint.
    this.limitMotor = new LimitMotor(this.nor,true);
    this.limitMotor.lowerLimit = lowerTranslation;
    this.limitMotor.upperLimit = upperTranslation;
    this.t3 = new Translational3Constraint( this, this.limitMotor, new LimitMotor(this.tan,true), new LimitMotor(this.bin,true) );

};

PrismaticJoint.prototype = Object.create( Joint.prototype );
PrismaticJoint.prototype.constructor = PrismaticJoint;

PrismaticJoint.prototype.preSolve = function ( timeStep, invTimeStep ) {

    this.updateAnchorPoints();

    this.ax1.mulMat( this.body1.rotation, this.localAxis1 );
    this.ax2.mulMat( this.body2.rotation, this.localAxis2 );
    this.nor.set(
        this.ax1.x*this.body2.inverseMass + this.ax2.x*this.body1.inverseMass,
        this.ax1.y*this.body2.inverseMass + this.ax2.y*this.body1.inverseMass,
        this.ax1.z*this.body2.inverseMass + this.ax2.z*this.body1.inverseMass
    ).normalize();

    this.tan.set(
        this.nor.y*this.nor.x - this.nor.z*this.nor.z,
        -this.nor.z*this.nor.y - this.nor.x*this.nor.x,
        this.nor.x*this.nor.z + this.nor.y*this.nor.y
    ).normalize();

    this.bin.crossVectors( this.nor, this.tan );

    //

    this.ac.preSolve( timeStep, invTimeStep );
    this.t3.preSolve( timeStep, invTimeStep );

};

PrismaticJoint.prototype.solve = function () {

    this.ac.solve();
    this.t3.solve();
    
};

PrismaticJoint.prototype.postSolve = function () {
};

export { PrismaticJoint };