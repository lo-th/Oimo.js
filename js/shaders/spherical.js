/**
 * @author Jaume Sanchez / http://www.twitter.com/thespite
 * Spherical Environment Mapping
 */

var createSphericalShader = function(img, type){
    var shader, image;
    type = type || 1;
    if(typeof img == 'string' || img instanceof String) image = THREE.ImageUtils.loadTexture( img );
    else image = img;
    if(type==1) shader = spherical1;
    else shader = spherical2;
    var material = new THREE.ShaderMaterial({
        uniforms: { 
            tMatCap: { type: 't', value: image },
        },
        vertexShader: shader.vs,
        fragmentShader: shader.fs,
        shading: THREE.SmoothShading       
    });
    material.uniforms.tMatCap.value.wrapS = material.uniforms.tMatCap.value.wrapT = THREE.ClampToEdgeWrapping;
    return material;
};

var spherical1={
    attributes:{},
    uniforms:{ 
    	tMatCap: {type: 't', value: null}
    },
    fs:[
        'uniform sampler2D tMatCap;',
        'varying vec2 vN;',
        'void main() {',
            'vec3 base = texture2D( tMatCap, vN ).rgb;',
            'gl_FragColor = vec4( base, 1. );',
        '}'
    ].join("\n"),
    vs:[
        'varying vec2 vN;',
        'void main() {',
            'vec3 e = normalize( vec3( modelViewMatrix * vec4( position, 1.0 ) ) );',
            'vec3 n = normalize( normalMatrix * normal );',
            'vec3 r = reflect( e, n );',
            'float m = 2. * sqrt( pow( r.x, 2. ) + pow( r.y, 2. ) + pow( r.z + 1., 2. ) );',
            'vN = r.xy / m + .5;',
            'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1. );',
        '}'
    ].join("\n")
};

var spherical2={
    attributes:{},
    uniforms:{ 
        tMatCap: {type: 't', value: null}
    },
    fs:[
        'uniform sampler2D tMatCap;',
        'varying vec3 e;',
        'varying vec3 n;',
        'void main() {',
            'vec3 r = reflect( e, n );',
            'float m = 2. * sqrt( pow( r.x, 2. ) + pow( r.y, 2. ) + pow( r.z + 1., 2. ) );',
            'vec2 vN = r.xy / m + .5;',
            'vec3 base = texture2D( tMatCap, vN ).rgb;',
            'gl_FragColor = vec4( base, 1. );',
        '}'
    ].join("\n"),
    vs:[
        'varying vec3 e;',
        'varying vec3 n;',
        'void main() {',
            'e = normalize( vec3( modelViewMatrix * vec4( position, 1.0 ) ) );',
            'n = normalize( normalMatrix * normal );',
            'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1. );',
        '}'
    ].join("\n")
};

//---------------------------------------------------------

var sphere={
    attributes:{},
    uniforms:{ 
        resolution: {type: 'v2', value: null},
        noise: {type: 'f', value: null}
    },
    fs:[
        'uniform vec2 resolution;',
        'uniform float noise;',
        '#define VIG_REDUCTION_POWER 5.5',
        '#define VIG_BOOST 4.1',
        'float random(vec3 scale,float seed){return fract(sin(dot(gl_FragCoord.xyz+seed,scale))*43758.5453+seed);}',
        'void main() {',
            'vec3 color = vec3( 34. / 255. );',
            'vec2 center = resolution * 0.5;',
            'float vignette = distance( center, gl_FragCoord.xy ) / resolution.x;',
            'vignette = VIG_BOOST - vignette * VIG_REDUCTION_POWER;',
            'float n = noise * ( .5 - random( vec3( 1. ), length( gl_FragCoord ) ) );',
            'gl_FragColor = vec4( color * vec3( vignette ) + vec3( n ), 1. );',
        '}'
    ].join("\n"),
    vs:[
        'void main() {',
            'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
        '}'
    ].join("\n")
};

