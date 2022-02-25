var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var fieldsAliasPlugin = require('mongoose-aliasfield');
/* ------------- [STRAT LOV SCHEMA] ------------ */
var historyLocDisplaySchema = new Schema({
  // lovType_data: {type: String},
  code: {type: String},
  name: {type: String},
  menuType: {type: String},
  Table: {type: String},
  column: {type: String},
  display: {type: String},

}, {
  versionKey: false
});
// filterByLocHistorySchema.plugin(fieldsAliasPlugin);

var historyLocDisplay = mongoose.model('historyLocDisplay', historyLocDisplaySchema, 'historyLocDisplay');

module.exports = historyLocDisplay;
/* ------------- [END LOV SCHEMA] ------------ */