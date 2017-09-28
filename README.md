EventTargetImpl
===============
In short, all browsers provide an EventTarget implementation attached to DOM nodes, XmlHTTPRequests, etc.; however, one cannot simply perform `new EventTarget();` (it throws TypeError).  If one manages to get around that hurdle, perhaps by putting an DOM (input) element inside his class, he still cannot simply call `eventTarget.dispatchEvent( 'eventName' );` (throws InvalidStateError).  So, this is an implementation which should help with these limitations.

One can use this by containment,
```javascript
function YourEventContainingClass()
{
  var eventTarget = new EventTarget();
}
YourEventContainingClass.prototype = Object.create( Object );
YourEventContainingClass.prototype.constructor = YourEventContainingClass;
```
by interface extension,
```javascript
function YourEventExtendedClass()
{
  EventTarget.call( this );
}
YourEventExtendedClass.prototype = Object.create( Object );
YourEventExtendedClass.prototype.constructor = YourEventExtendedClass;
```
or by prototypical inheritance.
```javascript
function YourEventInheritingClass()
{}
YourEventInheritingClass.prototype = Object.create( EventTargetImpl );
YourEventInheritingClass.prototype.constructor = YourEventInheritingClass;
```

[//]: # ( ### TravisCI )
[//]: # ( [![Build Status](https://travis-ci.com/MarkMYoung/EventTargetImpl.svg?branch=master)](https://travis-ci.com/MarkMYoung/EventTargetImpl) )
