<p align="center"><a href="http://lo-th.github.io/Oimo.js/"><img src="http://lo-th.github.io/Oimo.js/examples/assets/img/logo.png"/></a><br>
Oimo.js is a lightweight 3d physics engine for javascript.<br>
It's a full javascript conversion of <a href="https://github.com/saharan/OimoPhysics/">OimoPhysics</a><br>
Originally created by <a href="http://el-ement.com/blog/">Saharan</a> for actionscript 3.0.
</p>

### Home ###

- [oimo.js](http://lo-th.github.io/Oimo.js/index.html) (in progress)

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

Download the [minified library](http://lo-th.github.io/Oimo.js/build/three.min.js) and include it in your html.
or use node and install [package](https://www.npmjs.com/package/oimo) : npm install oimo

```html
<script src="js/oimo.min.js"></script>
```

Create physics world

```javascript
world = new OIMO.World({ timestep:1/60, iterations:8, broadphase:2, worldscale:1, random:true, info:false });
```

Add physics object or joint

```javascript
var body = world.add({ type:'sphere', size:[1,1,1], pos:[0,0,0], rot:[0,0,90], move:true, density:1 });

// update world
world.step();

// and copy position and rotation to three mesh
myMesh.position.copy( body.getPosition() );
myMesh.quaternion.copy( body.getQuaternion() );
```

### Note ###

Oimo Physics uses international system units 0.1 to 10 meters max for dynamic body.<br>
In basic demo with three.js, i scale all by 100 so object is between 10 to 10000 three unit.<br>
