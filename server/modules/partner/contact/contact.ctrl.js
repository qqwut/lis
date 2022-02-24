var fs = require('fs');
const path = require('path');
var moment = require('moment');
var _ = require('lodash');
var utils = require('../../../utils/common.js');
var env = process.env.NODE_ENV || 'development';
var cfg = require('../../../config/config.js');
var clientHttp = require('../../../connector/http-connector.js');
var utils = require('../../../utils/common.js');
var logger = require('../../../utils/logger');

const PREFIX = cfg.service.PANDORA.PREFIX

exports.getContactList = function (req, res) {
    var filter = req.query;
    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI+PREFIX + '/contact/list.json?filter=' + queryStr;
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
            ret.data = response.resultData.contact;
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
    var filter = req.query;
    // var locationCode = req.params.id;
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
    // var filter = {};
    // filter.locationId = locationCode;
    var ret = {};
    var dataUpd = { contact : data };
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI+PREFIX + '/contact/info.json?filter=' + queryStr;
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
                ret.responseMessage = response.moreInfo;
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
}

exports.getCompanyContact = function (req, res) {
    var companyId = req.query.companyId;
    var partyTypeCode = req.query.partyTypeCode;

    var filter = {};
    filter.companyId = companyId;
    filter.partyTypeCode = partyTypeCode;
    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI+PREFIX + '/contact/list.json?filter=' + queryStr;
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


exports.updCompanyContact = function (req, res) {
    var companyId = req.query.companyId;
    var partyTypeCode = req.query.partyTypeCode;

    logger.info('api PUT Company contact:: CompanyId['+companyId+']');

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
    filter.companyId = companyId;
    filter.partyTypeCode = partyTypeCode;
    
    var ret = {};
    var dataUpd = { contact : data };
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI+PREFIX + '/contact/info.json?filter=' + queryStr;
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
