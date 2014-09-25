// loth pool
SEA3D.Pool = function(url, endFunction, type){
    this.imgs = {};
    this.meshs = {};
}

SEA3D.Pool.prototype = {
    constructor: SEA3D.Pool,
    // LOAD IMAGES Array
    loadImages:function(url, endFunction){
        if(typeof url == 'string' || url instanceof String){
            var singleurl = url;
            url = [singleurl];
        }
        var _this = this;
        var img = new Image();
        img.onload = function(){
            var name = url[0].substring(url[0].lastIndexOf("/")+1, url[0].lastIndexOf("."));
            _this.imgs[name] = this;

            // load next
            url.shift();
            if(url.length) _this.loadImages(url, endFunction);
            else if(endFunction)endFunction();
        };
        img.src = url[0];
    },
    getTexture:function( name, revers ){
        var tx = new THREE.Texture(this.imgs[name]);
        if(revers){
            tx.repeat.set( 1, -1 ); 
            tx.wrapS = tx.wrapT = THREE.RepeatWrapping;
        }
        tx.needsUpdate = true;
        return tx;
    },

    // LOAD MODELS Array
    loadModels:function (url, endFunction, type){
        if(typeof url == 'string' || url instanceof String){
            var singleurl = url;
            url = [singleurl];
        }
        var name = url[0].substring(url[0].lastIndexOf("/")+1, url[0].lastIndexOf("."));
        type = type || 'default';
        var _this = this;
        var loader = new THREE.SEA3D( true );
        loader.onComplete = function( e ) {
            var i = loader.meshes.length;
            while(i--){ _this.meshs[name+'_'+loader.meshes[i].name] = loader.meshes[i]; }
            
            // load next
            url.shift();
            if(url.length) _this.loadModels(url, endFunction);
            else if(endFunction)endFunction();
        }
        if(type=='auto') loader.parser = THREE.SEA3D.AUTO;
        else if(type=='buffer') loader.parser = THREE.SEA3D.BUFFER;
        else loader.parser = THREE.SEA3D.DEFAULT;
        loader.load( url[0] );
    },
    getMesh:function (name){
        return this.meshs[name];
    },
    getGeometry:function (name, s, axe){
        s = s || 1;
        axe = axe || 'z';
        var sa = [1,1,1];
        if(axe=='x')sa[0]=-1;
        if(axe=='y')sa[1]=-1;
        if(axe=='z')sa[2]=-1;
        var mtx = new THREE.Matrix4().makeScale(s*sa[0], s*sa[1], s*sa[2]);
        var g = this.meshs[name].geometry;
        g.applyMatrix(mtx);
        g.computeBoundingBox();
        g.computeBoundingSphere();
        return g;
    }

    /*
    for ( j=0; j < m.geometry.morphTargets.length; j++){
                    morph[i] = m.geometry.morphTargets[j].name;
                }
    */
    
}