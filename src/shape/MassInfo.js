import { Mat33 } from '../math/Mat33';

/**
 * This class holds mass information of a shape.
 * @author lo-th
 * @author saharan
 */

function MassInfo (){

    // Mass of the shape.
    this.mass = 0;

    // The moment inertia of the shape.
    this.inertia = new Mat33();

};

export { MassInfo };