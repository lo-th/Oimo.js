OIMO.DBVTBroadPhase = function(){
    OIMO.BroadPhase.call( this);
    this.types = 0x3;

    this.numLeaves = 0;
    this.maxLeaves = 0;
    this.tree=new OIMO.DBVT();
    this.maxStack=256;

    this.stack=[];// vector
    this.stack.length = this.maxStack;
    this.maxLeaves=256;
    this.leaves=[];// vector
    this.leaves.length = this.maxLeaves;
}
OIMO.DBVTBroadPhase.prototype = Object.create( OIMO.BroadPhase.prototype );
OIMO.DBVTBroadPhase.prototype.createProxy = function (shape) {
    return new OIMO.DBVTProxy(shape);
}
OIMO.DBVTBroadPhase.prototype.addProxy = function (proxy) {
    var p=(proxy);
    this.tree.insertLeaf(p.leaf);
    if(this.numLeaves==this.maxLeaves){
    //this.maxLeaves<<=1;
    this.maxLeaves*=2;
    var newLeaves=[];// vector
    newLeaves.length = this.maxLeaves;
    for(var i=0;i<this.numLeaves;i++){
    newLeaves[i]=this.leaves[i];
    }
    this.leaves=newLeaves;
    }
    this.leaves[this.numLeaves++]=p.leaf;
}
OIMO.DBVTBroadPhase.prototype.removeProxy = function (proxy) {
    var p=(proxy);
    this.tree.deleteLeaf(p.leaf);
    for(var i=0;i<this.numLeaves;i++){
    if(this.leaves[i]==p.leaf){
    this.leaves[i]=this.leaves[--this.numLeaves];
    this.leaves[this.numLeaves]=null;
    return;
    }
    }
}
OIMO.DBVTBroadPhase.prototype.collectPairs = function () {
    if(this.numLeaves<2)return;
    for(var i=0;i<this.numLeaves;i++){
    var leaf=this.leaves[i];
    var trueB=leaf.proxy.aabb;
    var leafB=leaf.aabb;
    if(
    trueB.minX<leafB.minX||trueB.maxX>leafB.maxX||
    trueB.minY<leafB.minY||trueB.maxY>leafB.maxY||
    trueB.minZ<leafB.minZ||trueB.maxZ>leafB.maxZ
    ){
    var margin=0.1;
    this.tree.deleteLeaf(leaf);
    leafB.minX=trueB.minX-margin;
    leafB.maxX=trueB.maxX+margin;
    leafB.minY=trueB.minY-margin;
    leafB.maxY=trueB.maxY+margin;
    leafB.minZ=trueB.minZ-margin;
    leafB.maxZ=trueB.maxZ+margin;
    this.tree.insertLeaf(leaf);
    this.collide(leaf,this.tree.root);
    }
    }
}
OIMO.DBVTBroadPhase.prototype.collide = function (node1,node2) {
    var stackCount=2;
    this.stack[0]=node1;
    this.stack[1]=node2;
    while(stackCount>0){
    var n1=this.stack[--stackCount];
    var n2=this.stack[--stackCount];
    var l1=n1.proxy!=null;
    var l2=n2.proxy!=null;
    this.numPairChecks++;
    if(l1&&l2){
    var s1=n1.proxy.shape;
    var s2=n2.proxy.shape;
    var b1=s1.aabb;
    var b2=s2.aabb;
    if(
    s1==s2||
    b1.maxX<b2.minX||b1.minX>b2.maxX||
    b1.maxY<b2.minY||b1.minY>b2.maxY||
    b1.maxZ<b2.minZ||b1.minZ>b2.maxZ||
    !this.isAvailablePair(s1,s2)
    ){
    continue;
    }
    this.addPair(s1,s2);
    }else{
    b1=n1.aabb;
    b2=n2.aabb;
    if(
    b1.maxX<b2.minX||b1.minX>b2.maxX||
    b1.maxY<b2.minY||b1.minY>b2.maxY||
    b1.maxZ<b2.minZ||b1.minZ>b2.maxZ
    ){
    continue;
    }
    if(stackCount+4>=this.maxStack){
    //this.maxStack<<=1;
    this.maxStack*=2;
    var newStack=[];// vector
    newStack.length = this.maxStack;
    for(var i=0;i<stackCount;i++){
    newStack[i]=this.stack[i];
    }
    this.stack=newStack;
    }
    if(l2||!l1&&(n1.aabb.surfaceArea()>n2.aabb.surfaceArea())){
    this.stack[stackCount++]=n1.child1;
    this.stack[stackCount++]=n2;
    this.stack[stackCount++]=n1.child2;
    this.stack[stackCount++]=n2;
    }else{
    this.stack[stackCount++]=n1;
    this.stack[stackCount++]=n2.child1;
    this.stack[stackCount++]=n1;
    this.stack[stackCount++]=n2.child2;
    }
    }
    }
}