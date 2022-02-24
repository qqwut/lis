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
var locationDraftMod = require("../../../model/locationDraft.js");
var companyMod = require("../../../model/company.js");
var userGroupMod = require("../../../model/userGroup.js");
var openingHoursMod = require("../../../model/openingHours.js");
var mappingRegionMod = require("../../../model/mappingRegion.js");
var provinceMod = require("../../../model/province.js");
var subRegionMod = require("../../../model/subRegion.js");
var zipCodeMod = require("../../../model/zipCode.js");
var authFieldMod = require("../../../model/authField.js");
var retailShopMod = require("../../../model/retailShop");
var dataLocationDummy = [];
var testDummyData = cfg.mockup_data ? parseInt(cfg.mockup_data) : 0;

exports.getProvince = function(req, res) {
  logger.info("get province data");

  var ret = {
    responseCode: 200,
    responseMessage: "Success"
  };

  var userGroupArr = [];
  var userGroup = req.query.userGroup;

  var condition = [];
  if (userGroup && userGroup.length > 0) {
    userGroupArr = userGroup.split(",");
    for (var i = 0; i < userGroupArr.length; i++) {
      condition.push({
        groupName_data: {
          $eq: userGroupArr[i]
        }
      });
    }
  } else {
    ret.responseCode = 400;
    ret.responseMessage = "Bad Request";
    res.json(ret);
    return;
  }

  userGroupMod.aggregate(
    [
      {
        $match: {
          $or: condition
        }
      },
      {
        $group: {
          _id: "$distChnCode_key1",
          retail: {
            $addToSet: {
              code: "$retailShop_data"
            }
          },
          subRegion: {
            $addToSet: {
              code: "$saleSubRegionCode_data"
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          retail: 1,
          subRegion: 1
        }
      }
    ],
    function(err, permission) {
      if (err) {
        res.status(500).json({
          responseCode: 500,
          responseMessage: "Fail",
          error: err
        });
        return;
      }

      if (permission && permission[0]) {
        var retail = permission[0].retail;
        var subRegion = permission[0].subRegion;
        if (
          retail &&
          retail[0] &&
          retail[0].code &&
          retail[0].code.length > 0
        ) {
          var aggregate = [];
          if (retail.length === 1) {
            aggregate = [
              {
                $lookup: {
                  from: "mappingRegion",
                  localField: "provinceCode_key0",
                  foreignField: "provinceCode_key0",
                  as: "subRegion"
                }
              },
              {
                $match: {
                  retailShop_data: retail[0].code
                }
              },
              {
                $project: {
                  _id: 0,
                  provinceCode: "$provinceCode_key0",
                  provinceNameTh: "$provinceNameTh_data",
                  retailShop: "$retailShop_data",
                  subRegion: "$subRegion.saleSubRegionCode_data"
                }
              },
              {
                $sort: {
                  provinceNameTh: 1
                }
              }
            ];
          } else {
            aggregate = [
              {
                $lookup: {
                  from: "mappingRegion",
                  localField: "provinceCode_key0",
                  foreignField: "provinceCode_key0",
                  as: "subRegion"
                }
              },
              {
                $project: {
                  _id: 0,
                  provinceCode: "$provinceCode_key0",
                  provinceNameTh: "$provinceNameTh_data",
                  retailShop: "$retailShop_data",
                  subRegion: "$subRegion.saleSubRegionCode_data"
                }
              },
              {
                $sort: {
                  provinceNameTh: 1
                }
              }
            ];
          }
          provinceMod.aggregate(aggregate, function(err, result) {
            if (err) {
              res.status(500).json({
                responseCode: 500,
                responseMessage: "Fail",
                error: err
              });
              return;
            }

            ret.data = result;
            res.json(ret);
          });
        } else if (
          subRegion &&
          subRegion[0] &&
          subRegion[0].code &&
          subRegion[0].code.length > 0
        ) {
          var aggregate = [];
          var condition = [];
          for (var i = 0; i < subRegion.length; i++) {
            condition.push({
              saleSubRegionCode_data: {
                $eq: subRegion[i].code
              }
            });
          }
          aggregate = [
            {
              $lookup: {
                from: "province", // change province to province2
                localField: "provinceCode_key0",
                foreignField: "provinceCode_key0",
                as: "province"
              }
            },
            {
              $match: {
                $or: condition
              }
            },
            {
              $unwind: "$provinceCode_key0"
            },
            {
              $unwind: "$province"
            },
            {
              $project: {
                _id: 1,
                subRegion: "$saleSubRegionCode_data",
                provinceCode: "$provinceCode_key0",
                provinceNameTh: "$province.provinceNameTh_data",
                retailShop: "$province.retailShop_data"
              }
            },
            {
              $sort: {
                provinceNameTh: 1
              }
            }
          ];
          mappingRegionMod.aggregate(aggregate, function(err, result) {
            if (err) {
              res.status(500).json({
                responseCode: 500,
                responseMessage: "Fail",
                error: err
              });
              return;
            }

            ret.data = result;
            res.json(ret);
          });
        } else {
          provinceMod.aggregate(
            [
              {
                $lookup: {
                  from: "mappingRegion",
                  localField: "provinceCode_key0",
                  foreignField: "provinceCode_key0",
                  as: "subRegion"
                }
              },
              {
                $project: {
                  _id: 0,
                  provinceCode: "$provinceCode_key0",
                  provinceNameTh: "$provinceNameTh_data",
                  retailShop: "$retailShop_data",
                  subRegion: "$subRegion.saleSubRegionCode_data"
                }
              },
              {
                $sort: {
                  provinceNameTh: 1
                }
              }
            ],
            function(err, result) {
              if (err) {
                res.status(500).json({
                  responseCode: 500,
                  responseMessage: "Fail",
                  error: err
                });
                return;
              }
              ret.data = result;
              res.json(ret);
            }
          );
        }
      }
    }
  );
};

exports.getProvinceCompany = function(req, res) {
  logger.info("get province data");

  var ret = {
    responseCode: 200,
    responseMessage: "Success"
  };

  var userGroupArr = [];
  var userGroup = req.query.userGroup;

  // var condition = [];
  // if (userGroup && userGroup.length > 0) {
  //     userGroupArr = userGroup.split(',');
  //     for (var i = 0; i < userGroupArr.length; i++) {
  //         condition.push({
  //             groupName_data: {
  //                 $eq: userGroupArr[i]
  //             }
  //         });
  //     }
  // } else {
  //     ret.responseCode = 400;
  //     ret.responseMessage = 'Bad Request';
  //     res.json(ret);
  //     return;
  // }

  userGroupMod.aggregate(
    [
      // {
      //   $match: {
      //     $or: condition
      //   }
      // },
      {
        $group: {
          _id: "$distChnCode_key1",
          retail: {
            $addToSet: {
              code: "$retailShop_data"
            }
          },
          subRegion: {
            $addToSet: {
              code: "$saleSubRegionCode_data"
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          retail: 1,
          subRegion: 1
        }
      }
    ],
    function(err, permission) {
      if (err) {
        res.status(500).json({
          responseCode: 500,
          responseMessage: "Fail",
          error: err
        });
        return;
      }

      if (permission && permission[0]) {
        var retail = permission[0].retail;
        var subRegion = permission[0].subRegion;
        if (
          retail &&
          retail[0] &&
          retail[0].code &&
          retail[0].code.length > 0
        ) {
          var aggregate = [];
          if (retail.length === 1) {
            aggregate = [
              {
                $lookup: {
                  from: "mappingRegion",
                  localField: "provinceCode_key0",
                  foreignField: "provinceCode_key0",
                  as: "subRegion"
                }
              },
              {
                $match: {
                  retailShop_data: retail[0].code
                }
              },
              {
                $project: {
                  _id: 0,
                  provinceCode: "$provinceCode_key0",
                  provinceNameTh: "$provinceNameTh_data",
                  retailShop: "$retailShop_data",
                  subRegion: "$subRegion.saleSubRegionCode_data"
                }
              },
              {
                $sort: {
                  provinceNameTh: 1
                }
              }
            ];
          } else {
            aggregate = [
              {
                $lookup: {
                  from: "mappingRegion",
                  localField: "provinceCode_key0",
                  foreignField: "provinceCode_key0",
                  as: "subRegion"
                }
              },
              {
                $project: {
                  _id: 0,
                  provinceCode: "$provinceCode_key0",
                  provinceNameTh: "$provinceNameTh_data",
                  retailShop: "$retailShop_data",
                  subRegion: "$subRegion.saleSubRegionCode_data"
                }
              },
              {
                $sort: {
                  provinceNameTh: 1
                }
              }
            ];
          }
          provinceMod.aggregate(aggregate, function(err, result) {
            if (err) {
              res.status(500).json({
                responseCode: 500,
                responseMessage: "Fail",
                error: err
              });
              return;
            }

            ret.data = result;
            res.json(ret);
          });
        } else if (
          subRegion &&
          subRegion[0] &&
          subRegion[0].code &&
          subRegion[0].code.length > 0
        ) {
          var aggregate = [];
          var condition = [];
          for (var i = 0; i < subRegion.length; i++) {
            condition.push({
              saleSubRegionCode_data: {
                $eq: subRegion[i].code
              }
            });
          }
          aggregate = [
            {
              $lookup: {
                from: "province", // change province to province2
                localField: "provinceCode_key0",
                foreignField: "provinceCode_key0",
                as: "province"
              }
            },
            {
              $match: {
                $or: condition
              }
            },
            {
              $unwind: "$provinceCode_key0"
            },
            {
              $unwind: "$province"
            },
            {
              $project: {
                _id: 1,
                subRegion: "$saleSubRegionCode_data",
                provinceCode: "$provinceCode_key0",
                provinceNameTh: "$province.provinceNameTh_data",
                retailShop: "$province.retailShop_data"
              }
            },
            {
              $sort: {
                provinceNameTh: 1
              }
            }
          ];
          mappingRegionMod.aggregate(aggregate, function(err, result) {
            if (err) {
              res.status(500).json({
                responseCode: 500,
                responseMessage: "Fail",
                error: err
              });
              return;
            }

            ret.data = result;
            res.json(ret);
          });
        } else {
          provinceMod.aggregate(
            [
              {
                $lookup: {
                  from: "mappingRegion",
                  localField: "provinceCode_key0",
                  foreignField: "provinceCode_key0",
                  as: "subRegion"
                }
              },
              {
                $project: {
                  _id: 0,
                  provinceCode: "$provinceCode_key0",
                  provinceNameTh: "$provinceNameTh_data",
                  retailShop: "$retailShop_data",
                  subRegion: "$subRegion.saleSubRegionCode_data"
                }
              },
              {
                $sort: {
                  provinceNameTh: 1
                }
              }
            ],
            function(err, result) {
              if (err) {
                res.status(500).json({
                  responseCode: 500,
                  responseMessage: "Fail",
                  error: err
                });
                return;
              }
              ret.data = result;
              res.json(ret);
            }
          );
        }
      }
    }
  );
};

exports.getProvinceAll = function(req, res) {
  console.log("API GET Province All List");
  var ret = {
    responseCode: 200,
    responseMessage: "Success"
  };

  var fieldSelect = {
    $project: {
      provinceCode: "$provinceCode_key0",
      provinceCodeSap: "$provinceCodeSap_data",
      provinceNameTh: "$provinceNameTh_data",
      provinceNameEn: "$provinceNameEn_data"
    }
  };

  provinceMod.aggregate([fieldSelect], function(err, result) {
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

exports.getProvinceSap = function (req, res) {
  logger.info('get province for sap');
  var provinceCode = req.query.provinceCode;
  
  console.log(req.query);
  var ret = {
      responseCode: 200,
      responseMessage: 'Success'
  };
  try {
      provinceMod
      .find({'provinceCode_key0': provinceCode},{

      }, function (err, result) {
          if (err) {
              logger.errorStack(err);
              ret.responseCode = 500;
              ret.responseMessage = 'Fail';
              ret.responseDescription = err.message;
              res.json(ret);
              throw err;
          }else{
              logger.info('get province for sap size :: ' + result.length);
              ret.data = result;
              res.json(ret);
          }
      }
  )

  } catch (error) {
      ret.responseCode = 500;
      ret.responseMessage = 'Fail';
      ret.responseDescription = error.message;
      res.json(ret);
  }

};
