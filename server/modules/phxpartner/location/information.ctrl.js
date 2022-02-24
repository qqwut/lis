var fs = require('fs');
const path = require('path');
var moment = require('moment');
var _ = require('lodash');
var utils = require('../../../utils/common.js');
var env = process.env.NODE_ENV || 'development';
var cfg = require('../../../config/config.js');
var clientHttp = require('../../../connector/http-connector.js');
var utils = require('../../../utils/common.js');
const PREFIX = cfg.service.PANDORA.PREFIX

var logger = require('../../../utils/logger');

exports.getLocationInformation = function (req, res) {
    logger.info('api get location information', req.query);
    var locationId = req.query.locationId;
    var filter = {};
    filter.locationId = locationId;

    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + PREFIX + '/information/info.json?filter=' + queryStr;
        logger.info('GET :: ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'GET_INFORMATION_DATA',
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
            ret.data = response.resultData;
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

exports.getStoreMaster = function (req, res) {
    logger.info('api get store master', req.query);
    var filter = {};
    filter.storeType = req.query.storeType;

    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + PREFIX + '/storeMaster/list.json?filter=' + queryStr;
        logger.info('GET :: ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'GET_STORE_MASTER',
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
            ret.data = response.resultData;
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

exports.getBranchMaster = function (req, res) {
    logger.info('api get branch master', req.query);
    var filter = {};
    // filter.storeType = req.query.storeType;git com
    filter.storeNameTh = req.query.storeNameTh;

    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + PREFIX + '/branchMaster/list.json?filter=' + queryStr;
        logger.info('GET :: ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'GET_BRANCH_MASTER',
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
            ret.data = response.resultData;
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

exports.getCreditCardsMaster = function (req, res) {
    logger.info('api get credit cards master');
    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + PREFIX + '/creditCardMaster/list.json?filter=' + queryStr;
        logger.info('GET :: ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'GET_BRANCH_MASTER',
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
            ret.data = response.resultData;
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

exports.getStoreMaster = function (req, res) {
    logger.info('api get store master', req.query);
    var filter = {};
    filter.storeType = req.query.storeType;
    filter.branchTh = req.query.branchTh;

    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + PREFIX + '/storeMaster/list.json?filter=' + queryStr;
        logger.info('GET :: ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'GET_STORE_MASTER',
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
            ret.data = response.resultData;
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

exports.getBranchMaster = function (req, res) {
    logger.info('api get branch master', req.query);
    var filter = {};
    // filter.storeType = req.query.storeType;
    filter.storeNameTh = req.query.storeNameTh;

    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + PREFIX + '/branchMaster/list.json?filter=' + queryStr;
        logger.info('GET :: ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'GET_BRANCH_MASTER',
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
            ret.data = response.resultData;
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

exports.getShopName = function (req, res) {
    logger.info('api get shop name');
    var ret = {};
    var filter = {};
    filter.locationId = req.query.locationId;
    filter.storeType = req.query.storeType;
    filter.shopSegment = req.query.shopSegment;
    filter.shopType = req.query.shopType;
    filter.storeNameTh = req.query.storeNameTh;
    filter.branchTh = req.query.branchTh;
    filter.storeNameEn = req.query.storeNameEn;
    filter.branchEn = req.query.branchEn;
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + PREFIX + '/information/getShopName.json?filter=' + queryStr;
        logger.info('GET :: ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'GET_SHOP_NAME',
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
            ret.data = response.resultData;
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

exports.putLocationInformation = function (req, res) {
    console.log("putLocationInformation");
    console.log("==================================================================================");
    console.log(req.body)
    console.log("==================================================================================");

    var locationId = req.query.locationId;
    var filter = {};
    filter.locationId = locationId;

    var dataPut = req.body
    console.log('DATAPUT ::', dataPut)
    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        //SEND TO JBOSS
        var uri = cfg.service.PANDORA.URI + PREFIX + '/information/info.json?filter=' + queryStr;
        clientHttp.put(uri, dataPut, {
            service: 'phxpartners-be',
            callService: 'PUT_INFORMATION',
            reqId: req.id
        }).then(function (response) {
            if (parseInt(response.resultCode) != 20000) {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = 'Fail';
                ret.responseDescription = response.resultDescription;
                ret.responseMoreInfo = response.moreInfo;
                res.json(ret);
                return;
            }
            ret.responseCode = 200;
            ret.responseDescription = 'Success';
            res.json(ret);
            return;
        }).catch(function (err) {
            console.log('**********Catch**********')
        });
    } catch (e) {
        return res.json({ responseCode: 1, responseMessage: "Send JBOSS" });
    }

};