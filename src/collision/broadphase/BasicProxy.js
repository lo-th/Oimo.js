import { Proxy, ProxyIdCount } from './Proxy';

/**
* A basic implementation of proxies.
*
* @author saharan
*/

function BasicProxy ( shape ) {

    Proxy.call( this, shape );

    this.id = ProxyIdCount();

};

BasicProxy.prototype = Object.assign( Object.create( Proxy.prototype ), {

    constructor: BasicProxy,

    update: function () {

    }

});

export { BasicProxy };