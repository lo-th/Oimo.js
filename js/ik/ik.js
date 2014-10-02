var IK = IK || {};
IK.ToRad = Math.PI/180;
IK.ToDeg = 180 / Math.PI;
// TODO Check the validity of the joint hierarchy (tree).
// e.g. No duplicated nodes at multiple places, no cycles, etc.

IK.Node = function(name) {

	// The name of this node.
	this.name = name;

	// The joint on which this node is the lower end.
	// This information if essential for tracing a joint chain back to the root
	// node from here.
	this.pjoint = null;

	// The joints originating from this node.
	this.joints = [];
};
IK.Node.prototype = {
    constructor: IK.Node,
    // Append a joint to a node, interconnecting them two.
	append : function(joint) {
		this.joints.push(joint);
		joint.unode = this;
	},
	// Remove a joint from a node, disconnecting them two. Do nothing if the given
	// joint is not connected to the current node.
	// Also note that all the other joints connected to this node are not affected
	// in anyway.
	remove : function(joint) {
		var index = this.joints.indexOf(joint);
		if (index >= 0) {
			this.joints.splice(index, 1);
			joint.unode = null;
		}
	},
	// Traverse the joint hierarchy with the current node being the root in breadth
	// first search (BFS) order, processing each node with the given function.
	// The traverse terminates when all nodes in this hierarchy are accessed or
	// whenever the given function returns 'false'.
	bfs : function(f, name) {

		// f = function(node) { ... }
		var open = [];
		open.push(this);
		var n = 0;
		while (open.length > 0) {
			var node = open.splice(0, 1)[0];
			var ret = f(node, name ,n++);
			if (ret == false) return;

			var joints = node.joints;
			//for (var i = 0; i < joints.length; ++i) {
			var i = joints.length;
			while(i--){
				open.push(joints[i].lnode);
			}

		}

	},
	// Find the first node with the given name in the joint hierarchy with the
	// current node being the root, in breadth first search (BFS) order. Return
	// 'null' if no node with the given name is found.
	bfsFindNode : function(name) {

		var targetNode = null;

		var find = function(node) {

			if (node.name == name) {
				targetNode = node;
				return false;
			} else {
				return true;
			}
		};
		this.bfs(find);
		return targetNode;
	},
	// Traverse the joint hierarchy with the current node being the root in depth
	// first search (DFS) order, processing each node with the given function.
	// The traverse terminates when all nodes in this hierarchy are accessed or
	// whenever the given function returns 'false'.
	dfs : function(f, name) {

		// f = function(node) { ... }
		var open = [];
		open.push(this);

		while (open.length > 0) {
			var node = open.pop();
			var ret = f(node, name);
			if (ret == false)
				return;
			var joints = node.joints;
			for (var i = joints.length - 1; i >= 0; --i) {
				open.push(joints[i].lnode);
			}
		}
	},
	// Compute the transformation matrix of a given node relative to the root node
	// of its joint hierarchy.
	getRootTrans : function() {

		// Initialize the transformation matrix to identity.
		var rootTrans = IK.midentity(3);

		// For every joint on the joint chain connecting this node and the root
		// node, in backward order.

		var pjoint = this.pjoint;
		while (pjoint != null) {

			var length = pjoint.length;
			var angle = pjoint.angle;

			var mtranslate = IK.m2translate(length, 0);
			var mrotate = IK.m2rotate(angle);

			// Multiply the current transformation by a translation matrix and a
			// rotation matrix based on the length and the angle of the joint.
			rootTrans = IK.mmult(mtranslate, rootTrans);
			rootTrans = IK.mmult(mrotate, rootTrans);

			pjoint = pjoint.unode.pjoint;
		}

		return rootTrans;
	},

	// Compute the position of the current node in the coordinates of the root node.
	getRootCoordPos : function() {

		var rtrans = this.getRootTrans();

		// A 2-D vector is returned.
		return IK.mtranspose(IK.mmult(rtrans, IK.mtranspose([[0, 0, 1]])))[0].splice(0, 2);
	},

	// Step the joint chain connecting this node and the root node given the goal
	// position of the end effector, which is this node, and a given time step.
	stepIk : function(pos, dt) {
		// Find the joint chain from this node back to the root node,
		// as well as the nodes on the ends of these joints.
		var joints = [];
		var nodes = [];

		var pjoint = this.pjoint;
		while (pjoint != null) {

			joints.push(pjoint);
			var node = pjoint.unode;
			nodes.push(node);
			pjoint = node.pjoint;
		}
		// Rearrange them in the order of hierarchy.
		joints.reverse();
		nodes.reverse();

		// Do nothing if this node is the root node since it cannot move.
		if (nodes.length == 0) return null;

		// Compute the positions of the nodes on the joint chain in root node
		// coordinates.
		var rootCoordPoses = [];
		//for (var i = 0; i < nodes.length; ++i) {
		var i = nodes.length;
		while(i--){

			var node = nodes[i];
			var rootCoordPos = node.getRootCoordPos();
			rootCoordPos.push(0);
			rootCoordPoses.push(rootCoordPos);
		}

		// Compute the change of the end effector position.
		// Represented with 2-D homogeneous coordinates.
		var curPos = this.getRootCoordPos();
		curPos.push(0);
		var goalPos = [pos[0] || 0, pos[1] || 0, pos[2] || 0];
		var vdeltaPos = IK.vsub(goalPos, curPos);

		// Position change represented as a column matrix.
		var mdeltaPos = IK.mtranspose([vdeltaPos.slice(0, 2)]);

		// Compute the Jacobian matrix, its transpose and inverse.

		var jacobian;
		var tjacobian;
		var ijacobian;

		var computeJacobian = function() {

			tjacobian = [];
			var axis = [0, 0, 1];
			//for (var i = 0; i < rootCoordPoses.length; ++i) {
			var i = rootCoordPoses.length;
			while(i--){

				var cross = IK.v3cross(axis, IK.vsub(curPos, rootCoordPoses[i]));

				// The extra coordinate of the cross product is discarded to avoid
				// matrix singularity, since it is always zero in this case.
				tjacobian.push(cross.slice(0, 2));
			}
			jacobian = IK.mtranspose(tjacobian);
			ijacobian = IK.minvert(IK.mmult(jacobian, tjacobian));
		};

		computeJacobian();

		// If the Jacobian is non-invertible, perturb the joint chain configuration
		// a tiny fraction and try again. This usually solves the problems of
		// colinear joints.
		if (ijacobian == null) {

			var perturbJoints = function(eps) {

				//for (var i = 0; i < joints.length; ++i) {
				var i = joints.length;
			    while(i--){
					var joint = joints[i];
					joint.angle += (Math.random() - 0.5) * 2 * eps;
				}
			};

			var eps = 1e-6;
			perturbJoints(eps);
			computeJacobian();

			// If the Jacobian is still non-invertible, do nothing and return
			// immediately.
			if (ijacobian == null) return null;
		}

		// Compute the pseudoinverse of the Jacobian.
		var pijacobian = IK.mmult(tjacobian, ijacobian);

		// Compute the joint velocity matrix.
		// The number of columns corresponds to the DoF of each joint and
		// the number of rows corresponds to the length of the joint chain.
		var mjointv = IK.mmult(pijacobian, mdeltaPos);

		// A helper function that extracts the configuration of a joint chain into
		// a matrix.
		// The number of columns corresponds to the DoF of each joint and
		// the number of rows corresponds to the length of the joint chain.
		var conf2m = function(joints) {

			var m = new Array(joints.length);

			//for (var i = 0; i < joints.length; ++i) {
			var i = joints.length;
			while(i--){
				m[i] = new Array(1);
				m[i][0] = joints[i].angle;
			}

			return m;
		};

		// A helper function that updates the configuration of a joint chain with
		// the data in a matrix.
		// The number of columns corresponds to the DoF of each joint and
		// the number of rows corresponds to the length of the joint chain.
		var m2conf = function(m, joints) {

			//for (var i = 0; i < m.length; ++i) {
			var i = m.length;
			while(i--){
				joints[i].angle = m[i][0];
			}
		};

		// Current joint chain configuration matrix and the distance between the
		// current position of the end effector and the goal position.
		var mcurConf = conf2m(joints);
		var curDistance = IK.vmag(IK.vsub(pos, this.getRootCoordPos()));

		// Updated joint chain configuration matrix and the distance between the
		// updated position of the end effector and the goal position.
		var mupdatedConf = IK.madd(mcurConf, IK.msmult(mjointv, dt));
		m2conf(mupdatedConf, joints);
		var updatedDistance = IK.vmag(IK.vsub(pos, this.getRootCoordPos()));

		// If the updated distance is not reduced compared with the current
		// distance (within a given tolerance), then revert to the current
		// configuration. (This may be caused by numerical instability, an
		// unreachable goal position, etc.)
		var eps = 0;
		if (updatedDistance - curDistance > eps) {
			m2conf(mcurConf, joints);
			return null;
		}

		// Return the joint velocity matrix only if the update to the joint chain
		// configuration has actually been made.
		return mjointv;
	}
}


