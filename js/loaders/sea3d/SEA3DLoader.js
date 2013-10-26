/**
 * 	SEA3D.js + three.js
 * 	Copyright (C) 2013 Sunag Entertainment 
 * 
 * 	http://code.google.com/p/sea3d/
 */

//
//	Mesh
//
 
// Local Animation
THREE.Object3D.prototype.UPDATEMATRIXWORLD = THREE.Mesh.prototype.updateMatrixWorld;
THREE.Object3D.prototype.updateMatrixWorld = function(force) {
	if (this.animateMatrix && (this.matrixWorldNeedsUpdate || force)) {
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
 
THREE.Mesh.prototype.setWeightByName = function(name, val) {
	this.morphTargetInfluences[ this.geometry.morphTargets[name] ] = val;
}

THREE.Mesh.prototype.getWeightByName = function(name) {
	return this.morphTargetInfluences[ this.geometry.morphTargets[name] ];
}

THREE.Mesh.prototype.DISPOSE = THREE.Mesh.prototype.dispose;
THREE.Mesh.prototype.dispose = function () {	
	if (this.animation) this.animation.dispose();
	this.DISPOSE();
}

THREE.Mesh.prototype.CLONE = THREE.Mesh.prototype.clone;
THREE.Mesh.prototype.clone = function ( object ) {
	var obj = this.CLONE( object );
	
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
	}
}

THREE.SkinnedMesh.prototype.pause = function() {
	if (this.currentAnimation) {
		this.currentAnimation.pause();			
	}
}

THREE.SkinnedMesh.prototype.play = function(name, offset) {
	if (this.currentAnimation) {		
		this.currentAnimation.stop();
		this.currentAnimation = null;
	}
	
	this.currentAnimation = this.animations[name];	
	this.currentAnimation.play(this.currentAnimation.loop, offset);
}

THREE.SkinnedMesh.prototype.addAnimations = function(animations) {
	this.animations = [];
	
	var nsIndex = animations[0].name.indexOf("/")+1;
	this.animationNamespace = animations[0].name.substring(0, nsIndex);		
	
	for (var i in animations) {								
		THREE.AnimationHandler.add( animations[i] );	
		
		var ns = animations[i].name;	
		var name = ns.substring(nsIndex);
		
		this.animations[i] = new THREE.Animation( this, ns );
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
	var obj = this.CLONE( object );
	
	obj.animations = [];
	
	for (var i in this.animations) {
		obj.animations[i] = new THREE.Animation( obj, this.animations[i].data.name );
		obj.animations[i].loop = this.animations[i].loop;
		obj.animations[i].name = this.animations[i].name;
	}
	
	return obj;
}

//
//	Bone Object (Joint Object)
//

THREE.BoneObject = {
	creat:function(mesh, bone) {
		var obj = new THREE.Object3D();	
		obj.name = bone.name;		
		obj.matrix = bone.skinMatrix;
		obj.matrixAutoUpdate = false;
		mesh.add( obj );
		return obj;
	}
}

//
//	SEA3D
//
 
THREE.SEA3D = function(standard) {
	this.container = undefined;
	this.invertZ = standard != undefined ? !standard : true;	
	this.invertCamera = standard != undefined ? standard : false;	
	this.matrixAutoUpdate = true;	
	this.autoPlay = true;
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

THREE.SEA3D.prototype.setShadowMap = function(light, opacity) {
	light.shadowMapWidth = 
	light.shadowMapHeight = 2048;
	
	light.castShadow = true;
	light.shadowDarkness = opacity;
}

//
//	IO
//

THREE.SEA3D.prototype.getMesh = function(name) {
	return this.objects["m3d/" + name];
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

THREE.SEA3D.prototype.morphVectorToVector3 = function(lista, listb) {
	var n = [];	
	var i = 0, j = 0;
	while(i < lista.length)
		n[j++] = new THREE.Vector3(
			lista[i] + listb[i++], 
			lista[i] + listb[i++], 
			lista[i] + listb[i++]
		);
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

THREE.SEA3D.prototype.applyMatrix = function(obj3d, mtx, invZ) {
	obj3d.position.getPositionFromMatrix( mtx );
	obj3d.rotation.setFromRotationMatrix( mtx );	
	obj3d.scale.getScaleFromMatrix( mtx );	
	
	if (invZ) {
		obj3d.position.z = -obj3d.position.z;
		obj3d.scale.z = -obj3d.scale.z;		
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
	var i = 0, 
		count = raw.length,
		binary = "";
	
	while (i < count) 
		binary += String.fromCharCode( raw[ i++ ] );
		
	return "data:image/png;base64," + window.btoa(binary);
}

THREE.SEA3D.prototype.applyDefaultAnimation = function(sea, ANIMATOR_CLASS) {
	var obj = sea.tag;
	
	for(var i in sea.animations) {
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
	
	for(var i in sea.sequence) {
		var seq = sea.sequence[i],		
			node = new SEA3D.AnimationNode(seq.name, sea.frameRate, seq.count, seq.repeat, seq.intrpl);
		
		for(var j in sea.dataList) {				
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

THREE.SEA3D.prototype.readGeometry = function(sea) {
	var i, j, k, l,
		geo = new THREE.Geometry(),
		vertex, normal, uv;
	
	vertex = geo.vertices = this.vectorToVector3(sea.vertex);	
	normal = this.vectorToVector3(sea.normal);		
	uv = this.vectorToUV(sea.uv);
	
	for (k in uv) {
		geo.faceVertexUvs[k] = [];
	}
	
	for (i in sea.indexes) {		
		var indexes = sea.indexes[i];
		var num_index = indexes.length / 3;
		
		for (j = 0; j < num_index; j++) {
			var index = j * 3,
				indexX, indexY, indexZ;
			
			// invert faces order XZY
			indexX = indexes[index];
			indexZ = indexes[index+1];
			indexY = indexes[index+2];	
			
			var norm = [ 
				normal[ indexX ] , 
				normal[ indexY ] , 
				normal[ indexZ ]
			];
			
			var face = new THREE.Face3( indexX , indexY , indexZ , norm );
			face.materialIndex = i;
			
			geo.faces.push(face);
			
			for (k in uv) {
				var _uv = [
							uv[k][indexX] ,
							uv[k][indexY] ,
							uv[k][indexZ]	
						  ];
							
				geo.faceVertexUvs[k].push( _uv );
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
				var w = 1 - (sea.weight[k + jointIndex[0]] + sea.weight[k + jointIndex[1]] +
							 sea.weight[k + jointIndex[2]] + sea.weight[k + jointIndex[3]]);
				
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
	
	if (!sea.tangent)
		geo.computeTangents();
	
	geo.computeBoundingBox();
	geo.computeBoundingSphere();
	
	geo.name = sea.name;
	
	sea.tag = geo;
}

//
//	Mesh
//

THREE.SEA3D.prototype.readMesh = function(sea) {
	var geo = sea.geometry.tag,
		mesh, mat, skeleton, skeletonAnimation, morpher, morpherNormals;
	
	for (var i in sea.modifiers) {
		var mod = sea.modifiers[i];
		
		switch(mod.type)
		{				
			case SEA3D.Skeleton.prototype.type:
				skeleton = mod;
				geo.bones = skeleton.tag;	
				break;
		
			case SEA3D.Morph.prototype.type:
				morpher = mod;
				morpherNormals = sea.geometry.normal != null;
				break;
		}
	}
	
	for(var i in sea.animations) {
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
				mats[i].morpherNormals = morpherNormals;
			}
			
			mat = new THREE.MeshFaceMaterial( mats );
		} else {
			mat = sea.material[0].tag;
			mat.skinning = skeleton != null;
			mat.morphTargets = morpher != null;
			mat.morpherNormals = morpherNormals;
		}
	}
	
	if (morpher) {
		geo.morphTargets = this.getMorpher( morpher, sea.geometry );
		
		if (!morpherNormals)
			geo.computeMorphNormals();
	}
	
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
	
	images.loadCount = 0;
	
	texture.name = sea.name;
	texture.image = images;	
	texture.flipY = false;	
	
	for ( var i=0, il=sea.faces.length; i<il; ++i) {
		var cubeImage = new Image();
		images[i] = cubeImage;
		
		cubeImage.onload = function () {			
			if (++images.loadCount == 6)
				texture.needsUpdate = true;			
		}

		cubeImage.src = this.bufferToTexture( sea.faces[i].buffer );
	}
	
	this.cubmaps = this.cubmaps || [];
	this.cubmaps.push( this.objects["cmap/" + sea.name] = sea.tag = texture );
}

//
//	Material
//

THREE.SEA3D.prototype.blendMode = {
	add:THREE.AdditiveBlending,
	subtract:THREE.SubtractiveBlending,
	multiply:THREE.SubtractiveBlending
}

THREE.SEA3D.prototype.materialTechnique =
(function(){
	var techniques = {}
	
	// DEFAULT
	techniques[SEA3D.Material.DEFAULT] = 	
	function(tech, mat) {
		mat.emissive.setHex(tech.ambientColor);
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
		// bug: inverted bump if used ivertedX
		mat.normalMap = tech.texture.tag;
	}
	
	// REFLECTION
	techniques[SEA3D.Material.REFLECTION_MAP] = 
	techniques[SEA3D.Material.FRESNEL_REFLECTION] = 	
	function(tech, mat) {
		mat.envMap = tech.texture.tag.clone();		
		mat.envMap.mapping = new THREE.CubeReflectionMapping();	
		
		mat.reflectivity = tech.alpha;
		
		if (tech.kind == SEA3D.Material.FRESNEL_REFLECTION) {
			// not implemented
		}
	}
	
	// REFRACTION
	techniques[SEA3D.Material.REFRACTION_MAP] = 	
	function(tech, mat) {
		mat.envMap = tech.texture.tag.clone();		
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
	
	for(var i in sea.technique) {
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
	var light = new THREE.PointLight( sea.color, sea.multiplier );
	light.name = sea.name;
	
	if (this.invertZ) light.position.set(sea.position.x, sea.position.y, -sea.position.z);
	else light.position.set(sea.position.x, sea.position.y, sea.position.z);
	
	if (sea.shadow)		
		this.setShadowMap(light, sea.shadow.opacity);		
	
	this.lights = this.lights || [];
	this.lights.push( this.objects["lht/" + sea.name] = sea.tag = light );
	
	this.addSceneObject( sea );	
	this.applyDefaultAnimation( sea, THREE.SEA3D.LightAnimator );	
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
	
	for (var i in sea.joint)
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
		
		pos.getPositionFromMatrix( mtx );
		quat.setFromRotationMatrix( mtx );				
				
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
	
	for (var i in sea.joint) {
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
		bone = mesh.bones[sea.joint],
		joint = THREE.BoneObject.creat(mesh, bone);
	
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
	
	for (var i in sea.sequence)	{
		var seq = sea.sequence[i];
		
		var start = seq.start;
		var end = start + seq.count;		
		var ns = sea.name + "/" + seq.name;
		
		animation = {
			name:ns,
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
	
	for(var i in sea.node) {
		var node = sea.node[i],
			vertex = this.morphVectorToVector3(geo.vertex, node.vertex),
			normal = sea.normal ? this.morphVectorToVector3(geo.normal, node.normal) : [];
		
		morphs[node.name] = i;
		morphs[i] = {
			name:node.name, 
			vertices:vertex,
			normals:normal
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
	this.file = new SEA3D.File();
	this.file.scope = this;
	this.file.onComplete = this.onComplete;
	this.file.onProgress = this.onProgress;
	this.file.onCompleteObject = this.onCompleteObject;
	this.file.onDownloadProgress = this.onDownloadProgress;
	this.file.onError = this.onError;
	
	//	SEA3D
	this.file.typeRead[SEA3D.Geometry.prototype.type] = this.readGeometry;
	this.file.typeRead[SEA3D.Mesh.prototype.type] = this.readMesh;	
	this.file.typeRead[SEA3D.Material.prototype.type] = this.readMaterial;
	this.file.typeRead[SEA3D.PointLight.prototype.type] = this.readPointLight;
	this.file.typeRead[SEA3D.DirectionalLight.prototype.type] = this.readDirectionalLight;
	this.file.typeRead[SEA3D.Camera.prototype.type] = this.readCamera;
	this.file.typeRead[SEA3D.Skeleton.prototype.type] = this.readSkeleton;		
	this.file.typeRead[SEA3D.SkeletonLocal.prototype.type] = this.readSkeletonLocal;	
	this.file.typeRead[SEA3D.JointObject.prototype.type] = this.readJointObject;
	this.file.typeRead[SEA3D.CubeMap.prototype.type] = this.readCubeMap;
	this.file.typeRead[SEA3D.Animation.prototype.type] = this.readAnimation;
	
	//	UNIVERSAL
	this.file.typeRead[SEA3D.JPEG.prototype.type] = this.readImage;		
	this.file.typeRead[SEA3D.JPEG_XR.prototype.type] = this.readImage;	
	this.file.typeRead[SEA3D.PNG.prototype.type] = this.readImage;	
	this.file.typeRead[SEA3D.GIF.prototype.type] = this.readImage;	
	
	this.file.load(url);		
}