import { CollisionDetector } from './CollisionDetector';
import { _Math } from '../../math/Math';

/**
 * Class for checking collisions between 2 tetras,
 * a shape that is made with 4 vertices and 4 faces
 * arranged in triangles. With this algorigthm, soft
 * body physics are possible and easier to implement.
 * @author xprogram
 */
function TetraTetraCollisionDetector(){

    CollisionDetector.call(this);

};

TetraTetraCollisionDetector.prototype = Object.create( CollisionDetector.prototype );
TetraTetraCollisionDetector.prototype.constructor = TetraTetraCollisionDetector;

TetraTetraCollisionDetector.prototype.detectCollision = function(tet1, tet2, manifold){
    /*
     * What we are doing:
     * Each tetra is represented by four 3D triangles. The only
     * quick way of finding if another tetra is within the other
     * tetra is to see if a single vertex is within the triangles
     * of the other tetra. So, for example, a tetra is represented
     * by points B, C, D and E with triangles BCD, BCE, DCE and BDE.
     * There is another tetra with a vertex A which was detected for
     * collision by the broadphase. Now, if the point A is between ALL
     * triangles of the other tetra (BCD, BCE, etc.) then the collision
     * is valid and we can pass point A to the manifold. Since the only
     * points on the tetra are the 4 vertices, collision detection is
     * not so complex. However, it can be time-consuming because we
     * need to split the 3D triangles into three 2D triangles each for
     * collision detection.
     */
    var i, j, vec, fs1 = tet1.faces, vs1 = tet1.verts, fs2 = tet2.faces, vs2 = tet2.verts;
    var j1, j2, j3, ts = 0; // Triangle vertices `j1`, `j2` and `j3`

    // fs is undeclared
    var fs = fs1;
  
    for(i = 0; i < 4; i++){
        vec = vs1[i];
        for(j = 0; j < 4; j++){
            j1 = vs2[fs[i].a];
            j2 = vs2[fs[i].b];
            j3 = vs2[fs[i].c];

            if(
                this.tricheck(this.pt(vec.x, vec.y), this.pt(j1.x, j1.y), this.pt(j2.x, j2.y), this.pt(j3.x, j3.y)) &&
                this.tricheck(this.pt(vec.x, vec.z), this.pt(j1.x, j1.z), this.pt(j2.x, j2.z), this.pt(j3.x, j3.z)) &&
                this.tricheck(this.pt(vec.z, vec.y), this.pt(j1.z, j1.y), this.pt(j2.z, j2.y), this.pt(j3.z, j3.y))
            )
            ts++;

          if(ts === 4) // Only add point if it is inside all 4 triangles
            manifold.addPoint(vec);
        }
    }
};

// Taken from: http://jsfiddle.net/PerroAZUL/zdaY8/1/
TetraTetraCollisionDetector.prototype.tricheck = function ( p, p0, p1, p2 ){

    var A = 0.5 * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y);
    var sg = A < 0 ? -1 : 1;
    var s = (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * p.x + (p0.x - p2.x) * p.y) * sg;
    var t = (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * p.x + (p1.x - p0.x) * p.y) * sg;
    return s > 0 && t > 0 && (s + t) < 2 * A * sg;

}

TetraTetraCollisionDetector.prototype.pt = function (x, y){
    return {x: x, y: y};
}


export { TetraTetraCollisionDetector };