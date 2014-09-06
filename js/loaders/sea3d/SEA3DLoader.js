/**
 * 	SEA3D.JS + Three.JS
 * 	Copyright (C) 2014 Sunag Entertainment 
 * 
 * 	http://sea3d.poonya.com/
 */

//
//	Mesh
//
 
// Local Animation
THREE.Object3D.prototype.UPDATEMATRIXWORLD = THREE.Object3D.prototype.updateMatrixWorld;
THREE.Object3D.prototype.updateMatrixWorld = function(force) {
	if (this.animateMatrix) {
		this.UPDATEMATRIXWORLD(force);
		
		this.animateMatrix.compose( this.animatePosition, this.animateQuaternion, this.animateScale );
		
		this.matrixWorld.multiplyMatrices( this.matrixWorld, this.animateMatrix );
	}
	else this.UPDATEMATRIXWORLD(force);
}

THREE.Object3D.prototype.setAnimateMatrix = function(val) {
	if (this.getAnimateMatrix() == val) return;
	
	if (val) {
		this.animateMatrix = new THREE.Matrix4();
		
		this.animatePosition = new THREE.Vector3();		
		this.animateQuaternion = new THREE.Quaternion();
		this.animateScale = new THREE.Vector3(1,1,1);
	} else {
		delete this.animateMatrix;
		
		delete this.animatePosition;
		delete this.animateQuaternion;
		delete this.animateScale;		
	}	
	
	this.matrixWorldNeedsUpdate = true;
}
 
THREE.Object3D.prototype.getAnimateMatrix = function() {
	return this.animateMatrix != null;
}
 
THREE.Mesh.prototype.setWeight = function(name, val) {
	this.morphTargetInfluences[ this.geometry.morphTargets[name] ] = val;
}

THREE.Mesh.prototype.getWeight = function(name) {
	return this.morphTargetInfluences[ this.geometry.morphTargets[name] ];
}

THREE.Mesh.prototype.DISPOSE = THREE.Mesh.prototype.dispose;
THREE.Mesh.prototype.dispose = function () {	
	if (this.animation) this.animation.dispose();
	this.DISPOSE();
}

THREE.Mesh.prototype.CLONE = THREE.Mesh.prototype.clone;
THREE.Mesh.prototype.clone = function ( object ) {
	var obj = THREE.Mesh.prototype.CLONE.call( this, object );
	
	if (obj.animation)
		obj.animation = this.animation.clone( obj );
	
	return obj;
}

//
//	Skinning
//

THREE.SkinnedMesh.prototype.stop = function() {
	if (this.currentAnimation) {
		this.currentAnimation.stop();
		this.currentAnimation = null;		
		this.isPlaying = false;
	}
}

THREE.SkinnedMesh.prototype.pause = function() {
	if (this.isPlaying) {
		this.currentAnimation.pause();			
		this.isPlaying = false;
	}
}

THREE.SkinnedMesh.prototype.resume = function() {
	if (!this.isPlaying && this.currentAnimation) {
		this.currentAnimation.pause();			
		this.isPlaying = true;
	}
}

THREE.SkinnedMesh.prototype.isPlaying = false;

THREE.SkinnedMesh.prototype.play = function(name, crossfade, offset) {
	if (this.currentAnimation)	
		this.currentAnimation.stop();			
	
	this.isPlaying = true;
	this.previousAnimation = this.currentAnimation;
	this.currentAnimation = this.animations[name];
	
	if (!this.currentAnimation)
		throw new Error('Animation "' + name + '" not found.');
	
	if (this.previousAnimation && this.previousAnimation !== this.currentAnimation && crossfade > 0)
	{					
		this.previousAnimation.play(this.previousAnimation.currentTime, this.previousAnimation.weight);
		this.currentAnimation.play(offset !== undefined ? offset : this.currentAnimation.currentTime, this.currentAnimation.weight);
		
		THREE.AnimationHandler.addCrossfade( this, crossfade );	
	}
	else
	{
		this.currentAnimation.play(offset !== undefined ? offset : this.currentAnimation.currentTime, 1);
	}
}

THREE.SkinnedMesh.prototype.addAnimations = function(animations) {	
	this.animations = [];
	
	for (var i = 0; i < animations.length; i++) {								
		var name = animations[i].name;
		
		this.animations[i] = new THREE.Animation( this, animations[i] );
		this.animations[i].loop = animations[i].repeat;
		this.animations[i].name = name;
		
		this.animations[name] = this.animations[i];
	}	
}

THREE.SkinnedMesh.prototype.DISPOSE = THREE.SkinnedMesh.prototype.dispose;
THREE.SkinnedMesh.prototype.dispose = function () {	
	this.stop();
	this.animations = null;	
	this.DISPOSE();
}

THREE.SkinnedMesh.prototype.CLONE = THREE.SkinnedMesh.prototype.clone;
THREE.SkinnedMesh.prototype.clone = function ( object ) {
	
	var obj = THREE.SkinnedMesh.prototype.CLONE.call( this, object );
	obj.animations = [];
	var refAnimations = this.geometry.animations;
	
	for (var i = 0; i < refAnimations.length; i++) {
		var name = refAnimations[i].name;
		var data = refAnimations[i];
		data.initialized = false;
		obj.animations[i] = new THREE.Animation( obj, data );
		obj.animations[i].loop = refAnimations[i].repeat;
		obj.animations[i].name = name;
		obj.animations[name] = obj.animations[i];
	}
	return obj;
}

//
//	ThreeJS Animation + Crossfade extension
//

THREE.AnimationHandler.crossfade = [];

THREE.AnimationHandler.UPDATE = THREE.AnimationHandler.update;
THREE.AnimationHandler.update = function( delta ) {
	var i = 0, cf = THREE.AnimationHandler.crossfade;
	
	while ( i < cf.length ) {
		var mesh = cf[i];
		
		mesh.currentAnimation.weight += delta / mesh.crossfade;
		
		if (mesh.currentAnimation.weight > 1) {
			mesh.currentAnimation.weight = 1;			
			
			if (mesh.onCrossfadeComplete)
				mesh.onCrossfadeComplete( mesh );
			
			cf.splice( i, 1 );
			
			delete mesh.crossfade;
		}
		else ++i;
		
		mesh.previousAnimation.weight = 1 - mesh.currentAnimation.weight;
	}
	
	THREE.AnimationHandler.UPDATE( delta );
}

THREE.AnimationHandler.addCrossfade = function( mesh, crossfade ) {	
	if (mesh.crossfade !== undefined)
		THREE.AnimationHandler.crossfade.splice( THREE.AnimationHandler.crossfade.indexOf( mesh ), 1 );
	
	mesh.crossfade = crossfade;	
	
	THREE.AnimationHandler.crossfade.push( mesh );
}

//
//	Animation Event extension
//

THREE.Animation.prototype.STOP = THREE.Animation.prototype.stop;
THREE.Animation.prototype.stop = function() {
	if (this.onComplete)
		this.onComplete( this );
	
	this.STOP();
}

//
//	Sound3D
//

