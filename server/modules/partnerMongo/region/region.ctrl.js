var fs = require('fs');
const path = require('path');
var moment = require('moment');
var _ = require('lodash');
var region = require('../../../model/region.js');
// var companyMod = require('../../../model/company.js');
// var userGroupMod = require('../../../model/userGroup.js');
var logger = require('../../../utils/logger');
var mappingRegionMod = require('../../../model/mappingRegion.js');
exports.getRegionList = function (req, res) {
    logger.info('get Region list');
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };

    var filter = {};//{'lovType_data': 'SHOP_AREA'};
    // var userGroup = req.query.usergroup;
    // var status = req.query.status;
    // filter.status = {
    //     $ne: "DELETED"
    // };
    // if (status) {
    //     filter.status.$eq = status.toUpperCase();
    // }

    region
    .find(filter, null, {
        // sort: {
        //     createdDate: -1
        // }
    }).select(['-_id','code','nameTh','nameEn']).exec( function (err, result) {
        if (err) {
            console.error(err);
            ret.responseCode = 500;
            ret.responseMessage = 'Fail';
            ret.responseDescription = err.message;
            res.json(ret);
            throw err;
        }
        logger.info('get Region list size :: ' + result.length);
        ret.data = result;
        // ret.data = result.map(function(res){
        //     return res.toAliasedFieldsObject();
        // });
        res.json(ret);
    });
};

exports.getRegion = function (req, res) {
    logger.info('get region data');
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };

    var filter = {};
    var provinceCode = req.params.provinceCode;

    var condition = [];
    if (provinceCode && provinceCode.length > 0) {
        condition.push({
            provinceCode_key0: {
                $eq: provinceCode
            }
        });
    } else {
        ret.responseCode = 400;
        ret.responseMessage = 'Bad Request';
        res.json(ret);
        return;
    }

    mappingRegionMod.aggregate([{
            $match: {
                $and: condition
            }
        },
        {
            "$project": {
                'subRegionCode': '$saleSubRegionCode_data'
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

        ret.data = result;
        res.json(ret);
    });
};
