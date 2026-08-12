'use strict';

// Installs jasmine-compatible globals so the existing *.spec.js files run
// unchanged on Node's built-in test runner. Loaded via `node -r ./test/setup.js`
// before the spec files are evaluated.

var nodeTest = require('node:test');

// jasmine passes a `done` callback as the first argument of an async spec
// function; node:test passes the TestContext there and only supplies `done`
// as a second argument. Adapt any spec/hook that declares a single argument
// so its `done` maps onto node:test's callback.
function adapt(fn) {
  if (typeof fn !== 'function' || fn.length === 0) {
    return fn;
  }
  return function (t, done) {
    return fn(done);
  };
}

global.describe = nodeTest.describe;
global.xdescribe = nodeTest.describe.skip;
global.it = function (name, fn) {
  return nodeTest.it(name, adapt(fn));
};
global.beforeEach = function (fn) {
  return nodeTest.beforeEach(adapt(fn));
};
global.afterEach = function (fn) {
  return nodeTest.afterEach(adapt(fn));
};
global.expect = require('./helpers/expect');
