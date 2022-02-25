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
var bankMasterInfo = require('../../../model/bankInfo.js');

exports.getBankinfo = function (req, res) {
    logger.info('Search Bank Info');
    var filter = {};
    filter =  req.query
    var condition = []
    condition.push({  
        activeFlg : { "$eq" : 'Y' }
    });
    console.log(req.query);
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };
    var pipeline = [{
        "key": {
            "bankCode": true,
            "branchCode": true
        },
        "initial": {},
        "reduce": function(obj, prev) {}
    }]
    try {
        bankMasterInfo
        .find({
            $and: condition
        },null,{

        }, function (err, result) {
            if (err) {
                logger.errorStack(err);
                ret.responseCode = 500;
                ret.responseMessage = 'Fail';
                ret.responseDescription = err.message;
                res.json(ret);
                throw err;
            }else{
                logger.info('get Bank Info list size :: ' + result.length);
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

exports.getBankinfoCode = function (req, res) {
    logger.info('Search Bank Info Code');
    var filter = {};
    var name = '';
    filter =  req.query
    if(filter.branchCode != undefined){
        name = filter.branchCode;
    }
    if(filter.bankCode != undefined){
        name = filter.bankCode;
    }
    console.log(req.query);
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };
    try {
        bankMasterInfo
        .find().distinct(name, function (err, result) {
            if (err) {
                logger.errorStack(err);
                ret.responseCode = 500;
                ret.responseMessage = 'Fail';
                ret.responseDescription = err.message;
                res.json(ret);
                throw err;
            }else{
                logger.info('get Bank Info list size :: ' + result.length);
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
