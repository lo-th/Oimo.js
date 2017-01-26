import { BODY_NULL, BODY_DYNAMIC, BODY_STATIC } from '../constants';
import { Error } from './Utils';

import { MassInfo } from '../collision/shape/MassInfo';
import { ShapeConfig } from '../collision/shape/ShapeConfig';

import { _Math } from '../math/Math';
import { Mat33 } from '../math/Mat33';
import { Quat } from '../math/Quat';
import { Vec3 } from '../math/Vec3';

import { BoxShape } from '../collision/shape/BoxShape';
import { SphereShape } from '../collision/shape/SphereShape';
import { CylinderShape } from '../collision/shape/CylinderShape';
//import { TetraShape } from '../collision/shape/TetraShape';

import { Contact } from '../constraint/contact/Contact';


/**
* The class of rigid body. 
* Rigid body has the shape of a single or multiple collision processing, 
* I can set the parameters individually.
* @author saharan
*/

function RigidBody ( x, y, z, rad, ax, ay, az, scale, invScale ) {

    this.scale = scale || 1;
    this.invScale = invScale || 1;

    this.name = "";
    // The maximum number of shapes that can be added to a one rigid.
    //this.MAX_SHAPES = 64;//64;

    this.prev = null;
    this.next = null;

    // I represent the kind of rigid body.
    // Please do not change from the outside this variable. 
    // If you want to change the type of rigid body, always 
    // Please specify the type you want to set the arguments of setupMass method.
    this.type = BODY_NULL;

    this.massInfo = new MassInfo();

    // It is the world coordinate of the center of gravity.
    this.position = new Vec3( x, y, z );

    this.orientation = new Quat().setFromAxis( rad || 0, ax || 0, ay || 0, az || 0 ); 
    //this.orientation = this.rotationAxisToQuad( rad || 0, ax || 0, ay || 0, az || 0 );


    this.newPosition = new Vec3();
    this.controlPos = false;
    this.newOrientation = new Quat();
    this.newRotation = new Vec3();
    this.currentRotation = new Vec3();
    this.controlRot = false;
    this.controlRotInTime = false;

    

    // Is the translational velocity.
    this.linearVelocity = new Vec3();
    // Is the angular velocity.
    this.angularVelocity = new Vec3();

    //--------------------------------------------
    //  Please do not change from the outside this variables.
    //--------------------------------------------

    // It is a world that rigid body has been added.
    this.parent = null;
    this.contactLink = null;
    this.numContacts = 0;

    // An array of shapes that are included in the rigid body.
    this.shapes = null;
    // The number of shapes that are included in the rigid body.
    this.numShapes = 0;

    // It is the link array of joint that is connected to the rigid body.
    this.jointLink = null;
    // The number of joints that are connected to the rigid body.
    this.numJoints = 0;

    // It is the world coordinate of the center of gravity in the sleep just before.
    this.sleepPosition = new Vec3();
    // It is a quaternion that represents the attitude of sleep just before.
    this.sleepOrientation = new Quat();
    // I will show this rigid body to determine whether it is a rigid body static.
    this.isStatic = false;
    // I indicates that this rigid body to determine whether it is a rigid body dynamic. 
    this.isDynamic = false;
    // It is a rotation matrix representing the orientation.
    this.rotation = new Mat33();

    //--------------------------------------------
    // It will be recalculated automatically from the shape, which is included.
    //--------------------------------------------
    
    // This is the weight. 
    this.mass = NaN;
    // It is the reciprocal of the mass.
    this.inverseMass = NaN;
    // It is the inverse of the inertia tensor in the world system.
    this.inverseInertia = new Mat33();
    // It is the inertia tensor in the initial state.
    this.localInertia = new Mat33();
    // It is the inverse of the inertia tensor in the initial state.
    this.inverseLocalInertia = new Mat33();


    // I indicates rigid body whether it has been added to the simulation Island.
    this.addedToIsland = false;
    // It shows how to sleep rigid body.
    this.allowSleep = true;
    // This is the time from when the rigid body at rest.
    this.sleepTime = 0;
    // I shows rigid body to determine whether it is a sleep state.
    this.sleeping = false;

}

