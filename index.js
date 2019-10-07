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
const paramsLocations = { TableName: config.tableNames.locations };
const paramsScans = { TableName: config.tableNames.scans };

AWS.config.update({ region: config.region });

const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

exports.createQRCodeLocation = async (event) => {
  let body;
  let statusCode;
  try {
    const paramsRead = Object.assign({ Key: event }, paramsLocations);
    const qrCodeLocation = await ddb.get(paramsRead).promise();
    if (qrCodeLocation && qrCodeLocation.Item) {
      statusCode = 400;
      body = _error(new Error('Location already exists'));
      return { statusCode, body };
    }
    const params = Object.assign({ Item: Object.assign(event, { timestamp: _timestamp() })}, paramsLocations);
    await ddb.put(params).promise();
    statusCode = 200;
    body = { ok: true };
  } catch(e) {
    statusCode = 500;
    body = _error(e);
  }
  return { statusCode, body };
};

exports.readQRCodeLocations = async (event) => {
  let body;
  let statusCode;
  try {
    const qrCodeLocations = await ddb.scan(paramsLocations).promise();
    statusCode = 200;
    body = _data(qrCodeScans.Items.sort((a, b) => b.timestamp - a.timestamp));
  } catch(e) {
    statusCode = 500;
    body = _error(e);
  }
  return { statusCode, body };
};

exports.readQRCodeLocation = async (event) => {
  let body;
  let statusCode;
  try {
    const params = Object.assign({ Key: event }, paramsLocations);
    const qrCodeLocation = await ddb.get(params).promise();
    statusCode = 200;
    body = _data(qrCodeLocation.Item);
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
    const params = Object.assign({ 
      Item: Object.assign(event, {
        id: idForQRCodeScan(event.category),
        timestamp: _timestamp(),
      }), 
    }, paramsScans);
    await ddb.put(params).promise();
    statusCode = 200;
    body = { ok: true };
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
    const qrCodeScans = await ddb.scan(paramsScans).promise();
    statusCode = 200;
    body = _data(qrCodeScans.Items.sort((a, b) => b.timestamp - a.timestamp));
  } catch(e) {
    statusCode = 500;
    body = _error(e);
  }
  return { statusCode, body };
};

exports.readQRCodeScan = async (event) => {
  let body;
  let statusCode;
  try {
    const params = Object.assign({ Key: event }, paramsScans);
    const qrCodeScan = await ddb.get(params).promise();
    statusCode = 200;
    body = _data(qrCodeScan.Item);
  } catch(e) {
    statusCode = 500;
    body = _error(e);
  }
  return { statusCode, body };
};

exports.destroyQRCodeScan = async (event) => {
  let body;
  let statusCode;
  try {
    const params = Object.assign({ Key: event }, paramsScans);
    await ddb.delete(params).promise();
    statusCode = 200;
    body = { ok: true };
  } catch(e) {
    statusCode = 500;
    body = _error(e);
  }
  return { statusCode, body };
};
