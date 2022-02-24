var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var fieldsAliasPlugin = require('mongoose-aliasfield');
/* ------------- [STRAT LOV SCHEMA] ------------ */
var retailShopSchema = new Schema({
  // lovType_data: {type: String},
  code: {type: String},
  name: {type: String}

}, {
  versionKey: false
});
// retailShopSchema.plugin(fieldsAliasPlugin);

var retailShop = mongoose.model('retailShop', retailShopSchema, 'retailShop');

module.exports = retailShop;
/* ------------- [END LOV SCHEMA] ------------ */