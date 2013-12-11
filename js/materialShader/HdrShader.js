/**
 * @author GSVpano
 *
 * hdr shader
 */

THREE.HdrShader = {

	uniforms: {
		"tDiffuse":  { type: "t", value: null },
		"exposure":  { type: "f", value: 1.5 },
		"brightMax": { type: "f", value: 0.5 }
	},

	vertexShader: [

	    "varying vec2 vUv;",

		"void main() {",

			"vUv  = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [

	    "uniform sampler2D   tDiffuse;",
		"uniform float       exposure;",
		"uniform float       brightMax;",

		"varying vec2  vUv;",

	    "vec3 decode_pnghdr( const in vec4 color ) {",
	        "// remove gamma correction",
	        "vec4 res = color * color;",

			"// decoded RI",
			"float ri = pow( 2.0, res.w * 32.0 - 16.0 );",

			"// decoded HDR pixel",
			"res.xyz = res.xyz * ri;",
			"return res.xyz;",
		"}",


		"void main() {",

			"vec4 color = texture2D( tDiffuse, vUv );",
			"color.xyz  = decode_pnghdr( color );",

			"// apply gamma correction and exposure",
			"//gl_FragColor = vec4( pow( exposure * color.xyz, vec3( 0.474 ) ), 1.0 );",

			"// Perform tone-mapping",
			"float Y = dot(vec4(0.30, 0.59, 0.11, 0.0), color);",
			"float YD = exposure * (exposure/brightMax + 1.0) / (exposure + 1.0);",
			"color *= YD;",

			"gl_FragColor = vec4( color.xyz, 1.0 );",

		"}"

	].join("\n")

};
