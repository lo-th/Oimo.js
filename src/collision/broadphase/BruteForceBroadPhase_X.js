import { BR_BRUTE_FORCE } from '../../constants';
import { BroadPhase } from './BroadPhase_X';
import { BasicProxy } from './BasicProxy';

/**
* A broad-phase algorithm with brute-force search.
* This always checks for all possible pairs.
*/

function BruteForceBroadPhase(){

    BroadPhase.call( this );

    this.types = BR_BRUTE_FORCE;
    this.proxies = [];

};

BruteForceBroadPhase.prototype = Object.assign( Object.create( BroadPhase.prototype ), {

    constructor: BruteForceBroadPhase,

    createProxy: function ( shape ) {

        return new BasicProxy( shape );

    },

    addProxy: function ( proxy ) {

        this.proxies.push( proxy );

    },

    removeProxy: function ( proxy ) {

        var n = this.proxies.indexOf( proxy );
        if ( n > -1 )  this.proxies.splice( n, 1 );

    },

    collectPairs: function () {
        
        var i = 0, j, p1, p2;

        var px = this.proxies;
        var l = px.length;

        this.numPairChecks = l*(l-1)>>1;

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