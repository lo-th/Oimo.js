OIMO.Distance3d = function(p1, p2){
    var xd = p2[0]-p1[0];
    var yd = p2[1]-p1[1];
    var zd = p2[2]-p1[2];
    return OIMO.sqrt(xd*xd + yd*yd + zd*zd);
}