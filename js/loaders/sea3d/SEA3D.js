/**
 * 	SEA3D.js - SEA3D SDK
 * 	Copyright (C) 2013 Sunag Entertainment 
 * 
 * 	http://code.google.com/p/sea3d/
 */

var SEA3D = {VERSION:15002}

//
//	SEA3D Timer
//

SEA3D.Timer = function() {
	this.time = this.start = this.getTime();
}

SEA3D.Timer.prototype.getDeltaTime = function() {
	return this.getTime() - this.time;
}

SEA3D.Timer.prototype.getTime = function() {
	return new Date().getTime();
}

SEA3D.Timer.prototype.getElapsedTime = function() {
	return this.getTime() - this.start;
}

SEA3D.Timer.prototype.update = function() {
	this.time = this.getTime();
}


//
//	STREAM : STANDARD DATA-IO (little-endian)
//

SEA3D.Stream = function(buffer) {
	if (buffer == undefined)
	{		
		this.buffer = new Uint8Array();		
		this.length = this.buffer.length;
	}
	else
	{	
		this.buffer = buffer || new Uint8Array();		
		this.length = this.buffer.length;		
	}
	this.position = 0;
}

SEA3D.Stream.prototype.TWOeN23 = Math.pow(2, -23);
SEA3D.Stream.prototype.TWOeN52 = Math.pow(2, -52);
SEA3D.Stream.prototype.pow = Math.pow;

SEA3D.Stream.prototype.set = function(buffer) {
	this.buffer = buffer;
	this.length = buffer.length;	
}

SEA3D.Stream.prototype.readByte = function() {
	return this.buffer[this.position++];
}

SEA3D.Stream.prototype.readBytes = function(len) {
	var bytes = new Uint8Array(len);
	for (var i=0;i<len;++i) bytes[i] = this.buffer[this.position++];
	return bytes;
}

SEA3D.Stream.prototype.readBool = function() {
	return this.readByte() != 0;
}

SEA3D.Stream.prototype.readUShort = function() {	
	return this.readByte() | (this.readByte() << 8);
}

SEA3D.Stream.prototype.readUInt24 = function() {
	return this.readByte() | (this.readByte() << 8) | (this.readByte() << 16);
}

SEA3D.Stream.prototype.readUInt = function() {
	return this.readByte() | (this.readByte() << 8) | (this.readByte() << 16) | (this.readByte() << 24);
}

SEA3D.Stream.prototype.readFloat = function() {
	var b4 = this.readByte(),
		b3 = this.readByte(),
		b2 = this.readByte(),
		b1 = this.readByte();
	var sign = 1 - ((b1 >> 7) << 1);                   // sign = bit 0
	var exp = (((b1 << 1) & 0xFF) | (b2 >> 7)) - 127;  // exponent = bits 1..8
	var sig = ((b2 & 0x7F) << 16) | (b3 << 8) | b4;    // significand = bits 9..31
	if (sig == 0 && exp == -127)
		return 0.0;
	return sign*(1 + this.TWOeN23*sig)*this.pow(2, exp);
}

SEA3D.Stream.prototype.readVector2 = function() {
	return { x: this.readFloat(), y: this.readFloat() }
}

SEA3D.Stream.prototype.readVector3 = function() {
	return { x: this.readFloat(), y: this.readFloat(), z: this.readFloat() }
}

SEA3D.Stream.prototype.readVector4 = function() {
	return { x: this.readFloat(), y: this.readFloat(), z: this.readFloat(), w: this.readFloat() }
}

SEA3D.Stream.prototype.readMatrix = function() {	
	var mtx = new Float32Array(16);
	
	mtx[0] = this.readFloat();
	mtx[1] = this.readFloat();
	mtx[2] = this.readFloat();
	mtx[3] = 0.0;
	mtx[4] = this.readFloat();
	mtx[5] = this.readFloat();
	mtx[6] = this.readFloat();
	mtx[7] = 0.0;
	mtx[8] = this.readFloat();
	mtx[9] = this.readFloat();
	mtx[10] = this.readFloat();
	mtx[11] = 0.0;
	mtx[12] = this.readFloat();
	mtx[13] = this.readFloat();
	mtx[14] = this.readFloat();
	mtx[15] = 1.0;

	return mtx;
}

SEA3D.Stream.prototype.readString = function(len) {
	return String.fromCharCode.apply(null, new Uint16Array(this.readBytes(len)));
}

