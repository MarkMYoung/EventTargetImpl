EventTargetImpl
===============
In short, all browsers provide an EventTarget implementation attached to DOM nodes, XmlHTTPRequests, etc.; however, one cannot simply perform `new EventTarget();` (it throws TypeError).  If one manages to get around that hurdle, perhaps by putting an DOM (input) element inside his class, he still cannot simply call `eventTarget.dispatchEvent( 'eventName' );` (throws InvalidStateError).  So, this is an implementation which should help with these limitations.

One can use this by containment,
```javascript
function YourEventfulClass()
{
  var eventTarget = new EventTarget();
}
YourEventfulClass.prototype = new Object();
YourEventfulClass.prototype.constructor = YourEventfulClass;
```
by interface extension,
```javascript
function YourEventingClass()
{
  EventTarget.call( this );
}
YourEventingClass.prototype = new Object();
YourEventingClass.prototype.constructor = YourEventingClass;
```
or by prototypical inheritance.
```javascript
function YourEventsomeClass()
{}
YourEventsomeClass.prototype = new EventTargetImpl();
YourEventsomeClass.prototype.constructor = YourEventsomeClass;
```
