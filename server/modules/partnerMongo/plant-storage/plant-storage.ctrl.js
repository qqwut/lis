var fs = require("fs");
const path = require("path");
var moment = require("moment");
var _ = require("lodash");
var env = process.env.NODE_ENV || "development";
var cfg = require("../../../config/config.js");
var utils = require("../../../utils/common.js");
var logger = require("../../../utils/logger");
var _CONST = require("../../../utils/constants.js");
var clientHttp = require("../../../connector/http-connector.js");
var plantMod = require("../../../model/sapPlant.js");


exports.getSapPlantAllList = function(req, res) {
  console.log("API GET Plant All List");
  var ret = {
    responseCode: 200,
    responseMessage: "Success"
  };

  var fieldSelect = {
    $group: {
      _id: {
          plantCode: "$plantCode_key1",
          plantName: "$plantName_data"
      }
    }
  };

  plantMod.aggregate([fieldSelect], function(err, result) {
    if (err) {
      res.status(500).json({
        responseCode: 500,
        responseMessage: "Fail",
        error: err
      });
      return;
    }
    if (result.length > 0) {
      ret.data = result;
      res.json(ret);
      return;
    }
  });
};

exports.getSapStorageAllList = function(req, res) {
  console.log("API GET Storage All List");
  var ret = {
    responseCode: 200,
    responseMessage: "Success"
  };

  var fieldSelect = {
    plantCode_key1: req.query.plantCode,
    activeFlag_key3: req.query.activeFlag
  };

  plantMod.find(fieldSelect, function(err, result) {
    if (err) {
      res.status(500).json({
        responseCode: 500,
        responseMessage: "Fail",
        error: err
      });
      return;
    }
    if (result.length > 0) {
      ret.data = result;
      res.json(ret);
      return;
    }
  });
};