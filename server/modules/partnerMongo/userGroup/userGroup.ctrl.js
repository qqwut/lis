var fs = require('fs');
const path = require('path');
var moment = require('moment');
var _ = require('lodash');
var env = process.env.NODE_ENV || 'development';
var cfg = require('../../../config/config.js');
var utils = require('../../../utils/common.js');
var logger = require('../../../utils/logger');
var _CONST = require('../../../utils/constants.js');
var clientHttp = require('../../../connector/http-connector.js');
var locationDraftMod = require('../../../model/locationDraft.js');
var companyMod = require('../../../model/company.js');
var userGroupMod = require('../../../model/userGroup.js');
var mappingCompany = require('../../../model/mappingCompany.js');
var openingHoursMod = require('../../../model/openingHours.js');
var mappingRegionMod = require('../../../model/mappingRegion.js');
var provinceMod = require('../../../model/province.js');
var subRegionMod = require('../../../model/subRegion.js');
var zipCodeMod = require('../../../model/zipCode.js');
var authFieldMod = require('../../../model/authField.js');
var retailShopMod = require('../../../model/retailShop');
var dataLocationDummy = [];
var testDummyData = cfg.mockup_data ? parseInt(cfg.mockup_data) : 0;


exports.selectChannel = function (req, res) {
    var result = {
      responseCode: '',
      responseMessage: '',
      responseDescription: []
    }
    var query = req.query;
    var userGroup = query.userGroupAuth.split(",");
    var userAllGroup = []
    if (userGroup.indexOf('ADMIN') < 0) {
      for (var index = 0; index < userGroup.length; index++) {
        if (userGroup[index].length > 0) {
          var element = {
            'groupName_data': {
              $eq: userGroup[index]
            }
          }
          userAllGroup.push(element);
        }
      }
    }
    var pipeline = [{
      $lookup: {
        from: "mappingCompany",
        localField: "chnSalesCode_key2",
        foreignField: "chnSalesCode_key1",
        as: "mapComp"
      }
    }, {
      $group: {
        _id: "$distChnCode_key1",
        distChn: {
          $addToSet: {
            code: "$distChnCode_key1",
            name: "$distChnName_data"
          }
        },
        chnSales: {
          $addToSet: {
            code: "$chnSalesCode_key2",
            name: "$chnSaleName_data",
            companyAbbr: "$mapComp.companyAbbr_key2"
          }
        }
      }
    }, {
      $project: {
        _id: 1,
        distChn: 1,
        chnSales: 1
      }
    }];
    if (userAllGroup.length > 0) {
      pipeline.unshift({
        $match: {
          $or: userAllGroup
        }
      });
    }

    userGroupMod.aggregate(pipeline, function (err, results) {
      if (err) {
        res.json(err);
      } else {
        result.responseCode = 200;
        result.data = results
        result.responseDescription = 'success';
        res.json(result)
      }
    })

}

exports.selectChannels = function (req, res) {
    var result = {
      responseCode: '',
      responseMessage: '',
      responseDescription: []
    }
    var query = req.query;
    if(query && query != null){
        var userGroup = req.query.userGroupAuth;
        var chnSaleGroup = req.query.chnSaleGroup;
        var locationFlg = req.query.locationFlg;
        var ascFlg = req.query.ascFlg;
        var omFlg = req.query.omFlg;
        var userAllGroup = []
        var chnSaleAllGroup = [];

        if(userGroup!= undefined && userGroup.length >0){
            var userGroupTemp = userGroup.split(",");
            if (userGroupTemp.indexOf('ADMIN') < 0) {
                for (var index = 0; index < userGroupTemp.length; index++) {
                  if (userGroupTemp[index].length > 0) {
                    var element = {
                      'groupName_data': {
                        $eq: userGroupTemp[index]
                      }
                    }
                    userAllGroup.push(element);
                  }
                }
            }
        }

        if(chnSaleGroup!= undefined && chnSaleGroup.length > 0){
            var chnSaleGroupTemp = chnSaleGroup.split(",");
            if (chnSaleGroupTemp.indexOf('ADMIN') < 0) {
                for (var index = 0; index < chnSaleGroupTemp.length; index++) {
                    if (chnSaleGroupTemp[index].length > 0) {
                        var element = {
                            'chnSalesCode_key2': {
                                $eq: chnSaleGroupTemp[index]
                            }
                        }
                        chnSaleAllGroup.push(element);
                    }
                }
            }
        }
     
    }

    var pipeline = [{
      $lookup: {
        from: "distChn",
        localField: "chnSalesCode_key2",
        foreignField: "chnSalesCode",
        as: "distChn"
      }
    }, { 
        "$unwind": "$distChn"
     }, {
      $group: {
        _id: "$distChn.distChnCode",
        distChn: {
          $addToSet: {
            code: "$distChn.distChnCode",
            name: "$distChn.distChnName"
          }
        },
        chnSales: {
          $addToSet: {
            code: "$distChn.chnSalesCode",
            name: "$distChn.chnSalesName",
            chnType: "$distChn.chnType",
            distChnSaleId: "$distChn.distChnSaleId",
          }
        }
      }
    }, {
      $project: {
        _id: 1,
        distChn: 1,
        chnSales: 1
      }
    }];
    
    if (userAllGroup.length > 0) {
      pipeline.unshift({
        $match: {
            $or: userAllGroup
          }
      });
    }
    
    if (chnSaleAllGroup.length > 0) {
        pipeline.unshift({
          $match: {
              $or: chnSaleAllGroup
            }
        });
    }
    
    if (locationFlg) {
      pipeline.unshift({
        $match: {
          locationFlg: locationFlg
        }
      });
    }
    
    if (ascFlg) {
      pipeline.unshift({
        $match: {
          ascFlg: ascFlg
        }
      });
    }

    if (omFlg) {
      pipeline.unshift({
        $match: {
          omFlg: omFlg
        }
      });
    }

    userGroupMod.aggregate(pipeline, function (err, results) {
      if (err) {
        res.json(err);
      } else {
        result.responseCode = 200;
        result.data = results
        result.responseDescription = 'success';
        res.json(result)
      }
    })

}

