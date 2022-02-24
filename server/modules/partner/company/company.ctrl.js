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
var rep = require('../../../config/replace.js');

const PREFIX = cfg.service.PANDORA.PREFIX

exports.searchCompany = function (req, res) {
    logger.info('Api search location');
    var filter = req.body || {};
    var nameTh = filter.nameTh;
    var nameEn = filter.nameEn; 

    if(nameTh){
        filter.nameTh = nameTh.replace(/${{rep.replaceFirst}}/g, "${{rep.replaceTwoBsFirst}}").replace(/${{rep.replaceEnd}}/g, "${{rep.replaceTwoBsEnd}}"); 
    }
    if(nameEn){
        filter.nameEn = nameEn.replace(/${{rep.replaceFirst}}/g, "${{rep.replaceTwoBsFirst}}").replace(/${{rep.replaceEnd}}/g, "${{rep.replaceTwoBsEnd}}");
    } 
    logger.debug('filter:' + JSON.stringify(filter));
    var ret = {};
   try {
        filter.groupName = req.currentUser.userGroup;
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI+PREFIX + '/company/companyProfileList.json?filter=' + queryStr;
        // logger.info('GET :: ' + uri);
        logger.info('prepare option to sent request : ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'SEARCH_COMPANY',
            reqId: req.id
        }).then(function (response) {
            logger.info('response  :: ' + response.resultCode + ':' + response.resultDescription);
            if (parseInt(response.resultCode) != 20000) {
                ret.responseCode = (parseInt(parseInt(response.resultCode) / 100)).toString();                
                ret.responseDescription = response.resultDescription;
                ret.responseMoreInfo = response.moreInfo;
                if(ret.responseCode == "404"){
                    ret.responseMoreInfo = 'Data not found';
                }else if(ret.responseCode == "417"){
                    ret.responseMoreInfo = 'Expectation Failed';
                }
                ret.responseData = {};
                res.json(ret);
                return;
            }
            ret.responseCode = '200';
            ret.responseDescription = 'Success';
            ret.responseMoreInfo = 'Success';
            ret.responseData = {company:response.resultData[0].companyProfileList};
            res.json(ret);
        }).catch(function (err) {
            // logger.errorStack(err);
            // RequestError: Error: socket 
            // hang up
            // if (testDummyData > 0 && err.name == 'RequestError') {
            //     ret.responseCode = 200;
            //     ret.responseDescription = 'Success( mock data RequestError )';
            //     ret.data = getLocationDummyData(filter);
            //     res.json(ret);
            //     return;
            // }
            logger.errorStack(err);
            ret.responseCode = 500;
            ret.responseMessage = 'Fail';
            ret.responseDescription = err.message;
            // ret.data = getLocationDummyData();
            res.json(ret);
        });
    } catch (error) {
        logger.errorStack(error);
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        // ret.data = getLocationDummyData();
        res.json(ret);
    }
    // res.json({
    //     resultCode: 20000,
    //     resultDescription: 'Success',
    //     data: dataLocationDummy
    // });
};

