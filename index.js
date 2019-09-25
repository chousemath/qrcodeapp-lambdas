const AWS = require('aws-sdk');
const { config } = require('./config');

AWS.config.update({ region: config.region });
const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

exports.createQRCodeScan = async (event) => {
  const body = {
    ok: true,
    data: 'test',
  };
  const response = {
    statusCode: 200,
    body,
  };
  return response;
};