exports.getCompanyAbbr = function (req, res) {
    var result = {
      responseCode: '',
      responseMessage: '',
      responseDescription: []
    }
    var query = req.query;
    var distChnCode = query.distChnCode;
    var chnSaleCode = query.chnSaleCode;
    
    var userAllGroup = [];
    var element1 = {"company.internalCompanyFlag_data" : {$eq :"I"}}
    var element2 = {"distChnCode_key0" : {$eq :distChnCode}}
    var element3 = {"chnSalesCode_key1" : {$eq :chnSaleCode}}
    var element4 = {"company.status_data" : {$eq :"ACTIVE"}}
    userAllGroup.push(element1);
    userAllGroup.push(element2);
    userAllGroup.push(element3);
    userAllGroup.push(element4);

    var pipeline = [{
      $lookup: {
        from: "company",
        localField: "companyAbbr_key2",
        foreignField: "companyAbbr_data",
        as: "company"
      }
    }, { 
        "$unwind": "$company"
    }, {
      $match: {
        $and: [ 
            {"company.internalCompanyFlag_data" : {$eq :"I"}},
            {"distChnCode_key0" : {$eq :distChnCode}},
            {"chnSalesCode_key1" : {$eq :chnSaleCode}}, 
            {"company.status_data" : {$eq :"ACTIVE"}} 
        ] 
      }            
    }, {
      $project: {
        _id: 0,
        companyId: '$company.companyId_key0',
        companyAbbr: '$companyAbbr_key2',
        idType: '$company.idType_data',
        idNo: '$company.idNo_data',
        titleTh: '$company.titleTh_data',
        nameTh: '$company.nameTh_data',
        titleEn: '$company.titleEn_data',
        nameEn: '$company.nameEn_data',
        titleCode: '$company.titleCode_data'
      }
    }];
    if (userAllGroup.length > 0) {
      pipeline.unshift({
        $match: {
            $or: userAllGroup
        }
      });
    }

    mappingCompany.aggregate(pipeline, function (err, results) {
      if (err) {
        res.json(err);
      } else {
        result.responseCode = 200;
        result.data = results
        result.responseDescription = 'success';
        res.json(result)
      }
    })

}


exports.getUserGroup = function (req, res) {
    logger.info('get usergroup data');

    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };

    var filter = {};
    var userGroupAuthArr = [];
    var userGroupAuth = req.query.userGroupAuth;

    var condition = [];

    if (userGroupAuth && userGroupAuth.length > 0) {
        userGroupAuthArr = userGroupAuth.split(',');
        if (userGroupAuthArr.indexOf("ADMIN") == -1) { //admin ignore userGroup
            for (var i = 0; i < userGroupAuthArr.length; i++) {
                if (userGroupAuthArr[i].length > 0) {
                    condition.push({
                        groupName_data: {
                            $eq: userGroupAuthArr[i]
                        }
                    });

                }

            }
        }

    } else {
        ret.responseCode = 400;
        ret.responseMessage = 'Bad Request';
        res.json(ret);
        return;
    }

    userGroupMod.aggregate([{
            $match: {
                $or: condition
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
            $group: {
                _id: "$distChnCode_key1",
                distChn: {
                    $addToSet: {
                        code: "$distChnCode_key1",
                        name: "$distChnName_data"
                    }
                },
                chnSales: {
                    $addToSet: {
                        code: "$chnSalesCode_key2",
                        name: "$chnSaleName_data",
                        companyAbbr: "$mapComp.companyAbbr_key2"
                    }
                },
            }
        },
        {
            $project: {
                _id: 1,
                distChn: 1,
                chnSales: 1
            }
        }
    ], function (err, result) {
        if (err) {
            res.status(500).json({
                responseCode: 50000,
                responseMessage: 'Fail',
                error: err
            });
            return;
        }

        var data = [];
        ret.data = result;
        res.json(ret);
    });
};

