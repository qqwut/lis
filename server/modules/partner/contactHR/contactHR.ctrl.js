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
var rep = require('../../../config/replace.js');

const PREFIX = cfg.service.PANDORA.PREFIX

exports.getContactHrList = function (req, res) {
    var id = req.params.id;
    logger.info('Search Contact');
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };
    try {
        var filter = req.query;
        // if(req.query.pinCode){
        //     filter = filter+'(pinCode'+'='+req.query.pinCode+')';
        // }
        // if(req.query.fnameTh){
        //     filter = filter+'(fnameTh'+'='+req.query.fnameTh+')';
        // }
        // if(req.query.lnameTh){
        //     filter = filter+'(lnameTh'+'='+req.query.lnameTh+')';
        // }
        // if(req.query.fnameEn){
        //     filter = filter+'(fnameEn'+'='+req.query.fnameEn+')';
        // }
        // if(req.query.lnameEn){
        //     filter = filter+'(lnameEn'+'='+req.query.lnameEn+')';
        // }
        if(filter == ''){
            ret.responseCode = 500;
            ret.responseMessage = 'Fail';
            ret.responseDescription = error.message;
            res.json(ret);
        }
        // var uri = cfg.service.PANDORA.URI_EQX+'/phxPartner/v1/partner/contactHRInfo.json?filter=(|'+filter+')'
        
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI+PREFIX +'/contactHRInfo/list.json?filter=' + queryStr;
            logger.info('Search Contact success ');
            // var uri = cfg.service.PANDORA.URI + '/phxPartner/v1/createLocation.json';      
            // var data  = {data: result};
            logger.info('get to uri :: ' + uri);
            // logger.info('get body :: ' + data);
            return clientHttp.get(uri,{
                service: 'phxpartners-be',
                callService: 'SEARCH_LOC_CONTACT',
                reqId: req.id
            }).then(function(response) {
                logger.info('response :: ' + JSON.stringify(response));
                if(response.resultCode == '20000'){
                    if(response.resultData && response.resultData["contactHR"]){
                        ret.resultData = response.resultData["contactHR"];
                    }
                    return res.json(ret);
                }
                else{
                    ret.responseCode = parseInt(parseInt(response.resultCode)/100);
                    ret.responseMessage = 'Fail';
                    ret.responseDescription = response.resultDescription;
                    return res.json(ret);
                }
            });            

    } catch (error) {
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        res.json(ret);
    }
};

exports.getContactHrOmList = function (req, res) {
    var filter = req.query;
    var ret = {};
    var pinCode = filter.pinCode;
    var fnameTh = filter.fnameTh;
    var lnameTh = filter.lnameTh;
    var fnameEn = filter.fnameEn;
    var lnameEn = filter.lnameEn; 

    if(pinCode != undefined && pinCode.indexOf('*') != -1){
        filter.pinCode = pinCode.replace('${{rep.replaceAsterisk}}', '%');
    }
    if(fnameTh != undefined && fnameTh.indexOf('*') != -1){
        filter.fnameTh = fnameTh.replace('${{rep.replaceAsterisk}}', '%');
    }
    if(lnameTh != undefined && lnameTh.indexOf('*') != -1){
        filter.lnameTh = lnameTh.replace('${{rep.replaceAsterisk}}', '%');
    }
    if(fnameEn != undefined && fnameEn.indexOf('*') != -1){
        filter.fnameEn = fnameEn.replace('${{rep.replaceAsterisk}}', '%');
    }
    if(lnameEn != undefined && lnameEn.indexOf('*') != -1){
        filter.lnameEn = lnameEn.replace('${{rep.replaceAsterisk}}', '%');
    }
    
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI+PREFIX +'/contactHRInfo/getEmployeeForStaffByPin/list.json?filter=' + queryStr;
            logger.info('GET BE URI:: ' + uri);
            return clientHttp.get(uri,{
                service: 'phxpartners-be',
                callService: 'SEARCH_LOC_CONTACT',
                reqId: req.id
            }).then(function (response) {
                logger.info('response :: ' + JSON.stringify(response));
                if(response.resultCode != 20000){
                    ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                    ret.responseMessage = 'Fail';
                    ret.responseDescription = response.resultDescription;
                    res.json(ret);
                    return;
                }
                ret.responseCode = 200;
                ret.responseDescription = 'Success';
                ret.resultData = response.resultData.contactHR;
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