IK.Joint = function(name, lname, length, angle, max, min) {

	// The name of this joint.
	this.name = name;

	// The upper node, which is initialized to 'null' here and typically set by
	// 'Node.append()' later.
	this.unode = null;
	// The lower node, which is interconnected with the current joint.
	this.lnode = new IK.Node(lname);
	this.lnode.pjoint = this;

	// The length of this joint.
	this.length = length;

	// The rotation angle of this joint, which is relative to its parent
	// joint's orientation, starting from the positive x axis,
	// counterclockwise.
	this.angle = angle;
	this.maxAngle = max;
	this.minAngle = min;
};


IK.Chaine = function(obj){
	var nBones = obj.n || 3;
	var name = obj.name || "basic";
	var lengths = obj.lengths || [];
	var angles = obj.angles || [];

	var nObj = [];
	var newObj;
	for(var i=0; i<nBones; i++){
		//nObj[i] = {};
		newObj = {};
		if(i==0){
			newObj.rootName = name;
			newObj.name = name;
		}
		if(i==nBones-1){
			newObj.lname ='end';
		}
		
		newObj.length = lengths[i] || 10;
		newObj.angle = angles[i] || 0;

		nObj[i] = newObj;
		if(i>0)nObj[i-1].joints = [newObj];

	}

	/*for(var i=0; i<nBones; i++){
		if(i>0)nObj[i-1].joints = [nObj[i]];
	}*/


	//return nObj[0]
	return IK.jointHierFromJs(nObj[0]);
	//console.log(nObj[0])

	/*var newObj = {};
	newObj.rootName = name;
	newObj.name = name;
	newObj.length = lengths[0] || 20;
	newObj.angle = angles[0] || 0;
	newObj.joints = [];*/



}

