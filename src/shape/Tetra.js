import { SHAPE_TETRA, AABB_PROX } from '../constants';
import { Shape } from './Shape';

/**
 * A tetra shape.
 * @author xprogram
 */
function Tetra ( config, p1, p2, p3, p4 ){

    Shape.call( this, config );
    this.type = SHAPE_TETRA;

    // Vertices and faces of tetra
    this.verts = [ p1, p2, p3, p4 ];
    this.faces = [ this.mtri(0, 1, 2), this.mtri(1, 2, 3), this.mtri(2, 3, 4), this.mtri(4, 0, 1) ];

};

Tetra.prototype = Object.create( Shape.prototype );
Tetra.prototype.constructor = TetraShape;

Tetra.prototype.calculateMassInfo = function( out ){
    // I guess you could calculate box mass and split it
    // in half for the tetra...
    this.aabb.setFromPoints(this.verts);
    var p = this.aabb.elements;
    var x = p[3] - p[0];
    var y = p[4] - p[1];
    var z = p[5] - p[2];
    var mass = x * y * z * this.density;
    var divid = 1/12;
    out.mass = mass;
    out.inertia.set(
        mass * ( 2*y*2*y + 2*z*2*z ) * divid, 0, 0,
        0, mass * ( 2*x*2*x + 2*z*2*z ) * divid, 0,
        0, 0, mass * ( 2*y*2*y + 2*x*2*x ) * divid
    );

};

Tetra.prototype.updateProxy = function () {

    this.aabb.setFromPoints(this.verts);
    this.aabb.expandByScalar(AABB_PROX);

    if(this.proxy !== null) this.proxy.update();

};

Tetra.prototype.mtri = function ( a, b, c ){
    return {a: a, b: b, c: c};
}

export { Tetra };