function BlobEffect(){
    this.isActive = false;
    this.first = true;

    this.rootTarget = null;
    this.glowTargetxy = null;
    this.glowTarget = null;
    
    this.blobxy = new THREE.ShaderMaterial( CloudGausXY );
    this.blobmin = new THREE.ShaderMaterial( CloudGausMIN );
    this.blobbase = new THREE.ShaderMaterial( CloudBasic );
    this.blobbase.uniforms.map.value = THREE.ImageUtils.loadTexture( 'images/spoint.png');
    this.blobbase.uniforms.usemap.value = true;
    
    this.metaball = new THREE.ShaderMaterial( BlobShader );
    //this.metaball = new THREE.ShaderMaterial( MetaballShader );
    //this.metaball.uniforms.env.value = THREE.ImageUtils.loadTexture( 'textures/env0.jpg');

    //this.gauss = new GaussTexture(64,1,0.075125);//;0.067);
    this.gauss = new GaussTexture(32,1,0.067);

    //this.gauss = new GaussTexture(16,1,0.067);
    this.blobxy.uniforms.map.value = this.gauss;
    this.blobmin.uniforms.map.value = this.gauss;


    this.camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );
    this.scene = new THREE.Scene();
    this.scene.add( new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), this.metaball ) );

}

BlobEffect.prototype = {
    render:function(){

        baseGroup.visible = false;
        extraGroup.visible = true;

        particlesCloud.material = this.blobxy;
        renderer.render( scene, camera, this.glowTargetxy, true );

        particlesCloud.material = this.blobmin;
        renderer.render( scene, camera, this.glowTargetmin, true );

        particlesCloud.material = this.blobbase;
        renderer.render( scene, camera, this.rootTarget, true );

        baseGroup.visible = true;
        extraGroup.visible = false;


        renderer.render( this.scene, this.camera );
        renderer.render( scene, camera );

    },
    initTarget:function(w,h){
        var w = vsize.w;
        var h = vsize.h;

        //this.glowParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat};//, stencilBufer: false };

        this.glowParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat, stencilBufer: false };

        this.rootTarget = new THREE.WebGLRenderTarget(  w, h , this.glowParameters );
        this.glowTargetxy = new THREE.WebGLRenderTarget(  w, h, this.glowParameters );
        this.glowTargetmin = new THREE.WebGLRenderTarget(  w, h, this.glowParameters );

        this.metaball.uniforms.mapping.value = this.rootTarget;
        this.metaball.uniforms.mapXY.value = this.glowTargetxy;
        this.metaball.uniforms.mapMin.value = this.glowTargetmin;
        this.metaball.uniforms.vW.value = w;
        this.metaball.uniforms.vH.value = h;
    },
    resize:function(){
        if(!this.isActive && !this.first) return;
        this.first = false;
        this.dispose();
        this.initTarget();
    },
    dispose:function() {
        if ( this.glowTargetxy ) this.glowTargetxy.dispose();
        if ( this.glowTarget ) this.glowTarget.dispose();
        if ( this.rootTarget ) this.rootTarget.dispose();
    }
}

// GAUSS TEXTURE
function GaussTexture(e, t, n) {
    this.sets = { size: e || 64, height: t || 1, deviation: n || .067 };
    return this.createGaussTexture()
}

GaussTexture.prototype = {
    createGaussTexture: function () {
        var e = this.sets.size * this.sets.size * 3;
        var t = new Uint8Array(e);
        var n, r, i, u, o, c;
        var s = this.sets.size * 0.5;
        o = this.sets.size;
        while(o--){
            u = this.sets.size;
            while(u--){
                n = 2 * u / this.sets.size - 1;
                r = 2 * o / this.sets.size - 1;
                i = this.sets.height * Math.exp(-(n * n + r * r) / this.sets.deviation);
                i *= 255;
                c = 3 * (o * this.sets.size + u);
                t[c+0] = i;
                t[c+1] = i;
                t[c+2] = i;
            }
        }
        var l = new THREE.DataTexture(t, this.sets.size, this.sets.size, THREE.RGBFormat);
        //l.wrapS = l.wrapT = THREE.ClampToEdgeWrapping;
        l.needsUpdate = true;
        return l;
    }
}