/**
 * The class of physical computing world. 
 * You must be added to the world physical all computing objects
 * @author saharan
 * @author lo-th
 */

OIMO.World = function ( TimeStep, BroadPhaseType, Iterations, NoStat ) {

    

    // The time between each step
    this.timeStep = TimeStep || 0.01666; // 1/60;
    // The number of iterations for constraint solvers.
    this.numIterations = Iterations || 8;
     // It is a wide-area collision judgment that is used in order to reduce as much as possible a detailed collision judgment.
    switch(BroadPhaseType || 2){
        case 1: this.broadPhase = new OIMO.BruteForceBroadPhase(); break;
        case 2: default: this.broadPhase = new OIMO.SAPBroadPhase(); break;
        case 3: this.broadPhase = new OIMO.DBVTBroadPhase(); break;
    }

    // This is the detailed information of the performance. 
    this.performance = null;
    this.isNoStat = NoStat || false;
    if(!this.isNoStat) this.performance = new OIMO.Performance(this);

    // Whether the constraints randomizer is enabled or not.
    this.enableRandomizer = true;

    


    // The rigid body list
    this.rigidBodies=null;
    // number of rigid body
    this.numRigidBodies=0;
    // The contact list
    this.contacts=null;
    this.unusedContacts=null;
    // The number of contact
    this.numContacts=0;
    // The number of contact points
    this.numContactPoints=0;
    //  The joint list
    this.joints=null;
    // The number of joints.
    this.numJoints=0;
    // The number of simulation islands.
    this.numIslands=0;
    
   
    // The gravity in the world.
    this.gravity = new OIMO.Vec3(0,-9.80665,0);

    

    var numShapeTypes = 5;//4;//3;
    this.detectors=[];
    this.detectors.length = numShapeTypes;
    var i=numShapeTypes;
    while(i--){
        this.detectors[i]=[];
        this.detectors[i].length = numShapeTypes;
    }
    this.detectors[OIMO.SHAPE_SPHERE][OIMO.SHAPE_SPHERE]=new OIMO.SphereSphereCollisionDetector();
    this.detectors[OIMO.SHAPE_SPHERE][OIMO.SHAPE_BOX]=new OIMO.SphereBoxCollisionDetector(false);
    this.detectors[OIMO.SHAPE_BOX][OIMO.SHAPE_SPHERE]=new OIMO.SphereBoxCollisionDetector(true);
    this.detectors[OIMO.SHAPE_BOX][OIMO.SHAPE_BOX]=new OIMO.BoxBoxCollisionDetector();

    // CYLINDER add
    this.detectors[OIMO.SHAPE_CYLINDER][OIMO.SHAPE_CYLINDER] = new OIMO.CylinderCylinderCollisionDetector();

    this.detectors[OIMO.SHAPE_CYLINDER][OIMO.SHAPE_BOX] = new OIMO.BoxCylinderCollisionDetector(true);
    this.detectors[OIMO.SHAPE_BOX][OIMO.SHAPE_CYLINDER] = new OIMO.BoxCylinderCollisionDetector(false);

    this.detectors[OIMO.SHAPE_CYLINDER][OIMO.SHAPE_SPHERE] = new OIMO.SphereCylinderCollisionDetector(true);
    this.detectors[OIMO.SHAPE_SPHERE][OIMO.SHAPE_CYLINDER] = new OIMO.SphereCylinderCollisionDetector(false);

    // TETRA add
    this.detectors[OIMO.SHAPE_TETRA][OIMO.SHAPE_TETRA] = new OIMO.TetraTetraCollisionDetector();

 
    this.randX = 65535;
    this.randA = 98765;
    this.randB = 123456789;
    //this.maxIslandRigidBodies = 64;
    this.islandRigidBodies = [];
    //this.islandRigidBodies.length = this.maxIslandRigidBodies;
    this.islandStack = [];
    //this.islandStack.length = this.maxIslandRigidBodies;
    //this.maxIslandConstraints = 128;
    this.islandConstraints = [];
    //this.islandConstraints.length = this.maxIslandConstraints;

};

