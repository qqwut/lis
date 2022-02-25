var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema
var chnSalesSchema = new Schema({
  distChnCode: {
    type: String
  },
  chnSalesCode: {
    type: String
  },
  chnSalesName: {
    type: String
  },
  menberCategory: {
    type: String
  },
  wholeSalesFlag: {
    type: String
  },
  distributorFlag: {
    type: String
  },
  retailFlag: {
    type: String
  },
  prefixLoc: {
    type: String
  },
  syncSapFlag: {
    type: String
  },
  sapCusGrp: {
    type: String
  },
  remark: {
    type: String
  }
}, {
  versionKey: false
});

var chnSales = mongoose.model('chnSales', chnSalesSchema, 'chnSales');

module.exports = chnSales;
