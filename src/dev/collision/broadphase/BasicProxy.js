OIMO.BasicProxy = function(shape){
    OIMO.Proxy.call( this, shape );
}
OIMO.BasicProxy.prototype = Object.create( OIMO.Proxy.prototype );
OIMO.BasicProxy.prototype.update = function () {
}