exports.getSelectChannel = function (req, res) {
    if (undefined != req.query.searchFlg && req.query.searchFlg && req.query.searchFlg == "Y") {
        var userGroup = req.query.userGroupAuth ? req.query.userGroupAuth.split(',') : null;
    }else {
        var userGroup = req.currentUser ? req.currentUser.userGroup : req.query.userGroupAuth ? req.query.userGroupAuth.split(',') : null;
    }
    if (!(userGroup && Array.isArray(userGroup) && userGroup.length > 0)) {
        res.json({
            responseCode: 403,
            responseMessage: 'Bad request : role(user group) not found in token',
        });
        return;
    }

    var condition = {};
    if (userGroup.indexOf("ADMIN") == -1) {
        condition['groupName_data'] = {
            $in: userGroup
        };
    }

    userGroupMod.aggregate([{
            $match: condition
        },
        {
            $project: {
                groupName_data: 1,
                distChnCode_key1: 1,
                distChnName_data: 1,
                chnSalesCode_key2: 1,
                chnSaleName_data: 1,
                retailShop_data: 1,
                saleSubRegionCode_data: 1
            }
        }
    ], function (err, result) {
        if (err) {
            res.json({
                responseCode: 500,
                responseMessage: 'Fail',
                error: err
            });
            return;
        }
        if (result == null) {
            res.json({
                responseCode: 404,
                responseMessage: 'Not found'
            });
            return;
        }
        console.log(result)
        res.json({
            responseCode: 200,
            responseMessage: 'Success',
            data: result
        });
    });
}

exports.checkUserGroup = function (req, res) {
    logger.info('checkUserGroup');
    // /api/phxpartner/location/chk-user-group/?userGroup=AISSHOPBKK,DSFBBCB&distChnCode=AISCHN&chnSaleCode=AISSHOP
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };

    var condition = [];
    var userGroup = req.query.userGroup;
    var distChnCode = req.query.distChnCode;
    var chnSaleCode = req.query.chnSaleCode;

    if (userGroup != null && userGroup.length > 0) {
        if (!Array.isArray(userGroup)) {
            userGroup = userGroup.split(",");
        }
    }
    var condition = [];

    if (userGroup && Array.isArray(userGroup) && userGroup.length > 0) {
        if(userGroup.indexOf("ADMIN") != -1){

        }else{
            var regxUg ="";
            userGroup.forEach(function(element) {
                if(element != undefined && element != "" ){ 
                    if( regxUg == "" ){
                        regxUg += "^"+element;
                    }else{
                        regxUg += "|^"+element;
                    }
                }
            }); 
            condition.push({
                groupName_data: {
                    $regex: new RegExp(regxUg)
                }
            }); 
        }
    } else {
        ret.responseCode = 400;
        ret.responseMessage = 'Bad Request';
        res.json(ret);
        return;
    }

    if (distChnCode && distChnCode.length > 0) {
        condition.push({
            distChnCode_key1: {
                $eq: distChnCode
            }
        });
    } else {
        ret.responseCode = 400;
        ret.responseMessage = 'Bad Request';
        res.json(ret);
        return;
    }
    if (chnSaleCode && chnSaleCode.length > 0) {
        condition.push({
            chnSalesCode_key2: {
                $eq: chnSaleCode
            }
        });
    } else {
        ret.responseCode = 400;
        ret.responseMessage = 'Bad Request';
        res.json(ret);
        return;
    }
    //edit by thanj443 20/09/2021
    condition.push({
      appOnline: {
            $eq: "N"
        }
    });

    userGroupMod.aggregate([{
        $match: {
            $and: condition
        }
    }, {
        $project: {
            groupName: "$groupName_data",
            disChnCode: "$distChnCode_key1",
            disChnName: "$distChnName_data",
            chnSaleCode: "$chnSalesCode_key2",
            chnSaleName: "$chnSaleName_data",
            retailShop: "$retailShop_data",
            subRegion: "$saleSubRegionCode_data"
        }
    }], function (err, result) {
        if (err) {
            res.status(500).json({
                responseCode: 50000,
                responseMessage: 'Fail',
                error: err
            });
            return;
        }

        ret.data = result;
        res.json(ret);
    });
};