THREE.Sound3D = function( src, volume, distance ) {	
	THREE.Object3D.call( this );
	
	this.audio = new Audio();	
	this.audio.src = src;	
	this.audio.load();		
	
	this.distance = distance !== undefined ? distance : 1000;
	this.volume = volume !== undefined ? volume : 1;
	
	this.playing = false;
}

THREE.Sound3D.prototype = Object.create( THREE.Object3D.prototype );

THREE.Sound3D.prototype.loop = false;

THREE.Sound3D.prototype.play = function(offset) {
	if (offset !== undefined && this.audio.duration > 0)
	{		
		this.audio.currentTime = offset;	
	}
	
	this.audio.loop = this.loop;
	this.audio.play();	
	
	if (!this.playing)
	{		
		this.index = THREE.Sound3D.sounds.length;
		THREE.Sound3D.sounds.push( this );
		this.playing = true;
	}
}

THREE.Sound3D.prototype.stop = function() {
	if (this.audio.duration > 0) 
		this.audio.currentTime = 0;
	
	this.pause();	
}

THREE.Sound3D.prototype.pause = function() {
	this.audio.pause();	
	
	if (this.playing)
	{
		THREE.Sound3D.sounds.splice( this.index, 1 );
		this.playing = false;
	}
}

THREE.Sound3D.prototype.update = function( camera ) {
	var soundPosition = new THREE.Vector3();
	soundPosition.setFromMatrixPosition( this.matrixWorld );
	
	var cameraPosition = new THREE.Vector3();
	cameraPosition.setFromMatrixPosition( camera.matrixWorld );		
	
	var distance = soundPosition.distanceTo( cameraPosition );

	var volume = this.volume * (1 - ( distance / (this.distance * 3) ));
	
	this.audio.volume = Math.max(0, Math.min(1, volume));
}

THREE.Sound3D.sounds = [];

THREE.Sound3D.update = function( camera ) {
	var sounds = THREE.Sound3D.sounds;
	for(var i = 0; i < sounds.length; i++) {
		sounds[i].update( camera );
	}
}

//
//	Bone (Extension)
//

/*
THREE.Bone.prototype.autoUpdate = false;

THREE.Bone.prototype.updateSkinMatrix = THREE.Bone.prototype.update;

THREE.Bone.prototype.update = function( parentSkinMatrix, forceUpdate ) {
	if (this.autoUpdate) this.updateSkinMatrix( parentSkinMatrix, forceUpdate );	
}
*/

//
//	Bone Object (Joint Object)
//

THREE.BoneObject = function (mesh, bone) {	

	THREE.Object3D.call( this );
			
	this.name = bone.name;		
	this.bone = bone;			
		
	this.matrix = bone.parent instanceof THREE.Bone ? bone.matrixWorld : bone.matrix;
	//this.matrix = bone.matrixWorld;
	this.matrixAutoUpdate = false;		
	
	/*
	var me = this;
	var updateMatrixWorld = this.updateMatrixWorld;	
	this.updateMatrixWorld = function(force) {				
		updateMatrixWorld.call(me, force);		
	}
	*/
	
	mesh.add( this );
	
}

THREE.BoneObject.fromName = function(mesh, name) {
	for(var i = 0, bl = this.bones.length; i < bl; i++)
	{
		if (name == mesh.bones[i].name)
		{
			return new THREE.BoneObject(mesh, name);
		}
	}
	
	return null;
}

THREE.BoneObject.prototype = Object.create( THREE.Object3D.prototype );

THREE.BoneObject.prototype.clone = function ( object ) {

	if ( object === undefined ) object = new THREE.BoneObject( this.name, this.bone );

	THREE.Object3D.prototype.clone.call( this, object );

	return object;
	
}

//
//	SEA3D
//
 
THREE.SEA3D = function(standard) {
	this.container = undefined;
	this.invertZ = standard != undefined ? !standard : true;	
	this.invertCamera = standard != undefined ? standard : false;	
	
	this.objects = {};	
}

THREE.SEA3D.prototype = {
	constructor: THREE.SEA3D,
	
	addEventListener: THREE.EventDispatcher.prototype.addEventListener,
	hasEventListener: THREE.EventDispatcher.prototype.hasEventListener,
	removeEventListener: THREE.EventDispatcher.prototype.removeEventListener,
	dispatchEvent: THREE.EventDispatcher.prototype.dispatchEvent
}

//
//	Config
//

THREE.SEA3D.AUTO = 'auto'; 
THREE.SEA3D.DEFAULT = 'default';
THREE.SEA3D.BUFFER = 'buffer';

THREE.SEA3D.backgroundColor = 0x333333;
THREE.SEA3D.helperColor = 0x9AB9E5;
THREE.SEA3D.textureSize = 512;

THREE.SEA3D.prototype.setShadowMap = function(light, opacity) {
	light.shadowMapWidth = 
	light.shadowMapHeight = 2048;
	
	light.castShadow = true;
	light.shadowDarkness = opacity !== undefined ? opacity : 1;
}

THREE.SEA3D.prototype.tangent = true;
THREE.SEA3D.prototype.bounding = true;
THREE.SEA3D.prototype.autoPlay = true;
THREE.SEA3D.prototype.emissive = false;
THREE.SEA3D.prototype.matrixAutoUpdate = true;

THREE.SEA3D.prototype.parser = THREE.SEA3D.AUTO;

//
//	Output
//

THREE.SEA3D.prototype.getMesh = function(name) {
	return this.objects["m3d/" + name];
}

THREE.SEA3D.prototype.getDummy = function(name) {
	return this.objects["dmy/" + name];
}

THREE.SEA3D.prototype.getLine = function(name) {
	return this.objects["line/" + name];
}

THREE.SEA3D.prototype.getSound3D = function(name) {
	return this.objects["sn3d/" + name];
}

THREE.SEA3D.prototype.getMaterial = function(name) {
	return this.objects["mat/" + name];
}

THREE.SEA3D.prototype.getLight = function(name) {
	return this.objects["lht/" + name];
}

THREE.SEA3D.prototype.getCamera = function(name) {
	return this.objects["cam/" + name];
}

THREE.SEA3D.prototype.getTexture = function(name) {
	return this.objects["tex/" + name];
}

THREE.SEA3D.prototype.getCubeMap = function(name) {
	return this.objects["cmap/" + name];
}

THREE.SEA3D.prototype.getJointObject = function(name) {
	return this.objects["jnt/" + name];
}

THREE.SEA3D.prototype.getSound3D = function(name) {
	return this.objects["sn3d/" + name];
}

THREE.SEA3D.prototype.getSprite = function(name) {
	return this.objects["m2d/" + name];
}

//
//	Utils
//

THREE.SEA3D.prototype.isPowerOfTwo = function(num) {
	return num ? ((num & -num) == num) : false;
}

THREE.SEA3D.prototype.nearestPowerOfTwo = function(num) {
	return Math.pow( 2, Math.round( Math.log( num ) / Math.LN2 ) );
}

THREE.SEA3D.prototype.vectorToVector3 = function(list) {
	var n = [];	
	var i = 0, j = 0;
	while(i < list.length)
		n[j++] = new THREE.Vector3(list[i++], list[i++], list[i++]);
	return n;
}

