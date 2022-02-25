var mongoose = require('mongoose');
var Schema = mongoose.Schema;
/* ------------- [STRAT LOV SCHEMA] ------------ */
var personPhoneTypeSchema = new Schema({
  // lovType_data: {type: String},
  code: {type: String},
  name: {type: String},
  defaultData: {type: String}
}, {
  versionKey: false
});

var personPhoneType = mongoose.model('personPhoneType', personPhoneTypeSchema, 'personPhoneType');

module.exports = personPhoneType;
/* ------------- [END LOV SCHEMA] ------------ */