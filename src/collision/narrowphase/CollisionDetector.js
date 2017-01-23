import { Error } from '../../core/Utils';

function CollisionDetector (){

    this.flip = false;

};

CollisionDetector.prototype = {
    
    constructor: CollisionDetector,

    detectCollision: function ( shape1, shape2, manifold ) {
        
        Error("CollisionDetector", "Inheritance error.");

    }

};

export { CollisionDetector };