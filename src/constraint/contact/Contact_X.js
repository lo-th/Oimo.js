import { ContactLink } from './ContactLink';
import { ImpulseDataBuffer } from './ImpulseDataBuffer_X';
import { ContactManifold } from './ContactManifold';
import { ContactConstraint } from './ContactConstraint_X';
import { _Math } from '../../math/Math';

/**
* A contact is a pair of shapes whose axis-aligned bounding boxes are overlapping.
*
* @author saharan
* @author lo-th
*/

function Contact(){

    // The first shape.
    this.shape1 = null;
    // The second shape.
    this.shape2 = null;
    // The first rigid body.
    this.body1 = null;
    // The second rigid body.
    this.body2 = null;
    // Internal
    this.persisting = false;
    // Whether both the rigid bodies are sleeping or not.
    this.sleeping = false;
    // The collision detector between two shapes.
    this.detector = null;
    // The contact constraint of the contact.
    this.constraint = null;
    // Whether the shapes are touching or not.
    this.touching = false;
    // shapes is very close and touching 
    this.close = false;

    this.dist = _Math.INF;

    this.b1Link = new ContactLink( this );
    this.b2Link = new ContactLink( this );
    this.s1Link = new ContactLink( this );
    this.s2Link = new ContactLink( this );

    // The contact manifold of the contact.
    this.manifold = new ContactManifold();

    this.buffer = [

        new ImpulseDataBuffer(),
        new ImpulseDataBuffer(),
        new ImpulseDataBuffer(),
        new ImpulseDataBuffer()

    ];

    this.points = this.manifold.points;
    this.constraint = new ContactConstraint( this.manifold );

}

Object.assign( Contact.prototype, {

    Contact: true,

    mixRestitution: function ( a, b ) {

        return _Math.sqrt( a * b );

    },

    mixFriction: function ( a, b ) {

        return _Math.sqrt( a * b );

    },

    // Update the contact manifold.
    updateManifold: function () {

        

        var i, j, b, p, num, numBuffers, distance1, distance2, index, minDistance, tmp;

        this.constraint.restitution = this.mixRestitution( this.shape1.restitution, this.shape2.restitution );
        this.constraint.friction = this.mixFriction( this.shape1.friction, this.shape2.friction );

        numBuffers = this.manifold.numPoints;
        
        i = numBuffers;

        while( i-- ){

            b = this.buffer[i];
            p = this.points[i];
            b.lp1.copy( p.localPoint1 );
            b.lp2.copy( p.localPoint2 );
            b.impulse = p.normalImpulse;

        }

        this.manifold.numPoints = 0;
        this.detector.detectCollision( this.shape1, this.shape2, this.manifold );

        

        num = this.manifold.numPoints;
        if( num === 0 ){
            this.touching = false;
            this.close = false;
            this.dist = _Math.INF;
            return;
        }

        
        if( this.touching || this.dist < 0.001 ) this.close = true;
        this.touching = true;
        
        i = num;

        while( i-- ){

            p = this.points[i];

            index = -1;
            minDistance = 0.0004;

            j = numBuffers;

            while( j-- ){

                b = this.buffer[j];

                distance1 = _Math.distanceVector( b.lp1, p.localPoint1 );
                distance2 = _Math.distanceVector( b.lp2, p.localPoint2 );

                if( distance1 < distance2 ){
                    
                    if( distance1 < minDistance ){
                        minDistance = distance1;
                        index = j;
                    }

                }else{

                    if(distance2 < minDistance){
                        minDistance = distance2;
                        index = j;
                    }

                }

                if( minDistance < this.dist ) this.dist = minDistance;

            }

            if( index !== -1 ){

                tmp = this.buffer[ index ];
                this.buffer[ index ] = this.buffer[ --numBuffers ];
                this.buffer[ numBuffers ] = tmp;
                p.normalImpulse = tmp.impulse;
                p.warmStarted = true;

            }else{

                p.normalImpulse = 0;
                p.warmStarted = false;

            }
        }

    },

    // Attach the contact to the shapes.
    attach:function( shape1, shape2 ){

        this.shape1 = shape1;
        this.shape2 = shape2;
        this.body1 = shape1.parent;
        this.body2 = shape2.parent;

        this.manifold.body1 = this.body1;
        this.manifold.body2 = this.body2;
        //this.constraint.body1 = this.body1;
        //this.constraint.body2 = this.body2;
        this.constraint.attach( shape1, shape2 );

        this.s1Link.shape = shape2;
        this.s1Link.body = this.body2;
        this.s2Link.shape = shape1;
        this.s2Link.body = this.body1;

        this.shape1.contactLink.push( this.s1Link );
        this.shape2.contactLink.push( this.s2Link );

        this.b1Link.shape = shape2;
        this.b1Link.body = this.body2;
        this.b2Link.shape = shape1;
        this.b2Link.body = this.body1;

        this.body1.contactLink.push( this.b1Link );
        this.body2.contactLink.push( this.b2Link );

        this.persisting = true;
        this.sleeping = this.body1.sleeping && this.body2.sleeping;
        this.manifold.numPoints = 0;

    },

    // Detach the contact from the shapes.
    detach:function(){

        this.shape1.contactLink.splice( this.shape1.contactLink.indexOf( this.s1Link ), 1 );
        this.shape2.contactLink.splice( this.shape2.contactLink.indexOf( this.s2Link ), 1 );

        this.body1.contactLink.splice( this.body1.contactLink.indexOf( this.b1Link ), 1 );
        this.body2.contactLink.splice( this.body2.contactLink.indexOf( this.b2Link ), 1 );

        this.s1Link.shape = null;
        this.s1Link.body = null;
        this.s2Link.shape = null;
        this.s2Link.body = null;
        this.b1Link.shape = null;
        this.b1Link.body = null;
        this.b2Link.shape = null;
        this.b2Link.body = null;

        this.manifold.body1 = null;
        this.manifold.body2 = null;
        //this.constraint.body1 = null;
        //this.constraint.body2 = null;
        this.constraint.detach();

        this.shape1 = null;
        this.shape2 = null;
        this.body1 = null;
        this.body2 = null;
        this.detector = null;
        this.constraint = null;

        this.persisting = false;
        this.sleeping = false;
        this.touching = false;
        this.close = false;
        
    }

} );

export { Contact };