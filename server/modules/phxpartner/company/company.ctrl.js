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
            var uri = cfg.service.PANDORA.URI + '/phxPartner/v1/createCompany.json';
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