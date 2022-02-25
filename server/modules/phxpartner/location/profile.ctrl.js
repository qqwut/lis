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

var testDummyData = cfg.mockup_data ? parseInt(cfg.mockup_data) : 0;

function getLocationProfileDummyData(locationCode) {
    var filePath = path.join(__dirname, '../../../data/locationProfileList.json');
    var dataDummy = utils.readFileDataJson(filePath);
    dataDummy = _.filter(dataDummy, function (o) {
        return o.locationCode == locationCode
    });
    if (!dataDummy || dataDummy.length == 0) {
        dataDummy = [];
        var tmp = {
            // "locationCode": "9866",
            "licenseCode": "XXXXXXX",
            "distChnCode": "AISCHN",
            "distChnName": "AIS Channel",
            "locationNameEn": "ASXXX",
            "locationNameTh": "ASXXX",
            "companyTitleTh": "",
            "companyNameTh": "บริษัท แอดวานซ์ ไวร์เลส เน็ทเวอร์ค จำกัด(test data)",
            "companyAbbr": "AWN",
            "companyId": "XXXXXXXXXXXX",
            "companyIdNo": "XXXXXXXXXCC",
            "companyIdType": "TAX_ID",
            "chnSalesCode": "AISSHOP",
            "chnSalesName": "AIS Shop",
            "distributorFlag": "N",
            "retailFlag": "Y",
            "subRegion": "",
            "locationIdType": "",
            "locationIdNo": ""
        };
        dataDummy.push(tmp);
    }
    return dataDummy[0];
};


exports.getLocationProfile = function (req, res) {
    logger.info('api get location profile');
    var locationCode = req.params.id;
    var provinceCode = req.query.provinceCode;
    var subRegion = req.query.subRegion;
    var filter = {};
    filter.locationCode = locationCode;
    if (provinceCode) {
        filter.provinceCode = provinceCode;
    }
    if (subRegion) {
        filter.subRegion = subRegion;
    }

    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + '/phxPartner/v1/location/profile.json?filter=' + queryStr;
        logger.info('GET :: ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'VIEW_LOC_PROFILE',
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
            ret.data = response.resultData[0].location[0];
            res.json(ret);
        }).catch(function (err) {
            logger.errorStack(err);
            // if (testDummyData > 0 && err.name == 'RequestError') {
            //     ret.responseCode = 200;
            //     ret.responseDescription = 'Success( mock data RequestError )';
            //     ret.data = getLocationProfileDummyData(locationCode);
            //     res.json(ret);
            //     return;
            // }
            ret.responseCode = 500;
            ret.responseMessage = 'Fail';
            ret.responseDescription = err.message;
            res.json(ret);
        });
    } catch (error) {
        logger.errorStack(err);
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        res.json(ret);
    }

};