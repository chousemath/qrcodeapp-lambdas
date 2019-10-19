const headers = {
  'Access-Control-Allow-Origin': '*',
};
exports.notFound = (data = 'Requested record could not be found.') => {
  return {
    statusCode: 404,
    headers,
    body: { ok: false, data },
  };
};
exports.ok = {
  statusCode: 200,
  headers,
  body: { ok: true },
};
exports.notOK = {
  statusCode: 500,
  headers,
  body: { ok: false },
};

exports.okWithData = data => {
  return {
    statusCode: 200,
    headers,
    body: { ok: true, data },
  };
};
exports.notOKWithData = data => {
  return {
    statusCode: 500,
    headers,
    body: { ok: false, data },
  };
};
