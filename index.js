const AWS = require('aws-sdk');
const { config } = require('./config');
const { 
  makeQRCodeScan,
  makeQRCodeScanKey,
} = require('./libraries/qrCodeScans');
const { 
  _data,
  _error, 
} = require('./libraries/common');

AWS.config.update({ region: config.region });

const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

exports.readQRCodeScan = async (event) => {
  let body;
  let statusCode;
  try {
    const params = { 
      TableName: config.tableNames.scans,
      Key: makeQRCodeScanKey(event),
    };
    const qrCodeScan = await ddb.getItem(params).promise();
    statusCode = 200;
    body = _data(qrCodeScan);
  } catch(e) {
    statusCode = 500;
    body = _error(e);
  }
  return { statusCode, body };
};

exports.createQRCodeScan = async (event) => {
  let body;
  let statusCode;
  try {
    const params = { 
      TableName: config.tableNames.scans, 
      Item: makeQRCodeScan(event), 
    };
    await ddb.putItem(params).promise();
    statusCode = 200;
    body = { ok: true };
  } catch(e) {
    statusCode = 500;
    body = _error(e);
  }
  return { statusCode, body };
};


