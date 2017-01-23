import { Error } from '../../core/Utils';

/**
* A proxy is used for broad-phase collecting pairs that can be colliding.
*/
var count = 0;
function ProxyIdCount() { return count++; }

function Proxy( shape ) {

	// The parent shape.
    this.shape = shape;
    // The axis-aligned bounding box.
    this.aabb = shape.aabb;

};

Proxy.prototype = {

    constructor: Proxy,
    
	// Update the proxy.
	
    update:function(){

        Error("Proxy","Inheritance error.");

    }

};

export { ProxyIdCount, Proxy };