import { Vec3 } from '../math/Vec3';
import { Mat33 } from '../math/Mat33';

/**
 * A shape configuration holds common configuration data for constructing a shape.
 * These configurations can be reused safely.
 *
 * @author saharan
 * @author lo-th
 */
 
function ShapeConfig(){

    // position of the shape in parent's coordinate system.
    this.relativePosition = new Vec3();
    // rotation matrix of the shape in parent's coordinate system.
    this.relativeRotation = new Mat33();
    // coefficient of friction of the shape.
    this.friction = 0.2; // 0.4
    // coefficient of restitution of the shape.
    this.restitution = 0.2;
    // density of the shape.
    this.density = 1;
    // bits of the collision groups to which the shape belongs.
    this.belongsTo = 1;
    // bits of the collision groups with which the shape collides.
    this.collidesWith = 0xffffffff;

};

export { ShapeConfig };