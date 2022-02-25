var mongoose = require('mongoose');
var Schema = mongoose.Schema;
/* ------------- [STRAT SESSION SCHEMA] ------------ */
var sessionSchema = new Schema({
  type_key0: {
    type: String
  },
  refId_key1: {
    type: String
  },
  userId_key2: {
    type: String
  },
  page_data: {
    type: String
  },
  token_data: {
    type: String
  },
  refreshToken_data: {
    type: String
  },
  expired_data: {
    type: Date
  }
}, {
  versionKey: false
});

var session = mongoose.model('session', sessionSchema, 'session');

module.exports = session;
/* ------------- [END SESSION SCHEMA] ------------ */