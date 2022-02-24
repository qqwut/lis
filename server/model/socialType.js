var mongoose = require('mongoose');
var Schema = mongoose.Schema;
/* ------------- [STRAT LOV SCHEMA] ------------ */
var socialTypeSchema = new Schema({
  // lovType_data: {type: String},
  code: {type: String},
  name: {type: String},
  defaultData: {type: String}
}, {
  versionKey: false
});

var socialType = mongoose.model('socialType', socialTypeSchema, 'socialType');

module.exports = socialType;
/* ------------- [END LOV SCHEMA] ------------ */