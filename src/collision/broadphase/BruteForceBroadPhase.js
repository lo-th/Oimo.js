/**
 * A broad-phase algorithm with brute-force search.
 * This always checks for all possible pairs.
 * @author saharan
 * @author lo-th
 */

OIMO.BruteForceBroadPhase = function(){

    OIMO.BroadPhase.call(this);
    this.types = OIMO.BR_BRUTE_FORCE;
    this.numProxies = 0;
    this.proxies = [];

};

OIMO.BruteForceBroadPhase.prototype = Object.create( OIMO.BroadPhase.prototype );
OIMO.BruteForceBroadPhase.prototype.constructor = OIMO.BruteForceBroadPhase;

OIMO.BruteForceBroadPhase.prototype.createProxy = function ( shape ) {

    return new OIMO.BasicProxy(shape);

};

OIMO.BruteForceBroadPhase.prototype.addProxy = function ( proxy ) {

    this.proxies.push( proxy );
    this.numProxies++;

};

OIMO.BruteForceBroadPhase.prototype.removeProxy = function ( proxy ) {

    var n = this.proxies.indexOf( proxy );
    if ( n > -1 ){
        this.proxies.splice(n,1);
        this.numProxies--;
    }
    
};

OIMO.BruteForceBroadPhase.prototype.collectPairs = function () {

    var i, j, p1, p2;

    this.numPairChecks = OIMO.int( this.numProxies*(this.numProxies-1)*0.5 );
    i = this.numProxies;
    while(i--){
        p1 = this.proxies[i];
        j = this.numProxies;
        while(j!==i){ 
            j--;
            p2 = this.proxies[j];
            if ( p1.aabb.intersectTest( p2.aabb ) || !this.isAvailablePair( p1.shape, p2.shape ) ) continue;
            this.addPair( p1.shape, p2.shape );
        }
    }

};