OIMO.SweepAndPruneBroadPhase = function(){
    OIMO.BroadPhase.call( this);
    this.types = 0x2;

    this.numProxies=0;
    this.sortAxis=0;
    this.proxyPoolAxis=[];
    this.proxyPoolAxis.length = 3;
    this.proxyPoolAxis[0]=[];
    this.proxyPoolAxis[1]=[];
    this.proxyPoolAxis[2]=[];
    this.proxyPoolAxis[0].length = OIMO.WORLD_MAX_SHAPES;
    this.proxyPoolAxis[1].length = OIMO.WORLD_MAX_SHAPES;
    this.proxyPoolAxis[2].length = OIMO.WORLD_MAX_SHAPES;
}
OIMO.SweepAndPruneBroadPhase.prototype = Object.create( OIMO.BroadPhase.prototype );
OIMO.SweepAndPruneBroadPhase.prototype.addProxy = function (proxy) {
    this.proxyPoolAxis[0][this.numProxies]=proxy;
    this.proxyPoolAxis[1][this.numProxies]=proxy;
    this.proxyPoolAxis[2][this.numProxies]=proxy;
    this.numProxies++;
}
OIMO.SweepAndPruneBroadPhase.prototype.removeProxy = function (proxy) {
    this.removeProxyAxis(proxy,this.proxyPoolAxis[0]);
    this.removeProxyAxis(proxy,this.proxyPoolAxis[1]);
    this.removeProxyAxis(proxy,this.proxyPoolAxis[2]);
    this.numProxies--;
}
OIMO.SweepAndPruneBroadPhase.prototype.collectPairs = function () {
    this.numPairChecks=0;
    var proxyPool=this.proxyPoolAxis[this.sortAxis];
    var result;
    if(this.sortAxis==0){
    this.insertionSortX(proxyPool);
    this.sweepX(proxyPool);
    }else if(this.sortAxis==1){
    this.insertionSortY(proxyPool);
    this.sweepY(proxyPool);
    }else{
    this.insertionSortZ(proxyPool);
    this.sweepZ(proxyPool);
    }
}
OIMO.SweepAndPruneBroadPhase.prototype.sweepX = function (proxyPool) {
    var center;
    var sumX=0;
    var sumX2=0;
    var sumY=0;
    var sumY2=0;
    var sumZ=0;
    var sumZ2=0;
    var invNum=1/this.numProxies;
    var bodyStatic=OIMO.BODY_STATIC;
    for(var i=0, l=this.numProxies;i<l;i++){
        var p1=proxyPool[i];
        center=p1.minX+p1.maxX;
        sumX+=center;
        sumX2+=center*center;
        center=p1.minY+p1.maxY;
        sumY+=center;
        sumY2+=center*center;
        center=p1.minZ+p1.maxZ;
        sumZ+=center;
        sumZ2+=center*center;
        var s1=p1.parent;
        for(var j=i+1;j<l;j++){
            var p2=proxyPool[j];
            this.numPairChecks++;
            if(p1.maxX<p2.minX){
                break;
            }
            var s2=p2.parent;
            if( p1.maxY<p2.minY||p1.minY>p2.maxY||p1.maxZ<p2.minZ||p1.minZ>p2.maxZ||!this.isAvailablePair(s1,s2) ){
                continue;
            }
            this.addPair(s1,s2);
        }
    }
    sumX=sumX2-sumX*sumX*invNum;
    sumY=sumY2-sumY*sumY*invNum;
    sumZ=sumZ2-sumZ*sumZ*invNum;
    if(sumX>sumY){
        if(sumX>sumZ){
            this.sortAxis=0;
        }else{
            this.sortAxis=2;
        }
    }else if(sumY>sumZ){
        this.sortAxis=1;
    }else{
        this.sortAxis=2;
    }
}
OIMO.SweepAndPruneBroadPhase.prototype.sweepY = function (proxyPool) {
    var center;
    var sumX=0;
    var sumX2=0;
    var sumY=0;
    var sumY2=0;
    var sumZ=0;
    var sumZ2=0;
    var invNum=1/this.numProxies;
    var bodyStatic=OIMO.BODY_STATIC;
    for(var i=0, l=this.numProxies;i<l;i++){
        var p1=proxyPool[i];
        center=p1.minX+p1.maxX;
        sumX+=center;
        sumX2+=center*center;
        center=p1.minY+p1.maxY;
        sumY+=center;
        sumY2+=center*center;
        center=p1.minZ+p1.maxZ;
        sumZ+=center;
        sumZ2+=center*center;
        var s1=p1.parent;
        for(var j=i+1;j<l;j++){
            var p2=proxyPool[j];
            this.numPairChecks++;
            if(p1.maxY<p2.minY){
                break;
            }
            var s2=p2.parent;
            if( p1.maxX<p2.minX||p1.minX>p2.maxX||p1.maxZ<p2.minZ||p1.minZ>p2.maxZ||!this.isAvailablePair(s1,s2)){
                continue;
            }
            this.addPair(s1,s2);
        }
    }
    sumX=sumX2-sumX*sumX*invNum;
    sumY=sumY2-sumY*sumY*invNum;
    sumZ=sumZ2-sumZ*sumZ*invNum;
    if(sumX>sumY){
        if(sumX>sumZ){
            this.sortAxis=0;
        }else{
            this.sortAxis=2;
        }
    }else if(sumY>sumZ){
        this.sortAxis=1;
    }else{
        this.sortAxis=2;
    }
}
OIMO.SweepAndPruneBroadPhase.prototype.sweepZ = function (proxyPool) {
    var center;
    var sumX=0;
    var sumX2=0;
    var sumY=0;
    var sumY2=0;
    var sumZ=0;
    var sumZ2=0;
    var invNum=1/this.numProxies;
    var bodyStatic=OIMO.BODY_STATIC;
    for(var i=0, l=this.numProxies;i<l;i++){
        var p1=proxyPool[i];
        center=p1.minX+p1.maxX;
        sumX+=center;
        sumX2+=center*center;
        center=p1.minY+p1.maxY;
        sumY+=center;
        sumY2+=center*center;
        center=p1.minZ+p1.maxZ;
        sumZ+=center;
        sumZ2+=center*center;
        var s1=p1.parent;
        for(var j=i+1;j<l;j++){
            var p2=proxyPool[j];
            this.numPairChecks++;
            if(p1.maxZ<p2.minZ){
                break;
            }
            var s2=p2.parent;
            if( p1.maxX<p2.minX||p1.minX>p2.maxX||p1.maxY<p2.minY||p1.minY>p2.maxY||!this.isAvailablePair(s1,s2)){
                continue;
            }
            this.addPair(s1,s2);
        }
    }
    sumX=sumX2-sumX*sumX*invNum;
    sumY=sumY2-sumY*sumY*invNum;
    sumZ=sumZ2-sumZ*sumZ*invNum;
    if(sumX>sumY){
        if(sumX>sumZ){
            this.sortAxis=0;
        }else{
            this.sortAxis=2;
        }
    }else if(sumY>sumZ){
        this.sortAxis=1;
    }else{
        this.sortAxis=2;
    }
}
OIMO.SweepAndPruneBroadPhase.prototype.removeProxyAxis = function (proxy,proxyPool) {
    var idx=-1;
    for(var i=0, l=this.numProxies; i<l; i++){
        if(proxyPool[i]==proxy){
        idx=i;
        break;
        }
    }
    if(idx==-1){
        return;
    }
    for(var j=idx; j<l-1; j++){
        proxyPool[j]=proxyPool[j+1];
    }
    proxyPool[this.numProxies]=null;
}
OIMO.SweepAndPruneBroadPhase.prototype.insertionSortX = function (proxyPool) {
    if(this.numProxies==1) return;
    for(var i=1, l=this.numProxies; i<l; i++){
        var insert=proxyPool[i];
        if(proxyPool[i-1].minX>insert.minX){
            var j=i;
            do{
                proxyPool[j]=proxyPool[j-1];
                j--;
            }while(j>0&&proxyPool[j-1].minX>insert.minX);
            proxyPool[j]=insert;
        }
    }
}
OIMO.SweepAndPruneBroadPhase.prototype.insertionSortY = function (proxyPool) {
    if(this.numProxies==1) return;
    for(var i=1, l=this.numProxies; i<l; i++){
        var insert=proxyPool[i];
        if(proxyPool[i-1].minY>insert.minY){
            var j=i;
            do{
                proxyPool[j]=proxyPool[j-1];
                j--;
            }while(j>0&&proxyPool[j-1].minY>insert.minY);
            proxyPool[j]=insert;
        }
    }
}
OIMO.SweepAndPruneBroadPhase.prototype.insertionSortZ = function (proxyPool) {
    if(this.numProxies==1) return;
    for(var i=1, l=this.numProxies; i<l; i++){
        var insert=proxyPool[i];
        if(proxyPool[i-1].minZ>insert.minZ){
            var j=i;
            do{
                proxyPool[j]=proxyPool[j-1];
                j--;
            }while(j>0&&proxyPool[j-1].minZ>insert.minZ);
            proxyPool[j]=insert;
        }
    }
}