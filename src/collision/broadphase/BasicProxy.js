import { Proxy, ProxyIdCount } from './Proxy';

/**
* A basic implementation of proxies.
* @author saharan
*/

function BasicProxy ( shape ) {

    Proxy.call( this, shape );

    this.id = ProxyIdCount();

};

BasicProxy.prototype = Object.create( Proxy.prototype );
BasicProxy.prototype.constructor = BasicProxy;

BasicProxy.prototype.update = function () {

};

export { BasicProxy };