import { SHAPE_BOX, SHAPE_SPHERE, SHAPE_CYLINDER, SHAPE_PLANE, BODY_DYNAMIC, BODY_STATIC } from '../constants';
import { InfoDisplay, printError } from './Utils';


import { BruteForceBroadPhase } from '../collision/broadphase/BruteForceBroadPhase_X';
import { SAPBroadPhase } from '../collision/broadphase/sap/SAPBroadPhase_X';
import { DBVTBroadPhase } from '../collision/broadphase/dbvt/DBVTBroadPhase_X';

import { BoxBoxCollisionDetector } from '../collision/narrowphase/BoxBoxCollisionDetector_X';
import { BoxCylinderCollisionDetector } from '../collision/narrowphase/BoxCylinderCollisionDetector_X';
import { CylinderCylinderCollisionDetector } from '../collision/narrowphase/CylinderCylinderCollisionDetector_X';
import { SphereBoxCollisionDetector } from '../collision/narrowphase/SphereBoxCollisionDetector_X';
import { SphereCylinderCollisionDetector } from '../collision/narrowphase/SphereCylinderCollisionDetector_X';
import { SphereSphereCollisionDetector } from '../collision/narrowphase/SphereSphereCollisionDetector_X';
import { SpherePlaneCollisionDetector } from '../collision/narrowphase/SpherePlaneCollisionDetector_X';
import { BoxPlaneCollisionDetector } from '../collision/narrowphase/BoxPlaneCollisionDetector_X';
//import { TetraTetraCollisionDetector } from '../collision/narrowphase/TetraTetraCollisionDetector';

import { _Math } from '../math/Math';
import { Mat33 } from '../math/Mat33';
import { Quat } from '../math/Quat';
import { Vec3 } from '../math/Vec3';

import { ShapeConfig } from '../shape/ShapeConfig';
import { Box } from '../shape/Box';
import { Sphere } from '../shape/Sphere';
import { Cylinder } from '../shape/Cylinder';
import { Plane } from '../shape/Plane';
import { Particle } from '../shape/Particle';

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
    this.timerate = this.timeStep * 1000;
    this.timer = null;

    this.preLoop = null;//function(){};
    this.postLoop = null;//function(){};

    // The number of iterations for constraint solvers.
    this.numIterations = o.iterations || 8;

     // It is a wide-area collision judgment that is used in order to reduce as much as possible a detailed collision judgment.
    switch( o.broadphase || 2 ){
        case 1: this.broadPhase = new BruteForceBroadPhase(); break;
        case 2: default: this.broadPhase = new SAPBroadPhase(); break;
        case 3: this.broadPhase = new DBVTBroadPhase(); break;
    }

    this.Btypes = ['None','BruteForce X','Sweep & Prune X', 'Bounding Volume Tree X' ];
    this.broadPhaseType = this.Btypes[ o.broadphase || 2 ];

    // This is the detailed information of the performance. 
    this.performance = null;
    this.isStat = o.info === undefined ? false : o.info;
    if( this.isStat ) this.performance = new InfoDisplay( this );

    // Whether the constraints randomizer is enabled or not.
    this.enableRandomizer = o.random !== undefined ? o.random : true;

    


    // The rigid body list
    this.rigidBodies = [];
    // number of rigid body
    this.numRigidBodies = 0;

    // The contact list
    this.contacts = [];
    // The number of contact
    this.numContacts = 0;

    
    //  The joint list
    this.joints = [];
    // The number of joints.
    this.numJoints = 0;

    // The number of contact points
    this.numContactPoints = 0;
    // The number of simulation islands.
    this.numIslands = 0;
    
   
    // The gravity in the world.
    this.gravity = new Vec3(0,-9.81,0);
    if( o.gravity !== undefined ) this.gravity.fromArray( o.gravity );

    

    var numShapeTypes = 6;//4;//3;
    this.detectors = [];
    //this.detectors.length = numShapeTypes;
    var i = numShapeTypes;
    while(i--){
        this.detectors[i]=[];
        //this.detectors[i].length = numShapeTypes;
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

    // PLANE add

    this.detectors[SHAPE_PLANE][SHAPE_SPHERE] = new SpherePlaneCollisionDetector(true);
    this.detectors[SHAPE_SPHERE][SHAPE_PLANE] = new SpherePlaneCollisionDetector(false);

    this.detectors[SHAPE_PLANE][SHAPE_BOX] = new BoxPlaneCollisionDetector(true);
    this.detectors[SHAPE_BOX][SHAPE_PLANE] = new BoxPlaneCollisionDetector(false);

    // TETRA add
    //this.detectors[SHAPE_TETRA][SHAPE_TETRA] = new TetraTetraCollisionDetector();

 
    this.randX = 65535;
    this.randA = 98765;
    this.randB = 123456789;

    this.islandRigidBodies = [];
    this.islandStack = [];
    this.islandConstraints = [];

    

}

