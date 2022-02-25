var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema
var authorizeFieldSchema = new Schema({
  group: {
    type: String
  },
  role: {
    type: String
  },
  username: {
    type: String
  },
  parentComponentCode: {
    type: String
  },
  parentComponentType: {
    type: String
  },
  parentComponentName: {
    type: String
  },
  componentCode: {
    type: String
  },
  componentType: {
    type: String
  },
  componentName: {
    type: String
  },
  componentValue: {
    type: String
  },
  description: {
    type: String
  },
  visible: {
    type: String
  },
  enable: {
    type: String
  },
  require: {
    type: String
  },
  default: {
    type: String
  }
}, {
  versionKey: false
});

var authorizeField = mongoose.model('authorizeField', authorizeFieldSchema, 'authorizeField');

module.exports = authorizeField;
