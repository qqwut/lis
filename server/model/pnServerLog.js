var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var pnServerLogScm = new Schema({
    THREAD: {
      type: String
    },
    METHOD: {
      type: String
    },
    URI: {
      type: String
    },
    REQID: {
      type: String
    },
    REQHEADERS: {
      type: String
    },
    REQBODY: {
      type: String
    },
    RESPSTATUS: {
      type: String
    },
    RESPTIME: {
      type: String
    },
    RESBODY: {
     type: String
    },
    ERRORMESSAGE: {
      type: String
    },
    EXCEPTION: {
      type: String
    },
    SERVIICENAME: {
      type: String
    },
    ACTION: {
      type: String
    },
    REHKEY: {
     type: String
    },
    SOURCE: {
      type: String
    },
    REHKEY: {
     type: String
    },
    SOURCE: {
      type: String
    },
    DATE: {
      type: Date,
      default: Date.now
    },
    USER: {
      type: String
    }})

var pnLogServer = mongoose.model('pnServerLog', pnServerLogScm, 'pnServerLog');

module.exports = pnLogServer;