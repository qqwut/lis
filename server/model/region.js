var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var fieldsAliasPlugin = require('mongoose-aliasfield');
/* ------------- [STRAT LOV SCHEMA] ------------ */
var regionSchema = new Schema({
  // lovType_data: {type: String},
  code: {type: String},
  nameTh: {type: String},
  nameEn: {type: String}

}, {
  versionKey: false
});
// regionSchema.plugin(fieldsAliasPlugin);

var region = mongoose.model('region', regionSchema, 'region');

module.exports = region;
/* ------------- [END LOV SCHEMA] ------------ */