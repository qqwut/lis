var fs = require('fs');
const path = require('path');
var moment = require('moment');
var _ = require('lodash');
var utils = require('../../../utils/common.js');
var env = process.env.NODE_ENV || 'development';
var cfg = require('../../../config/config.js');
var clientHttp = require('../../../connector/http-connector.js');
var utils = require('../../../utils/common.js');
var locationDraftMod = require('../../../model/locationDraft.js');
// var companyMod = require('../../../model/company.js');
// var userGroupMod = require('../../../model/userGroup.js');
// var openingHoursMod = require('../../../model/openingHours.js');
// var mappingRegionMod = require('../../../model/mappingRegion.js');
// var proviceMod = require('../../../model/province.js');
// var subRegionMod = require('../../../model/subRegion.js');
// var zipCodeMod = require('../../../model/zipCode.js');
// var authFieldMod = require('../../../model/authField.js');
const PREFIX = cfg.service.PANDORA.PREFIX

var logger = require('../../../utils/logger');

exports.getAddress = function (req, res) {
    // var id = req.params.id;
    logger.info('API Search Address');
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };
    try {
        var groupName =  req.query.userGroup.split(",");
        var filter = req.query;
        filter.userGroup = null;
        filter.groupName = groupName;
        // if (req.query.userGroup && req.query.country) {
        //     filter = filter + '(groupName' + '=' + req.query.userGroup + ')' + '(country' + '=' + req.query.country + ')';
        // } else {
        //     ret.responseCode = 400;
        //     ret.responseMessage = 'Parameter missing';
        //     // ret.responseDescription = error.message;
        //     return res.json(ret);
        // }
        // if (req.query.houseNo) {
        //     filter = filter + '(houseNo' + '=' + req.query.houseNo + ')';
        // }
        // if (req.query.moo) {
        //     filter = filter + '(moo' + '=' + req.query.moo + ')';
        // }
        // if (req.query.mooban) {
        //     filter = filter + '(mooban' + '=' + req.query.mooban + ')';
        // }
        // if (req.query.building) {
        //     filter = filter + '(building' + '=' + req.query.building + ')';
        // }
        // if (req.query.floor) {
        //     filter = filter + '(floor' + '=' + req.query.floor + ')';
        // }
        // if (req.query.room) {
        //     filter = filter + '(room' + '=' + req.query.room + ')';
        // }
        // if (req.query.soi) {
        //     filter = filter + '(soi' + '=' + req.query.soi + ')';
        // }
        // if (req.query.street) {
        //     filter = filter + '(street' + '=' + req.query.street + ')';
        // }
        // if (req.query.tumbon) {
        //     filter = filter + '(tumbon' + '=' + req.query.tumbon + ')';
        // }
        // if (req.query.amphur) {
        //     filter = filter + '(amphur' + '=' + req.query.amphur + ')';
        // }
        // if (req.query.province) {
        //     filter = filter + '(province' + '=' + req.query.province + ')';
        // }
        // if (req.query.zipCode) {
        //     filter = filter + '(zipCode' + '=' + req.query.zipCode + ')';
        // }
        // if (filter == '') {
        //     ret.responseCode = 400;
        //     ret.responseMessage = 'Parameter missing';
        //     // ret.responseDescription = error.message;
        //     return res.json(ret);
        // }
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI+PREFIX + '/address.json?filter=' + queryStr;
        logger.info('get address to uri :: ' + uri);
        // logger.debug('get body :: ' + JSON.stringify(data));
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'SEARCH_LOC_ADDRESS',
            reqId: req.id
        }).then(function (response) {
            logger.info('get address resultCode  :: ' + (response? response.resultCode+':'+response.resultDescription : ''));
            if (response.resultCode == '20000') {
                if (response.resultData) {
                    logger.info('resultData size  :: '  + (response.resultData ? response.resultData.length : '') );
                    ret.resultData = response.resultData;
                }
                return res.json(ret);
            } else {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = 'Fail';
                ret.responseDescription = response.resultDescription;
                return res.json(ret);
            }
        }).catch(function (err) {
            logger.error('error request Search Address :: ', err);
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
        return res.json(ret);
    }
};


exports.getLocationAddress = function (req, res) {
    logger.info('api get location address');
    var locationCode = req.params.id;
    var filter = {};
    filter.locationCode = locationCode;

    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI+PREFIX + '/address/list.json?filter=' + queryStr;
        logger.info('GET :: ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'VIEW_LOC_ADDRESS',
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
            ret.data = response.resultData[0].address;
            res.json(ret);
        }).catch(function (err) {
            logger.error('error get location address :: ', err);
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

exports.updLocationAddress = function (req, res) {
    logger.info('api put updLocationAddress');
    var locationCode = req.params.id;
    var data = req.body;
    var filter = {};
    filter.locationCode = locationCode;
    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI+PREFIX + '/address/list.json?filter=' + queryStr;
        logger.info('PUT :: ' + uri);
        return clientHttp.put(uri, data, {
            service: 'phxpartners-be',
            callService: 'EDIT_LOC_ADDRESS',
            reqId: req.id
        }).then(function (response) {
            logger.info('response :: ' + JSON.stringify(response));
            if (parseInt(response.resultCode) != 20000) {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = 'Fail';
                if(response.resultData != undefined && response.resultData.length > 0){
                    ret.data = response.resultData[0];
                }
                ret.responseDescription = response.resultDescription;
                res.json(ret);
                return;
            }
            ret.responseCode = 200;
            ret.responseDescription = 'Success';
            res.json(ret);
        }).catch(function (err) {
            logger.error('error request updLocationAddress :: ', err);
            ret.responseCode = 500;
            ret.responseMessage = 'Fail';
            ret.responseDescription = err.message;
            res.json(ret);
        });
    } catch (error) {
        logger.errorStack(error);
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        res.json(ret);
    }
};