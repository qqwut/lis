var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema
var mappingCompanySchema = new Schema({
  distChnCode_key0: {
    type: String
  },
  chnSalesCode_key1: {
    type: String
  },
  companyAbbr_key2 : {
    type: String
  },
  defaultCompany_data: {
    type: String
  },
  remark_data: {
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

var mappingCompany = mongoose.model('mappingCompany', mappingCompanySchema, 'mappingCompany');

module.exports = mappingCompany;