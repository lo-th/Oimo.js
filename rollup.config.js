export default {
	entry: 'src/Oimo.js',
	indent: '\t',
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
