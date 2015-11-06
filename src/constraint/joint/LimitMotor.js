/**
* An information of limit and motor.
* @author saharan
*/
OIMO.LimitMotor = function ( axis, fixed ) {

    fixed = fixed || false;
    // The axis of the constraint.
    this.axis = axis;
    // The current angle for rotational constraints.
    this.angle=0;
    // The lower limit. Set lower > upper to disable
    this.lowerLimit = fixed ? 0 : 1;

    //if(fixed)this.lowerLimit = 0;
    //else this.lowerLimit = 1;
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

OIMO.LimitMotor.prototype = {
    constructor: OIMO.LimitMotor,
    /**
    * Set limit data into this constraint.
    * @param   lowerLimit
    * @param   upperLimit
    */
    setLimit:function ( lowerLimit, upperLimit ) {

        this.lowerLimit = lowerLimit;
        this.upperLimit = upperLimit;

    },
    /**
    * Set motor data into this constraint.
    * @param   motorSpeed
    * @param   maxMotorForce
    */
    setMotor:function ( motorSpeed, maxMotorForce ) {
        
        this.motorSpeed = motorSpeed;
        this.maxMotorForce = maxMotorForce;

    },
    /**
    * Set spring data into this constraint.
    * @param   frequency
    * @param   dampingRatio
    */
    setSpring:function ( frequency, dampingRatio ) {
        
        this.frequency = frequency;
        this.dampingRatio = dampingRatio;
        
    }
};