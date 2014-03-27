OIMO.World = function(TimeStep, BroadPhaseType, Iterations){

    var broadPhaseType = BroadPhaseType || 2;
    this.timeStep = TimeStep || 1/60;
    this.iteration = Iterations || 8;

    this.rigidBodies=[];
    this.rigidBodies.length = OIMO.MAX_BODIES;
    this.numRigidBodies=0;
    this.shapes =[];
    this.shapes.length = OIMO.WORLD_MAX_SHAPES;
    this.numShapes=0;
    this.contacts=null;
    this.prevContacts=null;
    this.contactPool1=[];
    this.contactPool2=[];
    this.contactPool1.length = OIMO.MAX_CONTACTS;
    this.contactPool2.length = OIMO.MAX_CONTACTS;
    this.numContacts=0;
    this.numPrevContacts1=0;
    this.numPrevContacts2=0;
    this.joints=[];
    this.joints.length = OIMO.MAX_JOINTS;
    this.numJoints=0;
    this.numIslands=0;
    this.constraints=[];
    this.constraints.length = OIMO.MAX_CONSTRAINTS;
    this.numConstraints=0;
    this.collisionResult=new OIMO.CollisionResult(OIMO.MAX_CONTACTS);
    this.islandStack=[];
    this.islandStack.length = OIMO.MAX_BODIES;
    this.islandRigidBodies=[];
    this.islandRigidBodies.length = OIMO.MAX_BODIES;
    this.islandNumRigidBodies=0;
    this.islandConstraints=[];
    this.islandConstraints.length = OIMO.MAX_CONSTRAINTS;
    this.islandNumConstraints=0;

    switch(broadPhaseType){
        case 1: this.broadPhase = new OIMO.BruteForceBroadPhase(); break;
        case 2: default: this.broadPhase = new OIMO.SweepAndPruneBroadPhase(); break;
    }

    this.gravity = new OIMO.Vec3(0,-9.80665,0);
    this.performance = new OIMO.Performance();

    var numShapeTypes=4;
    this.detectors=[];
    this.detectors.length = numShapeTypes;
    for(var i=0;i<numShapeTypes;i++){
        this.detectors[i]=[];
        this.detectors[i].length = numShapeTypes;
    }

    this.detectors[OIMO.SHAPE_SPHERE][OIMO.SHAPE_SPHERE]=new OIMO.SphereSphereCollisionDetector();
    this.detectors[OIMO.SHAPE_SPHERE][OIMO.SHAPE_BOX]=new OIMO.SphereBoxCollisionDetector(false);
    this.detectors[OIMO.SHAPE_SPHERE][OIMO.SHAPE_CYLINDER]=new OIMO.SphereCylinderCollisionDetector(false);
    this.detectors[OIMO.SHAPE_BOX][OIMO.SHAPE_SPHERE]=new OIMO.SphereBoxCollisionDetector(true);
    this.detectors[OIMO.SHAPE_BOX][OIMO.SHAPE_BOX]=new OIMO.BoxBoxCollisionDetector();
    this.detectors[OIMO.SHAPE_CYLINDER][OIMO.SHAPE_SPHERE]=new OIMO.SphereCylinderCollisionDetector(true);
    this.detectors[OIMO.SHAPE_BOX][OIMO.SHAPE_CYLINDER]=new OIMO.BoxCylinderCollisionDetector(false);
    this.detectors[OIMO.SHAPE_CYLINDER][OIMO.SHAPE_BOX]=new OIMO.BoxCylinderCollisionDetector(true);
    this.detectors[OIMO.SHAPE_CYLINDER][OIMO.SHAPE_CYLINDER]=new OIMO.CylinderCylinderCollisionDetector();

    this.contacts=this.contactPool1;
    this.prevContacts=this.contactPool2;
    this.randX=65535;
    this.randA=98765;
    this.randB=123456789;
};

