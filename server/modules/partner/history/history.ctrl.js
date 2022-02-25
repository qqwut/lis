var fs = require('fs');
const path = require('path');
var moment = require('moment');
var _ = require('lodash');
var utils = require('../../../utils/common.js');
var env = process.env.NODE_ENV || 'development';
var cfg = require('../../../config/config.js');
var clientHttp = require('../../../connector/http-connector.js');
var utils = require('../../../utils/common.js');
var logger = require('../../../utils/logger');

const PREFIX = cfg.service.PANDORA.PREFIX

exports.getHistory = function (req, res) {
    logger.info("api get History");
    var filter = {};
    filter = req.query;
    var ret = {};
    try {
      var queryStr = utils.getSDFFilter2QueryStr(null, filter);
      console.log("======================================");
      console.log("=================== ", queryStr," ==================");
      console.log("======================================");

      var uri =cfg.service.PANDORA.URI+PREFIX +"/history/list.json?filter=" +queryStr;
      logger.info("GET :: " + uri);
      return clientHttp
        .get(uri)
        .then(function(response) {
          logger.info("response :: " + JSON.stringify(response));
          if (parseInt(response.resultCode) == 20000) {
            ret.responseCode = 200;
            ret.responseDescription = "Success";
            ret.data = response.resultData;
            return res.json(ret);
          } else {
            ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
            ret.responseMessage = "Fail";
            ret.responseDescription = response.resultDescription;
            return res.json(ret);
          }
        })
        .catch(function(err) {
          logger.error(err);
          ret.responseCode = 500;
          ret.responseMessage = "Fail";
          ret.responseDescription = err.message;
          return res.json(ret);
        });
    } catch (error) {
      ret.responseCode = 500;
      ret.responseMessage = "Fail";
      ret.responseDescription = error.message;
      return res.json(ret);
    }
};
