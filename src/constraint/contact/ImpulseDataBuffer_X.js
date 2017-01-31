import { Vec3 } from '../../math/Vec3';

function ImpulseDataBuffer (){

    this.lp1 = new Vec3();
    this.lp2 = new Vec3();
    this.impulse = NaN;

}

export { ImpulseDataBuffer };