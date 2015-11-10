/**
 * A broad-phase algorithm using dynamic bounding volume tree.
 * @author saharan
 * @author lo-th
 */

OIMO.DBVTBroadPhase = function(){

    OIMO.BroadPhase.call( this);
    this.types = OIMO.BR_BOUNDING_VOLUME_TREE;

    this.tree = new OIMO.DBVT();
    this.stack = [];
    this.leaves = [];
    this.numLeaves = 0;

};

OIMO.DBVTBroadPhase.prototype = Object.create( OIMO.BroadPhase.prototype );
OIMO.DBVTBroadPhase.prototype.constructor = OIMO.DBVTBroadPhase;

OIMO.DBVTBroadPhase.prototype.createProxy = function ( shape ) {

    return new OIMO.DBVTProxy(shape);

};

OIMO.DBVTBroadPhase.prototype.addProxy = function ( proxy ) {

    this.tree.insertLeaf( proxy.leaf );
    this.leaves.push( proxy.leaf );
    this.numLeaves++;

};

OIMO.DBVTBroadPhase.prototype.removeProxy = function ( proxy ) {

    this.tree.deleteLeaf( proxy.leaf );
    var n = this.leaves.indexOf( proxy.leaf );
    if ( n > -1 ) {
        this.leaves.splice(n,1);
        this.numLeaves--;
    }

};

OIMO.DBVTBroadPhase.prototype.collectPairs = function () {

    if ( this.numLeaves < 2 ) return;

    var leaf, margin = 0.1, i = this.numLeaves;

    while(i--){

        leaf = this.leaves[i];

        if ( leaf.proxy.aabb.intersectTestTwo( leaf.aabb ) ){

            leaf.aabb.copy( leaf.proxy.aabb, margin );
            this.tree.deleteLeaf( leaf );
            this.tree.insertLeaf( leaf );
            this.collide( leaf, this.tree.root );

        }
    }

};

OIMO.DBVTBroadPhase.prototype.collide = function ( node1, node2 ) {

    var stackCount = 2;
    var s1, s2, n1, n2, l1, l2;
    this.stack[0] = node1;
    this.stack[1] = node2;

    while( stackCount > 0 ){

        n1 = this.stack[--stackCount];
        n2 = this.stack[--stackCount];
        l1 = n1.proxy != null;
        l2 = n2.proxy != null;
        
        this.numPairChecks++;

        if( l1 && l2 ){
            s1 = n1.proxy.shape;
            s2 = n2.proxy.shape;
            if ( s1 == s2 || s1.aabb.intersectTest( s2.aabb ) || !this.isAvailablePair( s1, s2 ) ) continue;

            this.addPair(s1,s2);

        }else{

            if ( n1.aabb.intersectTest( n2.aabb ) ) continue;
            
            /*if(stackCount+4>=this.maxStack){// expand the stack
                //this.maxStack<<=1;
                this.maxStack*=2;
                var newStack = [];// vector
                newStack.length = this.maxStack;
                for(var i=0;i<stackCount;i++){
                    newStack[i] = this.stack[i];
                }
                this.stack = newStack;
            }*/

            if( l2 || !l1 && (n1.aabb.surfaceArea() > n2.aabb.surfaceArea()) ){
                this.stack[stackCount++] = n1.child1;
                this.stack[stackCount++] = n2;
                this.stack[stackCount++] = n1.child2;
                this.stack[stackCount++] = n2;
            }else{
                this.stack[stackCount++] = n1;
                this.stack[stackCount++] = n2.child1;
                this.stack[stackCount++] = n1;
                this.stack[stackCount++] = n2.child2;
            }
        }
    }

};