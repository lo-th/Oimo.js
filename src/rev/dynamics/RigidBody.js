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

    this.position=new OIMO.Vec3();
    this.newPosition = new OIMO.Vec3(0,0,0);
    this.controlPos = false;

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
            if(this.controlPos){
                this.angularVelocity.init();
                this.linearVelocity.x = (this.newPosition.x - this.position.x)/timeStep;
                this.linearVelocity.y = (this.newPosition.y - this.position.y)/timeStep;
                this.linearVelocity.z = (this.newPosition.z - this.position.z)/timeStep;
            }
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
    moveTo:function(pos){
        this.newPosition.init(pos.x*OIMO.INV_SCALE,pos.y*OIMO.INV_SCALE,pos.z*OIMO.INV_SCALE);
        this.controlPos = true;
    },
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