import { Mat33 } from '../../math/Mat33';

/**
 * This class holds mass information of a shape.
 *
 * @class MassInfo
 * @constructor
 * @author lo-th
 * @author saharan
 */
function MassInfo (){

    /**
     * Mass of the shape.
     *
     * @property mass
     * @type {Number}
     */
    this.mass = 0;

    /**
     * The moment inertia of the shape.
     *
     * @property inertia
     * @type {Mat33}
     */
    this.inertia = new Mat33();

};

export { MassInfo };