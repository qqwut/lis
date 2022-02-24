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

var testDummyData = true;
exports.getInfo = function (req, res) {
    logger.info('api get location info :: locationCode = ' + req.params.id);
    var locationCode = req.params.id;
    var filter = {};
    filter.locationCode = locationCode;
    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + '/phxPartner/v1/location/info.json?filter=' + queryStr;
        logger.info('GET :: ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'VIEW_LOC_GENERAL',
            reqId: req.id
        }).then(function (response) {
            logger.info('response :: ' + JSON.stringify(response));
            // if (parseInt(response.resultCode) != 20000 && testDummyData) {
            //     ret.responseCode = 200;
            //     ret.responseMessage = 'Success (Mockup)';
            //     var filePath = path.join(__dirname, '../../../data/locationInfo.json');
            //     var dataDummy = utils.readFileDataJson(filePath);

            //     ret.data = dataDummy;
            //     res.json(ret);
            //     return;
            // }
            if (parseInt(response.resultCode) != 20000) {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = 'Fail';
               
                ret.responseDescription = response.resultDescription;
                res.json(ret);
                return;
            }
            ret.responseCode = 200;
            ret.responseDescription = 'Success';
            ret.data = response.resultData[0].location[0];
            res.json(ret);
        }).catch(function (err) {
            logger.error(err)
            ret.responseCode = 500;
            ret.responseMessage = 'Fail';
            ret.responseDescription = err.message;
            // if (testDummyData) {
            //     var filePath = path.join(__dirname, '../../../data/locationInfo.json');
            //     var dataDummy = utils.readFileDataJson(filePath);
            //     ret.responseCode = 200;
            //     ret.responseMessage = 'Success (Mockup)';
            //     ret.data = dataDummy;
            // }

            res.json(ret);
        });
    } catch (error) {
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        res.json(ret);
    }

};

exports.upd = function (req, res) {
    logger.info('api put location info ');
    var locationCode = req.params.id;
    var data = req.body;
    data.modifiedBy = req.currentUser.username;
    if (data.effectiveDt) {
        var effectiveDt = moment(data.effectiveDt).format(_CONST.LOCATION_DT_FORMAT);
        data.effectiveDt = effectiveDt;
    }
    if (data.terminateDt) {
        var terminateDt = moment(data.terminateDt).format(_CONST.LOCATION_DT_FORMAT);
        data.terminateDt = terminateDt;
    }

    var nameEn = data.locationNameEn ? data.locationNameEn : '';
    data.nameEn = nameEn;
    delete data.locationNameEn;

    var nameTh = data.locationNameTh ? data.locationNameTh : '';
    data.nameTh = nameTh;
    delete data.locationNameTh;

    var abbrev = data.locationAbbrev ? data.locationAbbrev : '';
    data.abbrev = abbrev;
    delete data.locationAbbrev;


    // :nameTh,subRegion,nameEn,abbrev

    logger.debug('locationCode ' + locationCode + " :: " + JSON.stringify(data));
    var filter = {};
    filter.locationCode = locationCode;
    var ret = {};
    var dataUpd = {
        location: [data]
    };
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + '/phxPartner/v1/location/info.json?filter=' + queryStr;
        logger.info('PUT :: ' + uri);
        return clientHttp.put(uri, data, {
            service: 'phxpartners-be',
            callService: 'EDIT_LOC_GENERAL',
            reqId: req.id
        }).then(function (response) {
            logger.info('response :: ' + JSON.stringify(response));
            // if (parseInt(response.resultCode) != 20000 && testDummyData) {
            //     ret.responseCode = 200;
            //     ret.responseMessage = 'Success (Mockup)';
            //     var filePath = path.join(__dirname, '../../../data/locationInfo.json');
            //     var dataDummy = utils.readFileDataJson(filePath);

            //     ret.data = dataDummy;
            //     res.json(ret);
            //     return;
            // }
            if (parseInt(response.resultCode) != 20000) {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = 'Fail';
                if(response.resultData != undefined && response.resultData.length > 0){
                    ret.data = response.resultData[0];
                }
                ret.responseDescription = response.resultDescription;
                res.json(ret);
                return;
            }
            ret.responseCode = 200;
            ret.responseDescription = 'Success';
            // ret.data = response.resultData[0].location[0];
            res.json(ret);
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