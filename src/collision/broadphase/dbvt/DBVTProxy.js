/**
* A proxy for dynamic bounding volume tree broad-phase.
* @author saharan
*/
OIMO.DBVTProxy = function ( shape ) {

    OIMO.Proxy.call( this, shape);
    // The leaf of the proxy.
    this.leaf = new OIMO.DBVTNode();
    this.leaf.proxy = this;

};

OIMO.DBVTProxy.prototype = Object.create( OIMO.Proxy.prototype );
OIMO.DBVTProxy.prototype.constructor = OIMO.DBVTProxy;

OIMO.DBVTProxy.prototype.update = function () {
    
};