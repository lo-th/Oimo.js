/**
* A pair of shapes that may collide.
* @author saharan
*/
OIMO.Pair = function(s1,s2){
    // The first shape.
    this.shape1 = s1 || null;
    // The second shape.
    this.shape2 = s2 || null;
};