const logger = require('./logger');
var loggerService = require("./logger").serviceLog;
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var config = require('../config/config');
var mongodbUrl = config.db_connection_string;
logger.info('db connection string :: ' + mongodbUrl);

mongoose.set('debug', function (coll, method, query, doc, options) {
  loggerService.info('CALL_SERVICE|MONGODB_CONNECTION|COLLECTION|' + coll + '|METHOD|' + method + '|QUERY|' + JSON.stringify(query) + '|REQHEADERS||RESPSTATUS||RESPBODY|' + JSON.stringify(doc) + '|RESPTIME||ERRORMESSAGE||EXCEPTION||');
});

function connectDB() {

  try {
    mongoose.connect(mongodbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
  } catch (error) {
    console.log("Could not connect to MongoDB");
    console.log(error);
  }

}

connectDB();

// CONNECTION EVENTS
// mongoose.connection.on('x', function () {
// logger.info('Mongoose default connection open to ' + dbURI);
// loggerService.info('Mongoose default connection success');
// console.log('Mongoose default connection success');
// });

mongoose.connection.on('connecting', () => {
  console.log('Connecting to MongoDB');
});

mongoose.connection.on('connected', function () {
  console.info('Mongoose default connection successful');
  loggerService.info('CALL_SERVICE|MONGODB_CONNECTION|METHOD||URI|' + mongodbUrl + '|REQID||REQHEADERS||RESPSTATUS||RESPBODY|Mongo connection connected|RESPTIME||ERRORMESSAGE||EXCEPTION||');
  countReconnectDb = 0;
});

mongoose.connection.on('reconnected', () => {
  console.log('Mongoose default reconnected!');
});

// If the connection throws an error
var countReconnectDb = 0;
mongoose.connection.on('error', function (err) {
  if (countReconnectDb < 3) {
    countReconnectDb++;
    loggerService.error('CALL_SERVICE|MONGODB_CONNECTION|METHOD||URI|' + mongodbUrl + '|REQID||REQHEADERS||RESPSTATUS||RESPBODY||RESPTIME||ERRORMESSAGE|' + err + '|EXCEPTION||');
  }
  console.log('Mongoose default connection error: ' + err);
  mongoose.connection.close(function () {
    setTimeout(connectDB, 5000);
  });
});



// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    logger.error('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

// BRING IN YOUR SCHEMAS & MODELS // For example
require('../model');
// require('../model/distChn');
// require('../model/chnSales');