SEA3D.Stream.prototype.readExt = function() {
	return this.readString(4).replace("\0", "");
}

SEA3D.Stream.prototype.readStringTiny = function() {
	return this.readString(this.readByte());
}

SEA3D.Stream.prototype.readBlendMode = function() {
	return SEA3D.DataTable.BLEND_MODE[this.readByte()];
}

SEA3D.Stream.prototype.append = function(data) {
	var tmp = new Uint8Array( this.data.byteLength + data.byteLength );
	tmp.set( new Uint8Array( this.data ), 0 );
	tmp.set( new Uint8Array( data ), this.data.byteLength );
	this.data = tmp;
}

SEA3D.Stream.prototype.concat = function(position, length) {	
	return new SEA3D.Stream(this.buffer.subarray( position, position + length ));	
}

SEA3D.Stream.prototype.bytesAvailable = function() {
	return this.length - this.position;
}

//
//	SEA3D Data Table
//

SEA3D.DataTable = 
{
	BLEND_MODE:
	[
		"normal","add","subtract","multiply","dividing","alpha","screen","darken",
		"overlay","colorburn","linearburn","lighten","colordodge","lineardodge",
		"softlight","hardlight","pinlight","spotlight","spotlightblend","hardmix",
		"average","difference","exclusion","hue","saturation","color","value"
	]
}

//
//	SEA3D Object
//

SEA3D.Object = function(name, data, type, sea) {
	this.name = name;
	this.data = data;
	this.type = type;
	this.sea = sea;
}

//
//	SEA3D Geometry Base
//

SEA3D.GeometryBase = function(scope) {
	var data = scope.data;
	
	scope.attrib = data.readUShort();	
	
	scope.isBigMesh = (scope.attrib & 1) != 0;
	
	// variable uint
	data.readVInt = scope.isBigMesh ? data.readUInt : data.readUShort;
	
	scope.numVertex = data.readVInt();
	scope.length = scope.numVertex * 3;
}

//
//	SEA3D Geometry
//

SEA3D.Geometry = function(name, data, sea) {
	var i, vec, len;

	this.name = name;
	this.data = data;	
	this.sea = sea;
	
	SEA3D.GeometryBase(this);
	
	// NORMAL
	if (this.attrib & 4) {
		this.normal = [];		
		
		i = 0;
		while (i < this.length)		
			this.normal[i++] = data.readFloat();	
	}
	
	// TANGENT
	if (this.attrib & 8) {
		this.tangent = [];
		
		i = 0;
		while (i < this.length)	
			tangent[i++] = data.readFloat();
	}
	
	// UV
	if (this.attrib & 32) {
		this.uv = [];
		this.uv.length = data.readByte();
		
		len = this.numVertex * 2;
		
		i = 0;
		while (i < this.uv.length) {
			// UV VERTEX DATA
			this.uv[i++] = vec = [];									
			j = 0; 
			while(j < len) 
				vec[j++] = data.readFloat();		
		}
	}
	
	// JOINT-INDEXES / WEIGHTS
	if (this.attrib & 64) {
		this.jointPerVertex = data.readByte();
		
		var jntLen = this.numVertex * this.jointPerVertex;
		
		this.joint = [];
		this.weight = [];
		
		i = 0;
		while (i < jntLen) {
			this.joint[i++] = data.readVInt();
		}
		
		i = 0;
		while (i < jntLen) {
			this.weight[i++] = data.readFloat(); 
		}
	}
	
	// VERTEX
	this.vertex = [];
	i = 0; 
	while(i < this.length) 
		this.vertex[i++] = data.readFloat();
	
	// SUB-MESHES
	this.indexes = [];
	this.indexes.length = data.readByte();			
	
	// INDEXES
	for (i=0;i<this.indexes.length;i++) {
		len = data.readVInt() * 3;
		this.indexes[i] = vec = [];
		j = 0; 
		while(j < len) 
			vec[j++] = data.readVInt();
	}
}

SEA3D.Geometry.prototype.type = "geo";

//
//	SEA3D Object3D
//

