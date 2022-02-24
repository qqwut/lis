var mongoose = require('mongoose');
var Schema = mongoose.Schema;
/* ------------- [STRAT USERGROUP SCHEMA] ------------ */
var userGroupSchema = new Schema({
  groupNo_key0: {
    type: String
  },
  groupName_data: {
    type: String
  },
  distChnCode_key1: {
    type: String
  },
  distChnName_data: {
    type: String
  },
  chnSalesCode_key2: {
    type: String
  },
  chnSaleName_data: {
    type: String
  },
  retailShop_data: {
    type: String
  },
  saleSubRegionCode_data: {
    type: String
  },
  created_data: {
    type: String
  },
  createdBy_data: {
    type: String
  },
  lastUpd_data: {
    type: String
  },
  lastUpdBy_data: {
    type: String
  }
}, {
  versionKey: false
});

var userGroup = mongoose.model('userGroup', userGroupSchema, 'userGroup');

module.exports = userGroup;
/* ------------- [END USERGROUP SCHEMA] ------------ */