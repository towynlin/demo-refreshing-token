var express = require('express');
var app = express();

var SparkLoginEnsurer = require('./lib/spark_login_ensurer');
var DevicesController = require('./lib/devices_controller');

var sparkCredentials = {
  username: process.env.SPARK_USERNAME,
  password: process.env.SPARK_PASSWORD
};

if (!sparkCredentials.username || !sparkCredentials.password) {
  throw new Error('SPARK_USERNAME and SPARK_PASSWORD environment variables must be set');
}

var ensureSparkLogin = SparkLoginEnsurer.middleware(sparkCredentials)
app.use(ensureSparkLogin);

app.get('/', DevicesController.index);

app.listen(3000);