IK.js2joint = function(js) {
	var rootName = js.rootName;
	var name = js.name;
	var lname = js.lname;
	var length = js.length;
	var angle = js.angle;

	var joint = new IK.Joint(name, lname, length, angle);

	if (rootName != undefined) {

		// Also interconnect the joint to the root node if the name of the
		// latter is specified.
		var rootNode = new IK.Node(rootName);
		joint.unode = rootNode;
		rootNode.joints.push(joint);
	}

	return joint;
};

IK.jointHierFromJs = function(js) {

	// A helper function converting a JavaScript object describing a joint's
	// configuration and associated node(s) into a joint.
	/*var js2joint = function(js) {

		var rootName = js.rootName;
		var name = js.name;
		var lname = js.lname;
		var length = js.length;
		var angle = js.angle;

		var joint = new IK.Joint(name, lname, length, angle);

		if (rootName != undefined) {

			// Also interconnect the joint to the root node if the name of the
			// latter is specified.
			var rootNode = new IK.Node(rootName);
			joint.unode = rootNode;
			rootNode.joints.push(joint);
		}

		return joint;
	};*/

	// Root joint.
	var rootJoint = new IK.js2joint(js);

	// Open list for unprocessed description objects and joints. These two
	// lists always match each other.

	var openJs = [];
	var openJoints = [];
	openJs.push(js);
	openJoints.push(rootJoint);

	while (openJs.length > 0) {

		// Pop one item from both lists.

		var curJs = openJs.splice(0, 1)[0];
		var curJoint = openJoints.splice(0, 1)[0];

		// Process the joints connected to the current joint, if any.

		var jointsJs = curJs.joints;
		if (jointsJs == undefined) continue;

		//for (var i = 0; i < jointsJs.length; ++i) {
		var i = jointsJs.length;
		while(i--){
			var jointJs = jointsJs[i];
			var joint = new IK.js2joint(jointJs);

			// Interconnect a descendant joint with the lower node of the
			// current joint.
			joint.unode = curJoint.lnode;
			joint.unode.joints.push(joint);

			// Add the newly generated item and its description object for
			// subsequent processing.
			openJs.push(jointJs);
			openJoints.push(joint);
		}
	}

	// Return the root joint, from which the entire joint hierarchy can be
	// traversed.
	return rootJoint;
};
