OIMO.EulerToAxis = function( ox, oy, oz ){// angles in radians
    var c1 = OIMO.cos(oy*0.5);//heading
    var s1 = OIMO.sin(oy*0.5);
    var c2 = OIMO.cos(oz*0.5);//altitude
    var s2 = OIMO.sin(oz*0.5);
    var c3 = OIMO.cos(ox*0.5);//bank
    var s3 = OIMO.sin(ox*0.5);
    var c1c2 = c1*c2;
    var s1s2 = s1*s2;
    var w =c1c2*c3 - s1s2*s3;
    var x =c1c2*s3 + s1s2*c3;
    var y =s1*c2*c3 + c1*s2*s3;
    var z =c1*s2*c3 - s1*c2*s3;
    var angle = 2 * OIMO.acos(w);
    var norm = x*x+y*y+z*z;
    if (norm < 0.001) {
        x=1;
        y=z=0;
    } else {
        norm = OIMO.sqrt(norm);
        x /= norm;
        y /= norm;
        z /= norm;
    }
    return [angle, x, y, z];
}

OIMO.EulerToMatrix = function( ox, oy, oz ) {// angles in radians
    var ch = OIMO.cos(oy);//heading
    var sh = OIMO.sin(oy);
    var ca = OIMO.cos(oz);//altitude
    var sa = OIMO.sin(oz);
    var cb = OIMO.cos(ox);//bank
    var sb = OIMO.sin(ox);
    var mtx = new OIMO.Mat33();

    var te = mtx.elements;
    te[0] = ch * ca;
    te[1] = sh*sb - ch*sa*cb;
    te[2] = ch*sa*sb + sh*cb;
    te[3] = sa;
    te[4] = ca*cb;
    te[5] = -ca*sb;
    te[6] = -sh*ca;
    te[7] = sh*sa*cb + ch*sb;
    te[8] = -sh*sa*sb + ch*cb;
    return mtx;
}

OIMO.MatrixToEuler = function(mtx){// angles in radians
    var te = mtx.elements;
    var x, y, z;
    if (te[3] > 0.998) { // singularity at north pole
        y = OIMO.atan2(te[2],te[8]);
        z = OIMO.PI/2;
        x = 0;
    } else if (te[3] < -0.998) { // singularity at south pole
        y = OIMO.atan2(te[2],te[8]);
        z = -OIMO.PI/2;
        x = 0;
    } else {
        y = OIMO.atan2(-te[6],te[0]);
        x = OIMO.atan2(-te[5],te[4]);
        z = OIMO.asin(te[3]);
    }
    return [x, y, z];
}

OIMO.unwrapDegrees = function (r) {
    r = r % 360;
    if (r > 180) r -= 360;
    if (r < -180) r += 360;
    return r;
}

OIMO.unwrapRadian = function(r){
    r = r % OIMO.TwoPI;
    if (r > OIMO.PI) r -= OIMO.TwoPI;
    if (r < -OIMO.PI) r += OIMO.TwoPI;
    return r;
}