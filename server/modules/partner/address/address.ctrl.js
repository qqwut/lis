var fs = require('fs');
const path = require('path');
var moment = require('moment');
var _ = require('lodash');
var utils = require('../../../utils/common.js');
var env = process.env.NODE_ENV || 'development';
var cfg = require('../../../config/config.js');
var clientHttp = require('../../../connector/http-connector.js');
var logger = require('../../../utils/logger');

const PREFIX = cfg.service.PANDORA.PREFIX

exports.getAddressList = function (req, res) {
    var filter = req.query;
    logger.info('API Search Address List');
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };
    try {
        var filter = req.query;
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI+PREFIX + '/address/list.json?filter=' + queryStr;
        logger.info('get address to uri :: ' + uri);
        
        return clientHttp.get(uri).then(function (response) {
            logger.info('get address resultCode  :: ' + (response? response.resultCode+':'+response.resultDescription : ''));
            if (response.resultCode == '20000') {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = 'Success';
                ret.data = response.resultData.address;
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
            return res.json(ret);
        });
    } catch (error) {
        logger.errorStack(error);
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        return res.json(ret);
    }
};

exports.searchAddress = function (req, res) {
    logger.info('API Search Address');
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };
    try {

        var groupName = null ;
        if(req.query.userGroup 
            && req.query.userGroup != undefined 
            && req.query.userGroup != null){

            groupName =  req.query.userGroup.split(",");
        }

        logger.info('userGroup : ' + req.query.userGroup)

        // var groupName =  req.query.userGroup.split(",");
        var filter = req.query;
        filter.userGroup = null;
        filter.groupCode = groupName;
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI+PREFIX + '/address/address.json?filter=' + queryStr;
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
                    ret.resultData = response.resultData.address;
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

exports.putAddressList = function (req, res){
    logger.info('api put updLocationAddress');
    var data = req.body;
    var filter = {};
    filter =  req.query;
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
            if(response.resultCode == 50000){
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = 'Fail';
                if(response.resultData != undefined && response.resultData.length > 0){
                    ret.data = response.resultData[0];
                }
                ret.responseDescription = response.moreInfo;
                res.json(ret);
                return;
            }else if(response.resultCode == 42410){
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = 'Fail';
                if(response.resultData != undefined && response.resultData.length > 0){
                    ret.data = response.resultData[0];
                }
                ret.responseDescription = response.moreInfo;
                res.json(ret);
                return;
            }
            else if (response.resultCode != 20000) {
                ret.responseCode = response.resultCode;
                ret.responseMessage = 'Fail';
                if(response.resultData != undefined && response.resultData.length > 0){
                    ret.data = response.resultData[0];
                }
                ret.responseDescription = response.moreInfo;
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
}




