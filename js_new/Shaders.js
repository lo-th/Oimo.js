var CloudBasic = {
    uniforms:{
        scale :  { type: 'f', value: 800 },
        map: { type: 't', value: null },
        usemap: {type: 'i', value: 0},
    },
    fragmentShader:[
        'uniform sampler2D map;',
        'uniform int usemap;',
        'varying vec4 col;',
        'void main(){',
        '    vec4 dif = col;',
        '    if(usemap  == 1){',
        '        vec2 uv = vec2( gl_PointCoord.x, 1.0 - gl_PointCoord.y );',
        '        vec4 tx = texture2D( map, uv );',
        '        dif *= tx;',
        '    }',
        '    if ( dif.a == 0.0 ) discard;',
        '    gl_FragColor = dif;',
        '}'
    ].join('\n'),
    vertexShader:[
        'attribute vec4 colors;',
        'attribute float size;',
        'uniform float scale;',
        'varying vec4 col;',

        'void main(){',
        '    col = colors*0.003921569;',
        '    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );',
        '    float invsize = size;',
        '    gl_PointSize = invsize * ( scale / length( mvPosition.xyz ) );',
        '    gl_Position = projectionMatrix * mvPosition;',
        '}'
    ].join('\n'),
    
    
    transparent:true, depthWrite:false, depthTest:false,
};

var CloudGausXY = {
    uniforms:{
        map : { type: 't', value: null },
        scale : { type: 'f', value: 800.0 }
    },
    fragmentShader: [
        'uniform sampler2D map;',
        'void main() {',
        '    vec2 uv = vec2( gl_PointCoord.x, 1.0 - gl_PointCoord.y );',
        '    float gau = texture2D(map, uv).x;',
        '    vec2 uvG = uv*2.0 - vec2(1.0,1.0);',
        '    uvG *= 2.0;',
        '    uvG = -uvG;',
        '    uvG *= gau;',
        '    vec4 dif = vec4(uvG, gau, gau);',
        '    if ( dif.a == 0.0 ) discard;',
        '    gl_FragColor = dif;',
        '}'
    ].join('\n'),
    vertexShader: [
        'attribute float size;',
        'uniform float scale;',
        'void main() {',
        '    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );',
        '    gl_PointSize = size * ( scale / length( mvPosition.xyz ) );',
        '    gl_Position = projectionMatrix * mvPosition;',
        '}'
    ].join('\n'),
    transparent:true, depthTest:false, depthWrite:true
}

var CloudGausMIN = {
    uniforms:{
        map : { type: 't', value: null },
        scale : { type: 'f', value: 800.0 }
    },
    fragmentShader: [
        'uniform sampler2D map;',
        'void main() {',
        '    vec2 uv = vec2(  gl_PointCoord.x, 1.0 - gl_PointCoord.y );',
        '    float gau = texture2D(map, uv).x;',
        '    vec2 uvG = uv*2.0 - vec2(1.0,1.0);',
        '    uvG *= 2.0;',
        '    uvG *= gau;',
        '    vec4 dif = vec4(uvG, gau, gau);',
        '    if ( dif.a == 0.0 ) discard;',
        '    gl_FragColor = dif;',
    '}'
    ].join('\n'),
    vertexShader: [
        'attribute float size;',
        'uniform float scale;',
        'void main() {',
        '    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );',
        '    gl_PointSize = size * ( scale / length( mvPosition.xyz ) );',
        '    gl_Position = projectionMatrix * mvPosition;',
        '}'
    ].join('\n'),
    transparent:true, depthTest:false, depthWrite:true
}