Object.assign( World.prototype, {

    World: true,

    play: function(){
 
        if( this.timer !== null ) return;

        var _this = this;
        this.timer = setInterval( function(){ _this.step(); } , this.timerate );
        //this.timer = setInterval( this.loop.bind(this) , this.timerate );

    },

    stop: function(){

        if( this.timer === null ) return;

        clearInterval( this.timer );
        this.timer = null;

    },

    //

    getInfo: function(){

        return this.isStat ? this.performance.show() : '';

    },

    // Reset world and any object from the world.
	
    clear:function(){

        this.stop();
        this.preLoop = null;
        this.postLoop = null;

        this.randX = 65535;

        while( this.joints.length > 0 ) this.removeJoint( this.joints.pop(), true );
        while( this.contacts.length > 0 ) this.removeContact( this.contacts.pop(), true );
        while( this.rigidBodies.length > 0 ) this.removeRigidBody( this.rigidBodies.pop(), true );

        this.numRigidBodies = 0;
        this.numContacts = 0;
        this.numJoints = 0;

    },

    patchId: function ( ar ) {

        var i = ar.length;
        while( i-- ) ar[i].setId( i );
        
    },

    // --- RIGIDBODY

    addRigidBody:function( rigidBody ){

        if( rigidBody.parent ) printError("World", "It is not possible to be added to more than one world one of the rigid body");
        

        rigidBody.setParent( this );

        var i = rigidBody.shapes.length;

        while(i--){

            this.addShape( rigidBody.shapes[i] );

        }

        this.rigidBodies.push( rigidBody );
        this.numRigidBodies++;

    },

    removeRigidBody: function ( body, all ) {

        if( body.parent !== this ) return;

        var i;

        body.awake();

        i = body.jointLink.length;
        while( i-- ){
	        this.removeJoint( body.jointLink[i] );
        }

        i = body.shapes.length;
        while( i-- ){
            this.removeShape( body.shapes[i] );
        }

        body.parent = null;

        if( !all ){ 
            this.rigidBodies.splice( body.id, 1 );
            this.patchId( this.rigidBodies );
            this.numRigidBodies--;
        }

    },

    getByName: function( name ){

        var i, body, joint;

        i = this.rigidBodies.length;
        while(i--){
            body = this.rigidBodies[i];
            if( body.name === name ) return body;
        }

        i = this.joints.length;
        while(i--){
            joint = this.joints[i];
            if( joint.name === name ) return joint;
        }

        return null;

    },

    // --- SHAPE

    // add a shape to the world..
    // Add to the rigid world, and if you add a shape to a rigid body that has been added to the world, 
    // Shape will be added to the world automatically, please do not call from outside this method.
 
    addShape:function ( shape ){

        if(!shape.parent || !shape.parent.parent){
            printError("World", "It is not possible to be added alone to shape world");
        }

        shape.proxy = this.broadPhase.createProxy( shape );
        shape.updateProxy();
        this.broadPhase.addProxy( shape.proxy );

    },

    // remove the shape from the world.
    // please do not call from outside this method.
  
    removeShape: function ( shape ){

        this.broadPhase.removeProxy( shape.proxy );
        shape.proxy = null;

    },

    // --- JOINT

    addJoint: function ( joint ) {

        if( joint.parent ) printError("World", "It is not possible to be added to more than one world one of the joint");
        
        joint.setParent( this );

        joint.awake();
        joint.attach( true );

        this.joints.push( joint );
        this.numJoints++;

    },

    // remove the joint from the world. 

    removeJoint: function ( joint, all ) {

        if( joint.parent !== this ) return;

        joint.awake();
        joint.detach( true );
        joint.parent = null;

        if( !all ){
            this.joints.splice( joint.id, 1 );
            this.patchId( this.joints );
            this.numJoints--;
        }

    },

    // --- CONTACT

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

        this.numContacts++;// = this.contacts.length;

        

    },

    removeContact: function ( contact, all ) {

        if( all === undefined ) this.contacts.splice( this.contacts.indexOf( contact ), 1 );

        contact.detach();
        this.numContacts--;// = this.contacts.length;

    },

    getContact: function ( b1, b2 ) {

        var n1, n2, i;
        var contact, ct = null;
        b1 = b1.constructor === RigidBody ? b1.name : b1;
        b2 = b2.constructor === RigidBody ? b2.name : b2;
      
        i = this.contacts.length;
        while(i--){
            contact = this.contacts[i];
            n1 = contact.body1.name;
            n2 = contact.body2.name;
            if(( n1 === b1 && n2 === b2 ) || ( n2 === b1 && n1 === b2 )){
                if( contact.touching ){ 
                    ct = contact;
                    break;
                }
            }
        }

        return ct;

    },

    checkContact: function ( name1, name2 ) {

        var n1, n2, contact, ct = false;
        var i = this.contacts.length;
        while(i--){
            contact = this.contacts[i];
            n1 = contact.body1.name;
            n2 = contact.body2.name;
            if(( n1 === name1 && n2 === name2 ) || ( n2 === name1 && n1 === name2 )){
                ct = contact.touching;
                break;
            }
        }

        return ct;

    },

    callSleep: function( body ) {

        if( !body.allowSleep ) return false;
        if( body.linearVelocity.lengthSq() > 0.04 ) return false;
        if( body.angularVelocity.lengthSq() > 0.25 ) return false;
        return true;

    },


    // --- WORLD STEP
    //  I will proceed only time step seconds time of World.

    step: function () {

        if( this.preLoop !== null ) this.preLoop();

        var stat = this.isStat;

        if( stat ) this.performance.setTime( 0 );

        var body, base, contact, i, j, k, cs, js, next;

        i = this.rigidBodies.length;

        while( i-- ){

            body = this.rigidBodies[i]; 
            body.addedToIsland = false;
            if( body.sleeping ) body.testWakeUp();

        }

        // --- UPDATE BROADPHASE CONTACT
        
        if( stat ) this.performance.setTime( 1 );

        this.broadPhase.detectPairs();

        var idtest, pair, s1, s2, link, s1L, s2L, exists, contact, b1, b2

        var pairs = this.broadPhase.pairs;

        i = pairs.length;//this.broadPhase.numPairs;

        while( i-- ){

            pair = pairs[i];
            idtest = pair.shape1.id < pair.shape2.id ? true : false;

            s1 = idtest ? pair.shape1 : pair.shape2;
            s2 = idtest ? pair.shape2 : pair.shape1;

            s1L = s1.contactLink.length;
            s2L = s2.contactLink.length;

            link = s1L < s2L ? s1.contactLink : s2.contactLink;

            exists = false;
            j = link.length;

            while( j-- ){

                contact = link[j].contact;
                if( contact.shape1 === s1 && contact.shape2 === s2 ){
                    // contact already exists
                    contact.persisting = true;
                    exists = true; 
                    break;
                }

            }

            if( !exists ) this.addContact( s1, s2 );
            
        }

        if( stat ) this.performance.calcBroadPhase();

        // --- UPDATE NARROWPHASE CONTACT

        this.numContactPoints = 0;

        i = this.contacts.length;

        while( i-- ){

            contact = this.contacts[i];

            if( !contact.persisting ){
                if ( contact.shape1.aabb.intersectTest( contact.shape2.aabb ) ) {
             
                    this.removeContact( contact );
                    continue;

                }
            }

            b1 = contact.body1;
            b2 = contact.body2;

            if( b1.isDynamic && !b1.sleeping || b2.isDynamic && !b2.sleeping ) contact.updateManifold();
            
            this.numContactPoints += contact.manifold.numPoints;
            contact.persisting = false;
            contact.constraint.addedToIsland = false;

        }

        if( stat ) this.performance.calcNarrowPhase();

        // --- SOLVE ISLANDS

        var invTimeStep = 1 / this.timeStep;
        var constraint, islandNumRigidBodies, islandNumConstraints, stackCount, gVel, swap, sleepTime;

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

        // --- BUILD & SOLVE ISLANDS

        i = this.rigidBodies.length;

        while( i-- ){

            base = this.rigidBodies[i]; 

            if( base.addedToIsland || base.isStatic || base.sleeping ) continue;// ignore
            
            if( base.isLonely() ){// update single body
                if( base.isDynamic && !base.isKinematic ){
                    base.linearVelocity.addScaledVector( this.gravity, this.timeStep );
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

            islandNumRigidBodies = 0;
            islandNumConstraints = 0;
            stackCount = 1;

            // add rigid body to stack
            this.islandStack[0] = base;
            base.addedToIsland = true;

            // build an island

            //while( stackCount > 0 ){
            do{
                // get rigid body from stack
                body = this.islandStack[--stackCount];
                this.islandStack[ stackCount ] = null;
                body.sleeping = false;

                // add rigid body to the island
                this.islandRigidBodies[ islandNumRigidBodies++ ] = body;
                if( body.isStatic ) continue;
                
                // search connections
                j = body.contactLink.length;

                while(j--){

                    cs = body.contactLink[j];
                    contact = cs.contact;
                    constraint = contact.constraint;
                    if( constraint.addedToIsland || !contact.touching ) continue;// ignore
                    
                    // add constraint to the island
                    this.islandConstraints[islandNumConstraints++] = constraint;
                    constraint.addedToIsland = true;
                    next = cs.body;

                    if( next.addedToIsland ) continue;
                    
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


            // update gravity velocities

            gVel = new Vec3().addScaledVector( this.gravity, this.timeStep );

            j = islandNumRigidBodies;

            while ( j-- ){

                body = this.islandRigidBodies[j];
                if( body.isDynamic && !body.isKinematic ) body.linearVelocity.addEqual( gVel );
                
            }

            // randomizing order

            if( this.enableRandomizer ){

                j = islandNumConstraints;
                while(j--){ 

                    if( j > 0 ){   

                        swap = (this.randX=(this.randX*this.randA+this.randB&0x7fffffff))/2147483648.0*j|0;
                        constraint = this.islandConstraints[j];
                        this.islandConstraints[j] = this.islandConstraints[swap];
                        this.islandConstraints[swap] = constraint;

                    }

                }

            }

            // solve contraints

            j = islandNumConstraints;
            while(j--){
                this.islandConstraints[j].preSolve( this.timeStep, invTimeStep );// pre-solve
            }

            k = this.numIterations;
            while(k--){
                j = islandNumConstraints;
                while(j--){
                    this.islandConstraints[j].solve();// main-solve
                }
            }

            j = islandNumConstraints;
            while(j--){
                this.islandConstraints[j].postSolve();// post-solve
                this.islandConstraints[j] = null;// gc
            }

            // sleeping check

            sleepTime = 10;
            j = islandNumRigidBodies;

            while(j--){

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

                    this.islandRigidBodies[j].sleep();
                    this.islandRigidBodies[j] = null;// gc

                }

            }else{

                // update positions
                j = islandNumRigidBodies;
                while(j--){

                    this.islandRigidBodies[j].updatePosition( this.timeStep );
                    this.islandRigidBodies[j] = null;// gc

                }
            }

            this.numIslands++;

        }

        // --- END SIMULATION

        if( stat ) this.performance.calcEnd();

        if( this.postLoop !== null ) this.postLoop();

    },

    /**
    * add someting to world
    */

    add: function( o ){
        
        o = o || {};

        var type = o.type || "box";
        if( type.constructor === String ) type = [ type ];
        var isJoint = type[0].substring( 0, 5 ) === 'joint' ? true : false;

        if( isJoint ) return this.initJoint( type[0], o );
        else return this.initBody( type, o );

    },

    initBody: function( type, o ){

        var invScale = this.invScale;

        // body dynamic or static
        var move = o.move || false;
        var kinematic = o.kinematic || false;
        
        // POSITION

        // body position
        var p = o.pos || [0,0,0];
        p = p.map( function(x) { return x * invScale; } );

        // shape position
        var p2 = o.posShape || [0,0,0];
        p2 = p2.map( function(x) { return x * invScale; } );

        // ROTATION

        // body rotation in degree
        var r = o.rot || [0,0,0];
        r = r.map( function(x) { return x * _Math.degtorad; } );

        // shape rotation in degree
        var r2 = o.rotShape || [0,0,0];
        r2 = r.map( function(x) { return x * _Math.degtorad; } );

        // SIZE

        // shape size
        var s = o.size === undefined ? [1,1,1] : o.size;
        if( s.length === 1 ){ s[1] = s[0]; }
        if( s.length === 2 ){ s[2] = s[0]; }
        s = s.map( function(x) { return x * invScale; } );

        // body physics settings
        var sc = new ShapeConfig();
        // The density of the shape.
        if( o.density !== undefined ) sc.density = o.density;
        // The coefficient of friction of the shape.
        if( o.friction !== undefined ) sc.friction = o.friction;
        // The coefficient of restitution of the shape.
        if( o.restitution !== undefined ) sc.restitution = o.restitution;
        // The bits of the collision groups to which the shape belongs.
        if( o.belongsTo !== undefined ) sc.belongsTo = o.belongsTo;
        // The bits of the collision groups with which the shape collides.
        if( o.collidesWith !== undefined ) sc.collidesWith = o.collidesWith;

        if(o.config !== undefined ){
            if( o.config[0] !== undefined ) sc.density = o.config[0];
            if( o.config[1] !== undefined ) sc.friction = o.config[1];
            if( o.config[2] !== undefined ) sc.restitution = o.config[2];
            if( o.config[3] !== undefined ) sc.belongsTo = o.config[3];
            if( o.config[4] !== undefined ) sc.collidesWith = o.config[4];
        }


        /*if(o.massPos){
            o.massPos = o.massPos.map(function(x) { return x * invScale; });
            sc.relativePosition.set( o.massPos[0], o.massPos[1], o.massPos[2] );
        }
        if(o.massRot){
            o.massRot = o.massRot.map(function(x) { return x * degtorad; });
            sc.relativeRotation = _Math.EulerToMatrix( o.massRot[0], o.massRot[1], o.massRot[2] );
        }*/

        var position = new Vec3( p[0], p[1], p[2] );
        var rotation = new Quat().setFromEuler( r[0], r[1], r[2] );
        
        // rigidbody
        var body = new RigidBody( position, rotation, this.scale, this.invScale );

        // SHAPES

        var shape, n;

        for( var i = 0; i < type.length; i++ ){

            n = i * 3;

            if( p2[n] !== undefined ) sc.relativePosition.set( p2[n], p2[n+1], p2[n+2] );
            if( r2[n] !== undefined ) sc.relativeRotation.setQuat( new Quat().setFromEuler( r2[n], r2[n+1], r2[n+2] ) );
            
            switch( type[i] ){
                case "sphere": shape = new Sphere( sc, s[n] ); break;
                case "cylinder": shape = new Cylinder( sc, s[n], s[n+1] ); break;
                case "box": shape = new Box( sc, s[n], s[n+1], s[n+2] ); break;
                case "plane": shape = new Plane( sc ); break
            }

            body.addShape( shape );
            
        }

        // body can sleep or not
        if( o.neverSleep || kinematic) body.allowSleep = false;
        else body.allowSleep = true;

        body.isKinematic = kinematic;
        
        // body static or dynamic
        if( move ){

            if( o.massPos || o.massRot ) body.setupMass( BODY_DYNAMIC, false );
            else body.setupMass( BODY_DYNAMIC, true );

            

        } else {

            body.setupMass( BODY_STATIC );

        }
        
        if( o.name !== undefined ) body.name = o.name;
        //else if( o.move ) body.name = this.rigidBodies.length;

        
        // finaly add to physics world
        this.addRigidBody( body );

        // force sleep on not
        if( move ){
            if( o.sleep ) body.sleep();
            else body.awake();
        }

        return body;

    },

    initJoint: function( type, o ){

        var invScale = this.invScale;

        var axe1 = o.axe1 || [1,0,0];
        var axe2 = o.axe2 || [1,0,0];
        var pos1 = o.pos1 || [0,0,0];
        var pos2 = o.pos2 || [0,0,0];

        pos1 = pos1.map( function ( x ) { return x * invScale; } );
        pos2 = pos2.map( function ( x ) { return x * invScale; } );

        var min, max;
        if( type === "jointDistance" ){
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
        jc.localAxis1.set( axe1[0], axe1[1], axe1[2] );
        jc.localAxis2.set( axe2[0], axe2[1], axe2[2] );
        jc.localAnchorPoint1.set( pos1[0], pos1[1], pos1[2] );
        jc.localAnchorPoint2.set( pos2[0], pos2[1], pos2[2] );

        var b1 = null;
        var b2 = null;

        if( o.body1 === undefined || o.body2 === undefined ) return printError('World', "Can't add joint if attach rigidbodys not define !" );

        if ( o.body1.constructor === String ) { b1 = this.getByName( o.body1 ); }
        else if ( o.body1.constructor === Number ) { b1 = this.getByName( o.body1 ); }
        else if ( o.body1.constructor === RigidBody ) { b1 = o.body1; }

        if ( o.body2.constructor === String ) { b2 = this.getByName( o.body2 ); }
        else if ( o.body2.constructor === Number ) { b2 = this.getByName( o.body2 ); }
        else if ( o.body2.constructor === RigidBody ) { b2 = o.body2; }

        if( b1 === null || b2 === null ) return printError('World', "Can't add joint attach rigidbodys not find !" );

        jc.body1 = b1;
        jc.body2 = b2;

        var joint;
        switch( type ){
            case "jointDistance": joint = new DistanceJoint(jc, min, max); 
                if(spring !== null) joint.limitMotor.setSpring(spring[0], spring[1]);
                if(motor !== null) joint.limitMotor.setMotor(motor[0], motor[1]);
            break;
            case "jointHinge": case "joint": joint = new HingeJoint(jc, min, max);
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

    },


} );

export { World };