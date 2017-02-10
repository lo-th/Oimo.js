import { Constraint } from '../Constraint';
import { ContactPointDataBuffer } from './ContactPointDataBuffer';
import { Vec3 } from '../../math/Vec3';
import { _Math } from '../../math/Math';

/**
* ...
* @author saharan
*/
function ContactConstraint ( manifold ){
    
    Constraint.call( this );
    // The contact manifold of the constraint.
    this.manifold = manifold;
    // The coefficient of restitution of the constraint.
    this.restitution=NaN;
    // The coefficient of friction of the constraint.
    this.friction=NaN;
    this.p1=null;
    this.p2=null;
    this.lv1=null;
    this.lv2=null;
    this.av1=null;
    this.av2=null;
    this.i1=null;
    this.i2=null;

    //this.ii1 = null;
    //this.ii2 = null;

    this.tmp = new Vec3();
    this.tmpC1 = new Vec3();
    this.tmpC2 = new Vec3();

    this.tmpP1 = new Vec3();
    this.tmpP2 = new Vec3();

    this.tmplv1 = new Vec3();
    this.tmplv2 = new Vec3();
    this.tmpav1 = new Vec3();
    this.tmpav2 = new Vec3();

    this.m1=NaN;
    this.m2=NaN;
    this.num=0;
    
    this.ps = manifold.points;
    this.cs = new ContactPointDataBuffer();
    this.cs.next = new ContactPointDataBuffer();
    this.cs.next.next = new ContactPointDataBuffer();
    this.cs.next.next.next = new ContactPointDataBuffer();
}

