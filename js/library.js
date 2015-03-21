/*
	Use this file to store reusable code to call throughout the frogger project.
*/

// create Car class to create locations for each car.
/*
	A class is a construct that is capable of building a fleet of similar objects that conform to the same interface.
	Classes should start with capital letters and should be nouns (as aversed to the adjective decorators)
	Functions that produce classes are called constructor functions, because they construct objects that qualify as members of a class.
	Objects that are returned from constructor function invocations are called instances. Therefore creating the object is known as instantiating.
*/
//var Car = function(loc) {
//	/*
//		Improving memory usage: Use the Object.create method to create Car properties
//		Also good for failed property lookups: Falls back on Car.methods for properties. It makes each Car look like it has a .move() method without moving them to extend(obj, Car.methods)
//		We refactored code to no longer use Car.methods, so it uses Car.prototype now.
//	 */
//    var obj = {loc: loc};
//    // To reduce memory usage, you can move out the move method to its own variable.
//    obj.move = function() {
//    	obj.loc++;
//    };
//    return obj;
//};

var Car = function(loc) {
	this.loc = loc;
};
// zed requires a move method, so we create it here, using the prototype, which can improve memory usage
Car.prototype.move = function() {
	this.loc++;
};

// Create subclass for Vans
var Van = function(loc){
	/*
		We want to call Car in the same context as Van. That's being stored as (this).
		The goal of the next line of code is to invoke Car in the way that its (this) is bound to the Van instance, so to get that to work, we need to use the keyword "this" inside Van.
		The line only passes along the binding from one function to another.
	*/
	Car.call(this, loc);
};

// However, we don't yet have a link between Van.prototype and Car.prototype!
//Van.prototype = Car.prototype; -- to get it to fail up correctly, this won't work, because no copying occurs.
Van.prototype = Object.create(Car.prototype); // Ta-da!
// That made .move available to Van, so what about making sure that .grab is available on Van but not Car?
// First, we need to make sure that things fail up correctly. Amy is a type of van, but that's as far as we want it to go, so set the constructor to the Van object.
Van.prototype.constructor = Van;
Van.prototype.grab = function() {
    /* */
};


//var Van = function(loc) {
//	var obj = Car(loc);
//	obj.grab = function() {/**/};
//	return obj;
//};
//
//var Cop = function(loc) {
//	var obj = Car(loc);
//	obj.call = function(){/**/};
//	return obj;
//};

/*
	Unfortunately, declaring variables twice can cause problems. The more complex the code gets, the more chance there is for something to go wrong. You can edit one list but forget the other and break your code.
	
	So can we iterate to add objects automatically based on them being in a list? Yes: Store the methods separately in their own object. So instead of this:
*/
//var on = function() {
//	// some code
//};
//var off = function() {
//	// some code
//};
// You can have this:
//Car.methods = {
//	move : function() {
//		this.loc++;
//	}
//};

/*
	We don't really need to create a separate "methods" object, though, because JS offers .prototype that already stores methods.
	We don't even need to specify move in the standard way. Just do this: Attach it to .prototype...
*/
Car.prototype.move = function() {
	this.loc++;
};