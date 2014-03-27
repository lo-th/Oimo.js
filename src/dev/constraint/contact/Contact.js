OIMO.Contact = function(){
    this.shape1=null;
    this.shape2=null;
    this.body1=null;
    this.body2=null;
    this.prev=null;
    this.next=null;
    this.persisting=false;
    this.sleeping=false;
    this.detector=null;
    this.constraint=null;
    this.touching=false;

    this.b1Link=new OIMO.ContactLink(this);
    this.b2Link=new OIMO.ContactLink(this);
    this.s1Link=new OIMO.ContactLink(this);
    this.s2Link=new OIMO.ContactLink(this);
    this.manifold=new OIMO.ContactManifold();
    this.buffer=[];// vector 4
    this.buffer.length = 4;
    this.buffer[0]=new OIMO.ImpulseDataBuffer();
    this.buffer[1]=new OIMO.ImpulseDataBuffer();
    this.buffer[2]=new OIMO.ImpulseDataBuffer();
    this.buffer[3]=new OIMO.ImpulseDataBuffer();
    this.points=this.manifold.points;
    this.constraint=new OIMO.ContactConstraint(this.manifold);
}
OIMO.Contact.prototype = {
    constructor: OIMO.Contact,

    mixRestitution:function(restitution1,restitution2){
        return Math.sqrt(restitution1*restitution2);
    },
    mixFriction:function(friction1,friction2){
        return Math.sqrt(friction1*friction2);
    },
    updateManifold:function(){
        this.constraint.restitution=this.mixRestitution(this.shape1.restitution,this.shape2.restitution);
        this.constraint.friction=this.mixFriction(this.shape1.friction,this.shape2.friction);
        var numBuffers=this.manifold.numPoints;
        for(var i=0;i<numBuffers;i++){
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
        for(i=0; i<num; i++){
            p=this.points[i];
            var lp1x=p.localPoint1.x;
            var lp1y=p.localPoint1.y;
            var lp1z=p.localPoint1.z;
            var lp2x=p.localPoint2.x;
            var lp2y=p.localPoint2.y;
            var lp2z=p.localPoint2.z;
            var index=-1;
            var minDistance=0.0004;
            for(var j=0;j<numBuffers;j++){
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
    detach:function(){
        var prev=this.s1Link.prev;
        var next=this.s1Link.next;
        if(prev!=null)prev.next=next;
        if(next!=null)next.prev=prev;
        if(this.shape1.contactLink==this.s1Link)this.shape1.contactLink=next;
        this.s1Link.prev=null;
        this.s1Link.next=null;
        this.s1Link.shape=null;
        this.s1Link.body=null;
        this.shape1.numContacts--;
        prev=this.s2Link.prev;
        next=this.s2Link.next;
        if(prev!=null)prev.next=next;
        if(next!=null)next.prev=prev;
        if(this.shape2.contactLink==this.s2Link)this.shape2.contactLink=next;
        this.s2Link.prev=null;
        this.s2Link.next=null;
        this.s2Link.shape=null;
        this.s2Link.body=null;
        this.shape2.numContacts--;
        prev=this.b1Link.prev;
        next=this.b1Link.next;
        if(prev!=null)prev.next=next;
        if(next!=null)next.prev=prev;
        if(this.body1.contactLink==this.b1Link)this.body1.contactLink=next;
        this.b1Link.prev=null;
        this.b1Link.next=null;
        this.b1Link.shape=null;
        this.b1Link.body=null;
        this.body1.numContacts--;
        prev=this.b2Link.prev;
        next=this.b2Link.next;
        if(prev!=null)prev.next=next;
        if(next!=null)next.prev=prev;
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
}