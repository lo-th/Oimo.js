import { ContactLink } from './ContactLink';
import { ImpulseDataBuffer } from './ImpulseDataBuffer';
import { ContactManifold } from './ContactManifold';
import { ContactConstraint } from './ContactConstraint';
import { _Math } from '../../math/Math';
/**
* A contact is a pair of shapes whose axis-aligned bounding boxes are overlapping.
* @author saharan
*/

function Contact(){

    // The first shape.
    this.shape1 = null;
    // The second shape.
    this.shape2 = null;
    // The first rigid body.
    this.body1 = null;
    // The second rigid body.
    this.body2 = null;
    // The previous contact in the world.
    this.prev = null;
    // The next contact in the world.
    this.next = null;
    // Internal
    this.persisting = false;
    // Whether both the rigid bodies are sleeping or not.
    this.sleeping = false;
    // The collision detector between two shapes.
    this.detector = null;
    // The contact constraint of the contact.
    this.constraint = null;
    // Whether the shapes are touching or not.
    this.touching = false;
    // shapes is very close and touching 
    this.close = false;

    this.dist = _Math.INF;

    this.b1Link = new ContactLink( this );
    this.b2Link = new ContactLink( this );
    this.s1Link = new ContactLink( this );
    this.s2Link = new ContactLink( this );

    // The contact manifold of the contact.
    this.manifold = new ContactManifold();

    this.buffer = [

        new ImpulseDataBuffer(),
        new ImpulseDataBuffer(),
        new ImpulseDataBuffer(),
        new ImpulseDataBuffer()

    ];

    this.points = this.manifold.points;
    this.constraint = new ContactConstraint( this.manifold );
    
}

Object.assign( Contact.prototype, {

    Contact: true,

    mixRestitution: function ( restitution1, restitution2 ) {

        return _Math.sqrt(restitution1*restitution2);

    },
    mixFriction: function ( friction1, friction2 ) {

        return _Math.sqrt(friction1*friction2);

    },

    /**
    * Update the contact manifold.
    */
    updateManifold: function () {

        this.constraint.restitution =this.mixRestitution(this.shape1.restitution,this.shape2.restitution);
        this.constraint.friction=this.mixFriction(this.shape1.friction,this.shape2.friction);
        var numBuffers=this.manifold.numPoints;
        var i = numBuffers;
        while(i--){
        //for(var i=0;i<numBuffers;i++){
            var b = this.buffer[i];
            var p = this.points[i];
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
            this.touching = false;
            this.close = false;
            this.dist = _Math.INF;
            return;
        }

        if( this.touching || this.dist < 0.001 ) this.close = true;
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

                if( minDistance < this.dist ) this.dist = minDistance;

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
    attach:function(shape1,shape2){
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

        if(shape1.contactLink!=null)(this.s1Link.next=shape1.contactLink).prev=this.s1Link;
        else this.s1Link.next=null;
        shape1.contactLink=this.s1Link;
        shape1.numContacts++;

        if(shape2.contactLink!=null)(this.s2Link.next=shape2.contactLink).prev=this.s2Link;
        else this.s2Link.next=null;
        shape2.contactLink=this.s2Link;
        shape2.numContacts++;

        this.b1Link.shape=shape2;
        this.b1Link.body=this.body2;
        this.b2Link.shape=shape1;
        this.b2Link.body=this.body1;

        if(this.body1.contactLink!=null)(this.b1Link.next=this.body1.contactLink).prev=this.b1Link;
        else this.b1Link.next=null;
        this.body1.contactLink=this.b1Link;
        this.body1.numContacts++;

        if(this.body2.contactLink!=null)(this.b2Link.next=this.body2.contactLink).prev=this.b2Link;
        else this.b2Link.next=null;
        this.body2.contactLink=this.b2Link;
        this.body2.numContacts++;

        this.prev=null;
        this.next=null;

        this.persisting=true;
        this.sleeping=this.body1.sleeping&&this.body2.sleeping;
        this.manifold.numPoints=0;
    },
    /**
    * Detach the contact from the shapes.
    */
    detach:function(){
        var prev=this.s1Link.prev;
        var next=this.s1Link.next;
        if(prev!==null)prev.next=next;
        if(next!==null)next.prev=prev;
        if(this.shape1.contactLink==this.s1Link)this.shape1.contactLink=next;
        this.s1Link.prev=null;
        this.s1Link.next=null;
        this.s1Link.shape=null;
        this.s1Link.body=null;
        this.shape1.numContacts--;

        prev=this.s2Link.prev;
        next=this.s2Link.next;
        if(prev!==null)prev.next=next;
        if(next!==null)next.prev=prev;
        if(this.shape2.contactLink==this.s2Link)this.shape2.contactLink=next;
        this.s2Link.prev=null;
        this.s2Link.next=null;
        this.s2Link.shape=null;
        this.s2Link.body=null;
        this.shape2.numContacts--;

        prev=this.b1Link.prev;
        next=this.b1Link.next;
        if(prev!==null)prev.next=next;
        if(next!==null)next.prev=prev;
        if(this.body1.contactLink==this.b1Link)this.body1.contactLink=next;
        this.b1Link.prev=null;
        this.b1Link.next=null;
        this.b1Link.shape=null;
        this.b1Link.body=null;
        this.body1.numContacts--;

        prev=this.b2Link.prev;
        next=this.b2Link.next;
        if(prev!==null)prev.next=next;
        if(next!==null)next.prev=prev;
        if(this.body2.contactLink==this.b2Link)this.body2.contactLink=next;
        this.b2Link.prev=null;
        this.b2Link.next=null;
        this.b2Link.shape=null;
        this.b2Link.body=null;
        this.body2.numContacts--;

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

} );

export { Contact };