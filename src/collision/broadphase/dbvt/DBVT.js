import { AABB } from '../../../math/AABB';
import { DBVTNode } from './DBVTNode';

/**
 * A dynamic bounding volume tree for the broad-phase algorithm.
 *
 * @author saharan
 * @author lo-th
 */

function DBVT(){

    // The root of the tree.
    this.root = null;
    this.freeNodes = [];
    this.freeNodes.length = 16384;
    this.numFreeNodes = 0;
    this.aabb = new AABB();

};

Object.assign( DBVT.prototype, {

    DBVT: true,

    moveLeaf: function( leaf ) {

        this.deleteLeaf( leaf );
        this.insertLeaf( leaf );
    
    },

    insertLeaf: function ( leaf ) {

        if(this.root == null){
            this.root = leaf;
            return;
        }
        var lb = leaf.aabb;
        var sibling = this.root;
        var oldArea;
        var newArea;
        while(sibling.proxy == null){ // descend the node to search the best pair
            var c1 = sibling.child1;
            var c2 = sibling.child2;
            var b = sibling.aabb;
            var c1b = c1.aabb;
            var c2b = c2.aabb;
            oldArea = b.surfaceArea();
            this.aabb.combine(lb,b);
            newArea = this.aabb.surfaceArea();
            var creatingCost = newArea*2;
            var incrementalCost = (newArea-oldArea)*2; // cost of creating a new pair with the node
            var discendingCost1 = incrementalCost;
            this.aabb.combine(lb,c1b);
            if(c1.proxy!=null){
                // leaf cost = area(combined aabb)
                discendingCost1+=this.aabb.surfaceArea();
            }else{
                // node cost = area(combined aabb) - area(old aabb)
                discendingCost1+=this.aabb.surfaceArea()-c1b.surfaceArea();
            }
            var discendingCost2=incrementalCost;
            this.aabb.combine(lb,c2b);
            if(c2.proxy!=null){
                // leaf cost = area(combined aabb)
                discendingCost2+=this.aabb.surfaceArea();
            }else{
                // node cost = area(combined aabb) - area(old aabb)
                discendingCost2+=this.aabb.surfaceArea()-c2b.surfaceArea();
            }
            if(discendingCost1<discendingCost2){
                if(creatingCost<discendingCost1){
                    break;// stop descending
                }else{
                    sibling = c1;// descend into first child
                }
            }else{
                if(creatingCost<discendingCost2){
                    break;// stop descending
                }else{
                    sibling = c2;// descend into second child
                }
            }
        }
        var oldParent = sibling.parent;
        var newParent;
        if(this.numFreeNodes>0){
            newParent = this.freeNodes[--this.numFreeNodes];
        }else{
            newParent = new DBVTNode();
        }

        newParent.parent = oldParent;
        newParent.child1 = leaf;
        newParent.child2 = sibling;
        newParent.aabb.combine(leaf.aabb,sibling.aabb);
        newParent.height = sibling.height+1;
        sibling.parent = newParent;
        leaf.parent = newParent;
        if(sibling == this.root){
            // replace root
            this.root = newParent;
        }else{
            // replace child
            if(oldParent.child1 == sibling){
                oldParent.child1 = newParent;
            }else{
                oldParent.child2 = newParent;
            }
        }
        // update whole tree
        do{
            newParent = this.balance(newParent);
            this.fix(newParent);
            newParent = newParent.parent;
        }while(newParent != null);
    },

    getBalance: function( node ) {

        if(node.proxy!=null)return 0;
        return node.child1.height-node.child2.height;

    },

    deleteLeaf: function( leaf ) {

        if(leaf == this.root){
            this.root = null;
            return;
        }
        var parent = leaf.parent;
        var sibling;
        if(parent.child1==leaf){
            sibling=parent.child2;
        }else{
            sibling=parent.child1;
        }
        if(parent==this.root){
            this.root=sibling;
            sibling.parent=null;
            return;
        }
        var grandParent = parent.parent;
        sibling.parent = grandParent;
        if(grandParent.child1 == parent ) {
            grandParent.child1 = sibling;
        }else{
            grandParent.child2 = sibling;
        }
        if(this.numFreeNodes<16384){
            this.freeNodes[this.numFreeNodes++] = parent;
        }
        do{
            grandParent = this.balance(grandParent);
            this.fix(grandParent);
            grandParent = grandParent.parent;
        }while( grandParent != null );
    
    },

    balance: function( node ) {

        var nh = node.height;
        if(nh<2){
            return node;
        }
        var p = node.parent;
        var l = node.child1;
        var r = node.child2;
        var lh = l.height;
        var rh = r.height;
        var balance = lh-rh;
        var t;// for bit operation

        //          [ N ]
        //         /     \
        //    [ L ]       [ R ]
        //     / \         / \
        // [L-L] [L-R] [R-L] [R-R]

        // Is the tree balanced?
        if(balance>1){
            var ll = l.child1;
            var lr = l.child2;
            var llh = ll.height;
            var lrh = lr.height;

            // Is L-L higher than L-R?
            if(llh>lrh){
                // set N to L-R
                l.child2 = node;
                node.parent = l;

                //          [ L ]
                //         /     \
                //    [L-L]       [ N ]
                //     / \         / \
                // [...] [...] [ L ] [ R ]
                
                // set L-R
                node.child1 = lr;
                lr.parent = node;

                //          [ L ]
                //         /     \
                //    [L-L]       [ N ]
                //     / \         / \
                // [...] [...] [L-R] [ R ]
                
                // fix bounds and heights
                node.aabb.combine( lr.aabb, r.aabb );
                t = lrh-rh;
                node.height=lrh-(t&t>>31)+1;
                l.aabb.combine(ll.aabb,node.aabb);
                t=llh-nh;
                l.height=llh-(t&t>>31)+1;
            }else{
                // set N to L-L
                l.child1=node;
                node.parent=l;

                //          [ L ]
                //         /     \
                //    [ N ]       [L-R]
                //     / \         / \
                // [ L ] [ R ] [...] [...]
                
                // set L-L
                node.child1 = ll;
                ll.parent = node;

                //          [ L ]
                //         /     \
                //    [ N ]       [L-R]
                //     / \         / \
                // [L-L] [ R ] [...] [...]
                
                // fix bounds and heights
                node.aabb.combine(ll.aabb,r.aabb);
                t = llh - rh;
                node.height=llh-(t&t>>31)+1;

                l.aabb.combine(node.aabb,lr.aabb);
                t=nh-lrh;
                l.height=nh-(t&t>>31)+1;
            }
            // set new parent of L
            if(p!=null){
                if(p.child1==node){
                    p.child1=l;
                }else{
                    p.child2=l;
                }
            }else{
                this.root=l;
            }
            l.parent=p;
            return l;
        }else if(balance<-1){
            var rl = r.child1;
            var rr = r.child2;
            var rlh = rl.height;
            var rrh = rr.height;

            // Is R-L higher than R-R?
            if( rlh > rrh ) {
                // set N to R-R
                r.child2 = node;
                node.parent = r;

                //          [ R ]
                //         /     \
                //    [R-L]       [ N ]
                //     / \         / \
                // [...] [...] [ L ] [ R ]
                
                // set R-R
                node.child2 = rr;
                rr.parent = node;

                //          [ R ]
                //         /     \
                //    [R-L]       [ N ]
                //     / \         / \
                // [...] [...] [ L ] [R-R]
                
                // fix bounds and heights
                node.aabb.combine(l.aabb,rr.aabb);
                t = lh-rrh;
                node.height = lh-(t&t>>31)+1;
                r.aabb.combine(rl.aabb,node.aabb);
                t = rlh-nh;
                r.height = rlh-(t&t>>31)+1;
            }else{
                // set N to R-L
                r.child1 = node;
                node.parent = r;
                //          [ R ]
                //         /     \
                //    [ N ]       [R-R]
                //     / \         / \
                // [ L ] [ R ] [...] [...]
                
                // set R-L
                node.child2 = rl;
                rl.parent = node;

                //          [ R ]
                //         /     \
                //    [ N ]       [R-R]
                //     / \         / \
                // [ L ] [R-L] [...] [...]
                
                // fix bounds and heights
                node.aabb.combine(l.aabb,rl.aabb);
                t=lh-rlh;
                node.height=lh-(t&t>>31)+1;
                r.aabb.combine(node.aabb,rr.aabb);
                t=nh-rrh;
                r.height=nh-(t&t>>31)+1;
            }
            // set new parent of R
            if(p!=null){
                if(p.child1==node){
                    p.child1=r;
                }else{
                    p.child2=r;
                }
            }else{
                this.root=r;
            }
            r.parent=p;
            return r;
        }
        return node;
    },

    fix: function ( node ) {

        var c1 = node.child1;
        var c2 = node.child2;
        node.aabb.combine( c1.aabb, c2.aabb );
        node.height = c1.height < c2.height ? c2.height+1 : c1.height+1; 

    }
    
});

export { DBVT };