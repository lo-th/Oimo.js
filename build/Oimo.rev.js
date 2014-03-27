/**
 * OimoPhysics REV 1.0.0
 * @author Saharan / http://el-ement.com/
 * 
 * Oimo.js 2014
 * @author LoTh / http://3dflashlo.wordpress.com/
 */
 
var OIMO = { REVISION: 'REV.1.0.0' };

OIMO.SHAPE_NULL = 0x0;
OIMO.SHAPE_SPHERE = 0x1;
OIMO.SHAPE_BOX = 0x2;
OIMO.SHAPE_CYLINDER = 0x3;

OIMO.MAX_BODIES = 16384;
OIMO.WORLD_MAX_SHAPES = 32768;
OIMO.MAX_CONTACTS = 65536;
OIMO.MAX_JOINTS = 16384;
OIMO.MAX_CONSTRAINTS = OIMO.MAX_CONTACTS + OIMO.MAX_JOINTS;
OIMO.MAX_SHAPES = 64;

OIMO.BODY_DYNAMIC = 0x0;
OIMO.BODY_STATIC = 0x1;

OIMO.WORLD_SCALE = 100;
OIMO.INV_SCALE = 0.01;

OIMO.TO_RAD = Math.PI / 180;

OIMO.nextID = 0;
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
OIMO.RigidBody = function(Rad,Ax,Ay,Az){
    var rad = Rad || 0;
    var ax = Ax || 0;
    var ay = Ay || 0;
    var az = Az || 0;

    this.name = "";
    this.type=0;
    this.position=null;
    this.mass=NaN;
    this.invertMass=NaN;
    this.shapes=[];
    this.shapes.length = OIMO.MAX_SHAPES;
    this.numShapes=0;
    this.parent=null;
    this.contactList=null;
    this.jointList=null;
    this.numJoints=0;
    this.addedToIsland=false;
    this.sleeping=false;

    var len=ax*ax+ay*ay+az*az;
    this.position=new OIMO.Vec3();
    if(len>0){
        len=1/Math.sqrt(len);
        ax*=len;
        ay*=len;
        az*=len;
    }
    var sin=Math.sin(rad*0.5);
    var cos=Math.cos(rad*0.5);
    this.orientation=new OIMO.Quat(cos,sin*ax,sin*ay,sin*az);
    this.linearVelocity=new OIMO.Vec3();
    this.angularVelocity=new OIMO.Vec3();
    this.sleepPosition=new OIMO.Vec3();
    this.sleepOrientation=new OIMO.Quat();
    this.rotation=new OIMO.Mat33();
    this.invertInertia=new OIMO.Mat33();
    this.localInertia=new OIMO.Mat33();
    this.invertLocalInertia=new OIMO.Mat33();

    this.matrix = new OIMO.Mat44();

    this.allowSleep=true;
    this.sleepTime=0;
}

OIMO.RigidBody.prototype = {
    constructor: OIMO.RigidBody,

    addShape:function(shape){
        if(this.numShapes==OIMO.MAX_SHAPES){
            throw new Error("It is not possible to add more shape to the rigid");
        }
        if(shape.parent){
            throw new Error("It is not possible that you add to the multi-rigid body the shape of one");
        }
        this.shapes[this.numShapes++]=shape;
        shape.parent=this;
        if(this.parent)this.parent.addShape(shape);
    },
    removeShape:function(shape,index){if(arguments.length<2){index=-1;}
        if(index<0){
        for(var i=0;i<this.numShapes;i++){
        if(shape==this.shapes[i]){
        index=i;
        break;
        }
        }
        if(index==-1){
        return;
        }
        }else if(index>=this.numShapes){
        throw new Error("The index of the shape you want to delete is out of range");
        }
        var remove=this.shapes[index];
        remove.parent=null;
        if(this.parent)this.parent.removeShape(remove);
        this.numShapes--;
        for(var j=index;j<this.numShapes;j++){
        this.shapes[j]=this.shapes[j+1];
        }
        this.shapes[this.numShapes]=null;
    },
    setupMass:function(type){
        this.type=type || OIMO.BODY_DYNAMIC;
        this.position.init();
        this.mass=0;
        this.localInertia.init(0,0,0,0,0,0,0,0,0);
        var te = this.localInertia.elements;
        var invRot=new OIMO.Mat33();
        invRot.transpose(this.rotation);
        var tmpM=new OIMO.Mat33();
        //mpM.init(0,0,0,0,0,0,0,0,0);
        var tmpV=new OIMO.Vec3();
        
        var denom=0;
        for(var i=0;i<this.numShapes;i++){
            var shape=this.shapes[i];
            shape.relativeRotation.mul(invRot,shape.rotation);
            this.position.add(this.position,tmpV.scale(shape.position,shape.mass));
            denom+=shape.mass;
            this.mass+=shape.mass;
            tmpM.mul(shape.relativeRotation,tmpM.mul(shape.localInertia,tmpM.transpose(shape.relativeRotation)));
            this.localInertia.add(this.localInertia,tmpM);
        }
        this.position.scale(this.position,1/denom);
        this.invertMass=1/this.mass;

        var xy=0;
        var yz=0;
        var zx=0;
        for(var j=0;j<this.numShapes;j++){
        shape=this.shapes[j];
        var relPos=shape.localRelativePosition;
        relPos.sub(shape.position,this.position).mulMat(invRot,relPos);
        shape.updateProxy();
        
        te[0]+=shape.mass*(relPos.y*relPos.y+relPos.z*relPos.z);
        te[4]+=shape.mass*(relPos.x*relPos.x+relPos.z*relPos.z);
        te[8]+=shape.mass*(relPos.x*relPos.x+relPos.y*relPos.y);
        xy-=shape.mass*relPos.x*relPos.y;
        yz-=shape.mass*relPos.y*relPos.z;
        zx-=shape.mass*relPos.z*relPos.x;
        }
        te[1]=xy;
        te[3]=xy;
        te[2]=zx;
        te[6]=zx;
        te[5]=yz;
        te[7]=yz;
        this.invertLocalInertia.invert(this.localInertia);
        if(type==OIMO.BODY_STATIC){
            this.invertMass=0;
            this.invertLocalInertia.init(0,0,0,0,0,0,0,0,0);
        }
        var tr = this.rotation.elements;
        var ti = this.invertLocalInertia.elements;
        
        var r00=tr[0];
        var r01=tr[1];
        var r02=tr[2];
        var r10=tr[3];
        var r11=tr[4];
        var r12=tr[5];
        var r20=tr[6];
        var r21=tr[7];
        var r22=tr[8];
        var i00=ti[0];
        var i01=ti[1];
        var i02=ti[2];
        var i10=ti[3];
        var i11=ti[4];
        var i12=ti[5];
        var i20=ti[6];
        var i21=ti[7];
        var i22=ti[8];
        var e00=r00*i00+r01*i10+r02*i20;
        var e01=r00*i01+r01*i11+r02*i21;
        var e02=r00*i02+r01*i12+r02*i22;
        var e10=r10*i00+r11*i10+r12*i20;
        var e11=r10*i01+r11*i11+r12*i21;
        var e12=r10*i02+r11*i12+r12*i22;
        var e20=r20*i00+r21*i10+r22*i20;
        var e21=r20*i01+r21*i11+r22*i21;
        var e22=r20*i02+r21*i12+r22*i22;

        var tf = this.invertInertia.elements;
        tf[0]=e00*r00+e01*r01+e02*r02;
        tf[1]=e00*r10+e01*r11+e02*r12;
        tf[2]=e00*r20+e01*r21+e02*r22;
        tf[3]=e10*r00+e11*r01+e12*r02;
        tf[4]=e10*r10+e11*r11+e12*r12;
        tf[5]=e10*r20+e11*r21+e12*r22;
        tf[6]=e20*r00+e21*r01+e22*r02;
        tf[7]=e20*r10+e21*r11+e22*r12;
        tf[8]=e20*r20+e21*r21+e22*r22;
        this.syncShapes();
        this.awake();
    },
    awake:function(){
        if(!this.allowSleep)return;
        this.sleepTime=0;
        if(this.sleeping){
            var cc=this.contactList;
            while(cc!=null){
                cc.connectedBody.sleepTime=0;
                cc.connectedBody.sleeping=false;
                cc.parent.sleeping=false;
                cc=cc.next;
            }
            var jc=this.jointList;
            while(jc!=null){
                jc.connected.sleepTime=0;
                jc.connected.sleeping=false;
                jc.parent.sleeping=false;
                jc=jc.next;
            }
        }
        this.sleeping=false;
    },
    sleep:function(){
        if(!this.allowSleep)return;
        this.linearVelocity.init();
        this.angularVelocity.init();
        this.sleepPosition.copy(this.position);
        this.sleepOrientation.copy(this.orientation);
        this.sleepTime=0;
        this.sleeping=true;
    },
    updateVelocity:function(timeStep,gravity){
        if(this.type==OIMO.BODY_DYNAMIC){
            this.linearVelocity.x+=gravity.x*timeStep;
            this.linearVelocity.y+=gravity.y*timeStep;
            this.linearVelocity.z+=gravity.z*timeStep;
        }
    },
    updatePosition:function(timeStep){
        if(!this.allowSleep)this.sleepTime=0;
        if(this.type==OIMO.BODY_STATIC){
        this.linearVelocity.x=0;
        this.linearVelocity.y=0;
        this.linearVelocity.z=0;
        this.angularVelocity.x=0;
        this.angularVelocity.y=0;
        this.angularVelocity.z=0;
        }else if(this.type==OIMO.BODY_DYNAMIC){
        var vx=this.linearVelocity.x;
        var vy=this.linearVelocity.y;
        var vz=this.linearVelocity.z;
        if(vx*vx+vy*vy+vz*vz>0.01)this.sleepTime=0;
        this.position.x+=vx*timeStep;
        this.position.y+=vy*timeStep;
        this.position.z+=vz*timeStep;
        vx=this.angularVelocity.x;
        vy=this.angularVelocity.y;
        vz=this.angularVelocity.z;
        if(vx*vx+vy*vy+vz*vz>0.025)this.sleepTime=0;
        var os=this.orientation.s;
        var ox=this.orientation.x;
        var oy=this.orientation.y;
        var oz=this.orientation.z;
        timeStep*=0.5;
        var s=(-vx*ox-vy*oy-vz*oz)*timeStep;
        var x=(vx*os+vy*oz-vz*oy)*timeStep;
        var y=(-vx*oz+vy*os+vz*ox)*timeStep;
        var z=(vx*oy-vy*ox+vz*os)*timeStep;
        os+=s;
        ox+=x;
        oy+=y;
        oz+=z;
        s=1/Math.sqrt(os*os+ox*ox+oy*oy+oz*oz);
        this.orientation.s=os*s;
        this.orientation.x=ox*s;
        this.orientation.y=oy*s;
        this.orientation.z=oz*s;
        }else{
            throw new Error("The type of rigid body of undefined");
        }
        this.syncShapes();
    },
    syncShapes:function(){
        var s=this.orientation.s;
        var x=this.orientation.x;
        var y=this.orientation.y;
        var z=this.orientation.z;
        var x2=2*x;
        var y2=2*y;
        var z2=2*z;
        var xx=x*x2;
        var yy=y*y2;
        var zz=z*z2;
        var xy=x*y2;
        var yz=y*z2;
        var xz=x*z2;
        var sx=s*x2;
        var sy=s*y2;
        var sz=s*z2;

        var tr = this.rotation.elements;
        var ti = this.invertLocalInertia.elements;

        tr[0]=1-yy-zz;
        tr[1]=xy-sz;
        tr[2]=xz+sy;
        tr[3]=xy+sz;
        tr[4]=1-xx-zz;
        tr[5]=yz-sx;
        tr[6]=xz-sy;
        tr[7]=yz+sx;
        tr[8]=1-xx-yy;

        //var tr = this.rotation.elements;
        var r00=tr[0];
        var r01=tr[1];
        var r02=tr[2];
        var r10=tr[3];
        var r11=tr[4];
        var r12=tr[5];
        var r20=tr[6];
        var r21=tr[7];
        var r22=tr[8];
        var i00=ti[0];
        var i01=ti[1];
        var i02=ti[2];
        var i10=ti[3];
        var i11=ti[4];
        var i12=ti[5];
        var i20=ti[6];
        var i21=ti[7];
        var i22=ti[8];
        var e00=r00*i00+r01*i10+r02*i20;
        var e01=r00*i01+r01*i11+r02*i21;
        var e02=r00*i02+r01*i12+r02*i22;
        var e10=r10*i00+r11*i10+r12*i20;
        var e11=r10*i01+r11*i11+r12*i21;
        var e12=r10*i02+r11*i12+r12*i22;
        var e20=r20*i00+r21*i10+r22*i20;
        var e21=r20*i01+r21*i11+r22*i21;
        var e22=r20*i02+r21*i12+r22*i22;

        var tf = this.invertInertia.elements;
        tf[0]=e00*r00+e01*r01+e02*r02;
        tf[1]=e00*r10+e01*r11+e02*r12;
        tf[2]=e00*r20+e01*r21+e02*r22;
        tf[3]=e10*r00+e11*r01+e12*r02;
        tf[4]=e10*r10+e11*r11+e12*r12;
        tf[5]=e10*r20+e11*r21+e12*r22;
        tf[6]=e20*r00+e21*r01+e22*r02;
        tf[7]=e20*r10+e21*r11+e22*r12;
        tf[8]=e20*r20+e21*r21+e22*r22;

        for(var i=0;i<this.numShapes;i++){
            var shape=this.shapes[i];
            var relPos=shape.relativePosition;
            var lRelPos=shape.localRelativePosition;
            var relRot=shape.relativeRotation.elements;
            var rot=shape.rotation.elements;
            var lx=lRelPos.x;
            var ly=lRelPos.y;
            var lz=lRelPos.z;
            relPos.x=lx*r00+ly*r01+lz*r02;
            relPos.y=lx*r10+ly*r11+lz*r12;
            relPos.z=lx*r20+ly*r21+lz*r22;
            shape.position.x=this.position.x+relPos.x;
            shape.position.y=this.position.y+relPos.y;
            shape.position.z=this.position.z+relPos.z;
            e00=relRot[0];
            e01=relRot[1];
            e02=relRot[2];
            e10=relRot[3];
            e11=relRot[4];
            e12=relRot[5];
            e20=relRot[6];
            e21=relRot[7];
            e22=relRot[8];
            rot[0]=r00*e00+r01*e10+r02*e20;
            rot[1]=r00*e01+r01*e11+r02*e21;
            rot[2]=r00*e02+r01*e12+r02*e22;
            rot[3]=r10*e00+r11*e10+r12*e20;
            rot[4]=r10*e01+r11*e11+r12*e21;
            rot[5]=r10*e02+r11*e12+r12*e22;
            rot[6]=r20*e00+r21*e10+r22*e20;
            rot[7]=r20*e01+r21*e11+r22*e21;
            rot[8]=r20*e02+r21*e12+r22*e22;
            shape.updateProxy();
        }
    },
    applyImpulse:function(position,force){
        this.linearVelocity.x+=force.x*this.invertMass;
        this.linearVelocity.y+=force.y*this.invertMass;
        this.linearVelocity.z+=force.z*this.invertMass;
        var rel=new OIMO.Vec3();
        rel.sub(position,this.position).cross(rel,force).mulMat(this.invertInertia,rel);
        this.angularVelocity.x+=rel.x;
        this.angularVelocity.y+=rel.y;
        this.angularVelocity.z+=rel.z;
    },

    
    // for three js
    setPosition:function(x,y,z){
        this.position.init(x*OIMO.INV_SCALE,y*OIMO.INV_SCALE,z*OIMO.INV_SCALE);
        this.linearVelocity.init();
        this.angularVelocity.init();
    },
    setRotation:function(x,y,z){
        /*this.position.init(x*OIMO.INV_SCALE,y*OIMO.INV_SCALE,z*OIMO.INV_SCALE);
        this.linearVelocity.init();
        this.angularVelocity.init();*/
    },
    getMatrix:function(){
        var m = this.matrix.elements;
        var r,p;
        if(!this.sleeping){
            // rotation matrix
            r = this.rotation.elements;
            m[0] = r[0];
            m[1] = r[3];
            m[2] = r[6];
            m[3] = 0;

            m[4] = r[1];
            m[5] = r[4];
            m[6] = r[7];
            m[7] = 0;

            m[8] = r[2];
            m[9] = r[5];
            m[10] = r[8];
            m[11] = 0;

            // position matrix
            p = this.position;
            m[12] = p.x*OIMO.WORLD_SCALE;
            m[13] = p.y*OIMO.WORLD_SCALE;
            m[14] = p.z*OIMO.WORLD_SCALE;
            m[15] = 0;
        } else {
            m[15] = 1;
        }

        return m;
    }
}
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
OIMO.Performance = function(){
    this.time_prev=0;
    this.fpsint=0;
    this.fps=0;
    
    this.broadPhaseTime=0;
    this.narrowPhaseTime=0;
    this.solvingTime=0;
    this.updatingTime=0;
    this.totalTime=0;
}
OIMO.Mat44 = function(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44){
    this.elements = new Float32Array(16);
    var te = this.elements;
    te[0] = ( n11 !== undefined ) ? n11 : 1; te[4] = n12 || 0; te[8] = n13 || 0; te[12] = n14 || 0;
    te[1] = n21 || 0; te[5] = ( n22 !== undefined ) ? n22 : 1; te[9] = n23 || 0; te[13] = n24 || 0;
    te[2] = n31 || 0; te[6] = n32 || 0; te[10] = ( n33 !== undefined ) ? n33 : 1; te[14] = n34 || 0;
    te[3] = n41 || 0; te[7] = n42 || 0; te[11] = n43 || 0; te[15] = ( n44 !== undefined ) ? n44 : 1;
};

OIMO.Mat44.prototype = {
    constructor: OIMO.Mat44,

    set: function ( n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44 ) {

        var te = this.elements;

        te[0] = n11; te[4] = n12; te[8] = n13; te[12] = n14;
        te[1] = n21; te[5] = n22; te[9] = n23; te[13] = n24;
        te[2] = n31; te[6] = n32; te[10] = n33; te[14] = n34;
        te[3] = n41; te[7] = n42; te[11] = n43; te[15] = n44;

        return this;
    }
}
OIMO.Mat33 = function(e00,e01,e02,e10,e11,e12,e20,e21,e22){
    this.elements = new Float32Array(9);//[];//new Float32Array(9);//new Float64Array(9);
    var te = this.elements;

    /*te[0] =  ( e00 !== undefined ) ? e00 : 1; te[1] = e01 || 0; te[2] = e02 || 0;
    te[3] = e10 || 0; te[4] =  ( e11 !== undefined ) ? e11 : 1; te[5] = e12 || 0;
    te[6] = e20 || 0; te[7] = e21 || 0; te[8] =  ( e22 !== undefined ) ? e22 : 1;*/

    this.init(
        ( e00 !== undefined ) ? e00 : 1, e01 || 0, e02 || 0,
        e10 || 0, ( e11 !== undefined ) ? e11 : 1, e12 || 0,
        e20 || 0, e21 || 0, ( e22 !== undefined ) ? e22 : 1
    );
};

OIMO.Mat33.prototype = {
    constructor: OIMO.Mat33,

    init: function(e00,e01,e02,e10,e11,e12,e20,e21,e22){
        //this.elements = [];
        var te = this.elements;
        te[0] =  ( e00 !== undefined ) ? e00 : 1; te[1] = e01 || 0; te[2] = e02 || 0;
        te[3] = e10 || 0; te[4] =  ( e11 !== undefined ) ? e11 : 1; te[5] = e12 || 0;
        te[6] = e20 || 0; te[7] = e21 || 0; te[8] =  ( e22 !== undefined ) ? e22 : 1;


        /*te[0] = e00; te[1] = e01; te[2] = e02;
        te[3] = e10; te[4] = e11; te[5] = e12;
        te[6] = e20; te[7] = e21; te[8] = e22;*/
        return this;
    },
    add: function(m1,m2){
        var te = this.elements;
        var tem1 = m1.elements;
        var tem2 = m2.elements;
        te[0] = tem1[0] + tem2[0]; te[1] = tem1[1] + tem2[1]; te[2] = tem1[2] + tem2[2];
        te[3] = tem1[3] + tem2[3]; te[4] = tem1[4] + tem2[4]; te[5] = tem1[5] + tem2[5];
        te[6] = tem1[6] + tem2[6]; te[7] = tem1[7] + tem2[7]; te[8] = tem1[8] + tem2[8];
        return this;
    },
    addEqual: function(m){
        var te = this.elements;
        var tem = m.elements;
        te[0] += tem[0]; te[1] += tem[1]; te[2] += tem[2];
        te[3] += tem[3]; te[4] += tem[4]; te[5] += tem[5];
        te[6] += tem[6]; te[7] += tem[7]; te[8] += tem[8];
        return this;
    },
    sub: function(m1,m2){
        var te = this.elements;
        var tem1 = m1.elements;
        var tem2 = m2.elements;

        te[0] = tem1[0] - tem2[0]; te[1] = tem1[1] - tem2[1]; te[2] = tem1[2] - tem2[2];
        te[3] = tem1[3] - tem2[3]; te[4] = tem1[4] - tem2[4]; te[5] = tem1[5] - tem2[5];
        te[6] = tem1[6] - tem2[6]; te[7] = tem1[7] - tem2[7]; te[8] = tem1[8] - tem2[8];
        return this;
    },
    subEqual:function(m){
        var te = this.elements;
        var tem = m.elements;
        te[0] -= tem[0]; te[1] -= tem[1]; te[2] -= tem[2];
        te[3] -= tem[3]; te[4] -= tem[4]; te[5] -= tem[5];
        te[6] -= tem[6]; te[7] -= tem[7]; te[8] -= tem[8];
        return this;
    },
    scale: function(m,s){
        var te = this.elements;
        var tm = m.elements;
        te[0] = tm[0] * s; te[1] = tm[1] * s; te[2] = tm[2] * s;
        te[3] = tm[3] * s; te[4] = tm[4] * s; te[5] = tm[5] * s;
        te[6] = tm[6] * s; te[7] = tm[7] * s; te[8] = tm[8] * s;
        return this;
    },
    scaleEqual: function(s){
        var te = this.elements;
        te[0] *= s; te[1] *= s; te[2] *= s;
        te[3] *= s; te[4] *= s; te[5] *= s;
        te[6] *= s; te[7] *= s; te[8] *= s;
        return this;
    },
    mul: function(m1,m2){
        var te = this.elements;
        var tm1 = m1.elements;
        var tm2 = m2.elements;

        var a0 = tm1[0], a3 = tm1[3], a6 = tm1[6];
        var a1 = tm1[1], a4 = tm1[4], a7 = tm1[7];
        var a2 = tm1[2], a5 = tm1[5], a8 = tm1[8];

        var b0 = tm2[0], b3 = tm2[3], b6 = tm2[6];
        var b1 = tm2[1], b4 = tm2[4], b7 = tm2[7];
        var b2 = tm2[2], b5 = tm2[5], b8 = tm2[8];

        te[0] = a0*b0 + a1*b3 + a2*b6;
        te[1] = a0*b1 + a1*b4 + a2*b7;
        te[2] = a0*b2 + a1*b5 + a2*b8;
        te[3] = a3*b0 + a4*b3 + a5*b6;
        te[4] = a3*b1 + a4*b4 + a5*b7;
        te[5] = a3*b2 + a4*b5 + a5*b8;
        te[6] = a6*b0 + a7*b3 + a8*b6;
        te[7] = a6*b1 + a7*b4 + a8*b7;
        te[8] = a6*b2 + a7*b5 + a8*b8;

        return this;
    },
    mulScale: function(m,sx,sy,sz,Prepend){
        var prepend = Prepend || false;
        var te = this.elements;
        var tm = m.elements;
        if(prepend){
            te[0] = sx*tm[0]; te[1] = sx*tm[1]; te[2] = sx*tm[2];
            te[3] = sy*tm[3]; te[4] = sy*tm[4]; te[5] = sy*tm[5];
            te[6] = sz*tm[6]; te[7] = sz*tm[7]; te[8] = sz*tm[8];
        }else{
            te[0] = tm[0]*sx; te[1] = tm[1]*sy; te[2] = tm[2]*sz;
            te[3] = tm[3]*sx; te[4] = tm[4]*sy; te[5] = tm[5]*sz;
            te[6] = tm[6]*sx; te[7] = tm[7]*sy; te[8] = tm[8]*sz;
        }
        return this;
    },
    mulRotate: function(m,rad,ax,ay,az,Prepend){
        var prepend = Prepend || false;
        var s=Math.sin(rad);
        var c=Math.cos(rad);
        var c1=1-c;
        var r00=ax*ax*c1+c;
        var r01=ax*ay*c1-az*s;
        var r02=ax*az*c1+ay*s;
        var r10=ay*ax*c1+az*s;
        var r11=ay*ay*c1+c;
        var r12=ay*az*c1-ax*s;
        var r20=az*ax*c1-ay*s;
        var r21=az*ay*c1+ax*s;
        var r22=az*az*c1+c;

        var tm = m.elements;

        var a0 = tm[0], a3 = tm[3], a6 = tm[6];
        var a1 = tm[1], a4 = tm[4], a7 = tm[7];
        var a2 = tm[2], a5 = tm[5], a8 = tm[8];

        var te = this.elements;
        
        if(prepend){
            te[0]=r00*a0+r01*a3+r02*a6;
            te[1]=r00*a1+r01*a4+r02*a7;
            te[2]=r00*a2+r01*a5+r02*a8;
            te[3]=r10*a0+r11*a3+r12*a6;
            te[4]=r10*a1+r11*a4+r12*a7;
            te[5]=r10*a2+r11*a5+r12*a8;
            te[6]=r20*a0+r21*a3+r22*a6;
            te[7]=r20*a1+r21*a4+r22*a7;
            te[8]=r20*a2+r21*a5+r22*a8;
        }else{
            te[0]=a0*r00+a1*r10+a2*r20;
            te[1]=a0*r01+a1*r11+a2*r21;
            te[2]=a0*r02+a1*r12+a2*r22;
            te[3]=a3*r00+a4*r10+a5*r20;
            te[4]=a3*r01+a4*r11+a5*r21;
            te[5]=a3*r02+a4*r12+a5*r22;
            te[6]=a6*r00+a7*r10+a8*r20;
            te[7]=a6*r01+a7*r11+a8*r21;
            te[8]=a6*r02+a7*r12+a8*r22;
        }
        return this;
    },
    transpose: function(m){
        var te = this.elements;
        var tm = m.elements;
        te[0] = tm[0]; te[1] = tm[3]; te[2] = tm[6];
        te[3] = tm[1]; te[4] = tm[4]; te[5] = tm[7];
        te[6] = tm[2]; te[7] = tm[5]; te[8] = tm[8];
        return this;
    },
    setQuat: function(q){
        var x2=2*q.x;
        var y2=2*q.y;
        var z2=2*q.z;
        var xx=q.x*x2;
        var yy=q.y*y2;
        var zz=q.z*z2;
        var xy=q.x*y2;
        var yz=q.y*z2;
        var xz=q.x*z2;
        var sx=q.s*x2;
        var sy=q.s*y2;
        var sz=q.s*z2;
        var te = this.elements;
        te[0]=1-yy-zz;
        te[1]=xy-sz;
        te[2]=xz+sy;
        te[3]=xy+sz;
        te[4]=1-xx-zz;
        te[5]=yz-sx;
        te[6]=xz-sy;
        te[7]=yz+sx;
        te[8]=1-xx-yy;
        return this;
    },
    invert: function(m){
        var te = this.elements;

        var tm = m.elements;
        var a0 = tm[0], a3 = tm[3], a6 = tm[6];
        var a1 = tm[1], a4 = tm[4], a7 = tm[7];
        var a2 = tm[2], a5 = tm[5], a8 = tm[8];

        var dt= a0 * (a4*a8-a7*a5) + a3 * (a7*a2-a1*a8) + a6 * (a1*a5-a4*a2);
        if(dt!==0)dt=1/dt;
        te[0] = dt*(a4*a8 - a5*a7);
        te[1] = dt*(a2*a7 - a1*a8);
        te[2] = dt*(a1*a5 - a2*a4);
        te[3] = dt*(a5*a6 - a3*a8);
        te[4] = dt*(a0*a8 - a2*a6);
        te[5] = dt*(a2*a3 - a0*a5);
        te[6] = dt*(a3*a7 - a4*a6);
        te[7] = dt*(a1*a6 - a0*a7);
        te[8] = dt*(a0*a4 - a1*a3);
        return this;
    },
    copy: function(m){
        var te = this.elements;
        var tem = m.elements;
        te[0] = tem[0]; te[1] = tem[1]; te[2] = tem[2];
        te[3] = tem[3]; te[4] = tem[4]; te[5] = tem[5];
        te[6] = tem[6]; te[7] = tem[7]; te[8] = tem[8];
        return this;
    },
    toEuler: function(){ // not work !!
        function clamp( x ) {
            return Math.min( Math.max( x, -1 ), 1 );
        }
        var te = this.elements;
        var m11 = te[0], m12 = te[3], m13 = te[6];
        var m21 = te[1], m22 = te[4], m23 = te[7];
        var m31 = te[2], m32 = te[5], m33 = te[8];

        var p = new OIMO.Vec3();
        var d = new OIMO.Quat();
        var s;

        p.y = Math.asin( clamp( m13 ) );

        if ( Math.abs( m13 ) < 0.99999 ) {
            p.x = Math.atan2( - m23, m33 );
            p.z = Math.atan2( - m12, m11 );
        } else {
            p.x = Math.atan2( m32, m22 );
            p.z = 0;
        }
        
        return p;
    },
    clone: function(){
        var te = this.elements;

        return new OIMO.Mat33(
            te[0], te[1], te[2],
            te[3], te[4], te[5],
            te[6], te[7], te[8]
        );
    },
    toString: function(){
        var te = this.elements;
        var text=
        "Mat33|"+te[0].toFixed(4)+", "+te[1].toFixed(4)+", "+te[2].toFixed(4)+"|\n"+
        "     |"+te[3].toFixed(4)+", "+te[4].toFixed(4)+", "+te[5].toFixed(4)+"|\n"+
        "     |"+te[6].toFixed(4)+", "+te[7].toFixed(4)+", "+te[8].toFixed(4)+"|" ;
        return text;
    }
};
OIMO.Quat = function( s, x, y, z){
    this.s=( s !== undefined ) ? s : 1;
    this.x=x || 0;
    this.y=y || 0;
    this.z=z || 0;
};

OIMO.Quat.prototype = {

    constructor: OIMO.Quat,

    init:function(s,x,y,z){
        this.s=( s !== undefined ) ? s : 1;
        this.x=x || 0;
        this.y=y || 0;
        this.z=z || 0;
        return this;
    },
    add:function(q1,q2){
        this.s=q1.s+q2.s;
        this.x=q1.x+q2.x;
        this.y=q1.y+q2.y;
        this.z=q1.z+q2.z;
        return this;
    },
    sub:function(q1,q2){
        this.s=q1.s-q2.s;
        this.x=q1.x-q2.x;
        this.y=q1.y-q2.y;
        this.z=q1.z-q2.z;
        return this;
    },
    scale:function(q,s){
        this.s=q.s*s;
        this.x=q.x*s;
        this.y=q.y*s;
        this.z=q.z*s;
        return this;
    },
    mul:function(q1,q2){
        var s=q1.s*q2.s-q1.x*q2.x-q1.y*q2.y-q1.z*q2.z;
        var x=q1.s*q2.x+q1.x*q2.s+q1.y*q2.z-q1.z*q2.y;
        var y=q1.s*q2.y-q1.x*q2.z+q1.y*q2.s+q1.z*q2.x;
        var z=q1.s*q2.z+q1.x*q2.y-q1.y*q2.x+q1.z*q2.s;
        this.s=s;
        this.x=x;
        this.y=y;
        this.z=z;
        return this;
    },
    normalize:function(q){
        var len=Math.sqrt(q.s*q.s+q.x*q.x+q.y*q.y+q.z*q.z);
        if(len>0)len=1/len;
        this.s=q.s*len;
        this.x=q.x*len;
        this.y=q.y*len;
        this.z=q.z*len;
        return this;
    },
    invert:function(q){
        this.s=-q.s;
        this.x=-q.x;
        this.y=-q.y;
        this.z=-q.z;
        return this;
    },
    length:function(){
        return Math.sqrt(this.s*this.s+this.x*this.x+this.y*this.y+this.z*this.z);
    },
    copy:function(q){
        this.s=q.s;
        this.x=q.x;
        this.y=q.y;
        this.z=q.z;
        return this;
    },
    clone:function(q){
        return new OIMO.Quat(this.s,this.x,this.y,this.z);
    },
    toString:function(){
        return"Quat["+this.s.toFixed(4)+", ("+this.x.toFixed(4)+", "+this.y.toFixed(4)+", "+this.z.toFixed(4)+")]";
    }
}
OIMO.Vec3 = function(x,y,z){
    this.x=x || 0;
    this.y=y || 0;
    this.z=z || 0;
};

OIMO.Vec3.prototype = {

    constructor: OIMO.Vec3,

    init:function(x,y,z){
        this.x=x || 0;
        this.y=y || 0;
        this.z=z || 0;
        return this;
    },
    add:function(v1,v2){
        this.x=v1.x+v2.x;
        this.y=v1.y+v2.y;
        this.z=v1.z+v2.z;
        return this;
    },
    sub:function(v1,v2){
        this.x=v1.x-v2.x;
        this.y=v1.y-v2.y;
        this.z=v1.z-v2.z;
        return this;
    },
    scale:function(v,s){
        this.x=v.x*s;
        this.y=v.y*s;
        this.z=v.z*s;
        return this;
    },
    scaleEqual: function(s){
        this.x*=s;
        this.y*=s;
        this.z*=s;
        return this;
    },
    dot:function(v){
        return this.x*v.x+this.y*v.y+this.z*v.z;
    },
    cross:function(v1,v2){
        var x=v1.y*v2.z-v1.z*v2.y;
        var y=v1.z*v2.x-v1.x*v2.z;
        var z=v1.x*v2.y-v1.y*v2.x;
        this.x=x;
        this.y=y;
        this.z=z;
        return this;
    },
    mulMat:function(m,v){
        var te = m.elements;
        var x=te[0]*v.x+te[1]*v.y+te[2]*v.z;
        var y=te[3]*v.x+te[4]*v.y+te[5]*v.z;
        var z=te[6]*v.x+te[7]*v.y+te[8]*v.z;
        this.x=x;
        this.y=y;
        this.z=z;
        return this;
    },
    normalize:function(v){
        var length=Math.sqrt(v.x*v.x+v.y*v.y+v.z*v.z);
        if(length>0)length=1/length;
        this.x=v.x*length;
        this.y=v.y*length;
        this.z=v.z*length;
        return this;
    },
    invert:function(v){
        this.x=-v.x;
        this.y=-v.y;
        this.z=-v.z;
        return this;
    },
    length:function(){
        return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z);
    },
    copy:function(v){
        this.x=v.x;
        this.y=v.y;
        this.z=v.z;
        return this;
    },
    clone:function(){
        return new OIMO.Vec3(this.x,this.y,this.z);
    },
    toString:function(){
        return"Vec3["+this.x.toFixed(4)+", "+this.y.toFixed(4)+", "+this.z.toFixed(4)+"]";
    }
}
OIMO.EulerToAxis = function( ox, oy, oz ){// angles in radians
    var c1 = Math.cos(oy*0.5);//heading
    var s1 = Math.sin(oy*0.5);
    var c2 = Math.cos(oz*0.5);//altitude
    var s2 = Math.sin(oz*0.5);
    var c3 = Math.cos(ox*0.5);//bank
    var s3 = Math.sin(ox*0.5);
    var c1c2 = c1*c2;
    var s1s2 = s1*s2;
    var w =c1c2*c3 - s1s2*s3;
    var x =c1c2*s3 + s1s2*c3;
    var y =s1*c2*c3 + c1*s2*s3;
    var z =c1*s2*c3 - s1*c2*s3;
    var angle = 2 * Math.acos(w);
    var norm = x*x+y*y+z*z;
    if (norm < 0.001) {
        x=1;
        y=z=0;
    } else {
        norm = Math.sqrt(norm);
        x /= norm;
        y /= norm;
        z /= norm;
    }
    return [angle, x, y, z];
}

OIMO.EulerToMatrix = function( ox, oy, oz ) {// angles in radians
    var ch = Math.cos(oy);//heading
    var sh = Math.sin(oy);
    var ca = Math.cos(oz);//altitude
    var sa = Math.sin(oz);
    var cb = Math.cos(ox);//bank
    var sb = Math.sin(ox);
    var mtx = new OIMO.Mat33();

    var te = mtx.elements;
    te[0] = ch * ca;
    te[1] = sh*sb - ch*sa*cb;
    te[2] = ch*sa*sb + sh*cb;
    te[3] = sa;
    te[4] = ca*cb;
    te[5] = -ca*sb;
    te[6] = -sh*ca;
    te[7] = sh*sa*cb + ch*sb;
    te[8] = -sh*sa*sb + ch*cb;
    return mtx;
}

OIMO.MatrixToEuler = function(mtx){// angles in radians
    var te = mtx.elements;
    var x, y, z;
    if (te[3] > 0.998) { // singularity at north pole
        y = Math.atan2(te[2],te[8]);
        z = Math.PI/2;
        x = 0;
    } else if (te[3] < -0.998) { // singularity at south pole
        y = Math.atan2(te[2],te[8]);
        z = -Math.PI/2;
        x = 0;
    } else {
        y = Math.atan2(-te[6],te[0]);
        x = Math.atan2(-te[5],te[4]);
        z = Math.asin(te[3]);
    }
    return [x, y, z];
}
OIMO.Distance3d = function(p1, p2){
    var xd = p2[0]-p1[0];
    var yd = p2[1]-p1[1];
    var zd = p2[2]-p1[2];
    return Math.sqrt(xd*xd + yd*yd + zd*zd);
}
OIMO.Constraint = function(){
    this.parent=null;
    this.body1=null;
    this.body2=null;
    this.addedToIsland=false;
    this.sleeping=false;
}

OIMO.Constraint.prototype = {
    constructor: OIMO.Constraint,

    preSolve:function(timeStep,invTimeStep){
        throw new Error("preSolve Method is not inherited");
    },
    solve:function(){
        throw new Error("solve Method is not inherited");
    },
    postSolve:function(){
        throw new Error("postSolve Method is not inherited");
    }
}
OIMO.Joint = function(){
    OIMO.Constraint.call( this );

    this.JOINT_NULL=0x0;
    this.JOINT_DISTANCE=0x1;
    this.JOINT_BALL=0x2;
    this.JOINT_HINGE=0x3;
    this.JOINT_HINGE2=0x4;

    this.name = "";
    this.type=0;
    this.allowCollision=false;
    this.localRelativeAnchorPosition1=new OIMO.Vec3();
    this.localRelativeAnchorPosition2=new OIMO.Vec3();
    this.relativeAnchorPosition1=new OIMO.Vec3();
    this.relativeAnchorPosition2=new OIMO.Vec3();
    this.anchorPosition1=new OIMO.Vec3();
    this.anchorPosition2=new OIMO.Vec3();
    this.connection1=new OIMO.JointConnection(this);
    this.connection2=new OIMO.JointConnection(this);

    this.matrix = new OIMO.Mat44();
}
OIMO.Joint.prototype = Object.create( OIMO.Constraint.prototype );
OIMO.Joint.prototype.preSolve = function (timeStep,invTimeStep) {
}
OIMO.Joint.prototype.solve = function () {
}
OIMO.Joint.prototype.postSolve = function () {
}


