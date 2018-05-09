# compose.promise
> Like fp.compose, but for Promises.

**`compose.promise` has been modeled to behave like its syncronous predecessor `fp.compose`.**

There's a number of modules out there for `Promise` composition, but they have slight differences in
expected behvior:

1. Almost all of them don't support an unlimited arity to the right most function.
1. Some of them don't support composing more than 2 functions.
1. Most of them don't support non-native Promise libraries.
1. Most of them reduce the array of functions *every* time the composed function is called, rather than creating a function chain at "composition time".

## Usage
Here's a contrived (but practical) example of parsing a GIT log into an object.

```js
import ChildProcess from 'child_process';
import composePromise from 'compose.promise';

const execAsync = Promise.promisify(ChildProcess.exec);
const localGITLogs = _.partial(execAsync, 'git log', { cwd: process.cwd() });


const parseGITLogs = composePromise(

  localGITLogs,
);
```

## Using Non-Native Promises
You can use the static method `composePromise.using` to create a **new** `composePromise` method
that will use the given Promise library.

```js
import ComposePromise from 'compose.promise';

// Creates a *new* composePromise function that will use bluebird promises.
const composePromise = ComposePromise.using(bluebird);

const myComposedFunction = composePromise(...);
const bluebirdPromiseInstance = composed();
```