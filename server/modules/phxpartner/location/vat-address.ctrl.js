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

var testDummyData = cfg.mockup_data ? parseInt(cfg.mockup_data) : 0;

exports.getLocationVatAddressInfo = function (req, res) {
    logger.info('api get location vat address info');
    var locationCode = req.params.id;
    var filter = {};
    filter.locationCode = locationCode;
    logger.debug('filter :: '+JSON.stringify(filter));
    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + '/phxPartner/v1/vatAddress/info.json?filter=' + queryStr;
        logger.info('GET :: ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'VIEW_LOC_VATADDR',
            reqId: req.id
        }).then(function (response) {
            logger.info('response :: ' + JSON.stringify(response));
            // if (testDummyData) {
            //     ret.responseCode = 200;
            //     ret.responseMessage = 'Success (Mockup)';
            //     //var locData = getLocationDummyDataByCode(locationCode);
            //     var filePath = path.join(__dirname, '../../../data/locationVatAddressInfo.json');
            //     var dataDummy = utils.readFileDataJson(filePath);

            //     ret.data = dataDummy;
            //     res.json(ret);
            //     return;
            // }
            if (parseInt(response.resultCode) != 20000) {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = 'Fail';
                ret.responseDescription = response.resultDescription;
                res.json(ret);
                return;
            }
            ret.responseCode = 200;
            ret.responseDescription = 'Success';
            ret.data = response.resultData[0].vatAddress;
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

exports.updLocationVatAddressInfo = function (req, res) {
    logger.info('api put location vat address info');
    var locationCode = req.params.id;
    var data = req.body;
    var filter = {};
    filter.locationCode = locationCode;
    logger.debug('filter :: '+JSON.stringify(filter));
    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + '/phxPartner/v1/vatAddress/info.json?filter=' + queryStr;
        logger.info('PUT :: ' + uri);
        return clientHttp.put(uri, data, {
            service: 'phxpartners-be',
            callService: 'EDIT_LOC_VATADDR',
            reqId: req.id
        }).then(function (response) {
            logger.info('response :: ' + JSON.stringify(response));
            if (parseInt(response.resultCode) != 20000) {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = 'Fail';
                ret.responseDescription = response.resultCode == "40313" ? response.userMessage : response.resultDescription;
                res.json(ret);
                return;
            }
            ret.responseCode = 200;
            ret.responseDescription = 'Success';
            res.json(ret);
        }).catch(function (err) {
            logger.error(JSON.stringify(err));
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

exports.getLocationVatAddressProfile = function (req, res) {
    logger.info('api get location vat-address profile');
    var companyAbbr = req.query.companyAbbr;
    var vatBranchNo = req.query.vatBranchNo;
    var filter = {};
    if (companyAbbr) {
        filter.companyAbbr = companyAbbr;
    }
    if (vatBranchNo) {
        filter.vatBranchNo = vatBranchNo;
    }
    logger.debug('filter :: '+JSON.stringify(filter));
    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + '/phxPartner/v1/vatAddress/info.json?filter=' + queryStr;
        logger.info('GET :: ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'SEARCH_VAT_ADDRESS',
            reqId: req.id
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
            ret.data = response.resultData[0].vatAddress;
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