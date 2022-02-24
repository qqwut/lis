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

exports.getfinancialList = function (req, res) {
    logger.info('Api get bankmasterinfo');
    var filter = req.query || {};
    var bankname = filter.bankname;
    var branchname = filter.branchName; 

    if(bankname){
        filter.bankname = bankname.replace(/${{rep.replaceFirst}}/g , "${{rep.replaceFirst}}").replace(/${{rep.replaceEnd}}/g , "${{rep.replaceEnd}}") ; 
    }
    if(branchname){
        filter.branchName = branchname.replace(/${{rep.replaceFirst}}/g , "${{rep.replaceFirst}}").replace(/${{rep.replaceEnd}}/g , "${{rep.replaceEnd}}") ;
    } 
    logger.debug('filter:' + JSON.stringify(filter));
    var ret = {};
    try {
        filter.groupCode = req.currentUser.userGroup;
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI+PREFIX + '/financial/list.json?filter=' + queryStr;
        logger.info('prepare option to sent request : ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'SEARCH_BANKMASTERLIST',
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
                ret.data = response.resultData.financialList;
                res.json(ret);
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

exports.getfinancialInfo = function (req, res) {
    logger.info('Api get bankmasterinfo');
    var filter = req.query || {};
    
    logger.debug('filter:' + JSON.stringify(filter));
    var ret = {};
    try {
        // filter.groupCode = req.currentUser.userGroup;
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        // /phxPartner/v1/partner/financial/info.json?filter=(&(locationId=1)) 
        var uri = cfg.service.PANDORA.URI+PREFIX + '/financial/info.json?filter=' + queryStr;
        logger.info('prepare option to sent request : ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'SEARCH_BANKMASTERINFO',
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
                ret.data = response.resultData.financialInfo;
                res.json(ret);
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

exports.getfinancialASCInfo = function (req, res) {
    logger.info('Api get bankmasterinfo');
    var filter = req.query || {};
    
    logger.debug('filter:' + JSON.stringify(filter));
    var ret = {};
    try {
        // filter.groupCode = req.currentUser.userGroup;
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        // /phxPartner/v1/partner/financialASC/info.json?filter=(&(locationId=1)) 
        var uri = cfg.service.PANDORA.URI+PREFIX + '/financialASC/info.json?filter=' + queryStr;
        logger.info('prepare option to sent request : ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'SEARCH_BANKMASTERINFO',
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
                ret.data = response.resultData.financialInfo;
                res.json(ret);
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

exports.checkAccount = function (req, res) {
    logger.info('Api get bankmasterinfo');
    var filter = req.query || {};
    
    logger.debug('filter:' + JSON.stringify(filter));
    var ret = {};
    try {
        // filter.groupCode = req.currentUser.userGroup;
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        // /phxPartner/v1/partner/financial/info.json?filter=(&(locationId=1)) 
        var uri = cfg.service.PANDORA.URI+PREFIX + '/financial/checkAccount.json?filter=' + queryStr;
        logger.info('prepare option to sent request : ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'SEARCH_BANK-CHECKACCOUNT',
            reqId: req.id,
        }).then(function (response) {

            logger.info('response  :: ' + response.resultCode + ':' + response.resultDescription);
            if (parseInt(response.resultCode) != 20000) {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = 'Fail';
                ret.responseDescription = response.resultDescription;
                ret.data = response.resultData.accountInfo;
                res.json(ret);
            }else{
                ret.responseCode = 200;
                ret.responseDescription = 'Success';
                ret.data = response.resultData.financialInfo;
                res.json(ret);
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

exports.updFinancialInfo = function (req, res) {
    // logger.info('api PUT finacail:: locationCode['+req.params.locationId+']');
    var filter = req.query;
    // var locationCode = req.params.id;
    var data = req.body; 
    var username = req.currentUser.username;
    var ret = {};

    if( !(data && Array.isArray(data))   ){
        logger.info('Data is null ro Invalid format');
        ret.responseCode = 403
        ret.responseMessage = 'Fail';
        ret.responseDescription = 'Bad request';
        res.json(ret);
        return;
    }
    
    // data.modifiedBy = username;
    data.forEach(function(element) {
        element.modifiedBy = username;
    }, this);     
    // var filter = {};
    // filter.locationId = locationCode;
    var ret = {};
    var dataUpd = { financial : data };
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI+PREFIX + '/financial/info.json?filter=' + queryStr;
        logger.info('METHOD PUT :: ' + uri);
        logger.debug('request data :: ' + JSON.stringify(dataUpd));
        return clientHttp.put(uri, dataUpd, {
            service : 'phxpartners-be' ,
            callService: 'EDIT_LOC_FINACAIL', 
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

exports.checkAccountNo = function (req, res) {
    logger.info('Api get Account Number');
    var filter = req.query || {};
    
    logger.debug('filter:' + JSON.stringify(filter));
    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI+PREFIX + '/financial/checkAccountNo.json?filter=' + queryStr;
        logger.info('prepare option to sent request : ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'GET_ACCOUNT_NO',
            reqId: req.id,
        }).then(function (response) {
            logger.info('response  :: ' + response.resultCode + ':' + response.resultDescription);
            if (parseInt(response.resultCode) != 20000) {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = 'Fail';
                ret.responseDescription = response.resultDescription;
                ret.data = response.resultData;
                res.json(ret);
            }else{
                ret.responseCode = 200;
                ret.responseDescription = 'Success';
                ret.data = response.resultData;
                res.json(ret);
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
}

exports.checkStatusVendor = function (req, res) {
    logger.info('Api Check Status Sap Vendor');
    var filter = req.query || {};
    
    logger.debug('filter:' + JSON.stringify(filter));
    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI+PREFIX + '/financial/checkStatusSapVendor.json?filter=' + queryStr;
        logger.info('prepare option to sent request : ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'CHK_STATUS_SAP_VENDOR',
            reqId: req.id,
        }).then(function (response) {
            logger.info('response  :: ' + response.resultCode + ':' + response.resultDescription);
            if (parseInt(response.resultCode) != 20000) {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = 'Fail';
                ret.responseDescription = response.resultDescription;
                ret.data = response.resultData;
                res.json(ret);
            }else{
                ret.responseCode = 200;
                ret.responseDescription = 'Success';
                ret.data = response.resultData;
                res.json(ret);
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
}

exports.checkWTAddress = function (req, res) {
    logger.info('Api Check WT Address');
    var filter = req.query || {};
    
    logger.debug('filter:' + JSON.stringify(filter));
    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI+PREFIX + '/financial/checkWTAddress.json?filter=' + queryStr;
        logger.info('prepare option to sent request : ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'CHK_WT_ADDRESS',
            reqId: req.id,
        }).then(function (response) {
            logger.info('response  :: ' + response.resultCode + ':' + response.resultDescription);
            if (parseInt(response.resultCode) != 20000) {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = 'Fail';
                ret.responseDescription = response.resultDescription;
                ret.data = response.resultData;
                res.json(ret);
            }else{
                ret.responseCode = 200;
                ret.responseDescription = 'Success';
                ret.data = response.resultData;
                res.json(ret);
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
}

exports.bankInfoHq = function (req, res) {
    logger.info('Api bankInfoHq');
    var filter = req.query || {};
    
    logger.debug('filter:' + JSON.stringify(filter));
    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI+PREFIX + '/financial/bankInfoHq.json?filter=' + queryStr;
        logger.info('prepare option to sent request : ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'CHK_BANK_INFO_HQ',
            reqId: req.id,
        }).then(function (response) {
            logger.info('response  :: ' + response.resultCode + ':' + response.resultDescription);
            if (parseInt(response.resultCode) != 20000) {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = 'Fail';
                ret.responseDescription = response.resultDescription;
                ret.data = response.resultData;
                res.json(ret);
            }else{
                ret.responseCode = 200;
                ret.responseDescription = 'Success';
                ret.data = response.resultData;
                res.json(ret);
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
}
exports.bankInfoHqVendor = function (req, res) {
    logger.info('Api bankInfoHqVendor');
    var filter = req.query || {};
    
    logger.debug('filter:' + JSON.stringify(filter));
    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI+PREFIX + '/financial/bankInfoHqVendor.json?filter=' + queryStr;
        logger.info('prepare option to sent request : ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'BANK_VENDOR_HQ',
            reqId: req.id,
        }).then(function (response) {
            logger.info('response  :: ' + response.resultCode + ':' + response.resultDescription);
            if (parseInt(response.resultCode) != 20000) {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = 'Fail';
                ret.responseDescription = response.resultDescription;
                ret.data = response.resultData;
                res.json(ret);
            }else{
                ret.responseCode = 200;
                ret.responseDescription = 'Success';
                ret.data = response.resultData;
                res.json(ret);
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
}
exports.checkBankActive = function (req, res) {
    logger.info('Api checkBankActive');
    var filter = req.query || {};
    
    logger.debug('filter:' + JSON.stringify(filter));
    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI+PREFIX + '/financial/checkBankActive.json?filter=' + queryStr;
        logger.info('prepare option to sent request : ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'CHK_BANK_ACTIVE',
            reqId: req.id,
        }).then(function (response) {
            logger.info('response  :: ' + response.resultCode + ':' + response.resultDescription);
            if (parseInt(response.resultCode) != 20000) {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = 'Fail';
                ret.responseDescription = response.resultDescription;
                ret.data = response.resultData;
                res.json(ret);
            }else{
                ret.responseCode = 200;
                ret.responseDescription = 'Success';
                ret.data = response.resultData;
                res.json(ret);
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
}

exports.checkSapVendor = function (req, res) {
    logger.info('Api checkSapVendor');
    var filter = req.query || {};
    
    logger.debug('filter:' + JSON.stringify(filter));
    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI+PREFIX + '/financial/checkSapVendor.json?filter=' + queryStr;
        logger.info('prepare option to sent request : ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'CHK_SAP_VENDOR',
            reqId: req.id,
        }).then(function (response) {
            logger.info('response  :: ' + response.resultCode + ':' + response.resultDescription);
            if (parseInt(response.resultCode) != 20000) {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = 'Fail';
                ret.responseDescription = response.resultDescription;
                ret.data = response.resultData;
                res.json(ret);
            }else{
                ret.responseCode = 200;
                ret.responseDescription = 'Success';
                ret.data = response.resultData;
                res.json(ret);
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
}

exports.checkBankRequire = function (req, res) {
    logger.info('Api checkBankRequire');
    var filter = req.query || {};
    
    logger.debug('filter:' + JSON.stringify(filter));
    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI+PREFIX + '/financial/checkBankRequire.json?filter=' + queryStr;
        logger.info('prepare option to sent request : ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'CHK_BANK_REQUIRE',
            reqId: req.id,
        }).then(function (response) {
            logger.info('response  :: ' + response.resultCode + ':' + response.resultDescription);
            if (parseInt(response.resultCode) != 20000) {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = 'Fail';
                ret.responseDescription = response.resultDescription;
                ret.data = response.resultData;
                res.json(ret);
            }else{
                ret.responseCode = 200;
                ret.responseDescription = 'Success';
                ret.data = response.resultData;
                res.json(ret);
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
}
