function JointLink ( joint ){
    
    // The previous joint link.
    this.prev = null;
    // The next joint link.
    this.next = null;
    // The other rigid body connected to the joint.
    this.body = null;
    // The joint of the link.
    this.joint = joint;

};

export { JointLink };