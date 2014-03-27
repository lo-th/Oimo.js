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