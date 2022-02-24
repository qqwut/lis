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

exports.getPersontList = function (req, res) {
    var filter = req.query;
    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI+PREFIX + '/person/list.json?filter=' + queryStr;
        logger.info('GET BE URI:: ' + uri);
        return clientHttp.get(uri, {
            service : 'phxpartners-be' ,
            callService: 'VIEW_LOC_PERSON',
            reqId : req.id
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
            ret.data = response.resultData.personInfo;
            res.json(ret);
        }).catch(function (reason) {
            logger.error('error get location address :: '+reason.message);
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
