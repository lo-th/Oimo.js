import { Error } from '../../core/Utils';

function CollisionDetector (){

    this.flip = false;

};

Object.assign( CollisionDetector.prototype, {

    CollisionDetector: true,

    detectCollision: function ( shape1, shape2, manifold ) {
        
        Error("CollisionDetector", "Inheritance error.");

    }

} );

export { CollisionDetector };