// for three js
OIMO.Joint.prototype.getMatrix = function () {
    var m = this.matrix.elements;
    var p1 = this.anchorPosition1;
    var p2 = this.anchorPosition2;
    m[0] = p1.x * OIMO.WORLD_SCALE;
    m[1] = p1.y * OIMO.WORLD_SCALE;
    m[2] = p1.z * OIMO.WORLD_SCALE;
    m[3] = 0;

    m[4] = p2.x * OIMO.WORLD_SCALE;
    m[5] = p2.y * OIMO.WORLD_SCALE;
    m[6] = p2.z * OIMO.WORLD_SCALE;
    m[7] = 0;

    return m;
}
OIMO.JointConfig = function(){
    this.localRelativeAnchorPosition1=new OIMO.Vec3();
    this.localRelativeAnchorPosition2=new OIMO.Vec3();
    this.localAxis1=new OIMO.Vec3();
    this.localAxis2=new OIMO.Vec3();
    this.allowCollision=false;
}
OIMO.JointConnection = function(parent){
    this.prev = null;
    this.next = null;
    this.connected = null;
    this.parent = parent;
}
OIMO.BallJoint = function(config,rigid1,rigid2){
    OIMO.Joint.call( this );

    this.relPos1X=NaN;
    this.relPos1Y=NaN;
    this.relPos1Z=NaN;
    this.relPos2X=NaN;
    this.relPos2Y=NaN;
    this.relPos2Z=NaN;
    this.xTorqueUnit1X=NaN;
    this.xTorqueUnit1Y=NaN;
    this.xTorqueUnit1Z=NaN;
    this.xTorqueUnit2X=NaN;
    this.xTorqueUnit2Y=NaN;
    this.xTorqueUnit2Z=NaN;
    this.yTorqueUnit1X=NaN;
    this.yTorqueUnit1Y=NaN;
    this.yTorqueUnit1Z=NaN;
    this.yTorqueUnit2X=NaN;
    this.yTorqueUnit2Y=NaN;
    this.yTorqueUnit2Z=NaN;
    this.zTorqueUnit1X=NaN;
    this.zTorqueUnit1Y=NaN;
    this.zTorqueUnit1Z=NaN;
    this.zTorqueUnit2X=NaN;
    this.zTorqueUnit2Y=NaN;
    this.zTorqueUnit2Z=NaN;
    this.invI1e00=NaN;
    this.invI1e01=NaN;
    this.invI1e02=NaN;
    this.invI1e10=NaN;
    this.invI1e11=NaN;
    this.invI1e12=NaN;
    this.invI1e20=NaN;
    this.invI1e21=NaN;
    this.invI1e22=NaN;
    this.invI2e00=NaN;
    this.invI2e01=NaN;
    this.invI2e02=NaN;
    this.invI2e10=NaN;
    this.invI2e11=NaN;
    this.invI2e12=NaN;
    this.invI2e20=NaN;
    this.invI2e21=NaN;
    this.invI2e22=NaN;
    this.d00=NaN;
    this.d01=NaN;
    this.d02=NaN;
    this.d10=NaN;
    this.d11=NaN;
    this.d12=NaN;
    this.d20=NaN;
    this.d21=NaN;
    this.d22=NaN;
    this.targetVelX=NaN;
    this.targetVelY=NaN;
    this.targetVelZ=NaN;

    this.type=this.JOINT_BALL;
    this.body1=rigid1;
    this.body2=rigid2;
    this.connection1.connected=rigid2;
    this.connection2.connected=rigid1;
    this.allowCollision=config.allowCollision;
    this.localRelativeAnchorPosition1.copy(config.localRelativeAnchorPosition1);
    this.localRelativeAnchorPosition2.copy(config.localRelativeAnchorPosition2);
    this.lVel1=this.body1.linearVelocity;
    this.lVel2=this.body2.linearVelocity;
    this.aVel1=this.body1.angularVelocity;
    this.aVel2=this.body2.angularVelocity;
    this.invM1=this.body1.invertMass;
    this.invM2=this.body2.invertMass;
    this.impulse=new OIMO.Vec3();
    this.impulseX=0;
    this.impulseY=0;
    this.impulseZ=0;
}
OIMO.BallJoint.prototype = Object.create( OIMO.Joint.prototype );
OIMO.BallJoint.prototype.preSolve = function (timeStep,invTimeStep) {
    var tmpM;
    var tmp1X;
    var tmp1Y;
    var tmp1Z;
    var tmp2X;
    var tmp2Y;
    var tmp2Z;
    var t00;
    var t01;
    var t02;
    var t10;
    var t11;
    var t12;
    var t20;
    var t21;
    var t22;
    var u00;
    var u01;
    var u02;
    var u10;
    var u11;
    var u12;
    var u20;
    var u21;
    var u22;
    tmpM=this.body1.rotation.elements;
    tmp1X=this.localRelativeAnchorPosition1.x;
    tmp1Y=this.localRelativeAnchorPosition1.y;
    tmp1Z=this.localRelativeAnchorPosition1.z;
    this.relPos1X=this.relativeAnchorPosition1.x=tmp1X*tmpM[0]+tmp1Y*tmpM[1]+tmp1Z*tmpM[2];
    this.relPos1Y=this.relativeAnchorPosition1.y=tmp1X*tmpM[3]+tmp1Y*tmpM[4]+tmp1Z*tmpM[5];
    this.relPos1Z=this.relativeAnchorPosition1.z=tmp1X*tmpM[6]+tmp1Y*tmpM[7]+tmp1Z*tmpM[8];
    tmpM=this.body2.rotation.elements;
    tmp1X=this.localRelativeAnchorPosition2.x;
    tmp1Y=this.localRelativeAnchorPosition2.y;
    tmp1Z=this.localRelativeAnchorPosition2.z;
    this.relPos2X=this.relativeAnchorPosition2.x=tmp1X*tmpM[0]+tmp1Y*tmpM[1]+tmp1Z*tmpM[2];
    this.relPos2Y=this.relativeAnchorPosition2.y=tmp1X*tmpM[3]+tmp1Y*tmpM[4]+tmp1Z*tmpM[5];
    this.relPos2Z=this.relativeAnchorPosition2.z=tmp1X*tmpM[6]+tmp1Y*tmpM[7]+tmp1Z*tmpM[8];
    this.anchorPosition1.x=this.relPos1X+this.body1.position.x;
    this.anchorPosition1.y=this.relPos1Y+this.body1.position.y;
    this.anchorPosition1.z=this.relPos1Z+this.body1.position.z;
    this.anchorPosition2.x=this.relPos2X+this.body2.position.x;
    this.anchorPosition2.y=this.relPos2Y+this.body2.position.y;
    this.anchorPosition2.z=this.relPos2Z+this.body2.position.z;
    tmpM=this.body1.invertInertia.elements;
    this.invI1e00=tmpM[0];
    this.invI1e01=tmpM[1];
    this.invI1e02=tmpM[2];
    this.invI1e10=tmpM[3];
    this.invI1e11=tmpM[4];
    this.invI1e12=tmpM[5];
    this.invI1e20=tmpM[6];
    this.invI1e21=tmpM[7];
    this.invI1e22=tmpM[8];
    tmpM=this.body2.invertInertia.elements;
    this.invI2e00=tmpM[0];
    this.invI2e01=tmpM[1];
    this.invI2e02=tmpM[2];
    this.invI2e10=tmpM[3];
    this.invI2e11=tmpM[4];
    this.invI2e12=tmpM[5];
    this.invI2e20=tmpM[6];
    this.invI2e21=tmpM[7];
    this.invI2e22=tmpM[8];
    this.xTorqueUnit1X=this.relPos1Z*this.invI1e01-this.relPos1Y*this.invI1e02;
    this.xTorqueUnit1Y=this.relPos1Z*this.invI1e11-this.relPos1Y*this.invI1e12;
    this.xTorqueUnit1Z=this.relPos1Z*this.invI1e21-this.relPos1Y*this.invI1e22;
    this.xTorqueUnit2X=this.relPos2Z*this.invI2e01-this.relPos2Y*this.invI2e02;
    this.xTorqueUnit2Y=this.relPos2Z*this.invI2e11-this.relPos2Y*this.invI2e12;
    this.xTorqueUnit2Z=this.relPos2Z*this.invI2e21-this.relPos2Y*this.invI2e22;
    this.yTorqueUnit1X=-this.relPos1Z*this.invI1e00+this.relPos1X*this.invI1e02;
    this.yTorqueUnit1Y=-this.relPos1Z*this.invI1e10+this.relPos1X*this.invI1e12;
    this.yTorqueUnit1Z=-this.relPos1Z*this.invI1e20+this.relPos1X*this.invI1e22;
    this.yTorqueUnit2X=-this.relPos2Z*this.invI2e00+this.relPos2X*this.invI2e02;
    this.yTorqueUnit2Y=-this.relPos2Z*this.invI2e10+this.relPos2X*this.invI2e12;
    this.yTorqueUnit2Z=-this.relPos2Z*this.invI2e20+this.relPos2X*this.invI2e22;
    this.zTorqueUnit1X=this.relPos1Y*this.invI1e00-this.relPos1X*this.invI1e01;
    this.zTorqueUnit1Y=this.relPos1Y*this.invI1e10-this.relPos1X*this.invI1e11;
    this.zTorqueUnit1Z=this.relPos1Y*this.invI1e20-this.relPos1X*this.invI1e21;
    this.zTorqueUnit2X=this.relPos2Y*this.invI2e00-this.relPos2X*this.invI2e01;
    this.zTorqueUnit2Y=this.relPos2Y*this.invI2e10-this.relPos2X*this.invI2e11;
    this.zTorqueUnit2Z=this.relPos2Y*this.invI2e20-this.relPos2X*this.invI2e21;
    this.d00=this.invM1+this.invM2;
    this.d01=0;
    this.d02=0;
    this.d10=0;
    this.d11=this.d00;
    this.d12=0;
    this.d20=0;
    this.d21=0;
    this.d22=this.d00;
    t01=-this.relPos1Z;
    t02=this.relPos1Y;
    t10=this.relPos1Z;
    t12=-this.relPos1X;
    t20=-this.relPos1Y;
    t21=this.relPos1X;
    u00=this.invI1e01*t10+this.invI1e02*t20;
    u01=this.invI1e00*t01+this.invI1e02*t21;
    u02=this.invI1e00*t02+this.invI1e01*t12;
    u10=this.invI1e11*t10+this.invI1e12*t20;
    u11=this.invI1e10*t01+this.invI1e12*t21;
    u12=this.invI1e10*t02+this.invI1e11*t12;
    u20=this.invI1e21*t10+this.invI1e22*t20;
    u21=this.invI1e20*t01+this.invI1e22*t21;
    u22=this.invI1e20*t02+this.invI1e21*t12;
    this.d00-=t01*u10+t02*u20;
    this.d01-=t01*u11+t02*u21;
    this.d02-=t01*u12+t02*u22;
    this.d10-=t10*u00+t12*u20;
    this.d11-=t10*u01+t12*u21;
    this.d12-=t10*u02+t12*u22;
    this.d20-=t20*u00+t21*u10;
    this.d21-=t20*u01+t21*u11;
    this.d22-=t20*u02+t21*u12;
    t01=-this.relPos2Z;
    t02=this.relPos2Y;
    t10=this.relPos2Z;
    t12=-this.relPos2X;
    t20=-this.relPos2Y;
    t21=this.relPos2X;
    u00=this.invI2e01*t10+this.invI2e02*t20;
    u01=this.invI2e00*t01+this.invI2e02*t21;
    u02=this.invI2e00*t02+this.invI2e01*t12;
    u10=this.invI2e11*t10+this.invI2e12*t20;
    u11=this.invI2e10*t01+this.invI2e12*t21;
    u12=this.invI2e10*t02+this.invI2e11*t12;
    u20=this.invI2e21*t10+this.invI2e22*t20;
    u21=this.invI2e20*t01+this.invI2e22*t21;
    u22=this.invI2e20*t02+this.invI2e21*t12;
    this.d00-=t01*u10+t02*u20;
    this.d01-=t01*u11+t02*u21;
    this.d02-=t01*u12+t02*u22;
    this.d10-=t10*u00+t12*u20;
    this.d11-=t10*u01+t12*u21;
    this.d12-=t10*u02+t12*u22;
    this.d20-=t20*u00+t21*u10;
    this.d21-=t20*u01+t21*u11;
    this.d22-=t20*u02+t21*u12;
    tmp1X=1/(this.d00*(this.d11*this.d22-this.d21*this.d12)+this.d10*(this.d21*this.d02-this.d01*this.d22)+this.d20*(this.d01*this.d12-this.d11*this.d02));
    t00=(this.d11*this.d22-this.d12*this.d21)*tmp1X;
    t01=(this.d02*this.d21-this.d01*this.d22)*tmp1X;
    t02=(this.d01*this.d12-this.d02*this.d11)*tmp1X;
    t10=(this.d12*this.d20-this.d10*this.d22)*tmp1X;
    t11=(this.d00*this.d22-this.d02*this.d20)*tmp1X;
    t12=(this.d02*this.d10-this.d00*this.d12)*tmp1X;
    t20=(this.d10*this.d21-this.d11*this.d20)*tmp1X;
    t21=(this.d01*this.d20-this.d00*this.d21)*tmp1X;
    t22=(this.d00*this.d11-this.d01*this.d10)*tmp1X;
    this.d00=t00;
    this.d01=t01;
    this.d02=t02;
    this.d10=t10;
    this.d11=t11;
    this.d12=t12;
    this.d20=t20;
    this.d21=t21;
    this.d22=t22;
    this.lVel1.x+=this.impulseX*this.invM1;
    this.lVel1.y+=this.impulseY*this.invM1;
    this.lVel1.z+=this.impulseZ*this.invM1;
    this.aVel1.x+=this.xTorqueUnit1X*this.impulseX+this.yTorqueUnit1X*this.impulseY+this.zTorqueUnit1X*this.impulseZ;
    this.aVel1.y+=this.xTorqueUnit1Y*this.impulseX+this.yTorqueUnit1Y*this.impulseY+this.zTorqueUnit1Y*this.impulseZ;
    this.aVel1.z+=this.xTorqueUnit1Z*this.impulseX+this.yTorqueUnit1Z*this.impulseY+this.zTorqueUnit1Z*this.impulseZ;
    this.lVel2.x-=this.impulseX*this.invM2;
    this.lVel2.y-=this.impulseY*this.invM2;
    this.lVel2.z-=this.impulseZ*this.invM2;
    this.aVel2.x-=this.xTorqueUnit2X*this.impulseX+this.yTorqueUnit2X*this.impulseY+this.zTorqueUnit2X*this.impulseZ;
    this.aVel2.y-=this.xTorqueUnit2Y*this.impulseX+this.yTorqueUnit2Y*this.impulseY+this.zTorqueUnit2Y*this.impulseZ;
    this.aVel2.z-=this.xTorqueUnit2Z*this.impulseX+this.yTorqueUnit2Z*this.impulseY+this.zTorqueUnit2Z*this.impulseZ;
    this.targetVelX=this.anchorPosition2.x-this.anchorPosition1.x;
    this.targetVelY=this.anchorPosition2.y-this.anchorPosition1.y;
    this.targetVelZ=this.anchorPosition2.z-this.anchorPosition1.z;
    tmp1X=Math.sqrt(this.targetVelX*this.targetVelX+this.targetVelY*this.targetVelY+this.targetVelZ*this.targetVelZ);
    if(tmp1X<0.005){
    this.targetVelX=0;
    this.targetVelY=0;
    this.targetVelZ=0;
    }else{
    tmp1X=(0.005-tmp1X)/tmp1X*invTimeStep*0.05;
    this.targetVelX*=tmp1X;
    this.targetVelY*=tmp1X;
    this.targetVelZ*=tmp1X;
    }
}
OIMO.BallJoint.prototype.solve = function () {
    var relVelX;
    var relVelY;
    var relVelZ;
    var newImpulseX;
    var newImpulseY;
    var newImpulseZ;
    relVelX=this.lVel2.x-this.lVel1.x+this.aVel2.y*this.relPos2Z-this.aVel2.z*this.relPos2Y-this.aVel1.y*this.relPos1Z+this.aVel1.z*this.relPos1Y-this.targetVelX;
    relVelY=this.lVel2.y-this.lVel1.y+this.aVel2.z*this.relPos2X-this.aVel2.x*this.relPos2Z-this.aVel1.z*this.relPos1X+this.aVel1.x*this.relPos1Z-this.targetVelY;
    relVelZ=this.lVel2.z-this.lVel1.z+this.aVel2.x*this.relPos2Y-this.aVel2.y*this.relPos2X-this.aVel1.x*this.relPos1Y+this.aVel1.y*this.relPos1X-this.targetVelZ;
    newImpulseX=relVelX*this.d00+relVelY*this.d01+relVelZ*this.d02;
    newImpulseY=relVelX*this.d10+relVelY*this.d11+relVelZ*this.d12;
    newImpulseZ=relVelX*this.d20+relVelY*this.d21+relVelZ*this.d22;
    this.impulseX+=newImpulseX;
    this.impulseY+=newImpulseY;
    this.impulseZ+=newImpulseZ;
    this.lVel1.x+=newImpulseX*this.invM1;
    this.lVel1.y+=newImpulseY*this.invM1;
    this.lVel1.z+=newImpulseZ*this.invM1;
    this.aVel1.x+=this.xTorqueUnit1X*newImpulseX+this.yTorqueUnit1X*newImpulseY+this.zTorqueUnit1X*newImpulseZ;
    this.aVel1.y+=this.xTorqueUnit1Y*newImpulseX+this.yTorqueUnit1Y*newImpulseY+this.zTorqueUnit1Y*newImpulseZ;
    this.aVel1.z+=this.xTorqueUnit1Z*newImpulseX+this.yTorqueUnit1Z*newImpulseY+this.zTorqueUnit1Z*newImpulseZ;
    this.lVel2.x-=newImpulseX*this.invM2;
    this.lVel2.y-=newImpulseY*this.invM2;
    this.lVel2.z-=newImpulseZ*this.invM2;
    this.aVel2.x-=this.xTorqueUnit2X*newImpulseX+this.yTorqueUnit2X*newImpulseY+this.zTorqueUnit2X*newImpulseZ;
    this.aVel2.y-=this.xTorqueUnit2Y*newImpulseX+this.yTorqueUnit2Y*newImpulseY+this.zTorqueUnit2Y*newImpulseZ;
    this.aVel2.z-=this.xTorqueUnit2Z*newImpulseX+this.yTorqueUnit2Z*newImpulseY+this.zTorqueUnit2Z*newImpulseZ;
}
OIMO.BallJoint.prototype.postSolve = function () {
    this.impulse.x=this.impulseX;
    this.impulse.y=this.impulseY;
    this.impulse.z=this.impulseZ;
}
OIMO.DistanceJoint = function(config,rigid1,rigid2,distance){
    OIMO.Joint.call( this );

    this.posError=NaN;
    this.norX=NaN;
    this.norY=NaN;
    this.norZ=NaN;
    this.relPos1X=NaN;
    this.relPos1Y=NaN;
    this.relPos1Z=NaN;
    this.relPos2X=NaN;
    this.relPos2Y=NaN;
    this.relPos2Z=NaN;
    this.norTorque1X=NaN;
    this.norTorque1Y=NaN;
    this.norTorque1Z=NaN;
    this.norTorque2X=NaN;
    this.norTorque2Y=NaN;
    this.norTorque2Z=NaN;
    this.norTorqueUnit1X=NaN;
    this.norTorqueUnit1Y=NaN;
    this.norTorqueUnit1Z=NaN;
    this.norTorqueUnit2X=NaN;
    this.norTorqueUnit2Y=NaN;
    this.norTorqueUnit2Z=NaN;
    this.invI1e00=NaN;
    this.invI1e01=NaN;
    this.invI1e02=NaN;
    this.invI1e10=NaN;
    this.invI1e11=NaN;
    this.invI1e12=NaN;
    this.invI1e20=NaN;
    this.invI1e21=NaN;
    this.invI1e22=NaN;
    this.invI2e00=NaN;
    this.invI2e01=NaN;
    this.invI2e02=NaN;
    this.invI2e10=NaN;
    this.invI2e11=NaN;
    this.invI2e12=NaN;
    this.invI2e20=NaN;
    this.invI2e21=NaN;
    this.invI2e22=NaN;
    this.normalDenominator=NaN;
    this.targetNormalVelocity=NaN;

    this.body1=rigid1;
    this.body2=rigid2;
    this.connection1.connected=rigid2;
    this.connection2.connected=rigid1;
    this.distance=distance;
    this.allowCollision=config.allowCollision;
    this.localRelativeAnchorPosition1.copy(config.localRelativeAnchorPosition1);
    this.localRelativeAnchorPosition2.copy(config.localRelativeAnchorPosition2);
    this.type=this.JOINT_DISTANCE;
    this.lVel1=this.body1.linearVelocity;
    this.lVel2=this.body2.linearVelocity;
    this.aVel1=this.body1.angularVelocity;
    this.aVel2=this.body2.angularVelocity;
    this.invM1=this.body1.invertMass;
    this.invM2=this.body2.invertMass;
    this.impulse=0;
}
OIMO.DistanceJoint.prototype = Object.create( OIMO.Joint.prototype );
OIMO.DistanceJoint.prototype.preSolve = function (timeStep,invTimeStep) {
    var tmpM;
    var tmp1X;
    var tmp1Y;
    var tmp1Z;
    var tmp2X;
    var tmp2Y;
    var tmp2Z;
    tmpM=this.body1.rotation.elements;
    tmp1X=this.localRelativeAnchorPosition1.x;
    tmp1Y=this.localRelativeAnchorPosition1.y;
    tmp1Z=this.localRelativeAnchorPosition1.z;
    this.relPos1X=this.relativeAnchorPosition1.x=tmp1X*tmpM[0]+tmp1Y*tmpM[1]+tmp1Z*tmpM[2];
    this.relPos1Y=this.relativeAnchorPosition1.y=tmp1X*tmpM[3]+tmp1Y*tmpM[4]+tmp1Z*tmpM[5];
    this.relPos1Z=this.relativeAnchorPosition1.z=tmp1X*tmpM[6]+tmp1Y*tmpM[7]+tmp1Z*tmpM[8];
    tmpM=this.body2.rotation.elements;
    tmp1X=this.localRelativeAnchorPosition2.x;
    tmp1Y=this.localRelativeAnchorPosition2.y;
    tmp1Z=this.localRelativeAnchorPosition2.z;
    this.relPos2X=this.relativeAnchorPosition2.x=tmp1X*tmpM[0]+tmp1Y*tmpM[1]+tmp1Z*tmpM[2];
    this.relPos2Y=this.relativeAnchorPosition2.y=tmp1X*tmpM[3]+tmp1Y*tmpM[4]+tmp1Z*tmpM[5];
    this.relPos2Z=this.relativeAnchorPosition2.z=tmp1X*tmpM[6]+tmp1Y*tmpM[7]+tmp1Z*tmpM[8];
    this.norX=(this.anchorPosition2.x=this.relPos2X+this.body2.position.x)-(this.anchorPosition1.x=this.relPos1X+this.body1.position.x);
    this.norY=(this.anchorPosition2.y=this.relPos2Y+this.body2.position.y)-(this.anchorPosition1.y=this.relPos1Y+this.body1.position.y);
    this.norZ=(this.anchorPosition2.z=this.relPos2Z+this.body2.position.z)-(this.anchorPosition1.z=this.relPos1Z+this.body1.position.z);
    tmp1X=Math.sqrt(this.norX*this.norX+this.norY*this.norY+this.norZ*this.norZ);
    this.posError=this.distance-tmp1X;
    if(tmp1X>0)tmp1X=1/tmp1X;
    this.norX*=tmp1X;
    this.norY*=tmp1X;
    this.norZ*=tmp1X;
    tmpM=this.body1.invertInertia.elements;
    this.invI1e00=tmpM[0];
    this.invI1e01=tmpM[1];
    this.invI1e02=tmpM[2];
    this.invI1e10=tmpM[3];
    this.invI1e11=tmpM[4];
    this.invI1e12=tmpM[5];
    this.invI1e20=tmpM[6];
    this.invI1e21=tmpM[7];
    this.invI1e22=tmpM[8];
    tmpM=this.body2.invertInertia.elements;
    this.invI2e00=tmpM[0];
    this.invI2e01=tmpM[1];
    this.invI2e02=tmpM[2];
    this.invI2e10=tmpM[3];
    this.invI2e11=tmpM[4];
    this.invI2e12=tmpM[5];
    this.invI2e20=tmpM[6];
    this.invI2e21=tmpM[7];
    this.invI2e22=tmpM[8];
    this.norTorque1X=this.relPos1Y*this.norZ-this.relPos1Z*this.norY;
    this.norTorque1Y=this.relPos1Z*this.norX-this.relPos1X*this.norZ;
    this.norTorque1Z=this.relPos1X*this.norY-this.relPos1Y*this.norX;
    this.norTorque2X=this.relPos2Y*this.norZ-this.relPos2Z*this.norY;
    this.norTorque2Y=this.relPos2Z*this.norX-this.relPos2X*this.norZ;
    this.norTorque2Z=this.relPos2X*this.norY-this.relPos2Y*this.norX;
    this.norTorqueUnit1X=this.norTorque1X*this.invI1e00+this.norTorque1Y*this.invI1e01+this.norTorque1Z*this.invI1e02;
    this.norTorqueUnit1Y=this.norTorque1X*this.invI1e10+this.norTorque1Y*this.invI1e11+this.norTorque1Z*this.invI1e12;
    this.norTorqueUnit1Z=this.norTorque1X*this.invI1e20+this.norTorque1Y*this.invI1e21+this.norTorque1Z*this.invI1e22;
    this.norTorqueUnit2X=this.norTorque2X*this.invI2e00+this.norTorque2Y*this.invI2e01+this.norTorque2Z*this.invI2e02;
    this.norTorqueUnit2Y=this.norTorque2X*this.invI2e10+this.norTorque2Y*this.invI2e11+this.norTorque2Z*this.invI2e12;
    this.norTorqueUnit2Z=this.norTorque2X*this.invI2e20+this.norTorque2Y*this.invI2e21+this.norTorque2Z*this.invI2e22;
    tmp1X=this.norTorque1X*this.invI1e00+this.norTorque1Y*this.invI1e01+this.norTorque1Z*this.invI1e02;
    tmp1Y=this.norTorque1X*this.invI1e10+this.norTorque1Y*this.invI1e11+this.norTorque1Z*this.invI1e12;
    tmp1Z=this.norTorque1X*this.invI1e20+this.norTorque1Y*this.invI1e21+this.norTorque1Z*this.invI1e22;
    tmp2X=tmp1Y*this.relPos1Z-tmp1Z*this.relPos1Y;
    tmp2Y=tmp1Z*this.relPos1X-tmp1X*this.relPos1Z;
    tmp2Z=tmp1X*this.relPos1Y-tmp1Y*this.relPos1X;
    tmp1X=this.norTorque2X*this.invI2e00+this.norTorque2Y*this.invI2e01+this.norTorque2Z*this.invI2e02;
    tmp1Y=this.norTorque2X*this.invI2e10+this.norTorque2Y*this.invI2e11+this.norTorque2Z*this.invI2e12;
    tmp1Z=this.norTorque2X*this.invI2e20+this.norTorque2Y*this.invI2e21+this.norTorque2Z*this.invI2e22;
    tmp2X+=tmp1Y*this.relPos2Z-tmp1Z*this.relPos2Y;
    tmp2Y+=tmp1Z*this.relPos2X-tmp1X*this.relPos2Z;
    tmp2Z+=tmp1X*this.relPos2Y-tmp1Y*this.relPos2X;
    this.normalDenominator=1/(this.invM1+this.invM2+this.norX*tmp2X+this.norY*tmp2Y+this.norZ*tmp2Z);
    tmp1X=this.norX*this.impulse;
    tmp1Y=this.norY*this.impulse;
    tmp1Z=this.norZ*this.impulse;
    this.lVel1.x+=tmp1X*this.invM1;
    this.lVel1.y+=tmp1Y*this.invM1;
    this.lVel1.z+=tmp1Z*this.invM1;
    this.aVel1.x+=this.norTorqueUnit1X*this.impulse;
    this.aVel1.y+=this.norTorqueUnit1Y*this.impulse;
    this.aVel1.z+=this.norTorqueUnit1Z*this.impulse;
    this.lVel2.x-=tmp1X*this.invM2;
    this.lVel2.y-=tmp1Y*this.invM2;
    this.lVel2.z-=tmp1Z*this.invM2;
    this.aVel2.x-=this.norTorqueUnit2X*this.impulse;
    this.aVel2.y-=this.norTorqueUnit2Y*this.impulse;
    this.aVel2.z-=this.norTorqueUnit2Z*this.impulse;
    if(this.posError<-0.005)this.posError+=0.005;
    else if(this.posError>0.005)this.posError-=0.005;
    else this.posError=0;
    this.targetNormalVelocity=this.posError*invTimeStep*0.05;
}
OIMO.DistanceJoint.prototype.solve = function () {
    var newImpulse;
    var rvn;
    var forceX;
    var forceY;
    var forceZ;
    var tmpX;
    var tmpY;
    var tmpZ;
    rvn=
    (this.lVel2.x-this.lVel1.x)*this.norX+(this.lVel2.y-this.lVel1.y)*this.norY+(this.lVel2.z-this.lVel1.z)*this.norZ+
    this.aVel2.x*this.norTorque2X+this.aVel2.y*this.norTorque2Y+this.aVel2.z*this.norTorque2Z-
    this.aVel1.x*this.norTorque1X-this.aVel1.y*this.norTorque1Y-this.aVel1.z*this.norTorque1Z
    ;
    newImpulse=(rvn-this.targetNormalVelocity)*this.normalDenominator;
    this.impulse+=newImpulse;
    forceX=this.norX*newImpulse;
    forceY=this.norY*newImpulse;
    forceZ=this.norZ*newImpulse;
    this.lVel1.x+=forceX*this.invM1;
    this.lVel1.y+=forceY*this.invM1;
    this.lVel1.z+=forceZ*this.invM1;
    this.aVel1.x+=this.norTorqueUnit1X*newImpulse;
    this.aVel1.y+=this.norTorqueUnit1Y*newImpulse;
    this.aVel1.z+=this.norTorqueUnit1Z*newImpulse;
    this.lVel2.x-=forceX*this.invM2;
    this.lVel2.y-=forceY*this.invM2;
    this.lVel2.z-=forceZ*this.invM2;
    this.aVel2.x-=this.norTorqueUnit2X*newImpulse;
    this.aVel2.y-=this.norTorqueUnit2Y*newImpulse;
    this.aVel2.z-=this.norTorqueUnit2Z*newImpulse;
}
OIMO.DistanceJoint.prototype.postSolve = function () {
}
OIMO.HingeJoint = function(config,rigid1,rigid2){
    OIMO.Joint.call( this );

    this.enableLimits=false;
    this.lowerLimit=NaN;
    this.upperLimit=NaN;
    this.limitSign=0;
    this.enableMotor=false;
    this.motorSpeed=NaN;
    this.maxMotorTorque=NaN;
    this.stepMotorTorque=NaN;
    this.axis1X=NaN;
    this.axis1Y=NaN;
    this.axis1Z=NaN;
    this.axis2X=NaN;
    this.axis2Y=NaN;
    this.axis2Z=NaN;
    this.angAxis1X=NaN;
    this.angAxis1Y=NaN;
    this.angAxis1Z=NaN;
    this.angAxis2X=NaN;
    this.angAxis2Y=NaN;
    this.angAxis2Z=NaN;
    this.norX=NaN;
    this.norY=NaN;
    this.norZ=NaN;
    this.tanX=NaN;
    this.tanY=NaN;
    this.tanZ=NaN;
    this.binX=NaN;
    this.binY=NaN;
    this.binZ=NaN;
    this.hingeAngle=NaN;
    this.relPos1X=NaN;
    this.relPos1Y=NaN;
    this.relPos1Z=NaN;
    this.relPos2X=NaN;
    this.relPos2Y=NaN;
    this.relPos2Z=NaN;
    this.xTorqueUnit1X=NaN;
    this.xTorqueUnit1Y=NaN;
    this.xTorqueUnit1Z=NaN;
    this.xTorqueUnit2X=NaN;
    this.xTorqueUnit2Y=NaN;
    this.xTorqueUnit2Z=NaN;
    this.yTorqueUnit1X=NaN;
    this.yTorqueUnit1Y=NaN;
    this.yTorqueUnit1Z=NaN;
    this.yTorqueUnit2X=NaN;
    this.yTorqueUnit2Y=NaN;
    this.yTorqueUnit2Z=NaN;
    this.zTorqueUnit1X=NaN;
    this.zTorqueUnit1Y=NaN;
    this.zTorqueUnit1Z=NaN;
    this.zTorqueUnit2X=NaN;
    this.zTorqueUnit2Y=NaN;
    this.zTorqueUnit2Z=NaN;
    this.invI1e00=NaN;
    this.invI1e01=NaN;
    this.invI1e02=NaN;
    this.invI1e10=NaN;
    this.invI1e11=NaN;
    this.invI1e12=NaN;
    this.invI1e20=NaN;
    this.invI1e21=NaN;
    this.invI1e22=NaN;
    this.invI2e00=NaN;
    this.invI2e01=NaN;
    this.invI2e02=NaN;
    this.invI2e10=NaN;
    this.invI2e11=NaN;
    this.invI2e12=NaN;
    this.invI2e20=NaN;
    this.invI2e21=NaN;
    this.invI2e22=NaN;
    this.d00=NaN;
    this.d01=NaN;
    this.d02=NaN;
    this.d10=NaN;
    this.d11=NaN;
    this.d12=NaN;
    this.d20=NaN;
    this.d21=NaN;
    this.d22=NaN;
    this.norDenominator=NaN;
    this.tanDenominator=NaN;
    this.binDenominator=NaN;
    this.invNorDenominator=NaN;
    this.targetVelX=NaN;
    this.targetVelY=NaN;
    this.targetVelZ=NaN;
    this.targetAngVelNor=NaN;
    this.targetAngVelTan=NaN;
    this.targetAngVelBin=NaN;

    this.body1=rigid1;
    this.body2=rigid2;
    this.connection1.connected=rigid2;
    this.connection2.connected=rigid1;
    this.localAxis1=new OIMO.Vec3();
    this.localAxis2=new OIMO.Vec3();
    this.localAxis1.normalize(config.localAxis1);
    this.localAxis2.normalize(config.localAxis2);
    var len;
    this.localAxis1X=this.localAxis1.x;
    this.localAxis1Y=this.localAxis1.y;
    this.localAxis1Z=this.localAxis1.z;
    this.localAngAxis1X=this.localAxis1Y*this.localAxis1X-this.localAxis1Z*this.localAxis1Z;
    this.localAngAxis1Y=-this.localAxis1Z*this.localAxis1Y-this.localAxis1X*this.localAxis1X;
    this.localAngAxis1Z=this.localAxis1X*this.localAxis1Z+this.localAxis1Y*this.localAxis1Y;
    len=1/Math.sqrt(this.localAngAxis1X*this.localAngAxis1X+this.localAngAxis1Y*this.localAngAxis1Y+this.localAngAxis1Z*this.localAngAxis1Z);
    this.localAngAxis1X*=len;
    this.localAngAxis1Y*=len;
    this.localAngAxis1Z*=len;
    this.localAxis2X=this.localAxis2.x;
    this.localAxis2Y=this.localAxis2.y;
    this.localAxis2Z=this.localAxis2.z;
    this.localAngAxis2X=this.localAxis2Y*this.localAxis2X-this.localAxis2Z*this.localAxis2Z;
    this.localAngAxis2Y=-this.localAxis2Z*this.localAxis2Y-this.localAxis2X*this.localAxis2X;
    this.localAngAxis2Z=this.localAxis2X*this.localAxis2Z+this.localAxis2Y*this.localAxis2Y;
    len=1/Math.sqrt(this.localAngAxis2X*this.localAngAxis2X+this.localAngAxis2Y*this.localAngAxis2Y+this.localAngAxis2Z*this.localAngAxis2Z);
    this.localAngAxis2X*=len;
    this.localAngAxis2Y*=len;
    this.localAngAxis2Z*=len;
    this.allowCollision=config.allowCollision;
    this.localRelativeAnchorPosition1.copy(config.localRelativeAnchorPosition1);
    this.localRelativeAnchorPosition2.copy(config.localRelativeAnchorPosition2);
    this.type=this.JOINT_HINGE;
    this.lVel1=this.body1.linearVelocity;
    this.lVel2=this.body2.linearVelocity;
    this.aVel1=this.body1.angularVelocity;
    this.aVel2=this.body2.angularVelocity;
    this.invM1=this.body1.invertMass;
    this.invM2=this.body2.invertMass;
    this.impulse=new OIMO.Vec3();
    this.torque=new OIMO.Vec3();
    this.impulseX=0;
    this.impulseY=0;
    this.impulseZ=0;
    this.limitTorque=0;
    this.motorTorque=0;
    this.torqueX=0;
    this.torqueY=0;
    this.torqueZ=0;
    this.torqueTan=0;
    this.torqueBin=0;
}
OIMO.HingeJoint.prototype = Object.create( OIMO.Joint.prototype );
OIMO.HingeJoint.prototype.preSolve = function (timeStep,invTimeStep) {
    var tmpM;
    var tmp1X;
    var tmp1Y;
    var tmp1Z;
    var tmp2X;
    var tmp2Y;
    var tmp2Z;
    var t00;
    var t01;
    var t02;
    var t10;
    var t11;
    var t12;
    var t20;
    var t21;
    var t22;
    var u00;
    var u01;
    var u02;
    var u10;
    var u11;
    var u12;
    var u20;
    var u21;
    var u22;
    tmpM=this.body1.rotation.elements;
    this.axis1X=this.localAxis1X*tmpM[0]+this.localAxis1Y*tmpM[1]+this.localAxis1Z*tmpM[2];
    this.axis1Y=this.localAxis1X*tmpM[3]+this.localAxis1Y*tmpM[4]+this.localAxis1Z*tmpM[5];
    this.axis1Z=this.localAxis1X*tmpM[6]+this.localAxis1Y*tmpM[7]+this.localAxis1Z*tmpM[8];
    this.angAxis1X=this.localAngAxis1X*tmpM[0]+this.localAngAxis1Y*tmpM[1]+this.localAngAxis1Z*tmpM[2];
    this.angAxis1Y=this.localAngAxis1X*tmpM[3]+this.localAngAxis1Y*tmpM[4]+this.localAngAxis1Z*tmpM[5];
    this.angAxis1Z=this.localAngAxis1X*tmpM[6]+this.localAngAxis1Y*tmpM[7]+this.localAngAxis1Z*tmpM[8];
    tmp1X=this.localRelativeAnchorPosition1.x;
    tmp1Y=this.localRelativeAnchorPosition1.y;
    tmp1Z=this.localRelativeAnchorPosition1.z;
    this.relPos1X=this.relativeAnchorPosition1.x=tmp1X*tmpM[0]+tmp1Y*tmpM[1]+tmp1Z*tmpM[2];
    this.relPos1Y=this.relativeAnchorPosition1.y=tmp1X*tmpM[3]+tmp1Y*tmpM[4]+tmp1Z*tmpM[5];
    this.relPos1Z=this.relativeAnchorPosition1.z=tmp1X*tmpM[6]+tmp1Y*tmpM[7]+tmp1Z*tmpM[8];
    tmpM=this.body2.rotation.elements;
    this.axis2X=this.localAxis2X*tmpM[0]+this.localAxis2Y*tmpM[1]+this.localAxis2Z*tmpM[2];
    this.axis2Y=this.localAxis2X*tmpM[3]+this.localAxis2Y*tmpM[4]+this.localAxis2Z*tmpM[5];
    this.axis2Z=this.localAxis2X*tmpM[6]+this.localAxis2Y*tmpM[7]+this.localAxis2Z*tmpM[8];
    this.angAxis2X=this.localAngAxis2X*tmpM[0]+this.localAngAxis2Y*tmpM[1]+this.localAngAxis2Z*tmpM[2];
    this.angAxis2Y=this.localAngAxis2X*tmpM[3]+this.localAngAxis2Y*tmpM[4]+this.localAngAxis2Z*tmpM[5];
    this.angAxis2Z=this.localAngAxis2X*tmpM[6]+this.localAngAxis2Y*tmpM[7]+this.localAngAxis2Z*tmpM[8];
    tmp1X=this.localRelativeAnchorPosition2.x;
    tmp1Y=this.localRelativeAnchorPosition2.y;
    tmp1Z=this.localRelativeAnchorPosition2.z;
    this.relPos2X=this.relativeAnchorPosition2.x=tmp1X*tmpM[0]+tmp1Y*tmpM[1]+tmp1Z*tmpM[2];
    this.relPos2Y=this.relativeAnchorPosition2.y=tmp1X*tmpM[3]+tmp1Y*tmpM[4]+tmp1Z*tmpM[5];
    this.relPos2Z=this.relativeAnchorPosition2.z=tmp1X*tmpM[6]+tmp1Y*tmpM[7]+tmp1Z*tmpM[8];
    this.anchorPosition1.x=this.relPos1X+this.body1.position.x;
    this.anchorPosition1.y=this.relPos1Y+this.body1.position.y;
    this.anchorPosition1.z=this.relPos1Z+this.body1.position.z;
    this.anchorPosition2.x=this.relPos2X+this.body2.position.x;
    this.anchorPosition2.y=this.relPos2Y+this.body2.position.y;
    this.anchorPosition2.z=this.relPos2Z+this.body2.position.z;
    tmp1X=1/(this.invM1+this.invM2);
    this.norX=(this.axis1X*this.invM1+this.axis2X*this.invM2)*tmp1X;
    this.norY=(this.axis1Y*this.invM1+this.axis2Y*this.invM2)*tmp1X;
    this.norZ=(this.axis1Z*this.invM1+this.axis2Z*this.invM2)*tmp1X;
    tmp1X=Math.sqrt(this.norX*this.norX+this.norY*this.norY+this.norZ*this.norZ);
    if(tmp1X>0)tmp1X=1/tmp1X;
    this.norX*=tmp1X;
    this.norY*=tmp1X;
    this.norZ*=tmp1X;
    this.tanX=this.norY*this.norX-this.norZ*this.norZ;
    this.tanY=-this.norZ*this.norY-this.norX*this.norX;
    this.tanZ=this.norX*this.norZ+this.norY*this.norY;
    tmp1X=1/Math.sqrt(this.tanX*this.tanX+this.tanY*this.tanY+this.tanZ*this.tanZ);
    this.tanX*=tmp1X;
    this.tanY*=tmp1X;
    this.tanZ*=tmp1X;
    this.binX=this.norY*this.tanZ-this.norZ*this.tanY;
    this.binY=this.norZ*this.tanX-this.norX*this.tanZ;
    this.binZ=this.norX*this.tanY-this.norY*this.tanX;
    if(
    this.norX*(this.angAxis1Y*this.angAxis2Z-this.angAxis1Z*this.angAxis2Y)+
    this.norY*(this.angAxis1Z*this.angAxis2X-this.angAxis1X*this.angAxis2Z)+
    this.norZ*(this.angAxis1X*this.angAxis2Y-this.angAxis1Y*this.angAxis2X)<0
    ){
    this.hingeAngle=-Math.acos(this.angAxis1X*this.angAxis2X+this.angAxis1Y*this.angAxis2Y+this.angAxis1Z*this.angAxis2Z);
    }else{
    this.hingeAngle=Math.acos(this.angAxis1X*this.angAxis2X+this.angAxis1Y*this.angAxis2Y+this.angAxis1Z*this.angAxis2Z);
    }
    tmpM=this.body1.invertInertia.elements;
    this.invI1e00=tmpM[0];
    this.invI1e01=tmpM[1];
    this.invI1e02=tmpM[2];
    this.invI1e10=tmpM[3];
    this.invI1e11=tmpM[4];
    this.invI1e12=tmpM[5];
    this.invI1e20=tmpM[6];
    this.invI1e21=tmpM[7];
    this.invI1e22=tmpM[8];
    tmpM=this.body2.invertInertia.elements;
    this.invI2e00=tmpM[0];
    this.invI2e01=tmpM[1];
    this.invI2e02=tmpM[2];
    this.invI2e10=tmpM[3];
    this.invI2e11=tmpM[4];
    this.invI2e12=tmpM[5];
    this.invI2e20=tmpM[6];
    this.invI2e21=tmpM[7];
    this.invI2e22=tmpM[8];
    this.xTorqueUnit1X=this.relPos1Z*this.invI1e01-this.relPos1Y*this.invI1e02;
    this.xTorqueUnit1Y=this.relPos1Z*this.invI1e11-this.relPos1Y*this.invI1e12;
    this.xTorqueUnit1Z=this.relPos1Z*this.invI1e21-this.relPos1Y*this.invI1e22;
    this.xTorqueUnit2X=this.relPos2Z*this.invI2e01-this.relPos2Y*this.invI2e02;
    this.xTorqueUnit2Y=this.relPos2Z*this.invI2e11-this.relPos2Y*this.invI2e12;
    this.xTorqueUnit2Z=this.relPos2Z*this.invI2e21-this.relPos2Y*this.invI2e22;
    this.yTorqueUnit1X=-this.relPos1Z*this.invI1e00+this.relPos1X*this.invI1e02;
    this.yTorqueUnit1Y=-this.relPos1Z*this.invI1e10+this.relPos1X*this.invI1e12;
    this.yTorqueUnit1Z=-this.relPos1Z*this.invI1e20+this.relPos1X*this.invI1e22;
    this.yTorqueUnit2X=-this.relPos2Z*this.invI2e00+this.relPos2X*this.invI2e02;
    this.yTorqueUnit2Y=-this.relPos2Z*this.invI2e10+this.relPos2X*this.invI2e12;
    this.yTorqueUnit2Z=-this.relPos2Z*this.invI2e20+this.relPos2X*this.invI2e22;
    this.zTorqueUnit1X=this.relPos1Y*this.invI1e00-this.relPos1X*this.invI1e01;
    this.zTorqueUnit1Y=this.relPos1Y*this.invI1e10-this.relPos1X*this.invI1e11;
    this.zTorqueUnit1Z=this.relPos1Y*this.invI1e20-this.relPos1X*this.invI1e21;
    this.zTorqueUnit2X=this.relPos2Y*this.invI2e00-this.relPos2X*this.invI2e01;
    this.zTorqueUnit2Y=this.relPos2Y*this.invI2e10-this.relPos2X*this.invI2e11;
    this.zTorqueUnit2Z=this.relPos2Y*this.invI2e20-this.relPos2X*this.invI2e21;
    this.d00=this.invM1+this.invM2;
    this.d01=0;
    this.d02=0;
    this.d10=0;
    this.d11=this.d00;
    this.d12=0;
    this.d20=0;
    this.d21=0;
    this.d22=this.d00;
    t01=-this.relPos1Z;
    t02=this.relPos1Y;
    t10=this.relPos1Z;
    t12=-this.relPos1X;
    t20=-this.relPos1Y;
    t21=this.relPos1X;
    u00=this.invI1e01*t10+this.invI1e02*t20;
    u01=this.invI1e00*t01+this.invI1e02*t21;
    u02=this.invI1e00*t02+this.invI1e01*t12;
    u10=this.invI1e11*t10+this.invI1e12*t20;
    u11=this.invI1e10*t01+this.invI1e12*t21;
    u12=this.invI1e10*t02+this.invI1e11*t12;
    u20=this.invI1e21*t10+this.invI1e22*t20;
    u21=this.invI1e20*t01+this.invI1e22*t21;
    u22=this.invI1e20*t02+this.invI1e21*t12;
    this.d00-=t01*u10+t02*u20;
    this.d01-=t01*u11+t02*u21;
    this.d02-=t01*u12+t02*u22;
    this.d10-=t10*u00+t12*u20;
    this.d11-=t10*u01+t12*u21;
    this.d12-=t10*u02+t12*u22;
    this.d20-=t20*u00+t21*u10;
    this.d21-=t20*u01+t21*u11;
    this.d22-=t20*u02+t21*u12;
    t01=-this.relPos2Z;
    t02=this.relPos2Y;
    t10=this.relPos2Z;
    t12=-this.relPos2X;
    t20=-this.relPos2Y;
    t21=this.relPos2X;
    u00=this.invI2e01*t10+this.invI2e02*t20;
    u01=this.invI2e00*t01+this.invI2e02*t21;
    u02=this.invI2e00*t02+this.invI2e01*t12;
    u10=this.invI2e11*t10+this.invI2e12*t20;
    u11=this.invI2e10*t01+this.invI2e12*t21;
    u12=this.invI2e10*t02+this.invI2e11*t12;
    u20=this.invI2e21*t10+this.invI2e22*t20;
    u21=this.invI2e20*t01+this.invI2e22*t21;
    u22=this.invI2e20*t02+this.invI2e21*t12;
    this.d00-=t01*u10+t02*u20;
    this.d01-=t01*u11+t02*u21;
    this.d02-=t01*u12+t02*u22;
    this.d10-=t10*u00+t12*u20;
    this.d11-=t10*u01+t12*u21;
    this.d12-=t10*u02+t12*u22;
    this.d20-=t20*u00+t21*u10;
    this.d21-=t20*u01+t21*u11;
    this.d22-=t20*u02+t21*u12;
    tmp1X=1/(this.d00*(this.d11*this.d22-this.d21*this.d12)+this.d10*(this.d21*this.d02-this.d01*this.d22)+this.d20*(this.d01*this.d12-this.d11*this.d02));
    t00=(this.d11*this.d22-this.d12*this.d21)*tmp1X;
    t01=(this.d02*this.d21-this.d01*this.d22)*tmp1X;
    t02=(this.d01*this.d12-this.d02*this.d11)*tmp1X;
    t10=(this.d12*this.d20-this.d10*this.d22)*tmp1X;
    t11=(this.d00*this.d22-this.d02*this.d20)*tmp1X;
    t12=(this.d02*this.d10-this.d00*this.d12)*tmp1X;
    t20=(this.d10*this.d21-this.d11*this.d20)*tmp1X;
    t21=(this.d01*this.d20-this.d00*this.d21)*tmp1X;
    t22=(this.d00*this.d11-this.d01*this.d10)*tmp1X;
    this.d00=t00;
    this.d01=t01;
    this.d02=t02;
    this.d10=t10;
    this.d11=t11;
    this.d12=t12;
    this.d20=t20;
    this.d21=t21;
    this.d22=t22;
    t00=this.invI1e00+this.invI2e00;
    t01=this.invI1e01+this.invI2e01;
    t02=this.invI1e02+this.invI2e02;
    t10=this.invI1e10+this.invI2e10;
    t11=this.invI1e11+this.invI2e11;
    t12=this.invI1e12+this.invI2e12;
    t20=this.invI1e20+this.invI2e20;
    t21=this.invI1e21+this.invI2e21;
    t22=this.invI1e22+this.invI2e22;
    this.invNorDenominator=
    this.norX*(this.norX*t00+this.norY*t01+this.norZ*t02)+
    this.norY*(this.norX*t10+this.norY*t11+this.norZ*t12)+
    this.norZ*(this.norX*t20+this.norY*t21+this.norZ*t22)
    ;
    this.norDenominator=1/this.invNorDenominator;
    this.tanDenominator=
    1/(
    this.tanX*(this.tanX*t00+this.tanY*t01+this.tanZ*t02)+
    this.tanY*(this.tanX*t10+this.tanY*t11+this.tanZ*t12)+
    this.tanZ*(this.tanX*t20+this.tanY*t21+this.tanZ*t22)
    )
    ;
    this.binDenominator=
    1/(
    this.binX*(this.binX*t00+this.binY*t01+this.binZ*t02)+
    this.binY*(this.binX*t10+this.binY*t11+this.binZ*t12)+
    this.binZ*(this.binX*t20+this.binY*t21+this.binZ*t22)
    )
    ;
    if(this.enableLimits){
    if(this.hingeAngle<this.lowerLimit){
    if(this.limitSign!=-1)this.limitTorque=0;
    this.limitSign=-1;
    }else if(this.hingeAngle>this.upperLimit){
    if(this.limitSign!=1)this.limitTorque=0;
    this.limitSign=1;
    }else{
    this.limitSign=0;
    this.limitTorque=0;
    }
    }else{
    this.limitSign=0;
    this.limitTorque=0;
    }
    if(this.enableMotor){
    this.stepMotorTorque=timeStep*this.maxMotorTorque;
    }
    this.torqueTan*=0.95;
    this.torqueBin*=0.95;
    this.motorTorque*=0.95;
    this.limitTorque*=0.95;
    tmp1X=this.limitTorque+this.motorTorque;
    this.torqueX=tmp1X*this.norX+this.torqueTan*this.tanX+this.torqueBin*this.binX;
    this.torqueY=tmp1X*this.norY+this.torqueTan*this.tanY+this.torqueBin*this.binY;
    this.torqueZ=tmp1X*this.norZ+this.torqueTan*this.tanZ+this.torqueBin*this.binZ;
    this.lVel1.x+=this.impulseX*this.invM1;
    this.lVel1.y+=this.impulseY*this.invM1;
    this.lVel1.z+=this.impulseZ*this.invM1;
    this.aVel1.x+=this.xTorqueUnit1X*this.impulseX+this.yTorqueUnit1X*this.impulseY+this.zTorqueUnit1X*this.impulseZ+this.torqueX*this.invI1e00+this.torqueY*this.invI1e01+this.torqueZ*this.invI1e02;
    this.aVel1.y+=this.xTorqueUnit1Y*this.impulseX+this.yTorqueUnit1Y*this.impulseY+this.zTorqueUnit1Y*this.impulseZ+this.torqueX*this.invI1e10+this.torqueY*this.invI1e11+this.torqueZ*this.invI1e12;
    this.aVel1.z+=this.xTorqueUnit1Z*this.impulseX+this.yTorqueUnit1Z*this.impulseY+this.zTorqueUnit1Z*this.impulseZ+this.torqueX*this.invI1e20+this.torqueY*this.invI1e21+this.torqueZ*this.invI1e22;
    this.lVel2.x-=this.impulseX*this.invM2;
    this.lVel2.y-=this.impulseY*this.invM2;
    this.lVel2.z-=this.impulseZ*this.invM2;
    this.aVel2.x-=this.xTorqueUnit2X*this.impulseX+this.yTorqueUnit2X*this.impulseY+this.zTorqueUnit2X*this.impulseZ+this.torqueX*this.invI2e00+this.torqueY*this.invI2e01+this.torqueZ*this.invI2e02;
    this.aVel2.y-=this.xTorqueUnit2Y*this.impulseX+this.yTorqueUnit2Y*this.impulseY+this.zTorqueUnit2Y*this.impulseZ+this.torqueX*this.invI2e10+this.torqueY*this.invI2e11+this.torqueZ*this.invI2e12;
    this.aVel2.z-=this.xTorqueUnit2Z*this.impulseX+this.yTorqueUnit2Z*this.impulseY+this.zTorqueUnit2Z*this.impulseZ+this.torqueX*this.invI2e20+this.torqueY*this.invI2e21+this.torqueZ*this.invI2e22;
    this.targetVelX=this.anchorPosition2.x-this.anchorPosition1.x;
    this.targetVelY=this.anchorPosition2.y-this.anchorPosition1.y;
    this.targetVelZ=this.anchorPosition2.z-this.anchorPosition1.z;
    tmp1X=Math.sqrt(this.targetVelX*this.targetVelX+this.targetVelY*this.targetVelY+this.targetVelZ*this.targetVelZ);
    if(tmp1X<0.005){
    this.targetVelX=0;
    this.targetVelY=0;
    this.targetVelZ=0;
    }else{
    tmp1X=(0.005-tmp1X)/tmp1X*invTimeStep*0.05;
    this.targetVelX*=tmp1X;
    this.targetVelY*=tmp1X;
    this.targetVelZ*=tmp1X;
    }
    tmp1X=this.axis2Y*this.axis1Z-this.axis2Z*this.axis1Y;
    tmp1Y=this.axis2Z*this.axis1X-this.axis2X*this.axis1Z;
    tmp1Z=this.axis2X*this.axis1Y-this.axis2Y*this.axis1X;
    this.targetAngVelTan=this.tanX*tmp1X+this.tanY*tmp1Y+this.tanZ*tmp1Z;
    if(this.targetAngVelTan>0.02)this.targetAngVelTan=(this.targetAngVelTan-0.02)*invTimeStep*0.05;
    else if(this.targetAngVelTan<-0.02)this.targetAngVelTan=(this.targetAngVelTan+0.02)*invTimeStep*0.05;
    else this.targetAngVelTan=0;
    this.targetAngVelBin=this.binX*tmp1X+this.binY*tmp1Y+this.binZ*tmp1Z;
    if(this.targetAngVelBin>0.02)this.targetAngVelBin=(this.targetAngVelBin-0.02)*invTimeStep*0.05;
    else if(this.targetAngVelBin<-0.02)this.targetAngVelBin=(this.targetAngVelBin+0.02)*invTimeStep*0.05;
    else this.targetAngVelBin=0;
    if(this.limitSign==-1){
    this.targetAngVelNor=this.lowerLimit-this.hingeAngle;
    if(this.targetAngVelNor<0.02)this.targetAngVelNor=0;
    else this.targetAngVelNor=(this.targetAngVelNor-0.02)*invTimeStep*0.05;
    }else if(this.limitSign==1){
    this.targetAngVelNor=this.upperLimit-this.hingeAngle;
    if(this.targetAngVelNor>-0.02)this.targetAngVelNor=0;
    else this.targetAngVelNor=(this.targetAngVelNor+0.02)*invTimeStep*0.05;
    }else{
    this.targetAngVelNor=0;
    }
}
OIMO.HingeJoint.prototype.solve = function () {
    var relVelX;
    var relVelY;
    var relVelZ;
    var tmp;
    var newImpulseX;
    var newImpulseY;
    var newImpulseZ;
    var newTorqueTan;
    var newTorqueBin;
    var oldMotorTorque;
    var newMotorTorque;
    var oldLimitTorque;
    var newLimitTorque;
    relVelX=this.lVel2.x-this.lVel1.x+this.aVel2.y*this.relPos2Z-this.aVel2.z*this.relPos2Y-this.aVel1.y*this.relPos1Z+this.aVel1.z*this.relPos1Y-this.targetVelX;
    relVelY=this.lVel2.y-this.lVel1.y+this.aVel2.z*this.relPos2X-this.aVel2.x*this.relPos2Z-this.aVel1.z*this.relPos1X+this.aVel1.x*this.relPos1Z-this.targetVelY;
    relVelZ=this.lVel2.z-this.lVel1.z+this.aVel2.x*this.relPos2Y-this.aVel2.y*this.relPos2X-this.aVel1.x*this.relPos1Y+this.aVel1.y*this.relPos1X-this.targetVelZ;
    newImpulseX=relVelX*this.d00+relVelY*this.d01+relVelZ*this.d02;
    newImpulseY=relVelX*this.d10+relVelY*this.d11+relVelZ*this.d12;
    newImpulseZ=relVelX*this.d20+relVelY*this.d21+relVelZ*this.d22;
    this.impulseX+=newImpulseX;
    this.impulseY+=newImpulseY;
    this.impulseZ+=newImpulseZ;
    this.lVel1.x+=newImpulseX*this.invM1;
    this.lVel1.y+=newImpulseY*this.invM1;
    this.lVel1.z+=newImpulseZ*this.invM1;
    this.aVel1.x+=this.xTorqueUnit1X*newImpulseX+this.yTorqueUnit1X*newImpulseY+this.zTorqueUnit1X*newImpulseZ;
    this.aVel1.y+=this.xTorqueUnit1Y*newImpulseX+this.yTorqueUnit1Y*newImpulseY+this.zTorqueUnit1Y*newImpulseZ;
    this.aVel1.z+=this.xTorqueUnit1Z*newImpulseX+this.yTorqueUnit1Z*newImpulseY+this.zTorqueUnit1Z*newImpulseZ;
    this.lVel2.x-=newImpulseX*this.invM2;
    this.lVel2.y-=newImpulseY*this.invM2;
    this.lVel2.z-=newImpulseZ*this.invM2;
    this.aVel2.x-=this.xTorqueUnit2X*newImpulseX+this.yTorqueUnit2X*newImpulseY+this.zTorqueUnit2X*newImpulseZ;
    this.aVel2.y-=this.xTorqueUnit2Y*newImpulseX+this.yTorqueUnit2Y*newImpulseY+this.zTorqueUnit2Y*newImpulseZ;
    this.aVel2.z-=this.xTorqueUnit2Z*newImpulseX+this.yTorqueUnit2Z*newImpulseY+this.zTorqueUnit2Z*newImpulseZ;
    relVelX=this.aVel2.x-this.aVel1.x;
    relVelY=this.aVel2.y-this.aVel1.y;
    relVelZ=this.aVel2.z-this.aVel1.z;
    tmp=relVelX*this.norX+relVelY*this.norY+relVelZ*this.norZ;
    if(this.enableMotor){
    newMotorTorque=(tmp-this.motorSpeed)*this.norDenominator;
    oldMotorTorque=this.motorTorque;
    this.motorTorque+=newMotorTorque;
    if(this.motorTorque>this.stepMotorTorque)this.motorTorque=this.stepMotorTorque;
    else if(this.motorTorque<-this.stepMotorTorque)this.motorTorque=-this.stepMotorTorque;
    newMotorTorque=this.motorTorque-oldMotorTorque;
    tmp-=newMotorTorque*this.invNorDenominator;
    }else newMotorTorque=0;
    if(this.limitSign!=0){
    newLimitTorque=(tmp-this.targetAngVelNor)*this.norDenominator;
    oldLimitTorque=this.limitTorque;
    this.limitTorque+=newLimitTorque;
    if(this.limitTorque*this.limitSign<0)this.limitTorque=0;
    newLimitTorque=this.limitTorque-oldLimitTorque;
    }else newLimitTorque=0;
    tmp=newMotorTorque+newLimitTorque;
    newTorqueTan=(relVelX*this.tanX+relVelY*this.tanY+relVelZ*this.tanZ-this.targetAngVelTan)*this.tanDenominator;
    newTorqueBin=(relVelX*this.binX+relVelY*this.binY+relVelZ*this.binZ-this.targetAngVelBin)*this.binDenominator;
    this.torqueTan+=newTorqueTan;
    this.torqueBin+=newTorqueBin;
    newImpulseX=tmp*this.norX+newTorqueTan*this.tanX+newTorqueBin*this.binX;
    newImpulseY=tmp*this.norY+newTorqueTan*this.tanY+newTorqueBin*this.binY;
    newImpulseZ=tmp*this.norZ+newTorqueTan*this.tanZ+newTorqueBin*this.binZ;
    this.aVel1.x+=this.invI1e00*newImpulseX+this.invI1e01*newImpulseY+this.invI1e02*newImpulseZ;
    this.aVel1.y+=this.invI1e10*newImpulseX+this.invI1e11*newImpulseY+this.invI1e12*newImpulseZ;
    this.aVel1.z+=this.invI1e20*newImpulseX+this.invI1e21*newImpulseY+this.invI1e22*newImpulseZ;
    this.aVel2.x-=this.invI2e00*newImpulseX+this.invI2e01*newImpulseY+this.invI2e02*newImpulseZ;
    this.aVel2.y-=this.invI2e10*newImpulseX+this.invI2e11*newImpulseY+this.invI2e12*newImpulseZ;
    this.aVel2.z-=this.invI2e20*newImpulseX+this.invI2e21*newImpulseY+this.invI2e22*newImpulseZ;
}
OIMO.HingeJoint.prototype.postSolve = function () {
    this.impulse.x=this.impulseX;
    this.impulse.y=this.impulseY;
    this.impulse.z=this.impulseZ;
    this.torque.x=this.torqueX;
    this.torque.y=this.torqueY;
    this.torque.z=this.torqueZ;
}
OIMO.HingeJoint.prototype.acosClamp = function(cos){
    if(cos>1)return 0;
    else if(cos<-1)return Math.PI;
    else return Math.acos(cos);
}
OIMO.Hinge2Joint = function(config,rigid1,rigid2){
    OIMO.Joint.call( this );

    this.limitTorque1=NaN;
    this.motorTorque1=NaN;
    this.limitTorque2=NaN;
    this.motorTorque2=NaN;
    this.enableLimits1=false;
    this.lowerLimit1=NaN;
    this.upperLimit1=NaN;
    this.limitSign1=0;
    this.enableLimits2=false;
    this.lowerLimit2=NaN;
    this.upperLimit2=NaN;
    this.limitSign2=0;
    this.enableMotor1=false;
    this.motorSpeed1=NaN;
    this.maxMotorTorque1=NaN;
    this.stepMotorTorque1=NaN;
    this.enableMotor2=false;
    this.motorSpeed2=NaN;
    this.maxMotorTorque2=NaN;
    this.stepMotorTorque2=NaN;
    this.tanX=NaN;
    this.tanY=NaN;
    this.tanZ=NaN;
    this.binX=NaN;
    this.binY=NaN;
    this.binZ=NaN;
    this.angAxis1X=NaN;
    this.angAxis1Y=NaN;
    this.angAxis1Z=NaN;
    this.angAxis2X=NaN;
    this.angAxis2Y=NaN;
    this.angAxis2Z=NaN;
    this.norX=NaN;
    this.norY=NaN;
    this.norZ=NaN;
    this.angle1=NaN;
    this.angle2=NaN;
    this.relPos1X=NaN;
    this.relPos1Y=NaN;
    this.relPos1Z=NaN;
    this.relPos2X=NaN;
    this.relPos2Y=NaN;
    this.relPos2Z=NaN;
    this.xTorqueUnit1X=NaN;
    this.xTorqueUnit1Y=NaN;
    this.xTorqueUnit1Z=NaN;
    this.xTorqueUnit2X=NaN;
    this.xTorqueUnit2Y=NaN;
    this.xTorqueUnit2Z=NaN;
    this.yTorqueUnit1X=NaN;
    this.yTorqueUnit1Y=NaN;
    this.yTorqueUnit1Z=NaN;
    this.yTorqueUnit2X=NaN;
    this.yTorqueUnit2Y=NaN;
    this.yTorqueUnit2Z=NaN;
    this.zTorqueUnit1X=NaN;
    this.zTorqueUnit1Y=NaN;
    this.zTorqueUnit1Z=NaN;
    this.zTorqueUnit2X=NaN;
    this.zTorqueUnit2Y=NaN;
    this.zTorqueUnit2Z=NaN;
    this.invI1e00=NaN;
    this.invI1e01=NaN;
    this.invI1e02=NaN;
    this.invI1e10=NaN;
    this.invI1e11=NaN;
    this.invI1e12=NaN;
    this.invI1e20=NaN;
    this.invI1e21=NaN;
    this.invI1e22=NaN;
    this.invI2e00=NaN;
    this.invI2e01=NaN;
    this.invI2e02=NaN;
    this.invI2e10=NaN;
    this.invI2e11=NaN;
    this.invI2e12=NaN;
    this.invI2e20=NaN;
    this.invI2e21=NaN;
    this.invI2e22=NaN;
    this.d00=NaN;
    this.d01=NaN;
    this.d02=NaN;
    this.d10=NaN;
    this.d11=NaN;
    this.d12=NaN;
    this.d20=NaN;
    this.d21=NaN;
    this.d22=NaN;
    this.norDenominator=NaN;
    this.tanDenominator=NaN;
    this.binDenominator=NaN;
    this.invTanDenominator=NaN;
    this.invBinDenominator=NaN;
    this.targetVelX=NaN;
    this.targetVelY=NaN;
    this.targetVelZ=NaN;
    this.targetAngVelNor=NaN;
    this.targetAngVelTan=NaN;
    this.targetAngVelBin=NaN;

    this.body1=rigid1;
    this.body2=rigid2;
    this.connection1.connected=rigid2;
    this.connection2.connected=rigid1;
    this.localAxis1=new OIMO.Vec3();
    this.localAxis2=new OIMO.Vec3();
    this.localAxis1.normalize(config.localAxis1);
    this.localAxis2.normalize(config.localAxis2);
    var len;
    this.localAxis1X=this.localAxis1.x;
    this.localAxis1Y=this.localAxis1.y;
    this.localAxis1Z=this.localAxis1.z;
    this.localAngAxis1X=this.localAxis1Y*this.localAxis1X-this.localAxis1Z*this.localAxis1Z;
    this.localAngAxis1Y=-this.localAxis1Z*this.localAxis1Y-this.localAxis1X*this.localAxis1X;
    this.localAngAxis1Z=this.localAxis1X*this.localAxis1Z+this.localAxis1Y*this.localAxis1Y;
    len=1/Math.sqrt(this.localAngAxis1X*this.localAngAxis1X+this.localAngAxis1Y*this.localAngAxis1Y+this.localAngAxis1Z*this.localAngAxis1Z);
    this.localAngAxis1X*=len;
    this.localAngAxis1Y*=len;
    this.localAngAxis1Z*=len;
    this.localAxis2X=this.localAxis2.x;
    this.localAxis2Y=this.localAxis2.y;
    this.localAxis2Z=this.localAxis2.z;
    this.localAngAxis2X=this.localAxis2Y*this.localAxis2X-this.localAxis2Z*this.localAxis2Z;
    this.localAngAxis2Y=-this.localAxis2Z*this.localAxis2Y-this.localAxis2X*this.localAxis2X;
    this.localAngAxis2Z=this.localAxis2X*this.localAxis2Z+this.localAxis2Y*this.localAxis2Y;
    len=1/Math.sqrt(this.localAngAxis2X*this.localAngAxis2X+this.localAngAxis2Y*this.localAngAxis2Y+this.localAngAxis2Z*this.localAngAxis2Z);
    this.localAngAxis2X*=len;
    this.localAngAxis2Y*=len;
    this.localAngAxis2Z*=len;
    this.allowCollision=config.allowCollision;
    this.localRelativeAnchorPosition1.copy(config.localRelativeAnchorPosition1);
    this.localRelativeAnchorPosition2.copy(config.localRelativeAnchorPosition2);
    this.type=this.JOINT_HINGE2;
    this.lVel1=this.body1.linearVelocity;
    this.lVel2=this.body2.linearVelocity;
    this.aVel1=this.body1.angularVelocity;
    this.aVel2=this.body2.angularVelocity;
    this.invM1=this.body1.invertMass;
    this.invM2=this.body2.invertMass;
    this.impulse=new OIMO.Vec3();
    this.torque=new OIMO.Vec3();
    this.impulseX=0;
    this.impulseY=0;
    this.impulseZ=0;
    this.limitTorque1=0;
    this.motorTorque1=0;
    this.limitTorque2=0;
    this.motorTorque2=0;
    this.torqueX=0;
    this.torqueY=0;
    this.torqueZ=0;
    this.torqueNor=0;
}
OIMO.Hinge2Joint.prototype = Object.create( OIMO.Joint.prototype );
OIMO.Hinge2Joint.prototype.preSolve = function (timeStep,invTimeStep) {
    var tmpM;
    var tmp1X;
    var tmp1Y;
    var tmp1Z;
    var tmp2X;
    var tmp2Y;
    var tmp2Z;
    var t00;
    var t01;
    var t02;
    var t10;
    var t11;
    var t12;
    var t20;
    var t21;
    var t22;
    var u00;
    var u01;
    var u02;
    var u10;
    var u11;
    var u12;
    var u20;
    var u21;
    var u22;
    tmpM=this.body1.rotation.elements;
    this.tanX=this.localAxis1X*tmpM[0]+this.localAxis1Y*tmpM[1]+this.localAxis1Z*tmpM[2];
    this.tanY=this.localAxis1X*tmpM[3]+this.localAxis1Y*tmpM[4]+this.localAxis1Z*tmpM[5];
    this.tanZ=this.localAxis1X*tmpM[6]+this.localAxis1Y*tmpM[7]+this.localAxis1Z*tmpM[8];
    this.angAxis1X=this.localAngAxis1X*tmpM[0]+this.localAngAxis1Y*tmpM[1]+this.localAngAxis1Z*tmpM[2];
    this.angAxis1Y=this.localAngAxis1X*tmpM[3]+this.localAngAxis1Y*tmpM[4]+this.localAngAxis1Z*tmpM[5];
    this.angAxis1Z=this.localAngAxis1X*tmpM[6]+this.localAngAxis1Y*tmpM[7]+this.localAngAxis1Z*tmpM[8];
    tmp1X=this.localRelativeAnchorPosition1.x;
    tmp1Y=this.localRelativeAnchorPosition1.y;
    tmp1Z=this.localRelativeAnchorPosition1.z;
    this.relPos1X=this.relativeAnchorPosition1.x=tmp1X*tmpM[0]+tmp1Y*tmpM[1]+tmp1Z*tmpM[2];
    this.relPos1Y=this.relativeAnchorPosition1.y=tmp1X*tmpM[3]+tmp1Y*tmpM[4]+tmp1Z*tmpM[5];
    this.relPos1Z=this.relativeAnchorPosition1.z=tmp1X*tmpM[6]+tmp1Y*tmpM[7]+tmp1Z*tmpM[8];
    tmpM=this.body2.rotation.elements;
    this.binX=this.localAxis2X*tmpM[0]+this.localAxis2Y*tmpM[1]+this.localAxis2Z*tmpM[2];
    this.binY=this.localAxis2X*tmpM[3]+this.localAxis2Y*tmpM[4]+this.localAxis2Z*tmpM[5];
    this.binZ=this.localAxis2X*tmpM[6]+this.localAxis2Y*tmpM[7]+this.localAxis2Z*tmpM[8];
    this.angAxis2X=this.localAngAxis2X*tmpM[0]+this.localAngAxis2Y*tmpM[1]+this.localAngAxis2Z*tmpM[2];
    this.angAxis2Y=this.localAngAxis2X*tmpM[3]+this.localAngAxis2Y*tmpM[4]+this.localAngAxis2Z*tmpM[5];
    this.angAxis2Z=this.localAngAxis2X*tmpM[6]+this.localAngAxis2Y*tmpM[7]+this.localAngAxis2Z*tmpM[8];
    tmp1X=this.localRelativeAnchorPosition2.x;
    tmp1Y=this.localRelativeAnchorPosition2.y;
    tmp1Z=this.localRelativeAnchorPosition2.z;
    this.relPos2X=this.relativeAnchorPosition2.x=tmp1X*tmpM[0]+tmp1Y*tmpM[1]+tmp1Z*tmpM[2];
    this.relPos2Y=this.relativeAnchorPosition2.y=tmp1X*tmpM[3]+tmp1Y*tmpM[4]+tmp1Z*tmpM[5];
    this.relPos2Z=this.relativeAnchorPosition2.z=tmp1X*tmpM[6]+tmp1Y*tmpM[7]+tmp1Z*tmpM[8];
    this.anchorPosition1.x=this.relPos1X+this.body1.position.x;
    this.anchorPosition1.y=this.relPos1Y+this.body1.position.y;
    this.anchorPosition1.z=this.relPos1Z+this.body1.position.z;
    this.anchorPosition2.x=this.relPos2X+this.body2.position.x;
    this.anchorPosition2.y=this.relPos2Y+this.body2.position.y;
    this.anchorPosition2.z=this.relPos2Z+this.body2.position.z;
    this.norX=this.binY*this.tanZ-this.binZ*this.tanY;
    this.norY=this.binZ*this.tanX-this.binX*this.tanZ;
    this.norZ=this.binX*this.tanY-this.binY*this.tanX;
    tmp1X=Math.sqrt(this.norX*this.norX+this.norY*this.norY+this.norZ*this.norZ);
    if(tmp1X>0)tmp1X=1/tmp1X;
    this.norX*=tmp1X;
    this.norY*=tmp1X;
    this.norZ*=tmp1X;
    if(
    this.tanX*(this.angAxis1Y*this.binZ-this.angAxis1Z*this.binY)+
    this.tanY*(this.angAxis1Z*this.binX-this.angAxis1X*this.binZ)+
    this.tanZ*(this.angAxis1X*this.binY-this.angAxis1Y*this.binX)<0
    ){
    this.angle1=-Math.acos(this.angAxis1X*this.binX+this.angAxis1Y*this.binY+this.angAxis1Z*this.binZ);
    }else{
    this.angle1=Math.acos(this.angAxis1X*this.binX+this.angAxis1Y*this.binY+this.angAxis1Z*this.binZ);
    }
    if(
    this.binX*(this.angAxis2Y*this.tanZ-this.angAxis2Z*this.tanY)+
    this.binY*(this.angAxis2Z*this.tanX-this.angAxis2X*this.tanZ)+
    this.binZ*(this.angAxis2X*this.tanY-this.angAxis2Y*this.tanX)<0
    ){
    this.angle2=Math.acos(this.angAxis2X*this.tanX+this.angAxis2Y*this.tanY+this.angAxis2Z*this.tanZ);
    }else{
    this.angle2=-Math.acos(this.angAxis2X*this.tanX+this.angAxis2Y*this.tanY+this.angAxis2Z*this.tanZ);
    }
    tmpM=this.body1.invertInertia.elements;
    this.invI1e00=tmpM[0];
    this.invI1e01=tmpM[1];
    this.invI1e02=tmpM[2];
    this.invI1e10=tmpM[3];
    this.invI1e11=tmpM[4];
    this.invI1e12=tmpM[5];
    this.invI1e20=tmpM[6];
    this.invI1e21=tmpM[7];
    this.invI1e22=tmpM[8];
    tmpM=this.body2.invertInertia.elements;
    this.invI2e00=tmpM[0];
    this.invI2e01=tmpM[1];
    this.invI2e02=tmpM[2];
    this.invI2e10=tmpM[3];
    this.invI2e11=tmpM[4];
    this.invI2e12=tmpM[5];
    this.invI2e20=tmpM[6];
    this.invI2e21=tmpM[7];
    this.invI2e22=tmpM[8];
    this.xTorqueUnit1X=this.relPos1Z*this.invI1e01-this.relPos1Y*this.invI1e02;
    this.xTorqueUnit1Y=this.relPos1Z*this.invI1e11-this.relPos1Y*this.invI1e12;
    this.xTorqueUnit1Z=this.relPos1Z*this.invI1e21-this.relPos1Y*this.invI1e22;
    this.xTorqueUnit2X=this.relPos2Z*this.invI2e01-this.relPos2Y*this.invI2e02;
    this.xTorqueUnit2Y=this.relPos2Z*this.invI2e11-this.relPos2Y*this.invI2e12;
    this.xTorqueUnit2Z=this.relPos2Z*this.invI2e21-this.relPos2Y*this.invI2e22;
    this.yTorqueUnit1X=-this.relPos1Z*this.invI1e00+this.relPos1X*this.invI1e02;
    this.yTorqueUnit1Y=-this.relPos1Z*this.invI1e10+this.relPos1X*this.invI1e12;
    this.yTorqueUnit1Z=-this.relPos1Z*this.invI1e20+this.relPos1X*this.invI1e22;
    this.yTorqueUnit2X=-this.relPos2Z*this.invI2e00+this.relPos2X*this.invI2e02;
    this.yTorqueUnit2Y=-this.relPos2Z*this.invI2e10+this.relPos2X*this.invI2e12;
    this.yTorqueUnit2Z=-this.relPos2Z*this.invI2e20+this.relPos2X*this.invI2e22;
    this.zTorqueUnit1X=this.relPos1Y*this.invI1e00-this.relPos1X*this.invI1e01;
    this.zTorqueUnit1Y=this.relPos1Y*this.invI1e10-this.relPos1X*this.invI1e11;
    this.zTorqueUnit1Z=this.relPos1Y*this.invI1e20-this.relPos1X*this.invI1e21;
    this.zTorqueUnit2X=this.relPos2Y*this.invI2e00-this.relPos2X*this.invI2e01;
    this.zTorqueUnit2Y=this.relPos2Y*this.invI2e10-this.relPos2X*this.invI2e11;
    this.zTorqueUnit2Z=this.relPos2Y*this.invI2e20-this.relPos2X*this.invI2e21;
    this.d00=this.invM1+this.invM2;
    this.d01=0;
    this.d02=0;
    this.d10=0;
    this.d11=this.d00;
    this.d12=0;
    this.d20=0;
    this.d21=0;
    this.d22=this.d00;
    t01=-this.relPos1Z;
    t02=this.relPos1Y;
    t10=this.relPos1Z;
    t12=-this.relPos1X;
    t20=-this.relPos1Y;
    t21=this.relPos1X;
    u00=this.invI1e01*t10+this.invI1e02*t20;
    u01=this.invI1e00*t01+this.invI1e02*t21;
    u02=this.invI1e00*t02+this.invI1e01*t12;
    u10=this.invI1e11*t10+this.invI1e12*t20;
    u11=this.invI1e10*t01+this.invI1e12*t21;
    u12=this.invI1e10*t02+this.invI1e11*t12;
    u20=this.invI1e21*t10+this.invI1e22*t20;
    u21=this.invI1e20*t01+this.invI1e22*t21;
    u22=this.invI1e20*t02+this.invI1e21*t12;
    this.d00-=t01*u10+t02*u20;
    this.d01-=t01*u11+t02*u21;
    this.d02-=t01*u12+t02*u22;
    this.d10-=t10*u00+t12*u20;
    this.d11-=t10*u01+t12*u21;
    this.d12-=t10*u02+t12*u22;
    this.d20-=t20*u00+t21*u10;
    this.d21-=t20*u01+t21*u11;
    this.d22-=t20*u02+t21*u12;
    t01=-this.relPos2Z;
    t02=this.relPos2Y;
    t10=this.relPos2Z;
    t12=-this.relPos2X;
    t20=-this.relPos2Y;
    t21=this.relPos2X;
    u00=this.invI2e01*t10+this.invI2e02*t20;
    u01=this.invI2e00*t01+this.invI2e02*t21;
    u02=this.invI2e00*t02+this.invI2e01*t12;
    u10=this.invI2e11*t10+this.invI2e12*t20;
    u11=this.invI2e10*t01+this.invI2e12*t21;
    u12=this.invI2e10*t02+this.invI2e11*t12;
    u20=this.invI2e21*t10+this.invI2e22*t20;
    u21=this.invI2e20*t01+this.invI2e22*t21;
    u22=this.invI2e20*t02+this.invI2e21*t12;
    this.d00-=t01*u10+t02*u20;
    this.d01-=t01*u11+t02*u21;
    this.d02-=t01*u12+t02*u22;
    this.d10-=t10*u00+t12*u20;
    this.d11-=t10*u01+t12*u21;
    this.d12-=t10*u02+t12*u22;
    this.d20-=t20*u00+t21*u10;
    this.d21-=t20*u01+t21*u11;
    this.d22-=t20*u02+t21*u12;
    tmp1X=1/(this.d00*(this.d11*this.d22-this.d21*this.d12)+this.d10*(this.d21*this.d02-this.d01*this.d22)+this.d20*(this.d01*this.d12-this.d11*this.d02));
    t00=(this.d11*this.d22-this.d12*this.d21)*tmp1X;
    t01=(this.d02*this.d21-this.d01*this.d22)*tmp1X;
    t02=(this.d01*this.d12-this.d02*this.d11)*tmp1X;
    t10=(this.d12*this.d20-this.d10*this.d22)*tmp1X;
    t11=(this.d00*this.d22-this.d02*this.d20)*tmp1X;
    t12=(this.d02*this.d10-this.d00*this.d12)*tmp1X;
    t20=(this.d10*this.d21-this.d11*this.d20)*tmp1X;
    t21=(this.d01*this.d20-this.d00*this.d21)*tmp1X;
    t22=(this.d00*this.d11-this.d01*this.d10)*tmp1X;
    this.d00=t00;
    this.d01=t01;
    this.d02=t02;
    this.d10=t10;
    this.d11=t11;
    this.d12=t12;
    this.d20=t20;
    this.d21=t21;
    this.d22=t22;
    t00=this.invI1e00+this.invI2e00;
    t01=this.invI1e01+this.invI2e01;
    t02=this.invI1e02+this.invI2e02;
    t10=this.invI1e10+this.invI2e10;
    t11=this.invI1e11+this.invI2e11;
    t12=this.invI1e12+this.invI2e12;
    t20=this.invI1e20+this.invI2e20;
    t21=this.invI1e21+this.invI2e21;
    t22=this.invI1e22+this.invI2e22;
    this.norDenominator=
    1/(
    this.norX*(this.norX*t00+this.norY*t01+this.norZ*t02)+
    this.norY*(this.norX*t10+this.norY*t11+this.norZ*t12)+
    this.norZ*(this.norX*t20+this.norY*t21+this.norZ*t22)
    )
    ;
    this.invTanDenominator=
    this.tanX*(this.tanX*t00+this.tanY*t01+this.tanZ*t02)+
    this.tanY*(this.tanX*t10+this.tanY*t11+this.tanZ*t12)+
    this.tanZ*(this.tanX*t20+this.tanY*t21+this.tanZ*t22)
    ;
    this.tanDenominator=1/this.invTanDenominator;
    this.invBinDenominator=
    this.binX*(this.binX*t00+this.binY*t01+this.binZ*t02)+
    this.binY*(this.binX*t10+this.binY*t11+this.binZ*t12)+
    this.binZ*(this.binX*t20+this.binY*t21+this.binZ*t22)
    ;
    this.binDenominator=1/this.invBinDenominator;
    if(this.enableLimits1){
    if(this.angle1<this.lowerLimit1){
    if(this.limitSign1!=-1)this.limitTorque1=0;
    this.limitSign1=-1;
    }else if(this.angle1>this.upperLimit1){
    if(this.limitSign1!=1)this.limitTorque1=0;
    this.limitSign1=1;
    }else{
    this.limitSign1=0;
    this.limitTorque1=0;
    }
    }else{
    this.limitSign1=0;
    this.limitTorque1=0;
    }
    if(this.enableLimits2){
    if(this.angle2<this.lowerLimit2){
    if(this.limitSign2!=-1)this.limitTorque2=0;
    this.limitSign2=-1;
    }else if(this.angle2>this.upperLimit2){
    if(this.limitSign2!=1)this.limitTorque2=0;
    this.limitSign2=1;
    }else{
    this.limitSign2=0;
    this.limitTorque2=0;
    }
    }else{
    this.limitSign2=0;
    this.limitTorque2=0;
    }
    if(this.enableMotor1){
    this.stepMotorTorque1=timeStep*this.maxMotorTorque1;
    }
    if(this.enableMotor2){
    this.stepMotorTorque2=timeStep*this.maxMotorTorque2;
    }
    this.torqueNor*=0.95;
    this.motorTorque1*=0.95;
    this.limitTorque1*=0.95;
    this.motorTorque2*=0.95;
    this.limitTorque2*=0.95;
    tmp1X=this.motorTorque1+this.limitTorque1;
    tmp1Y=this.motorTorque2+this.limitTorque2;
    this.torqueX=this.torqueNor*this.norX+tmp1X*this.tanX+tmp1Y*this.binX;
    this.torqueY=this.torqueNor*this.norY+tmp1X*this.tanY+tmp1Y*this.binY;
    this.torqueZ=this.torqueNor*this.norZ+tmp1X*this.tanZ+tmp1Y*this.binZ;
    this.lVel1.x+=this.impulseX*this.invM1;
    this.lVel1.y+=this.impulseY*this.invM1;
    this.lVel1.z+=this.impulseZ*this.invM1;
    this.aVel1.x+=this.xTorqueUnit1X*this.impulseX+this.yTorqueUnit1X*this.impulseY+this.zTorqueUnit1X*this.impulseZ+this.torqueX*this.invI1e00+this.torqueY*this.invI1e01+this.torqueZ*this.invI1e02;
    this.aVel1.y+=this.xTorqueUnit1Y*this.impulseX+this.yTorqueUnit1Y*this.impulseY+this.zTorqueUnit1Y*this.impulseZ+this.torqueX*this.invI1e10+this.torqueY*this.invI1e11+this.torqueZ*this.invI1e12;
    this.aVel1.z+=this.xTorqueUnit1Z*this.impulseX+this.yTorqueUnit1Z*this.impulseY+this.zTorqueUnit1Z*this.impulseZ+this.torqueX*this.invI1e20+this.torqueY*this.invI1e21+this.torqueZ*this.invI1e22;
    this.lVel2.x-=this.impulseX*this.invM2;
    this.lVel2.y-=this.impulseY*this.invM2;
    this.lVel2.z-=this.impulseZ*this.invM2;
    this.aVel2.x-=this.xTorqueUnit2X*this.impulseX+this.yTorqueUnit2X*this.impulseY+this.zTorqueUnit2X*this.impulseZ+this.torqueX*this.invI2e00+this.torqueY*this.invI2e01+this.torqueZ*this.invI2e02;
    this.aVel2.y-=this.xTorqueUnit2Y*this.impulseX+this.yTorqueUnit2Y*this.impulseY+this.zTorqueUnit2Y*this.impulseZ+this.torqueX*this.invI2e10+this.torqueY*this.invI2e11+this.torqueZ*this.invI2e12;
    this.aVel2.z-=this.xTorqueUnit2Z*this.impulseX+this.yTorqueUnit2Z*this.impulseY+this.zTorqueUnit2Z*this.impulseZ+this.torqueX*this.invI2e20+this.torqueY*this.invI2e21+this.torqueZ*this.invI2e22;
    this.targetVelX=this.anchorPosition2.x-this.anchorPosition1.x;
    this.targetVelY=this.anchorPosition2.y-this.anchorPosition1.y;
    this.targetVelZ=this.anchorPosition2.z-this.anchorPosition1.z;
    tmp1X=Math.sqrt(this.targetVelX*this.targetVelX+this.targetVelY*this.targetVelY+this.targetVelZ*this.targetVelZ);
    if(tmp1X<0.005){
    this.targetVelX=0;
    this.targetVelY=0;
    this.targetVelZ=0;
    }else{
    tmp1X=(0.005-tmp1X)/tmp1X*invTimeStep*0.05;
    this.targetVelX*=tmp1X;
    this.targetVelY*=tmp1X;
    this.targetVelZ*=tmp1X;
    }
    this.targetAngVelNor=-(this.tanX*this.binX+this.tanY*this.binY+this.tanZ*this.binZ);
    if(this.targetAngVelNor>0.02)this.targetAngVelNor=(this.targetAngVelNor-0.02)*invTimeStep*0.05;
    else if(this.targetAngVelNor<-0.02)this.targetAngVelNor=(this.targetAngVelNor+0.02)*invTimeStep*0.05;
    else this.targetAngVelNor=0;
    if(this.limitSign1==-1){
    this.targetAngVelTan=this.lowerLimit1-this.angle1;
    if(this.targetAngVelTan<0.02)this.targetAngVelTan=0;
    else this.targetAngVelTan=(this.targetAngVelTan-0.02)*invTimeStep*0.05;
    }else if(this.limitSign1==1){
    this.targetAngVelTan=this.upperLimit1-this.angle1;
    if(this.targetAngVelTan>-0.02)this.targetAngVelTan=0;
    else this.targetAngVelTan=(this.targetAngVelTan+0.02)*invTimeStep*0.05;
    }else{
    this.targetAngVelTan=0;
    }
    if(this.limitSign2==-1){
    this.targetAngVelBin=this.lowerLimit2-this.angle2;
    if(this.targetAngVelBin<0.02)this.targetAngVelBin=0;
    else this.targetAngVelBin=(this.targetAngVelBin-0.02)*invTimeStep*0.05;
    }else if(this.limitSign2==1){
    this.targetAngVelBin=this.upperLimit2-this.angle2;
    if(this.targetAngVelBin>-0.02)this.targetAngVelBin=0;
    else this.targetAngVelBin=(this.targetAngVelBin+0.02)*invTimeStep*0.05;
    }else{
    this.targetAngVelBin=0;
    }
}
OIMO.Hinge2Joint.prototype.solve = function () {
    var relVelX;
    var relVelY;
    var relVelZ;
    var tmp;
    var newImpulseX;
    var newImpulseY;
    var newImpulseZ;
    var newTorqueNor;
    var newTorqueTan;
    var newTorqueBin;
    var oldMotorTorque1;
    var newMotorTorque1;
    var oldLimitTorque1;
    var newLimitTorque1;
    var oldMotorTorque2;
    var newMotorTorque2;
    var oldLimitTorque2;
    var newLimitTorque2;
    relVelX=this.lVel2.x-this.lVel1.x+this.aVel2.y*this.relPos2Z-this.aVel2.z*this.relPos2Y-this.aVel1.y*this.relPos1Z+this.aVel1.z*this.relPos1Y-this.targetVelX;
    relVelY=this.lVel2.y-this.lVel1.y+this.aVel2.z*this.relPos2X-this.aVel2.x*this.relPos2Z-this.aVel1.z*this.relPos1X+this.aVel1.x*this.relPos1Z-this.targetVelY;
    relVelZ=this.lVel2.z-this.lVel1.z+this.aVel2.x*this.relPos2Y-this.aVel2.y*this.relPos2X-this.aVel1.x*this.relPos1Y+this.aVel1.y*this.relPos1X-this.targetVelZ;
    newImpulseX=relVelX*this.d00+relVelY*this.d01+relVelZ*this.d02;
    newImpulseY=relVelX*this.d10+relVelY*this.d11+relVelZ*this.d12;
    newImpulseZ=relVelX*this.d20+relVelY*this.d21+relVelZ*this.d22;
    this.impulseX+=newImpulseX;
    this.impulseY+=newImpulseY;
    this.impulseZ+=newImpulseZ;
    this.lVel1.x+=newImpulseX*this.invM1;
    this.lVel1.y+=newImpulseY*this.invM1;
    this.lVel1.z+=newImpulseZ*this.invM1;
    this.aVel1.x+=this.xTorqueUnit1X*newImpulseX+this.yTorqueUnit1X*newImpulseY+this.zTorqueUnit1X*newImpulseZ;
    this.aVel1.y+=this.xTorqueUnit1Y*newImpulseX+this.yTorqueUnit1Y*newImpulseY+this.zTorqueUnit1Y*newImpulseZ;
    this.aVel1.z+=this.xTorqueUnit1Z*newImpulseX+this.yTorqueUnit1Z*newImpulseY+this.zTorqueUnit1Z*newImpulseZ;
    this.lVel2.x-=newImpulseX*this.invM2;
    this.lVel2.y-=newImpulseY*this.invM2;
    this.lVel2.z-=newImpulseZ*this.invM2;
    this.aVel2.x-=this.xTorqueUnit2X*newImpulseX+this.yTorqueUnit2X*newImpulseY+this.zTorqueUnit2X*newImpulseZ;
    this.aVel2.y-=this.xTorqueUnit2Y*newImpulseX+this.yTorqueUnit2Y*newImpulseY+this.zTorqueUnit2Y*newImpulseZ;
    this.aVel2.z-=this.xTorqueUnit2Z*newImpulseX+this.yTorqueUnit2Z*newImpulseY+this.zTorqueUnit2Z*newImpulseZ;
    relVelX=this.aVel2.x-this.aVel1.x;
    relVelY=this.aVel2.y-this.aVel1.y;
    relVelZ=this.aVel2.z-this.aVel1.z;
    tmp=relVelX*this.tanX+relVelY*this.tanY+relVelZ*this.tanZ;
    if(this.enableMotor1){
    newMotorTorque1=(tmp-this.motorSpeed1)*this.tanDenominator;
    oldMotorTorque1=this.motorTorque1;
    this.motorTorque1+=newMotorTorque1;
    if(this.motorTorque1>this.stepMotorTorque1)this.motorTorque1=this.stepMotorTorque1;
    else if(this.motorTorque1<-this.stepMotorTorque1)this.motorTorque1=-this.stepMotorTorque1;
    newMotorTorque1=this.motorTorque1-oldMotorTorque1;
    tmp-=newMotorTorque1*this.invTanDenominator;
    }else newMotorTorque1=0;
    if(this.limitSign1!=0){
    newLimitTorque1=(tmp-this.targetAngVelTan)*this.tanDenominator;
    oldLimitTorque1=this.limitTorque1;
    this.limitTorque1+=newLimitTorque1;
    if(this.limitTorque1*this.limitSign1<0)this.limitTorque1=0;
    newLimitTorque1=this.limitTorque1-oldLimitTorque1;
    }else newLimitTorque1=0;
    tmp=relVelX*this.binX+relVelY*this.binY+relVelZ*this.binZ;
    if(this.enableMotor2){
    newMotorTorque2=(tmp-this.motorSpeed2)*this.binDenominator;
    oldMotorTorque2=this.motorTorque2;
    this.motorTorque2+=newMotorTorque2;
    if(this.motorTorque2>this.stepMotorTorque2)this.motorTorque2=this.stepMotorTorque2;
    else if(this.motorTorque2<-this.stepMotorTorque2)this.motorTorque2=-this.stepMotorTorque2;
    newMotorTorque2=this.motorTorque2-oldMotorTorque2;
    tmp-=newMotorTorque2*this.invBinDenominator;
    }else newMotorTorque2=0;
    if(this.limitSign2!=0){
    newLimitTorque2=(tmp-this.targetAngVelBin)*this.binDenominator;
    oldLimitTorque2=this.limitTorque2;
    this.limitTorque2+=newLimitTorque2;
    if(this.limitTorque2*this.limitSign2<0)this.limitTorque2=0;
    newLimitTorque2=this.limitTorque2-oldLimitTorque2;
    }else newLimitTorque2=0;
    newTorqueNor=(relVelX*this.norX+relVelY*this.norY+relVelZ*this.norZ-this.targetAngVelNor)*this.norDenominator;
    newTorqueTan=newMotorTorque1+newLimitTorque1;
    newTorqueBin=newMotorTorque2+newLimitTorque2;
    this.torqueNor+=newTorqueNor;
    newImpulseX=newTorqueNor*this.norX+newTorqueTan*this.tanX+newTorqueBin*this.binX;
    newImpulseY=newTorqueNor*this.norY+newTorqueTan*this.tanY+newTorqueBin*this.binY;
    newImpulseZ=newTorqueNor*this.norZ+newTorqueTan*this.tanZ+newTorqueBin*this.binZ;
    this.aVel1.x+=this.invI1e00*newImpulseX+this.invI1e01*newImpulseY+this.invI1e02*newImpulseZ;
    this.aVel1.y+=this.invI1e10*newImpulseX+this.invI1e11*newImpulseY+this.invI1e12*newImpulseZ;
    this.aVel1.z+=this.invI1e20*newImpulseX+this.invI1e21*newImpulseY+this.invI1e22*newImpulseZ;
    this.aVel2.x-=this.invI2e00*newImpulseX+this.invI2e01*newImpulseY+this.invI2e02*newImpulseZ;
    this.aVel2.y-=this.invI2e10*newImpulseX+this.invI2e11*newImpulseY+this.invI2e12*newImpulseZ;
    this.aVel2.z-=this.invI2e20*newImpulseX+this.invI2e21*newImpulseY+this.invI2e22*newImpulseZ;
}
OIMO.Hinge2Joint.prototype.postSolve = function () {
    this.impulse.x=this.impulseX;
    this.impulse.y=this.impulseY;
    this.impulse.z=this.impulseZ;
    this.torque.x=this.torqueX;
    this.torque.y=this.torqueY;
    this.torque.z=this.torqueZ;
}
OIMO.Contact = function(manifold){
    OIMO.Constraint.call( this);

    this.overlap=NaN;
    this.normalDenominator=NaN;
    this.tangentDenominator=NaN;
    this.binormalDenominator=NaN;
    this.shape1=null;
    this.shape2=null;
    this.warmStarted=false;
    this.lVel1=null;
    this.lVel2=null;
    this.aVel1=null;
    this.aVel2=null;
    this.relPos1X=NaN;
    this.relPos1Y=NaN;
    this.relPos1Z=NaN;
    this.relPos2X=NaN;
    this.relPos2Y=NaN;
    this.relPos2Z=NaN;
    this.relVelX=NaN;
    this.relVelY=NaN;
    this.relVelZ=NaN;
    this.norX=NaN;
    this.norY=NaN;
    this.norZ=NaN;
    this.tanX=NaN;
    this.tanY=NaN;
    this.tanZ=NaN;
    this.binX=NaN;
    this.binY=NaN;
    this.binZ=NaN;
    this.norTorque1X=NaN;
    this.norTorque1Y=NaN;
    this.norTorque1Z=NaN;
    this.norTorque2X=NaN;
    this.norTorque2Y=NaN;
    this.norTorque2Z=NaN;
    this.tanTorque1X=NaN;
    this.tanTorque1Y=NaN;
    this.tanTorque1Z=NaN;
    this.tanTorque2X=NaN;
    this.tanTorque2Y=NaN;
    this.tanTorque2Z=NaN;
    this.binTorque1X=NaN;
    this.binTorque1Y=NaN;
    this.binTorque1Z=NaN;
    this.binTorque2X=NaN;
    this.binTorque2Y=NaN;
    this.binTorque2Z=NaN;
    this.norTorqueUnit1X=NaN;
    this.norTorqueUnit1Y=NaN;
    this.norTorqueUnit1Z=NaN;
    this.norTorqueUnit2X=NaN;
    this.norTorqueUnit2Y=NaN;
    this.norTorqueUnit2Z=NaN;
    this.tanTorqueUnit1X=NaN;
    this.tanTorqueUnit1Y=NaN;
    this.tanTorqueUnit1Z=NaN;
    this.tanTorqueUnit2X=NaN;
    this.tanTorqueUnit2Y=NaN;
    this.tanTorqueUnit2Z=NaN;
    this.binTorqueUnit1X=NaN;
    this.binTorqueUnit1Y=NaN;
    this.binTorqueUnit1Z=NaN;
    this.binTorqueUnit2X=NaN;
    this.binTorqueUnit2Y=NaN;
    this.binTorqueUnit2Z=NaN;
    this.invM1=NaN;
    this.invM2=NaN;
    this.invI1e00=NaN;
    this.invI1e01=NaN;
    this.invI1e02=NaN;
    this.invI1e10=NaN;
    this.invI1e11=NaN;
    this.invI1e12=NaN;
    this.invI1e20=NaN;
    this.invI1e21=NaN;
    this.invI1e22=NaN;
    this.invI2e00=NaN;
    this.invI2e01=NaN;
    this.invI2e02=NaN;
    this.invI2e10=NaN;
    this.invI2e11=NaN;
    this.invI2e12=NaN;
    this.invI2e20=NaN;
    this.invI2e21=NaN;
    this.invI2e22=NaN;
    this.targetNormalVelocity=NaN;
    this.targetSeparateVelocity=NaN;
    this.friction=NaN;
    this.restitution=NaN;

    this.position=new OIMO.Vec3();
    this.relativePosition1=new OIMO.Vec3();
    this.relativePosition2=new OIMO.Vec3();
    this.normal=new OIMO.Vec3();
    this.tangent=new OIMO.Vec3();
    this.binormal=new OIMO.Vec3();
    this.shapeConnection1=new OIMO.ContactConnection(this);
    this.shapeConnection2=new OIMO.ContactConnection(this);
    this.bodyConnection1=new OIMO.ContactConnection(this);
    this.bodyConnection2=new OIMO.ContactConnection(this);
    this.id=new OIMO.ContactID();
    this.normalImpulse=0;
    this.tangentImpulse=0;
    this.binormalImpulse=0;
}
OIMO.Contact.prototype = Object.create( OIMO.Constraint.prototype );
OIMO.Contact.prototype.setupFromContactInfo = function(contactInfo){
    this.position.x=contactInfo.position.x;
    this.position.y=contactInfo.position.y;
    this.position.z=contactInfo.position.z;
    this.norX=contactInfo.normal.x;
    this.norY=contactInfo.normal.y;
    this.norZ=contactInfo.normal.z;
    this.overlap=contactInfo.overlap;
    this.shape1=contactInfo.shape1;
    this.shape2=contactInfo.shape2;
    this.body1=this.shape1.parent;
    this.body2=this.shape2.parent;
    this.bodyConnection1.connectedBody=this.body2;
    this.bodyConnection1.connectedShape=this.shape2;
    this.shapeConnection1.connectedBody=this.body2;
    this.shapeConnection1.connectedShape=this.shape2;
    this.bodyConnection2.connectedBody=this.body1;
    this.bodyConnection2.connectedShape=this.shape1;
    this.shapeConnection2.connectedBody=this.body1;
    this.shapeConnection2.connectedShape=this.shape1;
    this.relPos1X=this.position.x-this.body1.position.x;
    this.relPos1Y=this.position.y-this.body1.position.y;
    this.relPos1Z=this.position.z-this.body1.position.z;
    this.relPos2X=this.position.x-this.body2.position.x;
    this.relPos2Y=this.position.y-this.body2.position.y;
    this.relPos2Z=this.position.z-this.body2.position.z;
    this.lVel1=this.body1.linearVelocity;
    this.lVel2=this.body2.linearVelocity;
    this.aVel1=this.body1.angularVelocity;
    this.aVel2=this.body2.angularVelocity;
    this.invM1=this.body1.invertMass;
    this.invM2=this.body2.invertMass;
    var tmpI;
    tmpI=this.body1.invertInertia.elements;
    this.invI1e00=tmpI[0];
    this.invI1e01=tmpI[1];
    this.invI1e02=tmpI[2];
    this.invI1e10=tmpI[3];
    this.invI1e11=tmpI[4];
    this.invI1e12=tmpI[5];
    this.invI1e20=tmpI[6];
    this.invI1e21=tmpI[7];
    this.invI1e22=tmpI[8];
    tmpI=this.body2.invertInertia.elements;
    this.invI2e00=tmpI[0];
    this.invI2e01=tmpI[1];
    this.invI2e02=tmpI[2];
    this.invI2e10=tmpI[3];
    this.invI2e11=tmpI[4];
    this.invI2e12=tmpI[5];
    this.invI2e20=tmpI[6];
    this.invI2e21=tmpI[7];
    this.invI2e22=tmpI[8];
    this.id.data1=contactInfo.id.data1;
    this.id.data2=contactInfo.id.data2;
    this.id.flip=contactInfo.id.flip;
    this.friction=this.shape1.friction*this.shape2.friction;
    this.restitution=this.shape1.restitution*this.shape2.restitution;
    this.overlap=contactInfo.overlap;
    this.normalImpulse=0;
    this.tangentImpulse=0;
    this.binormalImpulse=0;
    this.warmStarted=false;
}
OIMO.Contact.prototype.removeReferences = function(){
    this.shape1=null;
    this.shape2=null;
    this.body1=null;
    this.body2=null;
    this.bodyConnection1.connectedBody=null;
    this.bodyConnection1.connectedShape=null;
    this.shapeConnection1.connectedBody=null;
    this.shapeConnection1.connectedShape=null;
    this.bodyConnection2.connectedBody=null;
    this.bodyConnection2.connectedShape=null;
    this.shapeConnection2.connectedBody=null;
    this.shapeConnection2.connectedShape=null;
}
OIMO.Contact.prototype.preSolve = function(timeStep,invTimeStep){
    this.relVelX=(this.lVel2.x+this.aVel2.y*this.relPos2Z-this.aVel2.z*this.relPos2Y)-(this.lVel1.x+this.aVel1.y*this.relPos1Z-this.aVel1.z*this.relPos1Y);
    this.relVelY=(this.lVel2.y+this.aVel2.z*this.relPos2X-this.aVel2.x*this.relPos2Z)-(this.lVel1.y+this.aVel1.z*this.relPos1X-this.aVel1.x*this.relPos1Z);
    this.relVelZ=(this.lVel2.z+this.aVel2.x*this.relPos2Y-this.aVel2.y*this.relPos2X)-(this.lVel1.z+this.aVel1.x*this.relPos1Y-this.aVel1.y*this.relPos1X);
    var rvn=this.norX*this.relVelX+this.norY*this.relVelY+this.norZ*this.relVelZ;
    this.tanX=this.relVelX-rvn*this.norX;
    this.tanY=this.relVelY-rvn*this.norY;
    this.tanZ=this.relVelZ-rvn*this.norZ;
    var len=this.tanX*this.tanX+this.tanY*this.tanY+this.tanZ*this.tanZ;
    if(len>1e-2){
    len=1/Math.sqrt(len);
    }else{
    this.tanX=this.norY*this.norX-this.norZ*this.norZ;
    this.tanY=-this.norZ*this.norY-this.norX*this.norX;
    this.tanZ=this.norX*this.norZ+this.norY*this.norY;
    len=1/Math.sqrt(this.tanX*this.tanX+this.tanY*this.tanY+this.tanZ*this.tanZ);
    }
    this.tanX*=len;
    this.tanY*=len;
    this.tanZ*=len;
    this.binX=this.norY*this.tanZ-this.norZ*this.tanY;
    this.binY=this.norZ*this.tanX-this.norX*this.tanZ;
    this.binZ=this.norX*this.tanY-this.norY*this.tanX;
    this.norTorque1X=this.relPos1Y*this.norZ-this.relPos1Z*this.norY;
    this.norTorque1Y=this.relPos1Z*this.norX-this.relPos1X*this.norZ;
    this.norTorque1Z=this.relPos1X*this.norY-this.relPos1Y*this.norX;
    this.norTorque2X=this.relPos2Y*this.norZ-this.relPos2Z*this.norY;
    this.norTorque2Y=this.relPos2Z*this.norX-this.relPos2X*this.norZ;
    this.norTorque2Z=this.relPos2X*this.norY-this.relPos2Y*this.norX;
    this.tanTorque1X=this.relPos1Y*this.tanZ-this.relPos1Z*this.tanY;
    this.tanTorque1Y=this.relPos1Z*this.tanX-this.relPos1X*this.tanZ;
    this.tanTorque1Z=this.relPos1X*this.tanY-this.relPos1Y*this.tanX;
    this.tanTorque2X=this.relPos2Y*this.tanZ-this.relPos2Z*this.tanY;
    this.tanTorque2Y=this.relPos2Z*this.tanX-this.relPos2X*this.tanZ;
    this.tanTorque2Z=this.relPos2X*this.tanY-this.relPos2Y*this.tanX;
    this.binTorque1X=this.relPos1Y*this.binZ-this.relPos1Z*this.binY;
    this.binTorque1Y=this.relPos1Z*this.binX-this.relPos1X*this.binZ;
    this.binTorque1Z=this.relPos1X*this.binY-this.relPos1Y*this.binX;
    this.binTorque2X=this.relPos2Y*this.binZ-this.relPos2Z*this.binY;
    this.binTorque2Y=this.relPos2Z*this.binX-this.relPos2X*this.binZ;
    this.binTorque2Z=this.relPos2X*this.binY-this.relPos2Y*this.binX;
    this.norTorqueUnit1X=this.norTorque1X*this.invI1e00+this.norTorque1Y*this.invI1e01+this.norTorque1Z*this.invI1e02;
    this.norTorqueUnit1Y=this.norTorque1X*this.invI1e10+this.norTorque1Y*this.invI1e11+this.norTorque1Z*this.invI1e12;
    this.norTorqueUnit1Z=this.norTorque1X*this.invI1e20+this.norTorque1Y*this.invI1e21+this.norTorque1Z*this.invI1e22;
    this.norTorqueUnit2X=this.norTorque2X*this.invI2e00+this.norTorque2Y*this.invI2e01+this.norTorque2Z*this.invI2e02;
    this.norTorqueUnit2Y=this.norTorque2X*this.invI2e10+this.norTorque2Y*this.invI2e11+this.norTorque2Z*this.invI2e12;
    this.norTorqueUnit2Z=this.norTorque2X*this.invI2e20+this.norTorque2Y*this.invI2e21+this.norTorque2Z*this.invI2e22;
    this.tanTorqueUnit1X=this.tanTorque1X*this.invI1e00+this.tanTorque1Y*this.invI1e01+this.tanTorque1Z*this.invI1e02;
    this.tanTorqueUnit1Y=this.tanTorque1X*this.invI1e10+this.tanTorque1Y*this.invI1e11+this.tanTorque1Z*this.invI1e12;
    this.tanTorqueUnit1Z=this.tanTorque1X*this.invI1e20+this.tanTorque1Y*this.invI1e21+this.tanTorque1Z*this.invI1e22;
    this.tanTorqueUnit2X=this.tanTorque2X*this.invI2e00+this.tanTorque2Y*this.invI2e01+this.tanTorque2Z*this.invI2e02;
    this.tanTorqueUnit2Y=this.tanTorque2X*this.invI2e10+this.tanTorque2Y*this.invI2e11+this.tanTorque2Z*this.invI2e12;
    this.tanTorqueUnit2Z=this.tanTorque2X*this.invI2e20+this.tanTorque2Y*this.invI2e21+this.tanTorque2Z*this.invI2e22;
    this.binTorqueUnit1X=this.binTorque1X*this.invI1e00+this.binTorque1Y*this.invI1e01+this.binTorque1Z*this.invI1e02;
    this.binTorqueUnit1Y=this.binTorque1X*this.invI1e10+this.binTorque1Y*this.invI1e11+this.binTorque1Z*this.invI1e12;
    this.binTorqueUnit1Z=this.binTorque1X*this.invI1e20+this.binTorque1Y*this.invI1e21+this.binTorque1Z*this.invI1e22;
    this.binTorqueUnit2X=this.binTorque2X*this.invI2e00+this.binTorque2Y*this.invI2e01+this.binTorque2Z*this.invI2e02;
    this.binTorqueUnit2Y=this.binTorque2X*this.invI2e10+this.binTorque2Y*this.invI2e11+this.binTorque2Z*this.invI2e12;
    this.binTorqueUnit2Z=this.binTorque2X*this.invI2e20+this.binTorque2Y*this.invI2e21+this.binTorque2Z*this.invI2e22;
    var tmp1X;
    var tmp1Y;
    var tmp1Z;
    var tmp2X;
    var tmp2Y;
    var tmp2Z;
    tmp1X=this.norTorque1X*this.invI1e00+this.norTorque1Y*this.invI1e01+this.norTorque1Z*this.invI1e02;
    tmp1Y=this.norTorque1X*this.invI1e10+this.norTorque1Y*this.invI1e11+this.norTorque1Z*this.invI1e12;
    tmp1Z=this.norTorque1X*this.invI1e20+this.norTorque1Y*this.invI1e21+this.norTorque1Z*this.invI1e22;
    tmp2X=tmp1Y*this.relPos1Z-tmp1Z*this.relPos1Y;
    tmp2Y=tmp1Z*this.relPos1X-tmp1X*this.relPos1Z;
    tmp2Z=tmp1X*this.relPos1Y-tmp1Y*this.relPos1X;
    tmp1X=this.norTorque2X*this.invI2e00+this.norTorque2Y*this.invI2e01+this.norTorque2Z*this.invI2e02;
    tmp1Y=this.norTorque2X*this.invI2e10+this.norTorque2Y*this.invI2e11+this.norTorque2Z*this.invI2e12;
    tmp1Z=this.norTorque2X*this.invI2e20+this.norTorque2Y*this.invI2e21+this.norTorque2Z*this.invI2e22;
    tmp2X+=tmp1Y*this.relPos2Z-tmp1Z*this.relPos2Y;
    tmp2Y+=tmp1Z*this.relPos2X-tmp1X*this.relPos2Z;
    tmp2Z+=tmp1X*this.relPos2Y-tmp1Y*this.relPos2X;
    this.normalDenominator=1/(this.invM1+this.invM2+this.norX*tmp2X+this.norY*tmp2Y+this.norZ*tmp2Z);
    tmp1X=this.tanTorque1X*this.invI1e00+this.tanTorque1Y*this.invI1e01+this.tanTorque1Z*this.invI1e02;
    tmp1Y=this.tanTorque1X*this.invI1e10+this.tanTorque1Y*this.invI1e11+this.tanTorque1Z*this.invI1e12;
    tmp1Z=this.tanTorque1X*this.invI1e20+this.tanTorque1Y*this.invI1e21+this.tanTorque1Z*this.invI1e22;
    tmp2X=tmp1Y*this.relPos1Z-tmp1Z*this.relPos1Y;
    tmp2Y=tmp1Z*this.relPos1X-tmp1X*this.relPos1Z;
    tmp2Z=tmp1X*this.relPos1Y-tmp1Y*this.relPos1X;
    tmp1X=this.tanTorque2X*this.invI2e00+this.tanTorque2Y*this.invI2e01+this.tanTorque2Z*this.invI2e02;
    tmp1Y=this.tanTorque2X*this.invI2e10+this.tanTorque2Y*this.invI2e11+this.tanTorque2Z*this.invI2e12;
    tmp1Z=this.tanTorque2X*this.invI2e20+this.tanTorque2Y*this.invI2e21+this.tanTorque2Z*this.invI2e22;
    tmp2X+=tmp1Y*this.relPos2Z-tmp1Z*this.relPos2Y;
    tmp2Y+=tmp1Z*this.relPos2X-tmp1X*this.relPos2Z;
    tmp2Z+=tmp1X*this.relPos2Y-tmp1Y*this.relPos2X;
    this.tangentDenominator=1/(this.invM1+this.invM2+this.tanX*tmp2X+this.tanY*tmp2Y+this.tanZ*tmp2Z);
    tmp1X=this.binTorque1X*this.invI1e00+this.binTorque1Y*this.invI1e01+this.binTorque1Z*this.invI1e02;
    tmp1Y=this.binTorque1X*this.invI1e10+this.binTorque1Y*this.invI1e11+this.binTorque1Z*this.invI1e12;
    tmp1Z=this.binTorque1X*this.invI1e20+this.binTorque1Y*this.invI1e21+this.binTorque1Z*this.invI1e22;
    tmp2X=tmp1Y*this.relPos1Z-tmp1Z*this.relPos1Y;
    tmp2Y=tmp1Z*this.relPos1X-tmp1X*this.relPos1Z;
    tmp2Z=tmp1X*this.relPos1Y-tmp1Y*this.relPos1X;
    tmp1X=this.binTorque2X*this.invI2e00+this.binTorque2Y*this.invI2e01+this.binTorque2Z*this.invI2e02;
    tmp1Y=this.binTorque2X*this.invI2e10+this.binTorque2Y*this.invI2e11+this.binTorque2Z*this.invI2e12;
    tmp1Z=this.binTorque2X*this.invI2e20+this.binTorque2Y*this.invI2e21+this.binTorque2Z*this.invI2e22;
    tmp2X+=tmp1Y*this.relPos2Z-tmp1Z*this.relPos2Y;
    tmp2Y+=tmp1Z*this.relPos2X-tmp1X*this.relPos2Z;
    tmp2Z+=tmp1X*this.relPos2Y-tmp1Y*this.relPos2X;
    this.binormalDenominator=1/(this.invM1+this.invM2+this.binX*tmp2X+this.binY*tmp2Y+this.binZ*tmp2Z);
    if(this.warmStarted){
    this.tangentImpulse*=0.95;
    this.binormalImpulse*=0.95;
    tmp1X=this.norX*this.normalImpulse+this.tanX*this.tangentImpulse+this.binX*this.binormalImpulse;
    tmp1Y=this.norY*this.normalImpulse+this.tanY*this.tangentImpulse+this.binY*this.binormalImpulse;
    tmp1Z=this.norZ*this.normalImpulse+this.tanZ*this.tangentImpulse+this.binZ*this.binormalImpulse;
    this.lVel1.x+=tmp1X*this.invM1;
    this.lVel1.y+=tmp1Y*this.invM1;
    this.lVel1.z+=tmp1Z*this.invM1;
    this.aVel1.x+=this.norTorqueUnit1X*this.normalImpulse+this.tanTorqueUnit1X*this.tangentImpulse+this.binTorqueUnit1X*this.binormalImpulse;
    this.aVel1.y+=this.norTorqueUnit1Y*this.normalImpulse+this.tanTorqueUnit1Y*this.tangentImpulse+this.binTorqueUnit1Y*this.binormalImpulse;
    this.aVel1.z+=this.norTorqueUnit1Z*this.normalImpulse+this.tanTorqueUnit1Z*this.tangentImpulse+this.binTorqueUnit1Z*this.binormalImpulse;
    this.lVel2.x-=tmp1X*this.invM2;
    this.lVel2.y-=tmp1Y*this.invM2;
    this.lVel2.z-=tmp1Z*this.invM2;
    this.aVel2.x-=this.norTorqueUnit2X*this.normalImpulse+this.tanTorqueUnit2X*this.tangentImpulse+this.binTorqueUnit2X*this.binormalImpulse;
    this.aVel2.y-=this.norTorqueUnit2Y*this.normalImpulse+this.tanTorqueUnit2Y*this.tangentImpulse+this.binTorqueUnit2Y*this.binormalImpulse;
    this.aVel2.z-=this.norTorqueUnit2Z*this.normalImpulse+this.tanTorqueUnit2Z*this.tangentImpulse+this.binTorqueUnit2Z*this.binormalImpulse;
    rvn=0;
    }
    if(rvn>-1){
    rvn=0;
    }
    this.targetNormalVelocity=this.restitution*-rvn;
    var separationalVelocity=-this.overlap-0.005;
    if(separationalVelocity>0){
    separationalVelocity*=invTimeStep*0.05;
    if(this.targetNormalVelocity<separationalVelocity){
    this.targetNormalVelocity=separationalVelocity;
    }
    }
}
OIMO.Contact.prototype.solve = function(){
    var error;
    var oldImpulse1;
    var newImpulse1;
    var oldImpulse2;
    var newImpulse2;
    var rvn;
    var forceX;
    var forceY;
    var forceZ;
    var tmpX;
    var tmpY;
    var tmpZ;
    rvn=
    (this.lVel2.x-this.lVel1.x)*this.norX+(this.lVel2.y-this.lVel1.y)*this.norY+(this.lVel2.z-this.lVel1.z)*this.norZ+
    this.aVel2.x*this.norTorque2X+this.aVel2.y*this.norTorque2Y+this.aVel2.z*this.norTorque2Z-
    this.aVel1.x*this.norTorque1X-this.aVel1.y*this.norTorque1Y-this.aVel1.z*this.norTorque1Z
    ;
    oldImpulse1=this.normalImpulse;
    newImpulse1=(rvn-this.targetNormalVelocity)*this.normalDenominator*1.4;
    this.normalImpulse+=newImpulse1;
    if(this.normalImpulse>0)this.normalImpulse=0;
    newImpulse1=this.normalImpulse-oldImpulse1;
    forceX=this.norX*newImpulse1;
    forceY=this.norY*newImpulse1;
    forceZ=this.norZ*newImpulse1;
    this.lVel1.x+=forceX*this.invM1;
    this.lVel1.y+=forceY*this.invM1;
    this.lVel1.z+=forceZ*this.invM1;
    this.aVel1.x+=this.norTorqueUnit1X*newImpulse1;
    this.aVel1.y+=this.norTorqueUnit1Y*newImpulse1;
    this.aVel1.z+=this.norTorqueUnit1Z*newImpulse1;
    this.lVel2.x-=forceX*this.invM2;
    this.lVel2.y-=forceY*this.invM2;
    this.lVel2.z-=forceZ*this.invM2;
    this.aVel2.x-=this.norTorqueUnit2X*newImpulse1;
    this.aVel2.y-=this.norTorqueUnit2Y*newImpulse1;
    this.aVel2.z-=this.norTorqueUnit2Z*newImpulse1;
    var max=-this.normalImpulse*this.friction;
    this.relVelX=this.lVel2.x-this.lVel1.x;
    this.relVelY=this.lVel2.y-this.lVel1.y;
    this.relVelZ=this.lVel2.z-this.lVel1.z;
    rvn=
    this.relVelX*this.tanX+this.relVelY*this.tanY+this.relVelZ*this.tanZ+
    this.aVel2.x*this.tanTorque2X+this.aVel2.y*this.tanTorque2Y+this.aVel2.z*this.tanTorque2Z-
    this.aVel1.x*this.tanTorque1X-this.aVel1.y*this.tanTorque1Y-this.aVel1.z*this.tanTorque1Z
    ;
    oldImpulse1=this.tangentImpulse;
    newImpulse1=rvn*this.tangentDenominator;
    this.tangentImpulse+=newImpulse1;
    rvn=
    this.relVelX*this.binX+this.relVelY*this.binY+this.relVelZ*this.binZ+
    this.aVel2.x*this.binTorque2X+this.aVel2.y*this.binTorque2Y+this.aVel2.z*this.binTorque2Z-
    this.aVel1.x*this.binTorque1X-this.aVel1.y*this.binTorque1Y-this.aVel1.z*this.binTorque1Z
    ;
    oldImpulse2=this.binormalImpulse;
    newImpulse2=rvn*this.binormalDenominator;
    this.binormalImpulse+=newImpulse2;
    var len=this.tangentImpulse*this.tangentImpulse+this.binormalImpulse*this.binormalImpulse;
    if(len>max*max){
    len=max/Math.sqrt(len);
    this.tangentImpulse*=len;
    this.binormalImpulse*=len;
    }
    newImpulse1=this.tangentImpulse-oldImpulse1;
    newImpulse2=this.binormalImpulse-oldImpulse2;
    forceX=this.tanX*newImpulse1+this.binX*newImpulse2;
    forceY=this.tanY*newImpulse1+this.binY*newImpulse2;
    forceZ=this.tanZ*newImpulse1+this.binZ*newImpulse2;
    this.lVel1.x+=forceX*this.invM1;
    this.lVel1.y+=forceY*this.invM1;
    this.lVel1.z+=forceZ*this.invM1;
    this.aVel1.x+=this.tanTorqueUnit1X*newImpulse1+this.binTorqueUnit1X*newImpulse2;
    this.aVel1.y+=this.tanTorqueUnit1Y*newImpulse1+this.binTorqueUnit1Y*newImpulse2;
    this.aVel1.z+=this.tanTorqueUnit1Z*newImpulse1+this.binTorqueUnit1Z*newImpulse2;
    this.lVel2.x-=forceX*this.invM2;
    this.lVel2.y-=forceY*this.invM2;
    this.lVel2.z-=forceZ*this.invM2;
    this.aVel2.x-=this.tanTorqueUnit2X*newImpulse1+this.binTorqueUnit2X*newImpulse2;
    this.aVel2.y-=this.tanTorqueUnit2Y*newImpulse1+this.binTorqueUnit2Y*newImpulse2;
    this.aVel2.z-=this.tanTorqueUnit2Z*newImpulse1+this.binTorqueUnit2Z*newImpulse2;
}
OIMO.Contact.prototype.postSolve = function(){
    this.relativePosition1.x=this.relPos1X;
    this.relativePosition1.y=this.relPos1Y;
    this.relativePosition1.z=this.relPos1Z;
    this.relativePosition2.x=this.relPos2X;
    this.relativePosition2.y=this.relPos2Y;
    this.relativePosition2.z=this.relPos2Z;
    this.normal.x=this.norX;
    this.normal.y=this.norY;
    this.normal.z=this.norZ;
    this.tangent.x=this.tanX;
    this.tangent.y=this.tanY;
    this.tangent.z=this.tanZ;
    this.binormal.x=this.binX;
    this.binormal.y=this.binY;
    this.binormal.z=this.binZ;
}
OIMO.ContactConnection = function(parent){
    this.prev=null;
    this.next=null;
    this.connectedShape=null;
    this.connectedBody=null;
    this.parent=parent;
}
OIMO.Shape = function(){
    this.type=0;
    this.mass=NaN;
    this.friction=NaN;
    this.restitution=NaN;
    this.parent=null;
    this.contactList=null;
    this.numContacts=0;

    this.id=OIMO.nextID++;
    this.position=new OIMO.Vec3();
    this.relativePosition=new OIMO.Vec3();
    this.localRelativePosition=new OIMO.Vec3();

    this.rotation=new OIMO.Mat33();
    this.relativeRotation=new OIMO.Mat33();
    this.localInertia=new OIMO.Mat33();

    this.proxy=new OIMO.Proxy();
    this.proxy.parent=this;
}

