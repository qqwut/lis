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


exports.getLocationContact = function (req, res) {
    logger.info('api get location contact :: locationCode['+req.params.id+']');
    var locationCode = req.params.id;
    var filter = {};
    filter.locationCode = locationCode;
    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + '/phxPartner/v1/contact/list.json?filter=' + queryStr;
        logger.info('GET BE URI:: ' + uri);
        return clientHttp.get(uri, {
            service : 'phxpartners-be' ,
            callService: 'VIEW_LOC_CONTACT',
            reqId : req.id
        }).then(function (response) {
            logger.info('response :: ' + JSON.stringify(response));
            if (parseInt(response.resultCode) != 20000) {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = 'Fail';
                ret.responseDescription = response.resultDescription;
                res.json(ret);
                return;
            }
            ret.responseCode = 200;
            ret.responseDescription = 'Success';
            ret.data = response.resultData[0].contactPerson;
            res.json(ret);
        }).catch(function (reason) {
            logger.error('error get location address :: '+reason.message);
            ret.responseCode = 500;
            ret.responseMessage = 'Fail';
            ret.responseDescription = reason.message;
            res.json(ret);
        });
    } catch (error) {
        logger.errorStack(error)
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        res.json(ret);
    }
};

exports.updLocationContact = function (req, res) {
    logger.info('api PUT location contact:: locationCode['+req.params.id+']');
    var locationCode = req.params.id;
    var data = req.body;
    var username = req.currentUser.username;
    if(!(data && Array.isArray(data)) ){
        logger.info('Data is nul ro Invalid format');
        ret.responseCode = 403
        ret.responseMessage = 'Fail';
        ret.responseDescription = 'Bad request';
        res.json(ret);
        return;
    }
    data.forEach(function(element) {
        element.modifiedBy = username;
    }, this);
    var filter = {};
    filter.locationCode = locationCode;
    var ret = {};
    var dataUpd = { contact : data };
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + '/phxPartner/v1/contact/info.json?filter=' + queryStr;
        logger.info('METHOD PUT :: ' + uri);
        logger.debug('request data :: ' + JSON.stringify(dataUpd));
        return clientHttp.put(uri, dataUpd, {
            service : 'phxpartners-be' ,
            callService: 'EDIT_LOC_CONTACT', 
            reqId : req.id
        }).then(function (response) {
            logger.info('response :: ' + JSON.stringify(response));
            if (parseInt(response.resultCode) != 20000) {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = 'Fail';
                ret.responseDescription = response.resultDescription;
                res.json(ret);
                return;
            }
            ret.responseCode = 200;
            ret.responseDescription = 'Success';
            res.json(ret);
        }).catch(function (err) {
            logger.error('error request :: '+err.message);
            ret.responseCode = 500;
            ret.responseMessage = 'Fail';
            ret.responseDescription = err.message;
            res.json(ret);
        });

    } catch (error) {
        logger.errorStack(error);
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        res.json(ret);
    }
};
