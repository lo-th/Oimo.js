import { JOINT_HINGE } from '../../constants';
import { Joint } from './Joint';
import { LimitMotor } from './LimitMotor';
import { Vec3 } from '../../math/Vec3';
import { Quat } from '../../math/Quat';
import { Mat33 } from '../../math/Mat33';
import { _Math } from '../../math/Math';

import { LinearConstraint } from './base/LinearConstraint';
import { Rotational3Constraint } from './base/Rotational3Constraint';

/**
 * A hinge joint allows only for relative rotation of rigid bodies along the axis.
 *
 * @author saharan
 * @author lo-th
 */

function HingeJoint ( config, lowerAngleLimit, upperAngleLimit ) {

    Joint.call( this, config );

    this.type = JOINT_HINGE;

    // The axis in the first body's coordinate system.
    this.localAxis1 = config.localAxis1.clone().norm();
    // The axis in the second body's coordinate system.
    this.localAxis2 = config.localAxis2.clone().norm();

    // make angle axis 1
    this.localAngle1 = new Vec3(
        this.localAxis1.y*this.localAxis1.x - this.localAxis1.z*this.localAxis1.z,
        -this.localAxis1.z*this.localAxis1.y - this.localAxis1.x*this.localAxis1.x,
        this.localAxis1.x*this.localAxis1.z + this.localAxis1.y*this.localAxis1.y
    ).norm();

    // make angle axis 2
    var arc = new Mat33().setQuat( new Quat().arc( this.localAxis1, this.localAxis2 ) );
    this.localAngle2 = new Vec3().mulMat( arc, this.localAngle1 );

    this.nor = new Vec3();
    this.tan = new Vec3();
    this.bin = new Vec3();

    this.ax1 = new Vec3();
    this.ax2 = new Vec3();
    this.an1 = new Vec3();
    this.an2 = new Vec3();

    // The rotational limit and motor information of the joint.
    this.limitMotor = new LimitMotor( this.nor, false );
    this.limitMotor.lowerLimit = lowerAngleLimit;
    this.limitMotor.upperLimit = upperAngleLimit;

    this.lc = new LinearConstraint(this);
    this.r3 = new Rotational3Constraint(this,this.limitMotor,new LimitMotor(this.tan,true),new LimitMotor(this.bin,true));
};

HingeJoint.prototype = Object.assign( Object.create( Joint.prototype ), {

    constructor: HingeJoint,


    preSolve: function ( timeStep, invTimeStep ) {

        var tmp1X, tmp1Y, tmp1Z, limite;//, nx, ny, nz, tx, ty, tz, bx, by, bz;

        this.updateAnchorPoints();

        this.ax1.mulMat( this.body1.rotation, this.localAxis1 );
        this.ax2.mulMat( this.body2.rotation, this.localAxis2 );

        this.an1.mulMat( this.body1.rotation, this.localAngle1 );
        this.an2.mulMat( this.body2.rotation, this.localAngle2 );

        this.nor.set(
            this.ax1.x*this.body2.inverseMass + this.ax2.x*this.body1.inverseMass,
            this.ax1.y*this.body2.inverseMass + this.ax2.y*this.body1.inverseMass,
            this.ax1.z*this.body2.inverseMass + this.ax2.z*this.body1.inverseMass
        ).norm();

        this.tan.set(
            this.nor.y*this.nor.x - this.nor.z*this.nor.z,
            -this.nor.z*this.nor.y - this.nor.x*this.nor.x,
            this.nor.x*this.nor.z + this.nor.y*this.nor.y
        ).norm();

        this.bin.set(
            this.nor.y*this.tan.z - this.nor.z*this.tan.y,
            this.nor.z*this.tan.x - this.nor.x*this.tan.z,
            this.nor.x*this.tan.y - this.nor.y*this.tan.x
        );

        // calculate hinge angle

        limite = _Math.acosClamp(this.an1.x*this.an2.x + this.an1.y*this.an2.y + this.an1.z*this.an2.z)

        if(
            this.nor.x*(this.an1.y*this.an2.z - this.an1.z*this.an2.y)+
            this.nor.y*(this.an1.z*this.an2.x - this.an1.x*this.an2.z)+
            this.nor.z*(this.an1.x*this.an2.y - this.an1.y*this.an2.x)<0
        ){
            this.limitMotor.angle = -limite;
        }else{
            this.limitMotor.angle = limite;
        }

        tmp1X = this.ax1.y*this.ax2.z - this.ax1.z*this.ax2.y;
        tmp1Y = this.ax1.z*this.ax2.x - this.ax1.x*this.ax2.z;
        tmp1Z = this.ax1.x*this.ax2.y - this.ax1.y*this.ax2.x;

        this.r3.limitMotor2.angle = this.tan.x*tmp1X + this.tan.y*tmp1Y + this.tan.z*tmp1Z;
        this.r3.limitMotor3.angle = this.bin.x*tmp1X + this.bin.y*tmp1Y + this.bin.z*tmp1Z;
        
        this.r3.preSolve( timeStep, invTimeStep );
        this.lc.preSolve( timeStep, invTimeStep );

    },

    solve: function () {

        this.r3.solve();
        this.lc.solve();

    },

    postSolve: function () {

    }

});

export { HingeJoint };