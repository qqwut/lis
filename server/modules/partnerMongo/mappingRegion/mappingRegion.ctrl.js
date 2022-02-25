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
var openingHoursMod = require('../../../model/openingHours.js');
var mappingRegionMod = require('../../../model/mappingRegion.js');
var provinceMod = require('../../../model/province.js');
var subRegionMod = require('../../../model/subRegion.js');
var zipCodeMod = require('../../../model/zipCode.js');
var authFieldMod = require('../../../model/authField.js');
var retailShopMod = require('../../../model/retailShop');
var dataLocationDummy = [];
var testDummyData = cfg.mockup_data ? parseInt(cfg.mockup_data) : 0;

exports.mappingRegion = function (req, res) {
    logger.info('get mappingRegion data');
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };

    var filter = {};
    var subRegion = req.params.subRegion;

    var condition = [];
    if (subRegion && subRegion.length > 0) {
        condition.push({
            subRegion: {
                $eq: subRegion
            }
        });
    } else {
        ret.responseCode = 400;
        ret.responseMessage = 'Bad Request';
        res.json(ret);
        return;
    }

    mappingRegionMod.aggregate([
        {
            $lookup: {
                from: "region", 
                localField: "regionCode_key2",
                foreignField: "code", 
                as: "regionData" 
            }
        },
        {
            $unwind: "$regionData"
        }, 
        {
            $lookup: {
                from: "subRegion",
                localField: "saleSubRegionCode_data",
                foreignField: "code",
                as: "subRegionData"
            }
        },
        {
            $unwind: "$subRegionData"
        },
        {
            $match: {               
                $and: [{
                    saleSubRegionCode_data: {
                    $eq: subRegion
                    }
                }]
                }
        },
        {
            "$project": {

            "regionCode": "$regionCode_key2",
            "subRegion": "$saleSubRegionCode_data",
            "regionNameEn": "$regionData.nameEn",
            "regionNameTh": "$regionData.nameTh",
            "subRegionNameTh": "$subRegionData.nameTh",
            "subRegionNameEn": "$subRegionData.nameEn"
            }
        },
        { 
            $limit : 1 
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

        ret.data = result;
        res.json(ret);
    });
};

exports.getSapSalesArea = function (req, res) {
    logger.info('SAP_MAPPING_REGION :' +  JSON.stringify(req.query));
    filter =  req.query
    var condition = [];
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };

    if (filter.provinceCode_key0 != undefined && filter.provinceCode_key0 != null > 0) {
        var provinceCode_key0 = filter.provinceCode_key0.split(",");
        condition.push({
            provinceCode_key0 : {"$in" : provinceCode_key0 }
        });
    }
    if (filter.regionCode_key2 != undefined && filter.regionCode_key2 != null > 0) {
        var regionCode_key2 = filter.regionCode_key2.split(",");
        condition.push({
            regionCode_key2 : {"$in" : regionCode_key2 }
        });
    }
    if (filter.saleSubRegionCode_data != undefined && filter.saleSubRegionCode_data != null > 0) {
        var saleSubRegionCode_data = filter.saleSubRegionCode_data.split(",");
        condition.push({
            saleSubRegionCode_data : {"$in" : saleSubRegionCode_data }
        });
    }

    try {
        mappingRegionMod.find({
            $and: condition
        }, function (err, result) {
            if (err) {
                logger.error('SAP_MAPPING_REGION :' +  err.message);
                logger.errorStack(err);
                ret.responseCode = 500;
                ret.responseMessage = 'Fail';
                ret.responseDescription = err.message;
                res.json(ret);
                throw err;
            } else {
                if(result.length > 0) {
                    logger.info('SAP_MAPPING_REGION :' +  result.length);
                    ret.data = result;
                    res.json(ret);
                } else {
                    ret.responseCode = 404;
                    ret.responseMessage = 'Data Not Found.';
                    ret.data = result;
                    res.json(ret);
                }
            }            
        });
      
    } catch (error) {
        logger.error('SAP_MAPPING_REGION :' +  err.message);
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        res.json(ret);
    }   
};