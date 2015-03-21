/*
Scopes and closures
--------------------
Lexical scope: "Lexical" describes the regions in the source code, where you refer to a variable by name without
getting access errors.

Global scope: Variables are accessible to all code in the file. Some JS environments share global scope across
multiple files as a way for any part of the program to interact with any other part. If you add a variable to the
global scope, it can be accessed anywhere in the program.

After defining a variable in the lexical scope, you can reference it from anywhere in the same lexical scope.
Global variables are easiest: Access them from anywhere in the code.

A new lexical scope is created every time you define a function. Different access rules apply in the functional
code.
*/

var hero = aHero(); // function that returns a randomly generated name
var newSaga = function() {
	/*
	Code in this area is more limited. Variables inside this function can access global variables, and variables
	within this function can also access the other variables inside the function, other parts of the program at a
	broader scope (global) cannot access the variables defined in the function.
	 */
	var foil = aFoil();
	/*
	Knowing this, what variables can you access from within this function?
		- foil
		- newSaga
		- hero
	 */
	/*
	However, you can assign to variables that you haven't yet defined. In other words, you don't NEED to specify
	the "var" before foil. But when you do that for the first time, it defines the variable globally - just bad
	practice.
	
	In addition, other types of brackets do not define a new scope. Only the curly braces tighten the scope.
	 */
	var saga = function() {
		var deed = aDeed();
		log(hero+deed+foil);
	};
	saga();
	saga();
};
// log(foil); // NOT OK. It's trying to call a variable from within the newSaga function. Not possible.

/*
In order for a function to work, we need to call it somehow. So let's make it run two different sagas at once:
*/
newSaga();
newSaga();

/*
When a program runs, it creates structures to store variables and values; these are called "execution contexts."

Execution contexts (aka in-memory scopes) are different from lexical scopes, because they're built as the code
runs, not as it's typed. Those rules govern what variables can be accessed while the program runs. So what is
available at different times in each context, given the sample code above?

As the program runs, internal data stores are created to store variables that are available to various functions.
Since each new run of a function operates in isolation, a new execution context is created each time it runs,
so there may be many in-memory scopes created when the program runs (or none); it depends on how many times you
run the function.

So...
-----------------------------------------------------------------------------------------
|																						|
|				GLOBAL SCOPE:															|
|	Storage system created when the program starts.										|
|																						|
|			<< hero="Gal" >>															|
|	newSaga doesn't display yet, because the function hasn't been called.				|
|																						|
|			<< newSaga = "(empty value)"												|
|	We're still in the global scope at this point.										|
|																						|
|	So then newSaga is invoked after this, creating a new execution context.			|
|																						|
|			<< newSaga(); >>															|
|		-------------------------------------------------------------------------		|
|		|	<< foil >>															|		|
|		|	<< saga	= "emptyValue" (until it's called) >>						|		|
|		|	<< saga(); >>														|		|
|		|																		|		|
|		|	------------------------------------------------------------		|		|
|		|	|			<< deed	>>										|		|		|
|		|	|			<< add to log >>								|		|		|
|		|	|															|		|		|
|		|	|															|		|		|
|		|	-------------------------------------------------------------		|		|
|		|	<< saga(); >>														|		|
|		|																		|		|
|		|	------------------------------------------------------------		|		|
|		|	|			<< deed	>>										|		|		|
|		|	|			<< add to log >>								|		|		|
|		|	|															|		|		|
|		|	|															|		|		|
|		|	-------------------------------------------------------------		|		|
|		-------------------------------------------------------------------------		|
|																						|
|			<< newSaga(); >>															|
|		-------------------------------------------------------------------------		|
|		|	<< foil >>															|		|
|		|	<< saga	= "emptyValue" (until it's called) >>						|		|
|		|	<< saga(); >>														|		|
|		|																		|		|
|		|	------------------------------------------------------------		|		|
|		|	|			<< deed	>>										|		|		|
|		|	|			<< add to log >>								|		|		|
|		|	|															|		|		|
|		|	|															|		|		|
|		|	-------------------------------------------------------------		|		|
|		|	<< saga(); >>														|		|
|		|																		|		|
|		|	------------------------------------------------------------		|		|
|		|	|			<< deed	>>										|		|		|
|		|	|			<< add to log >>								|		|		|
|		|	|															|		|		|
|		|	|															|		|		|
|		|	-------------------------------------------------------------		|		|
|		-------------------------------------------------------------------------		|
-----------------------------------------------------------------------------------------
*/

