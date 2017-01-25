import { SHAPE_BOX, SHAPE_SPHERE, SHAPE_CYLINDER } from '../constants';
import { Performance, Error } from './Utils';


import { BruteForceBroadPhase } from '../collision/broadphase/BruteForceBroadPhase_X';
import { SAPBroadPhase } from '../collision/broadphase/sap/SAPBroadPhase_X';
import { DBVTBroadPhase } from '../collision/broadphase/dbvt/DBVTBroadPhase_X';

import { BoxBoxCollisionDetector } from '../collision/narrowphase/BoxBoxCollisionDetector';
import { BoxCylinderCollisionDetector } from '../collision/narrowphase/BoxCylinderCollisionDetector';
import { CylinderCylinderCollisionDetector } from '../collision/narrowphase/CylinderCylinderCollisionDetector';
import { SphereBoxCollisionDetector } from '../collision/narrowphase/SphereBoxCollisionDetector';
import { SphereCylinderCollisionDetector } from '../collision/narrowphase/SphereCylinderCollisionDetector';
import { SphereSphereCollisionDetector } from '../collision/narrowphase/SphereSphereCollisionDetector';

import { _Math } from '../math/Math';
import { Mat33 } from '../math/Mat33';
import { Quat } from '../math/Quat';
import { Vec3 } from '../math/Vec3';

import { ShapeConfig } from '../collision/shape/ShapeConfig';
import { BoxShape } from '../collision/shape/BoxShape';
import { SphereShape } from '../collision/shape/SphereShape';
import { CylinderShape } from '../collision/shape/CylinderShape';
//import { TetraShape } from '../collision/shape/TetraShape';

import { Contact } from '../constraint/contact/Contact_X';

import { JointConfig } from '../constraint/joint/JointConfig';
import { HingeJoint } from '../constraint/joint/HingeJoint';
import { BallAndSocketJoint } from '../constraint/joint/BallAndSocketJoint';
import { DistanceJoint } from '../constraint/joint/DistanceJoint';
import { PrismaticJoint } from '../constraint/joint/PrismaticJoint';
import { SliderJoint } from '../constraint/joint/SliderJoint';
import { WheelJoint } from '../constraint/joint/WheelJoint';

import { RigidBody } from './RigidBody_X';

/**
 * The class of physical computing world. 
 * You must be added to the world physical all computing objects
 * @author saharan
 * @author lo-th
 */

 // timestep, broadphase, iterations, worldscale, random, stat

