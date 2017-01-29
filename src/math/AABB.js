import { _Math } from './Math';


/**
 * An axis-aligned bounding box.
 *
 * @author saharan
 * @author lo-th
 */

function AABB( minX, maxX, minY, maxY, minZ, maxZ ){

    this.elements = new Float32Array( 6 );
    var te = this.elements;

    te[0] = minX || 0; te[1] = minY || 0; te[2] = minZ || 0;
    te[3] = maxX || 0; te[4] = maxY || 0; te[5] = maxZ || 0;

};

Object.assign( AABB.prototype, {

	AABB: true,

	set: function(minX, maxX, minY, maxY, minZ, maxZ){

		var te = this.elements;
		te[0] = minX;
		te[3] = maxX;
		te[1] = minY;
		te[4] = maxY;
		te[2] = minZ;
		te[5] = maxZ;
		return this;
	},

	intersectTest: function ( aabb ) {

		var te = this.elements;
		var ue = aabb.elements;
		return te[0] > ue[3] || te[1] > ue[4] || te[2] > ue[5] || te[3] < ue[0] || te[4] < ue[1] || te[5] < ue[2] ? true : false;

	},

	intersectTestTwo: function ( aabb ) {

		var te = this.elements;
		var ue = aabb.elements;
		return te[0] < ue[0] || te[1] < ue[1] || te[2] < ue[2] || te[3] > ue[3] || te[4] > ue[4] || te[5] > ue[5] ? true : false;

	},

	clone: function () {

		return new this.constructor().fromArray( this.elements );

	},

	copy: function ( aabb, margin ) {

		var m = margin || 0;
		var me = aabb.elements;
		this.set( me[ 0 ]-m, me[ 3 ]+m, me[ 1 ]-m, me[ 4 ]+m, me[ 2 ]-m, me[ 5 ]+m );
		return this;

	},

	fromArray: function ( array ) {

		this.elements.set( array );
		return this;

	},

	// Set this AABB to the combined AABB of aabb1 and aabb2.

	combine: function( aabb1, aabb2 ) {

		var a = aabb1.elements;
		var b = aabb2.elements;
		var te = this.elements;

		te[0] = a[0] < b[0] ? a[0] : b[0];
		te[1] = a[1] < b[1] ? a[1] : b[1];
		te[2] = a[2] < b[2] ? a[2] : b[2];

		te[3] = a[3] > b[3] ? a[3] : b[3];
		te[4] = a[4] > b[4] ? a[4] : b[4];
		te[5] = a[5] > b[5] ? a[5] : b[5];

		return this;

	},


	// Get the surface area.

	surfaceArea: function () {

		var te = this.elements;
		var a = te[3] - te[0];
		var h = te[4] - te[1];
		var d = te[5] - te[2];
		return 2 * (a * (h + d) + h * d );

	},


	// Get whether the AABB intersects with the point or not.

	intersectsWithPoint:function(x,y,z){

		var te = this.elements;
		return x>=te[0] && x<=te[3] && y>=te[1] && y<=te[4] && z>=te[2] && z<=te[5];

	},

	/**
	 * Set the AABB from an array
	 * of vertices. From THREE.
	 * @author WestLangley
	 * @author xprogram
	 */

	setFromPoints: function(arr){
		this.makeEmpty();
		for(var i = 0; i < arr.length; i++){
			this.expandByPoint(arr[i]);
		}
	},

	makeEmpty: function(){
		this.set(-Infinity, -Infinity, -Infinity, Infinity, Infinity, Infinity);
	},

	expandByPoint: function(pt){
		var te = this.elements;
		this.set(
			_Math.min(te[ 0 ], pt.x), _Math.min(te[ 1 ], pt.y), _Math.min(te[ 2 ], pt.z),
			_Math.max(te[ 3 ], pt.x), _Math.max(te[ 4 ], pt.y), _Math.max(te[ 5 ], pt.z)
		);
	},

	expandByScalar: function(s){

		var te = this.elements;
		te[0] += -s;
		te[1] += -s;
		te[2] += -s;
		te[3] += s;
		te[4] += s;
		te[5] += s;
	}

});

export { AABB };