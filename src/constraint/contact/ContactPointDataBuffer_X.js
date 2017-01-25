import { Vec3 } from '../../math/Vec3';

function ContactPointDataBuffer (){

    //this.d = new Float32Array( (23 * 3) + 7 );

    this.norX=NaN;//0
    this.norY=NaN;//1
    this.norZ=NaN;//2

    this.tanX=NaN;//3
    this.tanY=NaN;//4
    this.tanZ=NaN;//5

    this.binX=NaN;//6
    this.binY=NaN;//7
    this.binZ=NaN;//8

    //
    
    this.rp1X=NaN;//9
    this.rp1Y=NaN;//10
    this.rp1Z=NaN;//11

    this.rp2X=NaN;//12
    this.rp2Y=NaN;//13
    this.rp2Z=NaN;//14

    //
    
    this.norU1X=NaN;//15
    this.norU1Y=NaN;//16
    this.norU1Z=NaN;//17

    this.norU2X=NaN;//18
    this.norU2Y=NaN;//18
    this.norU2Z=NaN;//20

    this.tanU1X=NaN;
    this.tanU1Y=NaN;
    this.tanU1Z=NaN;

    this.tanU2X=NaN;
    this.tanU2Y=NaN;
    this.tanU2Z=NaN;

    this.binU1X=NaN;
    this.binU1Y=NaN;
    this.binU1Z=NaN;

    this.binU2X=NaN;
    this.binU2Y=NaN;
    this.binU2Z=NaN;

    //
    
    this.norT1X=NaN;
    this.norT1Y=NaN;
    this.norT1Z=NaN;

    this.norT2X=NaN;
    this.norT2Y=NaN;
    this.norT2Z=NaN;

    this.tanT1X=NaN;
    this.tanT1Y=NaN;
    this.tanT1Z=NaN;

    this.tanT2X=NaN;
    this.tanT2Y=NaN;
    this.tanT2Z=NaN;

    this.binT1X=NaN;
    this.binT1Y=NaN;
    this.binT1Z=NaN;

    this.binT2X=NaN;
    this.binT2Y=NaN;
    this.binT2Z=NaN;

    //

    this.norTU1X=NaN;
    this.norTU1Y=NaN;
    this.norTU1Z=NaN;

    this.norTU2X=NaN;
    this.norTU2Y=NaN;
    this.norTU2Z=NaN;

    this.tanTU1X=NaN;
    this.tanTU1Y=NaN;
    this.tanTU1Z=NaN;

    this.tanTU2X=NaN;
    this.tanTU2Y=NaN;
    this.tanTU2Z=NaN;

    this.binTU1X=NaN;
    this.binTU1Y=NaN;
    this.binTU1Z=NaN;

    this.binTU2X=NaN;
    this.binTU2Y=NaN;
    this.binTU2Z=NaN;

    //
    
    this.norImp=NaN;
    this.tanImp=NaN;
    this.binImp=NaN;

    this.norDen=NaN;
    this.tanDen=NaN;
    this.binDen=NaN;

    this.norTar=NaN;
    
    //this.next=null;
    //this.last=false;

}

export { ContactPointDataBuffer };