/*
Closures: Every function should have access to all of the variables from all of the scopes that surround it.
Any function that remains available AFTER scopes are returned.

Keeping this in mind, how do we retain access to function objects AFTER they are called in the newSaga function
that created them?
[x] Pass "saga" to "setTimeout"
[x] Return "saga" from "newSaga"
[x] Save "saga" to global var

Knowing this, let's create an array that stores the sagas that are created in the newSaga function 
*/
var sagas = [];
/*
In the future, so that we can access these functions, we push them into a global array. Then, we can choose to
access the functions even outside the scope they were defined in. You can use them AFTER the function that
created them completes.
*/
var newSaga = function() {
	var foil = aFoil();
	sagas.push(function() { // this pushes the result of the function into the sagas array to store it for later use
		var deed = aDeed();
		log(hero+deed+foil);
	});
};
newSaga();
sagas[0]();
sagas[0]();
newSaga();
/*
Knowing this, what is returned to the sagas array? A function object.

When we invoke the sagas[0] function, where should the box should appear in the diagram?
[ ] Inside the green box but outside the red
[x] Inside the red box
[ ] Outside both boxes
*/

/*
Parameters are words we see between the parentheses in a function definition. The (this) parameter is similar to
a normal parameter, with a couple of exceptions:
	- You don't get to pick the name.
	- You bind values to (this) differently than other parameters.

Keyword (this): Identifier that gets a value bound to it, and it's a value that is bound to the correct object
automatically. The interpreter determines what the correct rules are to bind it similarly to positional function
parameters. The differences between typical positional function parameters and (this) are designed to help you
intuitively know which objects are focal when invoking a method or constructor.

You generally see (this) inside of a function:
CASE 1:
var fn = function(a,b) {
	log(this);
}

STORE IT IN A METHOD PROPERTY:
var ob2 = {method: fn);
	- Define "method" as a method that stores a reference to fn
	- An object that happens to have that function as a property (as in ob2)

ADD (THIS) AS PART OF A FUNCTION IN AN OBJECT (OBJECT LITERAL):
var obj = {
	fn : function(a,b) {
		log(this);
	};
};

WE EVENTUALLY CALL A FUNCTION:
obj.fn(3,4);

If you notice (this) in a function, what is it bound to?

(this) cannot be bound to:
	- The function object that (this) appears within.
	- The instance of the function that (this) appears within. (*generally)
	- An object that happens to have that function as a property.
	- An object created by the literal that (this) appears within.
	- An "execution context" or "scope" of a function call (i.e., (3,4) in the function call).

SO WHAT DOES IT REFER TO?
Calling a function uses the . to the left of the function invocation (meaning it was looked up as the property of
an object), you look further to the left and see what object it was called upon (in this case, obj). The object
that a function is looked up upon when being invoked is what (this) is bound to.

Consider the following function:
*/
var fn = function(one,two) {
	log(one,two);
};
/*
(this) is not referenced yet. In this case, what is bound to the second positional parameter?
Answer: Nothing! Not for this example! There is no binding until the function is called.

So let's add some values to pass in.
*/
var r = {};
var g = {};
var b = {};
// and then call the function:
fn(g,b);
/*
Input parameters to a function only have bindings when that function is actually running. So given this example,
what will be logged?

Answer: {},{}

We wouldn't expect those bindings to remain true across every invocation of the function. So what happens when
we refer to (this) inside the function body? If we pass (this) as an additional input parameter at the
beginning of the logging function call, what should be logged and bound to (this) while the function runs?

Answer: Okay, we'll come back to that later, because it's tricky.

So let's explore the more common usage of (this) as a parameter of a method invocation. To call this function as
a method, we have to add that function as a property of an object.
*/
r.method = fn;
/*
Now when I call the function, I can do it immediately after a . access on that object.
*/
r.method(g,b);
fn(g,b);
/*
We already know what the positional parameters are for one and two. What about the (this) identifier in the
following definition:
*/
var fn = function(one,two) {
	log(this,one,two);
};
r.method = fn;
r.method(g,b);
/*
What does (this) refer to?
[x] r
[ ] g					// can't be this; doesn't make sense.
[ ] b					// can't be this; doesn't make sense
[ ] global				//
[ ] undefined			//
[ ] fn					// can't be this; doesn't make sense
[ ] the current scope	//

In addition to the 2 parameters being passed between the parentheses (and those parameters being bound to one
and two), we pass in a third parameter *by calling that function on the right side of a . access property lookup.*
So the value that appears on the left of the . is automatically assigned (this) inside of the function invocation.
This is helpful for OOP, since the relevant focal object is usually to the left of the given method call. That is
why "r" is the correct answer.

The same rules apply when using bracket notation.

Okay, so if there is no ., how do we determine what the parameter of (this) is bound to in the function? What
will be logged?
[ ] r
[ ] g
[ ] b
[x] global
[ ] undefined
[ ] fn
[ ] the current scope

For reference, the function for the previous question:
var fn = function(one,two) {
	log(this,one,two);
};
r.method = fn;
r.method(g,b);
fn(g,b);

Reason for this answer: When you don't have a . to pass in a specific binding for (this), JS binds it by default
to the global object. It's similar to the fact that JS binds <undefined> to positional parameters when we call a
function without enough inputs. So if we passed no inputs for (one,two), they would be <undefined>. Therefore,
we can conclude that the default object, <global>, is bound to this whenever we don't use a dot. The . is the
method by which we pass in a binding for (this). So without a dot, some default value is bound to (this).

What if you wanted to call a function, but it isn't stored as a property of the object that you want (this) to be
bound to? Because the function isn't bound to a specific property of an object, there's no way to address as
object.anything. If the function is not stored as a property, there is no key to use on that object to access
the function.

So imagine we still have
fn(g,b);
...which assigns <global> to (this).

You can modify it to specify exactly what you want (this) to bind to. By using a function's .call() method, you
override the default binding to <global> and override the "left of the dot" rule.
fn.call( ,g,b);
You can pass in any value you want for the first value, and it'll be bound to (this). When using .call(), you pass
in one extra value to the beginning of the argument list:
fn.call(r,g,b);

So assume we have the following line of code. What gets logged for (this)? In this case, .call() is being used on
a function that is also being accessed as a property. We pass in "y," but the .method method is already defined as
a property of the "r" object. So what's logged?
*/
var r = {}, g = {}, b = {}, y = {};
r.method.call(y,g,b);
/*
Answer: y.

Why? Using the .call() method OVERRIDES the original assignment of "r" for (this) and substitutes "y."

So how does (this) get bound in functions when the function is passed in a callback? Example:
*/
setTimeout(fn,1000);
/*
In this case, we aren't providing *any* values that could be passed as arguments to fn. Let's focus on the
positional parameters first: ([],one,two)

Remember: You can't tell what (this) will be bound to until you look at the specific invocation of that function.
Look for the invocation of the function.

Trick question: Looking at this code alone, you cannot determine how a callback is called, since we can't see the
function invocation in setTimeout. We actually need to look at the source code or the documentation for setTimeout.

setTimeout: Imagine it's defined in a file called timers.js. What would appear in that file? There would be a
function definition, where setTimeout is defined and made to point at a function. That function has to take two
arguments - callBack,ms. What goes in the body of the function?
*/
var setTimeout = function(callback,ms) {
	// First, the system delays the execution by a number of milliseconds.
	waitSomehow(ms);
	/* Then, it has to refer to your function and somehow invoke it:*/
	callback();
};

