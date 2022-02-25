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
var subRegion = require('../../../model/subRegion.js');
var dataLocationDummy = [];
var testDummyData = cfg.mockup_data ? parseInt(cfg.mockup_data) : 0;

exports.getSubRegionList = function (req, res) {
    logger.info('get SubRegion list');
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

    subRegion
    .find(filter, null, {
        // sort: {
        //     createdDate: -1
        // }
    }).select(['-_id','code','nameTh','nameEn','region','retailShop']).exec( function (err, result) {
        if (err) {
            console.error(err);
            ret.responseCode = 500;
            ret.responseMessage = 'Fail';
            ret.responseDescription = err.message;
            res.json(ret);
            throw err;
        }
        logger.info('get SubRegion list size :: ' + result.length);
        ret.data = result;
        // ret.data = result.map(function(res){
        //     return res.toAliasedFieldsObject();
        // });
        res.json(ret);
    });
};

exports.getSubRegion = function (req, res) {
    var userGroup = req.currentUser ? req.currentUser.userGroup : null;
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
        // condition.push({
        //     groupName_data : {
        //         $in: userGroup
        //     }
        // });
    }


    userGroupMod.aggregate([{
            $match: condition
        },
        // {
        //     $group: {
        //         _id: "$distChnCode_key1",
        //         retail : "$retailShop_data",
        //         subRegion : "$saleSubRegionCode_data"
        //         // retail: {
        //         //     $addToSet: {
        //         //         code: "$retailShop_data"
        //         //     }

        //         // },
        //         // subRegion: {
        //         //     $addToSet: {
        //         //         code: "$saleSubRegionCode_data"
        //         //     }
        //         // }
        //     }
        // },
        {
            $project: {
                // _id: 1,
                retail: "$retailShop_data",
                subRegion: "$saleSubRegionCode_data"
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
        if (result) {
            var retailArr = [];
            var subRegionArr = [];
            var condSubRegion = false;
            var groupData =  _.uniqBy( result , function (item){
                return item.retail+'|'+item.subRegion;
            })

            for (var i = 0; i < groupData.length; i++) {
                var ugItem = groupData[i];
                // var foundCon = false;
                if(ugItem.retail == '' && ugItem.subRegion == '' ){
                    condSubRegion = true;
                    break;
                }else{
                    if(ugItem.retail && ugItem.retail.length > 0){
                        retailArr.push(ugItem.retail);
                    }
                    if(ugItem.subRegion && ugItem.subRegion.length > 0){
                        subRegionArr.push(ugItem.subRegion);
                    }
                }

                // for (var j = 0; j < ugItem.retail.length; j++) {

                //     if (ugItem.retail[j].code == "") {
                //         foundCon = true;
                //         //break;
                //     } else {
                //         if (retailArr.indexOf(ugItem.retail[j].code) == -1) {
                //             retailArr.push(ugItem.retail[j].code);
                //         }
                //     }

                // }
                // if (foundCon) {
                //     for (var j = 0; j < ugItem.subRegion.length; j++) {
                //         if (ugItem.subRegion[j].code == "") {
                //             condSubRegion = true;
                //             break;
                //         }
                //         if (subRegionArr.indexOf(ugItem.subRegion[j].code) == -1) {
                //             subRegionArr.push(ugItem.subRegion[j].code);
                //         }
                //     }
                // }
                // if (condSubRegion) break;
            }

            var ret = {
                responseCode: 200,
                responseMessage: 'Success'
            };

            if (condSubRegion) {
                var filter = {};
                subRegionMod.find(filter, null, {
                    // sort: {
                    //     createdDate: -1
                    // }
                }).select(['-_id', 'code', 'nameTh', 'nameEn', 'region', 'retailShop']).exec(function (err, result) {
                    if (err) {
                        console.error(err);
                        ret.responseCode = 500;
                        ret.responseMessage = 'Fail';
                        ret.responseDescription = err.message;
                        res.json(ret);
                        throw err;
                    }
                    logger.info('get SubRegion list size :: ' + result.length);
                    ret.data = result;
                    res.json(ret);
                });
            } else {

                var filterSg = [];
                if (retailArr.length > 0) {
                    filterSg.push({
                        retailShop: {
                            $in: retailArr
                        }
                    });
                }
                if (subRegionArr.length > 0) {
                    filterSg.push({
                        code: {
                            $in: subRegionArr
                        }
                    });
                }
                subRegionMod.aggregate([{
                        $match: {
                            $or: filterSg
                        }
                    },
                    {
                        '$project': {
                            '_id': 0,
                            'code': 1,
                            'nameTh': 1,
                            'nameEn': 1,
                            'region': 1,
                            'retailShop': 1
                        }
                    }
                ], function (err, result) {
                    if (err) {
                        console.error(err);
                        ret.responseCode = 500;
                        ret.responseMessage = 'Fail';
                        ret.responseDescription = err.message;
                        res.json(ret);
                        throw err;
                    }
                    logger.info('get SubRegion list size :: ' + result.length);
                    ret.data = result;
                    res.json(ret);
                });
            }

            return;
        }

        res.json({
            responseCode: 404,
            responseMessage: 'Not found'
        });
        return;


    });



}