var sphereShader={
    attributes:{},
    uniforms:{ 
        tNormal: {type: 't', value: null},
        tMatCap: {type: 't', value: null},
        time: {type: 'f', value: 0},
        bump: {type: 'f', value: null},
        repeat: {type: 'v2', value: null},
        noise: {type: 'f', value: 0},
        useNormal: {type: 'f', value: 0},
        useRim: {type: 'f', value: 0},
        rimPower: {type: 'f', value: 0},
        useScreen: {type: 'f', value: 0},
        normalScale: {type: 'f', value: 0},
        normalRepeat: {type: 'f', value: 0}
    },
    fs:[
        'uniform float time;',
        'uniform float bump;',
        'uniform sampler2D tNormal;',
        'uniform sampler2D tMatCap;',
        'uniform float noise;',
        'uniform float useNormal;',
        'uniform float useRim;',
        'uniform float rimPower;',
        'uniform float useScreen;',
        'uniform float normalScale;',
        'uniform float normalRepeat;',
        'varying vec2 vUv;',
        'varying vec3 vTangent;',
        'varying vec3 vBinormal;',
        'varying vec3 vNormal;',
        'varying vec3 vEye;',
        'varying vec3 vU;',
        'varying vec2 vN;',
        'float random(vec3 scale,float seed){return fract(sin(dot(gl_FragCoord.xyz+seed,scale))*43758.5453+seed);}'
        'void main() {',
            'vec3 finalNormal = vNormal;',
            'vec2 calculatedNormal = vN;',
            'if( useNormal == 1. ) {',
                'vec3 normalTex = texture2D( tNormal, vUv * normalRepeat ).xyz * 2.0 - 1.0;',
                'normalTex.xy *= normalScale;',
                'normalTex.y *= -1.;',
                'normalTex = normalize( normalTex );',
                'mat3 tsb = mat3( normalize( vTangent ), normalize( vBinormal ), normalize( vNormal ) );',
                'finalNormal = tsb * normalTex;',
                'vec3 r = reflect( vU, normalize( finalNormal ) );',
                'float m = 2.0 * sqrt( r.x * r.x + r.y * r.y + ( r.z + 1.0 ) * ( r.z+1.0 ) );',
                'calculatedNormal = vec2( r.x / m + 0.5,  r.y / m + 0.5 );',
            '}',
            'vec3 base = texture2D( tMatCap, calculatedNormal ).rgb;',
            'if( useRim > 0. ) {',
                'float f = rimPower * abs( dot( vNormal, normalize( vEye ) ) );',
                'f = useRim * ( 1. - smoothstep( 0.0, 1., f ) );',
                'base += vec3( f );',
            '}',
            'if( useScreen == 1. ) {',
                'base = vec3( 1. ) - ( vec3( 1. ) - base ) * ( vec3( 1. ) - base );',
            '}',
            'base += noise * ( .5 - random( vec3( 1. ), length( gl_FragCoord ) ) );',
            'gl_FragColor = vec4( base, 1. );',
        '}'
    ].join("\n"),
    vs:[
        'attribute vec4 tangent;',
        'uniform float time;',
        'uniform vec2 repeat',
        'uniform float useNormal;',
        'uniform float useRim;',
        'varying vec2 vUv;',
        'varying vec3 vTangent;',
        'varying vec3 vBinormal;',
        'varying vec3 vNormal;',
        'varying vec3 vEye;',
        'varying vec3 vU;',
        'varying vec2 vN;',
        'void main() {',
            'vU = normalize( vec3( modelViewMatrix * vec4( position, 1.0 ) ) );',
            'if( useNormal == 0. ) {',
                'vec3 n = normalize( normalMatrix * normal );',
                'vec3 r = reflect( vU, n );',
                'float m = 2.0 * sqrt( r.x * r.x + r.y * r.y + ( r.z + 1.0 ) * ( r.z+1.0 ) );',
                'vN = vec2( r.x / m + 0.5,  r.y / m + 0.5 );',
            '} else {',
                'vN = vec2( 0. );',
            '}',
            'vUv = repeat * uv;',
            'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
            'vNormal = normalize( normalMatrix * normal );',
            'if( useNormal == 1. ) {',
                'vTangent = normalize( normalMatrix * tangent.xyz );',
                'vBinormal = normalize( cross( vNormal, vTangent ) * tangent.w );',
            '} else {',
                'vTangent = vec3( 0. );',
                'vBinormal = vec3( 0. );',
            '}',
            'if( useRim > 0. ) {',
                'vEye = ( modelViewMatrix * vec4( position, 1.0 ) ).xyz;',
            '} else {',
                'vEye = vec3( 0. );',
            '}',
        '}'
    ].join("\n")
};