OIMO.World.prototype = {
    constructor: OIMO.World,
    /**
    * Reset the randomizer and remove all rigid bodies, shapes, joints and any object from the world.
	*/
    clear:function(){
        this.randX=65535;
        while(this.joints!==null){
            this.removeJoint(this.joints);
        }
        while(this.contacts!==null){
            this.removeContact(this.contacts);
        }
        while(this.rigidBodies!==null){
            this.removeRigidBody(this.rigidBodies);
        }
        
        OIMO.nextID=0;
        OIMO.proxyID=0;
    },
    /**
    * I'll add a rigid body to the world. 
    * Rigid body that has been added will be the operands of each step.
    * @param  rigidBody  Rigid body that you want to add
    */
    addRigidBody:function(rigidBody){
        if(rigidBody.parent){
            OIMO.Error("World", "It is not possible to be added to more than one world one of the rigid body");
        }
        rigidBody.parent=this;
        rigidBody.awake();
        for(var shape=rigidBody.shapes; shape!==null; shape=shape.next){
            this.addShape(shape);
        }
        if(this.rigidBodies!==null)(this.rigidBodies.prev=rigidBody).next=this.rigidBodies;
        this.rigidBodies = rigidBody;
        this.numRigidBodies++;
    },
    /**
    * I will remove the rigid body from the world. 
    * Rigid body that has been deleted is excluded from the calculation on a step-by-step basis.
    * @param  rigidBody  Rigid body to be removed
    */
    removeRigidBody:function(rigidBody){
        var remove=rigidBody;
        if(remove.parent!==this)return;
        remove.awake();
        var js=remove.jointLink;
        while(js!=null){
	        var joint=js.joint;
	        js=js.next;
	        this.removeJoint(joint);
        }
        for(var shape=rigidBody.shapes; shape!==null; shape=shape.next){
            this.removeShape(shape);
        }
        var prev=remove.prev;
        var next=remove.next;
        if(prev!==null) prev.next=next;
        if(next!==null) next.prev=prev;
        if(this.rigidBodies==remove) this.rigidBodies=next;
        remove.prev=null;
        remove.next=null;
        remove.parent=null;
        this.numRigidBodies--;
    },
    getByName:function(name){
        var result = null;
        var body=this.rigidBodies;
        while(body!==null){
            if(body.name!== " " && body.name === name) result = body;
            body=body.next;
        }
        var joint=this.joints;
        while(joint!==null){
            if(joint.name!== "" && joint.name === name) result = joint;
            joint=joint.next;
        }
        return result;
    },

    /**
    * I'll add a shape to the world..
    * Add to the rigid world, and if you add a shape to a rigid body that has been added to the world, 
    * Shape will be added to the world automatically, please do not call from outside this method.
    * @param  shape  Shape you want to add
    */
    addShape:function(shape){
        if(!shape.parent || !shape.parent.parent){
            OIMO.Error("World", "It is not possible to be added alone to shape world");
        }
        shape.proxy = this.broadPhase.createProxy(shape);
        shape.updateProxy();
        this.broadPhase.addProxy(shape.proxy);
    },

    /**
    * I will remove the shape from the world.
    * Add to the rigid world, and if you add a shape to a rigid body that has been added to the world, 
    * Shape will be added to the world automatically, please do not call from outside this method.
    * @param  shape  Shape you want to delete
    */
    removeShape:function(shape){
        this.broadPhase.removeProxy(shape.proxy);
        shape.proxy=null;
    },

    /**
    * I'll add a joint to the world. 
    * Joint that has been added will be the operands of each step.
    * @param  shape Joint to be added
    */
    addJoint:function(joint){
        if(joint.parent){
            OIMO.Error("World", "It is not possible to be added to more than one world one of the joint");
        }
        if(this.joints!=null)(this.joints.prev=joint).next=this.joints;
        this.joints=joint;
        joint.parent=this;
        this.numJoints++;
        joint.awake();
        joint.attach();
    },

    /**
    * I will remove the joint from the world. 
    * Joint that has been added will be the operands of each step.
    * @param  shape Joint to be deleted
    */
    removeJoint:function(joint){
        var remove=joint;
        var prev=remove.prev;
        var next=remove.next;
        if(prev!==null)prev.next=next;
        if(next!==null)next.prev=prev;
        if(this.joints==remove)this.joints=next;
        remove.prev=null;
        remove.next=null;
        this.numJoints--;
        remove.awake();
        remove.detach();
        remove.parent=null;
    },

    worldscale:function(scale){
        OIMO.WORLD_SCALE = scale || 100;
        OIMO.INV_SCALE = 1/OIMO.WORLD_SCALE;
    },

    addContact: function (s1,s2) {

        var newContact;
        if(this.unusedContacts!==null){
            newContact=this.unusedContacts;
            this.unusedContacts=this.unusedContacts.next;
        }else{
            newContact = new OIMO.Contact();
        }
        newContact.attach(s1,s2);
        newContact.detector = this.detectors[s1.type][s2.type];
        if(this.contacts)(this.contacts.prev = newContact).next = this.contacts;
        this.contacts = newContact;
        this.numContacts++;

    },

    removeContact: function ( contact ) {

        var prev = contact.prev;
        var next = contact.next;
        if(next) next.prev = prev;
        if(prev) prev.next = next;
        if(this.contacts == contact) this.contacts = next;
        contact.prev = null;
        contact.next = null;
        contact.detach();
        contact.next = this.unusedContacts;
        this.unusedContacts = contact;
        this.numContacts--;

    },

    checkContact: function ( name1, name2 ) {

        var n1, n2;
        var contact = this.contacts;
        while(contact!==null){
            n1 = contact.body1.name || ' ';
            n2 = contact.body2.name || ' ';
            if((n1==name1 && n2==name2) || (n2==name1 && n1==name2)){ if(contact.touching) return true; else return false;}
            else contact = contact.next;
        }
        return false;

    },

    callSleep: function( body ) {

        if( !body.allowSleep ) return false;
        if( body.linearVelocity.lengthSq() > 0.04 ) return false;
        if( body.angularVelocity.lengthSq() > 0.25 ) return false;
        return true;

    },

    /**
    * I will proceed only time step seconds time of World.
    */
    step:function(){
        var time0, time1, time2, time3;

        var stat = !this.isNoStat ? true : false;

        if(stat) time0 = OIMO.now();

        var body = this.rigidBodies;

        while(body !== null){
            body.addedToIsland = false;
            if(body.sleeping){
                if( 
                    body.linearVelocity.testZero() || 
                    body.angularVelocity.testZero() || 
                    body.position.testDiff( body.sleepPosition ) || 
                    body.orientation.testDiff( body.sleepOrientation )
                ) body.awake(); // awake the body
            }
            body = body.next;
        }

        

        //------------------------------------------------------
        //   UPDATE CONTACT
        //------------------------------------------------------

        // broad phase
        if(stat) time1 = OIMO.now();


        this.broadPhase.detectPairs();


        var pairs = this.broadPhase.pairs;

        var i = this.broadPhase.numPairs;
        //do{
        while(i--){
        //for(var i=0, l=numPairs; i<l; i++){
            var pair = pairs[i];
            var s1;
            var s2;
            if(pair.shape1.id<pair.shape2.id){
                s1 = pair.shape1;
                s2 = pair.shape2;
            }else{
                s1 = pair.shape2;
                s2 = pair.shape1;
            }

            var link;
            if( s1.numContacts < s2.numContacts ) link = s1.contactLink;
            else link = s2.contactLink;
            
            var exists = false;
            while(link){
                var contact = link.contact;
                if( contact.shape1 == s1 && contact.shape2 == s2 ){
                    contact.persisting = true;
                    exists = true;// contact already exists
                    break;
                }
                link = link.next;
            }
            if(!exists){
                this.addContact( s1, s2 );
            }
        }// while(i-- >0);

        if(stat){
            time2 = OIMO.now();
            this.performance.broadPhaseTime = time2-time1;
        }

        // update & narrow phase
        this.numContactPoints = 0;
        contact = this.contacts;
        while( contact!==null ){
            if(!contact.persisting){
                if ( contact.shape1.aabb.intersectTest( contact.shape2.aabb ) ) {
                /*var aabb1=contact.shape1.aabb;
                var aabb2=contact.shape2.aabb;
                if(
	                aabb1.minX>aabb2.maxX || aabb1.maxX<aabb2.minX ||
	                aabb1.minY>aabb2.maxY || aabb1.maxY<aabb2.minY ||
	                aabb1.minZ>aabb2.maxZ || aabb1.maxZ<aabb2.minZ
                ){*/
                    var next = contact.next;
                    this.removeContact(contact);
                    contact = next;
                    continue;
                }
            }
            var b1 = contact.body1;
            var b2 = contact.body2;
            if( b1.isDynamic && !b1.sleeping || b2.isDynamic && !b2.sleeping ){
                contact.updateManifold();
            }
            this.numContactPoints += contact.manifold.numPoints;
            contact.persisting = false;
            contact.constraint.addedToIsland = false;
            contact = contact.next;
        }

        if(stat){
            time3 = OIMO.now();
            this.performance.narrowPhaseTime = time3 - time2;
        }

        //------------------------------------------------------
        //   SOLVE ISLANDS
        //------------------------------------------------------

        var invTimeStep = 1 / this.timeStep;
        //var body;
        var joint;
        var constraint;
        //var num;

        for( joint = this.joints; joint !== null; joint = joint.next ){
            joint.addedToIsland = false;
        }


        // clear old island array
        this.islandRigidBodies = [];
        this.islandConstraints = [];
        this.islandStack = [];

        // expand island buffers
        /*if(this.maxIslandRigidBodies<this.numRigidBodies){
            this.maxIslandRigidBodies=this.numRigidBodies<<1;
            //this.maxIslandRigidBodies=this.numRigidBodies*2;

            this.islandRigidBodies=[];
            this.islandStack=[];
            this.islandRigidBodies.length = this.maxIslandRigidBodies;
            this.islandStack.length = this.maxIslandRigidBodies;
        }
        var numConstraints=this.numJoints+this.numContacts;
        if(this.maxIslandConstraints<numConstraints){
            this.maxIslandConstraints=numConstraints<<1;
            //this.maxIslandConstraints=numConstraints*2;
            this.islandConstraints=[];
            this.islandConstraints.length = this.maxIslandConstraints;
        }*/

        time1 = OIMO.now();
        this.numIslands = 0;

        // build and solve simulation islands

        for( var base = this.rigidBodies; base !== null; base = base.next ){

            if( base.addedToIsland || base.isStatic || base.sleeping ) continue;// ignore
            
            if( base.isLonely() ){// update single body
                if( base.isDynamic ){
                    base.linearVelocity.addTime( this.gravity, this.timeStep );
                    /*base.linearVelocity.x+=this.gravity.x*this.timeStep;
                    base.linearVelocity.y+=this.gravity.y*this.timeStep;
                    base.linearVelocity.z+=this.gravity.z*this.timeStep;*/
                }
                if( this.callSleep( base ) ) {
                    base.sleepTime += this.timeStep;
                    if( base.sleepTime > 0.5 ) base.sleep();
                    else base.updatePosition( this.timeStep );
                }else{
                    base.sleepTime = 0;
                    base.updatePosition( this.timeStep );
                }
                this.numIslands++;
                continue;
            }

            var islandNumRigidBodies = 0;
            var islandNumConstraints = 0;
            var stackCount = 1;
            // add rigid body to stack
            this.islandStack[0] = base;
            base.addedToIsland = true;

            // build an island
            do{
                // get rigid body from stack
                body = this.islandStack[--stackCount];
                this.islandStack[stackCount] = null;
                body.sleeping = false;
                // add rigid body to the island
                this.islandRigidBodies[islandNumRigidBodies++] = body;
                if(body.isStatic) continue;
                
                // search connections
                for( var cs = body.contactLink; cs !== null; cs = cs.next ) {
                    var contact = cs.contact;
                    constraint = contact.constraint;
                    if( constraint.addedToIsland || !contact.touching ) continue;// ignore
                    
                    // add constraint to the island
                    this.islandConstraints[islandNumConstraints++] = constraint;
                    constraint.addedToIsland = true;
                    var next = cs.body;

                    if(next.addedToIsland) continue;
                    
                    // add rigid body to stack
                    this.islandStack[stackCount++] = next;
                    next.addedToIsland = true;
                }
                for( var js = body.jointLink; js !== null; js = js.next ) {
                    constraint = js.joint;

                    if(constraint.addedToIsland) continue;// ignore
                    
                    // add constraint to the island
                    this.islandConstraints[islandNumConstraints++] = constraint;
                    constraint.addedToIsland = true;
                    next = js.body;
                    if( next.addedToIsland || !next.isDynamic ) continue;
                    
                    // add rigid body to stack
                    this.islandStack[stackCount++] = next;
                    next.addedToIsland = true;
                }
            } while( stackCount != 0 );

            // update velocities
            var gVel = new OIMO.Vec3().addTime( this.gravity, this.timeStep );
            /*var gx=this.gravity.x*this.timeStep;
            var gy=this.gravity.y*this.timeStep;
            var gz=this.gravity.z*this.timeStep;*/
            var j = islandNumRigidBodies;
            while (j--){
            //or(var j=0, l=islandNumRigidBodies; j<l; j++){
                body = this.islandRigidBodies[j];
                if(body.isDynamic){
                    body.linearVelocity.addEqual(gVel);
                    /*body.linearVelocity.x+=gx;
                    body.linearVelocity.y+=gy;
                    body.linearVelocity.z+=gz;*/
                }
            }

            // randomizing order
            if(this.enableRandomizer){
                //for(var j=1, l=islandNumConstraints; j<l; j++){
                j = islandNumConstraints;
                while(j--){ if(j!==0){     
                        var swap = (this.randX=(this.randX*this.randA+this.randB&0x7fffffff))/2147483648.0*j|0;
                        constraint = this.islandConstraints[j];
                        this.islandConstraints[j] = this.islandConstraints[swap];
                        this.islandConstraints[swap] = constraint;
                    }
                }
            }

            // solve contraints

            j = islandNumConstraints;
            while(j--){
            //for(j=0, l=islandNumConstraints; j<l; j++){
                this.islandConstraints[j].preSolve( this.timeStep, invTimeStep );// pre-solve
            }
            var k = this.numIterations;
            while(k--){
            //for(var k=0, l=this.numIterations; k<l; k++){
                j = islandNumConstraints;
                while(j--){
                //for(j=0, m=islandNumConstraints; j<m; j++){
                    this.islandConstraints[j].solve();// main-solve
                }
            }
            j = islandNumConstraints;
            while(j--){
            //for(j=0, l=islandNumConstraints; j<l; j++){
                this.islandConstraints[j].postSolve();// post-solve
                this.islandConstraints[j] = null;// gc
            }

            // sleeping check

            var sleepTime = 10;
            j = islandNumRigidBodies;
            while(j--){
            //for(j=0, l=islandNumRigidBodies;j<l;j++){
                body = this.islandRigidBodies[j];
                if( this.callSleep( body ) ){
                    body.sleepTime += this.timeStep;
                    if( body.sleepTime < sleepTime ) sleepTime = body.sleepTime;
                }else{
                    body.sleepTime = 0;
                    sleepTime = 0;
                    continue;
                }
            }
            if(sleepTime > 0.5){
                // sleep the island
                j = islandNumRigidBodies;
                while(j--){
                //for(j=0, l=islandNumRigidBodies;j<l;j++){
                    this.islandRigidBodies[j].sleep();
                    this.islandRigidBodies[j] = null;// gc
                }
            }else{
                // update positions
                j = islandNumRigidBodies;
                while(j--){
                //for(j=0, l=islandNumRigidBodies;j<l;j++){
                    this.islandRigidBodies[j].updatePosition(this.timeStep);
                    this.islandRigidBodies[j] = null;// gc
                }
            }
            this.numIslands++;
        }

        if(stat){
            time2 = OIMO.now();
            this.performance.solvingTime = time2 - time1;

            //------------------------------------------------------
            //   END SIMULATION
            //------------------------------------------------------

            time2 = OIMO.now();
            // fps update
            this.performance.upfps();
            this.performance.totalTime = time2 - time0;
        }
    }

}