THREE.SEA3D.prototype.vectorToUV = function(list) {
	var uvs = [];
	for(var ch=0;ch<list.length;ch++) {
		var uv_ch = uvs[ch] = [];
		var uv = list[ch];
		for(var i=0,j=0;i<uv.length;i+=2) {
			uv_ch[j++] = new THREE.Vector2(uv[i], uv[i+1]);
		}
	}
	return uvs;
}

THREE.SEA3D.prototype.toVector3 = function(data) {
	return new THREE.Vector3(data.x, data.y, data.z);
}

THREE.SEA3D.prototype.scaleColor = function(color, scale) {
	var r = (color >> 16) * scale;
    var g = (color >> 8 & 0xFF) * scale;
    var b = (color & 0xFF) * scale;

    return (r << 16 | g << 8 | b);
}

THREE.SEA3D.prototype.updateScene = function () {
	if (this.materials != undefined) {
		for(var i = 0, l = this.materials.length; i < l; ++i) {
			this.materials[i].needsUpdate = true;
		}		
	}
}

THREE.SEA3D.prototype.applyMatrix = function(obj3d, mtx, invZ) {		
	if (invZ) 
	{		
		var me = mtx.elements;
		
		var rotate = new THREE.Matrix4
			(
				me[0], me[4], -me[8], me[12],
				me[1], me[5], -me[9], me[13],
				me[2], me[6], me[10], me[14],
				me[3], me[7], me[11], me[15]
			);
		
		obj3d.position.setFromMatrixPosition( mtx );		
		obj3d.scale.setFromMatrixScale( mtx );
		
		// ignore rotation scale
		rotate.scale( new THREE.Vector3( 1 / obj3d.scale.x, 1 / obj3d.scale.y, 1 / obj3d.scale.z ) );		
		obj3d.rotation.setFromRotationMatrix( rotate );	
		
		obj3d.position.z = -obj3d.position.z;
		obj3d.scale.z = -obj3d.scale.z;				
	} 
	else 
	{						
		obj3d.position.setFromMatrixPosition( mtx );
		obj3d.scale.setFromMatrixScale( mtx );		
				
		// ignore rotation scale
		mtx.scale( new THREE.Vector3( 1 / obj3d.scale.x, 1 / obj3d.scale.y, 1 / obj3d.scale.z ) );		
		obj3d.rotation.setFromRotationMatrix( mtx );
	}
}

THREE.SEA3D.prototype.updateMatrix = function(obj3d, sea) {
	var mtx = new THREE.Matrix4();
	mtx.elements = sea.transform;
	
	if (!sea.isStatic) {
		this.applyMatrix(obj3d, mtx, this.invertZ && !sea.parent);		
		obj3d.matrixAutoUpdate = this.matrixAutoUpdate;
	} else {	
		if (this.invertZ) this.applyMatrix(obj3d, mtx, !sea.parent);
		else obj3d.matrix = mtx;
		
		obj3d.matrixAutoUpdate = false;		
	}		
}

THREE.SEA3D.prototype.addSceneObject = function(sea) {
	if (sea.parent)			
		sea.parent.tag.add( sea.tag ); 
	else if (this.container)
		this.container.add( sea.tag );
}

THREE.SEA3D.prototype.bufferToTexture = function(raw) {
	return "data:image/png;base64," + SEA3D.Stream.bufferToBase64(raw);
}

THREE.SEA3D.prototype.bufferToSound = function(raw) {
	return "data:audio/mp3;base64," + SEA3D.Stream.bufferToBase64(raw);
}

THREE.SEA3D.prototype.applyDefaultAnimation = function(sea, ANIMATOR_CLASS) {
	var obj = sea.tag;
	
	for(var i = 0, count = sea.animations ? sea.animations.length : 0; i < count; i++) {
		var anm = sea.animations[i];			
		
		switch(anm.tag.type) {
			case SEA3D.Animation.prototype.type:
				obj.animation = new ANIMATOR_CLASS(obj, anm.tag.tag);
				obj.animation.setRelative( anm.relative );
		
				if (this.autoPlay) obj.animation.play( obj.animation.getStateNameByIndex(0) );
				
				return obj.animation;
				break;
		}
	}
}

//
//	Animation
//

THREE.SEA3D.prototype.readAnimation = function(sea) {
	var anmSet = new SEA3D.AnimationSet();
	
	for(var i = 0; i < sea.sequence.length; i++) {
		var seq = sea.sequence[i],		
			node = new SEA3D.AnimationNode(seq.name, sea.frameRate, seq.count, seq.repeat, seq.intrpl);
		
		for(var j = 0; j < sea.dataList.length; j++) {				
			var anmData = sea.dataList[j];						
			node.addData( new SEA3D.AnimationData(anmData.kind, anmData.type, anmData.data, seq.start * anmData.blockSize) );
		}
		
		anmSet.addAnimation( node );
	}
	
	this.animationSets = this.animationSets || [];
	this.animationSets.push(this.objects[sea.name + '.#anm'] = sea.tag = anmSet);
}

//
//	Object3D Animator
//

THREE.SEA3D.Object3DAnimator = function(object3d, animationSet) {
	SEA3D.AnimationHandler.call( this, animationSet );	
	this.object3d = object3d;	
}

THREE.SEA3D.Object3DAnimator.prototype = Object.create( SEA3D.AnimationHandler.prototype );

THREE.SEA3D.Object3DAnimator.prototype.STOP = THREE.SEA3D.Object3DAnimator.prototype.stop;
THREE.SEA3D.Object3DAnimator.prototype.stop = function() {
	if (this.relative) 
	{
		this.object3d.animatePosition = new THREE.Vector3();		
		this.object3d.animateQuaternion = new THREE.Quaternion();
		this.object3d.animateScale = new THREE.Vector3(1,1,1);
	}
	
	this.STOP();	
}

THREE.SEA3D.Object3DAnimator.prototype.setRelative = function(val) {
	this.object3d.setAnimateMatrix( this.relative = val );	
}

THREE.SEA3D.Object3DAnimator.prototype.updateAnimationFrame = function(frame, kind) {
	if (this.relative) {		
		switch(kind) {
			case SEA3D.Animation.POSITION:	
				var v = frame.toVector();
				this.object3d.animatePosition.set(v.x, v.y, v.z);	
				break;
				
			case SEA3D.Animation.ROTATION:			
				var v = frame.toVector();				
				this.object3d.animateQuaternion.set(v.x, v.y, v.z, v.w);
				break;	
				
			case SEA3D.Animation.SCALE:	
				var v = frame.toVector();		
				this.object3d.animateScale.set(v.x, v.y, v.z);
				break;
		}
		
		this.object3d.matrixWorldNeedsUpdate = true;
	} else {
		switch(kind) {
			case SEA3D.Animation.POSITION:					
				var v = frame.toVector();
				this.object3d.position.set(v.x, v.y, v.z);				
				break;
				
			case SEA3D.Animation.ROTATION:		
				var v = frame.toVector();				
				this.object3d.quaternion.set(v.x, v.y, v.z, v.w);
				break;	
				
			case SEA3D.Animation.SCALE:	
				var v = frame.toVector();
				this.object3d.scale.set(v.x, v.y, v.z);
				break;
		}
	}
}

