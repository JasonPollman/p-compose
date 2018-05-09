# compose.promise
> Like fp.compose, but for Promises.

**`compose.promise` has been designed to function like `fp.compose`.**

This smally utility library exports a function that composes the given sync/async functions. The rightmost
function can have any arity; the remaining have a fixed arity of 1.


## Motivation
There's a number of modules out there for Promise function composition, but they have slight differences in
expected behavior:

1. Most of them don't support unlimited arity to the rightmost function.
1. Most of them don't support non-native Promise libraries.


## Usage
```js
import compose from 'compose.promise';

const fetchUserById = (id) => {
  // Make some async db call or something...
  return Promise.resolve({
    id,
    name: {
      first: 'Chuck',
      last: 'Norris',
    },
  });
};

const getUserFullNameById = compose(
  user => `${user.name.first} ${user.name.last}`,
  fetchUserById,
);

getUserFullNameById(1).then(console.log); // Prints 'Chuck Norris'
```


## Browser Support
`dist/compose.promise.min.js` is UMD and can be imported using require/browsers.

```html
<script src="dist/compose.promise.min.js"></script>
```

Note: `dist/compose.promise.js` is the main export used by node/npm.


## Using Non-Native Promises
You can use the static method `composePromise.using` to create a **new** `composePromise` method
that will use the provided Promise library.

```js
import ComposePromise from 'compose.promise';

// Creates a *new* function that will use bluebird promises.
const compose = ComposePromise.using(bluebird);

const doSomething = compose(a, b, ...);
const bluebirdPromise = doSomething();
```

## Alternatives
- [compose-async](https://www.npmjs.com/package/compose-async)
- [compose-p](https://www.npmjs.com/package/compose-p)
- [compose-promise](https://www.npmjs.com/package/compose-promise)
