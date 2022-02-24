var env = process.env.NODE_ENV || 'development';
var cfg = require('../../../config/config.js');
var utils = require('../../../utils/common.js');
var logger = require('../../../utils/logger');
var _CONST = require('../../../utils/constants.js');
var clientHttp = require('../../../connector/http-connector.js');
var fs = require('fs');
const path = require('path');
var moment = require('moment');
var _ = require('lodash');

const PREFIX = cfg.service.PANDORA.PREFIX

exports.getChnSalesGroup = function (req, res) {
    logger.info('api get channel sales info :: companyId = ' + req.query.companyId);
    var filter = {};
    filter = req.query;
    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI+PREFIX + '/chnsalegroup/info.json?filter=' + queryStr;
        logger.info('GET :: ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'GET_CHN_SALE',
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
            ret.data = {chnSalesGroup: response.resultData};
            res.json(ret);
        }).catch(function (err) {
            logger.error(err)
            ret.responseCode = 500;
            ret.responseMessage = 'Fail';
            ret.responseDescription = err.message;
            res.json(ret);
        });
    } catch (error) {
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        res.json(ret);
    }
};