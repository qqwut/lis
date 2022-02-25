var mongoose = require('mongoose');
var Schema = mongoose.Schema;
/* ------------- [STRAT LOV SCHEMA] ------------ */
var statusTypeSchema = new Schema({
  // lovType_data: {type: String},
  code: {type: String},
  name: {type: String},
  defaultData: {type: String}
}, {
  versionKey: false
});

var statusType = mongoose.model('statusType', statusTypeSchema, 'statusType');

module.exports = statusType;
/* ------------- [END LOV SCHEMA] ------------ */