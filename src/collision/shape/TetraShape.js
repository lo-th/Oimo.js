/**
 * A tetra shape.
 * @author xprogram
 */
OIMO.TetraShape = function(config, p1, p2, p3, p4){
  OIMO.Shape.call(this, config);
  this.type = OIMO.SHAPE_TETRA;

  // Vertices and faces of tetra
  this.verts = [p1, p2, p3, p4];
  this.faces = [
    mtri(0, 1, 2),
    mtri(1, 2, 3),
    mtri(2, 3, 4),
    mtri(4, 0, 1),
  ];
};
OIMO.TetraShape.prototype = Object.create(OIMO.Shape.prototype);
OIMO.TetraShape.prototype.constructor = OIMO.TetraShape;

OIMO.TetraShape.prototype.calculateMassInfo = function(){
  // I guess you could calculate box mass and split it
  // in half for the tetra...
};
OIMO.TetraShape.prototype.updateProxy = function(){
  this.aabb.setFromPoints(this.verts);
};

function mtri(a, b, c){
  return {a: a, b: b, c: c};
}
