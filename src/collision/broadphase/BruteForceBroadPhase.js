/**
* A broad-phase algorithm with brute-force search.
* This always checks for all possible pairs.
*/
OIMO.BruteForceBroadPhase = function(){

    OIMO.BroadPhase.call(this);
    this.types = 0x1;
    this.numProxies = 0;
    this.proxies = [];

};

OIMO.BruteForceBroadPhase.prototype = Object.create( OIMO.BroadPhase.prototype );

OIMO.BruteForceBroadPhase.prototype.createProxy = function (shape) {

    return new OIMO.BasicProxy(shape);

};

OIMO.BruteForceBroadPhase.prototype.addProxy = function (proxy) {

    this.proxies.push(proxy);
    this.numProxies++;

};

OIMO.BruteForceBroadPhase.prototype.removeProxy = function (proxy) {

    var n = this.proxies.indexOf(proxy);
    if(n > -1){
        this.proxies.splice(n,1);
        this.numProxies--;
    }
    
};

OIMO.BruteForceBroadPhase.prototype.collectPairs = function () {

    var i, j, p1, p2;//, b1, s1,  b2, s2; 

    this.numPairChecks = OIMO.int(this.numProxies*(this.numProxies-1)*0.5);
    i = this.numProxies;
    while(i--){
        p1 = this.proxies[i];
        //b1 = p1.aabb;
        //s1 = p1.shape;
        j = this.numProxies;
        while(j!==i){ 
            j--;
            p2 = this.proxies[j];
            //b2 = p2.aabb;
            //s2 = p2.shape;
            if(
                p1.aabb.maxX < p2.aabb.minX || p1.aabb.minX > p2.aabb.maxX || 
                p1.aabb.maxY < p2.aabb.minY || p1.aabb.minY > p2.aabb.maxY || 
                p1.aabb.maxZ < p2.aabb.minZ || p1.aabb.minZ > p2.aabb.maxZ || 
                !this.isAvailablePair(p1.shape,p2.shape) ) continue;
            //if(b1.maxX<b2.minX || b1.minX>b2.maxX || b1.maxY<b2.minY || b1.minY>b2.maxY || b1.maxZ<b2.minZ || b1.minZ>b2.maxZ || !this.isAvailablePair(s1,s2) ) continue;
            //addPair(s1, s2);
            this.addPair(p1.shape,p2.shape);
        }
    }

};