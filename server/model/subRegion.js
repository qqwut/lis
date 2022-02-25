var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var fieldsAliasPlugin = require('mongoose-aliasfield');
/* ------------- [STRAT LOV SCHEMA] ------------ */
var subRegionSchema = new Schema({
  code: {type: String},
  nameTh: {type: String},
  nameEn: {type: String},
  region: {type: String}

}, {
  versionKey: false
});
// subRegionSchema.plugin(fieldsAliasPlugin);

var subRegion = mongoose.model('subRegion', subRegionSchema, 'subRegion');

module.exports = subRegion;
/* ------------- [END LOV SCHEMA] ------------ */