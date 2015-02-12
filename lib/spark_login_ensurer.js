var spark = require('spark');

var SparkLoginEnsurer = {};

SparkLoginEnsurer.middleware = function (sparkCredentials) {
  SparkLoginEnsurer.credentials = sparkCredentials;
  return function ensureSparkLogin(req, res, next) {
    if (spark.ready()) {
      console.log('Already have Spark access token', spark.accessToken);
      return next();
    }

    console.log('Logging in to Spark');
    spark.login(sparkCredentials)
    .then(succeed(next), fail(res));
  };
};

SparkLoginEnsurer.retry = function () {
  console.log('Got rejected by the Spark API, logging in again');
  return spark.login(SparkLoginEnsurer.credentials);
};

var succeed = function (next) {
  return function onFulfilled(value) {
    console.log('Got Spark access token', spark.accessToken);
    next();
  };
};

var fail = function (res) {
  return function onRejected(reason) {
    res.status(400).json({ ok: false, error: reason });
  };
};

module.exports = SparkLoginEnsurer;
