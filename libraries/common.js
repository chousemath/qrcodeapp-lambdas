exports._timestamp = () => (new Date()).getTime();
exports._data = (data) => {
  return {
    ok: true,
    data,
  };
};
exports._error = (e) => {
  return {
    ok: false,
    error: e.message,
  };
};
