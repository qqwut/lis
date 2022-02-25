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
var rep = require('../../../config/replace.js');
const PREFIX = cfg.service.PANDORA.PREFIX
exports.getCompany = function (req, res) {
    logger.info('chk dup name');
    var filter={}; 
    console.log(req.query);
    var companyAbbr = req.query.companyAbbr;
    var nameTh = req.query.nameTh;
    var nameEn = req.query.nameEn; 

    if(nameTh){
        filter.nameTh = nameTh.replace(/${{rep.replaceFirst}}/g, "${{rep.replaceTwoBsFirst}}").replace(/${{rep.replaceEnd}}/g, "${{rep.replaceTwoBsEnd}}");
    }
    if(nameEn){
        filter.nameEn = nameEn.replace(/${{rep.replaceFirst}}/g, "${{rep.replaceTwoBsFirst}}").replace(/${{rep.replaceEnd}}/g, "${{rep.replaceTwoBsEnd}}");
    } 
    if(companyAbbr){
        filter.companyAbbr = companyAbbr
    }
    console.log(filter);
    var ret = {
        responseCode : 200,
        responseDescription : 'Success',
        responseMessage : '',
        responseData : []
    };
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI+PREFIX + '/company/chk-duplicate.json?filter=' + queryStr;
        logger.info('GET :: ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'CHECK_DUP_COMPANY',
            reqId: req.id
        }).then(function (response) {
            logger.info('response :: ' + JSON.stringify(response));
            if (parseInt(response.resultCode) == 20000) {
                ret.responseCode = 200;
                ret.responseData = response.resultData;
                res.json(ret);
            } else {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseDescription = response.resultDescription;
                res.json(ret);
            }
        }).catch(function (err) {
            ret.responseCode = 500;
            ret.responseMessage = 'Fail';
            ret.responseDescription = error.message;
            res.json(ret);
        });
    } catch (error) {
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        res.json(ret);
    }
}

exports.getCompanyEmail = function (req, res) {
    logger.info('chk dup email');
    var filter={}; 
    console.log(req.query);
    //var partyTypeCode = req.query.partyTypeCode;
    var socialType = req.query.socialType;
    var socialName = req.query.socialName; 

    /* if(partyTypeCode){
        filter.partyTypeCode = partyTypeCode
    } */
    if(socialType){
        filter.socialType = socialType
    } 
    if(socialName){
        filter.socialName = socialName
    }
    console.log(filter);
    var ret = {
        responseCode : 200,
        responseDescription : 'Success',
        responseMessage : '',
        responseData : []
    };
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI+PREFIX + '/company/chk-duplicate-email.json?filter=' + queryStr;
        logger.info('GET :: ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'CHECK_DUP_EMAIL',
            reqId: req.id
        }).then(function (response) {
            logger.info('response :: ' + JSON.stringify(response));
            if (parseInt(response.resultCode) == 20000) {
                ret.responseCode = 200;
                ret.responseData = response.resultData;
                res.json(ret);
            } else {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseDescription = response.resultDescription;
                res.json(ret);
            }
        }).catch(function (err) {
            ret.responseCode = 500;
            ret.responseMessage = 'Fail';
            ret.responseDescription = error.message;
            res.json(ret);
        });
    } catch (error) {
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        res.json(ret);
    }
}
