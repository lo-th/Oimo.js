import { SHAPE_TETRA, AABB_PROX } from '../../constants';
import { Shape } from './Shape';

/**
 * A tetra shape.
 * @author xprogram
 */
function TetraShape ( config, p1, p2, p3, p4 ){

    Shape.call( this, config );
    this.type = SHAPE_TETRA;

    // Vertices and faces of tetra
    this.verts = [ p1, p2, p3, p4 ];
    this.faces = [ this.mtri(0, 1, 2), this.mtri(1, 2, 3), this.mtri(2, 3, 4), this.mtri(4, 0, 1) ];

};

TetraShape.prototype = Object.create( Shape.prototype );
TetraShape.prototype.constructor = TetraShape;

TetraShape.prototype.calculateMassInfo = function(){
  // I guess you could calculate box mass and split it
  // in half for the tetra...
};

TetraShape.prototype.updateProxy = function(){

    this.aabb.setFromPoints(this.verts);
    this.aabb.expandByScalar(OIMO.AABB_PROX);

    if(this.proxy !== null) this.proxy.update();

};

TetraShape.prototype.mtri = function ( a, b, c ){
    return {a: a, b: b, c: c};
}

export { TetraShape };