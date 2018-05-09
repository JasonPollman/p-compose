/**
 * @param {Array} fnArray An array to determine "all function-ness".
 * @returns {boolean} True if a non-function was found in the array.
 */
const hasNonFunction = fnArray => fnArray.some(fn => typeof fn !== 'function');

/**
 * Used by `composePromise` and `Array.prototype.reduce` to create a "composed function chain".
 * @param {function} current The current function to invoke in the compose chain.
 * @param {function} next The next function to invoke in the compose chain.
 * @returns {function} A function that calls `current` with the given input
 * and then invokes next with `current`'s resolution value.
 */
const getReductionIterateeForComposePromise = Promise => (
  (current, next) => (...args) => Promise.resolve().then(() => current(...args)).then(next)
);

/**
 * Like fp.compose for Promise returning functions.
 * This will create a function that will invoke all of the given function arguments in a
 * chain from right to left. The *last* function is provided all initial input arguments and
 * the resolve value from each is passed into the next until all functions have been called.
 * That is the right most function can have unlimited arity, all others will be treated as unary.
 * @param {...function} fns The functions to compose. These can be either sync or Promise
 * returning functions. However, this method will *always* return a promise.
 * @returns {function} A function composed of the provided ones.
 */
const ComposePromiseFactory = Promise => (...fns) => {
  if (fns.length === 0) return () => Promise.resolve();
  if (hasNonFunction(fns)) throw new TypeError('Expected a function');

  // Note, Array.prototype.reverse mutates the original array, so fns[0]...
  const initial = (...args) => Promise.resolve().then(() => fns[0](...args));
  return fns.reverse().slice(1).reduce(getReductionIterateeForComposePromise(Promise), initial);
};

// Create a default export that uses native Promises and attach a function
// so that the user can provide any promise library they'd like (bluebird, for example).
module.exports = ComposePromiseFactory(Promise);
module.exports.using = ComposePromiseFactory;
