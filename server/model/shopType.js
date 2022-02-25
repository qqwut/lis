var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var fieldsAliasPlugin = require('mongoose-aliasfield');
/* ------------- [STRAT LOV SCHEMA] ------------ */
var shopTypeSchema = new Schema({
  // lovType_data: {type: String},
  code: {type: String},
  name: {type: String}

}, {
  versionKey: false
});
// shopTypeSchema.plugin(fieldsAliasPlugin);

var shopType = mongoose.model('shopType', shopTypeSchema, 'shopType');

module.exports = shopType;
/* ------------- [END LOV SCHEMA] ------------ */