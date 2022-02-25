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

// var locationDraftMod = require('../../../model/locationDraft.js');
// var companyMod = require('../../../model/company.js');
// var userGroupMod = require('../../../model/userGroup.js');
// var openingHoursMod = require('../../../model/openingHours.js');
// var mappingRegionMod = require('../../../model/mappingRegion.js');
// var provinceMod = require('../../../model/province.js');
// var subRegionMod = require('../../../model/subRegion.js');
// var zipCodeMod = require('../../../model/zipCode.js');
// var authFieldMod = require('../../../model/authField.js');
// var retailShopMod = require('../../../model/retailShop');


var testDummyData = cfg.mockup_data ? parseInt(cfg.mockup_data) : 0;


exports.addLocation = function (req, res) {
    var id = req.params.id;
    // var userId  = req.currentUser.username;
    var currentUserId = req.currentUser ? req.currentUser.username : "undefind";
    logger.info('add Location');
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };
    try {
        locationDraftMod.findById(id, function (err, result) {
            if (err) {
                ret.responseCode = 500;
                ret.responseMessage = 'Fail';
                ret.responseDescription = err.message;
                res.json(ret);
                return;
            }
            if (result == null) {
                ret.responseCode = 404;
                ret.responseMessage = 'Data not found';
                ret.responseDescription = 'Data not found';
                res.json(ret);
                return;
            }
            const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

            var locData = {};
            locData.userGroup = result.userGroup;
            locData.createdBy = result.createdBy;
            locData.createdDate = moment(result.createdDate).format(DATETIME_FORMAT);
            locData.modifiedBy = result.modifiedBy;
            locData.modifiedDate = moment(result.modifiedDate).format(DATETIME_FORMAT);
            locData.status = result.status;
            locData.approved = result.approved;
            var pageGroup = JSON.parse(JSON.stringify(result.pageGroup));
            //  JSON.parse(JSON.stringify());
            // var profileInfo = JSON.parse(JSON.stringify(result.pageGroup.profileInfo));
            if (pageGroup.profileInfo.effectiveDt) {
                var effectiveDt = moment(pageGroup.profileInfo.effectiveDt).format(DATETIME_FORMAT);
                pageGroup.profileInfo.effectiveDt = effectiveDt;
            }

            locData.pageGroup = pageGroup;

            if (result.resendLocation && result.resendLocation.length > 0) {
                logger.info('set location code case resend');
                locData.sendSiebel = 'R';
                locData.pageGroup.summary = pageGroup.summary || {};
                locData.pageGroup.summary.locationCode = result.resendLocation;
            }
            // var createDt = moment(locData.createdDate).format(DATETIME_FORMAT);
            // var modifiedDt = moment(locData.modifiedDate).format(DATETIME_FORMAT);
            // locData.createdDate = createDt;
            // locData.modifiedDate = modifiedDt;
            logger.info('get draft location by id success ');
            var uri = cfg.service.PANDORA.URI + '/phxPartner/v1/createLocation.json';
            var data = {
                data: locData
            };
            logger.info('POST :: ' + uri);
            logger.info('body :: ' + JSON.stringify(data));
            clientHttp.post(uri, data, {
                service: 'phxpartners-be',
                callService: 'CREATE_LOCATION',
                reqId: req.id
            }).then(function (response) {
                logger.info('response :: ' + JSON.stringify(response));
                if (parseInt(response.resultCode) == 20000) {
                    var location = response.resultData[0].location[0]; 
                    result.status = 'COMPLETED';
                    result.modifiedBy = currentUserId;
                    result.pageGroup.summary = {
                        "locationCode": location.locationCode
                    };
                    //result.step5Summary.locationCode = locationCode;
                    var now = moment();
                    result.modifiedDate = new Date(now.year(), now.month(), now.date(), now.hours(), now.minutes(), now.seconds(), now.milliseconds());
                    result.save(function (errUpd, updatedDraft) {
                        logger.info('Update step5');
                        if (errUpd) {
                            logger.errorStack(errUpd);
                            ret.data = location;
                            ret.responseCode = 500;
                            ret.responseMessage = "Fail";
                            ret.responseDescription = errUpd.message;
                            res.json(ret);
                            return;
                        }
                        // var data
                        ret.data = location;
                        ret.responseCode = 200;
                        ret.responseDescription = response.resultDescription;
                        res.json(ret);
                    });
                } else if (parseInt(response.resultCode) == 42410) {
                    if (!response.resultData) {
                        ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                        ret.userMessage = response.userMessage;
                        ret.responseMessage = "Fail";
                        // ret.responseDescription = response.resultDescription;
                        ret.responseDescription = response.moreInfo;  //edit by gun
                        res.json(ret);
                        return;
                    }
                    var location = response.resultData[0].location[0];
                    result.resendLocation = location.locationCode
                    result.modifiedBy = currentUserId;
                    result.response = {
                        errorCode: response.resultCode,
                        errorResponse: response.moreInfo
                    };
                    var now = moment();
                    result.modifiedDate = new Date(now.year(), now.month(), now.date(), now.hours(), now.minutes(), now.seconds(), now.milliseconds());
                    result.save(function (errUpd, updatedDraft) {
                        logger.info('Update resendCode to draft');
                        if (errUpd) {
                            logger.errorStack(errUpd);
                            ret.data = location;
                            ret.responseCode = 500;
                            ret.responseMessage = "Fail";
                            ret.responseDescription = errUpd.message;
                            res.json(ret);
                            return;
                        }
                        // var data
                        ret.data = location;
                        ret.responseCode = 424;
                        ret.responseMessage = "Fail";
                        ret.responseDescription = response.moreInfo;
                        res.json(ret);
                    });
                } else {
                    ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                    ret.userMessage = response.userMessage;
                    ret.responseMessage = "Fail";
                    ret.responseDescription = response.resultDescription;
                    res.json(ret);
                }

            });
        });
    } catch (error) {
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        res.json(ret);
    }
};