//
//	Camera Animator
//

THREE.SEA3D.CameraAnimator = function(object3d, animationSet) {
	THREE.SEA3D.Object3DAnimator.call( this, object3d, animationSet );	
}

THREE.SEA3D.CameraAnimator.prototype = Object.create( THREE.SEA3D.Object3DAnimator.prototype );

THREE.SEA3D.CameraAnimator.prototype.updateAnimationFrame = function(frame, kind) {
	switch(kind) {
		case SEA3D.Animation.FOV:	
			this.object3d.fov = frame.getX();
			break;	
	
		default:	
			this.$updateAnimationFrame(frame, kind);
			break;
	}
}

THREE.SEA3D.CameraAnimator.prototype.$updateAnimationFrame = THREE.SEA3D.Object3DAnimator.prototype.updateAnimationFrame;

//
//	Light Animator
//

THREE.SEA3D.LightAnimator = function(object3d, animationSet) {
	THREE.SEA3D.Object3DAnimator.call( this, object3d, animationSet );	
}

THREE.SEA3D.LightAnimator.prototype = Object.create( THREE.SEA3D.Object3DAnimator.prototype );

THREE.SEA3D.LightAnimator.prototype.updateAnimationFrame = function(frame, kind) {
	switch(kind) {
		case SEA3D.Animation.COLOR:	
			this.object3d.color.setHex( frame.getX() );			
			break;	
			
		case SEA3D.Animation.MULTIPLIER:		
			this.object3d.intensity = frame.getX();
			break;
			
		default:			
			this.$updateAnimationFrame(frame, kind);
			break;
	}
}

THREE.SEA3D.LightAnimator.prototype.$updateAnimationFrame = THREE.SEA3D.Object3DAnimator.prototype.updateAnimationFrame;

//
//	Geometry
//

THREE.SEA3D.prototype.readGeometrySwitch = function(sea) {
	if (sea.numVertex < 0xFFFE && !sea.joint && (!sea.uv || sea.uv.length === 1) && sea.indexes.length === 1)
	{
		this.readGeometryBuffer(sea);
	}
	else
	{
		this.readGeometry(sea);
	}
}

THREE.SEA3D.prototype.readGeometryBuffer = function(sea) {
	var	index = sea.indexes[0],
		count = index.length,
		geo = new THREE.BufferGeometry();
	
	var indices, position, normals, uv;
			
	geo.attributes = {
		
		index : {
			itemSize: 1,
			array: indices = new Uint16Array( count )
		},
		
		position : {
			itemSize: 3,
			array: position = new Float32Array( count * 3 )
		},
				
		uv : {
			itemSize: 2,
			array: uv = new Float32Array( count * 2 )
		}
	}
	
	var a, b, c,
		v = sea.vertex,
		n = sea.normal,
		u = sea.uv ? sea.uv[0] : undefined;
	
	if (n)
	{
		geo.attributes.normal = {
			itemSize: 3,
			array: normals = new Float32Array( count * 3 )
		}
	}
	
	for (var f = 0, vt = 0, vu=0; f < count; f+=3, vt+=9, vu+=6) {
	
		// index
	
		a = index[ f     ] * 3;
		b = index[ f + 2 ] * 3;
		c = index[ f + 1 ] * 3;
		
		// position
		
		position[ vt     ] = v[ a     ];
		position[ vt + 1 ] = v[ a + 1 ];
		position[ vt + 2 ] = v[ a + 2 ];
		
		position[ vt + 3 ] = v[ b     ];
		position[ vt + 4 ] = v[ b + 1 ];
		position[ vt + 5 ] = v[ b + 2 ];
		
		position[ vt + 6 ] = v[ c     ];
		position[ vt + 7 ] = v[ c + 1 ];
		position[ vt + 8 ] = v[ c + 2 ];
		
		// normal
		
		if (n)
		{
			normals[ vt     ] = n[ a     ];
			normals[ vt + 1 ] = n[ a + 1 ];
			normals[ vt + 2 ] = n[ a + 2 ];
			
			normals[ vt + 3 ] = n[ b     ];
			normals[ vt + 4 ] = n[ b + 1 ];
			normals[ vt + 5 ] = n[ b + 2 ];
			
			normals[ vt + 6 ] = n[ c     ];
			normals[ vt + 7 ] = n[ c + 1 ];
			normals[ vt + 8 ] = n[ c + 2 ];
		}
		
		// uv
		
		
		if (u)
		{
			a = index[ f     ] * 2;
			b = index[ f + 2 ] * 2;
			c = index[ f + 1 ] * 2;
			
			uv[ vu     ] = u[ a     ];
			uv[ vu + 1 ] = u[ a + 1 ];
		
			uv[ vu + 2 ] = u[ b     ];
			uv[ vu + 3 ] = u[ b + 1 ];
			
			uv[ vu + 4 ] = u[ c     ];
			uv[ vu + 5 ] = u[ c + 1 ];
		}
		else
		{
			uv[ vu     ] = 0;
			uv[ vu + 1 ] = 0;
		
			uv[ vu + 2 ] = 0;
			uv[ vu + 3 ] = 1;		
			
			uv[ vu + 4 ] = 1;
			uv[ vu + 5 ] = 1;
		}
		
		// indices
		
		indices[ f     ] = f;
		indices[ f + 1 ] = f + 1;
		indices[ f + 2 ] = f + 2;
	}	
		
	//geo.computeOffsets( count );
	
	if (!n)	
		geo.computeVertexNormals();	
	
	if (this.tangent && !sea.tangent)
		geo.computeTangents();
		
	if (this.bounding)
	{
		geo.computeBoundingBox();
		geo.computeBoundingSphere();
	}
	
	geo.name = sea.name;
	
	sea.tag = geo;
}

