var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var fieldsAliasPlugin = require('mongoose-aliasfield');
/* ------------- [STRAT LOV SCHEMA] ------------ */
var historyLocFilterBySchema = new Schema({
  // lovType_data: {type: String},
  code: {type: String},
  name: {type: String}

}, {
  versionKey: false 
});
// historyLocsortBySchema.plugin(fieldsAliasPlugin);

var historyLocFilterBy = mongoose.model('historyLocFilterBy', historyLocFilterBySchema, 'historyLocFilterBy');

module.exports = historyLocFilterBy;
/* ------------- [END LOV SCHEMA] ------------ */