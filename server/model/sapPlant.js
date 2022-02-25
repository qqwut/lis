var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var fieldsAliasPlugin = require('mongoose-aliasfield');
/* ------------- [STRAT SCHEMA] ------------ */
var sapPlantStorageSchema = new Schema({
  plantCode_key1: { type: String }, //, alias: 'plantCode'
  plantName_data: { type: String },
}, {
  versionKey: false
});
sapPlantStorageSchema.plugin(fieldsAliasPlugin);

var sapPlantStorage = mongoose.model('sapPlantStorage', sapPlantStorageSchema, 'sapPlantStorage');

module.exports = sapPlantStorage;
/* ------------- [END SCHEMA] ------------ */