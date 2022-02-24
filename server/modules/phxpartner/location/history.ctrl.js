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

exports.list = function (req, res) {
    logger.info('getHistoryList');
    var locationCodeId = req.params.id;
    var ret = {};
    var filter = req.query;
    filter.locationCode =locationCodeId;
    logger.info('filter :: '+JSON.stringify(filter));
    var updateFrom = req.query.updateFrom;
    var updateTo = req.query.updateTo;
    var updateBy = req.query.updateBy;
    var sortBy = req.query.sortBy;
    var filterBy = req.query.filterBy;
    try {
        // phxPartner/v1/history.json?filter=(&(updateFrom=2017-08-11 15:01:00)(updateTo=2017-08-11 16:00:00)(updateBy=TAR)(sortBy=latest time)(filterBy=General))
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + '/phxPartner/v1/history.json?filter=' + queryStr;
        // console.log('GET :: ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'VIEW_HISTORY',
            reqId: req.id
        }).then(function (response) {
            console.log('response :: '+response.resultCode + ':'+response.resultDescription);
            if (parseInt(response.resultCode) != 20000) {
                logger.info('getHistoryList :: Fail ['+response.resultDescription+']');
                ret.responseCode =parseInt( parseInt(response.resultCode) / 100 );
                ret.responseMessage = 'Fail';
                ret.responseDescription = response.resultDescription;
                res.json(ret);
                return;
            }
            logger.info('getHistoryList :: success');
            ret.responseCode = 200;
            ret.responseDescription = 'Success';
            ret.data = response.resultData[0].history;
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
};
