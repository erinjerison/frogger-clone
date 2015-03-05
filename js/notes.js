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
};
// log(foil); // NOT OK. It's trying to call a variable from within the newSaga function. Not possible.