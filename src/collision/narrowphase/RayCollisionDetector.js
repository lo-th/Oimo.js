import { CollisionDetector } from './CollisionDetector';
import { _Math } from '../../math/Math';
import { Vec3 } from '../../math/Vec3';

/**
 * Class for collision detection based on
 * ray casting. Ray source from THREE. This
 * class should only be used with the tetra
 * or a polygon.
 * @author xprogram
 */
function RayCollisionDetector (){

    CollisionDetector.call(this);

};

RayCollisionDetector.prototype = Object.create(CollisionDetector.prototype);
RayCollisionDetector.prototype.constructor = RayCollisionDetector;

RayCollisionDetector.prototype.detectCollision = function(shape1, shape2, manifold){

    var pos1 = shape1.position;
    var pos2 = shape2.position;
    var vec3_1 = new Vec3(pos1.x, pos1.y, pos1.z);
    var vec3_2 = new Vec3(pos2.x, pos2.y, pos2.z);
    var intersect;

    // Yes, it is a brute force approach but it works for now...
    for(var i = 0; i < shape2.faces.length; i++){
        intersect = triangleIntersect(vec3_1, vec3_1.angleTo(vec3_2), shape2.faces[i], false);

        if(intersect !== null)
            manifold.addPoint(new Vec3(intersect.x, intersect.y, intersect.z));
    }

};

/**
 * @author bhouston / http://clara.io
 */
function triangleIntersect( origin, direction, face, backfaceCulling ){

	var diff = new Vec3();
	var edge1 = new Vec3();
	var edge2 = new Vec3();
	var normal = new Vec3();

    var a = face.a, b = face.b, c = face.c;
    var sign, DdN;

    edge1.subVectors(b, a);
	edge2.subVectors(c, a);
	normal.crossVectors(edge1, edge2);

	DdN = direction.dot(normal);
	if(DdN > 0){
		if(backfaceCulling)return null;
		sign = 1;
	} else if(DdN < 0){
		sign = -1;
		DdN = -DdN;
	} else {
		return null;
	}

	diff.subVectors(this.origin, a);
	var DdQxE2 = sign * direction.dot(edge2.crossVectors(diff, edge2));

	// b1 < 0, no intersection
	if ( DdQxE2 < 0 ) {
		return null;
	}

	var DdE1xQ = sign * direction.dot(edge1.cross(diff));

	// b2 < 0, no intersection
	if(DdE1xQ < 0){
		return null;
	}

	// b1+b2 > 1, no intersection
	if(DdQxE2 + DdE1xQ > DdN){
		return null;
	}

	// Line intersects triangle, check if ray does.
	var QdN = -sign * diff.dot(normal);

	// t < 0, no intersection
	if(QdN < 0){
		return null;
	}

	// Ray intersects triangle.
	return new Vec3().copy( direction ).multiplyScalar(QdN / DdN).add( origin );
}

export { RayCollisionDetector };