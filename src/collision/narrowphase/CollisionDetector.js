OIMO.CollisionDetector = function(){
    this.flip = false;
}

OIMO.CollisionDetector.prototype = {
    constructor: OIMO.CollisionDetector,

    detectCollision:function(shape1,shape2,manifold){
        throw new Error("Inheritance error.");
    }
}