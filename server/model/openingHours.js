var mongoose = require('mongoose');
var Schema = mongoose.Schema;
/* ------------- [STRAT OPENINGHOURS SCHEMA] ------------ */
var openingHoursSchema = new Schema({
  chnSalesGrp_data: {
    type: String
  },
  shopArea_data: {
    type: String
  },
  shopType_data: {
    type: String
  },
  dayOfWeek_data: {
    type: String
  },
  timeOpen_data: {
    type: String
  },
  timeClose_data: {
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

var openingHours = mongoose.model('openingHours', openingHoursSchema, 'openingHours');

module.exports = openingHours;
/* ------------- [END OPENINGHOURS SCHEMA] ------------ */