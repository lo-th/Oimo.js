THREE.ShaderShadow = {

    uniforms: Object.assign( {}, //[

        //THREE.UniformsLib[ "lights" ],
        THREE.UniformsLib.lights,

        {

            "diffuse": { value: new THREE.Color( 0xeeeeee ) },
            "specular": { value: new THREE.Color( 0x111111 ) },
            "emissive": { value: new THREE.Color( 0x000000 ) },
            "opacity": { value: 0.4 },

        }

    //] 
    ),

    fragmentShader: [

        "uniform float opacity;",
        "varying vec2 vUv;",

        THREE.ShaderChunk[ "common" ],
        THREE.ShaderChunk[ "packing" ],
        THREE.ShaderChunk[ "bsdfs" ],
        
        THREE.ShaderChunk[ "lights_pars" ],
        THREE.ShaderChunk[ "shadowmap_pars_fragment" ],
        THREE.ShaderChunk[ "shadowmask_pars_fragment" ],

        "void main() {",

            "   float mask = getShadowMask();",
            "   vec4 pp = vec4(1.0);",
            "   vec4 mapping = vec4( pp.rgb, pp.a * opacity );",
            //"   mapping.a *= mapAlpha;",
            "   vec4 shadowing = vec4( vec3(0.0), opacity * (1.0 - mask) );",
            "   gl_FragColor = mix( mapping, shadowing, 1.0 - mask );",
            "   gl_FragColor = shadowing;",
            //"   gl_FragColor += mapping;",

        "}"

    ].join( "\n" ),

    vertexShader: [

        "varying vec2 vUv;",

        THREE.ShaderChunk[ "common" ],
        THREE.ShaderChunk[ "bsdfs" ],
        THREE.ShaderChunk[ "lights_pars" ],
        THREE.ShaderChunk[ "shadowmap_pars_vertex" ],
        

        "void main() {",

            "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
            "vec4 worldPosition = modelMatrix * vec4( position, 1.0 );",

            "vUv = uv;",

            "gl_Position = projectionMatrix * mvPosition;",

            //THREE.ShaderChunk[ "lights_lambert_vertex" ],
            THREE.ShaderChunk[ "shadowmap_vertex" ],

        "}"

    ].join( "\n" ),

    lights: true,
    transparent:true,
    //depthTest:false,
    depthWrite:false,

}