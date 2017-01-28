import { printError } from '../../core/Utils';

var count = 0;
function ProxyIdCount() { return count++; }

/**
 * A proxy is used for broad-phase collecting pairs that can be colliding.
 *
 * @class Proxy
 * @constructor
 * @author lo-th
 */
function Proxy( shape ) {

	/**
	 * The parent shape.
	 *
	 * @property shape
	 * @type {Shape}
	 */
    this.shape = shape;

    /**
     * The axis-aligned bounding box.
	 *
	 * @property aabb
	 * @type {AABB}
	 */
    this.aabb = shape.aabb;

};

Object.assign( Proxy.prototype, {

    Proxy: true,

	/**
	 * Update the proxy. Must be inherited
	 * by a child.
	 *
	 * @method update
	 * @return any
	 */
    update: function(){
        Error("Proxy","Inheritance error.");
    }
});

export { ProxyIdCount, Proxy };