exports.generalview = function (req, res) {
    logger.info('Api search location');
    var filter = req.body || {};

    logger.debug('filter:' + JSON.stringify(filter));
    var ret = {};
   try {
        filter.groupName = req.currentUser.userGroup;
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI+PREFIX + '/company/companyInfo.json?filter=' + queryStr;
        // logger.info('GET :: ' + uri);
        logger.info('prepare option to sent request : ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'SEARCH_COMPANY',
            reqId: req.id
        }).then(function (response) {

            logger.info('response  :: ' + response.resultCode + ':' + response.resultDescription);
            if (parseInt(response.resultCode) != 20000) {
                ret.responseCode = (parseInt(parseInt(response.resultCode) / 100)).toString();
                ret.responseDescription = response.resultDescription;
                ret.responseMoreInfo = response.moreInfo;
                if(ret.responseCode == "404"){
                    ret.responseMoreInfo = 'Data not found';
                }else if(ret.responseCode == "417"){
                    ret.responseMoreInfo = 'Expectation Failed';
                }
                ret.responseData = {};
                res.json(ret);
                return;
            }
            ret.responseCode = '200';
            ret.responseDescription = 'Success';
            ret.responseMoreInfo = 'Success';
            ret.responseData = response.resultData[0];
            res.json(ret);
        }).catch(function (err) {
            // logger.errorStack(err);
            // RequestError: Error: socket 
            // hang up
            // if (testDummyData > 0 && err.name == 'RequestError') {
            //     ret.responseCode = 200;
            //     ret.responseDescription = 'Success( mock data RequestError )';
            //     ret.data = getLocationDummyData(filter);
            //     res.json(ret);
            //     return;
            // }
            logger.errorStack(err);
            ret.responseCode = 500;
            ret.responseMessage = 'Fail';
            ret.responseDescription = err.message;
            // ret.data = getLocationDummyData();
            res.json(ret);
        });
    } catch (error) {
        logger.errorStack(error);
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        // ret.data = getLocationDummyData();
        res.json(ret);
    }
    // res.json({
    //     resultCode: 20000,
    //     resultDescription: 'Success',
    //     data: dataLocationDummy
    // });
};

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