/*
What values is setTimeout likely to pass along to the callback(); function? Since setTimeout does not know what
values you want to pass to your function, it may invoke it with no parameters at all (as written above). What
would be displayed in the final position of the log output? Answer: <undefined>, because if values aren't passed
when invoking the function, the parameters can only return <undefined>.

So given this, what would the (this) parameter return? Answer: <undefined>, because no value is passed to
callback(); when invoking setTimeout, and it therefore can't log anything for the first value in fn.

Knowing this, what line of code would you look at to to determine the binding parameter for (this)?
*/
var fn = function(one,two) {
	log(this,one,two);
};
var r = {}, g = {}, b = {}, y = {};
r.method = fn;			// [ ]
r.method(g,b);			// [ ]
fn(g,b);				// [ ]
fn.call(r,g,b);			// [ ]
r.method.call(y,g,b);	// [ ]
setTimeout(fn,1000);
// -- new file, timeout.js
var setTimeout = function(callback,ms) {
	waitSomehow(ms);	// [ ]
	callback();			// [x]
}
/*
callback(); is the correct response because we needed to see how setTimeout is invoked. Looking there, we see that
there is no ., so the rule about the default case applies. Let's predict what is logged as the binding parameter
for (this). What gets logged?
[ ] r
[ ] g
[ ] b
[ ] y
[x] global			// as it's the default binding parameter.
[ ] undefined
[ ] fn
[ ] current scope

No value is supplied for the callback(); function, so no parameter is supplied to (this), especially because the
.call() method isn't being used. Suppose default in that case.

Given how setTimeout works when passed a function reference, what would you expect when you pass in a method that
was first looked up as the property of an object? Notice that we're using dot notation to find the method at the
time we look for it to pass it into setTimeout. Consider how we expect the positional parameters to work. Just like
before, they are bound to <undefined>, because values aren't passed when invoking the function.
*/
setTimeout(r.method,1000);
/*
The setTimeout function wasn't passed any other variables that might have been passed to callback();, so the body
of setTimeout has no way of knowing what values you want passed in. So what is bound to (this)? Remember where
to look when determining the binding for the parameter. It's not in the function definition (for fn), and it's not
where the function is looked up (r.method) on the object. The important location is where the function is actually
invoked (callback();). Just because we did a property lookup on the "r" object doesn't mean it has any bearing on
(this) inside the function. It's irrelevant, because only at the time it's being called influences how (this) is
bound. As in the previous example, where we passed in (fn) instead of (r.method), the last line of setTimeout is
still a free function invocation and not a METHOD invocation with a dot. Therefore, (this) is bound to the default,
<global>.
*/

