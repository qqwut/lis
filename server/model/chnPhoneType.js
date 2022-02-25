var mongoose = require('mongoose');
var Schema = mongoose.Schema;
/* ------------- [STRAT LOV SCHEMA] ------------ */
var chnPhoneTypeSchema = new Schema({
  // lovType_data: {type: String},
  code: {type: String},
  name: {type: String},
  channelType: {type: String},
  defaultData: {type: String}
}, {
  versionKey: false
});

var chnPhoneType = mongoose.model('chnPhoneType', chnPhoneTypeSchema, 'chnPhoneType');

module.exports = chnPhoneType;
/* ------------- [END LOV SCHEMA] ------------ */