exports.createCompany = function (req, res) {
    // console.log(req.id,"------------------------- id --------------------------");
    // console.log(req.currentUser,"------------------------------------- currentUser ----------------------------------------");
    // console.log(req.body,"-------------------------------------- body -------------------------------------------");
    // console.log(req.body.pageGroup,"-------------------------------------- body.pageGroup -------------------------------------------");

    var compData = req.body
    logger.info('api create Company');
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };
    try {
            var uri = cfg.service.PANDORA.URI+PREFIX + '/createCompany.json';
            var data = {
                data: compData
            };
            logger.info('POST :: ' + uri);
            logger.debug('body :: ' + JSON.stringify(data));
            clientHttp.post(uri, data, {
                service: 'phxpartners-be',
                callService: 'CREATE_COMPANY',
                reqId: req.id
            }).then(function (response) {
                logger.info('response :: ' + JSON.stringify(response));
                if (parseInt(response.resultCode) == 20000) {
                    ret.responseCode = 200;
                    ret.responseDescription = response.resultDescription;
                    res.json(ret);
                } else if (parseInt(response.resultCode) == 42410) {
                    ret.responseCode = 424;
                    ret.responseMessage = "Fail";
                    ret.responseDescription = response.resultDescription;
                    res.json(ret);
                } else {
                    ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                    ret.userMessage = response.userMessage;
                    ret.responseMessage = "Fail";
                    ret.responseDescription = response.resultDescription;
                    res.json(ret);
                }
            }).catch(function (err) {
                logger.error(err)
                ret.responseCode = 500;
                ret.responseMessage = 'Fail';
                ret.responseDescription = err.message;
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

exports.getCompanyListInfo = function (req, res) {
    var result = {
        responseCode: '',
        responseMessage: '',
        responseDescription: []
    }
    var query = req.query;
    console.log('================================= start kob getCompanyListInfo =======================================')
    console.log(query)
    console.log('================================= end kob getCompanyListInfo=======================================')

    var filter = req.body || {};
    logger.debug('filter:' + JSON.stringify(filter));
    var ret = {};
    try {
        // console.log('================================= kob trycatch try =======================================')
        var queryStr = utils.getSDFFilter2QueryStr(null, query);
        var uri = cfg.service.PANDORA.URI+PREFIX + '/company/list.json?filter=' + queryStr;
        logger.info('prepare option to sent request : ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'SEARCH_LOCATION',
            reqId: req.id,
        }).then(function (response) {
            // console.log('================================= kob then =======================================')
            logger.info('response  :: ' + response.resultCode + ':' + response.resultDescription);
            if (parseInt(response.resultCode) != 20000) {
                // console.log('================================= kob if =======================================')
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = 'Fail';
                ret.responseDescription = response.resultDescription;
                res.json(ret);
            }else{
                console.log('================================= kob else getCompanyListInfo=======================================')
                ret.responseCode = 200;
                ret.responseDescription = 'Success';
                ret.data = response.resultData.companyList;
                
                res.json(ret);
                console.log(response.resultData)
                console.log('================================= kob else getCompanyListInfo=======================================')
            }
           
        }).catch(function (err) {
            // console.log('================================= kob catch =======================================')
            logger.errorStack(err);
            ret.responseCode = 500;
            ret.responseMessage = 'Fail';
            ret.responseDescription = err.message;
            res.json(ret);
        });
    } catch (error) {
        // console.log('================================= kob trycatch catch =======================================')
        logger.errorStack(error);
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        res.json(ret);
    }
};

exports.searchCompanyList = function (req, res) {
    var result = {
        responseCode: '',
        responseMessage: '',
        responseDescription: []
    }
    var query = req.query;
    console.log('========================================================================')
    console.log(query)
    console.log('========================================================================')

    var filter = req.query
    logger.debug('filter:' + JSON.stringify(filter));
    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, query);
        var uri = cfg.service.PANDORA.URI+PREFIX + '/company/search/list.json?filter=' + queryStr;
        logger.info('prepare option to sent request : ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'SEARCH_COMPANY_LIST_INFO',
            reqId: req.id,
        }).then(function (response) {
            logger.info('response  :: ' + response.resultCode + ':' + response.resultDescription);
            if (parseInt(response.resultCode) != 20000) {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = 'Fail';
                ret.responseDescription = response.resultDescription;
                res.json(ret);
            }else{
                ret.responseCode = 200;
                ret.responseDescription = 'Success';
                ret.data = response.resultData.srfpCompanyList;
                
                res.json(ret);
                console.log(response.resultData)
            }
           
        }).catch(function (err) {
            logger.errorStack(err);
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

exports.getCompanyInfo = function (req, res) {
    var result = {
        responseCode: '',
        responseMessage: '',
        responseDescription: []
    }
    var query = req.query;
    console.log('========================================================================')
    console.log(query)
    console.log('========================================================================')

    var filter = req.query
    logger.debug('filter:' + JSON.stringify(filter));
    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, query);
        var uri = cfg.service.PANDORA.URI+PREFIX + '/company/info.json?filter=' + queryStr;
        logger.info('prepare option to sent request : ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'GET_COMPANY_INFO',
            reqId: req.id,
        }).then(function (response) {
            logger.info('response  :: ' + response.resultCode + ':' + response.resultDescription);
            if (parseInt(response.resultCode) != 20000) {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = 'Fail';
                ret.responseDescription = response.resultDescription;
                res.json(ret);
            }else{
                ret.responseCode = 200;
                ret.responseDescription = 'Success';
                ret.data = response.resultData.srfpCompanyInfo;
                
                res.json(ret);
                console.log(response.resultData)
            }
           
        }).catch(function (err) {
            logger.errorStack(err);
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

exports.putCompanyInfo = function (req, res) {
    logger.info('api PUT COMPANY INFO:: COMPANYID['+req.params.companyId+']');
    var filter = req.query;
    var data = req.body;
    var username = req.currentUser.username;
    
    data.modifiedBy = username;
    var ret = {};
    var dataUpd = { companyInfo : data };
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI+PREFIX + '/company/info.json?filter=' + queryStr;
        logger.info('METHOD PUT :: ' + uri);
        logger.debug('request data :: ' + JSON.stringify(dataUpd));
        return clientHttp.put(uri, dataUpd, {
            service : 'phxpartners-be' ,
            callService: 'PUT_COMPANY_INFO', 
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