THREE.SEA3D.prototype.readGeometry = function(sea) {
	var i, j, k, l,
		geo = new THREE.Geometry(),
		vertex, normal, uv;
	
	vertex = geo.vertices = this.vectorToVector3(sea.vertex);	
	if (sea.normal) normal = this.vectorToVector3(sea.normal);		
	if (sea.uv) 
	{
		uv = this.vectorToUV(sea.uv);
	
		for (k = 0; k < uv.length; k++) {
			geo.faceVertexUvs[k] = [];
		}
	}
	
	for (i = 0; i < sea.indexes.length; i++) {		
		var indexes = sea.indexes[i];
		var num_index = indexes.length / 3;
		
		for (j = 0; j < num_index; j++) {
			var index = j * 3,
				indexX, indexY, indexZ;
			
			// invert faces order XZY
			indexX = indexes[index];
			indexZ = indexes[index+1];
			indexY = indexes[index+2];	
			
			var face = new THREE.Face3( indexX , indexY , indexZ , normal ? [ 
				normal[ indexX ] , 
				normal[ indexY ] , 
				normal[ indexZ ]
			] : undefined );
			face.materialIndex = i;
			
			geo.faces.push(face);
			
			if (uv)
			{
				for (k = 0; k < uv.length; k++) {
					var _uv = [
								uv[k][indexX] ,
								uv[k][indexY] ,
								uv[k][indexZ]	
							  ];
								
					geo.faceVertexUvs[k].push( _uv );
				}
			}
			else
			{
				geo.faceVertexUvs[ 0 ].push( [
					new THREE.Vector2( 0, 0 ),
					new THREE.Vector2( 0, 1 ),
					new THREE.Vector2( 1, 1 )
				] );
			}
		}				
	}
	
	// for skeleton animation
	
	if (sea.joint) {
		var indice_buffer = [0,0,0,0];
		var weight_buffer = [0,0,0,0];
		
		var jointPerVertex = sea.jointPerVertex;
		
		if (jointPerVertex > 4) {
			console.warn( "WebGLRenderer: Joint Per Vertex can not be greater than 4 (currently " + sea.jointPerVertex + "). Using compression for joints." );
			for (k = 0; k < sea.joint.length; k+=jointPerVertex) {
				
				var jointIndex = [0];
				
				// get indices with greater influence
				for (l = 1; l < jointPerVertex; l++) {		
					var w = sea.weight[k + l],
						actW = sea.weight[k + jointIndex[0]];
					
					if (w > actW) jointIndex.unshift( l );
					else jointIndex.push( l );
				}
				
				// diferrence
				var w = (1 - ((sea.weight[k + jointIndex[0]] + sea.weight[k + jointIndex[1]] +
							 sea.weight[k + jointIndex[2]] + sea.weight[k + jointIndex[3]]))) / 4;
				
				// compress
				for (l = 0; l < 4; l++) {
					i = jointIndex[l];
					
					indice_buffer[l] = sea.joint[k + i];			
					weight_buffer[l] = sea.weight[k + i] + w;
				}
				
				geo.skinIndices.push( new THREE.Vector4( indice_buffer[0], indice_buffer[1], indice_buffer[2], indice_buffer[3] ) );
				geo.skinWeights.push( new THREE.Vector4( weight_buffer[0], weight_buffer[1], weight_buffer[2], weight_buffer[3] ) );
			}			
		} else {	
			for (k = 0; k < sea.joint.length; k+=jointPerVertex) {
				
				for (l = 0; l < jointPerVertex; l++) {
					indice_buffer[l] = sea.joint[k + l];			
					weight_buffer[l] = sea.weight[k + l];
				}					
				
				geo.skinIndices.push( new THREE.Vector4( indice_buffer[0], indice_buffer[1], indice_buffer[2], indice_buffer[3] ) );
				geo.skinWeights.push( new THREE.Vector4( weight_buffer[0], weight_buffer[1], weight_buffer[2], weight_buffer[3] ) );
			}
		}
	}
	
	if (!sea.normal)
	{
		geo.computeFaceNormals();
		geo.computeVertexNormals();
	}
	
	if (this.tangent && !sea.tangent)
		geo.computeTangents();
	
	if (this.bounding)
	{
		geo.computeBoundingBox();
		geo.computeBoundingSphere();
	}
	
	geo.name = sea.name;
	
	sea.tag = geo;
}

//
//	Dummy
//

THREE.SEA3D.prototype.readDummy = function(sea) {
	var geo = new THREE.BoxGeometry( sea.width, sea.height, sea.depth, 1, 1, 1 );	
	var mat = new THREE.MeshBasicMaterial( { wireframe: true, color: THREE.SEA3D.helperColor } );	
	
	var dummy = new THREE.Mesh( geo, mat );
	dummy.name = sea.name;
	
	this.dummys = this.dummys || [];
	this.dummys.push( this.objects["dmy/" + sea.name] = sea.tag = dummy );
	
	this.updateMatrix(dummy, sea);		
	
	this.addSceneObject( sea );
	this.applyDefaultAnimation( sea, THREE.SEA3D.Object3DAnimator );
}

//
//	Line
//

THREE.SEA3D.prototype.readLine = function(sea) {	
	var geo = new THREE.Geometry();	
	geo.vertices = this.vectorToVector3( sea.vertex );	
	
	if (sea.closed)	
		geo.vertices.push( geo.vertices[0] );	
	
	var line = new THREE.Line( geo, new THREE.LineBasicMaterial( { color: THREE.SEA3D.helperColor, linewidth: 3 } ) );	
	line.name = sea.name;
		
	this.lines = this.lines || [];
	this.lines.push( this.objects["line/" + sea.name] = sea.tag = line );
	
	this.updateMatrix(line, sea);		
	
	this.addSceneObject( sea );
	this.applyDefaultAnimation( sea, THREE.SEA3D.Object3DAnimator );
}

//
//	Container3D
//

THREE.SEA3D.prototype.readContainer3D = function(sea) {
	var container = new THREE.Object3D();		
	
	this.containers = this.containers || [];
	this.containers.push( this.objects["c3d/" + sea.name] = sea.tag = container );
	
	this.updateMatrix(container, sea);		
	
	this.addSceneObject( sea );
	this.applyDefaultAnimation( sea, THREE.SEA3D.Object3DAnimator );
}

//
//	Mesh2D | Sprite
//

THREE.SEA3D.prototype.readMesh2D = function(sea) {
	var material;
	
	if ( sea.material )
	{
		if ( !sea.material.tag.sprite )
		{
			material = sea.material.tag.sprite = new THREE.SpriteMaterial();
			
			material.map = sea.material.tag.map;
			material.map.flipY = true;
			
			material.color = this.emissive ? sea.material.tag.emissive : sea.material.tag.ambient;
			material.opacity = sea.material.tag.opacity;
			material.blending = sea.material.tag.blending;
		}
		else material = sea.material.tag.sprite;
	}
	
	var sprite = new THREE.Sprite( material );
	sprite.name = sea.name;
	
	sprite.scale.set( sea.width, sea.height, 1 );
	
	sprite.position.set( sea.position.x, sea.position.y, this.invertZ && !sea.parent ? -sea.position.z : sea.position.z );
	
	this.sprites = this.sprites || [];
	this.sprites.push( this.objects["m2d/" + sea.name] = sea.tag = sprite );
	
	this.addSceneObject( sea );	
}

//
//	Mesh
//

