import { BR_NULL } from '../../constants';
import { printError } from '../../core/Utils';
import { Pair } from './Pair';

/**
* The broad-phase is used for collecting all possible pairs for collision.
*/

 function BroadPhase(){

    this.types = BR_NULL;
    this.numPairChecks = 0;
    this.numPairs = 0;
    this.pairs = [];

};

Object.assign( BroadPhase.prototype, {

    BroadPhase: true,

    // Create a new proxy.
    createProxy: function ( shape ) {

        printError("BroadPhase","Inheritance error.");

    },

    // Add the proxy into the broad-phase.
    addProxy: function ( proxy ) {

        printError("BroadPhase","Inheritance error.");
    },

    // Remove the proxy from the broad-phase.
    removeProxy: function ( proxy ) {

        printError("BroadPhase","Inheritance error.");

    },

    // Returns whether the pair is available or not.
    isAvailablePair: function ( s1, s2 ) {

        var b1 = s1.parent;
        var b2 = s2.parent;
        if( b1 == b2 || // same parents
            (!b1.isDynamic && !b2.isDynamic) || // static or kinematic object
            (s1.belongsTo&s2.collidesWith)==0 ||
            (s2.belongsTo&s1.collidesWith)==0 // collision filtering
        ){ return false; }
        var js;
        if(b1.numJoints<b2.numJoints) js = b1.jointLink;
        else js = b2.jointLink;
        while(js!==null){
           var joint = js.joint;
           if( !joint.allowCollision && ((joint.body1==b1 && joint.body2==b2) || (joint.body1==b2 && joint.body2==b1)) ){ return false; }
           js = js.next;
        }

        return true;

    },

    // Detect overlapping pairs.
    detectPairs: function () {

        // clear old
        this.pairs = [];
        this.numPairs = 0;
        this.numPairChecks = 0;
        this.collectPairs();

    },

    collectPairs: function () {

        Error("BroadPhase", "Inheritance error.");

    },

    addPair: function ( s1, s2 ) {

        var pair = new Pair( s1, s2 );
        this.pairs.push(pair);
        this.numPairs++;

    }

});

export { BroadPhase };