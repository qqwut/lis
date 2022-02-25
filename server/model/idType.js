var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var fieldsAliasPlugin = require('mongoose-aliasfield');
/* ------------- [STRAT LOV SCHEMA] ------------ */
var idTypeSchema = new Schema({
  // lovType_data: {type: String},
  code: {type: String},
  name: {type: String}

}, {
  versionKey: false
});
// idTypeSchema.plugin(fieldsAliasPlugin);

var idType = mongoose.model('idType', idTypeSchema, 'idType');

module.exports = idType;
/* ------------- [END LOV SCHEMA] ------------ */