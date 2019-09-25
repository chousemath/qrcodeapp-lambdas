const assert = require('assert');
const {
  makeQRCodeScan,
} = require('../libraries/qrCodeScans');

describe('qrCodeScans.js', () => {
  describe('#makeQRCodeScan()', () => {
    it('should return return a formatted DynamoDB object', () => {
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
