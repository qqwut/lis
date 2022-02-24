var mongoose = require('mongoose');
var Schema = mongoose.Schema;
/* ------------- [STRAT LOV SCHEMA] ------------ */
var shopSegmentSchema = new Schema({
  // lovType_data: {type: String},
  code: {type: String},
  name: {type: String},
  channelType: {type: String}
}, {
  versionKey: false
});

var shopSegment = mongoose.model('shopSegment', shopSegmentSchema, 'shopSegment');

module.exports = shopSegment;
/* ------------- [END LOV SCHEMA] ------------ */