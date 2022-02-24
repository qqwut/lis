var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema
var authFieldSchema = new Schema({
  chnSalesCode_key1: {
    type: String
  },
  page_key2: {
    type: String
  },
  action_data: {
    type: String
  },
  lovType_data: {
    type: String
  },
  fieldName_data: {
    type: String
  },
  fieldType_data: {
    type: String
  },
  value_data: {
    type: String
  },
  labelName_data: {
    type: String
  }
}, {
  versionKey: false
});

var chnSales = mongoose.model('authField', authFieldSchema, 'authField');

module.exports = chnSales;
