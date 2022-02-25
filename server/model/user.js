var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var fieldsAliasPlugin = require('mongoose-aliasfield');
/* ------------- [STRAT LOV SCHEMA] ------------ */
var userSchema = new Schema({
  username: {
    type: String
  },
  password: {
    type: String
  },
  locationCode: {
    type: String
  },
  email: {
    type: String
  },
  firstname: {
    type: String
  },
  lastname: {
    type: String
  },
  username: {
    type: String
  },
  sharedUser: {
    type: String
  },
  userType: {
    type: String
  },
  role: {
    type: String
  },
  channelType: {
    type: String
  },
  ascCode: {
    type: String
  },
  mobileNo: {
    type: String
  }

}, {
  versionKey: false
});
// regionSchema.plugin(fieldsAliasPlugin);

var user = mongoose.model('user', userSchema, 'user');

module.exports = user;
/* ------------- [END LOV SCHEMA] ------------ */