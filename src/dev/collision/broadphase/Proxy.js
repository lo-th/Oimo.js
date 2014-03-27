OIMO.Proxy = function(shape){
    this.shape=shape;
    this.aabb=shape.aabb;
};

OIMO.Proxy.prototype = {

    constructor: OIMO.Proxy,

    update:function(){
        throw new Error("Inheritance error.");
    }
}