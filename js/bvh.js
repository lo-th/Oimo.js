var BVH = { REVISION:'0.1a'};

BVH.TO_RAD = Math.PI / 180;
window.URL = window.URL || window.webkitURL;

BVH.Reader = function(){
	this.debug = true;
	this.type = "";
	this.data = null;
	this.root = null;
	this.numFrames = 0;
	this.secsPerFrame = 0;
	this.play = false;
	this.channels = null;
	this.lines = "";
	
	this.speed = 1;

	this.nodes = null;
	this.order = {};

	this.ParentNodes = null;
	this.ChildNodes = null;
	this.BoneByName = null;
	this.Nodes = null;

	
	this.frame = 0;
	this.oldFrame = 0;
	this.startTime = 0;
	
	this.position = new THREE.Vector3( 0, 0, 0 );
	this.scale = 1;

	this.tmpOrder = "";
	this.tmpAngle = [];

	this.skeleton = null;
	this.bones = [];
	this.boneSize = 1.5;

	this.endFunction = null;

	//this.material = new THREE.MeshNormalMaterial();//
    this.material = new THREE.MeshPhongMaterial({ color:0xffffbb, emissive:0x606000 });
    this.nodeMaterial = new THREE.MeshPhongMaterial({ color:0x88ff88, emissive:0x606000 });
}