exports.getLocation = function (req, res) {
    logger.info('Api search location');
    var filter = req.body || {};
    logger.debug('filter:' + JSON.stringify(filter));
    var ret = {};
    try {
        filter.groupName = req.currentUser.userGroup;
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + '/phxPartner/v1/location/list.json?filter=' + queryStr;
        // logger.info('GET :: ' + uri);
        logger.info('prepare option to sent request : ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'SEARCH_LOCATION',
            reqId: req.id
        }).then(function (response) {

            logger.info('response  :: ' + response.resultCode + ':' + response.resultDescription);
            if (parseInt(response.resultCode) != 20000) {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = 'Fail';
                ret.responseDescription = response.resultDescription;
                res.json(ret);
                return;
            }
            ret.responseCode = 200;
            ret.responseDescription = 'Success';
            ret.data = response.resultData[0].viewLocationList;
            res.json(ret);
        }).catch(function (err) {
           // logger.errorStack(err);
            // RequestError: Error: socket 
            // hang up
            // if (testDummyData > 0 && err.name == 'RequestError') {
            //     ret.responseCode = 200;
            //     ret.responseDescription = 'Success( mock data RequestError )';
            //     ret.data = getLocationDummyData(filter);
            //     res.json(ret);
            //     return;
            // }
            logger.errorStack(err);
            ret.responseCode = 500;
            ret.responseMessage = 'Fail';
            ret.responseDescription = err.message;
            // ret.data = getLocationDummyData();
            res.json(ret);
        });
    } catch (error) {
        logger.errorStack(error);
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        // ret.data = getLocationDummyData();
        res.json(ret);
    }
    // res.json({
    //     resultCode: 20000,
    //     resultDescription: 'Success',
    //     data: dataLocationDummy
    // });
};
