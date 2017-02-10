import { Vec3 } from '../../../math/Vec3';
import { Quat } from '../../../math/Quat';
import { Mat33 } from '../../../math/Mat33';

/**
* An angular constraint for all axes for various joints.
* @author saharan
*/

function AngularConstraint( joint, targetOrientation ) {

    this.joint = joint;

    this.targetOrientation = new Quat().invert( targetOrientation );

    this.relativeOrientation = new Quat();

    this.ii1 = null;
    this.ii2 = null;
    this.dd = null;

    this.vel = new Vec3();
    this.imp = new Vec3();

    this.rn0 = new Vec3();
    this.rn1 = new Vec3();
    this.rn2 = new Vec3();

    this.b1 = joint.body1;
    this.b2 = joint.body2;
    this.a1 = this.b1.angularVelocity;
    this.a2 = this.b2.angularVelocity;
    this.i1 = this.b1.inverseInertia;
    this.i2 = this.b2.inverseInertia;

};

Object.assign( AngularConstraint.prototype, {

    AngularConstraint: true,

    preSolve: function ( timeStep, invTimeStep ) {

        var inv, len, v;

        this.ii1 = this.i1.clone();
        this.ii2 = this.i2.clone();

        v = new Mat33().add(this.ii1, this.ii2).elements;
        inv = 1/( v[0]*(v[4]*v[8]-v[7]*v[5])  +  v[3]*(v[7]*v[2]-v[1]*v[8])  +  v[6]*(v[1]*v[5]-v[4]*v[2]) );
        this.dd = new Mat33().set(
            v[4]*v[8]-v[5]*v[7], v[2]*v[7]-v[1]*v[8], v[1]*v[5]-v[2]*v[4],
            v[5]*v[6]-v[3]*v[8], v[0]*v[8]-v[2]*v[6], v[2]*v[3]-v[0]*v[5],
            v[3]*v[7]-v[4]*v[6], v[1]*v[6]-v[0]*v[7], v[0]*v[4]-v[1]*v[3]
        ).multiplyScalar( inv );
        
        this.relativeOrientation.invert( this.b1.orientation ).multiply( this.targetOrientation ).multiply( this.b2.orientation );

        inv = this.relativeOrientation.w*2;

        this.vel.copy( this.relativeOrientation ).multiplyScalar( inv );

        len = this.vel.length();

        if( len > 0.02 ) {
            len = (0.02-len)/len*invTimeStep*0.05;
            this.vel.multiplyScalar( len );
        }else{
            this.vel.set(0,0,0);
        }

        this.rn1.copy( this.imp ).applyMatrix3( this.ii1, true );
        this.rn2.copy( this.imp ).applyMatrix3( this.ii2, true );

        this.a1.add( this.rn1 );
        this.a2.sub( this.rn2 );

    },

    solve: function () {

        var r = this.a2.clone().sub( this.a1 ).sub( this.vel );

        this.rn0.copy( r ).applyMatrix3( this.dd, true );
        this.rn1.copy( this.rn0 ).applyMatrix3( this.ii1, true );
        this.rn2.copy( this.rn0 ).applyMatrix3( this.ii2, true );

        this.imp.add( this.rn0 );
        this.a1.add( this.rn1 );
        this.a2.sub( this.rn2 );

    }

} );

export { AngularConstraint };