OIMO.Body = function(Obj){
    var obj = Obj || {};
    if(!obj.world) return;

    this.name = obj.name || '';
    var move = obj.move || false;
    var noSleep  = obj.noSleep || false;

    // position
    var p = obj.pos || [0,0,0];
    p = p.map(function(x) { return x * OIMO.INV_SCALE; });

    // scale
    var s = obj.size || [1,1,1];
    s = s.map(function(x) { return x * OIMO.INV_SCALE; });

    // rotation in degre
    var rot = obj.rot || [0,0,0];
    rot = rot.map(function(x) { return x * OIMO.TO_RAD; });
    var r = [];
    for (var i=0; i<rot.length/3; i++){
        var tmp = OIMO.EulerToAxis(rot[i+0], rot[i+1], rot[i+2]);
        r.push(tmp[0]);  r.push(tmp[1]); r.push(tmp[2]); r.push(tmp[3]);
    }

    // physics setting
    var sc = obj.sc || new OIMO.ShapeConfig();
    if(obj.config){
        sc.density = obj.config[0] || 1;
        sc.friction = obj.config[1] || 0.5;
        sc.restitution = obj.config[2] || 0.5;
    }
    sc.position.init(p[0], p[1], p[2]);
    //sc.rotation.init();

    // the rigidbody
    this.body = new OIMO.RigidBody(r[0], r[1], r[2], r[3]);

    // the shapes
    var shapes = [];
    var type = obj.type || "box";
    if( typeof type === 'string' ) type = [type];// single shape

    var n, n2;
    for(var i=0; i<type.length; i++){
        n = i*3;
        n2 = i*4;
        
        switch(type[i]){
            case "sphere": shapes[i] = new OIMO.SphereShape(sc, s[n+0]); break;
            case "cylinder": shapes[i] = new OIMO.CylinderShape(sc, s[n+0], s[n+1]); break;
            case "box": shapes[i] = new OIMO.BoxShape(sc, s[n+0], s[n+1], s[n+2]); break;
        }

        this.body.addShape(shapes[i]);
        if(i>0){ // didn't work
            shapes[i].position.init(p[0]+p[n+0], p[1]+p[n+1], p[2]+p[n+2] );
            //shapes[i].relativePosition.init(p[n+0], p[n+1], p[n+2] );
           // shapes[i].localRelativePosition.init(p[n+0], p[n+1], p[n+2] );
            //if(r[n2+0]) shapes[i].relativeRotation = [ r[n2+0], r[n2+1], r[n2+2], r[n2+3] ];
        }
    }

    // static or move
    if(move){
        this.body.setupMass(OIMO.BODY_DYNAMIC);
        if(noSleep) this.body.allowSleep = false;
        else this.body.allowSleep = true;
    } else {
        this.body.setupMass(OIMO.BODY_STATIC);
    }

    // finaly add to physics world
    this.body.name = this.name;
    obj.world.addRigidBody(this.body);
}

OIMO.Body.prototype = {

    constructor: OIMO.Body,
    moveTo:function(pos){
        this.body.moveTo(pos);
    },
    getMatrix:function(){
        return this.body.getMatrix();
    }
}