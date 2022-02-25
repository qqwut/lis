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