/*
Any function (like setTimeout) that takes another function as a callback (r.method) may call the function
differently than you expected. Callback functions are designed to be invoked by the system you pass them to. So
you have little control over what the bindings will be for the parameters of the functions that you passed in. Be
careful about all your parameter bindings, including (this), when you pass a function as an input to another
function. Just because you see an object on the left of the dot when passing the function in doesn't mean that
object is passed along as the binding for (this) when the system eventually calls callback();.

To pass the callback without complicating parameter bindings is to pass a different function that doesn't receive
any parameters at all, including (this):
*/
setTimeout(function(){
	// add your custom code here. Reference your method and invoke it yourself, passing whatever bindings you want
	// for (this).
	r.method()
},1000);
// So what happens if we see (this) in the global scope, not in the body of the function?
var fn = function(one,two) {
	log(this,one,two);
};
var r={}, g={}, b={}, y={};
r.method = fn;
// add a function here
log(one);
/*
	Because "one" is only defined in the function named "fn," we shouldn't be able to refer to it in the global scope.
	So it throws an error.
*/

/*
	So is (this) inaccessible from the global scope? Yes, because of how it's set up historically.
	When you call (this), the default binding is returned (<global>).
	
	So what happens when you call a function using the "new" keyword? How does it affect the binding to (this)?
	Positional parameters are unaffected by "new." They're passed in the same way they always are.
	What is logged? A brand new object. So a new object is generated every time you call the function using "new."

	(this) allows us to build one function object and use that as a method for other objects.
	Every time we call the method, it has access to whatever object it's being called on.
	This saves memory -- obviously pretty good.
*/

