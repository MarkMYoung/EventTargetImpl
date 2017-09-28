// NOTICE: Typically methods are added to the class or to the 'prototype', but
//	this file adds them in a way which makes it like an instantiable interface.
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=//
/** EventTarget: Event target for custom events much like
 	the DOM Level 3 Events Specification.
	Leaving EventTarget.is_single_phase true allows the phases to go 
	through only the AT_TARGET (phase) for efficiency (and for practicality 
	since the objects using this are not in a DOM).
@author Mark M. Young
@version 1.0.0
created 2012-02-16
@see <a href="http://www.w3.org/TR/DOM-Level-3-Events/">DOM Level 3 Events Specification</a>
*/
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=//
// The name is 'EventTargetImpl' instead of just 'EventTarget' to prevent 
//	a name clash with built-in 'window.EventTarget'.
/*
var Foo = function( name )
{
	EventTargetImpl.call( this );
	this.name = name;
};
var foo = new Foo( 'foo' );
foo.addEventListener( 'bar', function( evt )
{
	alert( this.name );
});
foo.dispatchEvent( 'bar' );
foo.dispatchEvent({'type':'bar', 'detail':"...",});
// -OR-
var eventTarget = new EventTargetImpl();
eventTarget.addEventListener( 'bar', function( evt )
{
	alert( evt.type );
});
eventTarget.dispatchEvent( 'bar' );
eventTarget.dispatchEvent({'type':'bar', 'detail':"...",});
*/
var EventTargetImpl = (function( undefined )
{
/** Creates a new EventTarget
X REMOVED @param descendant The optional object to add EventTarget functionality.
*/
var EventTarget = function()
{
	EventTarget.is_single_phase = true;
	EventTarget.CAPTURING_PHASE = 1;
	EventTarget.AT_TARGET = 2;
	EventTarget.BUBBLING_PHASE = 3;
	var privateListeners = [{'there_is':'no phase 0'}, {}, {}, {}];
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=//
// NOTE: Normally, adding methods to the 'prototype' is more efficient, but 
//	EventTarget needs to be "inheritable" without without forcing 
//	"prototypical inheritance" (Foo.prototype = new EventTarget();).  A class 
//	"inheriting" EventTarget by calling 'EventTarget.call( this )' also means 
//	EventTarget cannot make use of "truly private" members.  As a consequence, 
//	'listeners' is publicly accessible.
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=//
	/** Adds a listener callback function.
	@param type A string specfying the name of the event.
	@param listener A callback function or an object with a 'handleEvent' function.
	@useCapture A Boolean indicating whether to use capturing or bubbling 
		methodology.  Since EventTarget is not attached to a DOM, a value of 'true' 
		adds the listener to the capturing phase, 'false' adds the listener to the 
		bubbling phase, and an unspecified value ('undefined') adds the listener to 
		the target phase.
	*/
	this.addEventListener = function( type, listener, useCapture )
	{
		if( EventTarget.is_single_phase === true ){useCapture = undefined;}
		if( typeof( type ) !== 'string' ){throw TypeError( "EventTarget.addEventListener 'type' must be a string." );}
		if((listener_type = typeof( listener )) !== 'function' && (listener_type !== 'object' || !('handleEvent' in listener)))
		{throw TypeError( "EventTarget.addEventListener 'listener' must be a function or be an object or class with a 'handleEvent' method." );}
		var phase = ((useCapture === true)?(EventTarget.CAPTURING_PHASE)
			:((useCapture === false)?(EventTarget.BUBBLING_PHASE)
			:(EventTarget.AT_TARGET)));
		if( typeof( privateListeners[ phase ][ type ]) === 'undefined' )
		{privateListeners[ phase ][ type ] = [];}
		privateListeners[ phase ][ type ].push( listener );
		return( this );
	};
	/** Notifies all listeners of 'evt'.
	@param evt An event object required to either be a string or an object with 
		a 'type' attribute.  Optionally, object can specify a Boolean 'bubbles' 
		and 'cancelable' attributes.
	@return Whether default action was prevented at some point.
	*/
	this.dispatchEvent = function( evt )
	{
		var phases = [EventTarget.CAPTURING_PHASE, EventTarget.AT_TARGET, EventTarget.BUBBLING_PHASE];
		if( EventTarget.is_single_phase === true ){phases = [EventTarget.AT_TARGET];}
		if( typeof( evt ) === 'string' ){evt = {'type':evt};}
		if( typeof( evt.type ) !== 'string' ){throw new TypeError( "Event.type must be a string." );}
		if( !('target' in evt)){evt.target = this;}
		evt.isTrusted = false;
		if( !('bubbles' in evt)){evt.bubbles = true;}
		if( !('cancelable' in evt)){evt.cancelable = true;}
		if( !('defaultPrevented' in evt)){evt.defaultPrevented = false;}
		if( !('timeStamp') in evt ){evt.timeStamp = (new Date()).getTime();}
		if( !('eventPhase' in evt)){evt.eventPhase = null;}
		if( !('currentTarget' in evt)){evt.currentTarget = null;}
		if( typeof( evt.preventDefault ) !== 'function' )
		{
			evt.preventDefault = function()
			{this.defaultPrevented = this.cancelable;};
		}
		var self = this;
		phases.forEach( function( phase )
		{
			evt.eventPhase = phase;
			if( phase !== EventTarget.BUBBLING_PHASE || evt.bubbles )
			{
				if( privateListeners[ phase ][ evt.type ] instanceof Array )
				{
					// Copy the array with 'slice' in case a callback modifies the listeners.
					privateListeners[ phase ][ evt.type ].slice( 0 ).forEach( function( listener )
					{
						if( !evt.defaultPrevented )
						{
							if( typeof( listener ) === 'function' )
							{listener.call( self, evt );}
							else if( typeof( listener ) === 'object' && 'handleEvent' in listener )
							{listener.handleEvent( evt );}
						}
					});
				}
			}
		});
		return( !evt.defaultPrevented );
	};
	/** Removes (only the first instance of) a listener.
	*/
	this.removeEventListener = function( type, listener, useCapture )
	{
		if( EventTarget.is_single_phase === true ){useCapture = undefined;}
		var found = false;
		var phase = ((useCapture === true)?(EventTarget.CAPTURING_PHASE)
			:((useCapture === false)?(EventTarget.BUBBLING_PHASE)
			:(EventTarget.AT_TARGET)));
		if( privateListeners[ phase ][ type ] instanceof Array )
		{
			privateListeners[ phase ][ type ].forEach( function( the_listener, i, the_listeners )
			{
				if( the_listener === listener )
				{
					the_listeners.splice( i, 1 );
					found = true;
				}
			});
		}
		return( found );
	};
};
EventTarget.prototype = Object.create( Object.prototype );
EventTarget.prototype.constructor = EventTarget;
return( EventTarget );
})();
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=//