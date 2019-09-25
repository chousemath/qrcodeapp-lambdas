const assert = require('assert');
const {
  _data,
  _error,
} = require('../libraries/common');

describe('common.js', () => {
  describe('#_data()', () => {
    it('should return return a formatted data response object', () => {
      const response = _data({ name: 'jo' });

      assert.equal(response.hasOwnProperty('ok'), true);
      assert.equal(response.ok, true);

      assert.equal(response.hasOwnProperty('data'), true);
      assert.equal(response.data.hasOwnProperty('name'), true);
      assert.equal(response.data.name, 'jo');
    });
  });
});

describe('common.js', () => {
  describe('#_error()', () => {
    it('should return return a formatted error response object', () => {
      const e = new Error('xxx');
      const response = _error(e);
      assert.equal(response.hasOwnProperty('ok'), true);
      assert.equal(response.ok, false);

      assert.equal(response.hasOwnProperty('error'), true);
      assert.equal(response.error, 'xxx');
    });
  });
});
