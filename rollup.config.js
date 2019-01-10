export default {
	input: 'src/Oimo.js',
	indent: '\t',
	output: [
		{
			format: 'umd',
			name: 'OIMO',
			file: 'build/oimo.js'
		},
		{
			format: 'es',
			file: 'build/oimo.module.js'
		}
	]
};
