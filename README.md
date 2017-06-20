<p align="center"><a href="http://lo-th.github.io/Oimo.js/"><img src="http://lo-th.github.io/Oimo.js/examples/assets/img/logo.png"/></a><br>
Oimo.js is a lightweight 3d physics engine for JavaScript.<br>
It's a full javascript conversion of <a href="https://github.com/saharan/OimoPhysics/">OimoPhysics</a><br>
Originally created by <a href="http://el-ement.com/blog/">Saharan</a> for actionscript 3.0.
<br>
<a href="https://www.npmjs.com/package/oimo">
  <img src="https://img.shields.io/npm/v/oimo.svg" alt="Version">
</a>

<a href="https://cdnjs.com/libraries/oimo">
  <img src="https://img.shields.io/cdnjs/v/oimo.svg" alt="Version">
</a>
</p>

### Home ###

- [oimo.js](http://lo-th.github.io/Oimo.js/index.html) (in progress)

### Docs ###

- [docs](http://lo-th.github.io/Oimo.js/docs.html) (in progress)

### Demo ###

- [Basic test](http://lo-th.github.io/Oimo.js/examples/test_basic.html)
- [Compound test (chair)](http://lo-th.github.io/Oimo.js/examples/test_compound.html)
- [Compound test (capsule)](http://lo-th.github.io/Oimo.js/examples/test_compound2.html)
- [Ragdoll test](http://lo-th.github.io/Oimo.js/examples/test_ragdoll.html)
- [Collision test](http://lo-th.github.io/Oimo.js/examples/test_collision.html)
- [Moving test](http://lo-th.github.io/Oimo.js/examples/test_moving.html)
- [Terrain test](http://lo-th.github.io/Oimo.js/examples/test_terrain.html)
- [Car test](http://lo-th.github.io/Oimo.js/examples/test_vehicle.html)
- [Walker test](http://lo-th.github.io/Oimo.js/examples/test_walker.html)
- [Worker test](http://lo-th.github.io/Oimo.js/examples/test_worker.html)

### Usage ###

Download the [minified library](http://lo-th.github.io/Oimo.js/build/oimo.min.js) and include it in your HTML.<br>
Alternatively, use **Node** and install the [package](https://www.npmjs.com/package/oimo): `npm install oimo`

```html
<script src="js/oimo.min.js"></script>
```

Create physics world:

```javascript
world = new OIMO.World({ 
    timestep: 1/60, 
    iterations: 8, 
    broadphase: 2, // 1 brute force, 2 sweep and prune, 3 volume tree
    worldscale: 1, // scale full world 
    random: true,  // randomize sample
    info: false,   // calculate statistic or not
    gravity: [0,-9.8,0] 
});
```

Add physics object or joint

```javascript
var body = world.add({ 
    type:'sphere', // type of shape : sphere, box, cylinder 
    size:[1,1,1], // size of shape
    pos:[0,0,0], // start position in degree
    rot:[0,0,90], // start rotation in degree
    move:true, // dynamic or statique
    density: 1,
    friction: 0.2,
    restitution: 0.2,
    belongsTo: 1, // The bits of the collision groups to which the shape belongs.
    collidesWith: 0xffffffff; // The bits of the collision groups with which the shape collides.
});

var body = world.add({ 
    type:'jointHinge', // type of joint : jointDistance, jointHinge, jointPrisme, jointSlide, jointWheel
    body1: "b1", // name or id of attach rigidbody
    body2: "b1", // name or id of attach rigidbody
});


// update world
world.step();

// and copy position and rotation to three mesh
myMesh.position.copy( body.getPosition() );
myMesh.quaternion.copy( body.getQuaternion() );
```

### Note ###

Oimo Physics uses international system units: 0.1 to 10 meters max for dynamic body.<br>
In basic demo with THREE, I scaled all by 100 so objects are between 10 to 1000 in THREE units.<br><br>

/!\ Shape name change in last version <br>
SphereShape to Sphere, BoxShape to Box, CylinderShape to Cylinder <br>
