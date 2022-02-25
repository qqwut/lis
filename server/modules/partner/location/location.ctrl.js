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
var locationDraftMod = require('../../../model/locationDraft.js');
var companyMod = require('../../../model/company.js');
var userGroupMod = require('../../../model/userGroup.js');
var openingHoursMod = require('../../../model/openingHours.js');
var mappingRegionMod = require('../../../model/mappingRegion.js');
var provinceMod = require('../../../model/province.js');
var subRegionMod = require('../../../model/subRegion.js');
var zipCodeMod = require('../../../model/zipCode.js');
var authFieldMod = require('../../../model/authField.js');
var retailShopMod = require('../../../model/retailShop');
var dataLocationDummy = [];
var testDummyData = cfg.mockup_data ? parseInt(cfg.mockup_data) : 0;
var rep = require('../../../config/replace.js');

const PREFIX = cfg.service.PANDORA.PREFIX

exports.getLocationList = function (req, res) {
    logger.info('Api search location');
    //console.dir(req.query.ascFlg)
    // var filter = req.body || {};

    console.log("********************")
    console.log(req.query)
    console.log("********************")
    var filter = req.query;
    var nameTh = filter.locationNameTh;
    var nameEn = filter.locationNameEn;
    if (nameTh) {
        filter.locationNameTh = nameTh.replace(/${{rep.replaceFirst}}/g, "${{rep.replaceFirst}}").replace(/${{rep.replaceEnd}}/g, "${{rep.replaceEnd}}");
    }

    if (nameEn) {
        filter.locationNameEn = nameEn.replace(/${{rep.replaceFirst}}/g, "${{rep.replaceFirst}}").replace(/${{rep.replaceEnd}}/g, "${{rep.replaceEnd}}");
    }

    if (undefined != filter.searchFlg && filter.searchFlg && filter.searchFlg == "Y") {
        filter.groupCode = ['ADMIN'];
        delete filter.searchFlg;
    } else if (filter.userGroup != undefined && filter.userGroup != null > 0) {
        filter.groupCode = filter.userGroup.split(",");
        delete filter.userGroup;
    } else {
        filter.groupCode = req.currentUser.userGroup;
    }

    //filter.ascFlg = "Y"
    /* if(req.query.ascFlg){
        filter.ascFlg = req.query.ascFlg
    } */
    logger.debug('filter:' + JSON.stringify(filter));
    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + PREFIX + '/location/list.json?filter=' + queryStr;
        logger.info('prepare option to sent request : ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'SEARCH_LOCATION',
            reqId: req.id,
        }).then(function (response) {

            //logger.info('response  :: ' + response.resultCode + ':' + response.resultDescription);
            if (parseInt(response.resultCode) != 20000) {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = 'Fail';
                ret.responseDescription = response.resultDescription;
                res.json(ret);
            } else {
                ret.responseCode = 200;
                ret.responseDescription = 'Success';
                ret.data = response.resultData.viewLocationList;
                res.json(ret);
            }

        }).catch(function (err) {
            logger.errorStack(err);
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

exports.getLocationListAsc = function (req, res) {
    logger.info('Api search location Asc');
    //console.dir(req.query.ascFlg)
    var filter = req.body || {};
    var nameTh = filter.locationNameTh;
    var nameEn = filter.locationNameEn;

    if (nameTh) {
        filter.locationNameTh = nameTh.replace(/${{rep.replaceFirst}}/g, "${{rep.replaceFirst}}").replace(/${{rep.replaceEnd}}/g, "${{rep.replaceEnd}}");
    }
    if (nameEn) {
        filter.locationNameEn = nameEn.replace(/${{rep.replaceFirst}}/g, "${{rep.replaceFirst}}").replace(/${{rep.replaceEnd}}/g, "${{rep.replaceEnd}}");
    }
    if (undefined != filter.searchFlg && filter.searchFlg && filter.searchFlg == "Y") {
        filter.groupCode = 'ADMIN';
        delete filter.searchFlg;
    } else {
        filter.groupCode = req.currentUser.userGroup;
    }
    if (req.query.ascFlg) {
        filter.ascFlg = req.query.ascFlg
    }

    logger.debug('filter:' + JSON.stringify(filter));
    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + PREFIX + '/location/list.json?filter=' + queryStr;
        logger.info('prepare option to sent request : ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'SEARCH_LOCATION',
            reqId: req.id,
        }).then(function (response) {

            //logger.info('response  :: ' + response.resultCode + ':' + response.resultDescription);
            if (parseInt(response.resultCode) != 20000) {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = 'Fail';
                ret.responseDescription = response.resultDescription;
                res.json(ret);
            } else {
                ret.responseCode = 200;
                ret.responseDescription = 'Success';
                ret.data = response.resultData.viewLocationList;
                res.json(ret);
            }

        }).catch(function (err) {
            logger.errorStack(err);
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

exports.createLocation = function (req, res) {

    var id = req.query.id;
    // var userId  = req.currentUser.username;
    var currentUserId = req.currentUser ? req.currentUser.username : "undefind";
    logger.info('api add Location kkkk');
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };
    try {
        locationDraftMod.findById(id, function (err, result) {

            if (err) {
                logger.info('find draft has error :: ' + JSON.stringify(err));
                ret.responseCode = 500;
                ret.responseMessage = 'Fail';
                ret.responseDescription = err.message;
                res.json(ret);
                return;
            }
            if (result == null) {
                logger.info('find draft not found');
                ret.responseCode = 404;
                ret.responseMessage = 'Data not found';
                ret.responseDescription = 'Data not found';
                res.json(ret);
                return;
            }
            var draftData = result.toObject();
            var locData = {};
            logger.debug(' draft :: ' + JSON.stringify(draftData));
            const DATETIME_FORMAT = 'DD/MM/YYYY HH:mm:ss';

            locData.userGroup = draftData.userGroup;
            locData.createdBy = draftData.createdBy;
            locData.createdDate = moment(draftData.createdDate).format(DATETIME_FORMAT);
            locData.modifiedBy = currentUserId;
            locData.modifiedDate = moment(draftData.modifiedDate).format(DATETIME_FORMAT);
            locData.status = draftData.status;
            locData.authAddrEn = draftData.authAddrEn;

            var pageGroup = draftData.pageGroup;

            // fix data for send to siebel
            locData.sendSiebel = draftData.sendSiebel || "Y";

            // fix data approved
            if (draftData.approved != undefined
                && draftData.approved.length > 0) {
                locData.approved = draftData.approved;
            }

            // fix data financialInfo
            if (pageGroup.financialInfo == undefined) {
                pageGroup.financialInfo = {};
            }

            // fix for create channel Test
            // pageGroup.selectChannel.typeCode = "AIS"
            // pageGroup.selectChannel.mapTypeSubTypeId = "5"
            // pageGroup.selectChannel.typeName = "AIS"
            // pageGroup.selectChannel.subTypeName = "Branch"
            // pageGroup.selectChannel.subTypeCode = "Branch"
            // pageGroup.selectChannel.companyIdTypeName = "เลขที่ผู้เสียภาษีอากร"

            //  JSON.parse(JSON.stringify());
            // var profileInfo = JSON.parse(JSON.stringify(result.pageGroup.profileInfo));
            if (pageGroup.profileInfo.effectiveDt) {
                var effectiveDt = moment(pageGroup.profileInfo.effectiveDt).format('DD/MM/YYYY');
                pageGroup.profileInfo.effectiveDt = effectiveDt
            }
            var vatAddress = pageGroup.addressInfo.vatAddress
            for (var i = 0; i < vatAddress.length; i++) {

                if (vatAddress[i].effectiveDt) {

                    var vateffectiveDt = moment(vatAddress[i].effectiveDt).format('DD/MM/YYYY');
                    vatAddress[i].effectiveDt = vateffectiveDt

                }
                if (vatAddress[i].endDt) {
                    var vatendDt = moment(vatAddress[i].endDt).format('DD/MM/YYYY');
                    vatAddress[i].endDt = vatendDt
                }
            }
            // var financial = pageGroup.financialInfo
            // for (var i = 0; i < financial.length; i++) {

            //     if (financial[i].startDt) {
            //         var finStartDt = moment(financial[i].startDt).format('DD/MM/YYYY');
            //         financial[i].startDt = finStartDt
            //     }
            //     if (financial[i].endDt){
            //         var finEndDt = moment(financial[i].endDt).format('DD/MM/YYYY');   
            //         financial[i].endDt = finEndDt 
            //     }
            // }
            // pageGroup.addressInfo.vatAddress.effectiveDt= effectiveDt
            //console.log(pageGroup.addressInfo.vatAddress.effectiveDt);
            locData.pageGroup = pageGroup;
            if (draftData.resendLocation && draftData.resendLocation.length > 0) {
                logger.info('set location code case resend');
                locData.sendSiebel = 'R';
                locData.pageGroup.summary = pageGroup.summary || {};
                locData.pageGroup.summary.locationCode = draftData.resendLocation;
                locData.pageGroup.summary.locationId = draftData.resendLocationId;
            }
            // var createDt = moment(locData.createdDate).format(DATETIME_FORMAT);
            // var modifiedDt = moment(locData.modifiedDate).format(DATETIME_FORMAT);
            // locData.createdDate = createDt;
            locData.modifiedDate = moment().format(DATETIME_FORMAT);
            logger.info('get draft location by id success ');
            var uri = cfg.service.PANDORA.URI + PREFIX + '/location/createLocation.json';
            var data = {
                data: locData
            };
            logger.info('POST :: ' + uri);
            logger.debug('body :: ' + JSON.stringify(data));
            clientHttp.post(uri, data, {
                service: 'phxpartners-be',
                callService: 'CREATE_LOCATION',
                reqId: req.id
            }).then(function (response) {
                logger.info('response :: ' + JSON.stringify(response));
                if (parseInt(response.resultCode) == 20000) {
                    var location = response.resultData[0];
                    result.status = 'COMPLETED';
                    result.modifiedBy = currentUserId;
                    result.pageGroup.summary = {
                        locationCode: location.locationCode
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
                    if (!response.resultData || !response.resultData[0]) {
                        ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                        ret.userMessage = response.userMessage;
                        ret.responseMessage = "Fail";
                        ret.responseDescription = response.moreInfo;
                        res.json(ret);
                        return;
                    }
                    var location = response.resultData[0];
                    result.resendLocation = location.locationCode
                    result.resendLocationId = location.locationId
                    result.modifiedBy = currentUserId;
                    result.response = {
                        errorCode: response.resultCode,
                        errorResponse: response.resultDescription
                    };
                    var now = moment();
                    result.modifiedDate = new Date(now.year(), now.month(), now.date(), now.hours(), now.minutes(), now.seconds(), now.milliseconds());

                    // .update(
                    //     {link: 'http://www.atlantico.fr/example.html'}, 
                    //     {day : 'example' },
                    //     {multi:true}, 
                    //       function(err, numberAffected){  
                    //       });
                    var updObj = { resendLocation: result.resendLocation, resendLocationId: result.resendLocationId, response: result.response, modifiedDate: result.modifiedDate };
                    result.update(updObj, {
                        multi: true
                    }, function (errUpd, updatedDraft) {
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
                        ret.data = location;
                        res.json(ret);
                    });
                } else {
                    ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                    ret.userMessage = response.userMessage;
                    ret.responseMessage = "Fail";
                    ret.responseDescription = response.moreInfo;
                    res.json(ret);
                }

            }).catch(function (err) {
                logger.error(err)
                ret.responseCode = 500;
                ret.responseMessage = 'Fail';
                ret.responseDescription = err.message;
                res.json(ret);
            });
        });
    } catch (error) {
        logger.errorStack(error)
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        res.json(ret);
    }
};


exports.getListLocation = function (req, res) {
    var filter = req.query;
    logger.info('API listLocation Location');
    var ret = {
        responseCode: 200,
        responseMessage: 'getListLocation'
    };
    return res.json(ret);

    // logger.info('Api search location');
    // var filter = req.body || {};
    // var nameTh = filter.locationNameTh;
    // var nameEn = filter.locationNameEn; 

    // if(nameTh){
    //     filter.locationNameTh = nameTh.replace(/\(/g , "\\(").replace(/\)/g , "\\)") ; 
    // }
    // if(nameEn){
    //     filter.locationNameEn = nameEn.replace(/\(/g , "\\(").replace(/\)/g , "\\)") ;
    // } 
    // logger.debug('filter:' + JSON.stringify(filter));
    // var ret = {};
    // try {
    //     filter.groupName = req.currentUser.userGroup;
    //     var queryStr = utils.getSDFFilter2QueryStr(null, filter);
    //     var uri = cfg.service.PANDORA.URI + '/phxPartner/v1/location/list.json?filter=' + queryStr;
    //     logger.info('prepare option to sent request : ' + uri);
    //     return clientHttp.get(uri, {
    //         service: 'phxpartners-be',
    //         callService: 'SEARCH_LOCATION',
    //         reqId: req.id
    //     }).then(function (response) {

    //         logger.info('response  :: ' + response.resultCode + ':' + response.resultDescription);
    //         if (parseInt(response.resultCode) != 20000) {
    //             ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
    //             ret.responseMessage = 'Fail';
    //             ret.responseDescription = response.resultDescription;
    //             res.json(ret);
    //             return;
    //         }
    //         ret.responseCode = 200;
    //         ret.responseDescription = 'Success';
    //         ret.data = response.resultData[0].viewLocationList;
    //         res.json(ret);
    //     }).catch(function (err) {
    //         logger.errorStack(err);
    //         ret.responseCode = 500;
    //         ret.responseMessage = 'Fail';
    //         ret.responseDescription = err.message;
    //         res.json(ret);
    //     });
    // } catch (error) {
    //     logger.errorStack(error);
    //     ret.responseCode = 500;
    //     ret.responseMessage = 'Fail';
    //     ret.responseDescription = error.message;
    //     res.json(ret);
    // }
};

exports.getInfoLocation = function (req, res) {
    if (req.query.locationId) {
        logger.info('api get location info :: locationId = ' + req.query.locationId);
    }
    if (req.query.companyId) {
        logger.info('api get location info :: companyId = ' + req.query.companyId);
    }
    var filter = {};
    filter = req.query;
    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + PREFIX + '/location/info.json?filter=' + queryStr;
        logger.info('GET :: ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'VIEW_LOC_GENERAL',
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
            if (req.query.locationId) {
                ret.data = response.resultData.location[0];
            } else {
                ret.data = response.resultData.location;
            }
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

exports.getHeadQuater = function (req, res) {
    logger.info('api get HeadQuater info :: companyId = ' + req.query.companyId);
    var filter = {};
    filter = req.query;
    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + PREFIX + '/headQuater/info.json?filter=' + queryStr;
        logger.info('GET :: ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'EDIT_HEAD_QUATER',
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

exports.getHqLocationAbbr = function (req, res) {
    logger.info('api get HeadQuater Abbr');
    var filter = {};
    filter = req.query;
    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + PREFIX + '/location/getHqLocationAbbr.json?filter=' + queryStr;
        logger.info('GET :: ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'GET_HQ_LOCATION_ABBR',
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
            ret.data = { companyAbbr: response.resultData };
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

exports.getSapPayDirectInfo = function (req, res) {

    logger.info('api get sap pay direct info :: companyId = ' + req.query.companyId);
    var filter = {};
    filter = req.query;
    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + PREFIX + '/sap/payDirectVendor/info.json?filter=' + queryStr;

        logger.info('GET :: ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'VIEW_LOC_GENERAL',
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
            ret.data = response.resultData.payDirect;
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

exports.getProfileLocation = function (req, res) {
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
        var uri = cfg.service.PANDORA.URI + PREFIX + '/location/profile.json?filter=' + queryStr;
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

exports.upd = function (req, res) {
    logger.info('api put location info ');
    console.dir("put location info")
    var locationCode = req.query.locationId;
    var data = req.body;
    /* if (data.effectiveDt) {
         var effectiveDt = moment(data.effectiveDt).format(_CONST.LOCATION_DT_FORMAT);
         data.effectiveDt = effectiveDt;
     }
     if (data.terminateDt) {
         var terminateDt = moment(data.terminateDt).format(_CONST.LOCATION_DT_FORMAT);
         data.terminateDt = terminateDt;
     }*/

    // :nameTh,subRegion,nameEn,abbrev

    logger.debug('locationCode ' + locationCode + " :: " + JSON.stringify(data));
    var filter = {};
    filter.locationId = locationCode;
    var ret = {};
    var dataUpd = {
        location: [data]
    };
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + PREFIX + '/location/info.json?filter=' + queryStr;
        logger.info('PUT :: ' + uri);
        return clientHttp.put(uri, dataUpd, {
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
                if (response.resultData != undefined && response.resultData.length > 0) {
                    ret.data = response.resultData[0];
                }
                ret.responseDescription = response.resultDescription;
                ret.responseMoreInfo = response.moreInfo;
                res.json(ret);
                return;
            }
            ret.responseCode = 200;
            ret.responseDescription = 'Success';
            ret.autoCancelAsc = response.resultData.autoCancelAsc
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

exports.getCountLocation = function (req, res) {
    logger.info('api get number count of location by location id: ' + req.query.locationId);
    var filter = {};
    filter = req.query;
    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + PREFIX + '/location/countLocation.json?filter=' + queryStr;
        logger.info('GET :: ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'COUNT_LOCATION',
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
            ret.data = response.resultData.countLocation;
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

exports.changeLicense = function (req, res) {
    logger.info('api changeLicense');
    var filter = {};
    filter = req.query;
    var data = {};
    data = req.body;
    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + PREFIX + "/location/changeLicense.json";
        logger.info('POST :: ' + uri);
        return clientHttp.post(uri, data, {
            service: 'phxpartners-be',
            callService: 'CHANGE_LICENSE',
            reqId: req.id
        }).then(function (response) {
            logger.info('response :: ' + JSON.stringify(response));
            if (parseInt(response.resultCode) != 20000) {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = response.resultDescription;
                ret.responseDescription = response.moreInfo;
                res.json(ret);
                return;
            }
            ret.responseCode = 200;
            ret.responseDescription = 'Success';
            ret.data = response.resultData;
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

exports.getBranchOutlet = function (req, res) {
    logger.info('apigetBranchOutlet' + req.query);
    var filter = {};
    filter = req.query;
    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + PREFIX + '/location/getBranchOutlet/info.json?filter=' + queryStr;
        logger.info('GET :: ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'GET_LOCATION_BRANCH_OUTLET',
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

exports.chkContactOm = function (req, res) {
    logger.info('apichkContactOm' + req.query);
    var filter = {};
    filter = req.query;
    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + PREFIX + '/location/chkContactOm.json?filter=' + queryStr;
        logger.info('GET :: ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'GET_CHECK_CONTACT_OM',
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

