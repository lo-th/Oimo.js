<img src="http://lo-th.github.io/Oimo.js/images/logos.png"/>  Oimo.js 
=========
<img src="http://lo-th.github.io/Oimo.js/images/head.jpg"/>
Oimo.js is a lightweight 3d physics engine for javascript.<br>
It's a full javascript conversion of [OimoPhysics](https://github.com/saharan/OimoPhysics) created by [Saharan](http://el-ement.com/blog/) for actionscript 3.0.<br>


Main Demo with three.js, sea3d, worker and editor:

[oimo.js dev](http://lo-th.github.io/Oimo.js/index.html)

[oimo.js rev](http://lo-th.github.io/Oimo.js/index_rev.html)

Basic demo no worker

[basic test](http://lo-th.github.io/Oimo.js/test_basic.html)

[compound test](http://lo-th.github.io/Oimo.js/test_compound.html)

[compound2 test](http://lo-th.github.io/Oimo.js/test_compound2.html)

[ragdoll test](http://lo-th.github.io/Oimo.js/test_ragdoll.html)

[collision test](http://lo-th.github.io/Oimo.js/test_collision.html)

[moving test](http://lo-th.github.io/Oimo.js/test_moving.html)

[terrain test](http://lo-th.github.io/Oimo.js/test_terrain.html)

Basic demo worker transferrable

[worker test](http://lo-th.github.io/Oimo.js/test_worker.html)

Basic demo with png compression (dev:32kb rev:30kb)

[png test](http://lo-th.github.io/Oimo.js/test_basic_png.html)

Experimental demo BVH

[BVH test](http://lo-th.github.io/Oimo.js/test_bvh.html)

[The walker](http://lo-th.github.io/Oimo.js/experimental/walker.html)

=========
Important note :<br>
Oimo Physics use international system units 0.1 to 10 meters max for dynamique body.<br>
In demo with three.js, i scale all by 100, you can change world scale.<br>
for three : OIMO.WORLD_SCALE = 100; OIMO.INV_SCALE = 0.01;<br>
default : OIMO.WORLD_SCALE = 1; OIMO.INV_SCALE = 1;