//jQuery(document).ready( function()
//{
	QUnit.module( "EventTargetImpl" );
	QUnit.test( "Constructor(s)", function( qUnit )
	{
		QUnit.expect( 3 );
		var AClass = function( name )
		{
			EventTargetImpl.call( this );
			this.name = name;
		};
		var anObject = new AClass( 'test' );
		QUnit.strictEqual( typeof( anObject.addEventListener ), 'function',
			".addEventListener should be a function." );
		QUnit.strictEqual( typeof( anObject.dispatchEvent ), 'function',
			".dispatchEvent should be a function." );
		QUnit.strictEqual( typeof( anObject.removeEventListener ), 'function',
			".removeEventListener should be a function." );
	});
	QUnit.test( "Object member(s)", function( qUnit )
	{
		QUnit.expect( 1 );
		var AClass = function( name )
		{
			EventTargetImpl.call( this );
			this.name = name;
		};
		var anObject = new AClass( 'test' );
		QUnit.throws
		(
			function()
			{
				anObject.dispatchEvent({type:true});
			},
			function( exc )
			{
				return( exc instanceof TypeError );
			},
			"Dispatching an event that is not either a string or an object with a .type attribute throws a TypeError exception."
		);
	});
	QUnit.test( "Static member(s)", function( qUnit )
	{
		QUnit.expect( 3 );
		QUnit.strictEqual( EventTargetImpl.CAPTURING_PHASE, 1,
			"EventTargetImpl.CAPTURING_PHASE has value 1." );
		QUnit.strictEqual( EventTargetImpl.AT_TARGET, 2,
			"EventTargetImpl.AT_TARGET has value 2." );
		QUnit.strictEqual( EventTargetImpl.BUBBLING_PHASE, 3,
			"EventTargetImpl.BUBBLING_PHASE has value 3." );
	});
	QUnit.test( "Special requirements", function( qUnit )
	{
		QUnit.expect( 4 );
		var AClass = function( name )
		{
			EventTargetImpl.call( this );
			this.name = name;
		};
		var EventHandlerBaseObject = function()
		{
			this.handleEvent = function( evt )
			{
				QUnit.strictEqual( evt.target, eventTarget,
					"Event .target attribute must be retained." );
				QUnit.strictEqual( evt.type, 'action',
					"Event .type attribute must be retained." );
			};
		};
		var EventHandlerDerivedObject = function()
		{
			this.handleEvent = function( evt )
			{
				QUnit.strictEqual( evt.target, anObject,
					"Event .target attribute must be retained." );
				QUnit.strictEqual( evt.type, 'action',
					"Event .type attribute must be retained." );
			};
		};
		var anObject = new AClass( 'test' );
		var eventTarget = new EventTargetImpl();
		var eventHandlerBaseObject = new EventHandlerBaseObject();
		var eventHandlerDerivedObject = new EventHandlerDerivedObject();
		eventTarget.addEventListener( 'action', EventHandlerBaseObject );
		eventTarget.addEventListener( 'action', eventHandlerBaseObject );
		anObject.addEventListener( 'action', EventHandlerDerivedObject );
		anObject.addEventListener( 'action', eventHandlerDerivedObject );
		eventTarget.dispatchEvent( 'action' );
		anObject.dispatchEvent( 'action' );
	});
//});