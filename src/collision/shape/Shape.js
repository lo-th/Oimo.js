import { SHAPE_NULL } from '../../constants';
import { printError } from '../../core/utils';
import { _Math } from '../../math/Math';
import { Vec3 } from '../../math/Vec3';
import { Mat33 } from '../../math/Mat33';
import { AABB } from '../../math/AABB';

var count = 0;
function ShapeIdCount() { return count++; }

/**
 * A shape is used to detect collisions of rigid bodies.
 *
 * @class Shape
 * @constructor
 * @author saharan
 * @author lo-th
 */
function Shape(config){

    this.type = SHAPE_NULL;

    /**
     * The global identification of the shape should be unique to the shape.
     *
     * @name Shape#id
     * @type {Number}
     */
    this.id = ShapeIdCount();

    /**
     * The previous shape in parent rigid body. Used
     * for fast interations.
     *
     * @name Shape#prev
     * @type {Shape}
     */
    this.prev = null;

    /**
     * The next shape in parent rigid body. Used
     * for fast interations.
     *
     * @name Shape#next
     * @type {Shape}
     */
    this.next = null;

    /**
     * The proxy of the shape used for broad-phase collision detection.
     *
     * @name Shape#proxy
     * @type {Proxy}
     */
    this.proxy = null;

    /**
     * The parent rigid body of the shape.
     *
     * @name Shape#parent
     * @type {RigidBody}
     */
    this.parent = null;

    /**
     * The linked list of the contacts with the shape.
     *
     * @name Shape#contactLink
     * @type {ContactLink}
     */
    this.contactLink = null;

    /**
     * The number of the contacts with the shape.
     *
     * @name Shape#numContacts
     * @type {Number}
     */
    this.numContacts = 0;

    /**
     * The center of gravity of the shape in world coordinate system.
     *
     * @name Shape#position
     * @type {Vec3}
     */
    this.position = new Vec3();

    /**
     * The rotation matrix of the shape in world coordinate system.
     *
     * @name Shape#rotation
     * @type {Mat33}
     */
    this.rotation = new Mat33();

    /**
     * The position of the shape in parent's coordinate system.
     *
     * @name Shape#relativePosition
     * @type {Vec3}
     */
    this.relativePosition = new Vec3().copy(config.relativePosition);

    /**
     * The rotation matrix of the shape in parent's coordinate system.
     *
     * @name Shape#relativeRotation
     * @type {Mat33}
     */
    this.relativeRotation = new Mat33().copy(config.relativeRotation);

    /**
     * The axis-aligned bounding box of the shape.
     *
     * @name Shape#aabb
     * @type {AABB}
     */
    this.aabb = new AABB();

    /**
     * The density of the shape.
     *
     * @name Shape#density
     * @type {Number}
     */
    this.density = config.density;

    /**
     * The coefficient of friction of the shape.
     *
     * @name Shape#friction
     * @type {Number}
     */
    this.friction = config.friction;

    /**
     * The coefficient of restitution of the shape.
     *
     * @name Shape#restitution
     * @type {Number}
     */
    this.restitution = config.restitution;

    /**
     * The bits of the collision groups to which the shape belongs.
     *
     * @name Shape#belongsTo
     * @type {Number}
     */
    this.belongsTo = config.belongsTo;

    /**
     * The bits of the collision groups with which the shape collides.
     *
     * @name Shape#collidesWith
     * @type {Number}
     */
    this.collidesWith = config.collidesWith;

};

Object.assign(Shape.prototype,

/** @lends Shape.prototype */
{

    /**
     * Calculate the mass information of the shape.
     *
     * @param {Mat33} out - Output object for calculations.
     * @return void
     */
    calculateMassInfo: function(out){
        printError("Shape", "Inheritance error.");
    },

    /**
     * Update the proxy of the shape.
     *
     * @return void
     */
    updateProxy: function(){
        printError("Shape", "Inheritance error.");
    }
});

export { Shape };