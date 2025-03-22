/**
 * Definition of multiply function with displayFunction parameter
 * This is an example of using a callback pattern in TypeScript
 */
function multiply(
	a: number,
	b: number,
	displayFunction: (result: number) => void, // This is a callback function parameter
): void {
	const result = a * b;
	displayFunction(result); // Calling the function passed as an argument (invoking the callback)
}

/**
 * Definition of display function
 * This function will be used as a callback
 */
function display(value: number): void {
	console.log(`The result is: ${value}`);
}

/**
 * What is a callback?
 *
 * A callback is a function that is passed as an argument to another function and is
 * executed after the outer function has completed or at a certain point within that function.
 *
 * In this example:
 * - 'display' is the callback function
 * - 'multiply' is the higher-order function that accepts the callback
 * - When 'multiply' finishes its calculation, it "calls back" to the 'display' function
 *
 * Callbacks are commonly used for:
 * - Asynchronous operations (like handling API responses)
 * - Event handlers
 * - Customizing behavior of higher-order functions
 */

/**
 * Calling the multiply function with display function as the third argument
 */
multiply(5, 3, display);

/**
 * We can also use an anonymous function as a callback
 */
multiply(10, 2, function (value) {
	console.log(`10 multiplied by 2 equals: ${value}`);
});

/**
 * Or using an arrow function as a callback (more modern approach)
 */
multiply(4, 7, (value) => {
	console.log(`4 multiplied by 7 equals: ${value}`);
});
