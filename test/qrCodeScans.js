const assert = require('assert');
const {
  idForQRCodeScan, 
  makeQRCodeScan,
  makeQRCodeScanKey,
} = require('../libraries/qrCodeScans');

describe('qrCodeScans.js', () => {
  describe('#idForQRCodeScan', () => {
    it('should generate a DynamoDB id from a category', () => {
      const id = idForQRCodeScan(1);
      assert(id.indexOf('1x') > -1, true);
    });
  });
  describe('#makeQRCodeScanKey()', () => {
    it('should return a formatted key object for DynamoDB', () => {
      const event = {
        id: 'a',
        timestamp: 123,
      };
      const key = makeQRCodeScanKey(event);

      assert.equal(key.hasOwnProperty('id'), true);
      assert.equal(key.id.hasOwnProperty('S'), true);
      assert.equal(key.id.S, 'a');

      assert.equal(key.hasOwnProperty('timestamp'), true);
      assert.equal(key.timestamp.hasOwnProperty('N'), true);
      assert.equal(key.timestamp.N, '123');
    });
  });
  describe('#makeQRCodeScan()', () => {
    it('should return a formatted DynamoDB object', () => {
      const event = {
        "code": "code-abc",
        "location": "location-abc",
        "longitude": 1.2,
        "latitude": 2.1,
        "category": 1
      };
      const qrCodeScan = makeQRCodeScan(event);

      assert.equal(qrCodeScan.hasOwnProperty('id'), true);
      assert.equal(qrCodeScan.id.hasOwnProperty('S'), true);

      assert.equal(qrCodeScan.hasOwnProperty('code'), true);
      assert.equal(qrCodeScan.code.hasOwnProperty('S'), true);

      assert.equal(qrCodeScan.hasOwnProperty('location'), true);
      assert.equal(qrCodeScan.location.hasOwnProperty('S'), true);

      assert.equal(qrCodeScan.hasOwnProperty('longitude'), true);
      assert.equal(qrCodeScan.longitude.hasOwnProperty('N'), true);

      assert.equal(qrCodeScan.hasOwnProperty('latitude'), true);
      assert.equal(qrCodeScan.latitude.hasOwnProperty('N'), true);

      assert.equal(qrCodeScan.hasOwnProperty('category'), true);
      assert.equal(qrCodeScan.category.hasOwnProperty('N'), true);

      assert.equal(qrCodeScan.hasOwnProperty('timestamp'), true);
      assert.equal(qrCodeScan.timestamp.hasOwnProperty('N'), true);
    });
  });
});