function World ( o ) {

    if( !(o instanceof Object) ) o = {};

    // this world scale defaut is 0.1 to 10 meters max for dynamique body
    this.scale = o.worldscale || 1;
    this.invScale = 1/this.scale;

    // The time between each step
    this.timeStep = o.timestep || 0.01666; // 1/60;
    // The number of iterations for constraint solvers.
    this.numIterations = o.iterations || 8;
     // It is a wide-area collision judgment that is used in order to reduce as much as possible a detailed collision judgment.
    switch( o.broadphase || 2 ){
        case 1: this.broadPhase = new BruteForceBroadPhase(); break;
        case 2: default: this.broadPhase = new SAPBroadPhase(); break;
        case 3: this.broadPhase = new DBVTBroadPhase(); break;
    }

    // This is the detailed information of the performance. 
    this.performance = null;
    this.isStat = o.info === undefined ? false : o.info;
    if( this.isStat ) this.performance = new Performance( this );

    // Whether the constraints randomizer is enabled or not.
    this.enableRandomizer = o.random !== undefined ? o.random : true;

    


    // The rigid body list
    this.rigidBodies=[];//null;
    // number of rigid body
    //this.numRigidBodies=0;
    // The contact list
    this.contacts=[];//null;
    this.unusedContacts=null;
    // The number of contact
    this.numContacts=0;
    // The number of contact points
    this.numContactPoints=0;
    //  The joint list
    this.joints=[];//null;
    // The number of joints.
    this.numJoints=0;
    // The number of simulation islands.
    this.numIslands=0;
    
   
    // The gravity in the world.
    this.gravity = new Vec3(0,-9.8,0);

    

    var numShapeTypes = 5;//4;//3;
    this.detectors=[];
    this.detectors.length = numShapeTypes;
    var i = numShapeTypes;
    while(i--){
        this.detectors[i]=[];
        this.detectors[i].length = numShapeTypes;
    }

    this.detectors[SHAPE_SPHERE][SHAPE_SPHERE] = new SphereSphereCollisionDetector();
    this.detectors[SHAPE_SPHERE][SHAPE_BOX] = new SphereBoxCollisionDetector(false);
    this.detectors[SHAPE_BOX][SHAPE_SPHERE] = new SphereBoxCollisionDetector(true);
    this.detectors[SHAPE_BOX][SHAPE_BOX] = new BoxBoxCollisionDetector();

    // CYLINDER add
    this.detectors[SHAPE_CYLINDER][SHAPE_CYLINDER] = new CylinderCylinderCollisionDetector();

    this.detectors[SHAPE_CYLINDER][SHAPE_BOX] = new BoxCylinderCollisionDetector(true);
    this.detectors[SHAPE_BOX][SHAPE_CYLINDER] = new BoxCylinderCollisionDetector(false);

    this.detectors[SHAPE_CYLINDER][SHAPE_SPHERE] = new SphereCylinderCollisionDetector(true);
    this.detectors[SHAPE_SPHERE][SHAPE_CYLINDER] = new SphereCylinderCollisionDetector(false);

    // TETRA add
    //this.detectors[SHAPE_TETRA][SHAPE_TETRA] = new TetraTetraCollisionDetector();

 
    this.randX = 65535;
    this.randA = 98765;
    this.randB = 123456789;

    this.islandRigidBodies = [];
    this.islandStack = [];
    this.islandConstraints = [];

};

