const AWS = require('aws-sdk');
const { config } = require('./config');
const { 
  idForQRCodeScan,
  makeQRCodeScan,
  makeQRCodeScanKey,
} = require('./libraries/qrCodeScans');
const { 
  _data,
  _error, 
  _timestamp, 
} = require('./libraries/common');

AWS.config.update({ region: config.region });

const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

exports.readQRCodeScan = async (event) => {
  let body;
  let statusCode;
  try {
    const params = { 
      TableName: config.tableNames.scans,
      Key: event,
    };
    const qrCodeScan = await ddb.get(params).promise();
    statusCode = 200;
    body = _data(qrCodeScan.Item);
  } catch(e) {
    statusCode = 500;
    body = _error(e);
  }
  return { statusCode, body };
};

exports.readQRCodeScans = async (event) => {
  let body;
  let statusCode;
  try {
    const params = {
      TableName: config.tableNames.scans,
    };
    if (event.category) {
      params.ScanFilter = {
        timestamp: {
          ComparisonOperator: 'BEGINS_WITH',
          AttributeValueList: `${event.category}x`,
        }
      };
    }
    const qrCodeScans = await ddb.scan(params).promise();
    statusCode = 200;
    body = _data(qrCodeScans.Items.sort((a, b) => b.timestamp - a.timestamp));
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
      Item: Object.assign(event, {
        id: idForQRCodeScan(event.category),
        timestamp: _timestamp(),
      }), 
    };
    await ddb.put(params).promise();
    statusCode = 200;
    body = { ok: true };
  } catch(e) {
    statusCode = 500;
    body = _error(e);
  }
  return { statusCode, body };
};