Object.assign( RigidBody.prototype, {

    RigidBody: true,
    
    /**
    * I'll add a shape to rigid body.  
    * If you add a shape, please call the setupMass method to step up to the start of the next.
    * @param   shape shape to Add 
    */
    addShape:function(shape){

        if(shape.parent) Error("RigidBody", "It is not possible that you add to the multi-rigid body the shape of one");
        
        if(this.shapes!=null)( this.shapes.prev = shape ).next = this.shapes;
        this.shapes = shape;
        shape.parent = this;
        if(this.parent) this.parent.addShape( shape );
        this.numShapes++;

    },
    /**
    * I will delete the shape from the rigid body. 
    * If you delete a shape, please call the setupMass method to step up to the start of the next. 
    * @param   shape shape to Delete 
    */
    removeShape:function(shape){

        var remove = shape;
        if(remove.parent!=this)return;
        var prev=remove.prev;
        var next=remove.next;
        if(prev!=null) prev.next=next;
        if(next!=null) next.prev=prev;
        if(this.shapes==remove)this.shapes=next;
        remove.prev=null;
        remove.next=null;
        remove.parent=null;
        if(this.parent)this.parent.removeShape(remove);
        this.numShapes--;

    },

    remove: function () {

        this.dispose();

    },

    dispose: function () {

        this.parent.removeRigidBody( this );

    },

    checkContact: function( name ) {

        this.parent.checkContact( this.name, name );

    },

    /**
    * Calulates mass datas(center of gravity, mass, moment inertia, etc...).
    * If the parameter type is set to BODY_STATIC, the rigid body will be fixed to the space.
    * If the parameter adjustPosition is set to true, the shapes' relative positions and
    * the rigid body's position will be adjusted to the center of gravity.
    * @param   type
    * @param   adjustPosition
    */
    setupMass: function ( type, AdjustPosition ) {

        var adjustPosition = ( AdjustPosition !== undefined ) ? AdjustPosition : true;

        this.type = type || BODY_DYNAMIC;
        this.isDynamic = this.type === BODY_DYNAMIC;
        this.isStatic = this.type === BODY_STATIC;

        this.mass = 0;
        this.localInertia.set(0,0,0,0,0,0,0,0,0);


        var tmpM = new Mat33();
        var tmpV = new Vec3();

        for( var shape = this.shapes; shape !== null; shape = shape.next ){

            shape.calculateMassInfo( this.massInfo );
            var shapeMass = this.massInfo.mass;
            tmpV.addScale(shape.relativePosition, shapeMass);
            this.mass += shapeMass;
            this.rotateInertia( shape.relativeRotation, this.massInfo.inertia, tmpM );
            this.localInertia.addEqual( tmpM );

            // add offset inertia
            this.localInertia.addOffset( shapeMass, shape.relativePosition );

        }

        this.inverseMass = 1 / this.mass;
        tmpV.scaleEqual( this.inverseMass );

        if( adjustPosition ){
            this.position.addEqual(tmpV);
            for( shape=this.shapes; shape !== null; shape = shape.next ){
                shape.relativePosition.subEqual(tmpV);
            }

            // subtract offset inertia
            this.localInertia.subOffset( this.mass, tmpV );

        }

        this.inverseLocalInertia.invert( this.localInertia );

        //}

        if( this.type === BODY_STATIC ){
            this.inverseMass = 0;
            this.inverseLocalInertia.set(0,0,0,0,0,0,0,0,0);
        }

        this.syncShapes();
        this.awake();

    },
    /**
    * Awake the rigid body.
    */
    awake:function(){

        if( !this.allowSleep || !this.sleeping ) return;
        this.sleeping = false;
        this.sleepTime = 0;
        // awake connected constraints
        var cs = this.contactLink;
        while(cs != null){
            cs.body.sleepTime = 0;
            cs.body.sleeping = false;
            cs = cs.next;
        }
        var js = this.jointLink;
        while(js != null){
            js.body.sleepTime = 0;
            js.body.sleeping = false;
            js = js.next;
        }
        for(var shape = this.shapes; shape!=null; shape = shape.next){
            shape.updateProxy();
        }

    },
    /**
    * Sleep the rigid body.
    */
    sleep:function(){

        if( !this.allowSleep || this.sleeping ) return;

        this.linearVelocity.set(0,0,0);
        this.angularVelocity.set(0,0,0);
        this.sleepPosition.copy( this.position );
        this.sleepOrientation.copy( this.orientation );
        
        this.sleepTime = 0;
        this.sleeping = true;
        for( var shape = this.shapes; shape != null; shape = shape.next ) {
            shape.updateProxy();
        }
    },

    testWakeUp: function(){

        if( this.linearVelocity.testZero() || this.angularVelocity.testZero() || this.position.testDiff( this.sleepPosition ) || this.orientation.testDiff( this.sleepOrientation )) this.awake(); // awake the body

    },

    /**
    * Get whether the rigid body has not any connection with others.
    * @return
    */
    isLonely: function () {
        return this.numJoints==0 && this.numContacts==0;
    },

    /** 
    * The time integration of the motion of a rigid body, you can update the information such as the shape. 
    * This method is invoked automatically when calling the step of the World, 
    * There is no need to call from outside usually. 
    * @param  timeStep time 
    */

    updatePosition: function ( timeStep ) {
        switch(this.type){
            case BODY_STATIC:
                this.linearVelocity.set(0,0,0);
                this.angularVelocity.set(0,0,0);

                // ONLY FOR TEST
                if(this.controlPos){
                    this.position.copy(this.newPosition);
                    this.controlPos = false;
                }
                if(this.controlRot){
                    this.orientation.copy(this.newOrientation);
                    this.controlRot = false;
                }
                /*this.linearVelocity.x=0;
                this.linearVelocity.y=0;
                this.linearVelocity.z=0;
                this.angularVelocity.x=0;
                this.angularVelocity.y=0;
                this.angularVelocity.z=0;*/
            break;
            case BODY_DYNAMIC:

                if(this.controlPos){

                    this.angularVelocity.set(0,0,0);
                    this.linearVelocity.set(0,0,0);
                    this.linearVelocity.x = (this.newPosition.x - this.position.x)/timeStep;
                    this.linearVelocity.y = (this.newPosition.y - this.position.y)/timeStep;
                    this.linearVelocity.z = (this.newPosition.z - this.position.z)/timeStep;
                    this.controlPos = false;

                }
                if(this.controlRot){

                    this.angularVelocity.set(0,0,0);
                    this.orientation.copy( this.newOrientation );
                    this.controlRot = false;

                }

                this.position.addTime(this.linearVelocity, timeStep);
                this.orientation.addTime(this.angularVelocity, timeStep);

            break;
            default: Error("RigidBody", "Invalid type.");
        }

        this.syncShapes();

    },

    rotateInertia: function ( rot, inertia, out ) {

        var tm1 = rot.elements;
        var tm2 = inertia.elements;

        var a0 = tm1[0], a3 = tm1[3], a6 = tm1[6];
        var a1 = tm1[1], a4 = tm1[4], a7 = tm1[7];
        var a2 = tm1[2], a5 = tm1[5], a8 = tm1[8];

        var b0 = tm2[0], b3 = tm2[3], b6 = tm2[6];
        var b1 = tm2[1], b4 = tm2[4], b7 = tm2[7];
        var b2 = tm2[2], b5 = tm2[5], b8 = tm2[8];
        
        var e00 = a0*b0 + a1*b3 + a2*b6;
        var e01 = a0*b1 + a1*b4 + a2*b7;
        var e02 = a0*b2 + a1*b5 + a2*b8;
        var e10 = a3*b0 + a4*b3 + a5*b6;
        var e11 = a3*b1 + a4*b4 + a5*b7;
        var e12 = a3*b2 + a4*b5 + a5*b8;
        var e20 = a6*b0 + a7*b3 + a8*b6;
        var e21 = a6*b1 + a7*b4 + a8*b7;
        var e22 = a6*b2 + a7*b5 + a8*b8;

        var oe = out.elements;
        oe[0] = e00*a0 + e01*a1 + e02*a2;
        oe[1] = e00*a3 + e01*a4 + e02*a5;
        oe[2] = e00*a6 + e01*a7 + e02*a8;
        oe[3] = e10*a0 + e11*a1 + e12*a2;
        oe[4] = e10*a3 + e11*a4 + e12*a5;
        oe[5] = e10*a6 + e11*a7 + e12*a8;
        oe[6] = e20*a0 + e21*a1 + e22*a2;
        oe[7] = e20*a3 + e21*a4 + e22*a5;
        oe[8] = e20*a6 + e21*a7 + e22*a8;

    },

    syncShapes: function () {

        var s = this.orientation.w;
        var x = this.orientation.x;
        var y = this.orientation.y;
        var z = this.orientation.z;
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
        tr[0]=1-yy-zz;
        tr[1]=xy-sz;
        tr[2]=xz+sy;
        tr[3]=xy+sz;
        tr[4]=1-xx-zz;
        tr[5]=yz-sx;
        tr[6]=xz-sy;
        tr[7]=yz+sx;
        tr[8]=1-xx-yy;

        this.rotateInertia( this.rotation, this.inverseLocalInertia, this.inverseInertia );
        for(var shape = this.shapes; shape!=null; shape = shape.next){
            //var relPos=shape.relativePosition;
            //var relRot=shape.relativeRotation;
            //var rot=shape.rotation;
            /*var lx=relPos.x;
            var ly=relPos.y;
            var lz=relPos.z;
            shape.position.x=this.position.x+lx*tr[0]+ly*tr[1]+lz*tr[2];
            shape.position.y=this.position.y+lx*tr[3]+ly*tr[4]+lz*tr[5];
            shape.position.z=this.position.z+lx*tr[6]+ly*tr[7]+lz*tr[8];*/

            shape.position.mul( this.position, shape.relativePosition, this.rotation );
            //shape.rotation.mul(shape.relativeRotation,this.rotation);
            // add by QuaziKb
            shape.rotation.mul(this.rotation,shape.relativeRotation);
            shape.updateProxy();
        }
    },

    applyImpulse: function ( position, force ) {

        this.linearVelocity.addScale(force, this.inverseMass);
        var rel = new Vec3();
        rel.sub( position, this.position ).cross( rel, force ).mulMat( this.inverseInertia, rel );
        this.angularVelocity.addEqual( rel );
        
    },

    //---------------------------------------------
    //
    // FOR THREE JS
    //
    //---------------------------------------------

    rotationVectToQuad: function ( rot ) {

        var r = _Math.EulerToAxis( rot.x * _Math.degtorad, rot.y * _Math.degtorad, rot.z * _Math.degtorad );
        return new Quat().setFromAxis( r[0], r[1], r[2], r[3] );
        //return this.rotationAxisToQuad(r[0], r[1], r[2], r[3]);
    
    },

    /*rotationAxisToQuad: function ( rad, ax, ay, az ) { // in radian
        
        var len = ax*ax+ay*ay+az*az; 
        if(len>0){
            len=1/_Math.sqrt(len);
            ax*=len;
            ay*=len;
            az*=len;
        }
        var sin = _Math.sin( rad*0.5 );
        var cos = _Math.cos( rad*0.5 );
        return new Quat( sin*ax, sin*ay, sin*az, cos );
    
    },*/

    //---------------------------------------------
    // SET DYNAMIQUE POSITION AND ROTATION
    //---------------------------------------------

    setPosition: function ( pos ) {

        this.newPosition.copy( pos ).multiplyScalar( this.invScale );
        this.controlPos = true;
    
    },

    setQuaternion: function ( q ) { 
        //if(this.type == this.BODY_STATIC)this.orientation.init(q.w,q.x,q.y,q.z);

        this.newOrientation.set( q.x, q.y, q.z, q.w ); 
        this.controlRot = true;

    },

    setRotation: function ( rot ) {

        this.newOrientation = this.rotationVectToQuad( rot );
        this.controlRot = true;
    
    },

    //---------------------------------------------
    // RESET DYNAMIQUE POSITION AND ROTATION
    //---------------------------------------------

    resetPosition:function(x,y,z){

        this.linearVelocity.set( 0, 0, 0 );
        this.angularVelocity.set( 0, 0, 0 );
        this.position.set( x, y, z ).multiplyScalar( this.invScale );
        //this.position.set( x*OIMO.WorldScale.invScale, y*OIMO.WorldScale.invScale, z*OIMO.WorldScale.invScale );
        this.awake();
    },

    resetQuaternion:function( q ){

        this.angularVelocity.set(0,0,0);
        this.orientation = new Quat( q.x, q.y, q.z, q.w );
        this.awake();

    },
    
    resetRotation:function(x,y,z){

        this.angularVelocity.set(0,0,0);
        this.orientation = this.rotationVectToQuad( new Vec3(x,y,z) );
        this.awake();

    },

    //---------------------------------------------
    // GET POSITION AND ROTATION
    //---------------------------------------------

    getPosition:function () {

        return new Vec3().scale( this.position, this.scale );

    },

    getQuaternion: function () {

        return new Quat().setFromRotationMatrix( this.rotation );

    },

} );

export { RigidBody };