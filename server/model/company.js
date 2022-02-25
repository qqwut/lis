var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema
var companySchema = new Schema({
  companyId_key0: {
    type: String
  },
  companyAbbr_data: {
    type: String
  },
  vatBranchNo_data: {
    type: String
  },
  idType_data: {
    type: String
  },
  idNo_data: {
    type: String
  },
  abbrev_data: {
    type: String
  },
  prefixCompany_data: {
    type: String
  },
  saleOrgCode_data: {
    type: String
  },
  titleTh_data: {
    type: String
  },
  nameTh_data: {
    type: String
  },
  titleEn_data: {
    type: String
  },
  nameEn_data: {
    type: String
  },
  internalCompanyFlag_data: {
    type: String
  },
  status_data: {
    type: String
  },
  effectiveDt_data: {
    type: String
  },
  terminateDt_data: {
    type: String
  },
  mainPhoneType_data: {
    type: String
  },
  mainPhoneNumber_data: {
    type: String
  },
  mainPhoneExt_data: {
    type: String
  },
  faxNumber_data: {
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
  },
  sapCompany_data: {
    type: String
  }
}, {
  versionKey: false
});

var company = mongoose.model('company', companySchema, 'company');

module.exports = company;