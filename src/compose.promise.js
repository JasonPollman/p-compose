/**
 * Exports a library that composes promise returning functions.
 * @since 5/8/18
 * @file
 */

const promiseReducer = (current, next) => current.then(next);
const hasNonFunction = fnArray => fnArray.some(fn => typeof fn !== 'function');

/**
 * Like fp.compose for Promise returning functions.
 * The right most function can have unlimited arity, all others will be treated as unary.
 * @param {...function} fns The functions to compose. These can be either sync or Promise
 * returning functions. However, the returned function will always return a Promise.
 * @returns {function} A function composed using the ones provided.
 */
const ComposePromiseFactory = Promise => (...fns) => {
  if (fns.length === 0) return () => Promise.resolve();
  if (hasNonFunction(fns)) throw new TypeError('Expected a function');

  fns.reverse();

  const head = fns[0];
  const rest = fns.slice(1);

  return (...args) => rest.reduce(promiseReducer, Promise.resolve().then(() => head(...args)));
};

module.exports = ComposePromiseFactory(Promise);
module.exports.using = ComposePromiseFactory;