SEA3D.Object3D = 
{
	read : function(scope) {
		var data = scope.data;
		
		scope.castShadows = true;
		scope.receiveShadows = true;
		scope.receiveLights = true;
		scope.isStatic = false;
		
		scope.attrib = data.readUShort();	
		scope.tags = [];
		
		if (scope.attrib & 1) {
			switch(data.readByte()) {
				case 0:
					scope.parent = {
							object:scope.sea.objects[data.readUInt()]
						}						
					break;
				
				case 1:
					scope.parent = {
							object:scope.sea.objects[data.readUInt()],
							joint:data.readUShort()
						}
					break;
			}
		}
		
		if (scope.attrib & 2)
			scope.animation = scope.sea.objects[data.readUInt()];			
		
		if (scope.attrib & 4)
			scope.properties = scope.sea.objects[data.readUInt()];
		
		if (scope.attrib & 8) {
			var count = data.readByte(),
				i = 0;
			
			scope.scripts = [];
			
			while (i < count) {
				scope.scripts[i] = {
					attrib:data.readUShort(),
					script:scope.sea.objects[data.readUInt()]
				}
			}
		}
		
		if (scope.attrib & 16) {
			var objectType = data.readByte();
			scope.isStatic = objectType & 1;
		}
		
		if (scope.attrib & 32) {
			var lightType = data.readByte();
			scope.castShadows = lightType & 1;
			scope.receiveShadows = lightType & 2;
			scope.receiveLights = lightType & 4;
		}
		
		if (scope.attrib & 64) {
			var flag = this.data.readByte();
			scope.lookAt = {
					index:scope.sea.objects[data.readUInt()]
				}				
		}
	}
	,readTags : function (scope) {
		var data = scope.data,	
			numTag = data.readByte();		
		
		for (var i=0;i<numTag;++i) {
			var kind = data.readUShort();
			var size = data.readUInt();				
			var pos = data.position;
			
			//not implemented
			//readTag(kind, size)
			
			data.position = pos += size; 
		}
	}
}

//
//	SEA3D Mesh
//

SEA3D.Mesh = function(name, data, sea) {
	this.name = name;
	this.data = data;
	this.sea = sea;
		
	SEA3D.Object3D.read(this);
	
	// MATERIAL
	if (this.attrib & 256) {
		this.material = [];
		var len = data.readByte();
		
		for (var i=0;i<len;i++) {	
			var matIndex = data.readUInt();
			if (matIndex > 0) this.material[i] = sea.objects[matIndex-1];			
			else this.material[i] = undefined;		
		}
	}
	
	// 1 = SKELETON
	// 2 = SKELETON_ANIMATION
	// 3 = VERTEX_ANIMATION
	switch(this.meshType = (this.attrib & 512) >> 9 | (this.attrib & 1024) >> 9) {
		case SEA3D.Mesh.SKELETON:
			this.skeleton = sea.objects[data.readUInt()];
			break;
		
		case SEA3D.Mesh.SKELETON_ANIMATION:
			this.skeleton = sea.objects[data.readUInt()];
			this.skeletonAnimation = sea.objects[data.readUInt()];
			break;
		
		case SEA3D.Mesh.VERTEX_ANIMATION:
			this.vertexAnimation = sea.objects[data.readUInt()];
			break;
	}
	
	// 1 = MORPH
	// 2 = MORPH_ANIMATION			
	switch(this.morphType = (this.attrib & 2048) >> 11 | (this.attrib & 4096) >> 11) {
		case SEA3D.Mesh.MORPH:
			this.morph = sea.objects[data.readUInt()];
			break;
		
		case SEA3D.Mesh.MORPH_ANIMATION:
			this.morph = sea.objects[data.readUInt()];
			this.morphAnimation = sea.objects[data.readUInt()];
			break;
	}
		
	// VERTEX_COLOR
	if (this.attrib & 8192) {
		this.vertexColor = sea.objects[data.readUInt()];
	}
	
	// BOUNDING_BOX
	if (this.attrib & 16384) {	
		this.min = data.readVector3();
		this.max = data.readVector3();
	}
	
	this.transform = data.readMatrix();
	
	this.geometry = sea.objects[data.readUInt()];
	
	SEA3D.Object3D.readTags(this);
}

SEA3D.Mesh.SKELETON = 1;
SEA3D.Mesh.SKELETON_ANIMATION = 2;
SEA3D.Mesh.VERTEX_ANIMATION = 3;

SEA3D.Mesh.MORPH = 1;
SEA3D.Mesh.MORPH_ANIMATION = 2;

SEA3D.Mesh.prototype.type = "m3d";

//
//	SEA3D Skeleton
//

SEA3D.Skeleton = function(name, data, sea) {
	this.name = name;
	this.data = data;
	this.sea = sea;	
		
	var length = data.readUShort();
	
	this.joint = [];		
	
	for(var i=0;i<length;i++) {
		this.joint[i] = {	
				name:data.readStringTiny(),
				parentIndex:data.readUShort() - 1,
				inverseBindMatrix:data.readMatrix()							
			}
	}
}

