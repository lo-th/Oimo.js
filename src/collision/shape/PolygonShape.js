/**
 * A polygon shape. Calculated with
 * vertices and faces.
 * @author xprogram
 */
OIMO.PolygonShape = function(config, verts, faces){
	OIMO.Shape.call(this);
	this.vertices = verts;
	this.faces = faces;
	this.type = OIMO.SHAPE_POLYGON;
};
OIMO.PolygonShape.prototype = Object.create(OIMO.Shape.prototype);
OIMO.PolygonShape.prototype.constructor = OIMO.PolygonShape;

OIMO.PolygonShape.prototype.updateProxy = function(){
	this.aabb.setFromPoints(this.vertices);
	this.aabb.expandByScalar(OIMO.AABB_PROX);

	if(this.proxy !== null)
		this.proxy.update();
};
