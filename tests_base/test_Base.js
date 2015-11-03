function TestBase() {
    add({type:'box', size:[50, 2, 50], pos:[0,-1,0]});
    //add({type:'box', size:[10, 2, 10], pos:[10,-1,0]});
    //add({type:'box', size:[10, 2, 10], pos:[-10,-1,0]})

    var i = 600, x, z;
    while(i--){
        x = OIMO.rand(-3,3);
        z = OIMO.rand(-3,3);
        //add({ type:'sphere', size:[0.2], pos:[x,i*0.2,z], move:true});
        //add({ type:'box', size:[0.5,0.5,0.5], pos:[x,i*0.5,z], move:true});
        add({ type:'cylinderTrue', size:[1,2], pos:[x,i*0.5,z], move:true});
    }
}

//TestBase.prototype.Step = function() {
  
//};