SEA3D.Skeleton.prototype.type = "skl";

//
//	SEA3D Skeleton Local
//

SEA3D.SkeletonLocal = function(name, data, sea) {
	this.name = name;
	this.data = data;
	this.sea = sea;	
		
	var length = data.readUShort();
	
	this.joint = [];		
	
	for(var i=0;i<length;i++) {
		this.joint[i] = {
				name:data.readStringTiny(),
				parentIndex:data.readUShort() - 1,
				
				// POSITION XYZ
				x:data.readFloat(),
				y:data.readFloat(),
				z:data.readFloat(),
				// QUATERNION XYZW
				qx:data.readFloat(),
				qy:data.readFloat(),
				qz:data.readFloat(),
				qw:data.readFloat(),
				// SCALE
				sx:data.readFloat(),
				sx:data.readFloat(),
				sx:data.readFloat()						
			}
	}
}

SEA3D.SkeletonLocal.prototype.type = "sklq";

//
//	SEA3D Animation Sequence
//

SEA3D.AnimationSequence = function(name, data, sea) {
	this.name = name;
	this.data = data;
	this.sea = sea;
	
	this.list = [];
	
	var count = data.readUShort();
	
	for(var i=0;i<count;i++) {
		var flag = data.readByte();
		
		this.list[i] = {
				name:data.readStringTiny(), 
				start:data.readUInt(), 
				count:data.readUInt(),
				repeat:(flag & 1) != 0, 
				intrpl:(flag & 2) != 0
			}
	}
}

SEA3D.AnimationSequence.getRootSequence = function(scope) {
	return {name:"root",start:0,count:scope.numFrames,repeat:true,intrpl:true}
}

SEA3D.AnimationSequence.prototype.type = "seq";

//
//	SEA3D Animation Base
//

SEA3D.AnimationBase = 
{
	read : function(scope) {
		var data = scope.data,		
			flag = data.readByte();			
			
		if (flag & 1)
			scope.sequence = scope.sea.objects[data.readUInt()];
		
		scope.frameRate = data.readByte();
		scope.numFrames = data.readUInt();
	}
}

//
//	SEA3D Skeleton Animation
//

SEA3D.SkeletonAnimation = function(name, data, sea) {
	this.name = name;
	this.data = data;
	this.sea = sea;
		
	var i, j, count, joint;
	
	SEA3D.AnimationBase.read(this);
	
	count = data.readUShort()
	
	this.pose = [];		
	
	for(var i=0;i<this.numFrames;i++) {
		joint = [];
		joint.length = count;
		
		for(var j=0;j<count;j++) {
			joint[j] = {
					// POSITION XYZ
					x:data.readFloat(),
					y:data.readFloat(),
					z:data.readFloat(),
					// QUATERNION XYZW
					qx:data.readFloat(),
					qy:data.readFloat(),
					qz:data.readFloat(),
					qw:data.readFloat()
				}
		}
		
		this.pose[i] = joint;
	}
}

SEA3D.SkeletonAnimation.prototype.type = "skla";

//
//	SEA3D Morph
//

SEA3D.Morph = function(name, data, sea) {
	this.name = name;
	this.data = data;
	this.sea = sea;
	
	SEA3D.GeometryBase(this);
	
	var useVertex = (this.attrib & 2) != 0;
	var useNormal = (this.attrib & 4) != 0;
	
	var len = this.numVertex * 3;
	
	var nodeCount = data.readUShort()	
	this.node = [];
			
	for(var i = 0; i < nodeCount; i++) {
		var name = data.readStringTiny();
		
		if (useVertex) {				
			var verts = [];
			
			j = 0;
			while(j < len)
				verts[j++] = data.readFloat();
		}
		
		if (useNormal) {
			var norms = [];
			
			j = 0;
			while(j < len)
				norms[j++] = data.readFloat();
		}
		
		this.node[i] = {vertex:verts, normal:norms, name:name}
	}	
}

SEA3D.Morph.prototype.type = "mph";

//
//	SEA3D Camera
//

SEA3D.Camera = function(name, data, sea) {
	this.name = name;
	this.data = data;
	this.sea = sea;
		
	SEA3D.Object3D.read(this);
		
	if (this.attrib & 256) {
		this.dof = {
				distance:data.readFloat(),
				range:data.readFloat()
			}
	}
	
	this.transform = data.readMatrix();
	
	this.fov = data.readFloat();	
	
	SEA3D.Object3D.readTags(this);
}

