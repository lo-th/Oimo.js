import { SHAPE_NULL } from '../../constants';
import { Error } from '../../core/Utils';
import { _Math } from '../../math/Math';
import { Vec3 } from '../../math/Vec3';
import { Mat33 } from '../../math/Mat33';
import { AABB } from '../broadphase/AABB';

/**
 * A shape is used to detect collisions of rigid bodies.
 * @author saharan
 * @author lo-th
 */

var count = 0;
function ShapeIdCount() { return count++; }

function Shape (config){

    this.type = SHAPE_NULL;

    // The global identification of the shape should be unique to the shape.
    this.id = ShapeIdCount();//nextID++;

    // The previous shape in parent rigid body.
    this.prev = null;
    // The next shape in parent rigid body.
    this.next = null;

    // The proxy of the shape used for broad-phase collision detection.
    this.proxy = null;
    // The parent rigid body of the shape.
    this.parent = null;
    // The linked list of the contacts with the shape.
    this.contactLink = null;
    // The number of the contacts with the shape.
    this.numContacts = 0;

    // The center of gravity of the shape in world coordinate system.
    this.position = new Vec3();
    // The rotation matrix of the shape in world coordinate system
    this.rotation = new Mat33();

    // The position of the shape in parent's coordinate system.
    this.relativePosition = new Vec3().copy(config.relativePosition);
    // The rotation matrix of the shape in parent's coordinate system.
    this.relativeRotation = new Mat33().copy(config.relativeRotation);

    // The axis-aligned bounding box of the shape.
    this.aabb = new AABB();

    // The density of the shape.
    this.density = config.density;
    // The coefficient of friction of the shape.
    this.friction = config.friction;
    // The coefficient of restitution of the shape.
    this.restitution = config.restitution;
    // The bits of the collision groups to which the shape belongs.
    this.belongsTo = config.belongsTo;
    // The bits of the collision groups with which the shape collides.
    this.collidesWith = config.collidesWith;

};

Shape.prototype = {

    constructor: Shape,
    
    // Calculate the mass information of the shape.
    
    calculateMassInfo: function ( out ) {

        Error("Shape", "Inheritance error.");
    
    },
    
    // Update the proxy of the shape.
    
    updateProxy: function () {

        Error("Shape", "Inheritance error.");
    
    }

};

export { Shape };