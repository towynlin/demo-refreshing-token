var spark = require('spark');
var SparkLoginEnsurer = require('./spark_login_ensurer');

var DevicesController = {};

DevicesController.index = function (req, res) {
  spark.listDevices()
  .then(succeed(res), retryOnce(res));
};

var succeed = function (res) {
  return function onFulfilled(devices) {
    var devicesView = transformDevicesForView(devices);
    res.json(devicesView);
  };
};

var retryOnce = function (res) {
  return function onRejected(reason) {
    SparkLoginEnsurer.retry()
    .then(retryIndex(res), fail(res));
  };
};

var transformDevicesForView = function (devices) {
  var devicesView = [];
  devices.forEach(transformDeviceForView, devicesView);
  return devicesView;
};

var transformDeviceForView = function (device) {
  this.push({
    id: device.id,
    name: device.name,
    connected: device.connected
  });
};

var retryIndex = function (res) {
  return function onRetryFulfilled(value) {
    console.log('Retried and got new access token', spark.accessToken);
    spark.listDevices()
    .then(succeed(res), fail(res));
  };
};

var fail = function (res) {
  return function onRetryRejected(reason) {
    res.status(400).json({ ok: false, error: reason });
  };
};

module.exports = DevicesController;
