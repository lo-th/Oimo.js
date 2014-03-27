OIMO.Link = function(Obj){
    var obj = Obj || {};
    if(!obj.world) return;

    this.name = obj.name || '';
    var type = obj.type || "jointHinge";
    var axe1 = obj.axe1 || [1,0,0];
    var axe2 = obj.axe2 || [1,0,0];
    var pos1 = obj.pos1 || [0,0,0];
    var pos2 = obj.pos2 || [0,0,0];

    pos1 = pos1.map(function(x) { return x * OIMO.INV_SCALE; });
    pos2 = pos2.map(function(x) { return x * OIMO.INV_SCALE; });

    var max = obj.max || 10;
    max = max*OIMO.INV_SCALE;

    // joint setting
    var jc = new OIMO.JointConfig();
    jc.allowCollision = obj.collision || false;
    jc.localAxis1.init(axe1[0], axe1[1], axe1[2]);
    jc.localAxis2.init(axe2[0], axe2[1], axe2[2]);
    jc.localRelativeAnchorPosition1.init(pos1[0], pos1[1], pos1[2]);
    jc.localRelativeAnchorPosition2.init(pos2[0], pos2[1], pos2[2]);
    if (typeof obj.body1 == 'string' || obj.body1 instanceof String) obj.body1 = obj.world.getByName(obj.body1);
    if (typeof obj.body2 == 'string' || obj.body2 instanceof String) obj.body2 = obj.world.getByName(obj.body2);

    switch(type){
        case "jointBall": this.joint = new OIMO.BallJoint(jc, obj.body1, obj.body2); break;
        case "jointDistance": this.joint = new OIMO.DistanceJoint(jc, obj.body1, obj.body2, max); break;
        case "jointHinge": this.joint = new OIMO.HingeJoint(jc, obj.body1, obj.body2); break;     
        case "jointHinge2": this.joint = new OIMO.Hinge2Joint(jc, obj.body1, obj.body2); break;
    }

    // finaly add to physics world
    this.joint.name = this.name;
    obj.world.addJoint(this.joint);
}