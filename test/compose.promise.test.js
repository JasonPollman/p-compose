import {
  assert,
  expect,
} from 'chai';

import sinon from 'sinon';
import bluebird from 'bluebird';

// Selects the file to tests per process.env.TEST_SOURCE
const [composePromise, source] = (() => {
  switch (process.env.TEST_SOURCE) {
    /* eslint-disable global-require */
    case 'dist': return [require('../dist/compose.promise'), 'dist'];
    case 'browser': return [require('../dist/compose.promise.min'), 'browser'];
    default: return [require('../src/compose.promise'), 'src'];
    /* eslint-enable global-require */
  }
})();

const noop = () => {};
const delay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Tests the given `composePromise` instance.
 * @param {function} compose The `composePromise` function to test.
 * @param {string=} prefix An optional prefix to differentiate tests.
 * @returns {undefined}
 */
function testComposePromiseFunction(compose, prefix = '') {
  const title = prefix ? `${prefix} -` : '';

  it(`${title} Should return a "noop" function if no methods are given`, async () => {
    const composed = compose();
    expect(composed).to.be.a('function');

    const promise = composed();
    expect(promise.then).to.be.a('function');
    expect(await promise).to.equal(undefined);
  });

  it(`${title} Should return a promise is given a single sync function`, async () => {
    const composed = compose(noop);
    expect(composed).to.be.a('function');

    const promise = composed();
    expect(promise.then).to.be.a('function');
    expect(await promise).to.equal(undefined);
  });


  it(`${title} Should properly handle promise rejections (1)`, async () => {
    const resolve = sinon.stub();
    const reject = () => Promise.reject(new Error('oops...'));

    const composed = compose(resolve, resolve, reject);
    expect(composed).to.be.a('function');

    try {
      await composed();
    } catch (e) {
      expect(e.message).to.equal('oops...');
      expect(resolve.callCount).to.equal(0);
    }
  });

  it(`${title} Should properly handle promise rejections (2)`, async () => {
    const resolve = sinon.stub();
    const reject = () => Promise.reject(new Error('oops...'));

    const composed = compose(resolve, reject, resolve);
    expect(composed).to.be.a('function');

    try {
      await composed();
    } catch (e) {
      expect(e.message).to.equal('oops...');
      expect(resolve.callCount).to.equal(1);
    }
  });

  it(`${title} Should properly handle promise rejections (3)`, async () => {
    const resolve = sinon.stub();
    const reject = () => Promise.reject(new Error('oops...'));

    const composed = compose(reject, resolve, resolve);
    expect(composed).to.be.a('function');

    try {
      await composed();
    } catch (e) {
      expect(e.message).to.equal('oops...');
      expect(resolve.callCount).to.equal(2);
    }
  });

  it(`${title} Should compose a set of synchronous functions (coercing them to a promise)`, async () => {
    const join = value => input => `${input}-${value}`;

    const composed = compose(join(5), join(4), join(3), join(2), join(1));
    const promise = composed(0);

    expect(promise.then).to.be.a('function');
    expect(await promise).to.equal('0-1-2-3-4-5');
  });

  it(`${title} Should compose a set of mixed (sync/async) functions (1)`, async () => {
    const join = value => input => `${input}-${value}`;
    const pjoin = value => input => delay(50).then(() => join(value)(input));

    const start = Date.now();
    const composed = compose(join(5), pjoin(4), join(3), pjoin(2), join(1));
    const promise = composed(0);

    expect(promise.then).to.be.a('function');
    expect(await promise).to.equal('0-1-2-3-4-5');
    expect(Date.now() - start).to.be.gte(100);
  });

  it(`${title} Should compose a set of mixed (sync/async) functions (2)`, async () => {
    const join = value => input => `${input}-${value}`;
    const pjoin = value => input => delay(50).then(() => join(value)(input));

    const start = Date.now();
    const composed = compose(pjoin(5), join(4), pjoin(3), join(2), pjoin(1));
    const promise = composed(0);

    expect(promise.then).to.be.a('function');
    expect(await promise).to.equal('0-1-2-3-4-5');
    expect(Date.now() - start).to.be.gte(150);
  });

  it(`${title} Should allow the first function executed to have unlimited arity`, async () => {
    const arrayify = (a, b, c) => Promise.resolve([a, b, c]);
    const join = array => Promise.resolve(array.join('-'));
    const toUpper = value => value.toUpperCase();

    const composed = compose(toUpper, join, arrayify);
    expect(await composed('foo', 'bar', 'baz')).to.equal('FOO-BAR-BAZ');
  });

  it(`${title} Should reject if given a non-function (1)`, async () => {
    assert.throws(() => compose(null), 'Expected a function');
  });

  it(`${title} Should reject if given a non-function (2)`, async () => {
    assert.throws(() => compose(noop, noop, null), 'Expected a function');
  });

  it(`${title} Should reject if given a non-function (3)`, async () => {
    assert.throws(() => compose(noop, {}, noop), 'Expected a function');
  });

  it(`${title} Should reject if given a non-function (4)`, async () => {
    assert.throws(() => compose('foo', noop, noop), 'Expected a function');
  });

  describe('Example', () => {
    it('Should work as expected', () => {
      const fetchUserById = id => Promise.resolve({
        id,
        name: {
          first: 'Chuck',
          last: 'Norris',
        },
      });

      const getUserFullNameById = composePromise(
        user => `${user.name.first} ${user.name.last}`,
        fetchUserById,
      );

      return getUserFullNameById(1).then(result => expect(result).to.equal('Chuck Norris'));
    });
  });
}

describe(`Testing compose-promise using "${source}"`, () => {
  it('Should have a static `using` method', () => {
    expect(composePromise.using).to.be.a('function');
  });

  // Run all tests against native Promises (using src)
  testComposePromiseFunction(composePromise);

  describe('composePromise.using', () => {
    it('Should create a new composePromise function', () => {
      expect(composePromise.using(Promise)).to.be.a('function');
      expect(composePromise.using(Promise)).to.not.equal(composePromise);

      expect(composePromise.using(bluebird)).to.be.a('function');
      expect(composePromise.using(bluebird)).to.not.equal(composePromise);
    });

    // Run all tests against the bluebird library
    testComposePromiseFunction(composePromise.using(bluebird), 'Alternate library (bluebird)');
  });
});
