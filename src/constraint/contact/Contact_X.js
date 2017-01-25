import { ContactLink } from './ContactLink';
import { ImpulseDataBuffer } from './ImpulseDataBuffer';
import { ContactManifold } from './ContactManifold';
import { ContactConstraint } from './ContactConstraint_X';
import { _Math } from '../../math/Math';
/**
* A contact is a pair of shapes whose axis-aligned bounding boxes are overlapping.
* @author saharan
*/

function Contact(){

    // The first shape.
    this.shape1=null;
    // The second shape.
    this.shape2=null;
    // The first rigid body.
    this.body1=null;
    // The second rigid body.
    this.body2=null;
    // Internal
    this.persisting=false;
    // Whether both the rigid bodies are sleeping or not.
    this.sleeping=false;
    // The collision detector between two shapes.
    this.detector=null;
    // The contact constraint of the contact.
    this.constraint=null;
    // Whether the shapes are touching or not.
    this.touching=false;

    this.b1Link=new ContactLink(this);
    this.b2Link=new ContactLink(this);
    this.s1Link=new ContactLink(this);
    this.s2Link=new ContactLink(this);
    // The contact manifold of the contact.
    this.manifold=new ContactManifold();
    this.buffer=[];// vector 4
    this.buffer.length = 4;
    this.buffer[0]=new ImpulseDataBuffer();
    this.buffer[1]=new ImpulseDataBuffer();
    this.buffer[2]=new ImpulseDataBuffer();
    this.buffer[3]=new ImpulseDataBuffer();
    this.points=this.manifold.points;
    this.constraint=new ContactConstraint(this.manifold);
}

Contact.prototype = {

    constructor: Contact,

    mixRestitution:function(restitution1,restitution2){
        return _Math.sqrt(restitution1*restitution2);
    },
    mixFriction:function(friction1,friction2){
        return _Math.sqrt(friction1*friction2);
    },
    /**
    * Update the contact manifold.
    */
    updateManifold:function(){
        this.constraint.restitution=this.mixRestitution(this.shape1.restitution,this.shape2.restitution);
        this.constraint.friction=this.mixFriction(this.shape1.friction,this.shape2.friction);
        var numBuffers=this.manifold.numPoints;
        var i = numBuffers;
        while(i--){
        //for(var i=0;i<numBuffers;i++){
            var b=this.buffer[i];
            var p=this.points[i];
            b.lp1X=p.localPoint1.x;
            b.lp1Y=p.localPoint1.y;
            b.lp1Z=p.localPoint1.z;
            b.lp2X=p.localPoint2.x;
            b.lp2Y=p.localPoint2.y;
            b.lp2Z=p.localPoint2.z;
            b.impulse=p.normalImpulse;
        }
        this.manifold.numPoints=0;
        this.detector.detectCollision(this.shape1,this.shape2,this.manifold);
        var num=this.manifold.numPoints;
        if(num==0){
            this.touching=false;
            return;
        }
        this.touching=true;
        i = num;
        while(i--){
        //for(i=0; i<num; i++){
            p=this.points[i];
            var lp1x=p.localPoint1.x;
            var lp1y=p.localPoint1.y;
            var lp1z=p.localPoint1.z;
            var lp2x=p.localPoint2.x;
            var lp2y=p.localPoint2.y;
            var lp2z=p.localPoint2.z;
            var index=-1;
            var minDistance=0.0004;
            var j = numBuffers;
            while(j--){
            //for(var j=0;j<numBuffers;j++){
                b=this.buffer[j];
                var dx=b.lp1X-lp1x;
                var dy=b.lp1Y-lp1y;
                var dz=b.lp1Z-lp1z;
                var distance1=dx*dx+dy*dy+dz*dz;
                dx=b.lp2X-lp2x;
                dy=b.lp2Y-lp2y;
                dz=b.lp2Z-lp2z;
                var distance2=dx*dx+dy*dy+dz*dz;
                if(distance1<distance2){
                    if(distance1<minDistance){
                        minDistance=distance1;
                        index=j;
                    }
                }else{
                    if(distance2<minDistance){
                        minDistance=distance2;
                        index=j;
                    }
                }
            }
            if(index!=-1){
                var tmp=this.buffer[index];
                this.buffer[index]=this.buffer[--numBuffers];
                this.buffer[numBuffers]=tmp;
                p.normalImpulse=tmp.impulse;
                p.warmStarted=true;
            }else{
                p.normalImpulse=0;
                p.warmStarted=false;
            }
        }
    },
    /**
    * Attach the contact to the shapes.
    * @param   shape1
    * @param   shape2
    */
    attach:function( shape1, shape2 ){

        this.shape1=shape1;
        this.shape2=shape2;
        this.body1=shape1.parent;
        this.body2=shape2.parent;

        this.manifold.body1=this.body1;
        this.manifold.body2=this.body2;
        this.constraint.body1=this.body1;
        this.constraint.body2=this.body2;
        this.constraint.attach();

        this.s1Link.shape=shape2;
        this.s1Link.body=this.body2;
        this.s2Link.shape=shape1;
        this.s2Link.body=this.body1;

        this.shape1.contactLink.push( this.s1Link );
        this.shape2.contactLink.push( this.s2Link );

        this.b1Link.shape=shape2;
        this.b1Link.body=this.body2;
        this.b2Link.shape=shape1;
        this.b2Link.body=this.body1;

        this.body1.contactLink.push( this.b1Link );
        this.body2.contactLink.push( this.b2Link );

        //this.prev=null;
        //this.next=null;

        this.persisting=true;
        this.sleeping = this.body1.sleeping && this.body2.sleeping;
        this.manifold.numPoints = 0;

    },
    /**
    * Detach the contact from the shapes.
    */
    detach:function(){

        this.shape1.contactLink.splice( this.shape1.contactLink.indexOf(this.s1Link ), 1 );
        this.shape2.contactLink.splice( this.shape2.contactLink.indexOf(this.s2Link ), 1 );

        this.body1.contactLink.splice( this.body1.contactLink.indexOf(this.b1Link ), 1 );
        this.body2.contactLink.splice( this.body2.contactLink.indexOf(this.b2Link ), 1 );

        this.s1Link.shape=null;
        this.s1Link.body=null;
        this.s2Link.shape=null;
        this.s2Link.body=null;
        this.b1Link.shape=null;
        this.b1Link.body=null;
        this.b2Link.shape=null;
        this.b2Link.body=null;

        this.manifold.body1=null;
        this.manifold.body2=null;
        this.constraint.body1=null;
        this.constraint.body2=null;
        this.constraint.detach();

        this.shape1=null;
        this.shape2=null;
        this.body1=null;
        this.body2=null;
        
    }
}

export { Contact };