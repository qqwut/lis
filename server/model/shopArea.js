var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var fieldsAliasPlugin = require('mongoose-aliasfield');
/* ------------- [STRAT LOV SCHEMA] ------------ */
var shopAreaSchema = new Schema({
  // lovType_data: {type: String},
  code: {type: String},
  name: {type: String}

}, {
  versionKey: false
});
// shopAreaSchema.plugin(fieldsAliasPlugin);

var shopArea = mongoose.model('shopArea', shopAreaSchema, 'shopArea');

module.exports = shopArea;
/* ------------- [END LOV SCHEMA] ------------ */