const AWS = require('aws-sdk');
const { config } = require('./config');
const { makeQRCodeScan } = require('./libraries/qrCodeScans');

AWS.config.update({ region: config.region });

const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

exports.createQRCodeScan = async (event) => {
  let body;
  let statusCode;
  try {
    const params = {
      TableName: 'QRCodeScans',
      Item: makeQRCodeScan(event),
    };
    await ddb.putItem(params).promise();
    statusCode = 200;
    body = { ok: true };
  } catch(e) {
    statusCode = 500;
    body = { ok: false, error: e.message };
  }
  return { statusCode, body };
};


