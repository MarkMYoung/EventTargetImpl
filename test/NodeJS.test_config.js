var QUnit = require( 'qunit' );

QUnit.run(
{
	'code':
	{
		// What global var should it introduce for your tests?
		'namespace':'EventTargetImpl',
		// Include the source code.
		'path':'./src/EventTargetImpljs',
	},
	'tests':
	[
		'EventTargetImpl.test.js'
	]
	.map( function prepend_path_mapper( test, t )
	{return( './test/'.concat( test ));}),
});