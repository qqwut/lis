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

exports.getVatAddressList = function (req, res) {
    var filter = req.query;
    logger.info('Search VAT Address');
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };
    try {
        // var filter = '';
        // if(id){
        //     filter.locationId = id;
        // }
        // if(req.params.companyAbbrev){
        //     filter.companyAbbrev = req.params.vatBranchNo;
        // }
        // if(req.params.vatBranchNo){
        //     filter.vatBranchNo = req.params.vatBranchNo;
        // }

        // if(req.query.companyAbbr && req.query.vatBranchNo){
        //     filter = filter+'(companyAbbr'+'='+req.query.companyAbbr+')'+'(vatBranchNo'+'='+req.query.vatBranchNo+')';
        // }    
        // if(req.params.companyAbbrev && req.params.vatBranchNo){
        //     filter = filter+'(companyAbbr'+'='+req.params.companyAbbrev+')'+'(vatBranchNo'+'='+req.params.vatBranchNo+')';
        // }    
        // else{
        //     ret.responseCode = 500;
        //     ret.responseMessage = 'Parameter missing';
        //     // ret.responseDescription = error.message;
        //     return res.json(ret);
        // }
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        //var uri = cfg.service.PANDORA.URI+'/phxPartner/v1/vatAddress/list.json?filter=(&'+filter+')'
        var uri = cfg.service.PANDORA.URI+PREFIX +'/vatAddress/list.json?filter=' + queryStr;
            logger.info('Search VAT Address success ');
            // var uri = cfg.service.PANDORA.URI + '/phxPartner/v1/createLocation.json';      
            // var data  = {data: result};
            logger.info('get to uri :: ' + uri);
            // logger.info('get body :: ' + data);
            return clientHttp.get(uri,{
                service: 'phxpartners-be',
                callService: 'SEARCH_VAT_ADDRESS',
                reqId: req.id
            }).then(function(response) {
                if(response.resultCode == '20000'){
                    logger.info('response :: ' + JSON.stringify(response));
                    ret.resultData = response.resultData.vatAddress;
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
        return res.json(ret);
    }
};

exports.putVatAddressList = function (req, res) { 
    logger.info('api put updvatAddress');
    var data = req.body;
    var filter = {};
    filter =  req.query;
    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI+PREFIX + '/vatAddress/list.json?filter=' + queryStr;
        logger.info('PUT :: ' + uri);
        return clientHttp.put(uri, data, {
            service: 'phxpartners-be',
            callService: 'EDIT_VAT_ADDRESS',
            reqId: req.id
        }).then(function (response) {
            logger.info('response :: ' + JSON.stringify(response));
            if (parseInt(response.resultCode) == 40301) {
                ret.responseCode = 403;
                ret.responseMessage = response.moreInfo;
                ret.responseDescription = response.resultDescription;
                ret.data = response.resultData;
                res.json(ret);
                return;
            }else if (parseInt(response.resultCode) != 20000) { 
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = response.moreInfo;
                ret.responseDescription = response.resultDescription;
                res.json(ret);
            }else {
                ret.responseCode = 200;
                ret.responseDescription = 'Success';
                res.json(ret);
            }
           
            
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

