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
var lov = require('../../../model/lov.js');

exports.getLovCriteria = function (req, res) {
    //var lov = req.query.lov;
    var filter = {};
    filter =  req.query
    console.log(req.query);
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };
    try {
        lov.find(filter,null,{
            sort: {
                createdDate: -1
            }
        }, function (err, result) {
            if (err) {
                logger.errorStack(err);
                ret.responseCode = 500;
                ret.responseMessage = 'Fail';
                ret.responseDescription = err.message;
                res.json(ret);
                throw err;
            }else{
                logger.info('get draft lov list size :: ' + result.length);
                ret.data = result;
                res.json(ret);
            }
            
        });
      
    } catch (error) {
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        res.json(ret);
    }
};

exports.findLovCriteria = function (req, res) {
    
    logger.info('AUTHEN_FIELD :' +  JSON.stringify(req.query));
    filter =  req.query
    var condition = [];
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };
     /* ============================== [FILTER CONDITION : "AND" ] ================================**/
     // OR CONDITION
   
    if (filter.activeFlg_key1 != undefined && filter.activeFlg_key1 != null > 0){
        var data_activeFlg_key1 = filter.activeFlg_key1.split(",");
        condition.push({
            activeFlg_key1 : {"$in" : data_activeFlg_key1 }
        });
    }

    if (filter.lovType_key2 != undefined && filter.lovType_key2 != null > 0){
        var data_lovType_key2 = filter.lovType_key2.split(",");
        condition.push({ 
            lovType_key2 : {"$in" : data_lovType_key2 }
        });
    }

    if (filter.lovVal01_data != undefined && filter.lovVal01_data != null > 0){
        var data_lovVal01_data = filter.lovVal01_data.split(",");
        condition.push({ 
            lovVal01_data : {"$in" : data_lovVal01_data }
        });
    }

    if (filter.lovName_data != undefined && filter.lovName_data != null > 0){
        var data_lovName_data = filter.lovName_data.split(",");
        condition.push({
            lovName_data : {"$in" : data_lovName_data }
        });
    }

    if (filter.lovId_key3 != undefined && filter.lovId_key3 != null > 0){
        var data_lovId_key3 = filter.lovId_key3.split(",");
        condition.push({  
            lovId_key3 : {"$in" : data_lovId_key3 }
        });
    }

    if (filter.lovCode_key0 != undefined && filter.lovCode_key0 != null > 0){
        var data_lovCode_key0 = filter.lovCode_key0.split(",");
        condition.push({ 
            lovCode_key0 : {"$in" : data_lovCode_key0 }
        });
    }

    if (filter.lovVal12_data != undefined && filter.lovVal12_data != null > 0){
        var data_lovVal12_data = filter.lovVal12_data.split(",");
        condition.push({  
            lovVal12_data : {"$in" : data_lovVal12_data }
        });
    }
    

    try {
        lov.find( {
            $and: condition
        }, function (err, result) {
            if (err) {
                logger.error('FIND_LOV :' +  err.message);
                logger.errorStack(err);
                ret.responseCode = 500;
                ret.responseMessage = 'Fail';
                ret.responseDescription = err.message;
                res.json(ret);
                throw err;
            }else{
                logger.info('FIND_LOV :' +  result.length);
                ret.data = result;
                res.json(ret);
            }
            
        });
      
    } catch (error) {
        logger.error('FIND_LOV :' +  err.message);
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        res.json(ret);
    }
};


