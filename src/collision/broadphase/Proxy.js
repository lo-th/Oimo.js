/**
* A proxy is used for broad-phase collecting pairs that can be colliding.
*/

OIMO.Proxy = function ( shape ) {

	// The parent shape.
    this.shape = shape;
    // The axis-aligned bounding box.
    this.aabb = shape.aabb;

};

OIMO.Proxy.prototype = {

    constructor: OIMO.Proxy,
    
	// Update the proxy.
	
    update:function(){

        OIMO.Error("Proxy","Inheritance error.");

    }

};