World.prototype = {

    constructor: World,

    getInfo: function(){

        return this.isStat ? this.performance.show() : '';

    },

    /**
    * Reset the randomizer and remove all rigid bodies, shapes, joints and any object from the world.
	*/
    clear:function(){

        this.randX = 65535;

        /*while(this.joints!==null){
            this.removeJoint( this.joints );
        }
        while(this.contacts!==null){
            this.removeContact( this.contacts );
        }
        /*while(this.rigidBodies!==null){
            this.removeRigidBody( this.rigidBodies );
        }*/

        while( this.joints.length > 0 ) this.removeJoint( this.joints.pop() );
        while( this.contacts.length > 0 ) this.removeContact( this.contacts.pop(), true );
        while( this.rigidBodies.length > 0 ) this.removeRigidBody( this.rigidBodies.pop() );

    },
    /**
    * I'll add a rigid body to the world. 
    * Rigid body that has been added will be the operands of each step.
    * @param  rigidBody  Rigid body that you want to add
    */
    addRigidBody:function( rigidBody ){

        if( rigidBody.parent ){
            Error("World", "It is not possible to be added to more than one world one of the rigid body");
        }

        rigidBody.parent = this;
        rigidBody.awake();

        var i = rigidBody.shapes.length
        while(i--){
            this.addShape(rigidBody.shapes[i]);
        }

        //for(var shape=rigidBody.shapes; shape!==null; shape=shape.next){
          //  this.addShape(shape);
        //}
        
        /*if(this.rigidBodies!==null)(this.rigidBodies.prev=rigidBody).next=this.rigidBodies;
        this.rigidBodies = rigidBody;
        this.numRigidBodies++;*/

        this.rigidBodies.push( rigidBody );

    },
    /**
    * I will remove the rigid body from the world. 
    * Rigid body that has been deleted is excluded from the calculation on a step-by-step basis.
    * @param  rigidBody  Rigid body to be removed
    */
    removeRigidBody:function( rigidBody ){

        var remove=rigidBody;
        if(remove.parent!==this)return;
        remove.awake();

        var i = remove.jointLink.length;
        while(i--){
	        this.removeJoint(remove.jointLink[i]);
        }

        i = remove.shapes.length;
        while(i--){
            this.removeShape(remove.shapes[i]);
        }
        /*var prev=remove.prev;
        var next=remove.next;
        if(prev!==null) prev.next=next;
        if(next!==null) next.prev=prev;
        if(this.rigidBodies==remove) this.rigidBodies=next;
        remove.prev=null;
        remove.next=null;*/
        remove.parent=null;
        //this.numRigidBodies--;

    },

    getByName: function( name ){

        var result = null;
        var i, body, joint;
        i = this.rigidBodies.length;
        while(i--){
            body = this.rigidBodies[i];
            if(body.name!== " " && body.name === name) result = body;
        }
        i = this.joints.length;
        while(i--){
            joint = this.joints[i];
            if(joint.name!== "" && joint.name === name) result = joint;
        }
        return result;

    },

    /**
    * I'll add a shape to the world..
    * Add to the rigid world, and if you add a shape to a rigid body that has been added to the world, 
    * Shape will be added to the world automatically, please do not call from outside this method.
    * @param  shape  Shape you want to add
    */
    addShape:function ( shape ){

        if(!shape.parent || !shape.parent.parent){
            Error("World", "It is not possible to be added alone to shape world");
        }
        shape.proxy = this.broadPhase.createProxy(shape);
        shape.updateProxy();
        this.broadPhase.addProxy( shape.proxy );

    },

    /**
    * I will remove the shape from the world.
    * Add to the rigid world, and if you add a shape to a rigid body that has been added to the world, 
    * Shape will be added to the world automatically, please do not call from outside this method.
    * @param  shape  Shape you want to delete
    */
    removeShape: function ( shape ){

        this.broadPhase.removeProxy( shape.proxy );
        shape.proxy = null;

    },

    /**
    * I'll add a joint to the world. 
    * Joint that has been added will be the operands of each step.
    * @param  shape Joint to be added
    */
    addJoint: function ( joint ) {

        if(joint.parent){
            Error("World", "It is not possible to be added to more than one world one of the joint");
        }
        //if(this.joints!=null)(this.joints.prev=joint).next=this.joints;
        //this.joints=joint;

        joint.parent = this;
        //this.numJoints++;
        joint.awake();
        joint.attach( true );

        this.joints.push( joint );

    },

    /**
    * I will remove the joint from the world. 
    * Joint that has been added will be the operands of each step.
    * @param  shape Joint to be deleted
    */
    removeJoint: function ( joint ) {

        
        /*var prev=remove.prev;
        var next=remove.next;
        if(prev!==null)prev.next=next;
        if(next!==null)next.prev=prev;
        if(this.joints==remove)this.joints=next;
        remove.prev=null;
        remove.next=null;
        this.numJoints--;*/
        joint.awake();
        joint.detach( true );
        joint.parent = null;

    },

    addContact: function ( s1, s2 ) {

        /*var newContact;
        if(this.unusedContacts!==null){
            newContact=this.unusedContacts;
            this.unusedContacts=this.unusedContacts.next;
        }else{
            newContact = new Contact();
        }*/
        var newContact = new Contact();
        newContact.attach( s1, s2 );
        newContact.detector = this.detectors[s1.type][s2.type];
        //if(this.contacts)(this.contacts.prev = newContact).next = this.contacts;
        //this.contacts = newContact;
        this.contacts.push( newContact );

        this.numContacts = this.contacts.length;

        

    },

    removeContact: function ( contact, ar ) {

        if( ar===undefined ) this.contacts.splice( this.contacts.indexOf(contact), 1 );

        //var prev = contact.prev;
        //var next = contact.next;
        //if(next) next.prev = prev;
        //if(prev) prev.next = next;
        //if(this.contacts == contact) this.contacts = next;
        //contact.prev = null;
        //contact.next = null;
        contact.detach();
        //contact.next = this.unusedContacts;
        //this.unusedContacts = contact;
        this.numContacts = this.contacts.length;


    },

    checkContact: function ( name1, name2 ) {

        var n1, n2;
        var i = this.contacts.length, contact;
        //var contact = this.contacts;
        while(i--){
            contact = this.contacts[i];
            n1 = contact.body1.name || ' ';
            n2 = contact.body2.name || ' ';
            if((n1==name1 && n2==name2) || (n2==name1 && n1==name2)){ if(contact.touching) return true; else return false;}
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
    step: function () {

        var stat = this.isStat;

        if( stat ) this.performance.setTime( 0 );

        var body, base, contact, i, j, k, cs, js, next;

        i = this.rigidBodies.length;

        while( i-- ){

            body = this.rigidBodies[i]; 
            body.addedToIsland = false;
            if( body.sleeping ) body.testWakeUp();

        }

        

        //------------------------------------------------------
        //   UPDATE BROADPHASE CONTACT
        //------------------------------------------------------
        
        if( stat ) this.performance.setTime( 1 );

        this.broadPhase.detectPairs();

        var pairs = this.broadPhase.pairs;

        i = this.broadPhase.numPairs;
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
            var s1L = s1.contactLink.length;
            var s2L = s2.contactLink.length;

            if( s1L < s2L ) link = s1.contactLink;
            else link = s2.contactLink;
            
            var exists = false;
            j = link.length;
            while(j--){
                var contact = link[j].contact;
                if( contact.shape1 == s1 && contact.shape2 == s2 ){
                    contact.persisting = true;
                    exists = true;// contact already exists
                    break;
                }
                //link = link.next;
            }
            if(!exists){
                this.addContact( s1, s2 );
            }
        }// while(i-- >0);

        if( stat ) this.performance.calcBroadPhase();

        //------------------------------------------------------
        //   UPDATE NARROWPHASE CONTACT
        //------------------------------------------------------

        // update & narrow phase
        this.numContactPoints = 0;
        //contact = this.contacts;
        i = this.contacts.length;
        while( i-- ){
            contact = this.contacts[i];
        //while( contact!==null ){
            if(!contact.persisting){
                if ( contact.shape1.aabb.intersectTest( contact.shape2.aabb ) ) {
                /*var aabb1=contact.shape1.aabb;
                var aabb2=contact.shape2.aabb;
                if(
	                aabb1.minX>aabb2.maxX || aabb1.maxX<aabb2.minX ||
	                aabb1.minY>aabb2.maxY || aabb1.maxY<aabb2.minY ||
	                aabb1.minZ>aabb2.maxZ || aabb1.maxZ<aabb2.minZ
                ){*/
                    //var next = contact.next;
                    this.removeContact( contact );
                    //contact = next;
                    continue;
                }
            }
            var b1 = contact.body1;
            var b2 = contact.body2;

            if( b1.isDynamic && !b1.sleeping || b2.isDynamic && !b2.sleeping ) contact.updateManifold();
            
            this.numContactPoints += contact.manifold.numPoints;
            contact.persisting = false;
            contact.constraint.addedToIsland = false;
           // contact = contact.next;

        }

        if( stat ) this.performance.calcNarrowPhase();

        //------------------------------------------------------
        //   SOLVE ISLANDS
        //------------------------------------------------------

        var invTimeStep = 1 / this.timeStep;
        var constraint;

        i = this.joints.length;
        while( i-- ){
            this.joints[i].addedToIsland = false;
        }


        // clear old island array
        this.islandRigidBodies = [];
        this.islandConstraints = [];
        this.islandStack = [];

        if( stat ) this.performance.setTime( 1 );

        this.numIslands = 0;

        // build and solve simulation islands
        i = this.rigidBodies.length;
        //while( body !== null ){
        while( i-- ){
            base = this.rigidBodies[i]; 
        //for( var base = this.rigidBodies; base !== null; base = base.next ){

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
                j = body.contactLink.length;
                while(j--){
                    cs = body.contactLink[j];
                    var contact = cs.contact;
                    constraint = contact.constraint;
                    if( constraint.addedToIsland || !contact.touching ) continue;// ignore
                    
                    // add constraint to the island
                    this.islandConstraints[islandNumConstraints++] = constraint;
                    constraint.addedToIsland = true;
                    next = cs.body;

                    if(next.addedToIsland) continue;
                    
                    // add rigid body to stack
                    this.islandStack[stackCount++] = next;
                    next.addedToIsland = true;
                }

                k = body.jointLink.length;
                while(k--){

                    js = body.jointLink[k];
                    constraint = js.joint;

                    if( constraint.addedToIsland ) continue;// ignore
                    
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
            var gVel = new Vec3().addTime( this.gravity, this.timeStep );
            /*var gx=this.gravity.x*this.timeStep;
            var gy=this.gravity.y*this.timeStep;
            var gz=this.gravity.z*this.timeStep;*/
            j = islandNumRigidBodies;
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
            k = this.numIterations;
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
                    this.islandRigidBodies[j].updatePosition( this.timeStep );
                    this.islandRigidBodies[j] = null;// gc
                }
            }
            this.numIslands++;
        }

        //------------------------------------------------------
        //   END SIMULATION
        //------------------------------------------------------

        if( stat ) this.performance.calcEnd();

    },

    add: function( o ){
        
        o = o || {};

        var invScale = this.invScale;

        var type = o.type || "box";
        if( typeof type === 'string' ) type = [type];// single shape

        if(type[0].substring(0,5) == 'joint'){ // is joint

            if(type[0] === 'joint')type[0] = 'jointHinge';

            var axe1 = o.axe1 || [1,0,0];
            var axe2 = o.axe2 || [1,0,0];
            var pos1 = o.pos1 || [0,0,0];
            var pos2 = o.pos2 || [0,0,0];

            pos1 = pos1.map(function(x){ return x * invScale; });
            pos2 = pos2.map(function(x){ return x * invScale; });

            var min, max;
            if(type[0]==="jointDistance"){
                min = o.min || 0;
                max = o.max || 10;
                min = min * invScale;
                max = max * invScale;
            }else{
                min = o.min || 57.29578;
                max = o.max || 0;
                min = min * _Math.degtorad;
                max = max * _Math.degtorad;
            }

            var limit = o.limit || null;
            var spring = o.spring || null;
            var motor = o.motor || null;

            // joint setting
            var jc = new JointConfig();
            jc.scale = this.scale;
            jc.invScale = this.invScale;
            jc.allowCollision = o.collision || false;
            jc.localAxis1.init(axe1[0], axe1[1], axe1[2]);
            jc.localAxis2.init(axe2[0], axe2[1], axe2[2]);
            jc.localAnchorPoint1.init(pos1[0], pos1[1], pos1[2]);
            jc.localAnchorPoint2.init(pos2[0], pos2[1], pos2[2]);
            if (typeof o.body1 == 'string' || o.body1 instanceof String) o.body1 = this.getByName(o.body1);
            if (typeof o.body2 == 'string' || o.body2 instanceof String) o.body2 = this.getByName(o.body2);
            jc.body1 = o.body1;
            jc.body2 = o.body2;

            var joint;
            switch(type[0]){
                case "jointDistance": joint = new DistanceJoint(jc, min, max); 
                    if(spring !== null) joint.limitMotor.setSpring(spring[0], spring[1]);
                    if(motor !== null) joint.limitMotor.setMotor(motor[0], motor[1]);
                break;
                case "jointHinge": joint = new HingeJoint(jc, min, max);
                    if(spring !== null) joint.limitMotor.setSpring(spring[0], spring[1]);// soften the joint ex: 100, 0.2
                    if(motor !== null) joint.limitMotor.setMotor(motor[0], motor[1]);
                break;
                case "jointPrisme": joint = new PrismaticJoint(jc, min, max); break;
                case "jointSlide": joint = new SliderJoint(jc, min, max); break;
                case "jointBall": joint = new BallAndSocketJoint(jc); break;
                case "jointWheel": joint = new WheelJoint(jc);  
                    if(limit !== null) joint.rotationalLimitMotor1.setLimit(limit[0], limit[1]);
                    if(spring !== null) joint.rotationalLimitMotor1.setSpring(spring[0], spring[1]);
                    if(motor !== null) joint.rotationalLimitMotor1.setMotor(motor[0], motor[1]);
                break;
            }

            joint.name = o.name || '';
            // finaly add to physics world
            this.addJoint( joint );

            return joint;

        } else { // is body

            // I'm dynamique or not
            var move = o.move || false;

            //var mass = o.mass || 0;

            // I can sleep or not
            var noSleep  = o.noSleep || false;
            
            // My start position
            var p = o.pos || [0,0,0];
            p = p.map(function(x) { return x * invScale; });

            // My size 
            var s = o.size || [1,1,1];
            s = s.map(function(x) { return x * invScale; });

            // My rotation in degre
            var rot = o.rot || [0,0,0];
            rot = rot.map(function(x) { return x * _Math.degtorad; });
            var r = [];
            for (var i=0; i<rot.length/3; i++){
                var tmp = _Math.EulerToAxis(rot[i+0], rot[i+1], rot[i+2]);
                r.push(tmp[0]);  r.push(tmp[1]); r.push(tmp[2]); r.push(tmp[3]);
            }

            // My physics setting
            var sc = new ShapeConfig();
            sc.density = o.density || 1;
            sc.friction = o.friction || 0.4;
            sc.restitution = o.restitution || 0.0;
            sc.belongsTo = o.belongsTo || 1;
            sc.collidesWith = o.collidesWith || 0xffffffff

            //if( o.sc  !== undefined ) sc = o.sc;

            if(o.config){
                // The density of the shape.
                sc.density = o.config[0] === undefined ? 1 : o.config[0];
                // The coefficient of friction of the shape.
                sc.friction = o.config[1] === undefined ? 0.4 : o.config[1];
                // The coefficient of restitution of the shape.
                sc.restitution = o.config[2] === undefined ? 0.2 : o.config[2];
                // The bits of the collision groups to which the shape belongs.
                sc.belongsTo = o.config[3] || 1;
                //sc.belongsTo = o.config[3] === undefined ? 1 : o.config[3];
                // The bits of the collision groups with which the shape collides.
                sc.collidesWith = o.config[4] || 0xffffffff;
                //sc.collidesWith = o.config[4] === undefined ? 0xffffffff : o.config[4];
            }


            if(o.massPos){
                o.massPos = o.massPos.map(function(x) { return x * invScale; });
                sc.relativePosition.init( o.massPos[0], o.massPos[1], o.massPos[2] );
            }
            if(o.massRot){
                o.massRot = o.massRot.map(function(x) { return x * degtorad; });
                sc.relativeRotation = _Math.EulerToMatrix( o.massRot[0], o.massRot[1], o.massRot[2] );
            }
            
            // My rigidbody
            var body = new RigidBody( p[0], p[1], p[2], r[0], r[1], r[2], r[3], this.scale, this.invScale );

            // My shapes
            var shapes = [];

            //if( typeof type === 'string' ) type = [type];// single shape

            var n, n2;
            for(var i=0; i<type.length; i++){
                n = i*3;
                n2 = i*4;
                switch(type[i]){
                    case "sphere": shapes[i] = new SphereShape(sc, s[n]); break;
                    case "cylinder": shapes[i] = new CylinderShape(sc, s[n], s[n+1]); break;
                    case "box": shapes[i] = new BoxShape(sc, s[n], s[n+1], s[n+2]); break;
                }
                body.addShape(shapes[i]);
                if(i>0){
                    //shapes[i].position.init(p[0]+p[n+0], p[1]+p[n+1], p[2]+p[n+2] );
                    shapes[i].relativePosition = new Vec3( p[n], p[n+1], p[n+2] );
                    //if(r[n2+0]) shapes[i].relativeRotation = [ r[n2], r[n2+1], r[n2+2], r[n2+3] ];
                    if(r[n2+0]) {
                        var q = new Quat().setFromAxis( r[n2], r[n2+1], r[n2+2], r[n2+3] );
                        //var q = body.rotationAxisToQuad( r[0], r[1], r[2], r[3] );
                        shapes[i].relativeRotation = new Mat33().setQuat(q);
                    }
                }
            } 
            
            // I'm static or i move
            if( move ){
                if(o.massPos || o.massRot) body.setupMass(0x1, false);
                else body.setupMass(0x1, true);
                if(noSleep) body.allowSleep = false;
                else body.allowSleep = true;
            } else {
                body.setupMass(0x2);
            }
            
            body.name = o.name || ' ';
            
            // finaly add to physics world
            this.addRigidBody( body );

            return body;
        }
    }


}

export { World };