SEA3D.Camera.prototype.type = "cam";

//
//	SEA3D Light
//

SEA3D.Light = {
	read : function(scope) {
		SEA3D.Object3D.read(scope);
		
		var data = scope.data;
		
		scope.multiplier = 0;
		scope.ambient = 1;
		scope.ambientColor = 0xFFFFFF;		
		scope.attenStart = Number.MAX_VALUE;
		scope.attenEnd = Number.MAX_VALUE;
		
		if (scope.attrib & 256) {
			var shadowHeader = data.readByte();
			
			scope.shadow = {}
			
			if (shadowHeader & 1)			
				scope.shadow.opacity = data.readFloat();
			
			if (shadowHeader & 2)			
				scope.shadow.color = data.readUInt24();		
		}		
		
		if (scope.attrib & 512) {
			scope.attenStart = data.readFloat();
			scope.attenEnd = data.readFloat();
		}
					
		scope.color = data.readUInt24();
		scope.multiplier = data.readFloat();		
	}
}

//
//	SEA3D Point Light
//

SEA3D.PointLight = function(name, data, sea) {
	this.name = name;
	this.data = data;
	this.sea = sea;
	
	SEA3D.Light.read(this);
	
	this.position = data.readVector3();
	
	SEA3D.Object3D.readTags(this);
}

SEA3D.PointLight.prototype.type = "plht";

//
//	SEA3D Directional Light
//

SEA3D.DirectionalLight = function(name, data, sea) {
	this.name = name;
	this.data = data;
	this.sea = sea;
	
	SEA3D.Light.read(this);
	
	this.transform = data.readMatrix();
	
	SEA3D.Object3D.readTags(this);
}

SEA3D.DirectionalLight.prototype.type = "dlht";

//
//	SEA3D Material
//

SEA3D.Material = function(name, data, sea) {
	this.name = name;
	this.data = data;
	this.sea = sea;
	
	this.technique = [];
	
	this.attrib = data.readUShort();
	
	this.alpha = 1;
	this.blendMode = "normal";
	this.alphaThreshold = .5;
	
	this.bothSides = (this.attrib & 1) != 0;
	this.smooth = (this.attrib & 2) != 0;
	this.mipmap = (this.attrib & 4) != 0;
	
	if (this.attrib & 8)
		this.alpha = data.readFloat();
		
	if (this.attrib & 16)
		this.alphaThreshold = data.readFloat();
		
	if (this.attrib & 32)
		this.blendMode = data.readBlendMode();
		
	if (this.attrib & 64)
		this.animation = sea.objects[data.readUInt()];
		
	var count = data.readByte();
	
	for (i = 0; i < count; ++i) {
		var kind = data.readUShort();
		var size = data.readUShort();				
		var pos = data.position;
		var tech;
		
		switch(kind) {
			case SEA3D.Material.DEFAULT:				
				tech = {
						ambientColor:data.readUInt24(),
						diffuseColor:data.readUInt24(),
						specularColor:data.readUInt24(),
						
						specular:data.readFloat(),
						gloss:data.readFloat()
					}				
				break;
			
			case SEA3D.Material.DIFFUSE_TEXTURE:				
				tech = {
						texture:sea.objects[data.readUInt()]
					}	
				break;
			
			case SEA3D.Material.SPECULAR_MAP:				
				tech = {
						texture:sea.objects[data.readUInt()]
					}				
				break;
			
			case SEA3D.Material.NORMAL_MAP:				
				tech = {
						texture:sea.objects[data.readUInt()]
					}				
				break;
				
			case SEA3D.Material.REFLECTION_MAP:
			case SEA3D.Material.FRESNEL_REFLECTION:
				tech = {
						alpha:data.readFloat(),
						type:data.readUInt()				
					}
											
					if (kind == SEA3D.Material.FRESNEL_REFLECTION) {
						tech.power = data.readFloat();
						tech.normal = data.readFloat();
					}						
					
					if (tech.type >= SEA3D.Material.R_ENVMAP) {
						// convert to texture index
						tech.texture = sea.objects[tech.type-64]; 
					}			
				break;
			
			case SEA3D.Material.REFRACTION_MAP:
				tech = {
						alpha:data.readFloat(),
						ior:data.readFloat(),
						type:data.readUInt()						
					}
				
				if (tech.type >= R_ENVMAP) {
					// convert to texture index
					tech.texture = sea._objects[tech.type-64]; 
				}
				break;
			
			case SEA3D.Material.RIM:
				tech = {
						strength:data.readFloat(),
						color:data.readUInt24(),
						power:data.readFloat(),			
						blendMode:data.readBlendMode()
					}
				break;
			
			case SEA3D.Material.TRANSLUCENT:
				tech = {						
						color:data.readUInt24(),
						translucency:data.readFloat(),
						scattering:data.readFloat()
					}
				break;
			
			case SEA3D.Material.CEL:
				tech = {
						color:data.readUInt24(),
						levels:data.readUnsignedByte(),
						size:data.readFloat(),
						specularCutOff:data.readFloat(),
						smoothness:data.readFloat()						
					}
				break;
			
			default:						
				console.warn("MaterialTechnique not found:", kind.toString(16));
				data.position = pos += size;
				continue;
		}
		
		tech.kind = kind;
				
		this.technique.push(tech);								
		
		data.position = pos += size;
	}
}

