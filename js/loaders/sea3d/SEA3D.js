/**
 * 	SEA3D.js - SEA3D SDK (01/10/2013)
 * 	Copyright (C) 2013 Sunag Entertainment 
 * 
 * 	http://code.google.com/p/sea3d/
 */

var SEA3D = { VERSION : 16002, REVISION : 2 }

//
//	Timer
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
	this.position = 0;
	this.set( buffer || new Uint8Array() );
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

SEA3D.Stream.prototype.readAnimationList = function(sea) {
	var list = [],					
		count = this.readByte();				

	var i = 0;
	while ( i < count ) {				
		var attrib = this.readByte(),				
			anm = {};
		
		anm.relative = (attrib & 1) != 0;
		
		if (attrib & 2)
			anm.timeScale = this.readFloat();
		
		anm.tag = sea.getObject(this.readUInt());
		
		list[i++] = anm;
	}

	return list;
}

SEA3D.Stream.prototype.readScriptList = function(sea) {
	var list = [],					
		count = this.readByte();				

	var i = 0;
	while ( i < count ) {				
		var attrib = this.readByte(),				
			script = {};
		
		script.priority = (attrib & 1) | (attrib & 2);
		
		if (attrib & 4) {
			script.params = [];
			
			count = this.readByte();
						
			for ( i = 0; i < count; i++ )
			{
				var name = this.readString();		
				script.params[name] = SEA3D.DataTable.readObject(this);
			}
		}
		
		script.tag = sea.getObject(this.readUInt());
		
		list[i++] = anm;
	}

	return list;
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
//	Data Table
//

SEA3D.DataTable = {
	NONE : 0,
	
	// 1D = 0 at 31
	BOOLEAN : 1,
	
	BYTE : 2,
	UBYTE : 3,
	
	SHORT : 4,
	USHORT : 5,
	
	INT24 : 6,
	UINT24 : 7,
	
	INT : 8,
	UINT : 9,
	
	FLOAT : 10,
	DOUBLE : 11,
	DECIMAL : 12,
	
	// 2D = 32 at 63
	
	// 3D = 64 at 95
	VECTOR3D : 74,
	
	// 4D = 96 at 127
	VECTOR4D : 106,
	
	// Undefined Values = 128 at 256
	STRING_TINY : 128,
	STRING_SHORT : 129,
	STRING_LONG : 130
}

SEA3D.DataTable.BLEND_MODE =	[
	"normal","add","subtract","multiply","dividing","alpha","screen","darken",
	"overlay","colorburn","linearburn","lighten","colordodge","lineardodge",
	"softlight","hardlight","pinlight","spotlight","spotlightblend","hardmix",
	"average","difference","exclusion","hue","saturation","color","value"
]

SEA3D.DataTable.INTERPOLATION_TABLE =	[
	"normal","linear",
	"sine.in","sine.out","sine.inout",
	"cubic.in","cubic.out","cubic.inout",
	"quint.in","quint.out","quint.inout",
	"circ.in","circ.out","circ.inout",
	"back.in","back.out","back.inout",
	"quad.in","quad.out","quad.inout",
	"quart.in","quart.out","quart.inout",
	"expo.in","expo.out","expo.inout",
	"elastic.in","elastic.out","elastic.inout",
	"bounce.in","bounce.out","bounce.inout"
]

SEA3D.DataTable.readObject = function(data) {
	SEA3D.DataTable.readToken(data.readByte(), data);
}

SEA3D.DataTable.readToken = function(type, data) {
	switch(type)
	{
		// 1D
		case SEA3D.DataTable.BOOLEAN:
			return data.readBool();
			break;
		
		case SEA3D.DataTable.UBYTE:
			return data.readByte();
			break;
		
		case SEA3D.DataTable.USHORT:
			return data.readUShort();
			break;
		
		case SEA3D.DataTable.UINT24:
			return data.readUInt24();
			break;	
		
		case SEA3D.DataTable.UINT:
			return data.readUInt();
			break;
		
		case SEA3D.DataTable.FLOAT:
			return data.readFloat();
			break;
		
		// 3D
		case SEA3D.DataTable.VECTOR3D:
			return data.readVector3();
			break;	
		
		// 4D
		case SEA3D.DataTable.VECTOR4D:
			return data.readVector4();						
			break;
		
		// Undefined Values
		case SEA3D.DataTable.STRING_TINY:
			return data.readString();
			break;
	}
	
	return null;
}

SEA3D.DataTable.readVector = function(type, data, out, length, offset) {			
	var size = SEA3D.DataTable.sizeOf(type), 
		i = offset * size, 
		count = i + (length * size);
	
	switch(type)
	{
		// 1D
		case SEA3D.DataTable.BOOLEAN:
			while (i < count) out[i++] = data.readBool() ? 1 : 0;						
			break;
		
		case SEA3D.DataTable.UBYTE:
			while (i < count) out[i++] = data.readByte();						
			break;
		
		case SEA3D.DataTable.USHORT:
			while (i < count) out[i++] = data.readUShort();							
			break;
		
		case SEA3D.DataTable.UINT24:
			while (i < count) out[i++] = data.readUInt24();						
			break;	
		
		case SEA3D.DataTable.UINT:
			while (i < count) out[i++] = data.readUInt();						
			break;
		
		case SEA3D.DataTable.FLOAT:
			while (i < count) out[i++] = data.readFloat();						
			break;
		
		// 3D
		case SEA3D.DataTable.VECTOR3D:
			while (i < count) 		
			{
				out[i++] = data.readFloat();
				out[i++] = data.readFloat();
				out[i++] = data.readFloat();							
			}
			break;	
		
		// 4D
		case SEA3D.DataTable.VECTOR4D:
			while (i < count) 	
			{
				out[i++] = data.readFloat();
				out[i++] = data.readFloat();
				out[i++] = data.readFloat();
				out[i++] = data.readFloat();
			}
			break;
	}
}		

SEA3D.DataTable.sizeOf = function(kind) {
	if (kind == 0) return 0;
	else if (kind >= 1 && kind <= 31) return 1;
	else if (kind >= 32 && kind <= 63) return 2;
	else if (kind >= 64 && kind <= 95) return 3;
	else if (kind >= 96 && kind <= 125) return 4;			
	return -1;
}

//
//	Math
//

SEA3D.Math = {
	DEGREES : 180 / Math.PI,
	RADIANS : Math.PI / 180
}

SEA3D.Math.angle = function(val) {
	var ang = 180,
		inv = val < 0;
	
	val = (inv ? -val : val) % 360;
	
	if (val > ang)			
	{
		val = -ang + (val - ang);
	}
	
	return (inv ? -val : val);			
}

SEA3D.Math.lerpAngle = function(val, tar, t) {				
	if (Math.abs(val - tar) > 180)
	{
		if (val > tar) 
		{		
			tar += 360;				
		}
		else 
		{
			tar -= 360;				
		}
	}
	
	val += (tar - val) * t;
	
	return SEA3D.Math.angle(val);
}	

SEA3D.Math.lerpColor = function(val, tar, t) {
	var a0 = val >> 24 & 0xff,
		r0 = val >> 16 & 0xff,
		g0 = val >> 8 & 0xff,
		b0 = val & 0xff;
	
	var a1 = tar >> 24 & 0xff,
		r1 = tar >> 16 & 0xff,
		g1 = tar >> 8 & 0xff,
		b1 = tar & 0xff;
	
	a0 += (a1 - a0) * t;
	r0 += (r1 - r0) * t;
	g0 += (g1 - g0) * t;
	b0 += (b1 - b0) * t;
	
	return a0 << 24 | r0 << 16 | g0 << 8 | b0;
}

SEA3D.Math.lerp = function(val, tar, t) {
	return val + ((tar - val) * t);
}

SEA3D.Math.lerp1x = function(val, tar, t) {
	val[0] += (tar[0] - val[0]) * t;
}

SEA3D.Math.lerp3x = function(val, tar, t) {
	val[0] += (tar[0] - val[0]) * t;
	val[1] += (tar[1] - val[1]) * t;
	val[2] += (tar[2] - val[2]) * t;
}

SEA3D.Math.lerpAng1x = function(val, tar, t) {
	val[0] = SEA3D.Math.lerpAngle(val[0], tar[0], t);
}

SEA3D.Math.lerpColor1x = function(val, tar, t) {
	val[0] = SEA3D.Math.lerpColor(val[0], tar[0], t);
}	

SEA3D.Math.lerpQuat4x = function(val, tar, t) {				
	var x1 = val[0], 
		y1 = val[1], 
		z1 = val[2],
		w1 = val[3];
	
	var x2 = tar[0], 
		y2 = tar[1], 
		z2 = tar[2],
		w2 = tar[3];
	
	var x, y, z, w, l;
	
	// shortest direction
	if (x1 * x2 + y1 * y2 + z1 * z2 + w1 * w2 < 0) {				
		x2 = -x2;
		y2 = -y2;
		z2 = -z2;
		w2 = -w2;
	}
				
	x = x1 + t * (x2 - x1);
	y = y1 + t * (y2 - y1);
	z = z1 + t * (z2 - z1);
	w = w1 + t * (w2 - w1);
	
	l = 1.0 / Math.sqrt(w * w + x * x + y * y + z * z);			
	val[0] = x * l;
	val[1] = y * l;
	val[2] = z * l;
	val[3] = w * l;
}

//
//	AnimationFrame
//

SEA3D.AnimationFrame = function() {
	this.data = [0,0,0,0];	
}

SEA3D.AnimationFrame.prototype.toVector = function() {		
	return { x:this.data[0], y:this.data[1], z:this.data[2], w:this.data[3] };
}

SEA3D.AnimationFrame.prototype.toAngles = function(d) {
	var x = this.data[0], 
		y = this.data[1], 
		z = this.data[2], 
		w = this.data[3];
	
	var a = 2 * (w * y - z * x);
	
	if (a < -1) a = -1;
	else if (a > 1) a = 1; 
	
	return {
		x : Math.atan2(2 * (w * x + y * z), 1 - 2 * (x * x + y * y)) * d,
		y : Math.asin(a) * d,
		z : Math.atan2(2 * (w * z + x * y), 1 - 2 * (y * y + z * z)) * d
	}
}

SEA3D.AnimationFrame.prototype.toEuler = function() {
	return this.toAngles( SEA3D.Math.DEGREES );
}

SEA3D.AnimationFrame.prototype.toRadians = function() {
	return this.toAngles( 1 );
}

SEA3D.AnimationFrame.prototype.setX = function(val) {
	this.data[0] = val;
}

SEA3D.AnimationFrame.prototype.getX = function() {
	return this.data[0];
}

SEA3D.AnimationFrame.prototype.setY = function(val) {
	this.data[1] = val;
}

SEA3D.AnimationFrame.prototype.getY = function() {
	return this.data[1];
}

SEA3D.AnimationFrame.prototype.setZ = function(val) {
	this.data[2] = val;
}

SEA3D.AnimationFrame.prototype.getZ = function() {
	return this.data[2];
}

SEA3D.AnimationFrame.prototype.setW = function(val) {
	this.data[3] = val;
}

SEA3D.AnimationFrame.prototype.getW = function() {
	return this.data[3];
}

//
//	AnimationData
//

SEA3D.AnimationData = function(kind, dataType, data, offset) {
	this.kind = kind;
	this.type = dataType;
	this.blockLength = SEA3D.DataTable.sizeOf(dataType);
	this.data = data;
	this.offset = offset == undefined ? 0 : offset;
	
	switch(this.blockLength)
	{
		case 1: this.getData = this.getData1x; break;
		case 2: this.getData = this.getData2x; break;
		case 3: this.getData = this.getData3x; break;
		case 4: this.getData = this.getData4x; break;
	}
}

SEA3D.AnimationData.prototype.getData1x = function(frame, data) {
	frame = this.offset + frame * this.blockLength;	
			
	data[0] = this.data[frame];	
}

SEA3D.AnimationData.prototype.getData2x = function(frame, data) {
	frame = this.offset + frame * this.blockLength;	
			
	data[0] = this.data[frame];		
	data[1] = this.data[frame + 1];			
}

SEA3D.AnimationData.prototype.getData3x = function(frame, data) {
	frame = this.offset + frame * this.blockLength;	
			
	data[0] = this.data[frame];		
	data[1] = this.data[frame + 1];			
	data[2] = this.data[frame + 2];
}

SEA3D.AnimationData.prototype.getData4x = function(frame, data) {
	frame = this.offset + frame * this.blockLength;	
			
	data[0] = this.data[frame];		
	data[1] = this.data[frame + 1];			
	data[2] = this.data[frame + 2];
	data[3] = this.data[frame + 3];
}

//
//	AnimationNode
//

SEA3D.AnimationNode = function(name, frameRate, numFrames, repeat, intrpl) {
	this.name = name;
	this.frameRate = frameRate;
	this.frameMill = 1000 / frameRate;
	this.numFrames = numFrames;	
	this.length = numFrames - 1;
	this.time = 0;
	this.duration = this.length * this.frameMill;
	this.repeat = repeat;
	this.intrpl = intrpl;	
	this.invalidState = true;
	this.dataList = [];
	this.dataListId = {};
	this.buffer = new SEA3D.AnimationFrame();
	this.percent = 0;
	this.prevFrame = 0;
	this.nextFrame = 0;
	this.frame = 0;
}

SEA3D.AnimationNode.prototype.setTime = function(value) {
	this.frame = this.validFrame( value / this.frameMill );						
	this.time = this.frame * this.frameRate;			
	this.invalidState = true;
}

SEA3D.AnimationNode.prototype.getTime = function() {
	return this.time;
}

SEA3D.AnimationNode.prototype.setFrame = function(value) {
	this.setTime(value * this.frameMill);
}

SEA3D.AnimationNode.prototype.getRealFrame = function() {
	return Math.floor( this.frame );
}

SEA3D.AnimationNode.prototype.getFrame = function() {
	return this.frame;
}

SEA3D.AnimationNode.prototype.setPosition = function(value) {
	this.setFrame(value * this.numFrames);
}

SEA3D.AnimationNode.prototype.getPosition = function() {
	return this.frame * this.numFrames;
}

SEA3D.AnimationNode.prototype.validFrame = function(value) {
	var inverse = value < 0;
			
	if (inverse) value = -value;			
	
	if (value > this.length) 
		value = this.repeat ? value % this.length : this.length;	
	
	if (inverse) value = this.length - value;
	
	return value;
}

SEA3D.AnimationNode.prototype.addData = function(animationData) {
	this.dataListId[animationData.kind] = animationData;
	this.dataList[this.dataList.length] = animationData;
}

SEA3D.AnimationNode.prototype.removeData = function(animationData) {			
	delete this.dataListId[animationData.kind];
	this.dataList.splice(this.dataList.indexOf(animationData), 1);			
}

SEA3D.AnimationNode.prototype.getDataByKind = function(kind) {			
	return this.dataListId[kind];
}

SEA3D.AnimationNode.prototype.getFrameAt = function(frame, id) {
	this.dataListId[id].getFrameData(frame, buffer.data);
	return buffer;
}

SEA3D.AnimationNode.prototype.getFrame = function(id) {
	this.dataListId[id].getFrameData(this.getRealFrame(), buffer.data);
	return buffer;
}

SEA3D.AnimationNode.prototype.getInterpolationFrame = function(animationData, iFunc) {		
	if (this.numFrames == 0) 
		return this.buffer;
	
	if (this.invalidState)
	{
		this.prevFrame = this.getRealFrame();								
		this.nextFrame = this.validFrame(this.prevFrame + 1);									
		this.percent = this.frame - this.prevFrame;				
		this.invalidState = false;
	}
	
	animationData.getData(this.prevFrame, this.buffer.data);
	
	if (this.percent > 0)
	{
		animationData.getData(this.nextFrame, SEA3D.AnimationNode.FRAME_BUFFER);	
		
		// interpolation function
		iFunc(this.buffer.data, SEA3D.AnimationNode.FRAME_BUFFER, this.percent);
	}
	
	return this.buffer;
}

SEA3D.AnimationNode.FRAME_BUFFER = [0,0,0,0];

//
//	AnimationSet
//

SEA3D.AnimationSet = function() {
	this.animations = [];	
	this.dataCount = -1;
}

SEA3D.AnimationSet.prototype.addAnimation = function(node) {
	if (this.dataCount == -1)
		this.dataCount = node.dataList.length;
	
	this.animations[node.name] = node;
	this.animations.push(node);	
}

SEA3D.AnimationSet.prototype.getAnimationByName = function(name) {
	return this.animations[name];
}

//
//	AnimationState
//

SEA3D.AnimationState = function(node) {
	this.node = node;
	this.offset = 0;
	this.weight = 0;
	this.time = 0;	
}

SEA3D.AnimationState.prototype.setTime = function(val) {
	this.node.time = this.time = val;	
}

SEA3D.AnimationState.prototype.getTime = function() {
	return this.time;
}

SEA3D.AnimationState.prototype.setFrame = function(val) {
	this.node.setFrame(val);
	this.time = this.node.time;
}

SEA3D.AnimationState.prototype.getFrame = function() {
	this.update();
	return this.node.getFrame();
}

SEA3D.AnimationState.prototype.setPosition = function(val) {
	this.node.setPosition(val);
	this.time = this.node.time;
}

SEA3D.AnimationState.prototype.getPosition = function() {
	this.update();
	return this.node.getPosition();
}

SEA3D.AnimationState.prototype.update = function() {
	if (this.node.time != this.time)
		this.node.setTime( this.time );
}

//
//	Animation Handler
//

SEA3D.AnimationHandler = function( animationSet ) {	
	this.animationSet = animationSet;
	this.states = SEA3D.AnimationHandler.stateFromAnimations( animationSet.animations );
	this.timeScale = 1;
	this.time = 0;
	this.numAnimation = animationSet.animations.length;
	this.relative = false;
	this.playing = false;
}

SEA3D.AnimationHandler.prototype.update = function(delta) {
	this.time += delta * this.timeScale;
	
	this.updateState();
	this.updateAnimation();
}

SEA3D.AnimationHandler.prototype.updateState = function() {
	this.currentState.node.setTime( this.time );
}

SEA3D.AnimationHandler.prototype.updateAnimation = function() {
	var dataCount = this.animationSet.dataCount;		
	
	var node = this.currentState.node;
	
	for(var i = 0; i < dataCount; i++) {
		var data = node.dataList[i],
			iFunc = SEA3D.Animation.DefaultLerpFuncs[data.kind];
		
		var frame = node.getInterpolationFrame(data, iFunc);
		
		if (this.updateAnimationFrame)
			this.updateAnimationFrame(frame, data.kind);
	}
}

SEA3D.AnimationHandler.prototype.getStateByName = function(name) {
	return this.states[name];
}

SEA3D.AnimationHandler.prototype.getStateNameByIndex = function(index) {
	return this.animationSet.animations[index].name;
}

SEA3D.AnimationHandler.prototype.play = function(name) {
	this.currentState = this.getStateByName(name);	
	
	if (!this.playing) {
		// add in animation collector			
		SEA3D.AnimationHandler.add( this );
		this.playing = true;
	}
}

SEA3D.AnimationHandler.prototype.pause = function() {
	if (this.playing) {
		SEA3D.AnimationHandler.remove( this );
		this.playing = false;
	}
}

SEA3D.AnimationHandler.prototype.stop = function() {
	this.time = 0;
	this.pause();
}

SEA3D.AnimationHandler.prototype.setRelative = function(val) {
	this.relative = val;
}

SEA3D.AnimationHandler.prototype.getRelative = function() {
	return this.relative;
}

//
//	Static
//

SEA3D.AnimationHandler.add = function( animation ) {
	SEA3D.AnimationHandler.animations.push( animation );
}

SEA3D.AnimationHandler.remove = function( animation ) {
	SEA3D.AnimationHandler.animations.splice(SEA3D.AnimationHandler.animations.indexOf(animation), 1);
}

SEA3D.AnimationHandler.stateFromAnimations = function(anms) {
	var states = [];
	for (var i = 0; i < anms.length; i++) {
		states[anms[i].name] = states[i] = new SEA3D.AnimationState(anms[i]);			
	}	
	return states;
}

SEA3D.AnimationHandler.update = function( delta ) {
	delta *= 1000;
	
	for(var i in SEA3D.AnimationHandler.animations) {		
		SEA3D.AnimationHandler.animations[i].update( delta );
	}
}

SEA3D.AnimationHandler.setTime = function( time ) {
	for(var i in SEA3D.AnimationHandler.animations) {		
		SEA3D.AnimationHandler.animations[i].time = time;
	}
}

SEA3D.AnimationHandler.stop = function( time ) {
	while(SEA3D.AnimationHandler.animations.length) {
		SEA3D.AnimationHandler.animations[0].stop();
	}
}

SEA3D.AnimationHandler.animations = [];

//
//	Object
//

SEA3D.Object = function(name, data, type, sea) {
	this.name = name;
	this.data = data;
	this.type = type;
	this.sea = sea;
}

//
//	Geometry Base
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
//	Geometry
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
			this.joint[i++] = data.readUShort();
		}
		
		i = 0;
		while (i < jntLen) {
			this.weight[i++] = data.readFloat(); 
		}
	}
	
	// VERTEX_COLOR
	if (this.attrib & 128) {
		this.color = [];
		
		i = 0;
		while (i < this.length)	
			color[i++] = data.readByte() / 255.0;
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
//	Object3D
//

SEA3D.Object3D = 
{
	read : function(scope) {
		var data = scope.data;
		
		scope.isStatic = false;
		
		scope.attrib = data.readUShort();	
		scope.tags = [];
		
		if (scope.attrib & 1)
			scope.parent = scope.sea.getObject(data.readUInt());
		
		if (scope.attrib & 2)
			scope.animations = data.readAnimationList(scope.sea);		
		
		if (scope.attrib & 4)
			scope.scripts = data.readScriptList(scope.sea);		
			
		if (scope.attrib & 16)
			scope.properties = scope.sea.getObject(data.readUInt());	
		
		if (scope.attrib & 32) {
			var objectType = data.readByte();
			scope.isStatic = objectType & 1;
		}
	}
	,readTags : function(scope, callback) {
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
//	Entity3D
//

SEA3D.Entity3D = 
{
	read : function(scope) {
		SEA3D.Object3D.read(scope);
	
		var data = scope.data;				
		
		scope.castShadows = true;
		
		if (scope.attrib & 64) {
			var lightType = data.readByte();			
			castShadows = (lightType & 1) == 0;
		}
	}
	,readTags : function(scope, callback) {
		SEA3D.Object3D.readTags(scope, callback);
	}
}

//
//	Mesh
//

SEA3D.Mesh = function(name, data, sea) {
	this.name = name;
	this.data = data;
	this.sea = sea;
		
	SEA3D.Entity3D.read(this);
	
	// MATERIAL
	if (this.attrib & 256) {				
		this.material = [];		
		
		var len = data.readByte();
		
		if (len == 1) this.material[0] = sea.getObject(data.readUInt());
		else
		{
			var i = 0;
			while ( i < len )	
			{
				var matIndex = data.readUInt();
				if (matIndex > 0) this.material[i++] = sea.getObject(matIndex-1);
				else this.material[i++] = undefined;	
			}
		}
	}
	
	if (this.attrib & 512) {
		this.modifiers = [];	
		
		var len = data.readByte();
		
		for ( var i = 0; i < len; i++ )
			this.modifiers[i] = sea.getObject(data.readUInt());
	}
	
	this.transform = data.readMatrix();
	
	this.geometry = sea.getObject(data.readUInt());
	
	SEA3D.Entity3D.readTags(this);
}

SEA3D.Mesh.prototype.type = "m3d";

//
//	Skeleton
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
//	Skeleton Local
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
//	Animation Base
//

SEA3D.AnimationBase = 
{
	read : function(scope) {
		var data = scope.data,		
			flag = data.readByte();			
		
		scope.sequence = [];
		
		if (flag & 1) {
			var count = data.readUShort();
			
			for(var i=0;i<count;i++) {
				var flag = data.readByte();
		
				scope.sequence[i] = {
					name:data.readStringTiny(), 
					start:data.readUInt(), 
					count:data.readUInt(),
					repeat:(flag & 1) != 0, 
					intrpl:(flag & 2) != 0
				}
			}
		}		
		
		scope.frameRate = data.readByte();
		scope.numFrames = data.readUInt();
		
		// no contains sequence
		if (scope.sequence.length == 0)
			scope.sequence[0] = {name:"root",start:0,count:scope.numFrames,repeat:true,intrpl:true};
	}
}

//
//	Animation
//

SEA3D.Animation = function(name, data, sea) {
	this.name = name;
	this.data = data;
	this.sea = sea;

	SEA3D.AnimationBase.read(this);
	
	this.dataList = [];
	this.dataList.length = data.readByte();
					
	for(var i=0;i<this.dataList.length;i++) {
	
		var kind = data.readUShort(),
			type = data.readByte(),
			anmRaw = [];
		
		SEA3D.DataTable.readVector(type, data, anmRaw, this.numFrames, 0);
		
		this.dataList[i] = {
				kind:kind,
				type:type,	
				blockSize:SEA3D.DataTable.sizeOf(type),		
				data:anmRaw
			}
	}		
}

SEA3D.Animation.POSITION = 0x0000;
SEA3D.Animation.ROTATION = 0x0001;
SEA3D.Animation.SCALE = 0x0002;
SEA3D.Animation.COLOR = 0x0003;
SEA3D.Animation.MULTIPLIER = 0x0004;
SEA3D.Animation.ATTENUATION_START = 0x0005;
SEA3D.Animation.ATTENUATION_END = 0x0006;
SEA3D.Animation.FOV = 0x0007;
SEA3D.Animation.OFFSET_U = 0x0008;
SEA3D.Animation.OFFSET_V = 0x0009;
SEA3D.Animation.SCALE_U = 0x000A;
SEA3D.Animation.SCALE_V = 0x000B;
SEA3D.Animation.ANGLE = 0x000C;
SEA3D.Animation.ALPHA = 0x000D;
SEA3D.Animation.VOLUME = 0x000E;

SEA3D.Animation.DefaultLerpFuncs = [
	SEA3D.Math.lerp3x, // POSITION
	SEA3D.Math.lerpQuat4x, // ROTATION
	SEA3D.Math.lerp3x, // SCALE
	SEA3D.Math.lerpColor1x, // COLOR
	SEA3D.Math.lerp1x, // MULTIPLIER
	SEA3D.Math.lerp1x, // ATTENUATION_START
	SEA3D.Math.lerp1x, // ATTENUATION_END
	SEA3D.Math.lerp1x, // FOV
	SEA3D.Math.lerp1x, // OFFSET_U
	SEA3D.Math.lerp1x, // OFFSET_V
	SEA3D.Math.lerp1x, // SCALE_U
	SEA3D.Math.lerp1x, // SCALE_V
	SEA3D.Math.lerpAng1x, // ANGLE
	SEA3D.Math.lerp1x, // ALPHA
	SEA3D.Math.lerp1x // VOLUME
]

SEA3D.Animation.prototype.type = "anm";

//
//	Skeleton Animation
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
//	Morph
//

SEA3D.Morph = function(name, data, sea) {
	this.name = name;
	this.data = data;
	this.sea = sea;
	
	SEA3D.GeometryBase(this);
	
	var useVertex = (this.attrib & 2) != 0;
	var useNormal = (this.attrib & 4) != 0;
	
	var len = this.numVertex * 3;
	
	var nodeCount = data.readUShort();
	
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
//	Camera
//

SEA3D.Camera = function(name, data, sea) {
	this.name = name;
	this.data = data;
	this.sea = sea;
		
	SEA3D.Object3D.read(this);
		
	if (this.attrib & 64) {
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
//	Joint Object
//

SEA3D.JointObject = function(name, data, sea) {
	this.name = name;
	this.data = data;
	this.sea = sea;
		
	SEA3D.Object3D.read(this);
	
	this.target = sea.getObject(data.readUInt());
	this.joint = data.readUShort();
	
	this.transform = data.readMatrix();
	
	this.fov = data.readFloat();	
	
	SEA3D.Object3D.readTags(this);
}

SEA3D.JointObject.prototype.type = "jnt";

//
//	Light
//

SEA3D.Light = {
	read : function(scope) {
		SEA3D.Object3D.read(scope);
		
		var data = scope.data;
		
		scope.attenStart = Number.MAX_VALUE;
		scope.attenEnd = Number.MAX_VALUE;
		
		if (scope.attrib & 64) {
			var shadowHeader = data.readByte();
			
			scope.shadow = {}
			
			scope.shadow.opacity = shadowHeader & 1 ? data.readFloat() : 1;
			scope.shadow.color = shadowHeader & 2 ? data.readUInt24() : 0x000000;
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
//	Point Light
//

SEA3D.PointLight = function(name, data, sea) {
	this.name = name;
	this.data = data;
	this.sea = sea;
	
	SEA3D.Light.read(this);
	
	if (this.attrib & 128) {
		this.attenuation = {
				start:data.readFloat(),
				end:data.readFloat()
			}
	}
	
	this.position = data.readVector3();
	
	SEA3D.Object3D.readTags(this);
}

SEA3D.PointLight.prototype.type = "plht";

//
//	Directional Light
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
//	Material
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
		
	this.receiveLights = (this.attrib & 2) == 0;
	this.receiveShadows = (this.attrib & 4) == 0;
	this.receiveFog = (this.attrib & 8) == 0;
	
	this.smooth = (this.attrib & 16) == 0;
	
	if (this.attrib & 32)
		this.alpha = data.readFloat();
		
	if (this.attrib & 64)
		this.blendMode = data.readBlendMode();
	
	if (this.attrib & 128)
		this.animations = data.readAnimationList(sea);
	
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
			case SEA3D.Material.COMPOSITE_TEXTURE:				
				tech = {
						composite:sea.getObject(data.readUInt())
					}	
				break;				
			case SEA3D.Material.DIFFUSE_MAP:				
				tech = {
						texture:sea.getObject(data.readUInt())
					}
				break;			
			case SEA3D.Material.SPECULAR_MAP:				
				tech = {
						texture:sea.getObject(data.readUInt())
					}				
				break;			
			case SEA3D.Material.NORMAL_MAP:				
				tech = {
						texture:sea.getObject(data.readUInt())
					}				
				break;				
			case SEA3D.Material.REFLECTION_MAP:
			case SEA3D.Material.FRESNEL_REFLECTION:
				tech = {						
						texture:sea.getObject(data.readUInt()),
						alpha:data.readFloat()						
					}
											
				if (kind == SEA3D.Material.FRESNEL_REFLECTION) {
					tech.power = data.readFloat();
					tech.normal = data.readFloat();
				}	
				break;			
			case SEA3D.Material.REFRACTION_MAP:
				tech = {
						texture:sea.getObject(data.readUInt()),
						alpha:data.readFloat(),
						ior:data.readFloat()						
					}
				break;			
			case SEA3D.Material.RIM:
				tech = {
						color:data.readUInt24(),
						strength:data.readFloat(),								
						power:data.readFloat(),			
						blendMode:data.readBlendMode()
					}
				break;			
			case SEA3D.Material.LIGHT_MAP:
				tech = {
						texture:sea.getObject(data.readUInt()),
						channel:data.readByte(),
						blendMode:data.readBlendMode()
					}
				break;			
			case SEA3D.Material.DETAIL_MAP:
				tech = {
						texture:sea.getObject(data.readUInt()),
						scale:data.readFloat(),
						blendMode:data.readBlendMode()
					}
				break;
			case SEA3D.Material.CEL:
				tech = {
						color:data.readUInt24(),
						levels:data.readByte(),
						size:data.readFloat(),
						specularCutOff:data.readFloat(),
						smoothness:data.readFloat()						
					}
				break;
			case SEA3D.Material.TRANSLUCENT:
				tech = {
						color:data.readUInt24(),
						translucency:data.readFloat(),
						scattering:data.readFloat()			
					}
				break;
			case SEA3D.Material.BLEND_NORMAL_MAP:
				methodAttrib = data.readByte();  
				
				tech = {						
						texture:sea.getObject(data.readUInt()),
						secondaryTexture:sea.getObject(data.readUInt())								
					}
				
				if (methodAttrib & 1)
				{
					tech.offsetX0 = data.readFloat();
					tech.offsetY0 = data.readFloat();
					
					tech.offsetX1 = data.readFloat();
					tech.offsetY1 = data.readFloat();
				}
				else
				{
					tech.offsetX0 = tech.offsetY0 = 							
					tech.offsetX1 = tech.offsetY1 = 0
				}
				
				tech.animate = methodAttrib & 2;	
				break;
			case SEA3D.Material.MIRROR_REFLECTION:
				tech = {
						texture:sea.getObject(data.readUInt()),
						alpha:data.readFloat()				
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
SEA3D.Material.COMPOSITE_TEXTURE = 0x0001;
SEA3D.Material.DIFFUSE_MAP = 0x0002;
SEA3D.Material.SPECULAR_MAP = 0x0003;
SEA3D.Material.REFLECTION = 0x0004;
SEA3D.Material.REFRACTION = 0x0005;
SEA3D.Material.NORMAL_MAP = 0x0006;
SEA3D.Material.FRESNEL_REFLECTION = 0x0007;
SEA3D.Material.RIM = 0x0008;
SEA3D.Material.LIGHT_MAP = 0x0009;
SEA3D.Material.DETAIL_MAP = 0x000A;
SEA3D.Material.CEL = 0x000B;
SEA3D.Material.TRANSLUCENT = 0x000C;
SEA3D.Material.BLEND_NORMAL_MAP = 0x000D;
SEA3D.Material.MIRROR_REFLECTION = 0x000E;

SEA3D.Material.prototype.type = "mat";

//
//	Composite
//

SEA3D.Composite = function(name, data, sea) {
	this.name = name;
	this.data = data;
	this.sea = sea;
	
	var layerCount = data.readByte();
	
	this.layer = [];
	
	for(var i = 0; i < layerCount; i++)
		this.layer[i] = this.readLayer(data, this);	
}

SEA3D.Composite.prototype.getLayerByName = function(name) {
	for(var i = 0; i < this.layer.length; i++) {
		if (this.layer[i].name == name)
			return this.layer[i];
	}	
}

SEA3D.Composite.prototype.readLayer = function(data, scope) {
	this.scope = scope;
	
	var out = {
		blendMode:"normal",
		opacity:1
	}
	
	var attrib = data.readUShort();		
	
	if (attrib & 1) out.texture = this.readLayerBitmap(data, scope);
	else out.color = data.readUInt24();
			
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

SEA3D.Composite.prototype.readLayerBitmap = function(data, scope) {
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
	
	out.map = scope.sea.getObject(data.readUInt());
	
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
			out.animation = data.readAnimationList(scope.sea);		
	}
	
	return out;
}

SEA3D.Composite.prototype.type = "ctex";

//
//	Cube Maps
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

SEA3D.CubeMap.prototype.type = "cmap";

//
//	JPEG
//

SEA3D.JPEG = function(name, data, sea) {
	this.name = name;
	this.data = data;
	this.sea = sea;
	
	this.transparent = false;
}

SEA3D.JPEG.prototype.type = "jpg";

//
//	JPEG_XR
//

SEA3D.JPEG_XR = function(name, data, sea) {
	this.name = name;
	this.data = data;
	this.sea = sea;
	
	this.transparent = false;
}

SEA3D.JPEG_XR.prototype.type = "wdp";

//
//	PNG
//

SEA3D.PNG = function(name, data, sea) {
	this.name = name;
	this.data = data;
	this.sea = sea;
	
	this.transparent = data.buffer[25] == 0x06;		
}

SEA3D.PNG.prototype.type = "png";

//
//	GIF
//

SEA3D.GIF = function(name, data, sea) {
	this.name = name;
	this.data = data;
	this.sea = sea;
	
	this.transparent = data.buffer[11] > 0;	
}

SEA3D.GIF.prototype.type = "gif";

//
//	FILE FORMAT
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
	this.addClass(SEA3D.Composite);
	this.addClass(SEA3D.PointLight);	
	this.addClass(SEA3D.DirectionalLight);	
	this.addClass(SEA3D.Skeleton);
	this.addClass(SEA3D.SkeletonLocal);
	this.addClass(SEA3D.SkeletonAnimation);
	this.addClass(SEA3D.JointObject);
	this.addClass(SEA3D.Camera);
	this.addClass(SEA3D.Morph);
	this.addClass(SEA3D.CubeMap);
	this.addClass(SEA3D.Animation);	
	
	// UNIVERSAL
	this.addClass(SEA3D.JPEG);
	this.addClass(SEA3D.JPEG_XR);
	this.addClass(SEA3D.PNG);
	this.addClass(SEA3D.GIF);
}

SEA3D.File.CompressionLibs = {};
SEA3D.File.DecompressionMethod = {}

SEA3D.File.setDecompressionEngine = function(id, name, method) {
	SEA3D.File.CompressionLibs[id] = name;
	SEA3D.File.DecompressionMethod[id] = method;
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
	this.decompressionMethod = SEA3D.File.DecompressionMethod[this.compressionID];	
	
	if (this.compressionID > 0 && !this.decompressionMethod) {
		throw new Error("Compression algorithm not is compatible.");
	}
		
	this.length = this.stream.readUInt();	
	
	this.dataPosition = this.stream.position;
	
	this.objects.length = 0;
	
	this.stage = this.readBody;
	
	return true;
}

SEA3D.File.prototype.getObject = function(index) {
	return this.objects[index];
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
	
	var name = flag & 1 ? this.stream.readStringTiny() : "",
		compressed = (flag & 2) != 0,
		streaming = (flag & 4) != 0;
	
	size -= this.stream.position - position;
	position = this.stream.position;
	
	var data = this.stream.concat(position, size),
		obj;		
	
	//console.log(name + "." + type);
	
	if (streaming && this.typeClass[type])
	{
		if (compressed && this.decompressionMethod)
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