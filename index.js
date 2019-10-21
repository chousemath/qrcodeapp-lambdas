const AWS = require('aws-sdk');
const { config } = require('./config');
const {
    ok,
    okWithData,
    notOK,
    notFound,
    notOKWithData,
} = require('./responses');
const {
    idForQRCodeScan,
    makeQRCodeScan,
    makeQRCodeScanKey,
} = require('./libraries/qrCodeScans');
const { _timestamp } = require('./libraries/common');
const paramsLocations = { TableName: config.tableNames.locations };
const paramsScans = { TableName: config.tableNames.scans };

AWS.config.update({ region: config.region });

const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

exports.createQRCodeLocation = async event => {
    try {
        const params = Object.assign(
            {
                Item: {
                    name: event.name,
                    category: event.category,
                    id: idForQRCodeScan(event.category),
                    timestamp: _timestamp(),
                },
            },
            paramsLocations
        );
        await ddb.put(params).promise();
        return ok;
    } catch (e) {
        return notOkWithData(e);
    }
};

exports.readQRCodeLocations = async event => {
    try {
        const qrCodeLocations = await ddb.scan(paramsLocations).promise();
        return okWithData(
            qrCodeLocations.Items.sort((a, b) => b.timestamp - a.timestamp)
        );
    } catch (e) {
        return notOkWithData(e);
    }
};

exports.readQRCodeLocation = async event => {
    try {
        const params = Object.assign({ Key: event }, paramsLocations);
        const qrCodeLocation = await ddb.get(params).promise();
        return okWithData(qrCodeLocation.Item);
    } catch (e) {
        return notOkWithData(e);
    }
};

exports.updateQRCodeLocation = async event => {
    try {
        const params = Object.assign(
            {
                Key: { id: event.id, timestamp: event.timestamp },
                UpdateExpression: 'set #a=:x, #b=:y',
                ExpressionAttributeNames: {
                    '#a': 'name',
                    '#b': 'category',
                },
                ExpressionAttributeValues: {
                    ':x': event.name,
                    ':y': event.category,
                },
            },
            paramsLocations
        );
        await ddb.update(params).promise();
        return ok;
    } catch (e) {
        return notOkWithData(e);
    }
};

exports.destroyQRCodeLocation = async event => {
    try {
        const params = Object.assign({ Key: event }, paramsLocations);
        await ddb.delete(params).promise();
        return ok;
    } catch (e) {
        return notOkWithData(e);
    }
};

exports.createQRCodeScan = async event => {
    try {
        const params = Object.assign(
            {
                Item: Object.assign(event, {
                    id: idForQRCodeScan(event.category),
                    timestamp: _timestamp(),
                }),
            },
            paramsScans
        );
        await ddb.put(params).promise();
        return ok;
    } catch (e) {
        return notOkWithData(e);
    }
};

exports.readQRCodeScans = async event => {
    try {
        const qrCodeScans = await ddb.scan(paramsScans).promise();
        return okWithData(
            qrCodeScans.Items.sort((a, b) => b.timestamp - a.timestamp)
        );
    } catch (e) {
        return notOkWithData(e);
    }
};

exports.readQRCodeScan = async event => {
    try {
        const params = Object.assign({ Key: event }, paramsScans);
        const qrCodeScan = await ddb.get(params).promise();
        return okWithData(qrCodeScan.Item);
    } catch (e) {
        return notOkWithData(e);
    }
};

exports.destroyQRCodeScan = async event => {
    try {
        const params = Object.assign({ Key: event }, paramsScans);
        await ddb.delete(params).promise();
        return ok;
    } catch (e) {
        return notOkWithData(e);
    }
};
