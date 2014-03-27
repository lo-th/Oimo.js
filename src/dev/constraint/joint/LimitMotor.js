OIMO.LimitMotor = function(axis,fixed){
    this.axis=axis;
    this.angle=0;
    if(fixed)this.lowerLimit=0;
    else this.lowerLimit=1;
    this.upperLimit=0;
    this.motorSpeed=0;
    this.maxMotorForce=0;
    this.frequency=0;
    this.dampingRatio=0;
}

OIMO.LimitMotor.prototype = {
    constructor: OIMO.LimitMotor,

    setLimit:function(lowerLimit,upperLimit){
        this.lowerLimit=lowerLimit;
        this.upperLimit=upperLimit;
        },
    setMotor:function(motorSpeed,maxMotorForce){
        this.motorSpeed=motorSpeed;
        this.maxMotorForce=maxMotorForce;
        },
    setSpring:function(frequency,dampingRatio){
        this.frequency=frequency;
        this.dampingRatio=dampingRatio;
    }
}