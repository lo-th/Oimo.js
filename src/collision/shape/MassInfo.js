/**
* This class holds mass information of a shape.
* @author saharan
*/
OIMO.MassInfo = function(){

	// Mass of the shape.
    this.mass = 0;
    // The moment inertia of the shape.
    this.inertia = new OIMO.Mat33();

};