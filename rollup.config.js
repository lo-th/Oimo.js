export default {
	entry: 'src/Oimo.js',
	indent: '\t',
	// sourceMap: true,
	targets: [
		{
			format: 'umd',
			moduleName: 'OIMO',
			dest: 'build/oimo.js'
		},
		{
			format: 'es',
			dest: 'build/oimo.module.js'
		}
	]
};
