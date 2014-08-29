/**
 * A shape is used to detect collisions of rigid bodies.
 * @author saharan
 */
OIMO.Shape = function(config){
    // The global identification of the shape.
    // This value should be unique to the shape.
    this.id = OIMO.nextID++;
    // The previous shape in parent rigid body.
    this.prev = null;
    // The next shape in parent rigid body.
    this.next = null;
    // The type of the shape.
    this.type = 0;

    // The proxy of the shape.
    // This is used for broad-phase collision detection.
    this.proxy = null;
    // The parent rigid body of the shape.
    this.parent = null;
    // The linked list of the contacts with the shape.
    this.contactLink = null;
    // The number of the contacts with the shape.
    this.numContacts=0;

    // The center of gravity of the shape in world coordinate system.
    this.position = new OIMO.Vec3();
    // The rotation matrix of the shape in world coordinate system
    this.rotation = new OIMO.Mat33();

    // The position of the shape in parent's coordinate system.
    this.relativePosition = new OIMO.Vec3().copy(config.relativePosition);
    // The rotation matrix of the shape in parent's coordinate system.
    this.relativeRotation = new OIMO.Mat33().copy(config.relativeRotation);

    // The axis-aligned bounding box of the shape.
    this.aabb = new OIMO.AABB();

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
}

OIMO.Shape.prototype = {
    constructor: OIMO.Shape,

    /**
    * Calculate the mass information of the shape.
    * @param   out
    */
    calculateMassInfo:function(out){
        throw new Error("Inheritance error.");
    },

    /**
    * Update the proxy of the shape.
    */
    updateProxy:function(){
        throw new Error("Inheritance error.");
    }
}