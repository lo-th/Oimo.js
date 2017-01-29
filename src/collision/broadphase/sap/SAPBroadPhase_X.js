import { BR_SWEEP_AND_PRUNE } from '../../../constants';
import { BroadPhase } from '../BroadPhase_X';
import { SAPAxis } from './SAPAxis';
import { SAPProxy } from './SAPProxy';

/**
 * A broad-phase collision detection algorithm using sweep and prune.
 *
 * @author saharan
 * @author lo-th
 */

function SAPBroadPhase () {

    BroadPhase.call( this);
    this.types = BR_SWEEP_AND_PRUNE;

    this.numElementsD = 0;
    this.numElementsS = 0;
    
    // dynamic proxies
    this.axesD = [
       new SAPAxis(),
       new SAPAxis(),
       new SAPAxis()
    ];

    // static or sleeping proxies
    this.axesS = [
       new SAPAxis(),
       new SAPAxis(),
       new SAPAxis()
    ];

    this.index1 = 0;
    this.index2 = 1;

};

SAPBroadPhase.prototype = Object.assign( Object.create( BroadPhase.prototype ), {

    constructor: SAPBroadPhase,

    createProxy: function ( shape ) {

        return new SAPProxy( this, shape );

    },

    addProxy: function ( proxy ) {

        var p = proxy;
        if(p.isDynamic()){
            this.axesD[0].addElements( p.min[0], p.max[0] );
            this.axesD[1].addElements( p.min[1], p.max[1] );
            this.axesD[2].addElements( p.min[2], p.max[2] );
            p.belongsTo = 1;
            this.numElementsD += 2;
        } else {
            this.axesS[0].addElements( p.min[0], p.max[0] );
            this.axesS[1].addElements( p.min[1], p.max[1] );
            this.axesS[2].addElements( p.min[2], p.max[2] );
            p.belongsTo = 2;
            this.numElementsS += 2;
        }

    },

    removeProxy: function ( proxy ) {

        var p = proxy;
        if ( p.belongsTo == 0 ) return;

        /*else if ( p.belongsTo == 1 ) {
            this.axesD[0].removeElements( p.min[0], p.max[0] );
            this.axesD[1].removeElements( p.min[1], p.max[1] );
            this.axesD[2].removeElements( p.min[2], p.max[2] );
            this.numElementsD -= 2;
        } else if ( p.belongsTo == 2 ) {
            this.axesS[0].removeElements( p.min[0], p.max[0] );
            this.axesS[1].removeElements( p.min[1], p.max[1] );
            this.axesS[2].removeElements( p.min[2], p.max[2] );
            this.numElementsS -= 2;
        }*/

        switch( p.belongsTo ){
            case 1:
            this.axesD[0].removeElements( p.min[0], p.max[0] );
            this.axesD[1].removeElements( p.min[1], p.max[1] );
            this.axesD[2].removeElements( p.min[2], p.max[2] );
            this.numElementsD -= 2;
            break;
            case 2:
            this.axesS[0].removeElements( p.min[0], p.max[0] );
            this.axesS[1].removeElements( p.min[1], p.max[1] );
            this.axesS[2].removeElements( p.min[2], p.max[2] );
            this.numElementsS -= 2;
            break;
        }

        p.belongsTo = 0;

    },

    collectPairs: function () {

        if( this.numElementsD == 0 ) return;

        var axis1 = this.axesD[this.index1];
        var axis2 = this.axesD[this.index2];

        axis1.sort();
        axis2.sort();

        var count1 = axis1.calculateTestCount();
        var count2 = axis2.calculateTestCount();
        var elementsD;
        var elementsS;
        if( count1 <= count2 ){// select the best axis
            axis2 = this.axesS[this.index1];
            axis2.sort();
            elementsD = axis1.elements;
            elementsS = axis2.elements;
        }else{
            axis1 = this.axesS[this.index2];
            axis1.sort();
            elementsD = axis2.elements;
            elementsS = axis1.elements;
            this.index1 ^= this.index2;
            this.index2 ^= this.index1;
            this.index1 ^= this.index2;
        }
        var activeD;
        var activeS;
        var p = 0;
        var q = 0;
        while( p < this.numElementsD ){
            var e1;
            var dyn;
            if (q == this.numElementsS ){
                e1 = elementsD[p];
                dyn = true;
                p++;
            }else{
                var d = elementsD[p];
                var s = elementsS[q];
                if( d.value < s.value ){
                    e1 = d;
                    dyn = true;
                    p++;
                }else{
                    e1 = s;
                    dyn = false;
                    q++;
                }
            }
            if( !e1.max ){
                var s1 = e1.proxy.shape;
                var min1 = e1.min1.value;
                var max1 = e1.max1.value;
                var min2 = e1.min2.value;
                var max2 = e1.max2.value;

                for( var e2 = activeD; e2 != null; e2 = e2.pair ) {// test for dynamic
                    var s2 = e2.proxy.shape;

                    this.numPairChecks++;
                    if( min1 > e2.max1.value || max1 < e2.min1.value || min2 > e2.max2.value || max2 < e2.min2.value || !this.isAvailablePair( s1, s2 ) ) continue;
                    this.addPair( s1, s2 );
                }
                if( dyn ){
                    for( e2 = activeS; e2 != null; e2 = e2.pair ) {// test for static
                        s2 = e2.proxy.shape;

                        this.numPairChecks++;

                        if( min1 > e2.max1.value || max1 < e2.min1.value|| min2 > e2.max2.value || max2 < e2.min2.value || !this.isAvailablePair(s1,s2) ) continue;
                        this.addPair( s1, s2 );
                    }
                    e1.pair = activeD;
                    activeD = e1;
                }else{
                    e1.pair = activeS;
                    activeS = e1;
                }
            }else{
                var min = e1.pair;
                if( dyn ){
                    if( min == activeD ){
                        activeD = activeD.pair;
                        continue;
                    }else{
                        e1 = activeD;
                    }
                }else{
                    if( min == activeS ){
                        activeS = activeS.pair;
                        continue;
                    }else{
                        e1 = activeS;
                    }
                }
                do{
                    e2 = e1.pair;
                    if( e2 == min ){
                        e1.pair = e2.pair;
                        break;
                    }
                    e1 = e2;
                }while( e1 != null );
            }
        }
        this.index2 = (this.index1|this.index2)^3;
        
    }

})

export { SAPBroadPhase };