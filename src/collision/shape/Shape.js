import { SHAPE_NULL } from '../../constants';
import { Error } from '../../core/Utils';
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
function Shape (config){

    this.type = SHAPE_NULL;

    /**
     * The global identification of the shape should be unique to the shape.
     *
     * @property id
     * @type {Number}
     */
    this.id = ShapeIdCount();

    /**
     * The previous shape in parent rigid body. Used
     * for fast interations.
     *
     * @property prev
     * @type {Shape}
     */
    this.prev = null;

    /**
     * The next shape in parent rigid body. Used
     * for fast interations.
     *
     * @property next
     * @type {Shape}
     */
    this.next = null;

    /**
     * The proxy of the shape used for broad-phase collision detection.
     *
     * @property proxy
     * @type {Proxy}
     */
    this.proxy = null;

    /**
     * The parent rigid body of the shape.
     *
     * @property parent
     * @type {RigidBody}
     */
    this.parent = null;

    /**
     * The linked list of the contacts with the shape.
     *
     * @property contactLink
     * @type {ContactLink}
     */
    this.contactLink = null;

    /**
     * The number of the contacts with the shape.
     *
     * @property numContacts
     * @type {Number}
     */
    this.numContacts = 0;

    /**
     * The center of gravity of the shape in world coordinate system.
     *
     * @property position
     * @type {Vec3}
     */
    this.position = new Vec3();

    /**
     * The rotation matrix of the shape in world coordinate system.
     *
     * @property rotation
     * @type {Mat33}
     */
    this.rotation = new Mat33();

    /**
     * The position of the shape in parent's coordinate system.
     *
     * @property relativePosition
     * @type {Vec3}
     */
    this.relativePosition = new Vec3().copy(config.relativePosition);

    /**
     * The rotation matrix of the shape in parent's coordinate system.
     *
     * @property relativeRotation
     * @type {Mat33}
     */
    this.relativeRotation = new Mat33().copy(config.relativeRotation);

    /**
     * The axis-aligned bounding box of the shape.
     *
     * @property aabb
     * @type {AABB}
     */
    this.aabb = new AABB();

    /**
     * The density of the shape.
     *
     * @property density
     * @type {Number}
     */
    this.density = config.density;

    /**
     * The coefficient of friction of the shape.
     *
     * @property friction
     * @type {Number}
     */
    this.friction = config.friction;

    /**
     * The coefficient of restitution of the shape.
     *
     * @property restitution
     * @type {Number}
     */
    this.restitution = config.restitution;

    /**
     * The bits of the collision groups to which the shape belongs.
     *
     * @property belongsTo
     * @type {Number}
     */
    this.belongsTo = config.belongsTo;

    /**
     * The bits of the collision groups with which the shape collides.
     *
     * @property collidesWith
     * @type {Number}
     */
    this.collidesWith = config.collidesWith;

};

Object.assign( Shape.prototype, {

    Shape: true,

    /**
     * Calculate the mass information of the shape.
     *
     * @method calculateMassInfo
     * @return void
     */
    calculateMassInfo: function ( out ) {

        Error("Shape", "Inheritance error.");

    },

    /**
     * Update the proxy of the shape.
     *
     * @method updateProxy
     * @return void
     */
    updateProxy: function () {

        Error("Shape", "Inheritance error.");

    }

} );

export { Shape };