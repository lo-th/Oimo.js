OIMO.CollisionDetector = function(){

    this.flip = false;

};

OIMO.CollisionDetector.prototype = {
    
    constructor: OIMO.CollisionDetector,

    detectCollision: function ( shape1, shape2, manifold ) {
        
        OIMO.Error("CollisionDetector", "Inheritance error.");

    }

};