/**
 * @author loth / http://3dflashlo.wordpress.com/
 * Simple deep y shader
 */
var deepShader={
    attributes:{},
    uniforms:{ 
    	deep: {type: 'f', value: 0.03904}
    },
    fs:[
        'precision lowp float;',
        'varying vec4 vc;',
        'void main(void) { gl_FragColor = vc; }'
    ].join("\n"),
    vs:[
        'uniform float deep;',
        'varying float dy;',
        'varying vec4 vc;',
        'void main(void) {',
            'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
            'dy = position.y*deep;',
            'vc = vec4(dy,dy,dy, 1.0);',
        '}'
    ].join("\n")
};