/**
* A basic implementation of proxies.
* @author saharan
*/

OIMO.BasicProxy = function( shape ) {

    OIMO.Proxy.call( this, shape );

    this.id = OIMO.proxyID++;

};

OIMO.BasicProxy.prototype = Object.create( OIMO.Proxy.prototype );
OIMO.BasicProxy.prototype.constructor = OIMO.BasicProxy;

OIMO.BasicProxy.prototype.update = function () {

};