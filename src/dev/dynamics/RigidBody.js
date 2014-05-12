OIMO.RigidBody = function(X,Y,Z,Rad,Ax,Ay,Az){
    var rad = Rad || 0;
    var ax = Ax || 0;
    var ay = Ay || 0;
    var az = Az || 0; 
    var x = X || 0;
    var y = Y || 0;
    var z = Z || 0;
    
    this.name = "";
    this.BODY_DYNAMIC=0x1;
    this.BODY_STATIC=0x2;
    this.MAX_SHAPES=64;
    this.prev=null;
    this.next=null;
    this.type=0;
    this.isDynamic=false;
    this.isStatic=false;
    this.position=null;
    this.mass=NaN;
    this.inverseMass=NaN;
    this.shapes=null;
    this.numShapes=0;
    this.parent=null;
    this.contactLink=null;
    this.numContacts=0;
    this.jointLink=null;
    this.numJoints=0;
    this.addedToIsland=false;
    this.sleeping=false;
    this.massInfo= new OIMO.MassInfo();

    this.position=new OIMO.Vec3(x,y,z); 

    var len=ax*ax+ay*ay+az*az; 
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
    this.inverseInertia=new OIMO.Mat33();
    this.localInertia=new OIMO.Mat33();
    this.inverseLocalInertia=new OIMO.Mat33();

    this.matrix = new OIMO.Mat44();

    this.allowSleep=true;
    this.sleepTime=0;
}

