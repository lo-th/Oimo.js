/**
* The broad-phase is used for collecting all possible pairs for collision.
*/

OIMO.BroadPhase = function(){
    this.types = 0x0;
    this.numPairChecks=0;
    this.numPairs=0;
    
    this.bufferSize=256;
    this.pairs=[];// vector
    this.pairs.length = this.bufferSize;
    var i = this.bufferSize;
    while(i--){
        this.pairs[i] = new OIMO.Pair();
    }
}

OIMO.BroadPhase.prototype = {

    constructor: OIMO.BroadPhase,
    /**
    * Create a new proxy.
    * @param   shape
    * @return
    */
    createProxy:function(shape){
        throw new Error("Inheritance error.");
    },
    /**
    * Add the proxy into the broad-phase.
    * @param   proxy
    */
    addProxy:function(proxy){
        throw new Error("Inheritance error.");
    },
    /**
    * Remove the proxy from the broad-phase.
    * @param   proxy
    */
    removeProxy:function(proxy){
        throw new Error("Inheritance error.");
    },
    /**
    * Returns whether the pair is available or not.
    * @param   s1
    * @param   s2
    * @return
    */
    isAvailablePair:function(s1,s2){
        var b1=s1.parent;
        var b2=s2.parent;
        if( b1==b2 || // same parents 
            (!b1.isDynamic&&!b2.isDynamic) || // static or kinematic object
            (s1.belongsTo&s2.collidesWith)==0 ||
             (s2.belongsTo&s1.collidesWith)==0 // collision filtering
        ){ return false; }
        var js;
        if(b1.numJoints<b2.numJoints) js=b1.jointLink;
        else js=b2.jointLink;
        while(js!=null){
           var joint=js.joint;
           if( !joint.allowCollision && (joint.body1==b1&&joint.body2==b2|| joint.body1==b2&&joint.body2==b1) ){ return false; }
           js=js.next;
        }
        return true;
    },
    // Detect overlapping pairs.
    detectPairs:function(){
        while(this.numPairs>0){
            var pair=this.pairs[--this.numPairs];
            pair.shape1=null;
            pair.shape2=null;
        }
        this.numPairChecks=0;
        this.collectPairs();
    },
    collectPairs:function(){
        throw new Error("Inheritance error.");
    },
    addPair:function(s1,s2){
        if(this.numPairs==this.bufferSize){ // expand pair buffer
            var newBufferSize=this.bufferSize<<1;
            //var newBufferSize=this.bufferSize*2;
            var newPairs=[];// vector
            newPairs.length = this.bufferSize;
            var i = this.bufferSize;
            var j;
            while(i--){
            //for(var i=0, j=this.bufferSize;i<j;i++){
                newPairs[i]=this.pairs[i];
            }
            i = this.newBufferSize;
            //j = this.bufferSize;
            //while(i-- >= j){
            for(i=this.bufferSize, j=newBufferSize;i<j;i++){
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