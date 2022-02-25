var fs = require('fs');
const path = require('path');
var moment = require('moment');
var _ = require('lodash');
var env = process.env.NODE_ENV || 'development';
var cfg = require('../../../config/config.js');
var clientHttp = require('../../../connector/http-connector.js');
var locationDraftMod = require('../../../model/locationDraft.js');
var sessionMod = require('../../../model/session.js');
var logger = require('../../../utils/logger');

exports.checkSession = function (req, res) {
    var currentUserId = req.query.userId ? req.query.userId : "test001";
    logger.info('Check Session by id = [' + currentUserId + ']');
    var query = req.query;
    logger.info(query);
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };
    try {
        var now = moment();
        var expired = moment().add(cfg.session, 'minutes');
        if (!(query.type && query.refId && query.userId)) {
            res.json({
                responseCode: 400,
                responseMessage: 'Bad request'
            });
            return;
        }

        if ((query.type !== 'LOCATION_DRAFT') && (query.type !== 'LOCATION_SDF')) {
            res.json({
                responseCode: 400,
                responseMessage: 'Bad request'
            });
            return;
        }

        var filter1 = {
            type_key0: query.type,
            refId_key1: query.refId,
            userId_key2: { $ne: query.userId },
            expired_data: { $gte: new Date(now.year(), now.month(), now.date(), now.hours(), now.minutes(), now.seconds()) }
        };
        sessionMod.find(filter1, function (err, result) {
            if (err) {
                console.error(err);
                ret.responseCode = 500;
                ret.responseMessage = 'Fail';
                ret.responseDescription = err.message;
                res.json(ret);
                throw err;
            }
            if(result&&result.length>0){
                logger.info("Forbidden");
                ret.responseCode = 403;
                ret.responseMessage = 'Forbidden';
                ret.responseDescription = 'This location is editing by [ ' + result[0].userId_key2 + ' ]';
                res.json(ret);
            }else{
                var filter2 = {
                    type_key0: query.type,
                    refId_key1: query.refId,
                    userId_key2: { $eq: query.userId },
                    expired_data: { $gte: new Date(now.year(), now.month(), now.date(), now.hours(), now.minutes(), now.seconds()) }
                };
                sessionMod.find(filter2, function (err, found) {
                    if(found&&found.length>0){
                        var session = found[0];
                        session.expired_data = expired;

                        session.save(function (errUpd, updatedSession) {
                            if (errUpd) {
                                ret.responseCode = 500;
                                ret.responseMessage = "Fail";
                                ret.responseDescription = errUpd.message;
                                res.json(ret);
                            }
                            logger.info("Refresh session.");
                            res.json(ret);
                        });
                    }
                });
            }
        });
       
    } catch (error) {
        logger.errorStack(error);
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        res.json(ret);
    }
};

exports.lockSession = function (req, res) {
    var currentUserId = req.query.userId ? req.query.userId : "test001";
    logger.info('Lock Session by id = [' + currentUserId + ']');
    var data = req.body;
    logger.info(data);
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };
    try {
        var now = moment();
        var expired = moment().add(cfg.session, 'minutes');
        if (!(data.type && data.refId)) {
            res.json({
                responseCode: 400,
                responseMessage: 'Bad request'
            });
            return;
        }

        if ((data.type !== 'LOCATION_DRAFT') && (data.type !== 'LOCATION_SDF')) {
            res.json({
                responseCode: 400,
                responseMessage: 'Bad request'
            });
            return;
        }

        var filter1 = {
            type_key0: data.type,
            refId_key1: data.refId,
            expired_data: { $lte: new Date(now.year(), now.month(), now.date(), now.hours(), now.minutes(), now.seconds()) }
        };

        sessionMod.remove(filter1);

        var filter2 = {
            type_key0: data.type,
            refId_key1: data.refId,
            userId_key2: { $ne: data.userId },
            expired_data: { $gte: new Date(now.year(), now.month(), now.date(), now.hours(), now.minutes(), now.seconds()) }
        };
        sessionMod.find(filter2, function (err, result) {
            if (err) {
                console.error(err);
                ret.responseCode = 500;
                ret.responseMessage = 'Fail';
                ret.responseDescription = err.message;
                res.json(ret);
                throw err;
            }
            if(result&&result.length>0){
                logger.info(JSON.stringify(result));
                ret.responseCode = 403;
                ret.responseMessage = 'Forbidden';
                ret.responseDescription = 'This location is editing by [ ' + result[0].userId_key2 + ' ]';
                res.json(ret);
            }else{
                var lock = {
                    type_key0: data.type,
                    refId_key1: data.refId,
                    userId_key2: data.userId,
                    page_data: data.page,
                    token_data: data.token,
                    expired_data: new Date(expired.year(), expired.month(), expired.date(), expired.hours(), expired.minutes(), expired.seconds())
                };
                
                sessionMod.create(lock, function (err, session) {
                    if (err) {
                        res.json({
                            responseCode: 500,
                            responseMessage: 'Fail',
                            error: err
                        });
                        return;
                    }

                    ret.data = session;
                    
                    res.json(ret);
                });
            }
        });
       
    } catch (error) {
        logger.errorStack(error);
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        res.json(ret);
    }
};

exports.unlockSession = function (req, res) {
    var currentUserId = req.query.userId ? req.query.userId : "test001";
    logger.info('Unlock Session by id = [' + currentUserId + ']');
    var data = req.body;
    logger.info(data);
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };
    try {
        var now = moment();
        if (!(data.type && data.refId)) {
            res.json({
                responseCode: 400,
                responseMessage: 'Bad request'
            });
            return;
        }

        if ((data.type !== 'LOCATION_DRAFT') && (data.type !== 'LOCATION_SDF')) {
            res.json({
                responseCode: 400,
                responseMessage: 'Bad request'
            });
            return;
        }

        var filter = {
            type_key0: data.type,
            refId_key1: data.refId,
            userId_key2: data.userId
        };

        sessionMod.remove(filter, function (err, result) {
            if (err) {
                console.error(err);
                ret.responseCode = 500;
                ret.responseMessage = 'Fail';
                ret.responseDescription = err.message;
                res.json(ret);
                throw err;
            }
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
