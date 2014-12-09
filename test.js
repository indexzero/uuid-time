/*
 * test.js: Tests for uuid-time
 *
 * (C) 2014 Charlie Robbins
 * MIT LICENSE
 *
 */

var vows = require('vows'),
    assert = require('assert'),
    nodeUuid = require('node-uuid'),
    uuid = require('uuid'),
    uuidTime = require('./index');

//
// Because the boundary of the test can sometimes cross
// into the next millisecond allow tests to pass for either
// millisecond.
//
function assertAlmostTime(actual, expected) {
  try { assert.equal(actual, expected); }
  catch (ex) { assert.equal(actual + 1, expected); }
}

//
// Macro which returns a test suite for the given
// `uuidModule`.
//
function shouldRunWith(uuidModule) {
  return {
    'string': function () {
      var now = +new Date(),
          v1  = uuidModule.v1();

      assertAlmostTime(now, uuidTime.v1(v1));
    },
    'buffer': function () {
      var now = +new Date(),
          v1  = uuidModule.parse(nodeUuid.v1());

      assertAlmostTime(now, uuidTime.v1(v1));
    }
  }
}

vows.describe('uuid-time').addBatch({
  'With v1 uuids': {
    'from node-uuid': shouldRunWith(nodeUuid),
    'from uuid':      shouldRunWith(uuid)
  }
}).export(module);
