/* ------------- [START REQUIRE] ------------ */
const mongoose = require("mongoose");
const fs = require('fs');
const path = require('path');
const convertExcel = require('excel-as-json').processFile;
const filePath = path.join(__dirname, `../excel/testImport.xlsx`);
const async = require('async');
var distChn = mongoose.model('distChn');
var userGroup = mongoose.model('userGroup');
/* ------------- [END REQUIRE] ------------ */
/* ------------- [START INITIAL] ------------ */
/* ------------- [END INITIAL] ------------ */
/* ------------- [STRAT IMPLEMENT SEARCH] ------------ */
exports.test = function (req, res, next) {

  async.waterfall([
    getAllUserGroup,
    secondData,
  ], function (err, result) {
    if (err) {
      next(err);
    } else {
      res.json(result);
    }
  });

  function getAllUserGroup(callback) {
    let allUserGroup = [];
    userGroup.find().distinct('groupName_data', function (err, docs) {
      if (err) {
        callback(err, null);
        // res.json(err);
      } else {
        docs.map(function (element) {
          var groupQuery = {
            groupName_data: {
              $eq: element
            }
          }
          allUserGroup.push(groupQuery);
        });
        callback(null, allUserGroup);
        // res.json(allUserGroup);
      }
    });
  }

  function secondData(allGroup, callback) {
    var pipeline = [{
        $match: {
          $or: allGroup
        }
      },
      {
        $lookup: {
          from: "mappingCompany",
          localField: "chnSalesCode_key2",
          foreignField: "chnSalesCode_key1",
          as: "mapComp"
        }
      },
      {
        $unwind: "$mapComp"
      }
    ]
    userGroup.aggregate(
      pipeline,
      function (err, result) {
        if (err) {
          callback(err, null);
          // next(err);
        } else {
          callback(null, result);
          // res.json(result);
        }
      });
  }
};

exports.save = function (req, res) {
  var data = req.body;
  var tempData = new distChn({
    distChnCode: data.distChnCode,
    distChnName: data.distChnName
  });
  tempData.save(function (err) {
    if (err) {
      res.json(err);
    } else {
      res.json({
        "code": 200
      });
    }
  });
};

exports.importExcel = function (req, res) {
  console.log(`Test Import To JSON!`);
  var options = {
    isColOriented: false
  };
  convertExcel(filePath, null, options, function (err, data) {
    if (err) {
      res.json(err);
    } else {
      res.json(data);
    }
  });
};
/* ------------- [END IMPLEMENT SEARCH] ------------ */