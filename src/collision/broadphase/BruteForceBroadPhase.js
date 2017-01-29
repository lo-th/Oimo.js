import { BR_BRUTE_FORCE } from '../../constants';
import { BroadPhase } from './BroadPhase';
import { BasicProxy } from './BasicProxy';

/**
* A broad-phase algorithm with brute-force search.
* This always checks for all possible pairs.
*/

function BruteForceBroadPhase(){

    BroadPhase.call( this );
    this.types = BR_BRUTE_FORCE;
    //this.numProxies=0;
    ///this.maxProxies = 256;
    this.proxies = [];
    //this.proxies.length = 256;

};


BruteForceBroadPhase.prototype = Object.assign( Object.create( BroadPhase.prototype ), {

    constructor: BruteForceBroadPhase,

    createProxy: function ( shape ) {

        return new BasicProxy( shape );

    },

    addProxy: function ( proxy ) {

        /*if(this.numProxies==this.maxProxies){
            //this.maxProxies<<=1;
            this.maxProxies*=2;
            var newProxies=[];
            newProxies.length = this.maxProxies;
            var i = this.numProxies;
            while(i--){
            //for(var i=0, l=this.numProxies;i<l;i++){
                newProxies[i]=this.proxies[i];
            }
            this.proxies=newProxies;
        }*/
        //this.proxies[this.numProxies++] = proxy;
        this.proxies.push( proxy );
        //this.numProxies++;

    },

    removeProxy: function ( proxy ) {

        var n = this.proxies.indexOf( proxy );
        if ( n > -1 ){
            this.proxies.splice( n, 1 );
            //this.numProxies--;
        }

        /*var i = this.numProxies;
        while(i--){
        //for(var i=0, l=this.numProxies;i<l;i++){
            if(this.proxies[i] == proxy){
                this.proxies[i] = this.proxies[--this.numProxies];
                this.proxies[this.numProxies] = null;
                return;
            }
        }*/

    },

    collectPairs: function () {

        var i = 0, j, p1, p2;

        var px = this.proxies;
        var l = px.length;//this.numProxies;
        //var ar1 = [];
        //var ar2 = [];

        //for( i = px.length ; i-- ; ar1[ i ] = px[ i ] ){};
        //for( i = px.length ; i-- ; ar2[ i ] = px[ i ] ){};

        //var ar1 = JSON.parse(JSON.stringify(this.proxies))
        //var ar2 = JSON.parse(JSON.stringify(this.proxies))

        this.numPairChecks = l*(l-1)>>1;
        //this.numPairChecks=this.numProxies*(this.numProxies-1)*0.5;

        while( i < l ){
            p1 = px[i++];
            j = i + 1;
            while( j < l ){
                p2 = px[j++];
                if ( p1.aabb.intersectTest( p2.aabb ) || !this.isAvailablePair( p1.shape, p2.shape ) ) continue;
                this.addPair( p1.shape, p2.shape );
            }
        }

    }

});

export { BruteForceBroadPhase };