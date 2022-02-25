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

exports.getOpenHour = function (req, res) {
    logger.info('get open hour data');
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };

    var filter = {};
    var chnSaleCode = req.params.chnSaleCode;
    var shopArea = req.query.shopArea || '';
    var shopType = req.query.shopType || '';

    var condition = [];
    var fieldSel = {
        "$project": {
            'dayOfWeek': "$dayOfWeek_data",
            'timeOpen': "$timeOpen_data",
            'timeClose': "$timeClose_data",
            "shopType": "$shopType_data",
            "shopArea": "$shopArea_data",

        }
    };

    if (chnSaleCode) {
        condition.push({
            chnSalesGrp_data: {
                $eq: chnSaleCode
            }
        });
    } else {
        ret.responseCode = 400;
        ret.responseMessage = 'Bad Request';
        res.json(ret);
        return;
    }

    // if(shopArea)  
    condition.push({
        shopArea_data: {
            $eq: shopArea
        }
    });
    // if(shopType)  
    condition.push({
        shopType_data: {
            $eq: shopType
        }
    });
    openingHoursMod.aggregate([{
            $match: {
                $and: condition
            }
        },
        fieldSel
    ], function (err, result) {
        if (err) {
            res.status(500).json({
                responseCode: 500,
                responseMessage: 'Fail',
                error: err
            });
            return;
        }
        if (result.length > 0) {
            ret.data = result;
            res.json(ret);
            return;
        }
        condition = [];
        condition.push({
            chnSalesGrp_data: {
                $eq: _CONST.OPEN_HOUR_DEFAULT_FLG
            }
        });
        condition.push({
            shopArea_data: {
                $eq: _CONST.OPEN_HOUR_DEFAULT_FLG
            }
        });
        condition.push({
            shopType_data: {
                $eq: _CONST.OPEN_HOUR_DEFAULT_FLG
            }
        });

        openingHoursMod.aggregate([{
                $match: {
                    $and: condition
                }
            },
            fieldSel
        ], function (errDef, resultDef) {
            if (errDef) {
                ret.data = resultDef;
                res.json(ret);
                return;
            }
            ret.data = resultDef;
            res.json(ret);
        });

    });
};