OIMO.RigidBody.prototype = {

    constructor: OIMO.RigidBody,

    addShape:function(shape){
        if(shape.parent){
            throw new Error("It is not possible that you add to the multi-rigid body the shape of one");
        }
        if(this.shapes!=null)(this.shapes.prev=shape).next=this.shapes;
        this.shapes=shape;
        shape.parent=this;
        if(this.parent)this.parent.addShape(shape);
        this.numShapes++;
    },
    removeShape:function(shape){
        var remove=shape;
        if(remove.parent!=this)return;
        var prev=remove.prev;
        var next=remove.next;
        if(prev!=null)prev.next=next;
        if(next!=null)next.prev=prev;
        if(this.shapes==remove)this.shapes=next;
        remove.prev=null;
        remove.next=null;
        remove.parent=null;
        if(this.parent)this.parent.removeShape(remove);
        this.numShapes--;
    },
    setupMass:function(Type,AdjustPosition){
        var adjustPosition = ( AdjustPosition !== undefined ) ? AdjustPosition : true;
        var type = Type || this.BODY_DYNAMIC;
        //var te = this.localInertia.elements;
        this.type=type;
        this.isDynamic=type==this.BODY_DYNAMIC;
        this.isStatic=type==this.BODY_STATIC;
        this.mass=0;
        this.localInertia.init(0,0,0,0,0,0,0,0,0);
        var te = this.localInertia.elements;
        //
        var tmpM=new OIMO.Mat33();
        var tmpV=new OIMO.Vec3();
        for(var shape=this.shapes;shape!=null;shape=shape.next){
            shape.calculateMassInfo(this.massInfo);
            var shapeMass=this.massInfo.mass;
            var relX=shape.relativePosition.x;
            var relY=shape.relativePosition.y;
            var relZ=shape.relativePosition.z;
            /*tmpV.x+=relX*shapeMass;
            tmpV.y+=relY*shapeMass;
            tmpV.z+=relZ*shapeMass;*/
            tmpV.addScale(shape.relativePosition, shapeMass);
            this.mass+=shapeMass;
            this.rotateInertia(shape.relativeRotation,this.massInfo.inertia,tmpM);
            this.localInertia.addEqual(tmpM);
            
            te[0]+=shapeMass*(relY*relY+relZ*relZ);
            te[4]+=shapeMass*(relX*relX+relZ*relZ);
            te[8]+=shapeMass*(relX*relX+relY*relY);
            var xy=shapeMass*relX*relY;
            var yz=shapeMass*relY*relZ;
            var zx=shapeMass*relZ*relX;
            te[1]-=xy;
            te[3]-=xy;
            te[2]-=yz;
            te[6]-=yz;
            te[5]-=zx;
            te[7]-=zx;
        }
        this.inverseMass=1/this.mass;
        tmpV.scaleEqual(this.inverseMass);
        if(adjustPosition){
            this.position.addEqual(tmpV);
            for(shape=this.shapes;shape!=null;shape=shape.next){
                shape.relativePosition.subEqual(tmpV);
            }
            relX=tmpV.x;
            relY=tmpV.y;
            relZ=tmpV.z;
            //var te = this.localInertia.elements;
            te[0]-=this.mass*(relY*relY+relZ*relZ);
            te[4]-=this.mass*(relX*relX+relZ*relZ);
            te[8]-=this.mass*(relX*relX+relY*relY);
            xy=this.mass*relX*relY;
            yz=this.mass*relY*relZ;
            zx=this.mass*relZ*relX;
            te[1]+=xy;
            te[3]+=xy;
            te[2]+=yz;
            te[6]+=yz;
            te[5]+=zx;
            te[7]+=zx;
        }
        this.inverseLocalInertia.invert(this.localInertia);
        if(type==this.BODY_STATIC){
            this.inverseMass=0;
            this.inverseLocalInertia.init(0,0,0,0,0,0,0,0,0);
        }
        this.syncShapes();
        this.awake();
    },
    awake:function(){
        if(!this.allowSleep||!this.sleeping)return;
        this.sleeping=false;
        this.sleepTime=0;
        var cs=this.contactLink;
        while(cs!=null){
            cs.body.sleepTime=0;
            cs.body.sleeping=false;
            cs=cs.next;
        }
        var js=this.jointLink;
        while(js!=null){
            js.body.sleepTime=0;
            js.body.sleeping=false;
            js=js.next;
        }
        for(var shape=this.shapes;shape!=null;shape=shape.next){
            shape.updateProxy();
        }
    },
    sleep:function(){
        if(!this.allowSleep||this.sleeping)return;
        this.linearVelocity.init();
        this.angularVelocity.init();
        this.sleepPosition.copy(this.position);
        this.sleepOrientation.copy(this.orientation);
        /*this.linearVelocity.x=0;
        this.linearVelocity.y=0;
        this.linearVelocity.z=0;
        this.angularVelocity.x=0;
        this.angularVelocity.y=0;
        this.angularVelocity.z=0;
        this.sleepPosition.x=this.position.x;
        this.sleepPosition.y=this.position.y;
        this.sleepPosition.z=this.position.z;*/
        /*this.sleepOrientation.s=this.orientation.s;
        this.sleepOrientation.x=this.orientation.x;
        this.sleepOrientation.y=this.orientation.y;
        this.sleepOrientation.z=this.orientation.z;*/
        
        this.sleepTime=0;
        this.sleeping=true;
        for(var shape=this.shapes;shape!=null;shape=shape.next){
            shape.updateProxy();
        }
    },
    isLonely:function(){
        return this.numJoints==0&&this.numContacts==0;
    },
    updatePosition:function(timeStep){
        switch(this.type){
            case this.BODY_STATIC:
                this.linearVelocity.init();
                this.angularVelocity.init();
                /*this.linearVelocity.x=0;
                this.linearVelocity.y=0;
                this.linearVelocity.z=0;
                this.angularVelocity.x=0;
                this.angularVelocity.y=0;
                this.angularVelocity.z=0;*/
            break;
            case this.BODY_DYNAMIC:
                this.position.addTime(this.linearVelocity, timeStep);
                /*var vx=this.linearVelocity.x;
                var vy=this.linearVelocity.y;
                var vz=this.linearVelocity.z;
                this.position.x+=vx*timeStep;
                this.position.y+=vy*timeStep;
                this.position.z+=vz*timeStep;*/

                this.orientation.addTime(this.angularVelocity, timeStep);
                
               /* var vx=this.angularVelocity.x;
                var vy=this.angularVelocity.y;
                var vz=this.angularVelocity.z;
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
                this.orientation.z=oz*s;*/

                
            break;
            default:
                throw new Error("Invalid type.");
        }
        this.syncShapes();
    },
    rotateInertia:function(rot,inertia,out){
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
        tr[0]=1-yy-zz;
        tr[1]=xy-sz;
        tr[2]=xz+sy;
        tr[3]=xy+sz;
        tr[4]=1-xx-zz;
        tr[5]=yz-sx;
        tr[6]=xz-sy;
        tr[7]=yz+sx;
        tr[8]=1-xx-yy;

        this.rotateInertia(this.rotation,this.inverseLocalInertia,this.inverseInertia);
        for(var shape=this.shapes;shape!=null;shape=shape.next){
            //var relPos=shape.relativePosition;
            //var relRot=shape.relativeRotation;
            //var rot=shape.rotation;
            /*var lx=relPos.x;
            var ly=relPos.y;
            var lz=relPos.z;
            shape.position.x=this.position.x+lx*tr[0]+ly*tr[1]+lz*tr[2];
            shape.position.y=this.position.y+lx*tr[3]+ly*tr[4]+lz*tr[5];
            shape.position.z=this.position.z+lx*tr[6]+ly*tr[7]+lz*tr[8];*/

            shape.position.mul(this.position,shape.relativePosition,this.rotation);
            shape.rotation.mul(shape.relativeRotation,this.rotation);
            shape.updateProxy();
        }
    },
    applyImpulse:function(position,force){
        this.linearVelocity.addScale(force, this.inverseMass);
        /*this.linearVelocity.x+=force.x*this.inverseMass;
        this.linearVelocity.y+=force.y*this.inverseMass;
        this.linearVelocity.z+=force.z*this.inverseMass;*/
        var rel=new OIMO.Vec3();
        rel.sub(position,this.position).cross(rel,force).mulMat(this.inverseInertia,rel);
        this.angularVelocity.addEqual(rel);
        /*this.angularVelocity.x+=rel.x;
        this.angularVelocity.y+=rel.y;
        this.angularVelocity.z+=rel.z;*/
    },


    // for three js
    setPosition:function(x,y,z){
        this.position.init(x*OIMO.INV_SCALE,y*OIMO.INV_SCALE,z*OIMO.INV_SCALE);
        this.linearVelocity.init();
        this.angularVelocity.init();
    },
    setOrientation:function(x,y,z){
        // angle in radian
        var r = OIMO.EulerToAxis(x, y, z);
        var rad = r[0], ax = r[1], ay = r[2], az = r[3];
        var len=ax*ax+ay*ay+az*az; 
        if(len>0){
            len=1/Math.sqrt(len);
            ax*=len;
            ay*=len;
            az*=len;
        }
        var sin=Math.sin(rad*0.5);
        var cos=Math.cos(rad*0.5);
        this.orientation = new OIMO.Quat(cos,sin*ax,sin*ay,sin*az);
        this.angularVelocity.init();
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