THREE.SEA3D.prototype.readMesh = function(sea) {
	var geo = sea.geometry.tag,
		mesh, mat, skeleton, skeletonAnimation, morpher;
		
	for(var i = 0, count = sea.modifiers ? sea.modifiers.length : 0; i < count; i++) {
		var mod = sea.modifiers[i];
		
		switch(mod.type)
		{				
			case SEA3D.Skeleton.prototype.type:
				skeleton = mod;
				geo.bones = skeleton.tag;	
				break;
		
			case SEA3D.Morph.prototype.type:
				morpher = mod;
				break;
		}
	}
	
	for(var i = 0, count = sea.animations ? sea.animations.length : 0; i < count; i++) {
		var anm = sea.animations[i];			
		
		switch(anm.tag.type)
		{
			case SEA3D.SkeletonAnimation.prototype.type:
				skeletonAnimation = anm.tag;
				geo.animations = this.getSkeletonAnimation( skeletonAnimation, skeleton );	
				break;
		}
	}
	
	if (sea.material) {
		if (sea.material.length > 1) {
			var mats = [];
			
			for(var i = 0; i < sea.material.length; i++) {
				mats[i] = sea.material[i].tag;
				mats[i].skinning = skeleton != null;
				mats[i].morphTargets = morpher != null;
				mats[i].morphNormals = false;
			}
			
			mat = new THREE.MeshFaceMaterial( mats );
		} else {
			mat = sea.material[0].tag;
			mat.skinning = skeleton != null;
			mat.morphTargets = morpher != null;
			mat.morphNormals = false;
		}
	}
	
	if (morpher)
		geo.morphTargets = this.getMorpher( morpher, sea.geometry );		
	
	if (skeleton) {
		mesh = new THREE.SkinnedMesh( geo, mat, false );				
		
		if (skeletonAnimation) {
			mesh.addAnimations( geo.animations );
			if (this.autoPlay) mesh.play( mesh.animations[0].name );
		}
	} else {
		mesh = new THREE.Mesh( geo, mat );
	}
	
	mesh.name = sea.name;
	
	mesh.castShadow = sea.castShadows;
	mesh.receiveShadow = sea.material ? sea.material[0].receiveShadows : true;
	
	this.meshes = this.meshes || [];
	this.meshes.push( this.objects["m3d/" + sea.name] = sea.tag = mesh );
			
	this.updateMatrix(mesh, sea);				
	
	this.addSceneObject( sea );
	this.applyDefaultAnimation( sea, THREE.SEA3D.Object3DAnimator );
}

//
//	Sound Point
//

THREE.SEA3D.prototype.readSoundPoint = function(sea) {
	var sound3d = new THREE.Sound3D( sea.sound.tag, sea.volume, sea.distance );
	
	sound3d.position.set( sea.position.x, sea.position.y, this.invertZ && !sea.parent ? -sea.position.z : sea.position.z  );
	
	if (sea.autoPlay) {
		sound3d.loop = true;
		sound3d.play();
	}
	
	sound3d.name = sea.name;
	
	this.sounds3d = this.sounds3d || [];
	this.sounds3d.push( this.objects["sn3d/" + sea.name] = sea.tag = sound3d );	
	
	this.addSceneObject( sea );
	this.applyDefaultAnimation( sea, THREE.SEA3D.Object3DAnimator );
}

//
//	Cube Render
//

THREE.SEA3D.prototype.readCubeRender = function(sea) {	
	var cube = new THREE.CubeCamera( 0.1, 5000, THREE.SEA3D.textureSize );	
	cube.renderTarget.cubeCamera = cube;	
	
	cube.position.set( sea.position.x, sea.position.y, this.invertZ ? -sea.position.z : sea.position.z );
	
	this.cubeRenderers = this.cubeRenderers || [];
	this.cubeRenderers.push( this.objects["rttc/" + sea.name] = sea.tag = cube.renderTarget );	
	
	this.addSceneObject( sea );
	this.applyDefaultAnimation( sea, THREE.SEA3D.Object3DAnimator );
}

//
//	Images (WDP, JPEG, PNG and GIF)
//

THREE.SEA3D.prototype.readImage = function(sea) {		
	var image = new Image(), texture = new THREE.Texture(), scope = this;
	
	texture.name = sea.name;
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;	
	texture.flipY = false;
	
	image.onload = function () { 		
		if (!scope.isPowerOfTwo(image.width) || 
			!scope.isPowerOfTwo(image.height))
		{		
			var width = scope.nearestPowerOfTwo( image.width ),
				height = scope.nearestPowerOfTwo( image.height );
		
			var canvas = document.createElement( "canvas" );

			canvas.width = width;
			canvas.height = height;

			var ctx = canvas.getContext( "2d" );

			ctx.drawImage( image, 0, 0, width, height );
		
			image = canvas;
		}
		
		texture.image = image;
		texture.needsUpdate = true; 	
	}
	
	image.src = this.bufferToTexture( sea.data.buffer );	
	
	this.textures = this.textures || [];
	this.textures.push( this.objects["tex/" + sea.name] = sea.tag = texture );
}

//
//	Cube Map
//

THREE.SEA3D.prototype.readCubeMap = function(sea) {		
	var images = [], 
		texture = new THREE.Texture();
	
	// xyz(- / +) to xyz(+ / -) sequence
	var faces = [];
	faces[0] = sea.faces[1];
	faces[1] = sea.faces[0];
	faces[2] = sea.faces[3];
	faces[3] = sea.faces[2];
	faces[4] = sea.faces[5];
	faces[5] = sea.faces[4];
	
	images.loadedCount = 0;
	
	texture.name = sea.name;
	texture.image = images;	
	texture.flipY = false;	
	
	for ( var i=0, il=faces.length; i<il; ++i) {
		var cubeImage = new Image();
		images[i] = cubeImage;
		
		cubeImage.onload = function () {			
			if (++images.loadedCount == 6)
				texture.needsUpdate = true;			
		}

		cubeImage.src = this.bufferToTexture( faces[i].buffer );
	}
	
	this.cubmaps = this.cubmaps || [];
	this.cubmaps.push( this.objects["cmap/" + sea.name] = sea.tag = texture );
}

//
//	Sound (MP3, OGG)
//

THREE.SEA3D.prototype.readSound = function(sea) {	
	var sound = this.bufferToSound( sea.data.buffer );
	
	this.sounds = this.sounds || [];
	this.sounds.push( this.objects["snd/" + sea.name] = sea.tag = sound );
}

//
//	Texture URL
//

THREE.SEA3D.prototype.readTextureURL = function(sea) {	
	var texture = THREE.ImageUtils.loadTexture( sea.url );
	
	texture.name = sea.name;
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;	
	texture.flipY = false;
	
	this.textures = this.textures || [];
	this.textures.push( this.objects["tex/" + sea.name] = sea.tag = texture );
}

//
//	Material
//

THREE.SEA3D.prototype.blendMode = {
	normal:THREE.NormalBlending,
	add:THREE.AdditiveBlending,
	subtract:THREE.SubtractiveBlending,
	multiply:THREE.MultiplyBlending,
	screen:THREE.AdditiveBlending,
}

