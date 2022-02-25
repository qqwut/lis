var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var fieldsAliasPlugin = require('mongoose-aliasfield');
/* ------------- [STRAT LOV SCHEMA] ------------ */
var provinceSchema = new Schema({
  provinceCode_key0: {type: String, alias: 'provinceCode'},
  provinceNameTh_data: {type: String, alias: 'provinceNameTh'},
  provinceNameEn_data: {type: String, alias: 'provinceNameEn'},
  routeGroup_key1: {type: String, alias: 'routeGroup'},
  retailShop_data: {type: String, alias: 'retailShop'}
}, {
  versionKey: false
});
provinceSchema.plugin(fieldsAliasPlugin);

var province = mongoose.model('province', provinceSchema, 'province');

module.exports = province;
/* ------------- [END LOV SCHEMA] ------------ */