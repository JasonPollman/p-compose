# p-compose
> Like fp.compose, but for Promises.

**`p-compose` has been designed to function like `fp.compose`.**

This smally utility library exports a function that composes the given sync/async functions. The rightmost
function can have any arity; the remaining have a fixed arity of 1.


## Motivation
There's a number of modules out there for Promise function composition, but they have slight differences in
expected behavior:

1. Most of them don't support unlimited arity to the rightmost function.
1. Most of them don't support non-native Promise libraries.


## Usage
```js
import compose from 'p-compose';

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
`dist/p-compose.min.js` is UMD and can be imported using require/browsers.

```html
<script src="dist/p-compose.min.js"></script>
```

Note: `dist/p-compose.js` is the main export used by node/npm.


## Using Non-Native Promises
You can use the static method `using` to create a **new** `compose` method
that will use the provided Promise library.

```js
import pcompose from 'p-compose';

// Creates a *new* function that will use bluebird promises.
const compose = pcompose.using(bluebird);

const doSomething = compose(a, b, ...);
const bluebirdPromise = doSomething();
```

## Alternatives
- [compose-async](https://www.npmjs.com/package/compose-async)
- [compose-p](https://www.npmjs.com/package/compose-p)
- [compose-promise](https://www.npmjs.com/package/compose-promise)
