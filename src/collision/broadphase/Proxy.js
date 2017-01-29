import { printError } from '../../core/Utils';

var count = 0;
function ProxyIdCount() { return count++; }

/**
 * A proxy is used for broad-phase collecting pairs that can be colliding.
 *
 * @author lo-th
 */

function Proxy( shape ) {

	//The parent shape.
    this.shape = shape;

    //The axis-aligned bounding box.
    this.aabb = shape.aabb;

};

Object.assign( Proxy.prototype, {

    Proxy: true,

	// Update the proxy. Must be inherited by a child.

    update: function(){

        printError("Proxy","Inheritance error.");

    }

});

export { ProxyIdCount, Proxy };