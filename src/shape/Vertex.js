/**
 * A polygon shape vertex, of point. Three of
 * these make up a face for the polygon.
 * @author xprogram
 */
OIMO.Vertex = function(x, y, z){
	this.x = x;
	this.y = y;
	this.z = z;
	this.uses = 0; // Number of faces this vertex is connected to
	this.elements = [x, y, z];
};
