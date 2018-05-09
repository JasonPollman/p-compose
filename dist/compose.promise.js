'use strict'; /**
               * Exports a library that composes promise returning functions.
               * @since 5/8/18
               * @file
               */

var promiseReducer = function promiseReducer(current, next) {return current.then(next);};
var hasNonFunction = function hasNonFunction(fnArray) {return fnArray.some(function (fn) {return typeof fn !== 'function';});};

/**
                                                                                                                                 * Like fp.compose for Promise returning functions.
                                                                                                                                 * The right most function can have unlimited arity, all others will be treated as unary.
                                                                                                                                 * @param {...function} fns The functions to compose. These can be either sync or Promise
                                                                                                                                 * returning functions. However, the returned function will always return a Promise.
                                                                                                                                 * @returns {function} A function composed using the ones provided.
                                                                                                                                 */
var ComposePromiseFactory = function ComposePromiseFactory(Promise) {return function () {for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {fns[_key] = arguments[_key];}
    if (fns.length === 0) return function () {return Promise.resolve();};
    if (hasNonFunction(fns)) throw new TypeError('Expected a function');

    fns.reverse();

    var head = fns[0];
    var rest = fns.slice(1);

    return function () {for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {args[_key2] = arguments[_key2];}return rest.reduce(promiseReducer, Promise.resolve().then(function () {return head.apply(undefined, args);}));};
  };};

