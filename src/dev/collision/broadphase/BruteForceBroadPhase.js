OIMO.BruteForceBroadPhase = function(){
    OIMO.BroadPhase.call( this);
    this.types = 0x1;
    this.numProxies=0;
    this.maxProxies = 256;
    this.proxies = [];// Vector !
    this.proxies.length = 256;
}

OIMO.BruteForceBroadPhase.prototype = Object.create( OIMO.BroadPhase.prototype );

OIMO.BruteForceBroadPhase.prototype.createProxy = function (shape) {
    return new OIMO.BasicProxy(shape);
}
OIMO.BruteForceBroadPhase.prototype.addProxy = function (proxy) {
    if(this.numProxies==this.maxProxies){
        //this.maxProxies<<=1;
        this.maxProxies*=2;
        var newProxies=[];
        var i = this.numProxies;
        while(i--){
        //for(var i=0, l=this.numProxies;i<l;i++){
            newProxies[i]=this.proxies[i];
        }
        this.proxies=newProxies;
    }
    this.proxies[this.numProxies++]=proxy;
}
OIMO.BruteForceBroadPhase.prototype.removeProxy = function (proxy) {
    for(var i=0, l=this.numProxies;i<l;i++){
        if(this.proxies[i]==proxy){
            this.proxies[i]=this.proxies[--this.numProxies];
            this.proxies[this.numProxies]=null;
            return;
        }
    }
}
OIMO.BruteForceBroadPhase.prototype.collectPairs = function () {
    this.numPairChecks=this.numProxies*(this.numProxies-1)>>1;
    //this.numPairChecks=this.numProxies*(this.numProxies-1)*0.5;
        var i = this.numProxies;
        while(i--){
        //for(var i=0, l=this.numProxies;i<l;i++){
            var p1=this.proxies[i];
            var b1=p1.aabb;
            var s1=p1.shape;
            var j = this.numProxies;
            while(j--){ if(j!==0){
            //for(var j=i+1, m=this.numProxies;j<m;j++){
                var p2=this.proxies[j];
                var b2=p2.aabb;
                var s2=p2.shape;
                if(b1.maxX<b2.minX||b1.minX>b2.maxX|| b1.maxY<b2.minY||b1.minY>b2.maxY|| b1.maxZ<b2.minZ||b1.minZ>b2.maxZ|| !this.isAvailablePair(s1,s2) ){
                    continue;
                }
                    this.addPair(s1,s2);
                }}
        }
}