ContactConstraint.prototype = Object.assign( Object.create( Constraint.prototype ), {

    constructor: ContactConstraint,

    // Attach the constraint to the bodies.
    attach: function(){

        this.p1=this.body1.position;
        this.p2=this.body2.position;
        this.lv1=this.body1.linearVelocity;
        this.av1=this.body1.angularVelocity;
        this.lv2=this.body2.linearVelocity;
        this.av2=this.body2.angularVelocity;
        this.i1=this.body1.inverseInertia;
        this.i2=this.body2.inverseInertia;

    },

    // Detach the constraint from the bodies.
    detach: function(){

        this.p1=null;
        this.p2=null;
        this.lv1=null;
        this.lv2=null;
        this.av1=null;
        this.av2=null;
        this.i1=null;
        this.i2=null;

    },

    preSolve: function( timeStep, invTimeStep ){

        this.m1 = this.body1.inverseMass;
        this.m2 = this.body2.inverseMass;

        var m1m2 = this.m1 + this.m2;

        this.num = this.manifold.numPoints;

        var c = this.cs;
        var p, rvn, len, norImp, norTar, sepV, i1, i2;;

        for( var i=0; i < this.num; i++ ){

            p = this.ps[i];

            this.tmpP1.sub( p.position, this.p1 );
            this.tmpP2.sub( p.position, this.p2 );

            this.tmpC1.crossVectors( this.av1, this.tmpP1 );
            this.tmpC2.crossVectors( this.av2, this.tmpP2 );

            c.norImp = p.normalImpulse;
            c.tanImp = p.tangentImpulse;
            c.binImp = p.binormalImpulse;

            c.nor.copy( p.normal );

            this.tmp.set(

                ( this.lv2.x + this.tmpC2.x ) - ( this.lv1.x + this.tmpC1.x ),
                ( this.lv2.y + this.tmpC2.y ) - ( this.lv1.y + this.tmpC1.y ),
                ( this.lv2.z + this.tmpC2.z ) - ( this.lv1.z + this.tmpC1.z )

            );

            rvn = _Math.dotVectors( c.nor, this.tmp );

            c.tan.set(
                this.tmp.x - rvn * c.nor.x,
                this.tmp.y - rvn * c.nor.y,
                this.tmp.z - rvn * c.nor.z
            );

            len = _Math.dotVectors( c.tan, c.tan );

            if( len <= 0.04 ) {
                c.tan.tangent( c.nor );
            }

            c.tan.normalize();

            c.bin.crossVectors( c.nor, c.tan );

            c.norU1.scale( c.nor, this.m1 );
            c.norU2.scale( c.nor, this.m2 );

            c.tanU1.scale( c.tan, this.m1 );
            c.tanU2.scale( c.tan, this.m2 );

            c.binU1.scale( c.bin, this.m1 );
            c.binU2.scale( c.bin, this.m2 );

            c.norT1.crossVectors( this.tmpP1, c.nor );
            c.tanT1.crossVectors( this.tmpP1, c.tan );
            c.binT1.crossVectors( this.tmpP1, c.bin );

            c.norT2.crossVectors( this.tmpP2, c.nor );
            c.tanT2.crossVectors( this.tmpP2, c.tan );
            c.binT2.crossVectors( this.tmpP2, c.bin );

            i1 = this.i1;
            i2 = this.i2;

            c.norTU1.copy( c.norT1 ).applyMatrix3( i1, true );
            c.tanTU1.copy( c.tanT1 ).applyMatrix3( i1, true );
            c.binTU1.copy( c.binT1 ).applyMatrix3( i1, true );

            c.norTU2.copy( c.norT2 ).applyMatrix3( i2, true );
            c.tanTU2.copy( c.tanT2 ).applyMatrix3( i2, true );
            c.binTU2.copy( c.binT2 ).applyMatrix3( i2, true );

            /*c.norTU1.mulMat( this.i1, c.norT1 );
            c.tanTU1.mulMat( this.i1, c.tanT1 );
            c.binTU1.mulMat( this.i1, c.binT1 );

            c.norTU2.mulMat( this.i2, c.norT2 );
            c.tanTU2.mulMat( this.i2, c.tanT2 );
            c.binTU2.mulMat( this.i2, c.binT2 );*/

            this.tmpC1.crossVectors( c.norTU1, this.tmpP1 );
            this.tmpC2.crossVectors( c.norTU2, this.tmpP2 );
            this.tmp.add( this.tmpC1, this.tmpC2 );
            c.norDen = 1 / ( m1m2 +_Math.dotVectors( c.nor, this.tmp ));

            this.tmpC1.crossVectors( c.tanTU1, this.tmpP1 );
            this.tmpC2.crossVectors( c.tanTU2, this.tmpP2 );
            this.tmp.add( this.tmpC1, this.tmpC2 );
            c.tanDen = 1 / ( m1m2 +_Math.dotVectors( c.tan, this.tmp ));

            this.tmpC1.crossVectors( c.binTU1, this.tmpP1 );
            this.tmpC2.crossVectors( c.binTU2, this.tmpP2 );
            this.tmp.add( this.tmpC1, this.tmpC2 );
            c.binDen = 1 / ( m1m2 +_Math.dotVectors( c.bin, this.tmp ));

            if( p.warmStarted ){

                norImp = p.normalImpulse;

                this.lv1.addScaledVector( c.norU1, norImp );
                this.av1.addScaledVector( c.norTU1, norImp );

                this.lv2.subScaledVector( c.norU2, norImp );
                this.av2.subScaledVector( c.norTU2, norImp );

                c.norImp = norImp;
                c.tanImp = 0;
                c.binImp = 0;
                rvn = 0; // disable bouncing

            } else {

                c.norImp=0;
                c.tanImp=0;
                c.binImp=0;

            }


            if(rvn>-1) rvn=0; // disable bouncing
            
            norTar = this.restitution*-rvn;
            sepV = -(p.penetration+0.005)*invTimeStep*0.05; // allow 0.5cm error
            if(norTar<sepV) norTar=sepV;
            c.norTar = norTar;
            c.last = i==this.num-1;
            c = c.next;
        }
    },

    solve: function(){

        this.tmplv1.copy( this.lv1 );
        this.tmplv2.copy( this.lv2 );
        this.tmpav1.copy( this.av1 );
        this.tmpav2.copy( this.av2 );

        var oldImp1, newImp1, oldImp2, newImp2, rvn, norImp, tanImp, binImp, max, len;

        var c = this.cs;

        while(true){

            norImp = c.norImp;
            tanImp = c.tanImp;
            binImp = c.binImp;
            max = -norImp * this.friction;

            this.tmp.sub( this.tmplv2, this.tmplv1 );

            rvn = _Math.dotVectors( this.tmp, c.tan ) + _Math.dotVectors( this.tmpav2, c.tanT2 ) - _Math.dotVectors( this.tmpav1, c.tanT1 );
        
            oldImp1 = tanImp;
            newImp1 = rvn*c.tanDen;
            tanImp += newImp1;

            rvn = _Math.dotVectors( this.tmp, c.bin ) + _Math.dotVectors( this.tmpav2, c.binT2 ) - _Math.dotVectors( this.tmpav1, c.binT1 );
      
            oldImp2 = binImp;
            newImp2 = rvn*c.binDen;
            binImp += newImp2;

            // cone friction clamp
            len = tanImp*tanImp + binImp*binImp;
            if(len > max * max ){
                len = max/_Math.sqrt(len);
                tanImp *= len;
                binImp *= len;
            }

            newImp1 = tanImp-oldImp1;
            newImp2 = binImp-oldImp2;

            //

            this.tmp.set( 
                c.tanU1.x*newImp1 + c.binU1.x*newImp2,
                c.tanU1.y*newImp1 + c.binU1.y*newImp2,
                c.tanU1.z*newImp1 + c.binU1.z*newImp2
            );

            this.tmplv1.addEqual( this.tmp );

            this.tmp.set(
                c.tanTU1.x*newImp1 + c.binTU1.x*newImp2,
                c.tanTU1.y*newImp1 + c.binTU1.y*newImp2,
                c.tanTU1.z*newImp1 + c.binTU1.z*newImp2
            );

            this.tmpav1.addEqual( this.tmp );

            this.tmp.set(
                c.tanU2.x*newImp1 + c.binU2.x*newImp2,
                c.tanU2.y*newImp1 + c.binU2.y*newImp2,
                c.tanU2.z*newImp1 + c.binU2.z*newImp2
            );

            this.tmplv2.subEqual( this.tmp );

            this.tmp.set(
                c.tanTU2.x*newImp1 + c.binTU2.x*newImp2,
                c.tanTU2.y*newImp1 + c.binTU2.y*newImp2,
                c.tanTU2.z*newImp1 + c.binTU2.z*newImp2
            );

            this.tmpav2.subEqual( this.tmp );

            // restitution part

            this.tmp.sub( this.tmplv2, this.tmplv1 );

            rvn = _Math.dotVectors( this.tmp, c.nor ) + _Math.dotVectors( this.tmpav2, c.norT2 ) - _Math.dotVectors( this.tmpav1, c.norT1 );

            oldImp1 = norImp;
            newImp1 = (rvn-c.norTar)*c.norDen;
            norImp += newImp1;
            if( norImp > 0 ) norImp = 0;

            newImp1 = norImp - oldImp1;

            this.tmplv1.addScaledVector( c.norU1, newImp1 );
            this.tmpav1.addScaledVector( c.norTU1, newImp1 );
            this.tmplv2.subScaledVector( c.norU2, newImp1 );
            this.tmpav2.subScaledVector( c.norTU2, newImp1 );

            c.norImp = norImp;
            c.tanImp = tanImp;
            c.binImp = binImp;

            if(c.last)break;
            c = c.next;
        }

        this.lv1.copy( this.tmplv1 );
        this.lv2.copy( this.tmplv2 );
        this.av1.copy( this.tmpav1 );
        this.av2.copy( this.tmpav2 );

    },

    postSolve: function(){

        var c = this.cs, p;
        var i = this.num;
        while(i--){
        //for(var i=0;i<this.num;i++){
            p = this.ps[i];
            p.normal.copy( c.nor );
            p.tangent.copy( c.tan );
            p.binormal.copy( c.bin );

            p.normalImpulse = c.norImp;
            p.tangentImpulse = c.tanImp;
            p.binormalImpulse = c.binImp;
            p.normalDenominator = c.norDen;
            p.tangentDenominator = c.tanDen;
            p.binormalDenominator = c.binDen;
            c=c.next;
        }
    }

});

export { ContactConstraint };