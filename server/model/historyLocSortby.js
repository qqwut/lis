var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var fieldsAliasPlugin = require('mongoose-aliasfield');
/* ------------- [STRAT LOV SCHEMA] ------------ */
var historyLocSortBySchema = new Schema({
  // lovType_data: {type: String},
  code: {type: String},
  name: {type: String},
  field: {type: String},
  orderBy: {type: String} 

}, {
  versionKey: false
});
// historyLocsortBySchema.plugin(fieldsAliasPlugin);

var historyLocSortBy = mongoose.model('historyLocSortBy', historyLocSortBySchema, 'historyLocSortBy');

module.exports = historyLocSortBy;
/* ------------- [END LOV SCHEMA] ------------ */