THREE.SEA3D.prototype.materialTechnique =
(function(){
	var techniques = {}
	
	// DEFAULT
	techniques[SEA3D.Material.DEFAULT] = 	
	function(tech, mat) {
		if (this.emissive) mat.emissive.setHex(tech.ambientColor);
		else mat.ambient.setHex(tech.ambientColor);
		mat.color.setHex(tech.diffuseColor);
		mat.specular.setHex(this.scaleColor(tech.specularColor, tech.specular));
		mat.shininess = tech.gloss;
	}
	
	// DIFFUSE_MAP	
	techniques[SEA3D.Material.DIFFUSE_MAP] = 	
	function(tech, mat) {							
		mat.map = tech.texture.tag;
		mat.transparent = tech.texture.transparent;
	}
	
	// SPECULAR_MAP
	techniques[SEA3D.Material.SPECULAR_MAP] = 	
	function(tech, mat) {
		mat.specularMap = tech.texture.tag;
	}
	
	// NORMAL_MAP
	techniques[SEA3D.Material.NORMAL_MAP] = 	
	function(tech, mat) {
		// bug: inverted bump if used invertZ
		mat.normalMap = tech.texture.tag;
	}
	
	// REFLECTION
	techniques[SEA3D.Material.REFLECTION] = 
	techniques[SEA3D.Material.FRESNEL_REFLECTION] = 	
	function(tech, mat) {
		mat.envMap = tech.texture.tag;		
		mat.envMap.mapping = new THREE.CubeReflectionMapping();	
		mat.combine = THREE.MixOperation;
		
		mat.reflectivity = tech.alpha;
		
		if (tech.kind == SEA3D.Material.FRESNEL_REFLECTION) {
			// not implemented
		}
	}
	
	// REFRACTION
	techniques[SEA3D.Material.REFRACTION_MAP] = 	
	function(tech, mat) {
		mat.envMap = tech.texture.tag;		
		mat.envMap.mapping = new THREE.CubeRefractionMapping();		
		
		mat.refractionRatio = tech.ior;
		mat.reflectivity = tech.alpha;
	}
	
	// REFRACTION
	techniques[SEA3D.Material.REFRACTION_MAP] = 	
	function(tech, mat) {
		mat.envMap = tech.texture.tag;		
		mat.envMap.mapping = new THREE.CubeRefractionMapping();		
		
		mat.refractionRatio = tech.ior;
		mat.reflectivity = tech.alpha;
	}
	
	// LIGHT_MAP
	techniques[SEA3D.Material.LIGHT_MAP] = 	
	function(tech, mat) {
		mat.lightMap = tech.texture.tag;
	}
	
	return techniques;
})();

THREE.SEA3D.prototype.readMaterial = function(sea) {	
	var mat = new THREE.MeshPhongMaterial();
	mat.name = sea.name;
	
	mat.side = sea.bothSides ? THREE.DoubleSide : THREE.FrontSide;
	mat.shading = sea.smooth ? THREE.SmoothShading : THREE.FlatShading;
	
	if (sea.blendMode != "normal" && this.blendMode[sea.blendMode])
		mat.blending = this.blendMode[sea.blendMode];
	
	if (sea.alpha < 1 || mat.blending > THREE.NormalBlending) {
		mat.opacity = sea.alpha;
		mat.transparent = true;
	}
	
	for(var i = 0; i < sea.technique.length; i++) {
		var tech = sea.technique[i];
		
		if (this.materialTechnique[tech.kind])			
			this.materialTechnique[tech.kind].call(this, tech, mat);
	}
	
	if (mat.transparent) {
		mat.alphaTest = sea.alphaThreshold;
	}
	
	this.materials = this.materials || [];
	this.materials.push( this.objects["mat/" + sea.name] = sea.tag = mat );
}

//
//	Point Light
//

THREE.SEA3D.prototype.readPointLight = function(sea) {	
	var light = new THREE.PointLight( sea.color, sea.multiplier, sea.attenuation !== undefined ? sea.attenuation.end : undefined );
	light.name = sea.name;
	
	light.position.set( sea.position.x, sea.position.y, this.invertZ && !sea.parent ? -sea.position.z : sea.position.z );	
	
	if (sea.shadow)		
		this.setShadowMap(light, sea.shadow.opacity);		
	
	this.lights = this.lights || [];
	this.lights.push( this.objects["lht/" + sea.name] = sea.tag = light );
		
	this.addSceneObject( sea );	
	this.applyDefaultAnimation( sea, THREE.SEA3D.LightAnimator );	
	
	this.updateScene();
}

//
//	Directional Light
//

THREE.SEA3D.prototype.readDirectionalLight = function(sea) {	
	var light = new THREE.DirectionalLight( sea.color, sea.multiplier );	
	light.name = sea.name;
	
	this.updateMatrix(light, sea);
	
	if (sea.shadow)		
		this.setShadowMap(light, sea.shadow.opacity);			
	
	this.lights = this.lights || [];
	this.lights.push( this.objects["lht/" + sea.name] = sea.tag = light );
	
	this.addSceneObject( sea );	
	this.applyDefaultAnimation( sea, THREE.SEA3D.LightAnimator );
	
	this.updateScene();
}

//
//	Camera
//

THREE.SEA3D.prototype.readCamera = function(sea) {	
	var camera = new THREE.PerspectiveCamera( sea.fov );	
	camera.name = sea.name;
	
	this.updateMatrix(camera, sea);
	
	if (this.invertCamera)
		camera.scale.set(-1, 1, 1);
	
	this.cameras = this.camera || [];
	this.cameras.push( this.objects["cam/" + sea.name] = sea.tag = camera );
	
	this.addSceneObject( sea );	
	this.applyDefaultAnimation( sea, THREE.SEA3D.CameraAnimator );
}

//
//	Skeleton
//

THREE.SEA3D.prototype.readSkeleton = function(sea) {		
	var bones = [],		
		mtx_inv = new THREE.Matrix4(),
		mtx = new THREE.Matrix4(),
		pos = new THREE.Vector3(),
		quat = new THREE.Quaternion();
	
	rootMatrix = new THREE.Matrix4();
	rootMatrix.elements = sea.joint[0].inverseBindMatrix;		
	
	for (var i = 0; i < sea.joint.length; i++)
	{
		var bone = sea.joint[i]			
		
		mtx_inv.elements = bone.inverseBindMatrix;		
		mtx = new THREE.Matrix4();
		mtx.getInverse( mtx_inv );
		
		if (bone.parentIndex > -1)
		{
			mtx_inv.elements = sea.joint[bone.parentIndex].inverseBindMatrix;						
			mtx.multiplyMatrices( mtx_inv, mtx );	
		}
		
		pos.setFromMatrixPosition( mtx );
		quat.setFromRotationMatrix( mtx );

		//mtx.decompose(pos, quat, scale);				
				
		bones[i] = {
				name:bone.name,
				pos:[pos.x, pos.y, pos.z],				
				rotq:[quat.x, quat.y, quat.z, quat.w],
				parent:bone.parentIndex
			}		
	}
		
	sea.tag = bones;
}

//
//	Skeleton Local
//

THREE.SEA3D.prototype.readSkeletonLocal = function(sea) {	
	var bones = [];
	
	for (var i = 0; i < sea.joint.length; i++) {
		var bone = sea.joint[i];
		
		bones[i] = {
				name:bone.name,
				pos:[bone.x, bone.y, bone.z],				
				rotq:[bone.qx, bone.qy, bone.qz, bone.qw],
				parent:bone.parentIndex
			}
	}
	
	sea.tag = bones;
}

//
//	Joint Object
//

THREE.SEA3D.prototype.readJointObject = function(sea) {	
	var mesh = sea.target.tag,
		bone = mesh.skeleton.bones[sea.joint],
		joint = new THREE.BoneObject(mesh, bone);
	
	joint.name = sea.name;
	
	this.joints = this.joints || [];
	this.joints.push( this.objects["jnt/" + sea.name] = sea.tag = joint );
	
	this.addSceneObject( sea );
	
}

