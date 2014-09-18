/**
* The main class of link.
* is for simplify creation process and data access of Joint
* all setting in object
* 
* @author loth
*/
OIMO.Link = function(Obj){
    var obj = Obj || {};
    if(!obj.world) return;

    // the world where i am
    this.parent = obj.world;

    this.name = obj.name || '';
    var type = obj.type || "jointHinge";
    var axe1 = obj.axe1 || [1,0,0];
    var axe2 = obj.axe2 || [1,0,0];
    var pos1 = obj.pos1 || [0,0,0];
    var pos2 = obj.pos2 || [0,0,0];

    pos1 = pos1.map(function(x) { return x * OIMO.INV_SCALE; });
    pos2 = pos2.map(function(x) { return x * OIMO.INV_SCALE; });

    var min, max;
    if(type==="jointDistance"){
        min = obj.min || 0;
        max = obj.max || 10;
        min = min*OIMO.INV_SCALE;
        max = max*OIMO.INV_SCALE;
    }else{
        min = obj.min || 57.29578;
        max = obj.max || 0;
        min = min*OIMO.TO_RAD;
        max = max*OIMO.TO_RAD;
    }

    var limit = obj.limit || null;
    var spring = obj.spring || null;
    var motor = obj.motor || null;

    // joint setting
    var jc = new OIMO.JointConfig();
    jc.allowCollision = obj.collision || false;;
    jc.localAxis1.init(axe1[0], axe1[1], axe1[2]);
    jc.localAxis2.init(axe2[0], axe2[1], axe2[2]);
    jc.localAnchorPoint1.init(pos1[0], pos1[1], pos1[2]);
    jc.localAnchorPoint2.init(pos2[0], pos2[1], pos2[2]);
    if (typeof obj.body1 == 'string' || obj.body1 instanceof String) obj.body1 = obj.world.getByName(obj.body1);
    if (typeof obj.body2 == 'string' || obj.body2 instanceof String) obj.body2 = obj.world.getByName(obj.body2);
    jc.body1 = obj.body1;
    jc.body2 = obj.body2;

    
    switch(type){
        case "jointDistance": this.joint = new OIMO.DistanceJoint(jc, min, max); 
            if(spring !== null)this.joint.limitMotor.setSpring(spring[0], spring[1]);
            if(motor !== null) this.joint.limitMotor.setSpring(motor[0], motor[1]);
        break;
        case "jointHinge": this.joint = new OIMO.HingeJoint(jc, min, max);
            if(spring !== null)this.joint.limitMotor.setSpring(spring[0], spring[1]);// soften the joint ex: 100, 0.2
            if(motor !== null) this.joint.limitMotor.setSpring(motor[0], motor[1]);
        break;
        case "jointPrisme": this.joint = new OIMO.PrismaticJoint(jc, min, max); break;
        case "jointSlide": this.joint = new OIMO.SliderJoint(jc, min, max); break;
        case "jointBall": this.joint = new OIMO.BallAndSocketJoint(jc); break;
        case "jointWheel": this.joint = new OIMO.WheelJoint(jc);  
            if(limit !== null) this.joint.rotationalLimitMotor1.setLimit(limit[0], limit[1]);
            if(spring !== null) this.joint.rotationalLimitMotor1.setSpring(spring[0], spring[1]);
            if(motor !== null) this.joint.rotationalLimitMotor1.setSpring(motor[0], motor[1]);
        break;
    }

    this.joint.name = this.name;
    
    // finaly add to physics world
    this.parent.addJoint(this.joint);
}

OIMO.Link.prototype = {
    constructor: OIMO.Link,
    getPosition:function(){
        // array of two vect3 [point1, point2]
        return this.joint.getPosition();
    },
    getMatrix:function(){
        return this.joint.getMatrix();
    },
    // remove joint
    remove:function(){
        this.parent.removeJoint(this.joint);
    },
    // force wakeup linked body
    awake:function(){
        this.joint.awake();
    }
}