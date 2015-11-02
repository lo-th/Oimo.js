OIMO.World.prototype.add = function(obj){
    obj = obj || {};

    var type = obj.type || "box";
    if( typeof type === 'string' ) type = [type];// single shape

    if(type[0].substring(0,5) == 'joint'){ // is joint

        var axe1 = obj.axe1 || [1,0,0];
        var axe2 = obj.axe2 || [1,0,0];
        var pos1 = obj.pos1 || [0,0,0];
        var pos2 = obj.pos2 || [0,0,0];

        pos1 = pos1.map(function(x){ return x * OIMO.INV_SCALE; });
        pos2 = pos2.map(function(x){ return x * OIMO.INV_SCALE; });

        var min, max;
        if(type[0]==="jointDistance"){
            min = obj.min || 0;
            max = obj.max || 10;
            min = min*OIMO.INV_SCALE;
            max = max*OIMO.INV_SCALE;
        }else{
            min = obj.min || 57.29578;
            max = obj.max || 0;
            min = min*OIMO.degtorad;
            max = max*OIMO.degtorad;
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

        var joint;
        switch(type[0]){
            case "jointDistance": joint = new OIMO.DistanceJoint(jc, min, max); 
                if(spring !== null) joint.limitMotor.setSpring(spring[0], spring[1]);
                if(motor !== null) joint.limitMotor.setSpring(motor[0], motor[1]);
            break;
            case "jointHinge": joint = new OIMO.HingeJoint(jc, min, max);
                if(spring !== null) joint.limitMotor.setSpring(spring[0], spring[1]);// soften the joint ex: 100, 0.2
                if(motor !== null) joint.limitMotor.setSpring(motor[0], motor[1]);
            break;
            case "jointPrisme": joint = new OIMO.PrismaticJoint(jc, min, max); break;
            case "jointSlide": joint = new OIMO.SliderJoint(jc, min, max); break;
            case "jointBall": joint = new OIMO.BallAndSocketJoint(jc); break;
            case "jointWheel": joint = new OIMO.WheelJoint(jc);  
                if(limit !== null) joint.rotationalLimitMotor1.setLimit(limit[0], limit[1]);
                if(spring !== null) joint.rotationalLimitMotor1.setSpring(spring[0], spring[1]);
                if(motor !== null) joint.rotationalLimitMotor1.setSpring(motor[0], motor[1]);
            break;
        }

        joint.name = obj.name || '';
        // finaly add to physics world
        this.addJoint(joint);
        return joint;

    } else { // is body

        // I'm dynamique or not
        var move = obj.move || false;

        // I can sleep or not
        var noSleep  = obj.noSleep || false;
        
        // My start position
        var p = obj.pos || [0,0,0];
        p = p.map(function(x) { return x * OIMO.INV_SCALE; });

        // My size 
        var s = obj.size || [1,1,1];
        s = s.map(function(x) { return x * OIMO.INV_SCALE; });

        // My rotation in degre
        var rot = obj.rot || [0,0,0];
        rot = rot.map(function(x) { return x * OIMO.degtorad; });
        var r = [];
        for (var i=0; i<rot.length/3; i++){
            var tmp = OIMO.EulerToAxis(rot[i+0], rot[i+1], rot[i+2]);
            r.push(tmp[0]);  r.push(tmp[1]); r.push(tmp[2]); r.push(tmp[3]);
        }

        // My physics setting
        var sc = obj.sc || new OIMO.ShapeConfig();
        if(obj.config){
            // The density of the shape.
            sc.density = obj.config[0] === undefined ? 1 : obj.config[0];
            // The coefficient of friction of the shape.
            sc.friction = obj.config[1] === undefined ? 0.4 : obj.config[1];
            // The coefficient of restitution of the shape.
            sc.restitution = obj.config[2] === undefined ? 0.2 : obj.config[2];
            // The bits of the collision groups to which the shape belongs.
            sc.belongsTo = obj.config[3] === undefined ? 1 : obj.config[3];
            // The bits of the collision groups with which the shape collides.
            sc.collidesWith = obj.config[4] === undefined ? 0xffffffff : obj.config[4];
        }

        if(obj.massPos){
            obj.massPos = obj.massPos.map(function(x) { return x * OIMO.INV_SCALE; });
            sc.relativePosition.init(obj.massPos[0], obj.massPos[1], obj.massPos[2]);
        }
        if(obj.massRot){
            obj.massRot = obj.massRot.map(function(x) { return x * OIMO.degtorad; });
            sc.relativeRotation = OIMO.EulerToMatrix(obj.massRot[0], obj.massRot[1], obj.massRot[2]);
        }
        
        // My rigidbody
        var body = new OIMO.RigidBody(p[0], p[1], p[2], r[0], r[1], r[2], r[3]);

        // My shapes
        var shapes = [];

        //if( typeof type === 'string' ) type = [type];// single shape

        var n, n2;
        for(var i=0; i<type.length; i++){
            n = i*3;
            n2 = i*4;
            switch(type[i]){
                case "sphere": shapes[i] = new OIMO.SphereShape(sc, s[n+0]); break;
                case "cylinder": shapes[i] = new OIMO.BoxShape(sc, s[n+0], s[n+1], s[n+2]); break; // fake cylinder
                case "box": shapes[i] = new OIMO.BoxShape(sc, s[n+0], s[n+1], s[n+2]); break;
            }
            body.addShape(shapes[i]);
            if(i>0){
                //shapes[i].position.init(p[0]+p[n+0], p[1]+p[n+1], p[2]+p[n+2] );
                shapes[i].relativePosition = new OIMO.Vec3( p[n+0], p[n+1], p[n+2] );
                if(r[n2+0]) shapes[i].relativeRotation = [ r[n2+0], r[n2+1], r[n2+2], r[n2+3] ];
            }
        } 
        
        // I'm static or i move
        if(move){
            if(obj.massPos || obj.massRot) body.setupMass(0x1, false);
            else body.setupMass(0x1, true);
            if(noSleep) body.allowSleep = false;
            else body.allowSleep = true;
        } else {
            body.setupMass(0x2);
        }
        
        body.name = obj.name || '';
        // finaly add to physics world
        this.addRigidBody(body);
        return body;
    }
}