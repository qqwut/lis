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
var lov = require('../../../model/lov.js');
const chalk = require('chalk');

const PREFIX = cfg.service.PANDORA.PREFIX

exports.getStoreMaster = function (req, res) {
    var filter = req.query;
    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + PREFIX + '/master/store/list.json?filter=' + queryStr;
        logger.info('GET BE URI:: ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'GET_STORE_MASTER_LIST',
            reqId: req.id
        }).then(function (response) {
            logger.info(chalk.bgBlue.bold(' Response :: ') + chalk.green.bold(JSON.stringify(response)));
            if (parseInt(response.resultCode) != 20000) {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = 'Fail';
                ret.responseDescription = response.resultDescription;
                ret.moreInfo = response.moreInfo
                ret.resultData = response.resultData
                res.json(ret);
                return;
            }
            ret.responseCode = 200;
            ret.responseDescription = 'Success';
            ret.moreInfo = response.moreInfo
            ret.data = response.resultData;
            res.json(ret);
        }).catch(function (reason) {
            logger.error(chalk.bgRed.bold('error :: ') + chalk.red.bold(reason.message));
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

exports.checkDulpStore = function (req, res) {
    var filter = req.query;
    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + PREFIX + '/master/store/checkDup.json?filter=' + queryStr;
        logger.info('GET BE URI:: ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'CHECK_DUPLICATE_STORE',
            reqId: req.id
        }).then(function (response) {
            logger.info(chalk.bgBlue.bold(' Response :: ') + chalk.green.bold(JSON.stringify(response)));
            if (parseInt(response.resultCode) != 20000) {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = 'Fail';
                ret.responseDescription = response.resultDescription;
                ret.moreInfo = response.moreInfo
                ret.resultData = response.resultData
                res.json(ret);
                return;
            }
            ret.responseCode = 200;
            ret.responseDescription = 'Success';
            ret.moreInfo = response.moreInfo
            ret.data = response.resultData;
            res.json(ret);
        }).catch(function (reason) {
            logger.error(chalk.bgRed.bold('error :: ') + chalk.red.bold(reason.message));
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

exports.getRelateStoreLoc = function (req, res) {
    var filter = req.query;
    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + PREFIX + '/master/store/chkRelateStoreLoc.json?filter=' + queryStr;
        logger.info('GET BE URI:: ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'GET_RELATE_STORE_LOC',
            reqId: req.id
        }).then(function (response) {
            logger.info(chalk.bgBlue.bold(' response :: ') + chalk.green.bold(JSON.stringify(response)));
            if (parseInt(response.resultCode) != 20000) {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = 'Fail';
                ret.responseDescription = response.moreinfo;
                ret.moreInfo = response.moreInfo
                res.json(ret);
                return;
            }
            ret.responseCode = 200;
            ret.responseDescription = 'Success';
            ret.moreInfo = response.moreInfo
            ret.data = response.resultData.contact;
            res.json(ret);
        }).catch(function (reason) {
            logger.error('error :: ' + reason.message);
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

exports.updateStoreMaster = function (req, res) {
    logger.info('api put updLocationAddress');
    var data = req.body;
    var ret = {};
    try {
        var uri = cfg.service.PANDORA.URI + PREFIX + '/master/store/info.json'
        logger.info('PUT :: ' + uri);
        return clientHttp.put(uri, data, {
            service: 'phxpartners-be',
            callService: 'UPDATE_STORE_MASTER',
            reqId: req.id
        }).then(function (response) {
            logger.info(chalk.bgBlue.bold(' response :: ') + chalk.green.bold(JSON.stringify(response)));
            if (response.resultCode != 20000) {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseDescription = response.resultDescription
                ret.moreInfo = response.moreInfo
                ret.resultData = response.resultData
                res.json(ret);
                return;
            }
            ret.responseCode = 200;
            ret.moreInfo = response.moreInfo
            ret.responseDescription = 'Success';
            res.json(ret);
        }).catch(function (err) {
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

exports.createStoreType = function (req, res) {
    var data = req.body;
    var ret = {};
    console.log("✅", data.storeType[0].cmd)
    if (data.storeType[0].cmd == 'POST') {
        try {
            var uri = cfg.service.PANDORA.URI + PREFIX + '/master/store/storeType/info.json'
            logger.info('PUT :: ' + uri);
            return clientHttp.put(uri, data, {
                service: 'phxpartners-be',
                callService: 'CREATE_STORE_TYPE',
                reqId: req.id
            }).then(function (response) {
                logger.info(chalk.bgBlue.bold(' response :: ') + chalk.green.bold(JSON.stringify(response)));
                if (response.resultCode != 20000) {
                    ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                    ret.responseDescription = response.resultDescription
                    ret.moreInfo = response.moreInfo
                    ret.resultData = response.resultData
                    res.json(ret);
                    return;
                }
                //// Add Data to Mongo
                let dataToMongo = {
                    lovId_key3: response.resultData[0].lovId,
                    lovType_key2: response.resultData[0].lovType,
                    lovCode_key0: response.resultData[0].lovCode,
                    lovName_data: response.resultData[0].lovName,
                    lovVal01_data: response.resultData[0].lovVal01,
                    lovVal02_data: "ห้างสรรพสินค้า (TH)",
                    lovVal11_data: "ห้างสรรพสินค้า (EN)",
                    lovVal12_data: "สาขา (TH)",
                    lovVal21_data: "สาขา (EN)",
                    activeFlg_key1: response.resultData[0].activeFlg,
                    created_data: response.resultData[0].created,
                    createdBy_data: response.resultData[0].createdBy,
                    lastUpd_data: response.resultData[0].lastUpd,
                    lastUpdBy_data: response.resultData[0].lastUpdBy,
                }
                console.log("******* datamongo *****", dataToMongo)
                lov.create(dataToMongo, function (err, responseMongo) {
                    if (err) {
                        res.json({
                            responseCode: 500,
                            responseMessage: 'Fail',
                            error: err
                        });
                        return;
                    }
                    logger.info(chalk.bgGreen.bold('SAVE DATA TO MONGO SUCCESS'))
                    ret.responseCode = 200;
                    ret.moreInfo = "Success"
                    ret.responseDescription = 'Success';
                    ret.resultData = response.resultData
                    res.json(ret);
                })
            }).catch(function (err) {
                logger.error('error request updLocationAddress :: ', err);
                ret.responseCode = 500;
                ret.responseMessage = 'Fail';
                ret.responseDescription = err.message;
                ret.resultData = err.resultData
                res.json(ret);
            });
        } catch (error) {
            logger.errorStack(error);
            ret.resultData = error.resultData
            ret.responseMessage = 'Fail';
            ret.responseDescription = error.message;
            res.json(ret);
        }
    } else if (data.storeType[0].cmd == 'DELETE') {
        try {
            var uri = cfg.service.PANDORA.URI + PREFIX + '/master/store/storeType/info.json'
            logger.info('DELETE :: ' + uri);
            return clientHttp.put(uri, data, {
                service: 'phxpartners-be',
                callService: 'CREATE_STORE_TYPE',
                reqId: req.id
            }).then(function (response) {
                logger.info(chalk.bgBlue.bold(' response :: ') + chalk.green.bold(JSON.stringify(response)));
                if (response.resultCode != 20000) {
                    ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                    ret.responseDescription = response.resultDescription
                    ret.moreInfo = response.moreInfo
                    ret.resultData = response.resultData
                    res.json(ret);
                    return;
                }
                ret.responseCode = 200;
                ret.moreInfo = response.moreInfo
                ret.responseDescription = 'Success';
                res.json(ret);
            }).catch(function (err) {
                ret.responseCode = 500;
                ret.responseMessage = 'Fail';
                ret.responseDescription = err.message;
                ret.resultData = err.resultData
                res.json(ret);
            });
        } catch (error) {
            logger.errorStack(error);
            ret.responseMessage = 'Fail';
            ret.responseDescription = error.message;
            res.json(ret);
        }
    }
}