//
//	Skeleton Animation
//

THREE.SEA3D.prototype.getSkeletonAnimation = function(sea, skl) {	
	if (sea.tag) return sea.tag;
	
	var animations = [],
		delta = sea.frameRate / 1000,
		scale = [1,1,1];
	
	for (var i = 0; i < sea.sequence.length; i++) {
		var seq = sea.sequence[i];
		
		var start = seq.start;
		var end = start + seq.count;				
		
		animation = {
			name:seq.name,
			repeat:seq.repeat,
			fps:sea.frameRate,
			JIT:0,
			length:delta * (seq.count - 1),
			hierarchy:[]
		}
		
		var len = sea.pose[0].length;
		
		for (var j = 0; j < len; j++) {			
			var bone = skl.joint[j],
				node = {parent:bone.parentIndex, keys:[]},
				keys = node.keys,
				time = 0;
			
			for (var t = start; t < end; t++) {	
				var joint = sea.pose[t][j];
							
				keys.push({
					time:time,								
					pos:[joint.x, joint.y, joint.z],												
					rot:[joint.qx, joint.qy, joint.qz, joint.qw],										
					scl:scale
				});
				
				time += delta;
			}
			
			animation.hierarchy[j] = node;
		}
		
		animations.push( animation );
	}
	
	return sea.tag = animations;		
}

//
//	Morpher
//

THREE.SEA3D.prototype.getMorpher = function(sea, geo) {	
	var morphs = [];
	
	for(var i = 0; i < sea.node.length; i++) {
		var node = sea.node[i],
			vertex = [];
				
		var j = 0, k = 0;
		while(j < geo.vertex.length)
			vertex[k++] = new THREE.Vector3(
				geo.vertex[j] + node.vertex[j++], 
				geo.vertex[j] + node.vertex[j++], 
				geo.vertex[j] + node.vertex[j++]
			);
		
		morphs[node.name] = i;
		morphs[i] = {
			name:node.name, 
			vertices:vertex			
		}
	}
	
	return morphs;
}

//
//	Events
//

THREE.SEA3D.Event = {
	PROGRESS:"progress",
	DOWNLOAD_PROGRESS:"download_progress",
	COMPLETE:"complete",
	OBJECT_COMPLETE:"object_complete",
	ERROR:"error"
}

THREE.SEA3D.prototype.onComplete = function( args ) {
	args.file = this.scope; args.type = THREE.SEA3D.Event.COMPLETE; 	
	args.file.dispatchEvent(args);
	//console.log("SEA3D:", args.message);
}

THREE.SEA3D.prototype.onProgress = function( args ) {
	args.file = this.scope; args.type = THREE.SEA3D.Event.PROGRESS;
	args.file.dispatchEvent(args);
	//console.log("SEA3D:", args.progress);
}

THREE.SEA3D.prototype.onDownloadProgress = function( args ) {
	args.file = this.scope; args.type = THREE.SEA3D.Event.DOWNLOAD_PROGRESS;
	args.file.dispatchEvent(args);
	//console.log("SEA3D:", args.progress);
}


THREE.SEA3D.prototype.onCompleteObject = function( args ) {
	args.file = this.scope; args.type = THREE.SEA3D.Event.OBJECT_COMPLETE;
	args.file.dispatchEvent(args);
	//console.log("SEA3D:", args.object.name + "." + args.object.type);
}

THREE.SEA3D.prototype.onError = function(  ) {
	args.file = this.scope; args.type = THREE.SEA3D.Event.ERROR;
	args.file.dispatchEvent(args);
	//console.log("SEA3D:", args.message);
}

//
//	Loader
//

THREE.SEA3D.prototype.load = function( url ) {			
	this.loadBytes();
	this.file.load(url);		
}

THREE.SEA3D.prototype.loadBytes = function( data ) {			
	this.file = new SEA3D.File( data );
	this.file.scope = this;
	this.file.onComplete = this.onComplete;
	this.file.onProgress = this.onProgress;
	this.file.onCompleteObject = this.onCompleteObject;
	this.file.onDownloadProgress = this.onDownloadProgress;
	this.file.onError = this.onError;
	
	//	SEA3D
	
	switch(this.parser)
	{
		case THREE.SEA3D.AUTO: 
			this.file.typeRead[SEA3D.Geometry.prototype.type] = 
			this.file.typeRead[SEA3D.GeometryDelta.prototype.type] =
				this.readGeometrySwitch; 
			break;
			
		case THREE.SEA3D.BUFFER: 
			this.file.typeRead[SEA3D.Geometry.prototype.type] = 
			this.file.typeRead[SEA3D.GeometryDelta.prototype.type] = 
				this.readGeometryBuffer; 
			break;
			
		default: 
			this.file.typeRead[SEA3D.Geometry.prototype.type] = 
			this.file.typeRead[SEA3D.GeometryDelta.prototype.type] = 
				this.readGeometry; 			
			break;
	}	
	
	this.file.typeRead[SEA3D.Mesh.prototype.type] = this.readMesh;	
	this.file.typeRead[SEA3D.Mesh2D.prototype.type] = this.readMesh2D;	
	this.file.typeRead[SEA3D.Container3D.prototype.type] = this.readContainer3D;	
	this.file.typeRead[SEA3D.Dummy.prototype.type] = this.readDummy;	
	this.file.typeRead[SEA3D.Line.prototype.type] = this.readLine;	
	this.file.typeRead[SEA3D.Material.prototype.type] = this.readMaterial;
	this.file.typeRead[SEA3D.PointLight.prototype.type] = this.readPointLight;
	this.file.typeRead[SEA3D.DirectionalLight.prototype.type] = this.readDirectionalLight;
	this.file.typeRead[SEA3D.Camera.prototype.type] = this.readCamera;
	this.file.typeRead[SEA3D.Skeleton.prototype.type] = this.readSkeleton;		
	this.file.typeRead[SEA3D.SkeletonLocal.prototype.type] = this.readSkeletonLocal;	
	this.file.typeRead[SEA3D.JointObject.prototype.type] = this.readJointObject;
	this.file.typeRead[SEA3D.CubeMap.prototype.type] = this.readCubeMap;
	this.file.typeRead[SEA3D.CubeRender.prototype.type] = this.readCubeRender;	
	this.file.typeRead[SEA3D.Animation.prototype.type] = this.readAnimation;
	this.file.typeRead[SEA3D.SoundPoint.prototype.type] = this.readSoundPoint;	
	this.file.typeRead[SEA3D.TextureURL.prototype.type] = this.readTextureURL;	
	
	//	UNIVERSAL
	this.file.typeRead[SEA3D.JPEG.prototype.type] = this.readImage;		
	this.file.typeRead[SEA3D.JPEG_XR.prototype.type] = this.readImage;	
	this.file.typeRead[SEA3D.PNG.prototype.type] = this.readImage;	
	this.file.typeRead[SEA3D.GIF.prototype.type] = this.readImage;	
	this.file.typeRead[SEA3D.MP3.prototype.type] = this.readSound;	
	
	if (data) this.file.read();	
}