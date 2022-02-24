var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bankInfoSchema = new Schema({
    // lovType_data: {type: String},
    bankNameTh: {type: String},
    bankNameEn: {type: String},
    bankCode: {type: String},
    branchCode: {type: String},
    branchNameTh: {type:String},
    branchNameEn: {type:String},

  }, {
    versionKey: false
  });

  var bankMasterInfo = mongoose.model('bankMasterInfo', bankInfoSchema, 'bankMasterInfo');

  module.exports = bankMasterInfo;