SEA3D.Material.DEFAULT = 0x0000;
SEA3D.Material.DIFFUSE_TEXTURE = 0x0001;
SEA3D.Material.SPECULAR_MAP = 0x0002;
SEA3D.Material.REFLECTION_MAP = 0x0003;
SEA3D.Material.REFRACTION_MAP = 0x0004;
SEA3D.Material.NORMAL_MAP = 0x0005;
SEA3D.Material.FRESNEL_REFLECTION = 0x0006;
SEA3D.Material.RIM = 0x0007;
SEA3D.Material.TRANSLUCENT = 0x0008;
SEA3D.Material.CEL = 0x0009;

SEA3D.Material.R_MIRROR = 0x00;
SEA3D.Material.R_ENVIRONMENT = 0x01;
SEA3D.Material.R_ENVMAP = 0x40;

SEA3D.Material.prototype.type = "mat";

//
//	SEA3D Texture
//

SEA3D.Texture = function(name, data, sea) {
	this.name = name;
	this.data = data;
	this.sea = sea;
	
	var layerCount = data.readByte();
	
	this.layer = [];
	
	for(var i = 0; i < layerCount; i++) {
		this.layer[i] = this.readLayer(data, this);
		
		if (!this.firstLayer)
			this.firstLayer = this.layer[i].texture;
	}
}

SEA3D.Texture.prototype.getLayerByName = function(name) {
	for(var i = 0; i < this.layer.length; i++) {
		if (this.layer[i].name == name)
			return this.layer[i];
	}	
}

SEA3D.Texture.prototype.readLayer = function(data, scope) {
	this.scope = scope;
	
	var out = {
		blendMode:"normal",
		opacity:1
	}
	
	var attrib = data.readUShort();		
	
	if (attrib & 1)
		out.texture = this.readLayerBitmap(data, scope);
			
	if (attrib & 2)
		out.mask = this.readLayerBitmap(data, scope);			
	
	if (attrib & 4)
		out.name = data.readStringTiny();
	
	if (attrib & 8)
		out.blendMode = data.readBlendMode();
	
	if (attrib & 16)
		out.opacity = data.readFloat();
		
	return out;
}

SEA3D.Texture.prototype.readLayerBitmap = function(data, scope) {
	this.scope = scope;
	
	var out = {
		channel:0,
		repeat:true,
		offsetU:0,
		offsetV:0,
		scaleU:0,
		scaleV:0,
		rotation:0
	}
	
	out.map = scope.sea.objects[data.readUInt()];
	
	var attrib = data.readUShort();
	
	if (attrib > 0) {
		if (attrib & 1)							
			out.channel = data.readByte();
		
		if (attrib & 2)							
			out.repeat = false;
		
		if (attrib & 4)							
			out.offsetU = data.readFloat();
		
		if (attrib & 8)							
			out.offsetV = data.readFloat();
		
		if (attrib & 16)							
			out.scaleU = data.readFloat();
		
		if (attrib & 32)							
			out.scaleV = data.readFloat();
		
		if (attrib & 64)							
			out.rotation = data.readFloat();
		
		if (attrib & 128)							
			out.animation = data.readUInt();		
	}
	
	return out;
}

SEA3D.Texture.prototype.type = "tex";

//
//	SEA3D CubeMap
//

