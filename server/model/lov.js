var mongoose = require('mongoose');
var Schema = mongoose.Schema;
/* ------------- [STRAT LOV SCHEMA] ------------ */
var lovSchema = new Schema({
  lovType_data: {
    type: String
  },
  lovType_key2: {
    type: String
  },
  lovCode_key0: {
    type: String
  },
  lovCode_key2: {
    type: String
  },
  lovId_key3: {
    type: String
  },
  lovName_data: {
    type: String
  },
  lovVal01_data: {
    type: String
  },
  lovVal02_data: {
    type: String
  },
  lovVal11_data: {
    type: String
  },
  lovVal12_data: {
    type: String
  },
  lovVal21_data: {
    type: String
  },
  lovVal22_data: {
    type: String
  },
  lovVal23_data: {
    type: String
  },
  lovVal24_data: {
    type: String
  },
  lovVal25_data: {
    type: String
  },
  lovVal26_data: {
    type: String
  },
  lovVal31_data: {
    type: String
  },
  lovVal32_data: {
    type: String
  },
  lovVal41_data: {
    type: String
  },
  lovVal42_data: {
    type: String
  },
  lovVal51_data: {
    type: String
  },
  lovVal52_data: {
    type: String
  },
  lovVal61_data: {
    type: String
  },
  lovVal62_data: {
    type: String
  },
  lovVal71_data: {
    type: String
  },
  activeFlg_data: {
    type: String
  },
  activeFlg_key1: {
    type: String
  },
  textDesc_data: {
    type: String
  },
  groupType_data: {
    type: String
  },
  orderBy_data: {
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
  },
  modificationNum_data: {
    type: String
  }
}, {
  versionKey: false
});

var lov = mongoose.model('lov', lovSchema, 'lov');

module.exports = lov;
/* ------------- [END LOV SCHEMA] ------------ */