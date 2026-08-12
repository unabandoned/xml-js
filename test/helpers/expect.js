'use strict';

// A minimal jasmine-compatible `expect()` backed by node:assert, providing
// exactly the matchers the surviving specs use: toEqual, toBe, toContain,
// toThrow, and the `.not` inversion of each.

var assert = require('node:assert');

// jasmine's toContain uses deep equality for array/array-like elements and
// substring matching for strings. Only the first argument is significant
// (jasmine matchers ignore extra arguments), which the specs rely on.
function contains(haystack, needle) {
  if (typeof haystack === 'string') {
    return haystack.indexOf(needle) !== -1;
  }
  if (haystack != null && typeof haystack.length === 'number') {
    for (var i = 0; i < haystack.length; i++) {
      try {
        assert.deepStrictEqual(haystack[i], needle);
        return true;
      } catch (e) {
        // not a match; keep looking
      }
    }
    return false;
  }
  if (haystack != null && typeof haystack === 'object') {
    var keys = Object.keys(haystack);
    for (var j = 0; j < keys.length; j++) {
      try {
        assert.deepStrictEqual(haystack[keys[j]], needle);
        return true;
      } catch (e) {
        // not a match; keep looking
      }
    }
  }
  return false;
}

function matchers(actual, negate) {
  return {
    toEqual: function (expected) {
      if (negate) {
        assert.notDeepStrictEqual(actual, expected);
      } else {
        assert.deepStrictEqual(actual, expected);
      }
    },
    toBe: function (expected) {
      if (negate) {
        assert.notStrictEqual(actual, expected);
      } else {
        assert.strictEqual(actual, expected);
      }
    },
    toContain: function (expected) {
      var found = contains(actual, expected);
      if (negate) {
        assert.ok(!found, 'expected collection not to contain ' + JSON.stringify(expected));
      } else {
        assert.ok(found, 'expected collection to contain ' + JSON.stringify(expected));
      }
    },
    toThrow: function () {
      if (negate) {
        assert.doesNotThrow(actual);
      } else {
        assert.throws(actual);
      }
    }
  };
}

function expect(actual) {
  var result = matchers(actual, false);
  result.not = matchers(actual, true);
  return result;
}

module.exports = expect;