module.exports = ComposePromiseFactory(Promise);
module.exports.using = ComposePromiseFactory;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21wb3NlLnByb21pc2UuanMiXSwibmFtZXMiOlsicHJvbWlzZVJlZHVjZXIiLCJjdXJyZW50IiwibmV4dCIsInRoZW4iLCJoYXNOb25GdW5jdGlvbiIsImZuQXJyYXkiLCJzb21lIiwiZm4iLCJDb21wb3NlUHJvbWlzZUZhY3RvcnkiLCJmbnMiLCJsZW5ndGgiLCJQcm9taXNlIiwicmVzb2x2ZSIsIlR5cGVFcnJvciIsInJldmVyc2UiLCJoZWFkIiwicmVzdCIsInNsaWNlIiwiYXJncyIsInJlZHVjZSIsIm1vZHVsZSIsImV4cG9ydHMiLCJ1c2luZyJdLCJtYXBwaW5ncyI6ImNBQUE7Ozs7OztBQU1BLElBQU1BLGlCQUFpQixTQUFqQkEsY0FBaUIsQ0FBQ0MsT0FBRCxFQUFVQyxJQUFWLFVBQW1CRCxRQUFRRSxJQUFSLENBQWFELElBQWIsQ0FBbkIsRUFBdkI7QUFDQSxJQUFNRSxpQkFBaUIsU0FBakJBLGNBQWlCLGtCQUFXQyxRQUFRQyxJQUFSLENBQWEsc0JBQU0sT0FBT0MsRUFBUCxLQUFjLFVBQXBCLEVBQWIsQ0FBWCxFQUF2Qjs7QUFFQTs7Ozs7OztBQU9BLElBQU1DLHdCQUF3QixTQUF4QkEscUJBQXdCLGtCQUFXLFlBQVksbUNBQVJDLEdBQVEsZ0RBQVJBLEdBQVE7QUFDbkQsUUFBSUEsSUFBSUMsTUFBSixLQUFlLENBQW5CLEVBQXNCLE9BQU8sb0JBQU1DLFFBQVFDLE9BQVIsRUFBTixFQUFQO0FBQ3RCLFFBQUlSLGVBQWVLLEdBQWYsQ0FBSixFQUF5QixNQUFNLElBQUlJLFNBQUosQ0FBYyxxQkFBZCxDQUFOOztBQUV6QkosUUFBSUssT0FBSjs7QUFFQSxRQUFNQyxPQUFPTixJQUFJLENBQUosQ0FBYjtBQUNBLFFBQU1PLE9BQU9QLElBQUlRLEtBQUosQ0FBVSxDQUFWLENBQWI7O0FBRUEsV0FBTyxnREFBSUMsSUFBSixxREFBSUEsSUFBSixtQ0FBYUYsS0FBS0csTUFBTCxDQUFZbkIsY0FBWixFQUE0QlcsUUFBUUMsT0FBUixHQUFrQlQsSUFBbEIsQ0FBdUIsb0JBQU1ZLHNCQUFRRyxJQUFSLENBQU4sRUFBdkIsQ0FBNUIsQ0FBYixFQUFQO0FBQ0QsR0FWNkIsRUFBOUI7O0FBWUFFLE9BQU9DLE9BQVAsR0FBaUJiLHNCQUFzQkcsT0FBdEIsQ0FBakI7QUFDQVMsT0FBT0MsT0FBUCxDQUFlQyxLQUFmLEdBQXVCZCxxQkFBdkIiLCJmaWxlIjoiY29tcG9zZS5wcm9taXNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBFeHBvcnRzIGEgbGlicmFyeSB0aGF0IGNvbXBvc2VzIHByb21pc2UgcmV0dXJuaW5nIGZ1bmN0aW9ucy5cbiAqIEBzaW5jZSA1LzgvMThcbiAqIEBmaWxlXG4gKi9cblxuY29uc3QgcHJvbWlzZVJlZHVjZXIgPSAoY3VycmVudCwgbmV4dCkgPT4gY3VycmVudC50aGVuKG5leHQpO1xuY29uc3QgaGFzTm9uRnVuY3Rpb24gPSBmbkFycmF5ID0+IGZuQXJyYXkuc29tZShmbiA9PiB0eXBlb2YgZm4gIT09ICdmdW5jdGlvbicpO1xuXG4vKipcbiAqIExpa2UgZnAuY29tcG9zZSBmb3IgUHJvbWlzZSByZXR1cm5pbmcgZnVuY3Rpb25zLlxuICogVGhlIHJpZ2h0IG1vc3QgZnVuY3Rpb24gY2FuIGhhdmUgdW5saW1pdGVkIGFyaXR5LCBhbGwgb3RoZXJzIHdpbGwgYmUgdHJlYXRlZCBhcyB1bmFyeS5cbiAqIEBwYXJhbSB7Li4uZnVuY3Rpb259IGZucyBUaGUgZnVuY3Rpb25zIHRvIGNvbXBvc2UuIFRoZXNlIGNhbiBiZSBlaXRoZXIgc3luYyBvciBQcm9taXNlXG4gKiByZXR1cm5pbmcgZnVuY3Rpb25zLiBIb3dldmVyLCB0aGUgcmV0dXJuZWQgZnVuY3Rpb24gd2lsbCBhbHdheXMgcmV0dXJuIGEgUHJvbWlzZS5cbiAqIEByZXR1cm5zIHtmdW5jdGlvbn0gQSBmdW5jdGlvbiBjb21wb3NlZCB1c2luZyB0aGUgb25lcyBwcm92aWRlZC5cbiAqL1xuY29uc3QgQ29tcG9zZVByb21pc2VGYWN0b3J5ID0gUHJvbWlzZSA9PiAoLi4uZm5zKSA9PiB7XG4gIGlmIChmbnMubGVuZ3RoID09PSAwKSByZXR1cm4gKCkgPT4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gIGlmIChoYXNOb25GdW5jdGlvbihmbnMpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdFeHBlY3RlZCBhIGZ1bmN0aW9uJyk7XG5cbiAgZm5zLnJldmVyc2UoKTtcblxuICBjb25zdCBoZWFkID0gZm5zWzBdO1xuICBjb25zdCByZXN0ID0gZm5zLnNsaWNlKDEpO1xuXG4gIHJldHVybiAoLi4uYXJncykgPT4gcmVzdC5yZWR1Y2UocHJvbWlzZVJlZHVjZXIsIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4gaGVhZCguLi5hcmdzKSkpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb21wb3NlUHJvbWlzZUZhY3RvcnkoUHJvbWlzZSk7XG5tb2R1bGUuZXhwb3J0cy51c2luZyA9IENvbXBvc2VQcm9taXNlRmFjdG9yeTtcbiJdfQ==