OIMO.Shape.prototype = {
    constructor: OIMO.Shape,

     updateProxy:function(){
        throw new Error("Inheritance error.");
    }
}
OIMO.ShapeConfig = function(){
    this.position=new OIMO.Vec3();
    this.rotation=new OIMO.Mat33();
    this.friction=0.5;
    this.restitution=0.5;
    this.density=1;
}
OIMO.BoxShape = function(config,width,height,depth){
    OIMO.Shape.call( this );

    this.width=width;
    this.halfWidth=width*0.5;
    this.height=height;
    this.halfHeight=height*0.5;
    this.depth=depth;
    this.halfDepth=depth*0.5;
    this.position.copy(config.position);
    this.rotation.copy(config.rotation);
    this.friction=config.friction;
    this.restitution=config.restitution;
    this.mass=width*height*depth*config.density;
    var inertia=this.mass/12;
    this.localInertia.init(
    inertia*(height*height+depth*depth),0,0,
    0,inertia*(width*width+depth*depth),0,
    0,0,inertia*(width*width+height*height)
    );
    this.normalDirectionWidth=new OIMO.Vec3();
    this.normalDirectionHeight=new OIMO.Vec3();
    this.normalDirectionDepth=new OIMO.Vec3();
    this.halfDirectionWidth=new OIMO.Vec3();
    this.halfDirectionHeight=new OIMO.Vec3();
    this.halfDirectionDepth=new OIMO.Vec3();
    this.vertex1=new OIMO.Vec3();
    this.vertex2=new OIMO.Vec3();
    this.vertex3=new OIMO.Vec3();
    this.vertex4=new OIMO.Vec3();
    this.vertex5=new OIMO.Vec3();
    this.vertex6=new OIMO.Vec3();
    this.vertex7=new OIMO.Vec3();
    this.vertex8=new OIMO.Vec3();
    this.type=OIMO.SHAPE_BOX;
}
OIMO.BoxShape.prototype = Object.create( OIMO.Shape.prototype );
OIMO.BoxShape.prototype.updateProxy = function(){
    var te = this.rotation.elements;
    this.normalDirectionWidth.x=te[0];
    this.normalDirectionWidth.y=te[3];
    this.normalDirectionWidth.z=te[6];
    this.normalDirectionHeight.x=te[1];
    this.normalDirectionHeight.y=te[4];
    this.normalDirectionHeight.z=te[7];
    this.normalDirectionDepth.x=te[2];
    this.normalDirectionDepth.y=te[5];
    this.normalDirectionDepth.z=te[8];
    this.halfDirectionWidth.x=te[0]*this.halfWidth;
    this.halfDirectionWidth.y=te[3]*this.halfWidth;
    this.halfDirectionWidth.z=te[6]*this.halfWidth;
    this.halfDirectionHeight.x=te[1]*this.halfHeight;
    this.halfDirectionHeight.y=te[4]*this.halfHeight;
    this.halfDirectionHeight.z=te[7]*this.halfHeight;
    this.halfDirectionDepth.x=te[2]*this.halfDepth;
    this.halfDirectionDepth.y=te[5]*this.halfDepth;
    this.halfDirectionDepth.z=te[8]*this.halfDepth;
    var wx=this.halfDirectionWidth.x;
    var wy=this.halfDirectionWidth.y;
    var wz=this.halfDirectionWidth.z;
    var hx=this.halfDirectionHeight.x;
    var hy=this.halfDirectionHeight.y;
    var hz=this.halfDirectionHeight.z;
    var dx=this.halfDirectionDepth.x;
    var dy=this.halfDirectionDepth.y;
    var dz=this.halfDirectionDepth.z;
    var x=this.position.x;
    var y=this.position.y;
    var z=this.position.z;
    this.vertex1.x=x+wx+hx+dx;
    this.vertex1.y=y+wy+hy+dy;
    this.vertex1.z=z+wz+hz+dz;
    this.vertex2.x=x+wx+hx-dx;
    this.vertex2.y=y+wy+hy-dy;
    this.vertex2.z=z+wz+hz-dz;
    this.vertex3.x=x+wx-hx+dx;
    this.vertex3.y=y+wy-hy+dy;
    this.vertex3.z=z+wz-hz+dz;
    this.vertex4.x=x+wx-hx-dx;
    this.vertex4.y=y+wy-hy-dy;
    this.vertex4.z=z+wz-hz-dz;
    this.vertex5.x=x-wx+hx+dx;
    this.vertex5.y=y-wy+hy+dy;
    this.vertex5.z=z-wz+hz+dz;
    this.vertex6.x=x-wx+hx-dx;
    this.vertex6.y=y-wy+hy-dy;
    this.vertex6.z=z-wz+hz-dz;
    this.vertex7.x=x-wx-hx+dx;
    this.vertex7.y=y-wy-hy+dy;
    this.vertex7.z=z-wz-hz+dz;
    this.vertex8.x=x-wx-hx-dx;
    this.vertex8.y=y-wy-hy-dy;
    this.vertex8.z=z-wz-hz-dz;
    var w;
    var h;
    var d;
    if(this.halfDirectionWidth.x<0){
    w=-this.halfDirectionWidth.x;
    }else{
    w=this.halfDirectionWidth.x;
    }
    if(this.halfDirectionWidth.y<0){
    h=-this.halfDirectionWidth.y;
    }else{
    h=this.halfDirectionWidth.y;
    }
    if(this.halfDirectionWidth.z<0){
    d=-this.halfDirectionWidth.z;
    }else{
    d=this.halfDirectionWidth.z;
    }
    if(this.halfDirectionHeight.x<0){
    w-=this.halfDirectionHeight.x;
    }else{
    w+=this.halfDirectionHeight.x;
    }
    if(this.halfDirectionHeight.y<0){
    h-=this.halfDirectionHeight.y;
    }else{
    h+=this.halfDirectionHeight.y;
    }
    if(this.halfDirectionHeight.z<0){
    d-=this.halfDirectionHeight.z;
    }else{
    d+=this.halfDirectionHeight.z;
    }
    if(this.halfDirectionDepth.x<0){
    w-=this.halfDirectionDepth.x;
    }else{
    w+=this.halfDirectionDepth.x;
    }
    if(this.halfDirectionDepth.y<0){
    h-=this.halfDirectionDepth.y;
    }else{
    h+=this.halfDirectionDepth.y;
    }
    if(this.halfDirectionDepth.z<0){
    d-=this.halfDirectionDepth.z;
    }else{
    d+=this.halfDirectionDepth.z;
    }
    this.proxy.init(
    this.position.x-w,this.position.x+w,
    this.position.y-h,this.position.y+h,
    this.position.z-d,this.position.z+d
    );
}
OIMO.CylinderShape = function(config,radius,height){
    OIMO.Shape.call( this );

    this.radius=radius;
    this.height=height;
    this.halfHeight=height*0.5;
    this.position.copy(config.position);
    this.rotation.copy(config.rotation);
    this.friction=config.friction;
    this.restitution=config.restitution;
    this.mass=Math.PI*radius*radius*height*config.density;
    var inertiaXZ=(1/4*radius*radius+1/12*height*height)*this.mass;
    var inertiaY=1/2*radius*radius;
    this.localInertia.init(
    inertiaXZ,0,0,
    0,inertiaY,0,
    0,0,inertiaXZ
    );
    this.normalDirection=new OIMO.Vec3();
    this.halfDirection=new OIMO.Vec3();
    this.type=OIMO.SHAPE_CYLINDER;
}
OIMO.CylinderShape.prototype = Object.create( OIMO.Shape.prototype );
OIMO.CylinderShape.prototype.updateProxy = function(){
    var te = this.rotation.elements;
    var len;
    var wx;
    var hy;
    var dz;
    var dirX=te[1];
    var dirY=te[4];
    var dirZ=te[7];
    var xx=dirX*dirX;
    var yy=dirY*dirY;
    var zz=dirZ*dirZ;
    this.normalDirection.x=dirX;
    this.normalDirection.y=dirY;
    this.normalDirection.z=dirZ;
    this.halfDirection.x=dirX*this.halfHeight;
    this.halfDirection.y=dirY*this.halfHeight;
    this.halfDirection.z=dirZ*this.halfHeight;
    wx=1-dirX*dirX;
    len=Math.sqrt(wx*wx+xx*yy+xx*zz);
    if(len>0)len=this.radius/len;
    wx*=len;
    hy=1-dirY*dirY;
    len=Math.sqrt(yy*xx+hy*hy+yy*zz);
    if(len>0)len=this.radius/len;
    hy*=len;
    dz=1-dirZ*dirZ;
    len=Math.sqrt(zz*xx+zz*yy+dz*dz);
    if(len>0)len=this.radius/len;
    dz*=len;
    var w;
    var h;
    var d;
    if(this.halfDirection.x<0)w=-this.halfDirection.x;
    else w=this.halfDirection.x;
    if(this.halfDirection.y<0)h=-this.halfDirection.y;
    else h=this.halfDirection.y;
    if(this.halfDirection.z<0)d=-this.halfDirection.z;
    else d=this.halfDirection.z;
    if(wx<0)w-=wx;
    else w+=wx;
    if(hy<0)h-=hy;
    else h+=hy;
    if(dz<0)d-=dz;
    else d+=dz;
    this.proxy.init(
    this.position.x-w,this.position.x+w,
    this.position.y-h,this.position.y+h,
    this.position.z-d,this.position.z+d
    );
}
OIMO.SphereShape = function(config,radius){
    OIMO.Shape.call( this );

    this.radius=radius;
    this.position.copy(config.position);
    this.rotation.copy(config.rotation);
    this.friction=config.friction;
    this.restitution=config.restitution;
    this.mass=4/3*Math.PI*radius*radius*radius*config.density;
    var inertia=2/5*radius*radius*this.mass;
    this.localInertia.init(
        inertia,0,0,
        0,inertia,0,
        0,0,inertia
    );
    this.type=OIMO.SHAPE_SPHERE;
}
OIMO.SphereShape.prototype = Object.create( OIMO.Shape.prototype );
OIMO.SphereShape.prototype.updateProxy = function(){
    this.proxy.init(
        this.position.x-this.radius,this.position.x+this.radius,
        this.position.y-this.radius,this.position.y+this.radius,
        this.position.z-this.radius,this.position.z+this.radius
    );
}
OIMO.ContactID = function(){
    this.data1=0;
    this.data2=0;
    this.flip=false;
}
OIMO.ContactID.prototype = {
    constructor: OIMO.ContactID,

    equals:function(id){
        return this.flip==id.flip?this.data1==id.data1&&this.data2==id.data2:this.data2==id.data1&&this.data1==id.data2;
    }
}
OIMO.ContactInfo = function(){
    this.overlap=NaN;
    this.shape1=null;
    this.shape2=null;
    this.position=new OIMO.Vec3();
    this.normal=new OIMO.Vec3();
    this.id=new OIMO.ContactID();
}
OIMO.CollisionDetector = function(){
    this.flip = false;
}
OIMO.CollisionDetector.prototype = {
    constructor: OIMO.CollisionDetector,

    detectCollision:function(shape1,shape2,result){
        throw new Error("detectCollision Function is not inherited");
    }
}
OIMO.CollisionResult = function(maxContactInfos){
    this.numContactInfos = 0;
    this.maxContactInfos=maxContactInfos;
    this.contactInfos=[];
}
OIMO.CollisionResult.prototype = {
    constructor: OIMO.CollisionResult,

    addContactInfo:function(positionX,positionY,positionZ,normalX,normalY,normalZ,overlap,shape1,shape2,data1,data2,flip){
        if(this.numContactInfos==this.maxContactInfos)return;
        if(!this.contactInfos[this.numContactInfos]){
            this.contactInfos[this.numContactInfos]=new OIMO.ContactInfo();
        }
        var c=this.contactInfos[this.numContactInfos++];
        c.position.x=positionX;
        c.position.y=positionY;
        c.position.z=positionZ;
        c.normal.x=normalX;
        c.normal.y=normalY;
        c.normal.z=normalZ;
        c.overlap=overlap;
        c.shape1=shape1;
        c.shape2=shape2;
        c.id.data1=data1;
        c.id.data2=data2;
        c.id.flip=flip;
    }
}
OIMO.BoxBoxCollisionDetector = function(){
    OIMO.CollisionDetector.call( this );

    this.clipVertices1=[];// vector 24
    this.clipVertices2=[];// vector 24
    this.clipVertices1.length = 24;
    this.clipVertices2.length = 24;
    this.used=[];
    this.INF = 1/0;
}
OIMO.BoxBoxCollisionDetector.prototype = Object.create( OIMO.CollisionDetector.prototype );
OIMO.BoxBoxCollisionDetector.prototype.detectCollision = function(shape1,shape2,result){
    var b1;
    var b2;
    if(shape1.id<shape2.id){
        b1=shape1;
        b2=shape2;
    }else{
        b1=shape2;
        b2=shape1;
    }
    var p1=b1.position;
    var p2=b2.position;
    var p1x=p1.x;
    var p1y=p1.y;
    var p1z=p1.z;
    var p2x=p2.x;
    var p2y=p2.y;
    var p2z=p2.z;
    var dx=p2x-p1x;
    var dy=p2y-p1y;
    var dz=p2z-p1z;
    var w1=b1.halfWidth;
    var h1=b1.halfHeight;
    var d1=b1.halfDepth;
    var w2=b2.halfWidth;
    var h2=b2.halfHeight;
    var d2=b2.halfDepth;
    var d1x=b1.halfDirectionWidth.x;
    var d1y=b1.halfDirectionWidth.y;
    var d1z=b1.halfDirectionWidth.z;
    var d2x=b1.halfDirectionHeight.x;
    var d2y=b1.halfDirectionHeight.y;
    var d2z=b1.halfDirectionHeight.z;
    var d3x=b1.halfDirectionDepth.x;
    var d3y=b1.halfDirectionDepth.y;
    var d3z=b1.halfDirectionDepth.z;
    var d4x=b2.halfDirectionWidth.x;
    var d4y=b2.halfDirectionWidth.y;
    var d4z=b2.halfDirectionWidth.z;
    var d5x=b2.halfDirectionHeight.x;
    var d5y=b2.halfDirectionHeight.y;
    var d5z=b2.halfDirectionHeight.z;
    var d6x=b2.halfDirectionDepth.x;
    var d6y=b2.halfDirectionDepth.y;
    var d6z=b2.halfDirectionDepth.z;
    var a1x=b1.normalDirectionWidth.x;
    var a1y=b1.normalDirectionWidth.y;
    var a1z=b1.normalDirectionWidth.z;
    var a2x=b1.normalDirectionHeight.x;
    var a2y=b1.normalDirectionHeight.y;
    var a2z=b1.normalDirectionHeight.z;
    var a3x=b1.normalDirectionDepth.x;
    var a3y=b1.normalDirectionDepth.y;
    var a3z=b1.normalDirectionDepth.z;
    var a4x=b2.normalDirectionWidth.x;
    var a4y=b2.normalDirectionWidth.y;
    var a4z=b2.normalDirectionWidth.z;
    var a5x=b2.normalDirectionHeight.x;
    var a5y=b2.normalDirectionHeight.y;
    var a5z=b2.normalDirectionHeight.z;
    var a6x=b2.normalDirectionDepth.x;
    var a6y=b2.normalDirectionDepth.y;
    var a6z=b2.normalDirectionDepth.z;
    var a7x=a1y*a4z-a1z*a4y;
    var a7y=a1z*a4x-a1x*a4z;
    var a7z=a1x*a4y-a1y*a4x;
    var a8x=a1y*a5z-a1z*a5y;
    var a8y=a1z*a5x-a1x*a5z;
    var a8z=a1x*a5y-a1y*a5x;
    var a9x=a1y*a6z-a1z*a6y;
    var a9y=a1z*a6x-a1x*a6z;
    var a9z=a1x*a6y-a1y*a6x;
    var aax=a2y*a4z-a2z*a4y;
    var aay=a2z*a4x-a2x*a4z;
    var aaz=a2x*a4y-a2y*a4x;
    var abx=a2y*a5z-a2z*a5y;
    var aby=a2z*a5x-a2x*a5z;
    var abz=a2x*a5y-a2y*a5x;
    var acx=a2y*a6z-a2z*a6y;
    var acy=a2z*a6x-a2x*a6z;
    var acz=a2x*a6y-a2y*a6x;
    var adx=a3y*a4z-a3z*a4y;
    var ady=a3z*a4x-a3x*a4z;
    var adz=a3x*a4y-a3y*a4x;
    var aex=a3y*a5z-a3z*a5y;
    var aey=a3z*a5x-a3x*a5z;
    var aez=a3x*a5y-a3y*a5x;
    var afx=a3y*a6z-a3z*a6y;
    var afy=a3z*a6x-a3x*a6z;
    var afz=a3x*a6y-a3y*a6x;
    var right1;
    var right2;
    var right3;
    var right4;
    var right5;
    var right6;
    var right7;
    var right8;
    var right9;
    var righta;
    var rightb;
    var rightc;
    var rightd;
    var righte;
    var rightf;
    var overlap1;
    var overlap2;
    var overlap3;
    var overlap4;
    var overlap5;
    var overlap6;
    var overlap7;
    var overlap8;
    var overlap9;
    var overlapa;
    var overlapb;
    var overlapc;
    var overlapd;
    var overlape;
    var overlapf;
    var invalid7=false;
    var invalid8=false;
    var invalid9=false;
    var invalida=false;
    var invalidb=false;
    var invalidc=false;
    var invalidd=false;
    var invalide=false;
    var invalidf=false;
    var len;
    var len1;
    var len2;
    var dot1;
    var dot2;
    var dot3;
    len=a1x*dx+a1y*dy+a1z*dz;
    right1=len>0;
    if(!right1)len=-len;
    len1=w1;
    dot1=a1x*a4x+a1y*a4y+a1z*a4z;
    dot2=a1x*a5x+a1y*a5y+a1z*a5z;
    dot3=a1x*a6x+a1y*a6y+a1z*a6z;
    if(dot1<0)dot1=-dot1;
    if(dot2<0)dot2=-dot2;
    if(dot3<0)dot3=-dot3;
    len2=dot1*w2+dot2*h2+dot3*d2;
    overlap1=len-len1-len2;
    if(overlap1>0)return;
    len=a2x*dx+a2y*dy+a2z*dz;
    right2=len>0;
    if(!right2)len=-len;
    len1=h1;
    dot1=a2x*a4x+a2y*a4y+a2z*a4z;
    dot2=a2x*a5x+a2y*a5y+a2z*a5z;
    dot3=a2x*a6x+a2y*a6y+a2z*a6z;
    if(dot1<0)dot1=-dot1;
    if(dot2<0)dot2=-dot2;
    if(dot3<0)dot3=-dot3;
    len2=dot1*w2+dot2*h2+dot3*d2;
    overlap2=len-len1-len2;
    if(overlap2>0)return;
    len=a3x*dx+a3y*dy+a3z*dz;
    right3=len>0;
    if(!right3)len=-len;
    len1=d1;
    dot1=a3x*a4x+a3y*a4y+a3z*a4z;
    dot2=a3x*a5x+a3y*a5y+a3z*a5z;
    dot3=a3x*a6x+a3y*a6y+a3z*a6z;
    if(dot1<0)dot1=-dot1;
    if(dot2<0)dot2=-dot2;
    if(dot3<0)dot3=-dot3;
    len2=dot1*w2+dot2*h2+dot3*d2;
    overlap3=len-len1-len2;
    if(overlap3>0)return;
    len=a4x*dx+a4y*dy+a4z*dz;
    right4=len>0;
    if(!right4)len=-len;
    dot1=a4x*a1x+a4y*a1y+a4z*a1z;
    dot2=a4x*a2x+a4y*a2y+a4z*a2z;
    dot3=a4x*a3x+a4y*a3y+a4z*a3z;
    if(dot1<0)dot1=-dot1;
    if(dot2<0)dot2=-dot2;
    if(dot3<0)dot3=-dot3;
    len1=dot1*w1+dot2*h1+dot3*d1;
    len2=w2;
    overlap4=(len-len1-len2)*1.0;
    if(overlap4>0)return;
    len=a5x*dx+a5y*dy+a5z*dz;
    right5=len>0;
    if(!right5)len=-len;
    dot1=a5x*a1x+a5y*a1y+a5z*a1z;
    dot2=a5x*a2x+a5y*a2y+a5z*a2z;
    dot3=a5x*a3x+a5y*a3y+a5z*a3z;
    if(dot1<0)dot1=-dot1;
    if(dot2<0)dot2=-dot2;
    if(dot3<0)dot3=-dot3;
    len1=dot1*w1+dot2*h1+dot3*d1;
    len2=h2;
    overlap5=(len-len1-len2)*1.0;
    if(overlap5>0)return;
    len=a6x*dx+a6y*dy+a6z*dz;
    right6=len>0;
    if(!right6)len=-len;
    dot1=a6x*a1x+a6y*a1y+a6z*a1z;
    dot2=a6x*a2x+a6y*a2y+a6z*a2z;
    dot3=a6x*a3x+a6y*a3y+a6z*a3z;
    if(dot1<0)dot1=-dot1;
    if(dot2<0)dot2=-dot2;
    if(dot3<0)dot3=-dot3;
    len1=dot1*w1+dot2*h1+dot3*d1;
    len2=d2;
    overlap6=(len-len1-len2)*1.0;
    if(overlap6>0)return;
    len=a7x*a7x+a7y*a7y+a7z*a7z;
    if(len>1e-5){
    len=1/Math.sqrt(len);
    a7x*=len;
    a7y*=len;
    a7z*=len;
    len=a7x*dx+a7y*dy+a7z*dz;
    right7=len>0;
    if(!right7)len=-len;
    dot1=a7x*a2x+a7y*a2y+a7z*a2z;
    dot2=a7x*a3x+a7y*a3y+a7z*a3z;
    if(dot1<0)dot1=-dot1;
    if(dot2<0)dot2=-dot2;
    len1=dot1*h1+dot2*d1;
    dot1=a7x*a5x+a7y*a5y+a7z*a5z;
    dot2=a7x*a6x+a7y*a6y+a7z*a6z;
    if(dot1<0)dot1=-dot1;
    if(dot2<0)dot2=-dot2;
    len2=dot1*h2+dot2*d2;
    overlap7=len-len1-len2;
    if(overlap7>0)return;
    }else{
    right7=false;
    overlap7=0;
    invalid7=true;
    }
    len=a8x*a8x+a8y*a8y+a8z*a8z;
    if(len>1e-5){
    len=1/Math.sqrt(len);
    a8x*=len;
    a8y*=len;
    a8z*=len;
    len=a8x*dx+a8y*dy+a8z*dz;
    right8=len>0;
    if(!right8)len=-len;
    dot1=a8x*a2x+a8y*a2y+a8z*a2z;
    dot2=a8x*a3x+a8y*a3y+a8z*a3z;
    if(dot1<0)dot1=-dot1;
    if(dot2<0)dot2=-dot2;
    len1=dot1*h1+dot2*d1;
    dot1=a8x*a4x+a8y*a4y+a8z*a4z;
    dot2=a8x*a6x+a8y*a6y+a8z*a6z;
    if(dot1<0)dot1=-dot1;
    if(dot2<0)dot2=-dot2;
    len2=dot1*w2+dot2*d2;
    overlap8=len-len1-len2;
    if(overlap8>0)return;
    }else{
    right8=false;
    overlap8=0;
    invalid8=true;
    }
    len=a9x*a9x+a9y*a9y+a9z*a9z;
    if(len>1e-5){
    len=1/Math.sqrt(len);
    a9x*=len;
    a9y*=len;
    a9z*=len;
    len=a9x*dx+a9y*dy+a9z*dz;
    right9=len>0;
    if(!right9)len=-len;
    dot1=a9x*a2x+a9y*a2y+a9z*a2z;
    dot2=a9x*a3x+a9y*a3y+a9z*a3z;
    if(dot1<0)dot1=-dot1;
    if(dot2<0)dot2=-dot2;
    len1=dot1*h1+dot2*d1;
    dot1=a9x*a4x+a9y*a4y+a9z*a4z;
    dot2=a9x*a5x+a9y*a5y+a9z*a5z;
    if(dot1<0)dot1=-dot1;
    if(dot2<0)dot2=-dot2;
    len2=dot1*w2+dot2*h2;
    overlap9=len-len1-len2;
    if(overlap9>0)return;
    }else{
    right9=false;
    overlap9=0;
    invalid9=true;
    }
    len=aax*aax+aay*aay+aaz*aaz;
    if(len>1e-5){
    len=1/Math.sqrt(len);
    aax*=len;
    aay*=len;
    aaz*=len;
    len=aax*dx+aay*dy+aaz*dz;
    righta=len>0;
    if(!righta)len=-len;
    dot1=aax*a1x+aay*a1y+aaz*a1z;
    dot2=aax*a3x+aay*a3y+aaz*a3z;
    if(dot1<0)dot1=-dot1;
    if(dot2<0)dot2=-dot2;
    len1=dot1*w1+dot2*d1;
    dot1=aax*a5x+aay*a5y+aaz*a5z;
    dot2=aax*a6x+aay*a6y+aaz*a6z;
    if(dot1<0)dot1=-dot1;
    if(dot2<0)dot2=-dot2;
    len2=dot1*h2+dot2*d2;
    overlapa=len-len1-len2;
    if(overlapa>0)return;
    }else{
    righta=false;
    overlapa=0;
    invalida=true;
    }
    len=abx*abx+aby*aby+abz*abz;
    if(len>1e-5){
    len=1/Math.sqrt(len);
    abx*=len;
    aby*=len;
    abz*=len;
    len=abx*dx+aby*dy+abz*dz;
    rightb=len>0;
    if(!rightb)len=-len;
    dot1=abx*a1x+aby*a1y+abz*a1z;
    dot2=abx*a3x+aby*a3y+abz*a3z;
    if(dot1<0)dot1=-dot1;
    if(dot2<0)dot2=-dot2;
    len1=dot1*w1+dot2*d1;
    dot1=abx*a4x+aby*a4y+abz*a4z;
    dot2=abx*a6x+aby*a6y+abz*a6z;
    if(dot1<0)dot1=-dot1;
    if(dot2<0)dot2=-dot2;
    len2=dot1*w2+dot2*d2;
    overlapb=len-len1-len2;
    if(overlapb>0)return;
    }else{
    rightb=false;
    overlapb=0;
    invalidb=true;
    }
    len=acx*acx+acy*acy+acz*acz;
    if(len>1e-5){
    len=1/Math.sqrt(len);
    acx*=len;
    acy*=len;
    acz*=len;
    len=acx*dx+acy*dy+acz*dz;
    rightc=len>0;
    if(!rightc)len=-len;
    dot1=acx*a1x+acy*a1y+acz*a1z;
    dot2=acx*a3x+acy*a3y+acz*a3z;
    if(dot1<0)dot1=-dot1;
    if(dot2<0)dot2=-dot2;
    len1=dot1*w1+dot2*d1;
    dot1=acx*a4x+acy*a4y+acz*a4z;
    dot2=acx*a5x+acy*a5y+acz*a5z;
    if(dot1<0)dot1=-dot1;
    if(dot2<0)dot2=-dot2;
    len2=dot1*w2+dot2*h2;
    overlapc=len-len1-len2;
    if(overlapc>0)return;
    }else{
    rightc=false;
    overlapc=0;
    invalidc=true;
    }
    len=adx*adx+ady*ady+adz*adz;
    if(len>1e-5){
    len=1/Math.sqrt(len);
    adx*=len;
    ady*=len;
    adz*=len;
    len=adx*dx+ady*dy+adz*dz;
    rightd=len>0;
    if(!rightd)len=-len;
    dot1=adx*a1x+ady*a1y+adz*a1z;
    dot2=adx*a2x+ady*a2y+adz*a2z;
    if(dot1<0)dot1=-dot1;
    if(dot2<0)dot2=-dot2;
    len1=dot1*w1+dot2*h1;
    dot1=adx*a5x+ady*a5y+adz*a5z;
    dot2=adx*a6x+ady*a6y+adz*a6z;
    if(dot1<0)dot1=-dot1;
    if(dot2<0)dot2=-dot2;
    len2=dot1*h2+dot2*d2;
    overlapd=len-len1-len2;
    if(overlapd>0)return;
    }else{
    rightd=false;
    overlapd=0;
    invalidd=true;
    }
    len=aex*aex+aey*aey+aez*aez;
    if(len>1e-5){
    len=1/Math.sqrt(len);
    aex*=len;
    aey*=len;
    aez*=len;
    len=aex*dx+aey*dy+aez*dz;
    righte=len>0;
    if(!righte)len=-len;
    dot1=aex*a1x+aey*a1y+aez*a1z;
    dot2=aex*a2x+aey*a2y+aez*a2z;
    if(dot1<0)dot1=-dot1;
    if(dot2<0)dot2=-dot2;
    len1=dot1*w1+dot2*h1;
    dot1=aex*a4x+aey*a4y+aez*a4z;
    dot2=aex*a6x+aey*a6y+aez*a6z;
    if(dot1<0)dot1=-dot1;
    if(dot2<0)dot2=-dot2;
    len2=dot1*w2+dot2*d2;
    overlape=len-len1-len2;
    if(overlape>0)return;
    }else{
    righte=false;
    overlape=0;
    invalide=true;
    }
    len=afx*afx+afy*afy+afz*afz;
    if(len>1e-5){
    len=1/Math.sqrt(len);
    afx*=len;
    afy*=len;
    afz*=len;
    len=afx*dx+afy*dy+afz*dz;
    rightf=len>0;
    if(!rightf)len=-len;
    dot1=afx*a1x+afy*a1y+afz*a1z;
    dot2=afx*a2x+afy*a2y+afz*a2z;
    if(dot1<0)dot1=-dot1;
    if(dot2<0)dot2=-dot2;
    len1=dot1*w1+dot2*h1;
    dot1=afx*a4x+afy*a4y+afz*a4z;
    dot2=afx*a5x+afy*a5y+afz*a5z;
    if(dot1<0)dot1=-dot1;
    if(dot2<0)dot2=-dot2;
    len2=dot1*w2+dot2*h2;
    overlapf=len-len1-len2;
    if(overlapf>0)return;
    }else{
    rightf=false;
    overlapf=0;
    invalidf=true;
    }
    var depth=overlap1;
    var depth2=overlap1;
    var minIndex=0;
    var right=right1;
    if(overlap2>depth2){
    depth=overlap2;
    depth2=overlap2;
    minIndex=1;
    right=right2;
    }
    if(overlap3>depth2){
    depth=overlap3;
    depth2=overlap3;
    minIndex=2;
    right=right3;
    }
    if(overlap4-0.005>depth2){
    depth=overlap4;
    depth2=overlap4-0.005;
    minIndex=3;
    right=right4;
    }
    if(overlap5-0.005>depth2){
    depth=overlap5;
    depth2=overlap5-0.005;
    minIndex=4;
    right=right5;
    }
    if(overlap6-0.005>depth2){
    depth=overlap6;
    depth2=overlap6-0.005;
    minIndex=5;
    right=right6;
    }
    if(overlap7-0.01>depth2&&!invalid7){
    depth=overlap7;
    depth2=overlap7-0.01;
    minIndex=6;
    right=right7;
    }
    if(overlap8-0.01>depth2&&!invalid8){
    depth=overlap8;
    depth2=overlap8-0.01;
    minIndex=7;
    right=right8;
    }
    if(overlap9-0.01>depth2&&!invalid9){
    depth=overlap9;
    depth2=overlap9-0.01;
    minIndex=8;
    right=right9;
    }
    if(overlapa-0.01>depth2&&!invalida){
    depth=overlapa;
    depth2=overlapa-0.01;
    minIndex=9;
    right=righta;
    }
    if(overlapb-0.01>depth2&&!invalidb){
    depth=overlapb;
    depth2=overlapb-0.01;
    minIndex=10;
    right=rightb;
    }
    if(overlapc-0.01>depth2&&!invalidc){
    depth=overlapc;
    depth2=overlapc-0.01;
    minIndex=11;
    right=rightc;
    }
    if(overlapd-0.01>depth2&&!invalidd){
    depth=overlapd;
    depth2=overlapd-0.01;
    minIndex=12;
    right=rightd;
    }
    if(overlape-0.01>depth2&&!invalide){
    depth=overlape;
    depth2=overlape-0.01;
    minIndex=13;
    right=righte;
    }
    if(overlapf-0.01>depth2&&!invalidf){
    depth=overlapf;
    minIndex=14;
    right=rightf;
    }
    var nx=0;
    var ny=0;
    var nz=0;
    var n1x=0;
    var n1y=0;
    var n1z=0;
    var n2x=0;
    var n2y=0;
    var n2z=0;
    var cx=0;
    var cy=0;
    var cz=0;
    var s1x=0;
    var s1y=0;
    var s1z=0;
    var s2x=0;
    var s2y=0;
    var s2z=0;
    var swap=false;
    switch(minIndex){
    case 0:
    if(right){
    cx=p1x+d1x;
    cy=p1y+d1y;
    cz=p1z+d1z;
    nx=a1x;
    ny=a1y;
    nz=a1z;
    }else{
    cx=p1x-d1x;
    cy=p1y-d1y;
    cz=p1z-d1z;
    nx=-a1x;
    ny=-a1y;
    nz=-a1z;
    }
    s1x=d2x;
    s1y=d2y;
    s1z=d2z;
    n1x=-a2x;
    n1y=-a2y;
    n1z=-a2z;
    s2x=d3x;
    s2y=d3y;
    s2z=d3z;
    n2x=-a3x;
    n2y=-a3y;
    n2z=-a3z;
    break;
    case 1:
    if(right){
    cx=p1x+d2x;
    cy=p1y+d2y;
    cz=p1z+d2z;
    nx=a2x;
    ny=a2y;
    nz=a2z;
    }else{
    cx=p1x-d2x;
    cy=p1y-d2y;
    cz=p1z-d2z;
    nx=-a2x;
    ny=-a2y;
    nz=-a2z;
    }
    s1x=d1x;
    s1y=d1y;
    s1z=d1z;
    n1x=-a1x;
    n1y=-a1y;
    n1z=-a1z;
    s2x=d3x;
    s2y=d3y;
    s2z=d3z;
    n2x=-a3x;
    n2y=-a3y;
    n2z=-a3z;
    break;
    case 2:
    if(right){
    cx=p1x+d3x;
    cy=p1y+d3y;
    cz=p1z+d3z;
    nx=a3x;
    ny=a3y;
    nz=a3z;
    }else{
    cx=p1x-d3x;
    cy=p1y-d3y;
    cz=p1z-d3z;
    nx=-a3x;
    ny=-a3y;
    nz=-a3z;
    }
    s1x=d1x;
    s1y=d1y;
    s1z=d1z;
    n1x=-a1x;
    n1y=-a1y;
    n1z=-a1z;
    s2x=d2x;
    s2y=d2y;
    s2z=d2z;
    n2x=-a2x;
    n2y=-a2y;
    n2z=-a2z;
    break;
    case 3:
    swap=true;
    if(!right){
    cx=p2x+d4x;
    cy=p2y+d4y;
    cz=p2z+d4z;
    nx=a4x;
    ny=a4y;
    nz=a4z;
    }else{
    cx=p2x-d4x;
    cy=p2y-d4y;
    cz=p2z-d4z;
    nx=-a4x;
    ny=-a4y;
    nz=-a4z;
    }
    s1x=d5x;
    s1y=d5y;
    s1z=d5z;
    n1x=-a5x;
    n1y=-a5y;
    n1z=-a5z;
    s2x=d6x;
    s2y=d6y;
    s2z=d6z;
    n2x=-a6x;
    n2y=-a6y;
    n2z=-a6z;
    break;
    case 4:
    swap=true;
    if(!right){
    cx=p2x+d5x;
    cy=p2y+d5y;
    cz=p2z+d5z;
    nx=a5x;
    ny=a5y;
    nz=a5z;
    }else{
    cx=p2x-d5x;
    cy=p2y-d5y;
    cz=p2z-d5z;
    nx=-a5x;
    ny=-a5y;
    nz=-a5z;
    }
    s1x=d4x;
    s1y=d4y;
    s1z=d4z;
    n1x=-a4x;
    n1y=-a4y;
    n1z=-a4z;
    s2x=d6x;
    s2y=d6y;
    s2z=d6z;
    n2x=-a6x;
    n2y=-a6y;
    n2z=-a6z;
    break;
    case 5:
    swap=true;
    if(!right){
    cx=p2x+d6x;
    cy=p2y+d6y;
    cz=p2z+d6z;
    nx=a6x;
    ny=a6y;
    nz=a6z;
    }else{
    cx=p2x-d6x;
    cy=p2y-d6y;
    cz=p2z-d6z;
    nx=-a6x;
    ny=-a6y;
    nz=-a6z;
    }
    s1x=d4x;
    s1y=d4y;
    s1z=d4z;
    n1x=-a4x;
    n1y=-a4y;
    n1z=-a4z;
    s2x=d5x;
    s2y=d5y;
    s2z=d5z;
    n2x=-a5x;
    n2y=-a5y;
    n2z=-a5z;
    break;
    case 6:
    nx=a7x;
    ny=a7y;
    nz=a7z;
    n1x=a1x;
    n1y=a1y;
    n1z=a1z;
    n2x=a4x;
    n2y=a4y;
    n2z=a4z;
    break;
    case 7:
    nx=a8x;
    ny=a8y;
    nz=a8z;
    n1x=a1x;
    n1y=a1y;
    n1z=a1z;
    n2x=a5x;
    n2y=a5y;
    n2z=a5z;
    break;
    case 8:
    nx=a9x;
    ny=a9y;
    nz=a9z;
    n1x=a1x;
    n1y=a1y;
    n1z=a1z;
    n2x=a6x;
    n2y=a6y;
    n2z=a6z;
    break;
    case 9:
    nx=aax;
    ny=aay;
    nz=aaz;
    n1x=a2x;
    n1y=a2y;
    n1z=a2z;
    n2x=a4x;
    n2y=a4y;
    n2z=a4z;
    break;
    case 10:
    nx=abx;
    ny=aby;
    nz=abz;
    n1x=a2x;
    n1y=a2y;
    n1z=a2z;
    n2x=a5x;
    n2y=a5y;
    n2z=a5z;
    break;
    case 11:
    nx=acx;
    ny=acy;
    nz=acz;
    n1x=a2x;
    n1y=a2y;
    n1z=a2z;
    n2x=a6x;
    n2y=a6y;
    n2z=a6z;
    break;
    case 12:
    nx=adx;
    ny=ady;
    nz=adz;
    n1x=a3x;
    n1y=a3y;
    n1z=a3z;
    n2x=a4x;
    n2y=a4y;
    n2z=a4z;
    break;
    case 13:
    nx=aex;
    ny=aey;
    nz=aez;
    n1x=a3x;
    n1y=a3y;
    n1z=a3z;
    n2x=a5x;
    n2y=a5y;
    n2z=a5z;
    break;
    case 14:
    nx=afx;
    ny=afy;
    nz=afz;
    n1x=a3x;
    n1y=a3y;
    n1z=a3z;
    n2x=a6x;
    n2y=a6y;
    n2z=a6z;
    break;
    }
    var v;
    if(minIndex>5){
    if(!right){
    nx=-nx;
    ny=-ny;
    nz=-nz;
    }
    var distance;
    var maxDistance;
    var vx;
    var vy;
    var vz;
    var v1x;
    var v1y;
    var v1z;
    var v2x;
    var v2y;
    var v2z;
    v=b1.vertex1;
    v1x=v.x;
    v1y=v.y;
    v1z=v.z;
    maxDistance=nx*v1x+ny*v1y+nz*v1z;
    v=b1.vertex2;
    vx=v.x;
    vy=v.y;
    vz=v.z;
    distance=nx*vx+ny*vy+nz*vz;
    if(distance>maxDistance){
    maxDistance=distance;
    v1x=vx;
    v1y=vy;
    v1z=vz;
    }
    v=b1.vertex3;
    vx=v.x;
    vy=v.y;
    vz=v.z;
    distance=nx*vx+ny*vy+nz*vz;
    if(distance>maxDistance){
    maxDistance=distance;
    v1x=vx;
    v1y=vy;
    v1z=vz;
    }
    v=b1.vertex4;
    vx=v.x;
    vy=v.y;
    vz=v.z;
    distance=nx*vx+ny*vy+nz*vz;
    if(distance>maxDistance){
    maxDistance=distance;
    v1x=vx;
    v1y=vy;
    v1z=vz;
    }
    v=b1.vertex5;
    vx=v.x;
    vy=v.y;
    vz=v.z;
    distance=nx*vx+ny*vy+nz*vz;
    if(distance>maxDistance){
    maxDistance=distance;
    v1x=vx;
    v1y=vy;
    v1z=vz;
    }
    v=b1.vertex6;
    vx=v.x;
    vy=v.y;
    vz=v.z;
    distance=nx*vx+ny*vy+nz*vz;
    if(distance>maxDistance){
    maxDistance=distance;
    v1x=vx;
    v1y=vy;
    v1z=vz;
    }
    v=b1.vertex7;
    vx=v.x;
    vy=v.y;
    vz=v.z;
    distance=nx*vx+ny*vy+nz*vz;
    if(distance>maxDistance){
    maxDistance=distance;
    v1x=vx;
    v1y=vy;
    v1z=vz;
    }
    v=b1.vertex8;
    vx=v.x;
    vy=v.y;
    vz=v.z;
    distance=nx*vx+ny*vy+nz*vz;
    if(distance>maxDistance){
    maxDistance=distance;
    v1x=vx;
    v1y=vy;
    v1z=vz;
    }
    v=b2.vertex1;
    v2x=v.x;
    v2y=v.y;
    v2z=v.z;
    maxDistance=nx*v2x+ny*v2y+nz*v2z;
    v=b2.vertex2;
    vx=v.x;
    vy=v.y;
    vz=v.z;
    distance=nx*vx+ny*vy+nz*vz;
    if(distance<maxDistance){
    maxDistance=distance;
    v2x=vx;
    v2y=vy;
    v2z=vz;
    }
    v=b2.vertex3;
    vx=v.x;
    vy=v.y;
    vz=v.z;
    distance=nx*vx+ny*vy+nz*vz;
    if(distance<maxDistance){
    maxDistance=distance;
    v2x=vx;
    v2y=vy;
    v2z=vz;
    }
    v=b2.vertex4;
    vx=v.x;
    vy=v.y;
    vz=v.z;
    distance=nx*vx+ny*vy+nz*vz;
    if(distance<maxDistance){
    maxDistance=distance;
    v2x=vx;
    v2y=vy;
    v2z=vz;
    }
    v=b2.vertex5;
    vx=v.x;
    vy=v.y;
    vz=v.z;
    distance=nx*vx+ny*vy+nz*vz;
    if(distance<maxDistance){
    maxDistance=distance;
    v2x=vx;
    v2y=vy;
    v2z=vz;
    }
    v=b2.vertex6;
    vx=v.x;
    vy=v.y;
    vz=v.z;
    distance=nx*vx+ny*vy+nz*vz;
    if(distance<maxDistance){
    maxDistance=distance;
    v2x=vx;
    v2y=vy;
    v2z=vz;
    }
    v=b2.vertex7;
    vx=v.x;
    vy=v.y;
    vz=v.z;
    distance=nx*vx+ny*vy+nz*vz;
    if(distance<maxDistance){
    maxDistance=distance;
    v2x=vx;
    v2y=vy;
    v2z=vz;
    }
    v=b2.vertex8;
    vx=v.x;
    vy=v.y;
    vz=v.z;
    distance=nx*vx+ny*vy+nz*vz;
    if(distance<maxDistance){
    maxDistance=distance;
    v2x=vx;
    v2y=vy;
    v2z=vz;
    }
    vx=v2x-v1x;
    vy=v2y-v1y;
    vz=v2z-v1z;
    dot1=n1x*n2x+n1y*n2y+n1z*n2z;
    var t=(vx*(n1x-n2x*dot1)+vy*(n1y-n2y*dot1)+vz*(n1z-n2z*dot1))/(1-dot1*dot1);
    result.addContactInfo(v1x+n1x*t+nx*depth*0.5,v1y+n1y*t+ny*depth*0.5,v1z+n1z*t+nz*depth*0.5,nx,ny,nz,depth,b1,b2,0,0,false);
    return;
    }
    var q1x;
    var q1y;
    var q1z;
    var q2x;
    var q2y;
    var q2z;
    var q3x;
    var q3y;
    var q3z;
    var q4x;
    var q4y;
    var q4z;
    var minDot=1;
    var dot=0;
    var minDotIndex=0;
    if(swap){
    dot=a1x*nx+a1y*ny+a1z*nz;
    if(dot<minDot){
    minDot=dot;
    minDotIndex=0;
    }
    if(-dot<minDot){
    minDot=-dot;
    minDotIndex=1;
    }
    dot=a2x*nx+a2y*ny+a2z*nz;
    if(dot<minDot){
    minDot=dot;
    minDotIndex=2;
    }
    if(-dot<minDot){
    minDot=-dot;
    minDotIndex=3;
    }
    dot=a3x*nx+a3y*ny+a3z*nz;
    if(dot<minDot){
    minDot=dot;
    minDotIndex=4;
    }
    if(-dot<minDot){
    minDot=-dot;
    minDotIndex=5;
    }
    switch(minDotIndex){
    case 0:
    v=b1.vertex1;
    q1x=v.x;
    q1y=v.y;
    q1z=v.z;
    v=b1.vertex3;
    q2x=v.x;
    q2y=v.y;
    q2z=v.z;
    v=b1.vertex4;
    q3x=v.x;
    q3y=v.y;
    q3z=v.z;
    v=b1.vertex2;
    q4x=v.x;
    q4y=v.y;
    q4z=v.z;
    break;
    case 1:
    v=b1.vertex6;
    q1x=v.x;
    q1y=v.y;
    q1z=v.z;
    v=b1.vertex8;
    q2x=v.x;
    q2y=v.y;
    q2z=v.z;
    v=b1.vertex7;
    q3x=v.x;
    q3y=v.y;
    q3z=v.z;
    v=b1.vertex5;
    q4x=v.x;
    q4y=v.y;
    q4z=v.z;
    break;
    case 2:
    v=b1.vertex5;
    q1x=v.x;
    q1y=v.y;
    q1z=v.z;
    v=b1.vertex1;
    q2x=v.x;
    q2y=v.y;
    q2z=v.z;
    v=b1.vertex2;
    q3x=v.x;
    q3y=v.y;
    q3z=v.z;
    v=b1.vertex6;
    q4x=v.x;
    q4y=v.y;
    q4z=v.z;
    break;
    case 3:
    v=b1.vertex8;
    q1x=v.x;
    q1y=v.y;
    q1z=v.z;
    v=b1.vertex4;
    q2x=v.x;
    q2y=v.y;
    q2z=v.z;
    v=b1.vertex3;
    q3x=v.x;
    q3y=v.y;
    q3z=v.z;
    v=b1.vertex7;
    q4x=v.x;
    q4y=v.y;
    q4z=v.z;
    break;
    case 4:
    v=b1.vertex5;
    q1x=v.x;
    q1y=v.y;
    q1z=v.z;
    v=b1.vertex7;
    q2x=v.x;
    q2y=v.y;
    q2z=v.z;
    v=b1.vertex3;
    q3x=v.x;
    q3y=v.y;
    q3z=v.z;
    v=b1.vertex1;
    q4x=v.x;
    q4y=v.y;
    q4z=v.z;
    break;
    case 5:
    v=b1.vertex2;
    q1x=v.x;
    q1y=v.y;
    q1z=v.z;
    v=b1.vertex4;
    q2x=v.x;
    q2y=v.y;
    q2z=v.z;
    v=b1.vertex8;
    q3x=v.x;
    q3y=v.y;
    q3z=v.z;
    v=b1.vertex6;
    q4x=v.x;
    q4y=v.y;
    q4z=v.z;
    break;
    }
    }else{
    dot=a4x*nx+a4y*ny+a4z*nz;
    if(dot<minDot){
    minDot=dot;
    minDotIndex=0;
    }
    if(-dot<minDot){
    minDot=-dot;
    minDotIndex=1;
    }
    dot=a5x*nx+a5y*ny+a5z*nz;
    if(dot<minDot){
    minDot=dot;
    minDotIndex=2;
    }
    if(-dot<minDot){
    minDot=-dot;
    minDotIndex=3;
    }
    dot=a6x*nx+a6y*ny+a6z*nz;
    if(dot<minDot){
    minDot=dot;
    minDotIndex=4;
    }
    if(-dot<minDot){
    minDot=-dot;
    minDotIndex=5;
    }
    switch(minDotIndex){
    case 0:
    v=b2.vertex1;
    q1x=v.x;
    q1y=v.y;
    q1z=v.z;
    v=b2.vertex3;
    q2x=v.x;
    q2y=v.y;
    q2z=v.z;
    v=b2.vertex4;
    q3x=v.x;
    q3y=v.y;
    q3z=v.z;
    v=b2.vertex2;
    q4x=v.x;
    q4y=v.y;
    q4z=v.z;
    break;
    case 1:
    v=b2.vertex6;
    q1x=v.x;
    q1y=v.y;
    q1z=v.z;
    v=b2.vertex8;
    q2x=v.x;
    q2y=v.y;
    q2z=v.z;
    v=b2.vertex7;
    q3x=v.x;
    q3y=v.y;
    q3z=v.z;
    v=b2.vertex5;
    q4x=v.x;
    q4y=v.y;
    q4z=v.z;
    break;
    case 2:
    v=b2.vertex5;
    q1x=v.x;
    q1y=v.y;
    q1z=v.z;
    v=b2.vertex1;
    q2x=v.x;
    q2y=v.y;
    q2z=v.z;
    v=b2.vertex2;
    q3x=v.x;
    q3y=v.y;
    q3z=v.z;
    v=b2.vertex6;
    q4x=v.x;
    q4y=v.y;
    q4z=v.z;
    break;
    case 3:
    v=b2.vertex8;
    q1x=v.x;
    q1y=v.y;
    q1z=v.z;
    v=b2.vertex4;
    q2x=v.x;
    q2y=v.y;
    q2z=v.z;
    v=b2.vertex3;
    q3x=v.x;
    q3y=v.y;
    q3z=v.z;
    v=b2.vertex7;
    q4x=v.x;
    q4y=v.y;
    q4z=v.z;
    break;
    case 4:
    v=b2.vertex5;
    q1x=v.x;
    q1y=v.y;
    q1z=v.z;
    v=b2.vertex7;
    q2x=v.x;
    q2y=v.y;
    q2z=v.z;
    v=b2.vertex3;
    q3x=v.x;
    q3y=v.y;
    q3z=v.z;
    v=b2.vertex1;
    q4x=v.x;
    q4y=v.y;
    q4z=v.z;
    break;
    case 5:
    v=b2.vertex2;
    q1x=v.x;
    q1y=v.y;
    q1z=v.z;
    v=b2.vertex4;
    q2x=v.x;
    q2y=v.y;
    q2z=v.z;
    v=b2.vertex8;
    q3x=v.x;
    q3y=v.y;
    q3z=v.z;
    v=b2.vertex6;
    q4x=v.x;
    q4y=v.y;
    q4z=v.z;
    break;
    }
    }
    var numClipVertices;
    var numAddedClipVertices;
    var index;
    var x1;
    var y1;
    var z1;
    var x2;
    var y2;
    var z2;
    this.clipVertices1[0]=q1x;
    this.clipVertices1[1]=q1y;
    this.clipVertices1[2]=q1z;
    this.clipVertices1[3]=q2x;
    this.clipVertices1[4]=q2y;
    this.clipVertices1[5]=q2z;
    this.clipVertices1[6]=q3x;
    this.clipVertices1[7]=q3y;
    this.clipVertices1[8]=q3z;
    this.clipVertices1[9]=q4x;
    this.clipVertices1[10]=q4y;
    this.clipVertices1[11]=q4z;
    numAddedClipVertices=0;
    x1=this.clipVertices1[9];
    y1=this.clipVertices1[10];
    z1=this.clipVertices1[11];
    dot1=(x1-cx-s1x)*n1x+(y1-cy-s1y)*n1y+(z1-cz-s1z)*n1z;
    for(var i=0;i<4;i++){
    index=i*3;
    x2=this.clipVertices1[index];
    y2=this.clipVertices1[index+1];
    z2=this.clipVertices1[index+2];
    dot2=(x2-cx-s1x)*n1x+(y2-cy-s1y)*n1y+(z2-cz-s1z)*n1z;
    if(dot1>0){
    if(dot2>0){
    index=numAddedClipVertices*3;
    numAddedClipVertices++;
    this.clipVertices2[index]=x2;
    this.clipVertices2[index+1]=y2;
    this.clipVertices2[index+2]=z2;
    }else{
    index=numAddedClipVertices*3;
    numAddedClipVertices++;
    t=dot1/(dot1-dot2);
    this.clipVertices2[index]=x1+(x2-x1)*t;
    this.clipVertices2[index+1]=y1+(y2-y1)*t;
    this.clipVertices2[index+2]=z1+(z2-z1)*t;
    }
    }else{
    if(dot2>0){
    index=numAddedClipVertices*3;
    numAddedClipVertices++;
    t=dot1/(dot1-dot2);
    this.clipVertices2[index]=x1+(x2-x1)*t;
    this.clipVertices2[index+1]=y1+(y2-y1)*t;
    this.clipVertices2[index+2]=z1+(z2-z1)*t;
    index=numAddedClipVertices*3;
    numAddedClipVertices++;
    this.clipVertices2[index]=x2;
    this.clipVertices2[index+1]=y2;
    this.clipVertices2[index+2]=z2;
    }
    }
    x1=x2;
    y1=y2;
    z1=z2;
    dot1=dot2;
    }
    numClipVertices=numAddedClipVertices;
    if(numClipVertices==0)return;
    numAddedClipVertices=0;
    index=(numClipVertices-1)*3;
    x1=this.clipVertices2[index];
    y1=this.clipVertices2[index+1];
    z1=this.clipVertices2[index+2];
    dot1=(x1-cx-s2x)*n2x+(y1-cy-s2y)*n2y+(z1-cz-s2z)*n2z;
    for(i=0;i<numClipVertices;i++){
    index=i*3;
    x2=this.clipVertices2[index];
    y2=this.clipVertices2[index+1];
    z2=this.clipVertices2[index+2];
    dot2=(x2-cx-s2x)*n2x+(y2-cy-s2y)*n2y+(z2-cz-s2z)*n2z;
    if(dot1>0){
    if(dot2>0){
    index=numAddedClipVertices*3;
    numAddedClipVertices++;
    this.clipVertices1[index]=x2;
    this.clipVertices1[index+1]=y2;
    this.clipVertices1[index+2]=z2;
    }else{
    index=numAddedClipVertices*3;
    numAddedClipVertices++;
    t=dot1/(dot1-dot2);
    this.clipVertices1[index]=x1+(x2-x1)*t;
    this.clipVertices1[index+1]=y1+(y2-y1)*t;
    this.clipVertices1[index+2]=z1+(z2-z1)*t;
    }
    }else{
    if(dot2>0){
    index=numAddedClipVertices*3;
    numAddedClipVertices++;
    t=dot1/(dot1-dot2);
    this.clipVertices1[index]=x1+(x2-x1)*t;
    this.clipVertices1[index+1]=y1+(y2-y1)*t;
    this.clipVertices1[index+2]=z1+(z2-z1)*t;
    index=numAddedClipVertices*3;
    numAddedClipVertices++;
    this.clipVertices1[index]=x2;
    this.clipVertices1[index+1]=y2;
    this.clipVertices1[index+2]=z2;
    }
    }
    x1=x2;
    y1=y2;
    z1=z2;
    dot1=dot2;
    }
    numClipVertices=numAddedClipVertices;
    if(numClipVertices==0)return;
    numAddedClipVertices=0;
    index=(numClipVertices-1)*3;
    x1=this.clipVertices1[index];
    y1=this.clipVertices1[index+1];
    z1=this.clipVertices1[index+2];
    dot1=(x1-cx+s1x)*-n1x+(y1-cy+s1y)*-n1y+(z1-cz+s1z)*-n1z;
    for(i=0;i<numClipVertices;i++){
    index=i*3;
    x2=this.clipVertices1[index];
    y2=this.clipVertices1[index+1];
    z2=this.clipVertices1[index+2];
    dot2=(x2-cx+s1x)*-n1x+(y2-cy+s1y)*-n1y+(z2-cz+s1z)*-n1z;
    if(dot1>0){
    if(dot2>0){
    index=numAddedClipVertices*3;
    numAddedClipVertices++;
    this.clipVertices2[index]=x2;
    this.clipVertices2[index+1]=y2;
    this.clipVertices2[index+2]=z2;
    }else{
    index=numAddedClipVertices*3;
    numAddedClipVertices++;
    t=dot1/(dot1-dot2);
    this.clipVertices2[index]=x1+(x2-x1)*t;
    this.clipVertices2[index+1]=y1+(y2-y1)*t;
    this.clipVertices2[index+2]=z1+(z2-z1)*t;
    }
    }else{
    if(dot2>0){
    index=numAddedClipVertices*3;
    numAddedClipVertices++;
    t=dot1/(dot1-dot2);
    this.clipVertices2[index]=x1+(x2-x1)*t;
    this.clipVertices2[index+1]=y1+(y2-y1)*t;
    this.clipVertices2[index+2]=z1+(z2-z1)*t;
    index=numAddedClipVertices*3;
    numAddedClipVertices++;
    this.clipVertices2[index]=x2;
    this.clipVertices2[index+1]=y2;
    this.clipVertices2[index+2]=z2;
    }
    }
    x1=x2;
    y1=y2;
    z1=z2;
    dot1=dot2;
    }
    numClipVertices=numAddedClipVertices;
    if(numClipVertices==0)return;
    numAddedClipVertices=0;
    index=(numClipVertices-1)*3;
    x1=this.clipVertices2[index];
    y1=this.clipVertices2[index+1];
    z1=this.clipVertices2[index+2];
    dot1=(x1-cx+s2x)*-n2x+(y1-cy+s2y)*-n2y+(z1-cz+s2z)*-n2z;
    for(i=0;i<numClipVertices;i++){
    index=i*3;
    x2=this.clipVertices2[index];
    y2=this.clipVertices2[index+1];
    z2=this.clipVertices2[index+2];
    dot2=(x2-cx+s2x)*-n2x+(y2-cy+s2y)*-n2y+(z2-cz+s2z)*-n2z;
    if(dot1>0){
    if(dot2>0){
    index=numAddedClipVertices*3;
    numAddedClipVertices++;
    this.clipVertices1[index]=x2;
    this.clipVertices1[index+1]=y2;
    this.clipVertices1[index+2]=z2;
    }else{
    index=numAddedClipVertices*3;
    numAddedClipVertices++;
    t=dot1/(dot1-dot2);
    this.clipVertices1[index]=x1+(x2-x1)*t;
    this.clipVertices1[index+1]=y1+(y2-y1)*t;
    this.clipVertices1[index+2]=z1+(z2-z1)*t;
    }
    }else{
    if(dot2>0){
    index=numAddedClipVertices*3;
    numAddedClipVertices++;
    t=dot1/(dot1-dot2);
    this.clipVertices1[index]=x1+(x2-x1)*t;
    this.clipVertices1[index+1]=y1+(y2-y1)*t;
    this.clipVertices1[index+2]=z1+(z2-z1)*t;
    index=numAddedClipVertices*3;
    numAddedClipVertices++;
    this.clipVertices1[index]=x2;
    this.clipVertices1[index+1]=y2;
    this.clipVertices1[index+2]=z2;
    }
    }
    x1=x2;
    y1=y2;
    z1=z2;
    dot1=dot2;
    }
    numClipVertices=numAddedClipVertices;
    if(swap){
    var tb=b1;
    b1=b2;
    b2=tb;
    }
    if(numClipVertices==0)return;
    if(numClipVertices>4){
    x1=(q1x+q2x+q3x+q4x)*0.25;
    y1=(q1y+q2y+q3y+q4y)*0.25;
    z1=(q1z+q2z+q3z+q4z)*0.25;
    n1x=q1x-x1;
    n1y=q1y-y1;
    n1z=q1z-z1;
    n2x=q2x-x1;
    n2y=q2y-y1;
    n2z=q2z-z1;
    var index1=0;
    var index2=0;
    var index3=0;
    var index4=0;
    var maxDot=-this.INF;
    minDot=this.INF;
    for(i=0;i<numClipVertices;i++){
    this.used[i]=false;
    index=i*3;
    x1=this.clipVertices1[index];
    y1=this.clipVertices1[index+1];
    z1=this.clipVertices1[index+2];
    dot=x1*n1x+y1*n1y+z1*n1z;
    if(dot<minDot){
    minDot=dot;
    index1=i;
    }
    if(dot>maxDot){
    maxDot=dot;
    index3=i;
    }
    }
    this.used[index1]=true;
    this.used[index3]=true;
    maxDot=-this.INF;
    minDot=this.INF;
    for(i=0;i<numClipVertices;i++){
    if(this.used[i])continue;
    index=i*3;
    x1=this.clipVertices1[index];
    y1=this.clipVertices1[index+1];
    z1=this.clipVertices1[index+2];
    dot=x1*n2x+y1*n2y+z1*n2z;
    if(dot<minDot){
    minDot=dot;
    index2=i;
    }
    if(dot>maxDot){
    maxDot=dot;
    index4=i;
    }
    }
    index=index1*3;
    x1=this.clipVertices1[index];
    y1=this.clipVertices1[index+1];
    z1=this.clipVertices1[index+2];
    dot=(x1-cx)*nx+(y1-cy)*ny+(z1-cz)*nz;
    if(dot<0){
    result.addContactInfo(x1,y1,z1,nx,ny,nz,dot,b1,b2,0,0,false);
    }
    index=index2*3;
    x1=this.clipVertices1[index];
    y1=this.clipVertices1[index+1];
    z1=this.clipVertices1[index+2];
    dot=(x1-cx)*nx+(y1-cy)*ny+(z1-cz)*nz;
    if(dot<0){
    result.addContactInfo(x1,y1,z1,nx,ny,nz,dot,b1,b2,1,0,false);
    }
    index=index3*3;
    x1=this.clipVertices1[index];
    y1=this.clipVertices1[index+1];
    z1=this.clipVertices1[index+2];
    dot=(x1-cx)*nx+(y1-cy)*ny+(z1-cz)*nz;
    if(dot<0){
    result.addContactInfo(x1,y1,z1,nx,ny,nz,dot,b1,b2,2,0,false);
    }
    index=index4*3;
    x1=this.clipVertices1[index];
    y1=this.clipVertices1[index+1];
    z1=this.clipVertices1[index+2];
    dot=(x1-cx)*nx+(y1-cy)*ny+(z1-cz)*nz;
    if(dot<0){
    result.addContactInfo(x1,y1,z1,nx,ny,nz,dot,b1,b2,3,0,false);
    }
    }else{
    for(i=0;i<numClipVertices;i++){
    index=i*3;
    x1=this.clipVertices1[index];
    y1=this.clipVertices1[index+1];
    z1=this.clipVertices1[index+2];
    dot=(x1-cx)*nx+(y1-cy)*ny+(z1-cz)*nz;
    if(dot<0){
    result.addContactInfo(x1,y1,z1,nx,ny,nz,dot,b1,b2,i,0,false);
    }
    }
    }

}
OIMO.BoxCylinderCollisionDetector = function(flip){
    OIMO.CollisionDetector.call( this );
    this.flip=flip;
}
OIMO.BoxCylinderCollisionDetector.prototype = Object.create( OIMO.CollisionDetector.prototype );
OIMO.BoxCylinderCollisionDetector.prototype.getSep = function(c1,c2,sep,pos,dep){
    var t1x;
    var t1y;
    var t1z;
    var t2x;
    var t2y;
    var t2z;
    var sup=new OIMO.Vec3();
    var len;
    var p1x;
    var p1y;
    var p1z;
    var p2x;
    var p2y;
    var p2z;
    var v01x=c1.position.x;
    var v01y=c1.position.y;
    var v01z=c1.position.z;
    var v02x=c2.position.x;
    var v02y=c2.position.y;
    var v02z=c2.position.z;
    var v0x=v02x-v01x;
    var v0y=v02y-v01y;
    var v0z=v02z-v01z;
    if(v0x*v0x+v0y*v0y+v0z*v0z==0)v0y=0.001;
    var nx=-v0x;
    var ny=-v0y;
    var nz=-v0z;
    this.supportPointB(c1,-nx,-ny,-nz,sup);
    var v11x=sup.x;
    var v11y=sup.y;
    var v11z=sup.z;
    this.supportPointC(c2,nx,ny,nz,sup);
    var v12x=sup.x;
    var v12y=sup.y;
    var v12z=sup.z;
    var v1x=v12x-v11x;
    var v1y=v12y-v11y;
    var v1z=v12z-v11z;
    if(v1x*nx+v1y*ny+v1z*nz<=0){
    return false;
    }
    nx=v1y*v0z-v1z*v0y;
    ny=v1z*v0x-v1x*v0z;
    nz=v1x*v0y-v1y*v0x;
    if(nx*nx+ny*ny+nz*nz==0){
    sep.init(v1x-v0x,v1y-v0y,v1z-v0z);
    sep.normalize(sep);
    pos.init((v11x+v12x)*0.5,(v11y+v12y)*0.5,(v11z+v12z)*0.5);
    return true;
    }
    this.supportPointB(c1,-nx,-ny,-nz,sup);
    var v21x=sup.x;
    var v21y=sup.y;
    var v21z=sup.z;
    this.supportPointC(c2,nx,ny,nz,sup);
    var v22x=sup.x;
    var v22y=sup.y;
    var v22z=sup.z;
    var v2x=v22x-v21x;
    var v2y=v22y-v21y;
    var v2z=v22z-v21z;
    if(v2x*nx+v2y*ny+v2z*nz<=0){
    return false;
    }
    t1x=v1x-v0x;
    t1y=v1y-v0y;
    t1z=v1z-v0z;
    t2x=v2x-v0x;
    t2y=v2y-v0y;
    t2z=v2z-v0z;
    nx=t1y*t2z-t1z*t2y;
    ny=t1z*t2x-t1x*t2z;
    nz=t1x*t2y-t1y*t2x;
    if(nx*v0x+ny*v0y+nz*v0z>0){
    t1x=v1x;
    t1y=v1y;
    t1z=v1z;
    v1x=v2x;
    v1y=v2y;
    v1z=v2z;
    v2x=t1x;
    v2y=t1y;
    v2z=t1z;
    t1x=v11x;
    t1y=v11y;
    t1z=v11z;
    v11x=v21x;
    v11y=v21y;
    v11z=v21z;
    v21x=t1x;
    v21y=t1y;
    v21z=t1z;
    t1x=v12x;
    t1y=v12y;
    t1z=v12z;
    v12x=v22x;
    v12y=v22y;
    v12z=v22z;
    v22x=t1x;
    v22y=t1y;
    v22z=t1z;
    nx=-nx;
    ny=-ny;
    nz=-nz;
    }
    var iterations=0;
    while(true){
    if(++iterations>100){
    return false;
    }
    this.supportPointB(c1,-nx,-ny,-nz,sup);
    var v31x=sup.x;
    var v31y=sup.y;
    var v31z=sup.z;
    this.supportPointC(c2,nx,ny,nz,sup);
    var v32x=sup.x;
    var v32y=sup.y;
    var v32z=sup.z;
    var v3x=v32x-v31x;
    var v3y=v32y-v31y;
    var v3z=v32z-v31z;
    if(v3x*nx+v3y*ny+v3z*nz<=0){
    return false;
    }
    if((v1y*v3z-v1z*v3y)*v0x+(v1z*v3x-v1x*v3z)*v0y+(v1x*v3y-v1y*v3x)*v0z<0){
    v2x=v3x;
    v2y=v3y;
    v2z=v3z;
    v21x=v31x;
    v21y=v31y;
    v21z=v31z;
    v22x=v32x;
    v22y=v32y;
    v22z=v32z;
    t1x=v1x-v0x;
    t1y=v1y-v0y;
    t1z=v1z-v0z;
    t2x=v3x-v0x;
    t2y=v3y-v0y;
    t2z=v3z-v0z;
    nx=t1y*t2z-t1z*t2y;
    ny=t1z*t2x-t1x*t2z;
    nz=t1x*t2y-t1y*t2x;
    continue;
    }
    if((v3y*v2z-v3z*v2y)*v0x+(v3z*v2x-v3x*v2z)*v0y+(v3x*v2y-v3y*v2x)*v0z<0){
    v1x=v3x;
    v1y=v3y;
    v1z=v3z;
    v11x=v31x;
    v11y=v31y;
    v11z=v31z;
    v12x=v32x;
    v12y=v32y;
    v12z=v32z;
    t1x=v3x-v0x;
    t1y=v3y-v0y;
    t1z=v3z-v0z;
    t2x=v2x-v0x;
    t2y=v2y-v0y;
    t2z=v2z-v0z;
    nx=t1y*t2z-t1z*t2y;
    ny=t1z*t2x-t1x*t2z;
    nz=t1x*t2y-t1y*t2x;
    continue;
    }
    var hit=false;
    while(true){
    t1x=v2x-v1x;
    t1y=v2y-v1y;
    t1z=v2z-v1z;
    t2x=v3x-v1x;
    t2y=v3y-v1y;
    t2z=v3z-v1z;
    nx=t1y*t2z-t1z*t2y;
    ny=t1z*t2x-t1x*t2z;
    nz=t1x*t2y-t1y*t2x;
    len=1/Math.sqrt(nx*nx+ny*ny+nz*nz);
    nx*=len;
    ny*=len;
    nz*=len;
    if(nx*v1x+ny*v1y+nz*v1z>=0&&!hit){
    var b0=(v1y*v2z-v1z*v2y)*v3x+(v1z*v2x-v1x*v2z)*v3y+(v1x*v2y-v1y*v2x)*v3z;
    var b1=(v3y*v2z-v3z*v2y)*v0x+(v3z*v2x-v3x*v2z)*v0y+(v3x*v2y-v3y*v2x)*v0z;
    var b2=(v0y*v1z-v0z*v1y)*v3x+(v0z*v1x-v0x*v1z)*v3y+(v0x*v1y-v0y*v1x)*v3z;
    var b3=(v2y*v1z-v2z*v1y)*v0x+(v2z*v1x-v2x*v1z)*v0y+(v2x*v1y-v2y*v1x)*v0z;
    var sum=b0+b1+b2+b3;
    if(sum<=0){
    b0=0;
    b1=(v2y*v3z-v2z*v3y)*nx+(v2z*v3x-v2x*v3z)*ny+(v2x*v3y-v2y*v3x)*nz;
    b2=(v3y*v2z-v3z*v2y)*nx+(v3z*v2x-v3x*v2z)*ny+(v3x*v2y-v3y*v2x)*nz;
    b3=(v1y*v2z-v1z*v2y)*nx+(v1z*v2x-v1x*v2z)*ny+(v1x*v2y-v1y*v2x)*nz;
    sum=b1+b2+b3;
    }
    var inv=1/sum;
    p1x=(v01x*b0+v11x*b1+v21x*b2+v31x*b3)*inv;
    p1y=(v01y*b0+v11y*b1+v21y*b2+v31y*b3)*inv;
    p1z=(v01z*b0+v11z*b1+v21z*b2+v31z*b3)*inv;
    p2x=(v02x*b0+v12x*b1+v22x*b2+v32x*b3)*inv;
    p2y=(v02y*b0+v12y*b1+v22y*b2+v32y*b3)*inv;
    p2z=(v02z*b0+v12z*b1+v22z*b2+v32z*b3)*inv;
    hit=true;
    }
    this.supportPointB(c1,-nx,-ny,-nz,sup);
    var v41x=sup.x;
    var v41y=sup.y;
    var v41z=sup.z;
    this.supportPointC(c2,nx,ny,nz,sup);
    var v42x=sup.x;
    var v42y=sup.y;
    var v42z=sup.z;
    var v4x=v42x-v41x;
    var v4y=v42y-v41y;
    var v4z=v42z-v41z;
    var separation=-(v4x*nx+v4y*ny+v4z*nz);
    if((v4x-v3x)*nx+(v4y-v3y)*ny+(v4z-v3z)*nz<=0.01||separation>=0){
    if(hit){
    sep.init(-nx,-ny,-nz);
    pos.init((p1x+p2x)*0.5,(p1y+p2y)*0.5,(p1z+p2z)*0.5);
    dep.x=separation;
    return true;
    }
    return false;
    }
    if(
    (v4y*v1z-v4z*v1y)*v0x+
    (v4z*v1x-v4x*v1z)*v0y+
    (v4x*v1y-v4y*v1x)*v0z<0
    ){
    if(
    (v4y*v2z-v4z*v2y)*v0x+
    (v4z*v2x-v4x*v2z)*v0y+
    (v4x*v2y-v4y*v2x)*v0z<0
    ){
    v1x=v4x;
    v1y=v4y;
    v1z=v4z;
    v11x=v41x;
    v11y=v41y;
    v11z=v41z;
    v12x=v42x;
    v12y=v42y;
    v12z=v42z;
    }else{
    v3x=v4x;
    v3y=v4y;
    v3z=v4z;
    v31x=v41x;
    v31y=v41y;
    v31z=v41z;
    v32x=v42x;
    v32y=v42y;
    v32z=v42z;
    }
    }else{
    if(
    (v4y*v3z-v4z*v3y)*v0x+
    (v4z*v3x-v4x*v3z)*v0y+
    (v4x*v3y-v4y*v3x)*v0z<0
    ){
    v2x=v4x;
    v2y=v4y;
    v2z=v4z;
    v21x=v41x;
    v21y=v41y;
    v21z=v41z;
    v22x=v42x;
    v22y=v42y;
    v22z=v42z;
    }else{
    v1x=v4x;
    v1y=v4y;
    v1z=v4z;
    v11x=v41x;
    v11y=v41y;
    v11z=v41z;
    v12x=v42x;
    v12y=v42y;
    v12z=v42z;
}
}
}
}
//return false;
}
OIMO.BoxCylinderCollisionDetector.prototype.supportPointB = function(c,dx,dy,dz,out){
    var rot=c.rotation.elements;
    var ldx=rot[0]*dx+rot[3]*dy+rot[6]*dz;
    var ldy=rot[1]*dx+rot[4]*dy+rot[7]*dz;
    var ldz=rot[2]*dx+rot[5]*dy+rot[8]*dz;
    var w=c.halfWidth;
    var h=c.halfHeight;
    var d=c.halfDepth;
    var ox;
    var oy;
    var oz;
    if(ldx<0)ox=-w;
    else ox=w;
    if(ldy<0)oy=-h;
    else oy=h;
    if(ldz<0)oz=-d;
    else oz=d;
    ldx=rot[0]*ox+rot[1]*oy+rot[2]*oz+c.position.x;
    ldy=rot[3]*ox+rot[4]*oy+rot[5]*oz+c.position.y;
    ldz=rot[6]*ox+rot[7]*oy+rot[8]*oz+c.position.z;
    out.init(ldx,ldy,ldz);
}
OIMO.BoxCylinderCollisionDetector.prototype.supportPointC = function(c,dx,dy,dz,out){
    var rot=c.rotation.elements;
    var ldx=rot[0]*dx+rot[3]*dy+rot[6]*dz;
    var ldy=rot[1]*dx+rot[4]*dy+rot[7]*dz;
    var ldz=rot[2]*dx+rot[5]*dy+rot[8]*dz;
    var radx=ldx;
    var radz=ldz;
    var len=radx*radx+radz*radz;
    var rad=c.radius;
    var hh=c.halfHeight;
    var ox;
    var oy;
    var oz;
    if(len==0){
    if(ldy<0){
    ox=rad;
    oy=-hh;
    oz=0;
    }else{
    ox=rad;
    oy=hh;
    oz=0;
    }
    }else{
    len=c.radius/Math.sqrt(len);
    if(ldy<0){
    ox=radx*len;
    oy=-hh;
    oz=radz*len;
    }else{
    ox=radx*len;
    oy=hh;
    oz=radz*len;
    }
    }
    ldx=rot[0]*ox+rot[1]*oy+rot[2]*oz+c.position.x;
    ldy=rot[3]*ox+rot[4]*oy+rot[5]*oz+c.position.y;
    ldz=rot[6]*ox+rot[7]*oy+rot[8]*oz+c.position.z;
    out.init(ldx,ldy,ldz);
}
OIMO.BoxCylinderCollisionDetector.prototype.detectCollision = function(shape1,shape2,result){
    var b;
    var c;
    if(this.flip){
    b=shape2;
    c=shape1;
    }else{
    b=shape1;
    c=shape2;
    }
    var sep=new OIMO.Vec3();
    var pos=new OIMO.Vec3();
    var dep=new OIMO.Vec3();
    var co;
    if(!this.getSep(b,c,sep,pos,dep))return;
    var pbx=b.position.x;
    var pby=b.position.y;
    var pbz=b.position.z;
    var pcx=c.position.x;
    var pcy=c.position.y;
    var pcz=c.position.z;
    var bw=b.halfWidth;
    var bh=b.halfHeight;
    var bd=b.halfDepth;
    var ch=c.halfHeight;
    var r=c.radius;
    var nwx=b.normalDirectionWidth.x;
    var nwy=b.normalDirectionWidth.y;
    var nwz=b.normalDirectionWidth.z;
    var nhx=b.normalDirectionHeight.x;
    var nhy=b.normalDirectionHeight.y;
    var nhz=b.normalDirectionHeight.z;
    var ndx=b.normalDirectionDepth.x;
    var ndy=b.normalDirectionDepth.y;
    var ndz=b.normalDirectionDepth.z;
    var dwx=b.halfDirectionWidth.x;
    var dwy=b.halfDirectionWidth.y;
    var dwz=b.halfDirectionWidth.z;
    var dhx=b.halfDirectionHeight.x;
    var dhy=b.halfDirectionHeight.y;
    var dhz=b.halfDirectionHeight.z;
    var ddx=b.halfDirectionDepth.x;
    var ddy=b.halfDirectionDepth.y;
    var ddz=b.halfDirectionDepth.z;
    var ncx=c.normalDirection.x;
    var ncy=c.normalDirection.y;
    var ncz=c.normalDirection.z;
    var dcx=c.halfDirection.x;
    var dcy=c.halfDirection.y;
    var dcz=c.halfDirection.z;
    var nx=sep.x;
    var ny=sep.y;
    var nz=sep.z;
    var dotw=nx*nwx+ny*nwy+nz*nwz;
    var doth=nx*nhx+ny*nhy+nz*nhz;
    var dotd=nx*ndx+ny*ndy+nz*ndz;
    var dotc=nx*ncx+ny*ncy+nz*ncz;
    var right1=dotw>0;
    var right2=doth>0;
    var right3=dotd>0;
    var right4=dotc>0;
    if(!right1)dotw=-dotw;
    if(!right2)doth=-doth;
    if(!right3)dotd=-dotd;
    if(!right4)dotc=-dotc;
    var state=0;
    if(dotc>0.999){
    if(dotw>0.999){
    if(dotw>dotc)state=1;
    else state=4;
    }else if(doth>0.999){
    if(doth>dotc)state=2;
    else state=4;
    }else if(dotd>0.999){
    if(dotd>dotc)state=3;
    else state=4;
    }else state=4;
    }else{
    if(dotw>0.999)state=1;
    else if(doth>0.999)state=2;
    else if(dotd>0.999)state=3;
    }
    var cbx;
    var cby;
    var cbz;
    var ccx;
    var ccy;
    var ccz;
    var r00;
    var r01;
    var r02;
    var r10;
    var r11;
    var r12;
    var r20;
    var r21;
    var r22;
    var px;
    var py;
    var pz;
    var pd;
    var dot;
    var len;
    var tx;
    var ty;
    var tz;
    var td;
    var dx;
    var dy;
    var dz;
    var d1x;
    var d1y;
    var d1z;
    var d2x;
    var d2y;
    var d2z;
    var sx;
    var sy;
    var sz;
    var sd;
    var ex;
    var ey;
    var ez;
    var ed;
    var dot1;
    var dot2;
    var t1;
    var t2;
    var dir1x;
    var dir1y;
    var dir1z;
    var dir2x;
    var dir2y;
    var dir2z;
    var dir1l;
    var dir2l;
    if(state==0){
    result.addContactInfo(pos.x,pos.y,pos.z,nx,ny,nz,dep.x,b,c,0,0,false);
    }else if(state==4){
    if(right4){
    ccx=pcx-dcx;
    ccy=pcy-dcy;
    ccz=pcz-dcz;
    nx=-ncx;
    ny=-ncy;
    nz=-ncz;
    }else{
    ccx=pcx+dcx;
    ccy=pcy+dcy;
    ccz=pcz+dcz;
    nx=ncx;
    ny=ncy;
    nz=ncz;
    }
    var v1x;
    var v1y;
    var v1z;
    var v2x;
    var v2y;
    var v2z;
    var v3x;
    var v3y;
    var v3z;
    var v4x;
    var v4y;
    var v4z;
    var v;
    dot=1;
    state=0;
    dot1=nwx*nx+nwy*ny+nwz*nz;
    if(dot1<dot){
    dot=dot1;
    state=0;
    }
    if(-dot1<dot){
    dot=-dot1;
    state=1;
    }
    dot1=nhx*nx+nhy*ny+nhz*nz;
    if(dot1<dot){
    dot=dot1;
    state=2;
    }
    if(-dot1<dot){
    dot=-dot1;
    state=3;
    }
    dot1=ndx*nx+ndy*ny+ndz*nz;
    if(dot1<dot){
    dot=dot1;
    state=4;
    }
    if(-dot1<dot){
    dot=-dot1;
    state=5;
    }
    switch(state){
    case 0:
    v=b.vertex1;
    v1x=v.x;
    v1y=v.y;
    v1z=v.z;
    v=b.vertex3;
    v2x=v.x;
    v2y=v.y;
    v2z=v.z;
    v=b.vertex4;
    v3x=v.x;
    v3y=v.y;
    v3z=v.z;
    v=b.vertex2;
    v4x=v.x;
    v4y=v.y;
    v4z=v.z;
    break;
    case 1:
    v=b.vertex6;
    v1x=v.x;
    v1y=v.y;
    v1z=v.z;
    v=b.vertex8;
    v2x=v.x;
    v2y=v.y;
    v2z=v.z;
    v=b.vertex7;
    v3x=v.x;
    v3y=v.y;
    v3z=v.z;
    v=b.vertex5;
    v4x=v.x;
    v4y=v.y;
    v4z=v.z;
    break;
    case 2:
    v=b.vertex5;
    v1x=v.x;
    v1y=v.y;
    v1z=v.z;
    v=b.vertex1;
    v2x=v.x;
    v2y=v.y;
    v2z=v.z;
    v=b.vertex2;
    v3x=v.x;
    v3y=v.y;
    v3z=v.z;
    v=b.vertex6;
    v4x=v.x;
    v4y=v.y;
    v4z=v.z;
    break;
    case 3:
    v=b.vertex8;
    v1x=v.x;
    v1y=v.y;
    v1z=v.z;
    v=b.vertex4;
    v2x=v.x;
    v2y=v.y;
    v2z=v.z;
    v=b.vertex3;
    v3x=v.x;
    v3y=v.y;
    v3z=v.z;
    v=b.vertex7;
    v4x=v.x;
    v4y=v.y;
    v4z=v.z;
    break;
    case 4:
    v=b.vertex5;
    v1x=v.x;
    v1y=v.y;
    v1z=v.z;
    v=b.vertex7;
    v2x=v.x;
    v2y=v.y;
    v2z=v.z;
    v=b.vertex3;
    v3x=v.x;
    v3y=v.y;
    v3z=v.z;
    v=b.vertex1;
    v4x=v.x;
    v4y=v.y;
    v4z=v.z;
    break;
    case 5:
    v=b.vertex2;
    v1x=v.x;
    v1y=v.y;
    v1z=v.z;
    v=b.vertex4;
    v2x=v.x;
    v2y=v.y;
    v2z=v.z;
    v=b.vertex8;
    v3x=v.x;
    v3y=v.y;
    v3z=v.z;
    v=b.vertex6;
    v4x=v.x;
    v4y=v.y;
    v4z=v.z;
    break;
    }
    pd=nx*(v1x-ccx)+ny*(v1y-ccy)+nz*(v1z-ccz);
    if(pd<=0)result.addContactInfo(v1x,v1y,v1z,-nx,-ny,-nz,pd,b,c,5,0,false);
    pd=nx*(v2x-ccx)+ny*(v2y-ccy)+nz*(v2z-ccz);
    if(pd<=0)result.addContactInfo(v2x,v2y,v2z,-nx,-ny,-nz,pd,b,c,6,0,false);
    pd=nx*(v3x-ccx)+ny*(v3y-ccy)+nz*(v3z-ccz);
    if(pd<=0)result.addContactInfo(v3x,v3y,v3z,-nx,-ny,-nz,pd,b,c,7,0,false);
    pd=nx*(v4x-ccx)+ny*(v4y-ccy)+nz*(v4z-ccz);
    if(pd<=0)result.addContactInfo(v4x,v4y,v4z,-nx,-ny,-nz,pd,b,c,8,0,false);
    }else{
    switch(state){
    case 1:
    if(right1){
    cbx=pbx+dwx;
    cby=pby+dwy;
    cbz=pbz+dwz;
    nx=nwx;
    ny=nwy;
    nz=nwz;
    }else{
    cbx=pbx-dwx;
    cby=pby-dwy;
    cbz=pbz-dwz;
    nx=-nwx;
    ny=-nwy;
    nz=-nwz;
    }
    dir1x=nhx;
    dir1y=nhy;
    dir1z=nhz;
    dir1l=bh;
    dir2x=ndx;
    dir2y=ndy;
    dir2z=ndz;
    dir2l=bd;
    break;
    case 2:
    if(right2){
    cbx=pbx+dhx;
    cby=pby+dhy;
    cbz=pbz+dhz;
    nx=nhx;
    ny=nhy;
    nz=nhz;
    }else{
    cbx=pbx-dhx;
    cby=pby-dhy;
    cbz=pbz-dhz;
    nx=-nhx;
    ny=-nhy;
    nz=-nhz;
    }
    dir1x=nwx;
    dir1y=nwy;
    dir1z=nwz;
    dir1l=bw;
    dir2x=ndx;
    dir2y=ndy;
    dir2z=ndz;
    dir2l=bd;
    break;
    case 3:
    if(right3){
    cbx=pbx+ddx;
    cby=pby+ddy;
    cbz=pbz+ddz;
    nx=ndx;
    ny=ndy;
    nz=ndz;
    }else{
    cbx=pbx-ddx;
    cby=pby-ddy;
    cbz=pbz-ddz;
    nx=-ndx;
    ny=-ndy;
    nz=-ndz;
    }
    dir1x=nwx;
    dir1y=nwy;
    dir1z=nwz;
    dir1l=bw;
    dir2x=nhx;
    dir2y=nhy;
    dir2z=nhz;
    dir2l=bh;
    break;
    }
    dot=nx*ncx+ny*ncy+nz*ncz;
    if(dot<0)len=ch;
    else len=-ch;
    ccx=pcx+len*ncx;
    ccy=pcy+len*ncy;
    ccz=pcz+len*ncz;
    if(dotc>=0.999999){
    tx=-ny;
    ty=nz;
    tz=nx;
    }else{
    tx=nx;
    ty=ny;
    tz=nz;
    }
    len=tx*ncx+ty*ncy+tz*ncz;
    dx=len*ncx-tx;
    dy=len*ncy-ty;
    dz=len*ncz-tz;
    len=Math.sqrt(dx*dx+dy*dy+dz*dz);
    if(len==0)return;
    len=r/len;
    dx*=len;
    dy*=len;
    dz*=len;
    tx=ccx+dx;
    ty=ccy+dy;
    tz=ccz+dz;
    if(dot<-0.96||dot>0.96){
    r00=ncx*ncx*1.5-0.5;
    r01=ncx*ncy*1.5-ncz*0.866025403;
    r02=ncx*ncz*1.5+ncy*0.866025403;
    r10=ncy*ncx*1.5+ncz*0.866025403;
    r11=ncy*ncy*1.5-0.5;
    r12=ncy*ncz*1.5-ncx*0.866025403;
    r20=ncz*ncx*1.5-ncy*0.866025403;
    r21=ncz*ncy*1.5+ncx*0.866025403;
    r22=ncz*ncz*1.5-0.5;
    px=tx;
    py=ty;
    pz=tz;
    pd=nx*(px-cbx)+ny*(py-cby)+nz*(pz-cbz);
    tx=px-pd*nx-cbx;
    ty=py-pd*ny-cby;
    tz=pz-pd*nz-cbz;
    sd=dir1x*tx+dir1y*ty+dir1z*tz;
    ed=dir2x*tx+dir2y*ty+dir2z*tz;
    if(sd<-dir1l)sd=-dir1l;
    else if(sd>dir1l)sd=dir1l;
    if(ed<-dir2l)ed=-dir2l;
    else if(ed>dir2l)ed=dir2l;
    tx=sd*dir1x+ed*dir2x;
    ty=sd*dir1y+ed*dir2y;
    tz=sd*dir1z+ed*dir2z;
    px=cbx+tx;
    py=cby+ty;
    pz=cbz+tz;
    result.addContactInfo(px,py,pz,nx,ny,nz,pd,b,c,1,0,false);
    px=dx*r00+dy*r01+dz*r02;
    py=dx*r10+dy*r11+dz*r12;
    pz=dx*r20+dy*r21+dz*r22;
    px=(dx=px)+ccx;
    py=(dy=py)+ccy;
    pz=(dz=pz)+ccz;
    pd=nx*(px-cbx)+ny*(py-cby)+nz*(pz-cbz);
    if(pd<=0){
    tx=px-pd*nx-cbx;
    ty=py-pd*ny-cby;
    tz=pz-pd*nz-cbz;
    sd=dir1x*tx+dir1y*ty+dir1z*tz;
    ed=dir2x*tx+dir2y*ty+dir2z*tz;
    if(sd<-dir1l)sd=-dir1l;
    else if(sd>dir1l)sd=dir1l;
    if(ed<-dir2l)ed=-dir2l;
    else if(ed>dir2l)ed=dir2l;
    tx=sd*dir1x+ed*dir2x;
    ty=sd*dir1y+ed*dir2y;
    tz=sd*dir1z+ed*dir2z;
    px=cbx+tx;
    py=cby+ty;
    pz=cbz+tz;
    result.addContactInfo(px,py,pz,nx,ny,nz,pd,b,c,2,0,false);
    }
    px=dx*r00+dy*r01+dz*r02;
    py=dx*r10+dy*r11+dz*r12;
    pz=dx*r20+dy*r21+dz*r22;
    px=(dx=px)+ccx;
    py=(dy=py)+ccy;
    pz=(dz=pz)+ccz;
    pd=nx*(px-cbx)+ny*(py-cby)+nz*(pz-cbz);
    if(pd<=0){
    tx=px-pd*nx-cbx;
    ty=py-pd*ny-cby;
    tz=pz-pd*nz-cbz;
    sd=dir1x*tx+dir1y*ty+dir1z*tz;
    ed=dir2x*tx+dir2y*ty+dir2z*tz;
    if(sd<-dir1l)sd=-dir1l;
    else if(sd>dir1l)sd=dir1l;
    if(ed<-dir2l)ed=-dir2l;
    else if(ed>dir2l)ed=dir2l;
    tx=sd*dir1x+ed*dir2x;
    ty=sd*dir1y+ed*dir2y;
    tz=sd*dir1z+ed*dir2z;
    px=cbx+tx;
    py=cby+ty;
    pz=cbz+tz;
    result.addContactInfo(px,py,pz,nx,ny,nz,pd,b,c,3,0,false);
    }
    }else{
    sx=tx;
    sy=ty;
    sz=tz;
    sd=nx*(sx-cbx)+ny*(sy-cby)+nz*(sz-cbz);
    sx-=sd*nx;
    sy-=sd*ny;
    sz-=sd*nz;
    if(dot>0){
    ex=tx+dcx*2;
    ey=ty+dcy*2;
    ez=tz+dcz*2;
    }else{
    ex=tx-dcx*2;
    ey=ty-dcy*2;
    ez=tz-dcz*2;
    }
    ed=nx*(ex-cbx)+ny*(ey-cby)+nz*(ez-cbz);
    ex-=ed*nx;
    ey-=ed*ny;
    ez-=ed*nz;
    d1x=sx-cbx;
    d1y=sy-cby;
    d1z=sz-cbz;
    d2x=ex-cbx;
    d2y=ey-cby;
    d2z=ez-cbz;
    tx=ex-sx;
    ty=ey-sy;
    tz=ez-sz;
    td=ed-sd;
    dotw=d1x*dir1x+d1y*dir1y+d1z*dir1z;
    doth=d2x*dir1x+d2y*dir1y+d2z*dir1z;
    dot1=dotw-dir1l;
    dot2=doth-dir1l;
    if(dot1>0){
    if(dot2>0)return;
    t1=dot1/(dot1-dot2);
    sx=sx+tx*t1;
    sy=sy+ty*t1;
    sz=sz+tz*t1;
    sd=sd+td*t1;
    d1x=sx-cbx;
    d1y=sy-cby;
    d1z=sz-cbz;
    dotw=d1x*dir1x+d1y*dir1y+d1z*dir1z;
    tx=ex-sx;
    ty=ey-sy;
    tz=ez-sz;
    td=ed-sd;
    }else if(dot2>0){
    t1=dot1/(dot1-dot2);
    ex=sx+tx*t1;
    ey=sy+ty*t1;
    ez=sz+tz*t1;
    ed=sd+td*t1;
    d2x=ex-cbx;
    d2y=ey-cby;
    d2z=ez-cbz;
    doth=d2x*dir1x+d2y*dir1y+d2z*dir1z;
    tx=ex-sx;
    ty=ey-sy;
    tz=ez-sz;
    td=ed-sd;
    }
    dot1=dotw+dir1l;
    dot2=doth+dir1l;
    if(dot1<0){
    if(dot2<0)return;
    t1=dot1/(dot1-dot2);
    sx=sx+tx*t1;
    sy=sy+ty*t1;
    sz=sz+tz*t1;
    sd=sd+td*t1;
    d1x=sx-cbx;
    d1y=sy-cby;
    d1z=sz-cbz;
    tx=ex-sx;
    ty=ey-sy;
    tz=ez-sz;
    td=ed-sd;
    }else if(dot2<0){
    t1=dot1/(dot1-dot2);
    ex=sx+tx*t1;
    ey=sy+ty*t1;
    ez=sz+tz*t1;
    ed=sd+td*t1;
    d2x=ex-cbx;
    d2y=ey-cby;
    d2z=ez-cbz;
    tx=ex-sx;
    ty=ey-sy;
    tz=ez-sz;
    td=ed-sd;
    }
    dotw=d1x*dir2x+d1y*dir2y+d1z*dir2z;
    doth=d2x*dir2x+d2y*dir2y+d2z*dir2z;
    dot1=dotw-dir2l;
    dot2=doth-dir2l;
    if(dot1>0){
    if(dot2>0)return;
    t1=dot1/(dot1-dot2);
    sx=sx+tx*t1;
    sy=sy+ty*t1;
    sz=sz+tz*t1;
    sd=sd+td*t1;
    d1x=sx-cbx;
    d1y=sy-cby;
    d1z=sz-cbz;
    dotw=d1x*dir2x+d1y*dir2y+d1z*dir2z;
    tx=ex-sx;
    ty=ey-sy;
    tz=ez-sz;
    td=ed-sd;
    }else if(dot2>0){
    t1=dot1/(dot1-dot2);
    ex=sx+tx*t1;
    ey=sy+ty*t1;
    ez=sz+tz*t1;
    ed=sd+td*t1;
    d2x=ex-cbx;
    d2y=ey-cby;
    d2z=ez-cbz;
    doth=d2x*dir2x+d2y*dir2y+d2z*dir2z;
    tx=ex-sx;
    ty=ey-sy;
    tz=ez-sz;
    td=ed-sd;
    }
    dot1=dotw+dir2l;
    dot2=doth+dir2l;
    if(dot1<0){
    if(dot2<0)return;
    t1=dot1/(dot1-dot2);
    sx=sx+tx*t1;
    sy=sy+ty*t1;
    sz=sz+tz*t1;
    sd=sd+td*t1;
    }else if(dot2<0){
    t1=dot1/(dot1-dot2);
    ex=sx+tx*t1;
    ey=sy+ty*t1;
    ez=sz+tz*t1;
    ed=sd+td*t1;
    }
    if(sd<0){
    result.addContactInfo(sx,sy,sz,nx,ny,nz,sd,b,c,1,0,false);
    }
    if(ed<0){
    result.addContactInfo(ex,ey,ez,nx,ny,nz,ed,b,c,4,0,false);
    }
    }
    }
}
OIMO.CylinderCylinderCollisionDetector = function(){
    OIMO.CollisionDetector.call( this );
}
OIMO.CylinderCylinderCollisionDetector.prototype = Object.create( OIMO.CollisionDetector.prototype );
OIMO.CylinderCylinderCollisionDetector.prototype.getSep = function(c1,c2,sep,pos,dep){
    var t1x;
    var t1y;
    var t1z;
    var t2x;
    var t2y;
    var t2z;
    var sup=new OIMO.Vec3();
    var len;
    var p1x;
    var p1y;
    var p1z;
    var p2x;
    var p2y;
    var p2z;
    var v01x=c1.position.x;
    var v01y=c1.position.y;
    var v01z=c1.position.z;
    var v02x=c2.position.x;
    var v02y=c2.position.y;
    var v02z=c2.position.z;
    var v0x=v02x-v01x;
    var v0y=v02y-v01y;
    var v0z=v02z-v01z;
    if(v0x*v0x+v0y*v0y+v0z*v0z==0)v0y=0.001;
    var nx=-v0x;
    var ny=-v0y;
    var nz=-v0z;
    this.supportPoint(c1,-nx,-ny,-nz,sup);
    var v11x=sup.x;
    var v11y=sup.y;
    var v11z=sup.z;
    this.supportPoint(c2,nx,ny,nz,sup);
    var v12x=sup.x;
    var v12y=sup.y;
    var v12z=sup.z;
    var v1x=v12x-v11x;
    var v1y=v12y-v11y;
    var v1z=v12z-v11z;
    if(v1x*nx+v1y*ny+v1z*nz<=0){
    return false;
    }
    nx=v1y*v0z-v1z*v0y;
    ny=v1z*v0x-v1x*v0z;
    nz=v1x*v0y-v1y*v0x;
    if(nx*nx+ny*ny+nz*nz==0){
    sep.init(v1x-v0x,v1y-v0y,v1z-v0z);
    sep.normalize(sep);
    pos.init((v11x+v12x)*0.5,(v11y+v12y)*0.5,(v11z+v12z)*0.5);
    return true;
    }
    this.supportPoint(c1,-nx,-ny,-nz,sup);
    var v21x=sup.x;
    var v21y=sup.y;
    var v21z=sup.z;
    this.supportPoint(c2,nx,ny,nz,sup);
    var v22x=sup.x;
    var v22y=sup.y;
    var v22z=sup.z;
    var v2x=v22x-v21x;
    var v2y=v22y-v21y;
    var v2z=v22z-v21z;
    if(v2x*nx+v2y*ny+v2z*nz<=0){
    return false;
    }
    t1x=v1x-v0x;
    t1y=v1y-v0y;
    t1z=v1z-v0z;
    t2x=v2x-v0x;
    t2y=v2y-v0y;
    t2z=v2z-v0z;
    nx=t1y*t2z-t1z*t2y;
    ny=t1z*t2x-t1x*t2z;
    nz=t1x*t2y-t1y*t2x;
    if(nx*v0x+ny*v0y+nz*v0z>0){
    t1x=v1x;
    t1y=v1y;
    t1z=v1z;
    v1x=v2x;
    v1y=v2y;
    v1z=v2z;
    v2x=t1x;
    v2y=t1y;
    v2z=t1z;
    t1x=v11x;
    t1y=v11y;
    t1z=v11z;
    v11x=v21x;
    v11y=v21y;
    v11z=v21z;
    v21x=t1x;
    v21y=t1y;
    v21z=t1z;
    t1x=v12x;
    t1y=v12y;
    t1z=v12z;
    v12x=v22x;
    v12y=v22y;
    v12z=v22z;
    v22x=t1x;
    v22y=t1y;
    v22z=t1z;
    nx=-nx;
    ny=-ny;
    nz=-nz;
    }
    var iterations=0;
    while(true){
    if(++iterations>100){
    return false;
    }
    this.supportPoint(c1,-nx,-ny,-nz,sup);
    var v31x=sup.x;
    var v31y=sup.y;
    var v31z=sup.z;
    this.supportPoint(c2,nx,ny,nz,sup);
    var v32x=sup.x;
    var v32y=sup.y;
    var v32z=sup.z;
    var v3x=v32x-v31x;
    var v3y=v32y-v31y;
    var v3z=v32z-v31z;
    if(v3x*nx+v3y*ny+v3z*nz<=0){
    return false;
    }
    if((v1y*v3z-v1z*v3y)*v0x+(v1z*v3x-v1x*v3z)*v0y+(v1x*v3y-v1y*v3x)*v0z<0){
    v2x=v3x;
    v2y=v3y;
    v2z=v3z;
    v21x=v31x;
    v21y=v31y;
    v21z=v31z;
    v22x=v32x;
    v22y=v32y;
    v22z=v32z;
    t1x=v1x-v0x;
    t1y=v1y-v0y;
    t1z=v1z-v0z;
    t2x=v3x-v0x;
    t2y=v3y-v0y;
    t2z=v3z-v0z;
    nx=t1y*t2z-t1z*t2y;
    ny=t1z*t2x-t1x*t2z;
    nz=t1x*t2y-t1y*t2x;
    continue;
    }
    if((v3y*v2z-v3z*v2y)*v0x+(v3z*v2x-v3x*v2z)*v0y+(v3x*v2y-v3y*v2x)*v0z<0){
    v1x=v3x;
    v1y=v3y;
    v1z=v3z;
    v11x=v31x;
    v11y=v31y;
    v11z=v31z;
    v12x=v32x;
    v12y=v32y;
    v12z=v32z;
    t1x=v3x-v0x;
    t1y=v3y-v0y;
    t1z=v3z-v0z;
    t2x=v2x-v0x;
    t2y=v2y-v0y;
    t2z=v2z-v0z;
    nx=t1y*t2z-t1z*t2y;
    ny=t1z*t2x-t1x*t2z;
    nz=t1x*t2y-t1y*t2x;
    continue;
    }
    var hit=false;
    while(true){
    t1x=v2x-v1x;
    t1y=v2y-v1y;
    t1z=v2z-v1z;
    t2x=v3x-v1x;
    t2y=v3y-v1y;
    t2z=v3z-v1z;
    nx=t1y*t2z-t1z*t2y;
    ny=t1z*t2x-t1x*t2z;
    nz=t1x*t2y-t1y*t2x;
    len=1/Math.sqrt(nx*nx+ny*ny+nz*nz);
    nx*=len;
    ny*=len;
    nz*=len;
    if(nx*v1x+ny*v1y+nz*v1z>=0&&!hit){
    var b0=(v1y*v2z-v1z*v2y)*v3x+(v1z*v2x-v1x*v2z)*v3y+(v1x*v2y-v1y*v2x)*v3z;
    var b1=(v3y*v2z-v3z*v2y)*v0x+(v3z*v2x-v3x*v2z)*v0y+(v3x*v2y-v3y*v2x)*v0z;
    var b2=(v0y*v1z-v0z*v1y)*v3x+(v0z*v1x-v0x*v1z)*v3y+(v0x*v1y-v0y*v1x)*v3z;
    var b3=(v2y*v1z-v2z*v1y)*v0x+(v2z*v1x-v2x*v1z)*v0y+(v2x*v1y-v2y*v1x)*v0z;
    var sum=b0+b1+b2+b3;
    if(sum<=0){
    b0=0;
    b1=(v2y*v3z-v2z*v3y)*nx+(v2z*v3x-v2x*v3z)*ny+(v2x*v3y-v2y*v3x)*nz;
    b2=(v3y*v2z-v3z*v2y)*nx+(v3z*v2x-v3x*v2z)*ny+(v3x*v2y-v3y*v2x)*nz;
    b3=(v1y*v2z-v1z*v2y)*nx+(v1z*v2x-v1x*v2z)*ny+(v1x*v2y-v1y*v2x)*nz;
    sum=b1+b2+b3;
    }
    var inv=1/sum;
    p1x=(v01x*b0+v11x*b1+v21x*b2+v31x*b3)*inv;
    p1y=(v01y*b0+v11y*b1+v21y*b2+v31y*b3)*inv;
    p1z=(v01z*b0+v11z*b1+v21z*b2+v31z*b3)*inv;
    p2x=(v02x*b0+v12x*b1+v22x*b2+v32x*b3)*inv;
    p2y=(v02y*b0+v12y*b1+v22y*b2+v32y*b3)*inv;
    p2z=(v02z*b0+v12z*b1+v22z*b2+v32z*b3)*inv;
    hit=true;
    }
    this.supportPoint(c1,-nx,-ny,-nz,sup);
    var v41x=sup.x;
    var v41y=sup.y;
    var v41z=sup.z;
    this.supportPoint(c2,nx,ny,nz,sup);
    var v42x=sup.x;
    var v42y=sup.y;
    var v42z=sup.z;
    var v4x=v42x-v41x;
    var v4y=v42y-v41y;
    var v4z=v42z-v41z;
    var separation=-(v4x*nx+v4y*ny+v4z*nz);
    if((v4x-v3x)*nx+(v4y-v3y)*ny+(v4z-v3z)*nz<=0.01||separation>=0){
    if(hit){
    sep.init(-nx,-ny,-nz);
    pos.init((p1x+p2x)*0.5,(p1y+p2y)*0.5,(p1z+p2z)*0.5);
    dep.x=separation;
    return true;
    }
    return false;
    }
    if(
    (v4y*v1z-v4z*v1y)*v0x+
    (v4z*v1x-v4x*v1z)*v0y+
    (v4x*v1y-v4y*v1x)*v0z<0
    ){
    if(
    (v4y*v2z-v4z*v2y)*v0x+
    (v4z*v2x-v4x*v2z)*v0y+
    (v4x*v2y-v4y*v2x)*v0z<0
    ){
    v1x=v4x;
    v1y=v4y;
    v1z=v4z;
    v11x=v41x;
    v11y=v41y;
    v11z=v41z;
    v12x=v42x;
    v12y=v42y;
    v12z=v42z;
    }else{
    v3x=v4x;
    v3y=v4y;
    v3z=v4z;
    v31x=v41x;
    v31y=v41y;
    v31z=v41z;
    v32x=v42x;
    v32y=v42y;
    v32z=v42z;
    }
    }else{
    if(
    (v4y*v3z-v4z*v3y)*v0x+
    (v4z*v3x-v4x*v3z)*v0y+
    (v4x*v3y-v4y*v3x)*v0z<0
    ){
    v2x=v4x;
    v2y=v4y;
    v2z=v4z;
    v21x=v41x;
    v21y=v41y;
    v21z=v41z;
    v22x=v42x;
    v22y=v42y;
    v22z=v42z;
    }else{
    v1x=v4x;
    v1y=v4y;
    v1z=v4z;
    v11x=v41x;
    v11y=v41y;
    v11z=v41z;
    v12x=v42x;
    v12y=v42y;
    v12z=v42z;
    }
    }
    }
    }
    //return false;
}
OIMO.CylinderCylinderCollisionDetector.prototype.supportPoint = function(c,dx,dy,dz,out){
    var rot=c.rotation.elements;
    var ldx=rot[0]*dx+rot[3]*dy+rot[6]*dz;
    var ldy=rot[1]*dx+rot[4]*dy+rot[7]*dz;
    var ldz=rot[2]*dx+rot[5]*dy+rot[8]*dz;
    var radx=ldx;
    var radz=ldz;
    var len=radx*radx+radz*radz;
    var rad=c.radius;
    var hh=c.halfHeight;
    var ox;
    var oy;
    var oz;
    if(len==0){
    if(ldy<0){
    ox=rad;
    oy=-hh;
    oz=0;
    }else{
    ox=rad;
    oy=hh;
    oz=0;
    }
    }else{
    len=c.radius/Math.sqrt(len);
    if(ldy<0){
    ox=radx*len;
    oy=-hh;
    oz=radz*len;
    }else{
    ox=radx*len;
    oy=hh;
    oz=radz*len;
    }
    }
    ldx=rot[0]*ox+rot[1]*oy+rot[2]*oz+c.position.x;
    ldy=rot[3]*ox+rot[4]*oy+rot[5]*oz+c.position.y;
    ldz=rot[6]*ox+rot[7]*oy+rot[8]*oz+c.position.z;
    out.init(ldx,ldy,ldz);
}
OIMO.CylinderCylinderCollisionDetector.prototype.detectCollision = function(shape1,shape2,result){
    var c1;
    var c2;
    if(shape1.id<shape2.id){
        c1=shape1;
        c2=shape2;
    }else{
        c1=shape2;
        c2=shape1;
    }
    var p1=c1.position;
    var p2=c2.position;
    var p1x=p1.x;
    var p1y=p1.y;
    var p1z=p1.z;
    var p2x=p2.x;
    var p2y=p2.y;
    var p2z=p2.z;
    var h1=c1.halfHeight;
    var h2=c2.halfHeight;
    var n1=c1.normalDirection;
    var n2=c2.normalDirection;
    var d1=c1.halfDirection;
    var d2=c2.halfDirection;
    var r1=c1.radius;
    var r2=c2.radius;
    var n1x=n1.x;
    var n1y=n1.y;
    var n1z=n1.z;
    var n2x=n2.x;
    var n2y=n2.y;
    var n2z=n2.z;
    var d1x=d1.x;
    var d1y=d1.y;
    var d1z=d1.z;
    var d2x=d2.x;
    var d2y=d2.y;
    var d2z=d2.z;
    var dx=p1x-p2x;
    var dy=p1y-p2y;
    var dz=p1z-p2z;
    var len;
    var len1;
    var len2;
    var c;
    var c1x;
    var c1y;
    var c1z;
    var c2x;
    var c2y;
    var c2z;
    var tx;
    var ty;
    var tz;
    var sx;
    var sy;
    var sz;
    var ex;
    var ey;
    var ez;
    var depth1;
    var depth2;
    var dot;
    var t1;
    var t2;
    var sep=new OIMO.Vec3();
    var pos=new OIMO.Vec3();
    var dep=new OIMO.Vec3();
    if(!this.getSep(c1,c2,sep,pos,dep))return;
    var dot1=sep.x*n1x+sep.y*n1y+sep.z*n1z;
    var dot2=sep.x*n2x+sep.y*n2y+sep.z*n2z;
    var right1=dot1>0;
    var right2=dot2>0;
    if(!right1)dot1=-dot1;
    if(!right2)dot2=-dot2;
    var state=0;
    if(dot1>0.999||dot2>0.999){
    if(dot1>dot2)state=1;
    else state=2;
    }
    var nx;
    var ny;
    var nz;
    var depth=dep.x;
    var r00;
    var r01;
    var r02;
    var r10;
    var r11;
    var r12;
    var r20;
    var r21;
    var r22;
    var px;
    var py;
    var pz;
    var pd;
    var a;
    var b;
    var e;
    var f;
    nx=sep.x;
    ny=sep.y;
    nz=sep.z;
    switch(state){
    case 0:
    result.addContactInfo(pos.x,pos.y,pos.z,nx,ny,nz,depth,c1,c2,0,0,false);
    break;
    case 1:
    if(right1){
    c1x=p1x+d1x;
    c1y=p1y+d1y;
    c1z=p1z+d1z;
    nx=n1x;
    ny=n1y;
    nz=n1z;
    }else{
    c1x=p1x-d1x;
    c1y=p1y-d1y;
    c1z=p1z-d1z;
    nx=-n1x;
    ny=-n1y;
    nz=-n1z;
    }
    dot=nx*n2x+ny*n2y+nz*n2z;
    if(dot<0)len=h2;
    else len=-h2;
    c2x=p2x+len*n2x;
    c2y=p2y+len*n2y;
    c2z=p2z+len*n2z;
    if(dot2>=0.999999){
    tx=-ny;
    ty=nz;
    tz=nx;
    }else{
    tx=nx;
    ty=ny;
    tz=nz;
    }
    len=tx*n2x+ty*n2y+tz*n2z;
    dx=len*n2x-tx;
    dy=len*n2y-ty;
    dz=len*n2z-tz;
    len=Math.sqrt(dx*dx+dy*dy+dz*dz);
    if(len==0)break;
    len=r2/len;
    dx*=len;
    dy*=len;
    dz*=len;
    tx=c2x+dx;
    ty=c2y+dy;
    tz=c2z+dz;
    if(dot<-0.96||dot>0.96){
    r00=n2x*n2x*1.5-0.5;
    r01=n2x*n2y*1.5-n2z*0.866025403;
    r02=n2x*n2z*1.5+n2y*0.866025403;
    r10=n2y*n2x*1.5+n2z*0.866025403;
    r11=n2y*n2y*1.5-0.5;
    r12=n2y*n2z*1.5-n2x*0.866025403;
    r20=n2z*n2x*1.5-n2y*0.866025403;
    r21=n2z*n2y*1.5+n2x*0.866025403;
    r22=n2z*n2z*1.5-0.5;
    px=tx;
    py=ty;
    pz=tz;
    pd=nx*(px-c1x)+ny*(py-c1y)+nz*(pz-c1z);
    tx=px-pd*nx-c1x;
    ty=py-pd*ny-c1y;
    tz=pz-pd*nz-c1z;
    len=tx*tx+ty*ty+tz*tz;
    if(len>r1*r1){
    len=r1/Math.sqrt(len);
    tx*=len;
    ty*=len;
    tz*=len;
    }
    px=c1x+tx;
    py=c1y+ty;
    pz=c1z+tz;
    result.addContactInfo(px,py,pz,nx,ny,nz,pd,c1,c2,1,0,false);
    px=dx*r00+dy*r01+dz*r02;
    py=dx*r10+dy*r11+dz*r12;
    pz=dx*r20+dy*r21+dz*r22;
    px=(dx=px)+c2x;
    py=(dy=py)+c2y;
    pz=(dz=pz)+c2z;
    pd=nx*(px-c1x)+ny*(py-c1y)+nz*(pz-c1z);
    if(pd<=0){
    tx=px-pd*nx-c1x;
    ty=py-pd*ny-c1y;
    tz=pz-pd*nz-c1z;
    len=tx*tx+ty*ty+tz*tz;
    if(len>r1*r1){
    len=r1/Math.sqrt(len);
    tx*=len;
    ty*=len;
    tz*=len;
    }
    px=c1x+tx;
    py=c1y+ty;
    pz=c1z+tz;
    result.addContactInfo(px,py,pz,nx,ny,nz,pd,c1,c2,2,0,false);
    }
    px=dx*r00+dy*r01+dz*r02;
    py=dx*r10+dy*r11+dz*r12;
    pz=dx*r20+dy*r21+dz*r22;
    px=(dx=px)+c2x;
    py=(dy=py)+c2y;
    pz=(dz=pz)+c2z;
    pd=nx*(px-c1x)+ny*(py-c1y)+nz*(pz-c1z);
    if(pd<=0){
    tx=px-pd*nx-c1x;
    ty=py-pd*ny-c1y;
    tz=pz-pd*nz-c1z;
    len=tx*tx+ty*ty+tz*tz;
    if(len>r1*r1){
    len=r1/Math.sqrt(len);
    tx*=len;
    ty*=len;
    tz*=len;
    }
    px=c1x+tx;
    py=c1y+ty;
    pz=c1z+tz;
    result.addContactInfo(px,py,pz,nx,ny,nz,pd,c1,c2,3,0,false);
    }
    }else{
    sx=tx;
    sy=ty;
    sz=tz;
    depth1=nx*(sx-c1x)+ny*(sy-c1y)+nz*(sz-c1z);
    sx-=depth1*nx;
    sy-=depth1*ny;
    sz-=depth1*nz;
    if(dot>0){
    ex=tx+n2x*h2*2;
    ey=ty+n2y*h2*2;
    ez=tz+n2z*h2*2;
    }else{
    ex=tx-n2x*h2*2;
    ey=ty-n2y*h2*2;
    ez=tz-n2z*h2*2;
    }
    depth2=nx*(ex-c1x)+ny*(ey-c1y)+nz*(ez-c1z);
    ex-=depth2*nx;
    ey-=depth2*ny;
    ez-=depth2*nz;
    dx=c1x-sx;
    dy=c1y-sy;
    dz=c1z-sz;
    tx=ex-sx;
    ty=ey-sy;
    tz=ez-sz;
    a=dx*dx+dy*dy+dz*dz;
    b=dx*tx+dy*ty+dz*tz;
    e=tx*tx+ty*ty+tz*tz;
    f=b*b-e*(a-r1*r1);
    if(f<0)break;
    f=Math.sqrt(f);
    t1=(b+f)/e;
    t2=(b-f)/e;
    if(t2<t1){
    len=t1;
    t1=t2;
    t2=len;
    }
    if(t2>1)t2=1;
    if(t1<0)t1=0;
    tx=sx+(ex-sx)*t1;
    ty=sy+(ey-sy)*t1;
    tz=sz+(ez-sz)*t1;
    ex=sx+(ex-sx)*t2;
    ey=sy+(ey-sy)*t2;
    ez=sz+(ez-sz)*t2;
    sx=tx;
    sy=ty;
    sz=tz;
    len=depth1+(depth2-depth1)*t1;
    depth2=depth1+(depth2-depth1)*t2;
    depth1=len;
    if(depth1<0){
    result.addContactInfo(sx,sy,sz,nx,ny,nz,pd,c1,c2,1,0,false);
    }
    if(depth2<0){
    result.addContactInfo(ex,ey,ez,nx,ny,nz,pd,c1,c2,4,0,false);
    }
    }
    break;
    case 2:
    if(right2){
    c2x=p2x-d2x;
    c2y=p2y-d2y;
    c2z=p2z-d2z;
    nx=-n2x;
    ny=-n2y;
    nz=-n2z;
    }else{
    c2x=p2x+d2x;
    c2y=p2y+d2y;
    c2z=p2z+d2z;
    nx=n2x;
    ny=n2y;
    nz=n2z;
    }
    dot=nx*n1x+ny*n1y+nz*n1z;
    if(dot<0)len=h1;
    else len=-h1;
    c1x=p1x+len*n1x;
    c1y=p1y+len*n1y;
    c1z=p1z+len*n1z;
    if(dot1>=0.999999){
    tx=-ny;
    ty=nz;
    tz=nx;
    }else{
    tx=nx;
    ty=ny;
    tz=nz;
    }
    len=tx*n1x+ty*n1y+tz*n1z;
    dx=len*n1x-tx;
    dy=len*n1y-ty;
    dz=len*n1z-tz;
    len=Math.sqrt(dx*dx+dy*dy+dz*dz);
    if(len==0)break;
    len=r1/len;
    dx*=len;
    dy*=len;
    dz*=len;
    tx=c1x+dx;
    ty=c1y+dy;
    tz=c1z+dz;
    if(dot<-0.96||dot>0.96){
    r00=n1x*n1x*1.5-0.5;
    r01=n1x*n1y*1.5-n1z*0.866025403;
    r02=n1x*n1z*1.5+n1y*0.866025403;
    r10=n1y*n1x*1.5+n1z*0.866025403;
    r11=n1y*n1y*1.5-0.5;
    r12=n1y*n1z*1.5-n1x*0.866025403;
    r20=n1z*n1x*1.5-n1y*0.866025403;
    r21=n1z*n1y*1.5+n1x*0.866025403;
    r22=n1z*n1z*1.5-0.5;
    px=tx;
    py=ty;
    pz=tz;
    pd=nx*(px-c2x)+ny*(py-c2y)+nz*(pz-c2z);
    tx=px-pd*nx-c2x;
    ty=py-pd*ny-c2y;
    tz=pz-pd*nz-c2z;
    len=tx*tx+ty*ty+tz*tz;
    if(len>r2*r2){
    len=r2/Math.sqrt(len);
    tx*=len;
    ty*=len;
    tz*=len;
    }
    px=c2x+tx;
    py=c2y+ty;
    pz=c2z+tz;
    result.addContactInfo(px,py,pz,-nx,-ny,-nz,pd,c1,c2,1,0,false);
    px=dx*r00+dy*r01+dz*r02;
    py=dx*r10+dy*r11+dz*r12;
    pz=dx*r20+dy*r21+dz*r22;
    px=(dx=px)+c1x;
    py=(dy=py)+c1y;
    pz=(dz=pz)+c1z;
    pd=nx*(px-c2x)+ny*(py-c2y)+nz*(pz-c2z);
    if(pd<=0){
    tx=px-pd*nx-c2x;
    ty=py-pd*ny-c2y;
    tz=pz-pd*nz-c2z;
    len=tx*tx+ty*ty+tz*tz;
    if(len>r2*r2){
    len=r2/Math.sqrt(len);
    tx*=len;
    ty*=len;
    tz*=len;
    }
    px=c2x+tx;
    py=c2y+ty;
    pz=c2z+tz;
    result.addContactInfo(px,py,pz,-nx,-ny,-nz,pd,c1,c2,2,0,false);
    }
    px=dx*r00+dy*r01+dz*r02;
    py=dx*r10+dy*r11+dz*r12;
    pz=dx*r20+dy*r21+dz*r22;
    px=(dx=px)+c1x;
    py=(dy=py)+c1y;
    pz=(dz=pz)+c1z;
    pd=nx*(px-c2x)+ny*(py-c2y)+nz*(pz-c2z);
    if(pd<=0){
    tx=px-pd*nx-c2x;
    ty=py-pd*ny-c2y;
    tz=pz-pd*nz-c2z;
    len=tx*tx+ty*ty+tz*tz;
    if(len>r2*r2){
    len=r2/Math.sqrt(len);
    tx*=len;
    ty*=len;
    tz*=len;
    }
    px=c2x+tx;
    py=c2y+ty;
    pz=c2z+tz;
    result.addContactInfo(px,py,pz,-nx,-ny,-nz,pd,c1,c2,3,0,false);
    }
    }else{
    sx=tx;
    sy=ty;
    sz=tz;
    depth1=nx*(sx-c2x)+ny*(sy-c2y)+nz*(sz-c2z);
    sx-=depth1*nx;
    sy-=depth1*ny;
    sz-=depth1*nz;
    if(dot>0){
    ex=tx+n1x*h1*2;
    ey=ty+n1y*h1*2;
    ez=tz+n1z*h1*2;
    }else{
    ex=tx-n1x*h1*2;
    ey=ty-n1y*h1*2;
    ez=tz-n1z*h1*2;
    }
    depth2=nx*(ex-c2x)+ny*(ey-c2y)+nz*(ez-c2z);
    ex-=depth2*nx;
    ey-=depth2*ny;
    ez-=depth2*nz;
    dx=c2x-sx;
    dy=c2y-sy;
    dz=c2z-sz;
    tx=ex-sx;
    ty=ey-sy;
    tz=ez-sz;
    a=dx*dx+dy*dy+dz*dz;
    b=dx*tx+dy*ty+dz*tz;
    e=tx*tx+ty*ty+tz*tz;
    f=b*b-e*(a-r2*r2);
    if(f<0)break;
    f=Math.sqrt(f);
    t1=(b+f)/e;
    t2=(b-f)/e;
    if(t2<t1){
    len=t1;
    t1=t2;
    t2=len;
    }
    if(t2>1)t2=1;
    if(t1<0)t1=0;
    tx=sx+(ex-sx)*t1;
    ty=sy+(ey-sy)*t1;
    tz=sz+(ez-sz)*t1;
    ex=sx+(ex-sx)*t2;
    ey=sy+(ey-sy)*t2;
    ez=sz+(ez-sz)*t2;
    sx=tx;
    sy=ty;
    sz=tz;
    len=depth1+(depth2-depth1)*t1;
    depth2=depth1+(depth2-depth1)*t2;
    depth1=len;
    if(depth1<0){
    result.addContactInfo(sx,sy,sz,-nx,-ny,-nz,depth1,c1,c2,1,0,false);
    }
    if(depth2<0){
    result.addContactInfo(ex,ey,ez,-nx,-ny,-nz,depth2,c1,c2,4,0,false);
    }
    }
    break;
    }
}
OIMO.SphereBoxCollisionDetector = function(flip){
    OIMO.CollisionDetector.call( this );
    this.flip=flip;
}
OIMO.SphereBoxCollisionDetector.prototype = Object.create( OIMO.CollisionDetector.prototype );
OIMO.SphereBoxCollisionDetector.prototype.detectCollision = function(shape1,shape2,result){
    var s;
    var b;
    if(this.flip){
    s=shape2;
    b=shape1;
    }else{
    s=shape1;
    b=shape2;
    }
    var ps=s.position;
    var psx=ps.x;
    var psy=ps.y;
    var psz=ps.z;
    var pb=b.position;
    var pbx=pb.x;
    var pby=pb.y;
    var pbz=pb.z;
    var rad=s.radius;
    var nw=b.normalDirectionWidth;
    var nh=b.normalDirectionHeight;
    var nd=b.normalDirectionDepth;
    var hw=b.halfWidth;
    var hh=b.halfHeight;
    var hd=b.halfDepth;
    var dx=psx-pbx;
    var dy=psy-pby;
    var dz=psz-pbz;
    var sx=nw.x*dx+nw.y*dy+nw.z*dz;
    var sy=nh.x*dx+nh.y*dy+nh.z*dz;
    var sz=nd.x*dx+nd.y*dy+nd.z*dz;
    var cx;
    var cy;
    var cz;
    var len;
    var invLen;
    var c;
    var overlap=0;
    if(sx>hw){
    sx=hw;
    }else if(sx<-hw){
    sx=-hw;
    }else{
    overlap=1;
    }
    if(sy>hh){
    sy=hh;
    }else if(sy<-hh){
    sy=-hh;
    }else{
    overlap|=2;
    }
    if(sz>hd){
    sz=hd;
    }else if(sz<-hd){
    sz=-hd;
    }else{
    overlap|=4;
    }
    if(overlap==7){
    if(sx<0){
    dx=hw+sx;
    }else{
    dx=hw-sx;
    }
    if(sy<0){
    dy=hh+sy;
    }else{
    dy=hh-sy;
    }
    if(sz<0){
    dz=hd+sz;
    }else{
    dz=hd-sz;
    }
    if(dx<dy){
    if(dx<dz){
    len=dx-hw;
    if(sx<0){
    sx=-hw;
    dx=nw.x;
    dy=nw.y;
    dz=nw.z;
    }else{
    sx=hw;
    dx=-nw.x;
    dy=-nw.y;
    dz=-nw.z;
    }
    }else{
    len=dz-hd;
    if(sz<0){
    sz=-hd;
    dx=nd.x;
    dy=nd.y;
    dz=nd.z;
    }else{
    sz=hd;
    dx=-nd.x;
    dy=-nd.y;
    dz=-nd.z;
    }
    }
    }else{
    if(dy<dz){
    len=dy-hh;
    if(sy<0){
    sy=-hh;
    dx=nh.x;
    dy=nh.y;
    dz=nh.z;
    }else{
    sy=hh;
    dx=-nh.x;
    dy=-nh.y;
    dz=-nh.z;
    }
    }else{
    len=dz-hd;
    if(sz<0){
    sz=-hd;
    dx=nd.x;
    dy=nd.y;
    dz=nd.z;
    }else{
    sz=hd;
    dx=-nd.x;
    dy=-nd.y;
    dz=-nd.z;
    }
    }
    }
    cx=pbx+sx*nw.x+sy*nh.x+sz*nd.x;
    cy=pby+sx*nw.y+sy*nh.y+sz*nd.y;
    cz=pbz+sx*nw.z+sy*nh.z+sz*nd.z;
    result.addContactInfo(psx+rad*dx,psy+rad*dy,psz+rad*dz,dx,dy,dz,len,s,b,0,0,false);
    }else{
    cx=pbx+sx*nw.x+sy*nh.x+sz*nd.x;
    cy=pby+sx*nw.y+sy*nh.y+sz*nd.y;
    cz=pbz+sx*nw.z+sy*nh.z+sz*nd.z;
    dx=cx-ps.x;
    dy=cy-ps.y;
    dz=cz-ps.z;
    len=dx*dx+dy*dy+dz*dz;
    if(len>0&&len<rad*rad){
    len=Math.sqrt(len);
    invLen=1/len;
    dx*=invLen;
    dy*=invLen;
    dz*=invLen;
    result.addContactInfo(psx+rad*dx,psy+rad*dy,psz+rad*dz,dx,dy,dz,len,s,b,0,0,false);
    }
    }

}
OIMO.SphereCylinderCollisionDetector = function(flip){
    OIMO.CollisionDetector.call( this );
    this.flip=flip;
}
OIMO.SphereCylinderCollisionDetector.prototype = Object.create( OIMO.CollisionDetector.prototype );
OIMO.SphereCylinderCollisionDetector.prototype.detectCollision = function(shape1,shape2,result){
    var s;
    var c;
    if(this.flip){
    s=shape2;
    c=shape1;
    }else{
    s=shape1;
    c=shape2;
    }
    var ps=s.position;
    var psx=ps.x;
    var psy=ps.y;
    var psz=ps.z;
    var pc=c.position;
    var pcx=pc.x;
    var pcy=pc.y;
    var pcz=pc.z;
    var dirx=c.normalDirection.x;
    var diry=c.normalDirection.y;
    var dirz=c.normalDirection.z;
    var rads=s.radius;
    var radc=c.radius;
    var rad2=rads+radc;
    var halfh=c.halfHeight;
    var dx=psx-pcx;
    var dy=psy-pcy;
    var dz=psz-pcz;
    var dot=dx*dirx+dy*diry+dz*dirz;
    if(dot<-halfh-rads||dot>halfh+rads)return;
    var cx=pcx+dot*dirx;
    var cy=pcy+dot*diry;
    var cz=pcz+dot*dirz;
    var d2x=psx-cx;
    var d2y=psy-cy;
    var d2z=psz-cz;
    var len=d2x*d2x+d2y*d2y+d2z*d2z;
    if(len>rad2*rad2)return;
    if(len>radc*radc){
    len=radc/Math.sqrt(len);
    d2x*=len;
    d2y*=len;
    d2z*=len;
    }
    if(dot<-halfh)dot=-halfh;
    else if(dot>halfh)dot=halfh;
    cx=pcx+dot*dirx+d2x;
    cy=pcy+dot*diry+d2y;
    cz=pcz+dot*dirz+d2z;
    dx=cx-psx;
    dy=cy-psy;
    dz=cz-psz;
    len=dx*dx+dy*dy+dz*dz;
    var invLen;
    if(len>0&&len<rads*rads){
    len=Math.sqrt(len);
    invLen=1/len;
    dx*=invLen;
    dy*=invLen;
    dz*=invLen;
    result.addContactInfo(psx+dx*rads,psy+dy*rads,psz+dz*rads,dx,dy,dz,len-rads,s,c,0,0,false);
    }
}
OIMO.SphereSphereCollisionDetector = function(){
    OIMO.CollisionDetector.call( this );
}
OIMO.SphereSphereCollisionDetector.prototype = Object.create( OIMO.CollisionDetector.prototype );
OIMO.SphereSphereCollisionDetector.prototype.detectCollision = function(shape1,shape2,result){
    var s1=shape1;
    var s2=shape2;
    var p1=s1.position;
    var p2=s2.position;
    var dx=p2.x-p1.x;
    var dy=p2.y-p1.y;
    var dz=p2.z-p1.z;
    var len=dx*dx+dy*dy+dz*dz;
    var r1=s1.radius;
    var r2=s2.radius;
    var rad=r1+r2;
    if(len>0&&len<rad*rad){
    len=Math.sqrt(len);
    var invLen=1/len;
    dx*=invLen;
    dy*=invLen;
    dz*=invLen;
    result.addContactInfo(p1.x+dx*r1,p1.y+dy*r1,p1.z+dz*r1,dx,dy,dz,len-rad,s1,s2,0,0,false);
    }
}
OIMO.Pair = function(){
  this.shape1=null;
  this.shape2=null;
}
OIMO.Proxy = function(minX,maxX,minY,maxY,minZ,maxZ){
    this.minX=minX || 0;
    this.maxX=maxX || 0;
    this.minY=minY || 0;
    this.maxY=maxY || 0;
    this.minZ=minZ || 0;
    this.maxZ=maxZ || 0;
    this.parent=null;
};
OIMO.Proxy.prototype = {
    constructor: OIMO.Proxy,

    init:function(minX,maxX,minY,maxY,minZ,maxZ){
        this.minX=minX || 0;
        this.maxX=maxX || 0;
        this.minY=minY || 0;
        this.maxY=maxY || 0;
        this.minZ=minZ || 0;
        this.maxZ=maxZ || 0;
    },
    intersect:function(proxy){
        return this.maxX>proxy.minX&&this.minX<proxy.maxX&&this.maxY>proxy.minY&&this.minY<proxy.maxY&&this.maxZ>proxy.minZ&&this.minZ<proxy.maxZ;
    }
}
OIMO.BroadPhase = function(){
    this.types = 0x0;
    this.numPairChecks=0;
    this.numPairs=0;
    
    this.bufferSize=256;
    this.pairs=[];// vector bufferSize
    this.pairs.length = this.bufferSize;
    for(var i=0;i<this.bufferSize;i++){
        this.pairs[i]=new OIMO.Pair();
    }
}
OIMO.BroadPhase.prototype = {
    constructor: OIMO.BroadPhase,

    createProxy:function(shape){
        throw new Error("Inheritance error.");
    },
    addProxy:function(proxy){
        throw new Error("Inheritance error.");
    },
    removeProxy:function(proxy){
        throw new Error("Inheritance error.");
    },
    isAvailablePair:function(s1,s2){
        var b1=s1.parent;
        var b2=s2.parent;
        if(
        b1==b2||
        (b1.type==OIMO.BODY_STATIC||b1.sleeping)&&
        (b2.type==OIMO.BODY_STATIC||b2.sleeping)
        ){
        return false;
        }
        var jc;
        if(b1.numJoints<b2.numJoints)jc=b1.jointList;
        else jc=b2.jointList;
        while(jc!=null){
        var joint=jc.parent;
        if(
        !joint.allowCollision&&
        (joint.body1==b1&&joint.body2==b2||
        joint.body1==b2&&joint.body2==b1)
        ){
        return false;
        }
        jc=jc.next;
        }
        return true;
    },
    detectPairs:function(){
        while(this.numPairs>0){
            var pair=this.pairs[--this.numPairs];
            pair.shape1=null;
            pair.shape2=null;
        }
        this.collectPairs();
    },
    collectPairs:function(){
        throw new Error("Inheritance error.");
    },
    addPair:function(s1,s2){
        if(this.numPairs==this.bufferSize){
        var newBufferSize=this.bufferSize<<1;
        var newPairs=[];
        for(var i=0;i<this.bufferSize;i++){
        newPairs[i]=this.pairs[i];
        }
        for(i=this.bufferSize;i<newBufferSize;i++){
        newPairs[i]=new OIMO.Pair();
        }
        this.pairs=newPairs;
        this.bufferSize=newBufferSize;
        }
        var pair=this.pairs[this.numPairs++];
        pair.shape1=s1;
        pair.shape2=s2;
    }
}
OIMO.BruteForceBroadPhase = function(){
    OIMO.BroadPhase.call( this);
    this.types = 0x1;

    this.numProxies=0;
    this.proxyPool = [];// Vector
    this.proxyPool.length = OIMO.WORLD_MAX_SHAPES;
}
OIMO.BruteForceBroadPhase.prototype = Object.create( OIMO.BroadPhase.prototype );
OIMO.BruteForceBroadPhase.prototype.addProxy = function (proxy) {
    this.proxyPool[this.numProxies]=proxy;
    this.numProxies++;
}
OIMO.BruteForceBroadPhase.prototype.removeProxy = function (proxy) {
    var idx=-1;
    for(var i=0;i<this.numProxies;i++){
        if(this.proxyPool[i]==proxy){
        idx=i;
        break;
        }
    }
    if(idx==-1){
    return;
    }
    for(var j=idx;j<this.numProxies-1;j++){
    this.proxyPool[j]=this.proxyPool[j+1];
    }
    this.proxyPool[this.numProxies]=null;
    this.numProxies--;
}
OIMO.BruteForceBroadPhase.prototype.collectPairs = function () {
    this.numPairChecks=this.numProxies*(this.numProxies-1)>>1;
    for(var i=0;i<this.numProxies;i++){
    var p1=this.proxyPool[i];
    var s1=p1.parent;
    for(var j=i+1;j<this.numProxies;j++){
        var p2=this.proxyPool[j];
        var s2=p2.parent;
        if(
        p1.maxX<p2.minX||p1.minX>p2.maxX||
        p1.maxY<p2.minY||p1.minY>p2.maxY||
        p1.maxZ<p2.minZ||p1.minZ>p2.maxZ||
        !this.isAvailablePair(s1,s2)
        ){
        continue;
        }
        this.addPair(s1,s2);
        }
    }
}
OIMO.SweepAndPruneBroadPhase = function(){
    OIMO.BroadPhase.call( this);
    this.types = 0x2;

    this.numProxies=0;
    this.sortAxis=0;
    this.proxyPoolAxis=[];
    this.proxyPoolAxis.length = 3;
    this.proxyPoolAxis[0]=[];
    this.proxyPoolAxis[1]=[];
    this.proxyPoolAxis[2]=[];
    this.proxyPoolAxis[0].length = OIMO.WORLD_MAX_SHAPES;
    this.proxyPoolAxis[1].length = OIMO.WORLD_MAX_SHAPES;
    this.proxyPoolAxis[2].length = OIMO.WORLD_MAX_SHAPES;
}
OIMO.SweepAndPruneBroadPhase.prototype = Object.create( OIMO.BroadPhase.prototype );
OIMO.SweepAndPruneBroadPhase.prototype.addProxy = function (proxy) {
    this.proxyPoolAxis[0][this.numProxies]=proxy;
    this.proxyPoolAxis[1][this.numProxies]=proxy;
    this.proxyPoolAxis[2][this.numProxies]=proxy;
    this.numProxies++;
}
OIMO.SweepAndPruneBroadPhase.prototype.removeProxy = function (proxy) {
    this.removeProxyAxis(proxy,this.proxyPoolAxis[0]);
    this.removeProxyAxis(proxy,this.proxyPoolAxis[1]);
    this.removeProxyAxis(proxy,this.proxyPoolAxis[2]);
    this.numProxies--;
}
OIMO.SweepAndPruneBroadPhase.prototype.collectPairs = function () {
    this.numPairChecks=0;
    var proxyPool=this.proxyPoolAxis[this.sortAxis];
    var result;
    if(this.sortAxis==0){
    this.insertionSortX(proxyPool);
    this.sweepX(proxyPool);
    }else if(this.sortAxis==1){
    this.insertionSortY(proxyPool);
    this.sweepY(proxyPool);
    }else{
    this.insertionSortZ(proxyPool);
    this.sweepZ(proxyPool);
    }
}
OIMO.SweepAndPruneBroadPhase.prototype.sweepX = function (proxyPool) {
    var center;
    var sumX=0;
    var sumX2=0;
    var sumY=0;
    var sumY2=0;
    var sumZ=0;
    var sumZ2=0;
    var invNum=1/this.numProxies;
    var bodyStatic=OIMO.BODY_STATIC;
    for(var i=0, l=this.numProxies;i<l;i++){
        var p1=proxyPool[i];
        center=p1.minX+p1.maxX;
        sumX+=center;
        sumX2+=center*center;
        center=p1.minY+p1.maxY;
        sumY+=center;
        sumY2+=center*center;
        center=p1.minZ+p1.maxZ;
        sumZ+=center;
        sumZ2+=center*center;
        var s1=p1.parent;
        for(var j=i+1;j<l;j++){
            var p2=proxyPool[j];
            this.numPairChecks++;
            if(p1.maxX<p2.minX){
                break;
            }
            var s2=p2.parent;
            if( p1.maxY<p2.minY||p1.minY>p2.maxY||p1.maxZ<p2.minZ||p1.minZ>p2.maxZ||!this.isAvailablePair(s1,s2) ){
                continue;
            }
            this.addPair(s1,s2);
        }
    }
    sumX=sumX2-sumX*sumX*invNum;
    sumY=sumY2-sumY*sumY*invNum;
    sumZ=sumZ2-sumZ*sumZ*invNum;
    if(sumX>sumY){
        if(sumX>sumZ){
            this.sortAxis=0;
        }else{
            this.sortAxis=2;
        }
    }else if(sumY>sumZ){
        this.sortAxis=1;
    }else{
        this.sortAxis=2;
    }
}
OIMO.SweepAndPruneBroadPhase.prototype.sweepY = function (proxyPool) {
    var center;
    var sumX=0;
    var sumX2=0;
    var sumY=0;
    var sumY2=0;
    var sumZ=0;
    var sumZ2=0;
    var invNum=1/this.numProxies;
    var bodyStatic=OIMO.BODY_STATIC;
    for(var i=0, l=this.numProxies;i<l;i++){
        var p1=proxyPool[i];
        center=p1.minX+p1.maxX;
        sumX+=center;
        sumX2+=center*center;
        center=p1.minY+p1.maxY;
        sumY+=center;
        sumY2+=center*center;
        center=p1.minZ+p1.maxZ;
        sumZ+=center;
        sumZ2+=center*center;
        var s1=p1.parent;
        for(var j=i+1;j<l;j++){
            var p2=proxyPool[j];
            this.numPairChecks++;
            if(p1.maxY<p2.minY){
                break;
            }
            var s2=p2.parent;
            if( p1.maxX<p2.minX||p1.minX>p2.maxX||p1.maxZ<p2.minZ||p1.minZ>p2.maxZ||!this.isAvailablePair(s1,s2)){
                continue;
            }
            this.addPair(s1,s2);
        }
    }
    sumX=sumX2-sumX*sumX*invNum;
    sumY=sumY2-sumY*sumY*invNum;
    sumZ=sumZ2-sumZ*sumZ*invNum;
    if(sumX>sumY){
        if(sumX>sumZ){
            this.sortAxis=0;
        }else{
            this.sortAxis=2;
        }
    }else if(sumY>sumZ){
        this.sortAxis=1;
    }else{
        this.sortAxis=2;
    }
}
OIMO.SweepAndPruneBroadPhase.prototype.sweepZ = function (proxyPool) {
    var center;
    var sumX=0;
    var sumX2=0;
    var sumY=0;
    var sumY2=0;
    var sumZ=0;
    var sumZ2=0;
    var invNum=1/this.numProxies;
    var bodyStatic=OIMO.BODY_STATIC;
    for(var i=0, l=this.numProxies;i<l;i++){
        var p1=proxyPool[i];
        center=p1.minX+p1.maxX;
        sumX+=center;
        sumX2+=center*center;
        center=p1.minY+p1.maxY;
        sumY+=center;
        sumY2+=center*center;
        center=p1.minZ+p1.maxZ;
        sumZ+=center;
        sumZ2+=center*center;
        var s1=p1.parent;
        for(var j=i+1;j<l;j++){
            var p2=proxyPool[j];
            this.numPairChecks++;
            if(p1.maxZ<p2.minZ){
                break;
            }
            var s2=p2.parent;
            if( p1.maxX<p2.minX||p1.minX>p2.maxX||p1.maxY<p2.minY||p1.minY>p2.maxY||!this.isAvailablePair(s1,s2)){
                continue;
            }
            this.addPair(s1,s2);
        }
    }
    sumX=sumX2-sumX*sumX*invNum;
    sumY=sumY2-sumY*sumY*invNum;
    sumZ=sumZ2-sumZ*sumZ*invNum;
    if(sumX>sumY){
        if(sumX>sumZ){
            this.sortAxis=0;
        }else{
            this.sortAxis=2;
        }
    }else if(sumY>sumZ){
        this.sortAxis=1;
    }else{
        this.sortAxis=2;
    }
}
OIMO.SweepAndPruneBroadPhase.prototype.removeProxyAxis = function (proxy,proxyPool) {
    var idx=-1;
    for(var i=0, l=this.numProxies; i<l; i++){
        if(proxyPool[i]==proxy){
        idx=i;
        break;
        }
    }
    if(idx==-1){
        return;
    }
    for(var j=idx; j<l-1; j++){
        proxyPool[j]=proxyPool[j+1];
    }
    proxyPool[this.numProxies]=null;
}
OIMO.SweepAndPruneBroadPhase.prototype.insertionSortX = function (proxyPool) {
    if(this.numProxies==1) return;
    for(var i=1, l=this.numProxies; i<l; i++){
        var insert=proxyPool[i];
        if(proxyPool[i-1].minX>insert.minX){
            var j=i;
            do{
                proxyPool[j]=proxyPool[j-1];
                j--;
            }while(j>0&&proxyPool[j-1].minX>insert.minX);
            proxyPool[j]=insert;
        }
    }
}
OIMO.SweepAndPruneBroadPhase.prototype.insertionSortY = function (proxyPool) {
    if(this.numProxies==1) return;
    for(var i=1, l=this.numProxies; i<l; i++){
        var insert=proxyPool[i];
        if(proxyPool[i-1].minY>insert.minY){
            var j=i;
            do{
                proxyPool[j]=proxyPool[j-1];
                j--;
            }while(j>0&&proxyPool[j-1].minY>insert.minY);
            proxyPool[j]=insert;
        }
    }
}
OIMO.SweepAndPruneBroadPhase.prototype.insertionSortZ = function (proxyPool) {
    if(this.numProxies==1) return;
    for(var i=1, l=this.numProxies; i<l; i++){
        var insert=proxyPool[i];
        if(proxyPool[i-1].minZ>insert.minZ){
            var j=i;
            do{
                proxyPool[j]=proxyPool[j-1];
                j--;
            }while(j>0&&proxyPool[j-1].minZ>insert.minZ);
            proxyPool[j]=insert;
        }
    }
}