/*
----------------------------------------------
PROTOTYPE CHAINS
----------------------------------------------
*/
/*
	Prototype chains are a mechanism for making objects that resemble other projects.
	When you want 2 objects to use the same properties to reduce memory usage or avoid code duplication,
	you might consider copying every property from one object to another. A better method in JavaScript is to use
	prototype chains. One object behaves as though it has the properties of another objects by delegating failed
	lookups from the first object to the second one.
	
	First, let's set up objects that are similar.
*/
var gold = {a:1};
log(gold.a); // property lookup on "gold"
/*
	When doing a property lookup, the interpreter determines whether the "gold" object has the "a" property.
	The interpreter finds it. Key: "a", value: "1". What is logged is "1."
	What happens if we do this?
*/
log(gold.z);
/*
	The interpreter looks for "z." It doesn't find it, so it returns "undefined."
	
	Let's figure out how to create an object that is similar to "gold." Do we create a new object and give it
	the same keys and values? There are helper functions that can help you copy properties from one object
	to another.
*/
var blue={};
// using the helper function
var blue= extend({}, gold);
/*
	The properties are only copied once: When the program encounters it when it runs. So if the program
	modifies "gold" or "blue," we expect them to have the "a" property in common, and that's it.
	
	So let's add a new property to "blue."
*/
blue.b = 2;
log(blue.a); // returns 1 
log(blue.b); // returns 2
log(blue.z); // returns undefined
/*
	Let's create another object similar to "gold," but avoid copying individual properties by somehow linking
	"rose" to "gold." This way, if a requested property isn't found in "rose," "gold" is a secondary lookup
	location.
	
	Object.create() can create objects for you that use the secondary lookup feature. Pass in your fallback
	object, and the failed lookups look in the fallback.
*/
var rose = Object.create(gold);
rose.b = 2; // creates {b:2}
log(rose.a); // looks in "rose," can't find it, so it goes up to "gold." logs "1"
/*
	The similarity is achieved when looking up properties, not as a result of the copying process.
	For properties that can be found directly in "rose," the prototype chain isn't even used.
*/
log(rose.b); // logs "2," because it's not a failed lookup.
log(rose.z); // logs "undefined," because "z" isn't defined anywhere.
/*
	So what are the differences between extend() and Object.create()?
	What moment do you expect the value present in "gold" to influence either object? Is it a single
	moment of copying, or does it happen every time a lookup occurs?
*/
gold.z = 3; // add a "z" value to "gold"
log(blue.z); // What happens?

/* 
	Undefined! Because "blue" was only called once above, and that's the only time
	that values were copied. So "z" doesn't get copied because you created gold.z AFTER blue was created.
	
	So what happens if...
*/
log(rose.z); // it logs "3," because it goes and looks back at "gold" after not finding it in "rose"

/*
	So let's compare gold and rose.
	Does "gold" delegate its own build lookup? Yes. One global object exists that all JS objects eventually
	delegate to. It's where all basic methods are provided for all objects. This is known as the "object
	prototype" because it provides the shared properties of all objects in the entire system. So when you ask
	for an object's .toString(), you access a function that does the work. When the function is accessed,
	you can call it, and the object that you did the property lookup on appears to the left of that function's
	call time. Thanks to how (this) works, the shared function works as expected with (this) bound to the
	rose object, even though the .toString() method is stored on the object prototype.
*/
rose.toString();

/*
	The global object contains several useful helper methods. Let's look at .constructor().
	
	.constructor() makes it easy to tell what function is used to create a certain object.
	People confuse the global object with .constructor() used to make all objects.
	
	Look at it this way. When you use .constructor on an object, the object probably doesn't have a constructor
	property, so the prototype chain is consulted up to the global object.
	
	If you don't take any special steps, most new objects delegate to the object prototype, but some of the
	special objects that you create in JS have features above and beyond the characteristics of all objects.
	Arrays have .indexOf and .slice. Method arrays are stored in another type called the array prototype.
	The array prototype delegates to the object prototype so that non-unique parts of an array are inherited
	from the object prototype.
	
	Both array and object prototypes have .constructor methods. What happens when you query an array for its
	.constructor() property?
	"Array," because array prototypes contain the .constructor property, so it doesn't need to delegate further
	up the chain.
*/

/*
---------------------------
CODE REUSE
---------------------------

	Practice of writing generalized code that is relied upon to address various, similar goals.
	If you notice code that has similarities, you can factor out similar aspects of it into reusable library code.
	This way, you don't need to repeat code in either place.
	
	Look in run.js for some of this code.
*/