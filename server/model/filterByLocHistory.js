var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var fieldsAliasPlugin = require('mongoose-aliasfield');
/* ------------- [STRAT LOV SCHEMA] ------------ */
var filterByLocHistorySchema = new Schema({
  // lovType_data: {type: String},
  code: {type: String},
  name: {type: String}

}, {
  versionKey: false
});
// filterByLocHistorySchema.plugin(fieldsAliasPlugin);

var filterByLocHistory = mongoose.model('filterByLocHistory', filterByLocHistorySchema, 'filterByLocHistory');

module.exports = filterByLocHistory;
/* ------------- [END LOV SCHEMA] ------------ */