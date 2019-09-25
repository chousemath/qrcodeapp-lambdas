const makeQRCodeScanID = (category) => {
  return {
    S: `${category}-${Math.floor(Math.random() * 10000000)}`,
  };
};
exports.makeQRCodeScan = (event) => {
  return {
    id:  makeQRCodeScanID(event.category),
    code: { S: event.code },
    location: { S: event.location },
    longitude: { N: event.longitude.toString() },
    latitude: { N: event.latitude.toString() },
    category: { N: event.category.toString() },
    timestamp: { N: (new Date()).getTime().toString() },
  };
};
exports.makeQRCodeScanKey = (event) => {
  return {
    'id': { S: event.id },
    'timestamp': { N: event.timestamp.toString() },
  };
};
