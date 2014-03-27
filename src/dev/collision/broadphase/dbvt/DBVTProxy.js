OIMO.DBVTProxy = function(shape){
    OIMO.Proxy.call( this, shape);

    this.leaf=new OIMO.DBVTNode();
    this.leaf.proxy=this;

}
OIMO.DBVTProxy.prototype = Object.create( OIMO.Proxy.prototype );
OIMO.DBVTProxy.prototype.update = function () {
}