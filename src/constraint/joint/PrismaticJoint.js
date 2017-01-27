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
 * @author saharan
 * @author lo-th
 */

function PrismaticJoint( config, lowerTranslation, upperTranslation ){

    Joint.call( this, config );

    this.type = JOINT_PRISMATIC;

    // The axis in the first body's coordinate system.
    this.localAxis1 = new Vec3().normalize( config.localAxis1 );
    // The axis in the second body's coordinate system.
    this.localAxis2 = new Vec3().normalize( config.localAxis2 );
    this.localAxis1X = this.localAxis1.x;
    this.localAxis1Y = this.localAxis1.y;
    this.localAxis1Z = this.localAxis1.z;
    this.localAxis2X = this.localAxis2.x;
    this.localAxis2Y = this.localAxis2.y;
    this.localAxis2Z = this.localAxis2.z;
    
    this.nor = new Vec3();
    this.tan = new Vec3();
    this.bin = new Vec3();
    this.ac = new AngularConstraint(this,new Quat().arc( this.localAxis1, this.localAxis2 ));
    // The translational limit and motor information of the joint.
    this.limitMotor = new LimitMotor(this.nor,true);
    this.limitMotor.lowerLimit = lowerTranslation;
    this.limitMotor.upperLimit = upperTranslation;
    this.t3 = new Translational3Constraint( this, this.limitMotor, new LimitMotor(this.tan,true), new LimitMotor(this.bin,true) );

};

PrismaticJoint.prototype = Object.create( Joint.prototype );
PrismaticJoint.prototype.constructor = PrismaticJoint;

PrismaticJoint.prototype.preSolve = function (timeStep,invTimeStep) {

    var tmpM;
    var tmp1X;
    this.updateAnchorPoints();

    tmpM=this.body1.rotation.elements;
    var axis1X=this.localAxis1X*tmpM[0]+this.localAxis1Y*tmpM[1]+this.localAxis1Z*tmpM[2];
    var axis1Y=this.localAxis1X*tmpM[3]+this.localAxis1Y*tmpM[4]+this.localAxis1Z*tmpM[5];
    var axis1Z=this.localAxis1X*tmpM[6]+this.localAxis1Y*tmpM[7]+this.localAxis1Z*tmpM[8];
    tmpM=this.body2.rotation.elements;
    var axis2X=this.localAxis2X*tmpM[0]+this.localAxis2Y*tmpM[1]+this.localAxis2Z*tmpM[2];
    var axis2Y=this.localAxis2X*tmpM[3]+this.localAxis2Y*tmpM[4]+this.localAxis2Z*tmpM[5];
    var axis2Z=this.localAxis2X*tmpM[6]+this.localAxis2Y*tmpM[7]+this.localAxis2Z*tmpM[8];

    var nx=axis1X*this.body2.inverseMass+axis2X*this.body1.inverseMass;
    var ny=axis1Y*this.body2.inverseMass+axis2Y*this.body1.inverseMass;
    var nz=axis1Z*this.body2.inverseMass+axis2Z*this.body1.inverseMass;
    tmp1X=_Math.sqrt(nx*nx+ny*ny+nz*nz);
    if(tmp1X>0)tmp1X=1/tmp1X;
    nx*=tmp1X;
    ny*=tmp1X;
    nz*=tmp1X;
    var tx=ny*nx-nz*nz;
    var ty=-nz*ny-nx*nx;
    var tz=nx*nz+ny*ny;
    tmp1X=1/_Math.sqrt(tx*tx+ty*ty+tz*tz);
    tx*=tmp1X;
    ty*=tmp1X;
    tz*=tmp1X;
    var bx=ny*tz-nz*ty;
    var by=nz*tx-nx*tz;
    var bz=nx*ty-ny*tx;

    this.nor.set(nx,ny,nz);
    this.tan.set(tx,ty,tz);
    this.bin.set(bx,by,bz);
    
    this.ac.preSolve(timeStep,invTimeStep);
    this.t3.preSolve(timeStep,invTimeStep);

};

PrismaticJoint.prototype.solve = function () {

    this.ac.solve();
    this.t3.solve();
    
};

PrismaticJoint.prototype.postSolve = function () {
};

export { PrismaticJoint };