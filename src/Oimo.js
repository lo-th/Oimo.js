import './polyfills.js';

export * from './constants.js';
export * from './core/Utils.js';

export { _Math as Math } from './math/Math.js';
export { Vec3 } from './math/Vec3.js';
export { Quat } from './math/Quat.js';
export { Mat33 } from './math/Mat33.js';

/*
// broadphase
export { AABB } from './collision/broadphase/AABB.js';
export * from './collision/broadphase/Proxy.js';
export { BasicProxy } from './collision/broadphase/BasicProxy.js';
export { Pair } from './collision/broadphase/Pair.js';
export { BroadPhase } from './collision/broadphase/BroadPhase.js';
export { BruteForceBroadPhase } from './collision/broadphase/BruteForceBroadPhase.js';

export { DBVTNode } from './collision/broadphase/dbvt/DBVTNode.js';
export { DBVT } from './collision/broadphase/dbvt/DBVT.js';
export { DBVTProxy } from './collision/broadphase/dbvt/DBVTProxy.js';
export { DBVTBroadPhase } from './collision/broadphase/dbvt/DBVTBroadPhase.js';

export { SAPAxis } from './collision/broadphase/sap/SAPAxis.js';
export { SAPElement } from './collision/broadphase/sap/SAPElement.js';
export { SAPProxy } from './collision/broadphase/sap/SAPProxy.js';
export { SAPBroadPhase } from './collision/broadphase/sap/SAPBroadPhase.js';

// Collision
export { CollisionDetector } from './collision/narrowphase/CollisionDetector.js';
export { BoxBoxCollisionDetector } from './collision/narrowphase/BoxBoxCollisionDetector.js';
export { BoxCylinderCollisionDetector } from './collision/narrowphase/BoxCylinderCollisionDetector.js';
export { CylinderCylinderCollisionDetector } from './collision/narrowphase/CylinderCylinderCollisionDetector.js';
export { SphereBoxCollisionDetector } from './collision/narrowphase/SphereBoxCollisionDetector.js';
export { SphereCylinderCollisionDetector } from './collision/narrowphase/SphereCylinderCollisionDetector.js';
export { SphereSphereCollisionDetector } from './collision/narrowphase/SphereSphereCollisionDetector.js';
export { TetraTetraCollisionDetector } from './collision/narrowphase/TetraTetraCollisionDetector.js';
export { RayCollisionDetector } from './collision/narrowphase/RayCollisionDetector.js';

// Shape
export { MassInfo } from './collision/shape/MassInfo.js';



// Constraint
export { Constraint } from './constraint/Constraint.js';

export { ContactLink } from './constraint/contact/ContactLink.js';
export { ImpulseDataBuffer } from './constraint/contact/ImpulseDataBuffer.js';
export { ContactPointDataBuffer } from './constraint/contact/ContactPointDataBuffer.js';
export { ManifoldPoint } from './constraint/contact/ManifoldPoint.js';
export { ContactConstraint } from './constraint/contact/ContactConstraint.js';
export { ContactManifold } from './constraint/contact/ContactManifold.js';
export { Contact } from './constraint/contact/Contact.js';

export { AngularConstraint } from './constraint/joint/base/AngularConstraint.js';
export { LinearConstraint } from './constraint/joint/base/LinearConstraint.js';
export { Rotational3Constraint } from './constraint/joint/base/Rotational3Constraint.js';
export { RotationalConstraint } from './constraint/joint/base/RotationalConstraint.js';
export { Translational3Constraint } from './constraint/joint/base/Translational3Constraint.js';
export { TranslationalConstraint } from './constraint/joint/base/TranslationalConstraint.js';
*/


export { Shape } from './shape/Shape.js';
export { Box } from './shape/Box.js';
export { Sphere } from './shape/Sphere.js';
export { Cylinder } from './shape/Cylinder.js';
export { Plane } from './shape/Plane';
export { Particle } from './shape/Particle';
export { ShapeConfig } from './shape/ShapeConfig.js';

//export { TetraShape } from './collision/shape/TetraShape.js';
//export { Joint } from './constraint/joint/Joint.js';
//export { JointLink } from './constraint/joint/JointLink.js';
export { LimitMotor } from './constraint/joint/LimitMotor.js';
export { HingeJoint } from './constraint/joint/HingeJoint.js';
export { BallAndSocketJoint } from './constraint/joint/BallAndSocketJoint.js';
export { DistanceJoint } from './constraint/joint/DistanceJoint.js';
export { PrismaticJoint } from './constraint/joint/PrismaticJoint.js';
export { SliderJoint } from './constraint/joint/SliderJoint.js';
export { WheelJoint } from './constraint/joint/WheelJoint.js';
export { JointConfig } from './constraint/joint/JointConfig.js';




export { RigidBody } from './core/RigidBody.js';
export { World } from './core/World.js';

// test version

//export { RigidBody } from './core/RigidBody_X.js';
//export { World } from './core/World_X.js';
