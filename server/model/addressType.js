var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var fieldsAliasPlugin = require('mongoose-aliasfield');
/* ------------- [STRAT LOV SCHEMA] ------------ */
var addressTypeSchema = new Schema({
  // lovType_data: {type: String},
  code: {type: String},
  name: {type: String},
  type: {type: String}

}, {
  versionKey: false
});
// addressTypeSchema.plugin(fieldsAliasPlugin);

var addressType = mongoose.model('addressType', addressTypeSchema, 'addressType');

module.exports = addressType;
/* ------------- [END LOV SCHEMA] ------------ */