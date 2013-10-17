/**
 * 	SEA3D.js + Three.js
 * 	Copyright (C) 2013 Sunag Entertainment 
 * 
 * 	http://code.google.com/p/sea3d/
 * 
 * 	@author: Jean Carlo Deconto (Brazil) - never give up without trying...
 */

//
//	Extension
//
 
//	Morpher
 
THREE.Mesh.prototype.setWeightByName = function(name, val) {
	this.morphTargetInfluences[ this.geometry.morphTargets[name] ] = val;
}

THREE.Mesh.prototype.getWeightByName = function(name) {
	return this.morphTargetInfluences[ this.geometry.morphTargets[name] ];
}
 
//	Skinning

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

//	Bone

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
	this.useSEA3DStandard = standard != undefined ? standard : false;
	this.matrixAutoUpdate = true;
	this.invertCamera = true;
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

THREE.SEA3D.prototype.setShadowMap = function(light) {
	light.shadowMapWidth = 
	light.shadowMapHeight = 2048;
	
	light.castShadow = true;
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

THREE.SEA3D.prototype.getBitmap = function(name) {
	return this.objects["bmp/" + name];
}

THREE.SEA3D.prototype.getTexture = function(name) {
	return this.objects["tex/" + name];
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

THREE.SEA3D.prototype.applyMatrix = function(obj3d, mtx, inv) {
	obj3d.position.getPositionFromMatrix( mtx );
	//obj3d.rotation.setEulerFromRotationMatrix( mtx );
	obj3d.rotation.setFromRotationMatrix( mtx );
	obj3d.scale.getScaleFromMatrix( mtx );	
	
	if (inv) {
		obj3d.position.z = -obj3d.position.z;
		obj3d.scale.z = -obj3d.scale.z;		
	}
}

THREE.SEA3D.prototype.updateMatrix = function(obj3d, sea) {
	var mtx = new THREE.Matrix4();
	mtx.elements = sea.transform;
	
	if (!sea.isStatic) {
		this.applyMatrix(obj3d, mtx, !this.useSEA3DStandard && !sea.parent);		
		obj3d.matrixAutoUpdate = this.matrixAutoUpdate;
	} else {	
		if (!this.useSEA3DStandard)
			this.applyMatrix(obj3d, mtx, !sea.parent);
		else obj3d.matrix = mtx;
		
		obj3d.matrixAutoUpdate = false;		
	}		
}

THREE.SEA3D.prototype.addSceneObject = function(sea) {
	if (sea.parent) {
		if (sea.parent.joint != null) {
			var mesh = sea.parent.object.tag,
				bone = mesh.bones[sea.parent.joint];
			if (!bone.object)
				bone.object = THREE.BoneObject.creat(mesh, bone);			
			bone.object.add( sea.tag );	
		} else sea.parent.object.tag.add( sea.tag );
	} else if (this.container)
		this.container.add( sea.tag );
}

THREE.SEA3D.prototype.bufferToTexture = function(raw) {
	var binary = "";
	
	for (var i = 0; i < raw.length; i++)
		binary += String.fromCharCode( raw[ i ] );
		
	return "data:image/png;base64," + window.btoa(binary);
}

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
		mat, mesh;
	
	var skinning = sea.meshType == 
			SEA3D.Mesh.SKELETON || 
			sea.meshType == SEA3D.Mesh.SKELETON_ANIMATION,
		morpher = sea.morphType >= SEA3D.Mesh.MORPH,
		morpherNormals = morpher && sea.geometry.normal;
	
	if (sea.material) {
		if (sea.material.length > 1) {
			var mats = [];
			
			for(var i = 0; i < sea.material.length; i++) {
				mats[i] = sea.material[i].tag;
				mats[i].skinning = skinning;
				mats[i].morphTargets = morpher;
				mats[i].morpherNormals = morpherNormals;
			}
			
			mat = new THREE.MeshFaceMaterial( mats );
		}
		else {
			mat = sea.material[0].tag;
			mat.skinning = skinning;
			mat.morphTargets = morpher;
			mat.morpherNormals = morpherNormals;
		}
	}
	
	if (morpher) {
		geo.morphTargets = this.getMorpher( 
			sea.morph, 
			sea.geometry 
		);
		
		if (!morpherNormals)
			geo.computeMorphNormals();
	}
	
	if (skinning) {
		geo.bones = sea.skeleton.tag; 		
		
		if (sea.meshType == SEA3D.Mesh.SKELETON_ANIMATION && !geo.animations) {
			geo.animations = this.getSkeletonAnimation( 
					sea.skeletonAnimation, 
					sea.skeleton					
				);		
		}
		
		mesh = new THREE.SkinnedMesh( geo, mat, false );				
		
		if (sea.meshType == SEA3D.Mesh.SKELETON_ANIMATION) {
			mesh.addAnimations( geo.animations );
			mesh.play( mesh.animations[0].name );
		}
	}
	else {
		mesh = new THREE.Mesh( geo, mat );
	}
	
	mesh.name = sea.name;
	
	mesh.castShadow = sea.castShadows;
	mesh.receiveShadow = sea.receiveShadows;
	
	this.meshes = this.meshes || [];
	this.meshes.push( this.objects["m3d/" + sea.name] = sea.tag = mesh );
			
	this.updateMatrix(mesh, sea);				
	
	this.addSceneObject( sea );
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
	
	this.bitmaps = this.bitmaps || [];
	this.bitmaps.push( this.objects["bmp/" + sea.name] = sea.tag = texture );
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
	
	sea.tag = texture;
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
	
	techniques[SEA3D.Material.DEFAULT] = 
	//	DEFAULT
	function(tech, mat) {
		mat.emissive.setHex(tech.ambientColor);
		mat.color.setHex(tech.diffuseColor);
		mat.specular.setHex(this.scaleColor(tech.specularColor, tech.specular));
		mat.shininess = tech.gloss;
	}
	
	techniques[SEA3D.Material.DIFFUSE_TEXTURE] = 
	//	DIFFUSE_TEXTURE
	function(tech, mat) {						
		var tex = tech.texture;		
		mat.map = tech.texture.tag;
		mat.transparent = tech.texture.firstLayer.map.transparent;
		
		var lightMap = tex.getLayerByName("LightMap");
		if (lightMap) {
			mat.lightMap = lightMap.texture.map.tag;
		}
	}
	
	techniques[SEA3D.Material.SPECULAR_MAP] = 
	//	SPECULAR_MAP
	function(tech, mat) {
		mat.specularMap = tech.texture.tag;
	}
	
	techniques[SEA3D.Material.NORMAL_MAP] = 
	//	NORMAL_MAP
	function(tech, mat) {
		// bug: inverted for SEA3D Standard
		mat.normalMap = tech.texture.tag;
	}
	
	techniques[SEA3D.Material.REFLECTION_MAP] = 
	techniques[SEA3D.Material.FRESNEL_REFLECTION] = 
	//	REFLECTION
	function(tech, mat) {
		if (tech.texture) {
			mat.envMap = tech.texture.tag.clone();		
			mat.envMap.mapping = new THREE.CubeReflectionMapping();			
		} else {
			// runtime reflection - not implemented
		}
		
		mat.reflectivity = tech.alpha;
		
		if (tech.kind == SEA3D.Material.FRESNEL_REFLECTION) {
			// not implemented
		}
	}
	
	techniques[SEA3D.Material.REFRACTION_MAP] = 
	//	REFRACTION
	function(tech, mat) {
		if (tech.texture) {
			mat.envMap = tech.texture.tag.clone();		
			mat.envMap.mapping = new THREE.CubeRefractionMapping();			
		} else {	
			// runtime refraction - not implemented
		}
		
		mat.refractionRatio = tech.ior;
		mat.reflectivity = tech.alpha;
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
//	Texture
//

THREE.SEA3D.prototype.readTexture = function(sea) {	
	// multilayer ... not implemented
	sea.tag = sea.firstLayer.map.tag;
	
	this.textures = this.textures || [];
	this.textures.push( this.objects["tex/" + sea.name] = sea.tag );
}

//
//	Point Light
//

THREE.SEA3D.prototype.readPointLight = function(sea) {	
	var light = new THREE.PointLight( sea.color, sea.multiplier );
	light.name = sea.name;
	
	light.position.set(sea.position.x, sea.position.y, sea.position.z);
	
	if (sea.shadow)		
		this.setShadowMap(light);		
	
	this.lights = this.lights || [];
	this.lights.push( this.objects["lht/" + sea.name] = sea.tag = light );
	
	this.addSceneObject( sea );			
}

//
//	Directional Light
//

THREE.SEA3D.prototype.readDirectionalLight = function(sea) {	
	var light = new THREE.DirectionalLight( sea.color, sea.multiplier );	
	light.name = sea.name;
	
	this.updateMatrix(light, sea);
	
	if (sea.shadow)		
		this.setShadowMap(light);		
	
	this.lights = this.lights || [];
	this.lights.push( this.objects["lht/" + sea.name] = sea.tag = light );
	
	this.addSceneObject( sea );	
}

//
//	Camera
//

THREE.SEA3D.prototype.readCamera = function(sea) {	
	var camera = new THREE.PerspectiveCamera( sea.fov );
	camera.name = sea.name;
	
	this.updateMatrix(camera, sea);
	
	if (this.useSEA3DStandard && this.invertCamera)
		camera.scale.set(-1, 1, 1);
	
	this.cameras = this.camera || [];
	this.cameras.push( this.objects["cam/" + sea.name] = sea.tag = camera );
	
	this.addSceneObject( sea );	
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
//	Skeleton Animation
//

THREE.SEA3D.prototype.getSkeletonAnimation = function(sea, skl) {	
	if (sea.tag) return sea.tag;
	
	var sequences = sea.sequence ? sea.sequence.list : [SEA3D.AnimationSequence.getRootSequence( sea )],	
		animations = [],
		delta = sea.frameRate / 1000,
		scale = [1,1,1];
	
	for (var i in sequences)	
	{
		var seq = sequences[i];
		
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
		};
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
	this.file.typeRead[SEA3D.Texture.prototype.type] = this.readTexture;
	this.file.typeRead[SEA3D.Material.prototype.type] = this.readMaterial;
	this.file.typeRead[SEA3D.PointLight.prototype.type] = this.readPointLight;
	this.file.typeRead[SEA3D.DirectionalLight.prototype.type] = this.readDirectionalLight;
	this.file.typeRead[SEA3D.Camera.prototype.type] = this.readCamera;
	this.file.typeRead[SEA3D.Skeleton.prototype.type] = this.readSkeleton;		
	this.file.typeRead[SEA3D.SkeletonLocal.prototype.type] = this.readSkeletonLocal;		
	this.file.typeRead[SEA3D.CubeMap.prototype.type] = this.readCubeMap;			
	
	//	UNIVERSAL
	this.file.typeRead[SEA3D.JPEG.prototype.type] = this.readImage;		
	this.file.typeRead[SEA3D.JPEG_XR.prototype.type] = this.readImage;	
	this.file.typeRead[SEA3D.PNG.prototype.type] = this.readImage;	
	this.file.typeRead[SEA3D.GIF.prototype.type] = this.readImage;	
	
	this.file.load(url);		
}