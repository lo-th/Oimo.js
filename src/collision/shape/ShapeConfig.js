/**
 * A shape configuration holds common configuration data for constructing a shape.
 * Shape configurations can be reused safely.
 * @author saharan
 */

OIMO.ShapeConfig = function(){
    
	// The position of the shape in parent's coordinate system.
    this.relativePosition = new OIMO.Vec3();
    // The rotation matrix of the shape in parent's coordinate system.
    this.relativeRotation = new OIMO.Mat33();
    // The coefficient of friction of the shape.
    this.friction = 0.4;
    // The coefficient of restitution of the shape.
    this.restitution = 0.2;
    // The density of the shape.
    this.density = 1;
    // The bits of the collision groups to which the shape belongs.
    this.belongsTo = 1;
    // The bits of the collision groups with which the shape collides.
    this.collidesWith = 0xffffffff;

};