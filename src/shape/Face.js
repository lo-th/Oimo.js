/**
 * A polygon shape face, made from 3
 * vertices.
 * @author xprogram
 */
OIMO.Face = function(a, b, c){
	this.a = a;
	this.b = b;
	this.c = c;
	a.uses.push(this);
	b.uses.push(this);
	c.uses.push(this);
};
OIMO.Face.prototype = {
	constructor: OIMO.Face
};
