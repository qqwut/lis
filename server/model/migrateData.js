var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema
var migrateDataSchema = new Schema({
  transactionId: {
    type: String
  },
  migrateDate: {
    type: Date
  },
  migrateData: {
    type: Array
  },
  migrateBy :{
    type: String
  },
  fileLocation : {
    type: String
  },
  status: {
    type: String
  },
  queryData : {
    type: Array
  }
}, {
  strict: false ,
  versionKey: false
});

var migrateMod = mongoose.model('migrateData', migrateDataSchema, 'migrateData');

module.exports = migrateMod;