SEA3D.CubeMap = function(name, data, sea) {
	this.name = name;
	this.data = data;
	this.sea = sea;
	
	this.transparent = false;
	
	var ext = data.readExt();
	
	this.faces = [];
	
	for(var i = 0; i < 6; i++) {		
		var size = data.readUInt();
		this.faces[i] = data.concat(data.position, size);			
		data.position += size;
	}	
}

SEA3D.CubeMap.prototype.type = "cube";

//
//	Universal
//

//	JPEG

SEA3D.JPEG = function(name, data, sea) {
	this.name = name;
	this.data = data;
	this.sea = sea;
	
	this.transparent = false;
}

SEA3D.JPEG.prototype.type = "jpg";

//	PNG

SEA3D.PNG = function(name, data, sea) {
	this.name = name;
	this.data = data;
	this.sea = sea;
	
	this.transparent = data.buffer[25] == 0x06;		
}

SEA3D.PNG.prototype.type = "png";

//	GIF

SEA3D.GIF = function(name, data, sea) {
	this.name = name;
	this.data = data;
	this.sea = sea;
	
	this.transparent = data.buffer[11] > 0;	
}

SEA3D.GIF.prototype.type = "gif";

//	JPEG-XR

SEA3D.JPEG_XR = function(name, data, sea) {
	this.name = name;
	this.data = data;
	this.sea = sea;
	
	this.transparent = false;
}

SEA3D.JPEG_XR.prototype.type = "wdp";

//
//	SEA3D FILE FORMAT
//

SEA3D.File = function(data) {
	this.stream = new SEA3D.Stream(data);	
	this.version = SEA3D.VERSION;
	this.objects = [];
	this.typeClass = {}
	this.typeRead = {}	
	this.position =
	this.dataPosition = 0;
	this.scope = this;		
	this.timeLimit = 100;
	
	// SEA3D
	this.addClass(SEA3D.Geometry);	
	this.addClass(SEA3D.Mesh);	
	this.addClass(SEA3D.Material);
	this.addClass(SEA3D.Texture);
	this.addClass(SEA3D.PointLight);	
	this.addClass(SEA3D.DirectionalLight);	
	this.addClass(SEA3D.Skeleton);
	this.addClass(SEA3D.SkeletonLocal);
	this.addClass(SEA3D.SkeletonAnimation);
	this.addClass(SEA3D.Camera);
	this.addClass(SEA3D.Morph);
	this.addClass(SEA3D.CubeMap);
	this.addClass(SEA3D.AnimationSequence);
	
	// UNIVERSAL
	this.addClass(SEA3D.JPEG);
	this.addClass(SEA3D.JPEG_XR);
	this.addClass(SEA3D.PNG);
	this.addClass(SEA3D.GIF);
}

SEA3D.File.CompressionLibs = [null, "deflate", "lzma"];
SEA3D.File.DecompressionMethod = {}

SEA3D.File.setDecompressionEngine = function(type, method) {
	SEA3D.File.DecompressionMethod[type] = method;
}

SEA3D.File.prototype.addClass = function(clazz) {
	this.typeClass[clazz.prototype.type] = clazz;
}

SEA3D.File.prototype.readHead = function() {	
	if (this.stream.bytesAvailable() < 16)
		return false;
		
	if (this.stream.readString(3) != "SEA")
		console.error("Invalid SEA3D format.");
		
	var sign = this.stream.readString(3);
		
	if (sign != "S3D")
		console.warn("Signature \"" + sign + "\" not recognized.");
		
	this.version = this.stream.readUInt24();
	
	if (this.stream.readByte() != 0) {				
		throw new Error("Protection algorithm not is compatible.");
	}
	
	this.compressionID = this.stream.readByte();
	this.compressionAlgorithm = SEA3D.File.CompressionLibs[this.compressionID];
	this.decompressionMethod = SEA3D.File.DecompressionMethod[this.compressionAlgorithm];	
	
	if (this.compressionID > 0 && !this.decompressionMethod) {
		throw new Error("Compression algorithm not is compatible.");
	}
		
	this.length = this.stream.readUInt();	
	
	this.dataPosition = this.stream.position;
	
	var differentVersion = this.version - SEA3D.VERSION;
	
	if (differentVersion < 0)
		console.warn("File contains an old version of SEA3D.");
	else if (differentVersion > 0)
		console.warn("File was designed for a newer version of SEA3D.");
	
	this.objects.length = 0;
	
	this.stage = this.readBody;
	
	return true;
}

