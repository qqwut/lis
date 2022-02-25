var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var fieldsAliasPlugin = require('mongoose-aliasfield');
/* ------------- [STRAT LOV SCHEMA] ------------ */
var countrySchema = new Schema({
  // lovType_data: {type: String},
  code: {type: String},
  nameTh: {type: String},
  nameEn: {type: String},
  sapCodeEng: {type: String},
  defaultData: {type: String}

}, {
  versionKey: false
});
// countrySchema.plugin(fieldsAliasPlugin);

var country = mongoose.model('country', countrySchema, 'country');

module.exports = country;
/* ------------- [END LOV SCHEMA] ------------ */