var BlobShader = {
    uniforms:{
        mapXY    : { type:'t', value: null },
        mapMin   : { type:'t', value: null },
        mapping : { type:'t', value: null },

        vW : { type:'f', value: 0 },
        vH : { type:'f', value: 0 },

        reflectionFactor: { type:'f', value: 0.6 },
        refractionRatio: { type:'f', value: 0.98 },

        rimPower:    { type:'f', value: 0.5 },
        rimEdge:     { type:'f', value: 0.9 },
        rimColor:    { type:'c', value: new THREE.Color(0xCCCCCC) },

        useLight :   { type:'i', value: 1 },
        lightColor:  { type:'c', value: new THREE.Color(0x404040) },
        lightOrbit:  { type:'v3', value: new THREE.Vector3(-45,45,60)},
        lightAnim :  { type:'v2', value: new THREE.Vector2(0.0,0.0) },
        amplitude:   { type:'f', value: 0 },
        
    },
    fragmentShader: [
        'uniform sampler2D mapXY;',
        'uniform sampler2D mapMin;',
        'uniform sampler2D mapping;',

        'uniform float vW;',
        'uniform float vH;',

        'uniform float reflectionFactor;',
        'uniform float refractionRatio;',

        'uniform float rimPower;',
        'uniform float rimEdge;',
        'uniform vec3 rimColor;',

        'uniform int useLight;',
        'uniform vec3 lightColor;',
        'uniform vec3 lightOrbit;',
        'uniform vec2 lightAnim;',
        'uniform float amplitude;',

        'const float Pi = 3.1415926;',

        


        'varying vec2 vUv;',

        'vec4 blurred(sampler2D map, vec2 UV, vec2 blur){',
        '    vec4 sum = vec4(0.0);',
        '    sum += texture2D(map, vec2(UV.x - 4.0 * blur.x, UV.y - 4.0 * blur.y)) * 0.05;',
        '    sum += texture2D(map, vec2(UV.x - 3.0 * blur.x, UV.y - 3.0 * blur.y)) * 0.09;',
        '    sum += texture2D(map, vec2(UV.x - 2.0 * blur.x, UV.y - 2.0 * blur.y)) * 0.12;',
        '    sum += texture2D(map, vec2(UV.x - blur.x, UV.y - blur.y)) * 0.15;',
        '    sum += texture2D(map, vec2(UV.x, UV.y)) * 0.16;',
        '    sum += texture2D(map, vec2(UV.x + blur.x, UV.y + blur.y)) * 0.15;',
        '    sum += texture2D(map, vec2(UV.x + 2.0 * blur.x, UV.y + 2.0 * blur.y)) * 0.12;',
        '    sum += texture2D(map, vec2(UV.x + 3.0 * blur.x, UV.y + 3.0 * blur.y)) * 0.09;',
        '    sum += texture2D(map, vec2(UV.x + 4.0 * blur.x, UV.y + 4.0 * blur.y)) * 0.05;',
        '    return sum;',
        '}',

      

        'float sm(float e1, float e2, float x){',
        '    float r = clamp((x - e1)/(e2 - e1), 0.0, 1.0);',
        '    return r*r*(3.0 - 2.0*r);',
        '}',

        'void main() {',
        '    float r = vW/vH;',
        '    float m = 1.0;',
        '    vec2 b = vec2(m/(vW), (m)/(vH));',
        



        '    vec4 txt = texture2D(mapping, vUv);',
        //'    vec4 txt = blurred(mapping, vUv, b);',

        //'    vec4 texel = texture2D(mapXY, vUv);',
        //'    vec4 texelMin = texture2D(mapMin, vUv);',

        '    vec4 texelMin = blurred(mapMin, vUv, b);',
        '    vec4 texel = blurred(mapXY, vUv, b);',
        

/*         
        '    vec3 finNorm = vec3(0.0,0.0,0.0);',
        '    finNorm.xy = texel.xy - texelMin.xy;',
        '    finNorm.xy /= texel.z;',
        '    finNorm.z = texelMin.w;',
        '    finNorm.z -= 0.0731107;',
        '    float a = float(finNorm.z>0.2040110252);',
        '    finNorm *= a;',
        '    finNorm = normalize(finNorm);',
        '    a = float(finNorm.z>0.2110252);',
 */       

        '    vec3 finNorm;',
        '    finNorm.xy = texel.xy - texelMin.xy;',
        '    finNorm.xy /= texel.z;',
        '    finNorm.z = texelMin.w;',
        '    finNorm.z -= 0.0731107;',
        '    float a = float(finNorm.z>0.2040110252);',
        '    finNorm *= a;',

        '    finNorm = normalize(finNorm);',
        '    float delta = 0.1;',
        '    float dist = distance(texel.xy, vec2(-0.2110252 + texelMin.w, 0.2110252 - texelMin.w));',
        '    float aa = sm(0.2110252-delta, 0.2110252, dist);',
        '    a = 0.0;',
        '    if(finNorm.z>0.2) a = aa;',

        '    vec3 viewDirScreen = normalize( vec3( (vUv.x*2.0-1.0), (vUv.y*2.0-1.0)/r, -3.4) );',
        '    vec3 viewDirScreen2 = (vec3(vUv.x, vUv.y, -1.0));',

        '    vec3 reflectVec = reflect( viewDirScreen, finNorm );',
        '    vec3 refractVec = refract( viewDirScreen2, finNorm , refractionRatio );',




        //'    vec4 dif = vec4(finNorm, a);',
        '    vec4 dif = txt;',///vec4(txt.xyz, txt.a);',

        '    if( useLight == 1 ) {',
        '        float anim = amplitude * 1.0;',
        '        vec3 lightPos = vec3(0.0);',

        '        float phi = lightOrbit.x * Pi / 180.0;',
        '        float theta = lightOrbit.y * Pi / 180.0;',

        '        if(lightAnim.x==1.0)phi += anim;',
        '        if(lightAnim.y==1.0)theta += anim;',

        '        lightPos.x = (lightOrbit.z * sin(theta) * cos(phi));',
        '        lightPos.z = (lightOrbit.z * cos(theta) * cos(phi));',
        '        lightPos.y = (lightOrbit.z * sin(phi));',

        '        lightPos = normalize(lightPos);',

        '        float NdotL = clamp( dot(finNorm, lightPos ), 0.0, 1.0);',

        '        vec3 h = normalize(vec3(viewDirScreen.xy, -viewDirScreen.z)+lightPos);',
        '        float NdotH = clamp( dot(finNorm,h), 0.0, 1.0);',
        '        NdotH = pow(NdotH,11.0);',

        '        vec3 light = lightColor * NdotL*.5 + NdotH*.5;',
        '        dif.xyz += light*a;',
        '    }',

        '    if( rimPower > 0.0 ) {',
        '        float f = rimEdge * abs( dot( finNorm, -viewDirScreen ) );',
        '        f = rimPower * ( 1. - sm( 0.0, 1., f ) );',
        '        dif.xyz += rimColor*f*a;',
        '    }',

        '    gl_FragColor = dif;',
        '}'
    ].join('\n'),
    vertexShader: [
        'varying vec2 vUv;',
        'void main() {',
        '    vUv = uv;',
        '    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);',
        '}'
    ].join('\n'),
    transparent:true, depthTest:false, depthWrite:false
}