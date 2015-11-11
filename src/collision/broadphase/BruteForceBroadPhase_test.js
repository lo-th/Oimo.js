/**
 * A broad-phase algorithm with brute-force search.
 * This always checks for all possible pairs.
 * @author saharan
 * @author lo-th
 */

OIMO.BruteForceBroadPhase = function(){

    OIMO.BroadPhase.call(this);
    this.types = OIMO.BR_BRUTE_FORCE;
    //this.numProxies = 0;
    //this.proxies = [];
    this.proxies = new OIMO.Dictionary();

};

OIMO.BruteForceBroadPhase.prototype = Object.create( OIMO.BroadPhase.prototype );
OIMO.BruteForceBroadPhase.prototype.constructor = OIMO.BruteForceBroadPhase;

OIMO.BruteForceBroadPhase.prototype.createProxy = function ( shape ) {

    return new OIMO.BasicProxy( shape );

};

OIMO.BruteForceBroadPhase.prototype.addProxy = function ( proxy ) {

    //this.proxies.push( proxy );
    //this.numProxies++;

    

    this.proxies.set( proxy );
    //this.numProxies++;
    

};

OIMO.BruteForceBroadPhase.prototype.removeProxy = function ( proxy ) {

    this.proxies.del( proxy );
    //this.numProxies--;

    /*var n = this.proxies.indexOf( proxy );
    if ( n > -1 ){
        this.proxies.splice(n,1);
        this.numProxies--;
    }*/
    
};

OIMO.BruteForceBroadPhase.prototype.collectPairs = function () {

    var i = 0, j, p1, p2;
    var px = this.proxies;
    var data = px.data;
    var k = px.keys;
    var l = k.length;

    this.numPairChecks = l*(l-1)>>1;

    //this.numPairChecks = OIMO.int( this.numProxies*(this.numProxies-1)*0.5 );


    while( i < l ){
        p1 = px.get(k[i++]);//data[px[i++]];
        j = i + 1;
        while( j < l ){ 
            p2 = px.get(k[j++]);//data[px[j++]];
            if ( p1.aabb.intersectTest( p2.aabb ) || !this.isAvailablePair( p1.shape, p2.shape ) ) continue;
            this.addPair( p1.shape, p2.shape );        
        }     
    }

    /*var n = 0;

    for( i in this.proxies.data ){
        p1 = this.proxies.data[i];
        n ++;
        //p2 = this.proxies.data[i+1];

        //if(p2!==undefined){





        for( j in this.proxies.data ){
            p2 = this.proxies.data[j];
            if(j > n){
                if ( p1.aabb.intersectTest( p2.aabb ) || !this.isAvailablePair( p1.shape, p2.shape ) ) continue;
                this.addPair( p1.shape, p2.shape );
            }
        }
    }*/




    /*i = this.numProxies;
    while(i--){
        p1 = this.proxies[i];
        j = this.numProxies;
        while(j!==i){ 
            j--;
            p2 = this.proxies[j];
            if ( p1.aabb.intersectTest( p2.aabb ) || !this.isAvailablePair( p1.shape, p2.shape ) ) continue;
            this.addPair( p1.shape, p2.shape );
        }
    }*/

};