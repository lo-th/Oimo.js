import { Proxy } from '../Proxy';
import { DBVTNode } from './DBVTNode';

/**
* A proxy for dynamic bounding volume tree broad-phase.
* @author saharan
*/
function DBVTProxy ( shape ) {

    Proxy.call( this, shape);
    // The leaf of the proxy.
    this.leaf = new DBVTNode();
    this.leaf.proxy = this;

};

DBVTProxy.prototype = Object.create( Proxy.prototype );
DBVTProxy.prototype.constructor = DBVTProxy;

DBVTProxy.prototype.update = function () {
    
};

export { DBVTProxy };