SEA3D.File.prototype.readSEAObject = function() {
	if (this.stream.bytesAvailable() < 4)
		return null;
	
	var size = this.stream.readUInt();
	var position = this.stream.position;
	
	if (this.stream.bytesAvailable() < size)
		return null;
	
	var flag = this.stream.readByte();
	var type = this.stream.readExt();
	
	var name = flag & 1 ? this.stream.readStringTiny() : "";
	
	size -= this.stream.position - position;
	position = this.stream.position;
	
	var data = this.stream.concat(position, size),
		obj;		
	
	if (this.typeClass[type])
	{
		if ((flag & 2) != 0 && this.decompressionMethod)
			data.set(this.decompressionMethod(data.buffer));
	
		obj = new this.typeClass[type](name, data, this);
		
		if (this.typeRead[type])
			this.typeRead[type].call(this.scope, obj);
	}
	else
	{
		obj = new SEA3D.Object(name, data, type, this);		
		
		console.warn("Unknown format \"" + type + "\" of the file \"" + name + "\". Add a module referring to the format.");
	}		
	
	this.objects.push(this.objects[obj.type + "/" + obj.name] = obj);
	
	this.dataPosition = position + size;
	
	++this.position;
	
	return obj;
}

SEA3D.File.prototype.readBody = function() {	
	this.timer.update();	
	
	while (this.position < this.length) {
		if (this.timer.getDeltaTime() < this.timeLimit) {	
			this.stream.position = this.dataPosition;
			
			var sea = this.readSEAObject();			
			
			if (sea) this.dispatchCompleteObject(sea);				
			else return false;
		}
		else return false;
	}
	
	this.stage = this.readComplete;
	
	return true;
}

SEA3D.File.prototype.readComplete = function() {
	this.stream.position = this.dataPosition;
	
	if (this.stream.readUInt24() != 0x5EA3D1)
		console.warn("SEA3D file is corrupted.");
	
	this.stage = null;
	
	this.dispatchComplete();
}

SEA3D.File.prototype.readStage = function(scope) {
	while (scope.stage && scope.stage());
	if (scope.stage) {
		window.setInterval(scope.readStage, 10, scope);
		scope.dispatchProgress();
	}
}

SEA3D.File.prototype.read = function() {	
	this.timer = new SEA3D.Timer();
	this.stage = this.readHead;
	
	this.readStage(this);
}

SEA3D.File.prototype.dispatchCompleteObject = function(obj) {
	if (!this.onCompleteObject) return;
	
	this.onCompleteObject({
			file:this,
			object:obj
		});
}

SEA3D.File.prototype.dispatchProgress = function() {
	if (!this.onProgress) return;
	
	this.onProgress({
			file:this,
			position:this.position,
			length:this.length,
			progress:this.position / this.length
		});	
}

SEA3D.File.prototype.dispatchDownloadProgress = function(position, length) {
	if (!this.onDownloadProgress) return;
	
	this.onDownloadProgress({
			file:this,
			position:position,
			length:length,
			progress:position / length
		});	
}

SEA3D.File.prototype.dispatchComplete = function() {
	var elapsedTime = this.timer.getElapsedTime();
	var message = elapsedTime + "ms, " + this.objects.length + " objects";		

	if (this.onComplete) this.onComplete({
			file:this,
			timeTotal:elapsedTime,
			message:message
		});
	else console.log("SEA3D:", message);
}

SEA3D.File.prototype.dispatchError = function(id, message) {
	if (this.onError) this.onError({file:this,id:id,message:message});
	else console.error("SEA3D: #" + id, message);
}

SEA3D.File.prototype.load = function( url ) {	
	var scope = this,
		xhr = new XMLHttpRequest();
	
	xhr.open( "GET", url, true );
	xhr.responseType = 'arraybuffer';
	
	xhr.onprogress = function(e) {
		if (e.lengthComputable) 
			scope.dispatchDownloadProgress( e.loaded, e.total );
	}
	
	xhr.onreadystatechange = function() {
		if ( xhr.readyState === 2 ){		
			//xhr.getResponseHeader("Content-Length");
		} else if ( xhr.readyState === 3 ) {
			//	progress
		} else if ( xhr.readyState === 4 ) {
			if ( xhr.status === 200 || xhr.status === 0 ) {
				// complete
				scope.stream.set(new Uint8Array(this.response));				
				scope.read();				
			} else {
				this.dispatchError(1001, "Couldn't load [" + url + "] [" + xhr.status + "]");				
			}
		}		
	}
	
	
	xhr.send();	
}