OIMO.World.prototype = {

    constructor: OIMO.World,

    clear:function(){
        this.randX=65535;
        var i, max;
        max = this.numRigidBodies;
        for (i = max - 1; i >= 0 ; i -- ) this.removeRigidBody(this.rigidBodies[i]);
        max = this.numJoints;
        for (i = max - 1; i >= 0 ; i -- ) this.removeJoint(this.joints[i]);
    },
    addRigidBody:function(rigidBody){
        if(this.numRigidBodies==OIMO.MAX_BODIES){
        throw new Error("It is not possible to add a rigid body to the world any more");
        }
        if(rigidBody.parent){
        throw new Error("It is not possible to be added to more than one world one of the rigid body");
        }
        rigidBody.awake();
        var num=rigidBody.numShapes;
        for(var i=0;i<num;i++){
            this.addShape(rigidBody.shapes[i]);
        }
        this.rigidBodies[this.numRigidBodies++]=rigidBody;
        rigidBody.parent=this;
    },
    removeRigidBody:function(rigidBody){
        var remove=null;
        for(var i=0;i<this.numRigidBodies;i++){
        if(this.rigidBodies[i]==rigidBody){
        remove=rigidBody;
        this.rigidBodies[i]=this.rigidBodies[--this.numRigidBodies];
        this.rigidBodies[this.numRigidBodies]=null;
        break;
        }
        }
        if(remove==null)return;
        remove.awake();
        var jc=remove.jointList;
        while(jc!=null){
        var joint=jc.parent;
        jc=jc.next;
        this.removeJoint(joint);
        }
        var num=remove.numShapes;
        for(i=0;i<num;i++){
        this.removeShape(remove.shapes[i]);
        }
        remove.parent=null;
    },
    addShape:function(shape){
        if(this.numShapes==OIMO.WORLD_MAX_SHAPES){
        throw new Error("It is not possible to add a shape to the world any more");
        }
        if(!shape.parent){
        throw new Error("It is not possible to be added alone to shape world");
        }
        if(shape.parent.parent){
        throw new Error("It is not possible to be added to multiple world the shape of one");
        }
        this.broadPhase.addProxy(shape.proxy);
        this.shapes[this.numShapes++]=shape;
    },
    removeShape:function(shape){
        var remove=null;
        for(var i=0;i<this.numShapes;i++){
        if(this.shapes[i]==shape){
        remove=shape;
        this.shapes[i]=this.shapes[--this.numShapes];
        this.shapes[this.numShapes]=null;
        break;
        }
        }
        if(remove==null)return;
        this.broadPhase.removeProxy(remove.proxy);
    },
    addJoint:function(joint){
        if(this.numJoints==OIMO.World.MAX_JOINTS){
        throw new Error("It is not possible to add a joint to the world any more");
        }
        if(joint.parent){
        throw new Error("It is not possible to be added to more than one world one of the joint");
        }
        var b=joint.body1;
        var jc=joint.connection1;
        b.awake();
        b.numJoints++;
        jc.next=b.jointList;
        if(b.jointList!=null){
        b.jointList.prev=jc;
        }
        b.jointList=jc;
        b=joint.body2;
        jc=joint.connection2;
        b.awake();
        b.numJoints++;
        jc.next=b.jointList;
        if(b.jointList!=null){
        b.jointList.prev=jc;
        }
        b.jointList=jc;
        this.joints[this.numJoints++]=joint;
        joint.parent=this;
    },
    removeJoint:function(joint){
        var remove=null;
        for(var i=0;i<this.numJoints;i++){
        if(this.joints[i]==joint){
        remove=joint;
        this.joints[i]=this.joints[--this.numJoints];
        this.joints[this.numJoints]=null;
        break;
        }
        }
        if(remove==null)return;
        remove.body1.awake();
        remove.body1.numJoints--;
        remove.body2.awake();
        remove.body2.numJoints--;
        var jc=remove.connection1;
        if(jc.prev!=null){
        jc.prev.next=jc.next;
        jc.prev=null;
        }
        if(jc.next!=null){
        jc.next.prev=jc.prev;
        jc.next=null;
        }
        jc=remove.connection2;
        if(jc.prev!=null){
        jc.prev.next=jc.next;
        jc.prev=null;
        }
        if(jc.next!=null){
        jc.next.prev=jc.prev;
        jc.next=null;
        }
        remove.parent=null;
    },
    getByName:function(name){
        var result = null;

        var i, max, body, joint;
        max = this.numRigidBodies;
        for (i = max - 1; i >= 0 ; i -- ){ 
            body = this.rigidBodies[i]; 
            if(body.name!== "" && body.name === name) result = body;
        }
        max = this.numJoints;
        for (i = max - 1; i >= 0 ; i -- ){ 
            joint = this.joints[i];
            if(joint.name!== "" && joint.name === name) result = joint;
        }
        return result;
    },
    step:function(){
        var time1=Date.now();
        var tmpC=this.contacts;
        this.contacts=this.prevContacts;
        this.prevContacts=tmpC;
        var num = this.numRigidBodies;
        while(num--){
        //for(var i=0;i<this.numRigidBodies;i++){
            var tmpB=this.rigidBodies[num];//this.rigidBodies[i];
            if(tmpB.sleeping){
                var lv=tmpB.linearVelocity;
                var av=tmpB.linearVelocity;
                var p=tmpB.position;
                var sp=tmpB.sleepPosition;
                var o=tmpB.orientation;
                var so=tmpB.sleepOrientation;
                if(
                lv.x!=0||lv.y!=0||lv.z!=0||
                av.x!=0||av.y!=0||av.z!=0||
                p.x!=sp.x||p.y!=sp.y||p.z!=sp.z||
                o.s!=so.s||o.x!=so.x||o.y!=so.y||o.z!=so.z
                ){
                tmpB.awake();
                continue;
                }
            }
        }
        this.detectCollisions();
        this.updateIslands();
        var time2=Date.now();

        // fps update
        if (time2 - 1000 > this.performance.time_prev) {
            this.performance.time_prev = time2;
            this.performance.fpsint = this.performance.fps; 
            this.performance.fps = 0;
        } this.performance.fps++;

        this.performance.solvingTime=time2-this.performance.solvingTime;
        this.performance.totalTime=time2-time1;
    },
    detectCollisions:function(){
        this.collectContactInfos();
        this.setupContacts();
    },
    collectContactInfos:function(){
        var time1=Date.now();
        this.broadPhase.detectPairs();
        var time2=Date.now();
        this.performance.broadPhaseTime=time2-time1;
        this.collisionResult.numContactInfos=0;
        var pairs=this.broadPhase.pairs;
        var numPairs=this.broadPhase.numPairs;
        for(var i=0;i<numPairs;i++){
            var pair=pairs[i];
            var s1=pair.shape1;
            var s2=pair.shape2;
            var detector=this.detectors[s1.type][s2.type];
            if(detector){
                detector.detectCollision(s1,s2,this.collisionResult);
                if(this.collisionResult.numContactInfos==OIMO.MAX_CONTACTS){
                    return;
                }
            }
        }
        var time3=Date.now();
        this.performance.narrowPhaseTime=time3-time2;
        this.performance.updatingTime=time3;
    },
    setupContacts:function(){
        this.numPrevContacts2=this.numPrevContacts1;
        this.numPrevContacts1=this.numContacts;
        var numSleptContacts=0;
        for(var i=0;i<this.numPrevContacts1;i++){
            var c=this.prevContacts[i];
            if(c.sleeping){
                this.prevContacts[i]=this.contacts[numSleptContacts];
                this.contacts[numSleptContacts++]=c;
            }
        }
        var contactInfos=this.collisionResult.contactInfos;
        this.numContacts=numSleptContacts+this.collisionResult.numContactInfos;
        for(i=numSleptContacts;i<this.numContacts;i++){
        if(!this.contacts[i]){
        this.contacts[i]=new OIMO.Contact();
        }
        c=this.contacts[i];
        c.setupFromContactInfo(contactInfos[i-numSleptContacts]);
        var s1=c.shape1;
        var s2=c.shape2;
        var cc;
        if(s1.numContacts<s2.numContacts)cc=s1.contactList;
        else cc=s2.contactList;
        while(cc!=null){
        var old=cc.parent;
        if(
        (old.shape1==c.shape1&&old.shape2==c.shape2||
        old.shape1==c.shape2&&old.shape2==c.shape1)&&
        old.id.equals(c.id)
        ){
        c.normalImpulse=old.normalImpulse;
        c.tangentImpulse=old.tangentImpulse;
        c.binormalImpulse=old.binormalImpulse;
        c.warmStarted=true;
        break;
        }
        cc=cc.next;
        }
        }
        for(i=this.numContacts;i<this.numPrevContacts2;i++){
        this.contacts[i].removeReferences();
        }
    },
    updateIslands:function(){
        var invTimeStep=1/this.timeStep;
        var tmpC;
        var tmpB;
        var tmpS;
        var num;
        for(var i=0;i<this.numShapes;i++){
            tmpS=this.shapes[i];
            tmpS.contactList=null;
            tmpS.numContacts=0;
        }
        for(i=0;i<this.numRigidBodies;i++){
            tmpB=this.rigidBodies[i];
            tmpB.contactList=null;
            tmpB.addedToIsland=false;
        }
        this.numConstraints=0;
        for(i=0;i<this.numContacts;i++){
        var c=this.contacts[i];
        c.addedToIsland=false;
        var cc=c.shapeConnection1;
        tmpS=c.shape1;
        cc.prev=null;
        cc.next=tmpS.contactList;
        if(tmpS.contactList!=null){
        tmpS.contactList.prev=cc;
        }
        tmpS.contactList=cc;
        tmpS.numContacts++;
        cc=c.shapeConnection2;
        tmpS=c.shape2;
        cc.prev=null;
        cc.next=tmpS.contactList;
        if(tmpS.contactList!=null){
        tmpS.contactList.prev=cc;
        }
        tmpS.contactList=cc;
        tmpS.numContacts++;
        cc=c.bodyConnection1;
        tmpB=c.body1;
        cc.prev=null;
        cc.next=tmpB.contactList;
        if(tmpB.contactList!=null){
        tmpB.contactList.prev=cc;
        }
        tmpB.contactList=cc;
        cc=c.bodyConnection2;
        tmpB=c.body2;
        cc.prev=null;
        cc.next=tmpB.contactList;
        if(tmpB.contactList!=null){
        tmpB.contactList.prev=cc;
        }
        tmpB.contactList=cc;
        this.constraints[this.numConstraints++]=c;
        }
        for(i=0;i<this.numJoints;i++){
        tmpC=this.joints[i];
        tmpC.addedToIsland=false;
        this.constraints[this.numConstraints++]=tmpC;
        }
        for(i=1;i<this.numConstraints;i++){
        var swap=(this.randX=(this.randX*this.randA+this.randB&0x7fffffff))/2147483648.0*i|0;
        tmpC=this.constraints[i];
        this.constraints[i]=this.constraints[swap];
        this.constraints[swap]=tmpC;
        }
        var time1=Date.now();
        this.performance.updatingTime=time1-this.performance.updatingTime;
        this.performance.solvingTime=time1;
        this.numIslands=0;
        for(i=0;i<this.numRigidBodies;i++){
        var base=this.rigidBodies[i];
        if(base.addedToIsland||base.type==OIMO.BODY_STATIC||base.sleeping)continue;
        this.islandNumRigidBodies=0;
        this.islandNumConstraints=0;
        var numStacks=1;
        this.islandStack[0]=base;
        base.addedToIsland=true;
        while(numStacks>0){
        tmpB=this.islandStack[--numStacks];
        tmpB.sleeping=false;
        this.islandRigidBodies[this.islandNumRigidBodies++]=tmpB;
        cc=tmpB.contactList;
        while(cc!=null){
        tmpC=cc.parent;
        if(tmpC.addedToIsland){
        cc=cc.next;
        continue;
        }
        this.islandConstraints[this.islandNumConstraints++]=tmpC;
        tmpC.addedToIsland=true;
        tmpC.sleeping=false;
        var next=cc.connectedBody;
        if(next.addedToIsland||next.type==OIMO.BODY_STATIC){
        cc=cc.next;
        continue;
        }
        this.islandStack[numStacks++]=next;
        next.addedToIsland=true;
        cc=cc.next;
        }
        var jc=tmpB.jointList;
        while(jc!=null){
        tmpC=jc.parent;
        if(tmpC.addedToIsland){
        jc=jc.next;
        continue;
        }
        this.islandConstraints[this.islandNumConstraints++]=tmpC;
        tmpC.addedToIsland=true;
        tmpC.sleeping=false;
        next=jc.connected;
        if(next.addedToIsland||next.type==OIMO.BODY_STATIC){
        jc=jc.next;
        continue;
        }
        this.islandStack[numStacks++]=next;
        next.addedToIsland=true;
        jc=jc.next;
        }
        }
        for(var j=0;j<this.islandNumRigidBodies;j++){
        tmpB=this.islandRigidBodies[j];
        tmpB.updateVelocity(this.timeStep,this.gravity);
        }
        for(j=0;j<this.islandNumConstraints;j++){
        this.islandConstraints[j].preSolve(this.timeStep,invTimeStep);
        }
        for(j=0;j<this.iteration;j++){
        for(var k=0;k<this.islandNumConstraints;k++){
        this.islandConstraints[k].solve();
        }
        }
        for(j=0;j<this.islandNumConstraints;j++){
        this.islandConstraints[j].postSolve();
        }
        var sleepTime=1000;
        for(j=0;j<this.islandNumRigidBodies;j++){
        tmpB=this.islandRigidBodies[j];
        if(!tmpB.allowSleep){
        tmpB.sleepTime=0;
        sleepTime=0;
        continue;
        }
        var vx=tmpB.linearVelocity.x;
        var vy=tmpB.linearVelocity.y;
        var vz=tmpB.linearVelocity.z;
        if(vx*vx+vy*vy+vz*vz>0.01){
        tmpB.sleepTime=0;
        sleepTime=0;
        continue;
        }
        vx=tmpB.angularVelocity.x;
        vy=tmpB.angularVelocity.y;
        vz=tmpB.angularVelocity.z;
        if(vx*vx+vy*vy+vz*vz>0.04){
        tmpB.sleepTime=0;
        sleepTime=0;
        continue;
        }
        tmpB.sleepTime+=this.timeStep;
        if(tmpB.sleepTime<sleepTime)sleepTime=tmpB.sleepTime;
        }
        if(sleepTime>0.5){
        for(j=0;j<this.islandNumRigidBodies;j++){
        tmpB=this.islandRigidBodies[j];
        tmpB.linearVelocity.init();
        tmpB.angularVelocity.init();
        tmpB.sleepPosition.copy(tmpB.position);
        tmpB.sleepOrientation.copy(tmpB.orientation);
        tmpB.sleepTime=0;
        tmpB.sleeping=true;
        }
        for(j=0;j<this.islandNumConstraints;j++){
        this.islandConstraints[j].sleeping=true;
        }
        }else{
        for(j=0;j<this.islandNumRigidBodies;j++){
        this.islandRigidBodies[j].updatePosition(this.timeStep);
        }
        }
        this.numIslands++;
        }
    }
}