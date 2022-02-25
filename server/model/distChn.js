var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema
var distChnSchema = new Schema({
  distChnCode: {
    type: String
  },
  distChnName: {
    type: String
  },
  sapCustomerGroup:{
    type: String
  }
}, {
  versionKey: false
});

var distChn = mongoose.model('distChn', distChnSchema, 'distChn');

module.exports = distChn;
