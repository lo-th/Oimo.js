OIMO.BruteForceBroadPhase = function(){
    OIMO.BroadPhase.call( this);
    this.types = 0x1;

    this.numProxies=0;
    this.proxyPool = [];// Vector
    this.proxyPool.length = OIMO.WORLD_MAX_SHAPES;
}
OIMO.BruteForceBroadPhase.prototype = Object.create( OIMO.BroadPhase.prototype );
OIMO.BruteForceBroadPhase.prototype.addProxy = function (proxy) {
    this.proxyPool[this.numProxies]=proxy;
    this.numProxies++;
}
OIMO.BruteForceBroadPhase.prototype.removeProxy = function (proxy) {
    var idx=-1;
    for(var i=0;i<this.numProxies;i++){
        if(this.proxyPool[i]==proxy){
        idx=i;
        break;
        }
    }
    if(idx==-1){
    return;
    }
    for(var j=idx;j<this.numProxies-1;j++){
    this.proxyPool[j]=this.proxyPool[j+1];
    }
    this.proxyPool[this.numProxies]=null;
    this.numProxies--;
}
OIMO.BruteForceBroadPhase.prototype.collectPairs = function () {
    this.numPairChecks=this.numProxies*(this.numProxies-1)>>1;
    for(var i=0;i<this.numProxies;i++){
    var p1=this.proxyPool[i];
    var s1=p1.parent;
    for(var j=i+1;j<this.numProxies;j++){
        var p2=this.proxyPool[j];
        var s2=p2.parent;
        if(
        p1.maxX<p2.minX||p1.minX>p2.maxX||
        p1.maxY<p2.minY||p1.minY>p2.maxY||
        p1.maxZ<p2.minZ||p1.minZ>p2.maxZ||
        !this.isAvailablePair(s1,s2)
        ){
        continue;
        }
        this.addPair(s1,s2);
        }
    }
}