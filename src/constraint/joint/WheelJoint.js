import { JOINT_WHEEL } from '../../constants';
import { Joint } from './Joint';
import { LimitMotor } from './LimitMotor';
import { Vec3 } from '../../math/Vec3';
import { Quat } from '../../math/Quat';
import { Mat33 } from '../../math/Mat33';
import { _Math } from '../../math/Math';

import { Translational3Constraint } from './base/Translational3Constraint';
import { Rotational3Constraint } from './base/Rotational3Constraint';

/**
 * A wheel joint allows for relative rotation between two rigid bodies along two axes.
 * The wheel joint also allows for relative translation for the suspension.
 *
 * @author saharan
 * @author lo-th
 */

function WheelJoint ( config ){

    Joint.call( this, config );

    this.type = JOINT_WHEEL;

    // The axis in the first body's coordinate system.
    this.localAxis1 = config.localAxis1.clone().normalize();
    // The axis in the second body's coordinate system.
    this.localAxis2 = config.localAxis2.clone().normalize();

    this.localAngle1 = new Vec3();
    this.localAngle2 = new Vec3();

    var dot = _Math.dotVectors( this.localAxis1, this.localAxis2 );

    if( dot > -1 && dot < 1 ){

        this.localAngle1.set(
            this.localAxis2.x - dot*this.localAxis1.x,
            this.localAxis2.y - dot*this.localAxis1.y,
            this.localAxis2.z - dot*this.localAxis1.z
        ).normalize();

        this.localAngle2.set(
            this.localAxis1.x - dot*this.localAxis2.x,
            this.localAxis1.y - dot*this.localAxis2.y,
            this.localAxis1.z - dot*this.localAxis2.z
        ).normalize();

    } else {

        var arc = new Mat33().setQuat( new Quat().setFromUnitVectors( this.localAxis1, this.localAxis2 ) );
        this.localAngle1.tangent( this.localAxis1 ).normalize();
        this.localAngle2 = this.localAngle1.clone().applyMatrix3( arc, true );

    }

    this.ax1 = new Vec3();
    this.ax2 = new Vec3();
    this.an1 = new Vec3();
    this.an2 = new Vec3();

    this.tmp = new Vec3();

    this.nor = new Vec3();
    this.tan = new Vec3();
    this.bin = new Vec3();

    // The translational limit and motor information of the joint.
    this.translationalLimitMotor = new LimitMotor( this.tan,true );
    this.translationalLimitMotor.frequency = 8;
    this.translationalLimitMotor.dampingRatio = 1;
    // The first rotational limit and motor information of the joint.
    this.rotationalLimitMotor1 = new LimitMotor( this.tan, false );
    // The second rotational limit and motor information of the joint.
    this.rotationalLimitMotor2 = new LimitMotor( this.bin, false );

    this.t3 = new Translational3Constraint( this, new LimitMotor( this.nor, true ),this.translationalLimitMotor,new LimitMotor( this.bin, true ));
    this.t3.weight = 1;
    this.r3 = new Rotational3Constraint(this,new LimitMotor( this.nor, true ),this.rotationalLimitMotor1,this.rotationalLimitMotor2);

};

WheelJoint.prototype = Object.assign( Object.create( Joint.prototype ), {

    constructor: WheelJoint,

    preSolve: function ( timeStep, invTimeStep ) {

        this.updateAnchorPoints();

        this.ax1.copy( this.localAxis1 ).applyMatrix3( this.body1.rotation, true );
        this.an1.copy( this.localAngle1 ).applyMatrix3( this.body1.rotation, true );

        this.ax2.copy( this.localAxis2 ).applyMatrix3( this.body2.rotation, true );
        this.an2.copy( this.localAngle2 ).applyMatrix3( this.body2.rotation, true );

        this.r3.limitMotor1.angle = _Math.dotVectors( this.ax1, this.ax2 );

        var limite = _Math.dotVectors( this.an1, this.ax2 );

        if( _Math.dotVectors( this.ax1, this.tmp.crossVectors( this.an1, this.ax2 ) ) < 0 ) this.rotationalLimitMotor1.angle = -limite;
        else this.rotationalLimitMotor1.angle = limite;

        limite = _Math.dotVectors( this.an2, this.ax1 );

        if( _Math.dotVectors( this.ax2, this.tmp.crossVectors( this.an2, this.ax1 ) ) < 0 ) this.rotationalLimitMotor2.angle = -limite;
        else this.rotationalLimitMotor2.angle = limite;

        this.nor.crossVectors( this.ax1, this.ax2 ).normalize();
        this.tan.crossVectors( this.nor, this.ax2 ).normalize();
        this.bin.crossVectors( this.nor, this.ax1 ).normalize();
        
        this.r3.preSolve(timeStep,invTimeStep);
        this.t3.preSolve(timeStep,invTimeStep);

    },

    solve: function () {

        this.r3.solve();
        this.t3.solve();

    },

    postSolve: function () {

    }

});

export { WheelJoint };