BVH.Reader.prototype = {
    constructor: BVH.Reader,

    load:function(fname){
    	this.type = fname.substring(fname.length-3,fname.length);

    	var _this = this;
    	var xhr = new XMLHttpRequest();
		xhr.open( 'GET', fname, true );
		
		if(this.type === 'bvh'){// direct from file
			

			xhr.onreadystatechange = function(){ if ( this.readyState == 4 ){ _this.parseData(this.responseText.split(/\s+/g));}};	
			//xhr.send( null );	
	    } else if(this.type === 'png'){// from png compress
	    	/*PNG.load(fname, function(pixels) {

	    		var pi = pixels.decode();
	    		var pix0, pix1, pix2, string ="";
	    		for(var i = 0, m = pi.length; i < m; i+=4) {
	    			pix0 = pi[i+0];
			        //pix1 = pi[i+1];
			        //pix2 = pi[i+2];
			        if( pix0<96 ) string += String.fromCharCode(pix0+32);
			       // if( pix1<96 ) string += String.fromCharCode(pix1+32);
			        //if( pix2<96 ) string += String.fromCharCode(pix2+32);
			    }
			    console.log(string);
			   // var array = string.split(",");
			    //_this.parseData(array);
			});*/
	    	xhr.responseType = 'blob';
	    	xhr.onload = function(e) {
	    		if (this.readyState == 4 ) {//if (this.status == 200) {
		    		var blob = this.response;
		    		var img = document.createElement('img');
		    		img.onload = function(e) {
		    			var c=document.createElement("canvas"), r='', pix, i, string = "";
		    			c.width = this.width;
		    			c.height = this.height;
		    			c.getContext('2d').drawImage(this, 0, 0);
		    			var d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
		    			for ( i = 0, l=d.length; i<l; i+=4){
							pix = d[i];
							if( pix<96 ) string += String.fromCharCode(pix+32);
						}
						//console.log(string)
						var array = string.split(",");

						_this.parseData(array);
		    		    window.URL.revokeObjectURL(img.src); // Clean up after yourself.
		    		}
		    		img.src = window.URL.createObjectURL(blob);
		    	}
	    	}
	    }
	    xhr.send( null );
    },
    parseData:function(data){
    	this.data = data;
		this.channels = [];
		this.nodes = [];
		this.Nodes = {};
		this.ParentNodes = {};
		this.ChildNodes = {};
		this.BoneByName = {};
		var done = false;
		while (!done) {
			switch (this.data.shift()) {
			case 'ROOT':
			    if(this.root !== null) this.clearNode();

				this.root = this.parseNode(this.data);
				this.root.position.copy(this.position);
				this.root.scale.set(this.scale,this.scale,this.scale);

				if(this.debug){
					this.addSkeleton( this.nodes.length );
				}
				break;
			case 'MOTION':
				this.data.shift();
				this.numFrames = parseInt( this.data.shift() );
				this.data.shift();
				this.data.shift();
				this.secsPerFrame = parseFloat(this.data.shift());
				done = true;
			}
		}

		debugTell("BVH frame:"+this.numFrames+" s/f:"+this.secsPerFrame + " channels:"+this.channels.length + " node:"+ this.nodes.length);
		this.getNodeList();
		this.startTime = Date.now();
		this.play = true;

		
    },
    reScale:function (s) {
    	this.scale = s;
    	this.root.scale.set(this.scale,this.scale,this.scale);
    },
    rePosition:function (v) {
    	this.position = v;
    	this.root.position.copy(this.position);
    },
    getNodeList:function () {
    	
    	var n = this.nodes.length, node, s = "", name;
    	for(var i=0; i<n; i++){
    		node = this.nodes[i];
    		name = node.name;

    		this.Nodes[name] = node;
    		if(node.parent){this.ParentNodes[name] = node.parent; }
		    else this.ParentNodes[name] = null;
		    if(node.children.length){this.ChildNodes[name] = node.children[0]; }
		    else this.ChildNodes[name] = null;

    		s += node.name + " _ "+ i +"<br>"//+" _ "+node.parent.name +" _ "+node.children[0].name+"<br>";
    	}
    	if(out2)out2.innerHTML = s;
    	if(this.endFunction!== null)this.endFunction();
    },
    addSkeleton:function ( n ) {
    	this.skeleton = new THREE.Object3D();
    	this.bones = [];

    	var n = this.nodes.length, node, bone;
    	//var geo = new THREE.CubeGeometry( 0.2, 0.2, 10 );//new THREE.Geometry();
    	//var geo = new THREE.BoxGeometry( this.boneSize, this.boneSize, 1);
    	var geo = new THREE.BoxGeometry( 1.5, 1.5, 1);
    	//geo.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0, 6 ) );
    	geo.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0, 0.5 ) );
    	//var mat = new THREE.MeshNormalMaterial();

    	for(var i=0; i<n; i++){
    		node = this.nodes[i];
    		if ( node.name !== 'Site' ){
    			bone = new THREE.Mesh(geo, this.material);
    			bone.castShadow = true;
                bone.receiveShadow = true;
    			bone.rotation.order = 'XYZ';
	    		bone.name = node.name;
	    		this.skeleton.add(bone);
	    		this.bones[i] = bone;
	    		this.BoneByName[node.name]= bone;
    	    }
    	}
    	scene.add( this.skeleton );
    	

    },
    updateSkeleton:function (  ) {
    	var mtx, node, bone;
    	var n = this.nodes.length;
    	var target;
    	for(var i=0; i<n; i++){
    		node = this.nodes[i];
    		bone = this.bones[i];

    		if ( node.name !== 'Site' ){
	    		mtx = node.matrixWorld;
	    		bone.position.setFromMatrixPosition( mtx );
	    		//this.skeletonBones[i].rotation.setFromRotationMatrix( mtx );
	    		if(node.children.length){
	    			target = new THREE.Vector3().setFromMatrixPosition( node.children[0].matrixWorld );
	    			bone.lookAt(target);
	    			bone.rotation.z = 0;

	    			if(bone.name==="Head")bone.scale.set(this.boneSize*2,this.boneSize*2,BVH.DistanceTest(bone.position, target)*(this.boneSize*1.3));
	    			else bone.scale.set(this.boneSize,this.boneSize,BVH.DistanceTest(bone.position, target));
	    		}
	    		/*if(node.parent){
	    			target = new THREE.Vector3().setFromMatrixPosition( node.parent.matrixWorld );
	    			this.skeletonBones[i].lookAt(target);
	    		}*/
	    	}
    	}
    },
	transposeName:function(name){
		if(name==="hip") name = "Hips";
		if(name==="abdomen") name = "Spine1";
		if(name==="chest") name = "Chest";
		if(name==="neck") name = "Neck";
		if(name==="head") name = "Head";
		if(name==="lCollar") name = "LeftCollar";
		if(name==="rCollar") name = "RightCollar";
		if(name==="lShldr") name = "LeftUpArm";
		if(name==="rShldr") name = "RightUpArm";
		if(name==="lForeArm") name = "LeftLowArm";
		if(name==="rForeArm") name = "RightLowArm";
		if(name==="lHand") name = "LeftHand";
		if(name==="rHand") name = "RightHand";
		if(name==="lFoot") name = "LeftFoot";
		if(name==="rFoot") name = "RightFoot";
		if(name==="lThigh") name = "LeftUpLeg";
		if(name==="rThigh") name = "RightUpLeg";
		if(name==="lShin") name = "RightLowLeg";
		if(name==="rShin") name = "LeftLowLeg";

		// leg
		if(name==="RightHip") name = "RightUpLeg";
		if(name==="LeftHip") name = "LeftUpLeg";
		if(name==="RightKnee") name = "RightLowLeg";
		if(name==="LeftKnee") name = "LeftLowLeg";
		if(name==="RightAnkle") name = "RightFoot";
		if(name==="LeftAnkle") name = "LeftFoot";
		// arm
		if(name==="RightShoulder") name = "RightUpArm";
		if(name==="LeftShoulder") name = "LeftUpArm";
		if(name==="RightElbow") name = "RightLowArm";
		if(name==="LeftElbow") name = "LeftLowArm";
		if(name==="RightWrist") name = "RightHand";
		if(name==="LeftWrist") name = "LeftHand";

		if(name==="rcollar") name = "RightCollar";
		if(name==="lcollar") name = "LeftCollar";

		if(name==="rtoes") name = "RightToe";
		if(name==="ltoes") name = "LeftToe";

		if(name==="upperback") name = "Spine1";
		
		return name;
	},
    parseNode:function(data){
    	var name, done, n, node, t;
		name = data.shift();
		name = this.transposeName(name);
		node = new THREE.Object3D();


		//node = new THREE.Mesh( new THREE.BoxGeometry(1,1,1),  this.nodeMaterial  )
		//node.add(b);
		node.name = name;

		done = false;
		while ( !done ) {
			switch ( t = data.shift()) {
				case 'OFFSET':
					node.position.set( parseFloat( data.shift() ), parseFloat( data.shift() ), parseFloat( data.shift() ) );
					node.offset = node.position.clone();
					break;
				case 'CHANNELS':
					n = parseInt( data.shift() );
					for ( var i = 0;  0 <= n ? i < n : i > n;  0 <= n ? i++ : i-- ) { 
						this.channels.push({ node: node, prop: data.shift() });
					}
					break;
				case 'JOINT':
				case 'End':
					node.add( this.parseNode(data) );
					break;
				case '}':
					done = true;
			}
		}
		//
		this.nodes.push(node);

		//this.Nodes[node.name] = node;
		   // if(node.parent){this.ParentNodes[node.name] = node.parent.name; console.log('pp')}
		   // else this.ParentNodes[node.name] = null;

		  //  scene.add( node );

		return node;
    },
    clearNode:function(){
    	var i;
    	if(out2)out2.innerHTML = "";

    	if(this.nodes){

	    	for (i=0; i<this.nodes.length; i++){
				this.nodes[i] = null;
			}
			this.nodes.length = 0;

			if(this.bones.length > 0){
		    	for ( i=0; i<this.bones.length; i++){
					if(this.bones[i]){
						this.bones[i].geometry.dispose();
					}
				}
				this.bones.length = 0;
		        scene.remove( this.skeleton );
		   }
		}
    },
    animate:function(){
    	//debugTell("frame" +  this.frame);
    	var ch;
		var n =  this.frame % this.numFrames * this.channels.length;
		var ref = this.channels;
		var isRoot = false;

		for ( var i = 0, len = ref.length; i < len; i++) {
			ch = ref[ i ];
			if(ch.node.name === "Hips") isRoot = true;
			else isRoot = false;


			switch ( ch.prop ) {
				case 'Xrotation':
				    this.autoDetectRotation(ch.node, "X", parseFloat(this.data[n]));
					//ch.node.rotation.x = (parseFloat(this.data[n])) * BVH.TO_RAD;
					break;
				case 'Yrotation':
				    this.autoDetectRotation(ch.node, "Y", parseFloat(this.data[n]));
					//ch.node.rotation.y = (parseFloat(this.data[n])) * BVH.TO_RAD;
					break;
				case 'Zrotation':
				    this.autoDetectRotation(ch.node, "Z", parseFloat(this.data[n]));
					//ch.node.rotation.z = (parseFloat(this.data[n])) * BVH.TO_RAD;
					break;
				case 'Xposition':
				    if(isRoot) ch.node.position.x = ch.node.offset.x + parseFloat(this.data[n])+ this.position.x;
					else ch.node.position.x = ch.node.offset.x + parseFloat(this.data[n]);
					break;
				case 'Yposition':
				    if(isRoot) ch.node.position.y = ch.node.offset.y + parseFloat(this.data[n])+ this.position.y;
					else ch.node.position.y = ch.node.offset.y + parseFloat(this.data[n]);
					break;
				case 'Zposition':
				    if(isRoot) ch.node.position.z = ch.node.offset.z + parseFloat(this.data[n])+ this.position.z;
					else ch.node.position.z = ch.node.offset.z + parseFloat(this.data[n]);
				break;
			}

			n++;
		}

		if(this.bones.length > 0) this.updateSkeleton();
		
    },
    autoDetectRotation:function(Obj, Axe, Angle){

    	this.tmpOrder+=Axe;
    	var angle = Angle * BVH.TO_RAD;

    	if(Axe === "X")this.tmpAngle[0] = angle;
    	else if(Axe === "Y")this.tmpAngle[1] = angle;
    	else this.tmpAngle[2] = angle;

    	if(this.tmpOrder.length===3){
    		//console.log(this.tmpOrder)
    		var e = new THREE.Euler( this.tmpAngle[0], this.tmpAngle[1], this.tmpAngle[2], this.tmpOrder );
    		this.order[Obj.name] =  this.tmpOrder ;
    		Obj.setRotationFromEuler(e);

    		Obj.updateMatrixWorld();

    		this.tmpOrder = "";
    		this.tmpAngle.length = 0;
    	}

    },
    update:function(){
    	if ( this.play ) { 
			this.frame = ((((Date.now() - this.startTime) / this.secsPerFrame / 1000) )*this.speed)| 0;
			if(this.oldFrame!==0)this.frame += this.oldFrame;
			if(this.frame > this.numFrames ){this.frame = 0;this.oldFrame=0; this.startTime =Date.now() }

			this.animate();
		}
    },
    next:function(){
    	this.play = false;
    	this.frame ++;
    	if(this.frame > this.numFrames )this.frame = 0;
    	this.animate();
    },
    prev:function(){
    	this.play = false;
    	this.frame --;
    	if(this.frame<0)this.frame = this.numFrames;
    	this.animate();
    }

}

BVH.DistanceTest = function( p1, p2 ){
    var x = p2.x-p1.x;
    var y = p2.y-p1.y;
    var z = p2.z-p1.z;
    var d = Math.sqrt(x*x + y*y + z*z);
    if(d<=0)d=0.1;
    return d;
}