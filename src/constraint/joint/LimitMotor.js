/**
* An information of limit and motor.
*
* @author saharan
*/

function LimitMotor ( axis, fixed ) {

    fixed = fixed || false;
    // The axis of the constraint.
    this.axis = axis;
    // The current angle for rotational constraints.
    this.angle = 0;
    // The lower limit. Set lower > upper to disable
    this.lowerLimit = fixed ? 0 : 1;

    //  The upper limit. Set lower > upper to disable.
    this.upperLimit = 0;
    // The target motor speed.
    this.motorSpeed = 0;
    // The maximum motor force or torque. Set 0 to disable.
    this.maxMotorForce = 0;
    // The frequency of the spring. Set 0 to disable.
    this.frequency = 0;
    // The damping ratio of the spring. Set 0 for no damping, 1 for critical damping.
    this.dampingRatio = 0;

};

Object.assign( LimitMotor.prototype, {

    LimitMotor: true,

    // Set limit data into this constraint.
    setLimit:function ( lowerLimit, upperLimit ) {

        this.lowerLimit = lowerLimit;
        this.upperLimit = upperLimit;

    },

    // Set motor data into this constraint.
    setMotor:function ( motorSpeed, maxMotorForce ) {
        
        this.motorSpeed = motorSpeed;
        this.maxMotorForce = maxMotorForce;

    },

    // Set spring data into this constraint.
    setSpring:function ( frequency, dampingRatio ) {
        
        this.frequency = frequency;
        this.dampingRatio = dampingRatio;
        
    }

});

export { LimitMotor };