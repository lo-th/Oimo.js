/**
 * @author Jaume Sanchez / @thespite
 *
 * Noise Background shader
 */

THREE.SpShader = {

	uniforms: {

		"resolution":{ type:'v2',value:new THREE.Vector2(0,0)},
		"noise":{ type:'f',value:.04}

	},

	vertexShader: [

		"void main() {",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
		"}"

	].join("\n"),

	fragmentShader: [

		"uniform vec2 resolution;",
		"uniform float noise;",

		"#define VIG_REDUCTION_POWER 5.5",
		"#define VIG_BOOST 4.1",

		"float random(vec3 scale,float seed){",
		    "return fract(sin(dot(gl_FragCoord.xyz+seed,scale))*43758.5453+seed);",
		"}",

		"void main() {",

			"vec3 color = vec3( 34. / 255. );",
			"vec2 center = resolution * 0.5;",
			"float vignette = distance( center, gl_FragCoord.xy ) / resolution.x;",
			"vignette = VIG_BOOST - vignette * VIG_REDUCTION_POWER;",

			"float n = noise * ( .5 - random( vec3( 1. ), length( gl_FragCoord ) ) );",

			"gl_FragColor = vec4( color * vec3( vignette ) + vec3( n ), 1. );",

		"}"

	].join("\n")

};
