import { AABB } from '../../../math/AABB';

/**
* A node of the dynamic bounding volume tree.
* @author saharan
*/

function DBVTNode(){
    
	// The first child node of this node.
    this.child1 = null;
    // The second child node of this node.
    this.child2 = null;
    //  The parent node of this tree.
    this.parent = null;
    // The proxy of this node. This has no value if this node is not leaf.
    this.proxy = null;
    // The maximum distance from leaf nodes.
    this.height = 0;
    // The AABB of this node.
    this.aabb = new AABB();

};

export { DBVTNode };