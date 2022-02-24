var mongoose = require('mongoose');
var Schema = mongoose.Schema;

    /*{
     "zipCodeId_key0": "Z0000000001",
     "zipCode_key2": "10400",
     "provinceCode_key1": "BKK",
     "amphurTh_key3": "พญาไท",
     "tumbolTh_key4": "สามเสนใน",
     "amphurEn_key5": "Phayathai",
     "tumbolEn_key6": "Samsennai",
     "sapPostalCode_data": "10400",
     "sapAmphurCode_data": "พญาไท",
     "sapTumbolCode_data": "สามเสนใน",
     "created_data": "20160909153300+0700",
     "createdBy_data": "SUWAREEK",
     "lastUpd_data": "20160909153300+0700",
     "lastUpdBy_data": "SUWAREEK"
    }*/
// Schema
var zipCodeSchema = new Schema({

  zipCodeId_key0: {
    type: String
  },
  zipCode_key2: {
    type: String
  },
  provinceCode_key1: {
    type: String
  },
  amphurTh_key3: {
    type: String
  },
  tumbolTh_key4: {
    type: String
  },
  amphurEn_key5: {
    type: String
  },
  tumbolEn_key6: {
    type: String
  },
  sapPostalCode_data: {
    type: String
  },
  sapAmphurCode_data: {
    type: String
  },
  sapTumbolCode_data: {
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
  active_flg: {
    type: String
  }
}, {
  versionKey: false
});

var zipCode = mongoose.model('zipCode', zipCodeSchema, 'zipCode');

module.exports = zipCode;
