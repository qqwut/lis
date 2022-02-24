var fs = require('fs');
const path = require('path');
var moment = require('moment');
var _ = require('lodash');
var retailShop = require('../../../model/retailShop.js');
// var companyMod = require('../../../model/company.js');
// var userGroupMod = require('../../../model/userGroup.js');
var logger = require('../../../utils/logger');
var userGroupMod = require('../../../model/userGroup.js');

exports.getRetailShopList = function (req, res) {
    logger.info('get Retail Shop list');
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

    retailShop
    .find(filter, null, {
        // sort: {
        //     createdDate: -1
        // }
    }).select(['-_id','code','name']).exec( function (err, result) {
        if (err) {
            console.error(err);
            ret.responseCode = 500;
            ret.responseMessage = 'Fail';
            ret.responseDescription = err.message;
            res.json(ret);
            throw err;
        }
        logger.info('get Retail Shop list size :: ' + result.length);
        ret.data = result;
        // ret.data = result.map(function(res){
        //     return res.toAliasedFieldsObject();
        // });
        res.json(ret);
    });
};

exports.getRetailShopList = function (req, res) {
    logger.info('get location Retail Shop list');
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
    }
   
    userGroupMod.aggregate([{
            $match: condition
        },
        {
            $project: {
                retailShop: "$retailShop_data",
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
        if (result == null) {
            res.json({
                responseCode: 403,
                responseMessage: 'Bad request'
            });
            return;
        }

        var ret = {
            responseCode: 200,
            responseMessage: 'Success'
        };

        var filter = {};
        var retailShopArr = [];
        var showAll = false;
        var groupData =  _.uniqBy( result , function (item){
            return item.retailShop+'|'+item.subRegion;
        })
        // retailShop: "$retailShop_data",
        // subRegion: "$saleSubRegionCode_data"
        groupData.forEach(function (element) {
            if(element["retailShop"] == '' && element["subRegion"] == ''){
                showAll = true;
                retailShopArr = [];
            }
            if(!showAll){
                if (element["retailShop"] && element["retailShop"].length > 0) {
                    retailShopArr.push(element["retailShop"]);
                }
            }
        });
        if (retailShopArr.length > 0) {
            filter.code = {
                $in: retailShopArr
            };
        }
        
       
        retailShop.find(filter, null, {}).select(['-_id', 'code', 'name']).exec(function (err, result) {
            if (err) {
                console.error(err);
                ret.responseCode = 500;
                ret.responseMessage = 'Fail';
                ret.responseDescription = err.message;
                res.json(ret);
                throw err;
            }

            logger.info('get Retail Shop list size :: ' + result.length);
            ret.data = result;
            // ret.data = result.map(function(res){
            //     return res.toAliasedFieldsObject();
            // });
            res.json(ret);
        });

    });

};
