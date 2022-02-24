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

var dataLocationDummy = [];
var testDummyData = cfg.mockup_data ? parseInt(cfg.mockup_data) : 0;

function checkFieldUpdLocationDraft(req, res, dataUpd) {
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };
    var step = dataUpd.step;
    if (step == "0") {
        if (!(dataUpd.selectChannel && dataUpd.selectChannel.companyAbbr && dataUpd.selectChannel.distChnCode &&
            dataUpd.selectChannel.chnSalesCode)) {
            logger.debug("checkFieldUpdLocationDraft :: filed[companyAbbr,distChnCode,chnSalesCode] is missing.");
            res.json({
                responseCode: 400,
                responseMessage: 'Bad request',
                responseMessage: 'filed[companyAbbr,distChnCode,chnSalesCode] is missing.'
            });
            return;
        }
        // ret.responseCode = 400 ;
        // ret.responseMessage = 'Bad request';
        // ret.responseDescription = !modifiedBy?'filed[modifiedBy] is missing.':'filed[step] is missing.';
        // res.json(ret);
        // return;
    } else if (step == "1" && !dataUpd.profileInfo) {
        logger.debug("checkFieldUpdLocationDraft step 1 :: filed[profileInfo] is missing.");
        ret.responseCode = 400;
        ret.responseMessage = 'Bad request';
        ret.responseDescription = 'filed[profileInfo] is missing.';
        res.json(ret);
        return;
    } else if (step == "2" && !dataUpd.step2Product) {
        logger.debug("checkFieldUpdLocationDraft step 2 :: filed[step2Product] is missing.");
        ret.responseCode = 400;
        ret.responseMessage = 'Bad request';
        ret.responseDescription = 'filed[step2Product] is missing.';
        res.json(ret);
        return;
    } else if (step == "3" && !dataUpd.addressInfo) {
        ret.responseCode = 400;
        ret.responseMessage = 'Bad request';
        ret.responseDescription = 'filed[addressInfo] is missing.';
        res.json(ret);
        return;
    } else if (step == "4" && !dataUpd.contactInfo) {
        ret.responseCode = 400;
        ret.responseMessage = 'Bad request';
        ret.responseDescription = 'filed[contactInfo] is missing.';
        res.json(ret);
        return;
    }
};

function draftAddSelectChannel(req, res) {
    var dataDraft = req.body;
    console.log("==================================================================================");
    console.log(dataDraft);
    console.log("==================================================================================");
    var userId = req.currentUser.username;
    dataDraft.createdBy = userId;
    var userGroupAuth = Array.isArray(req.currentUser.userGroup) ? req.currentUser.userGroup : [req.currentUser.userGroup];

    if (!(dataDraft.companyAbbr && dataDraft.distChnCode &&
        dataDraft.chnSalesCode && dataDraft.createdBy) && dataDraft.chnType == 'I') {
        res.json({
            responseCode: 400,
            responseMessage: 'Bad request'
        });
        return;
    }

    var promises = [];
    var condition = {};

    //for user group admin edit by gun
    if (userGroupAuth.indexOf("ADMIN") != -1) {
        condition = {
            distChnCode_key1: dataDraft.distChnCode,
            chnSalesCode_key2: dataDraft.chnSalesCode,
            locationFlg: "Y",
        };
        console.dir("case Admin")
    } else {
        console.dir("case Not Admin")
        var regxUg = "";
        userGroupAuth.forEach(function (element) {
            if (element != undefined && element != "") {
                if (regxUg == "") {
                    regxUg += "^" + element;
                } else {
                    regxUg += "|^" + element;
                }
            }
        });
        condition = {
            distChnCode_key1: dataDraft.distChnCode,
            chnSalesCode_key2: dataDraft.chnSalesCode,
            locationFlg: "Y",
            groupName_data:
                { $regex: new RegExp(regxUg) }
        };
    }
    console.dir("condition to query Create Draft")
    console.dir(condition)
    var userGroupPm = userGroupMod.distinct('groupName_data', condition,
        function (err, groupNameArr) { });
    promises.push(userGroupPm);


    // var componyPm = companyMod.find({
    //     companyAbbr_data: dataDraft.companyAbbr
    // }, function (err, result) {});
    // promises.push(componyPm);

    Promise.all(promises).then(function (results) {
        var userGroups = results[0];
        console.dir("userGroupPm Create")
        console.dir(userGroups)
        // req.currentUser.userGroup. 

        // var userGroups = req.currentUser.userGroup;
        //var company = results[1][0];

        var locDraft = {
            status: "PROGRESS",
            step: "0",
            url: "/location/create/channel",
            userGroup: userGroups,
            createdBy: dataDraft.createdBy,
            modifiedBy: dataDraft.createdBy
        };

        // if (!company) {
        //     res.json({
        //         responseCode: 404,
        //         responseMessage: 'Data not fount',
        //         responseDescription: 'Not found company find by companyAbbr [' + dataDraft.companyAbbr + ']'
        //     });
        //     return;
        // }

        var now = moment();
        var expire = moment().add(7, 'days');

        locDraft.expire = new Date(expire.year(), expire.month(), expire.date(), expire.hours(), expire.minutes(), expire.seconds(), expire.milliseconds());

        var createDt = new Date(now.year(), now.month(), now.date(), now.hours(), now.minutes(), now.seconds(), now.milliseconds());
        locDraft.createdDate = createDt;
        locDraft.modifiedDate = createDt;
        // locDraft.step = '0';
        locDraft.pageGroup = {};

        // if(dataDraft.chnSalesCode == 'ARS' || dataDraft.chnSalesCode == 'AISBUDDY'){
        //     locDraft.url = '/location-ext/new/onestep';
        // }else if(dataDraft.chnType == 'I'){
        //     locDraft.url = '/location/new/select-channel';
        // }else if(dataDraft.chnType == 'E'){
        //     locDraft.url = '/location-ext/new/select-channel';
        // }

        locDraft.pageGroup.selectChannel = {
            companyAbbr: dataDraft.companyAbbr,
            distChnCode: dataDraft.distChnCode,
            distChnName: dataDraft.distChnName,
            chnSalesCode: dataDraft.chnSalesCode,
            chnSalesName: dataDraft.chnSalesName,
            companyId: dataDraft.companyId, //kob
            companyIdNo: dataDraft.companyIdNo, //kob
            companyTitleTh: dataDraft.companyTitleTh, //kob
            companyNameTh: dataDraft.companyNameTh, //kob
            companyIdType: dataDraft.companyIdType, //kob
            companyTitleCode: dataDraft.companyTitleCode, //kob
            //prepare code for new param
            typeCode: dataDraft.typeCode,
            mapTypeSubTypeId: dataDraft.mapTypeSubTypeId,
            typeName: dataDraft.typeName,
            subTypeName: dataDraft.subTypeName,
            subTypeCode: dataDraft.subTypeCode,
            companyIdTypeName: dataDraft.companyIdTypeName,
            //start kob
            // companyIdTypeName: dataDraft.companyAbbr,
            companyTitleEn: dataDraft.companyTitleEn,
            companyNameEn: dataDraft.companyNameEn,
            wtName: dataDraft.wtName,
            vatType: dataDraft.vatType,
            distChnSaleId: dataDraft.distChnSaleId,
            chnType: dataDraft.chnType,
            //end kob
            chnSalesGroupId: dataDraft.chnSalesGroupId,
            businessCode: dataDraft.businessCode,
            businessName: dataDraft.businessName,
        };
        locationDraftMod.create(locDraft, function (err, draft) {
            if (err) {
                res.json({
                    responseCode: 500,
                    responseMessage: 'Fail',
                    error: err
                });
                return;
            }
            // console.dir(draft);
            var ret = {
                responseCode: 201,
                responseMessage: "Success",
                data: {
                    locationDraftId: draft._id
                }
            };
            // ret.data.push({
            //     locationDraftId: draft._id
            // });
            res.json(ret);
        });

    }).catch(function (error) {
        var ret = {
            responseCode: 500,
            responseMessage: "Fail",
            error: error.message
        };
        res.json(ret);
    });
}

function draftEditSelectChannel(locationDraft, req, res) {
    var id = req.params.id;
    var dataUpd = req.body;
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    console.log(dataUpd);
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    var step = dataUpd.step;
    var modifiedBy = dataUpd.modifiedBy;
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };

    if (dataUpd.selectChannel.chnSalesCode != locationDraft.pageGroup.selectChannel.chnSalesCode) {
        locationDraft.pageGroup = {};
    }

    var userGroupAuth = Array.isArray(req.currentUser.userGroup) ? req.currentUser.userGroup : [req.currentUser.userGroup];
    var promises = [];
    // var userGroupPm = userGroupMod.distinct('groupName_data', {
    //     distChnCode_key1: dataUpd.selectChannel.distChnCode,
    //     chnSalesCode_key2: dataUpd.selectChannel.chnSalesCode,
    //     groupName_data: {
    //         $in: userGroupAuth
    //     }
    // }, function (err, groupNameArr) {});

    var condition = {};

    //for user group admin edit by KOb copy create draft P'gun
    if (userGroupAuth.indexOf("ADMIN") != -1) {
        condition = {
            distChnCode_key1: dataUpd.selectChannel.distChnCode,
            chnSalesCode_key2: dataUpd.selectChannel.chnSalesCode,
            locationFlg: "Y",
        };

    } else {
        var regxUg = "";
        userGroupAuth.forEach(function (element) {
            if (element != undefined && element != "") {
                if (regxUg == "") {
                    regxUg += "^" + element;
                } else {
                    regxUg += "|^" + element;
                }
            }
        });
        condition = {
            distChnCode_key1: dataUpd.selectChannel.distChnCode,
            chnSalesCode_key2: dataUpd.selectChannel.chnSalesCode,
            locationFlg: "Y",
            groupName_data:
                { $regex: new RegExp(regxUg) }
        };
    }

    var userGroupPm = userGroupMod.distinct('groupName_data', condition,
        function (err, groupNameArr) { });

    promises.push(userGroupPm);

    // var componyPm = companyMod.find({
    //     companyAbbr_data: dataUpd.selectChannel.companyAbbr
    // }, function (err, result) {});
    // promises.push(componyPm);

    Promise.all(promises).then(function (results) {
        var userGroups = results[0];
        // var company = results[1][0];

        locationDraft.step = '0';
        locationDraft.url = '/location/create/channel/' + locationDraft._id;
        // if(dataUpd.selectChannel.chnSalesCode == 'ARS' || dataUpd.selectChannel.chnSalesCode == 'AISBUDDY'){
        //     locationDraft.url = '/location-ext/new/onestep/' + locationDraft._id;
        // }else if(dataUpd.selectChannel.chnType == 'I'){
        //     locationDraft.url = '/location/create/channel/' + locationDraft._id;
        // }else if(dataUpd.selectChannel.chnType == 'E'){
        //     locationDraft.url = '/location-ext/create/channel/' + locationDraft._id;
        // }
        locationDraft.modifiedBy = modifiedBy;
        locationDraft.userGroup = userGroups;
        // if (!company) {
        //     res.json({
        //         responseCode: 404,
        //         responseMessage: 'Data not fount',
        //         responseDescription: 'Not found company find by companyAbbr [' + dataUpd.selectChannel.companyAbbr + ']'
        //     });
        //     return;
        // }



        locationDraft.pageGroup.selectChannel = {
            companyAbbr: dataUpd.selectChannel.companyAbbr,
            distChnCode: dataUpd.selectChannel.distChnCode,
            distChnName: dataUpd.selectChannel.distChnName,
            chnSalesCode: dataUpd.selectChannel.chnSalesCode,
            chnSalesName: dataUpd.selectChannel.chnSalesName,
            companyId: dataUpd.selectChannel.companyId, //kob
            companyIdNo: dataUpd.selectChannel.companyIdNo, //kob
            companyTitleTh: dataUpd.selectChannel.companyTitleTh, //kob
            companyNameTh: dataUpd.selectChannel.companyNameTh, //kob
            companyIdType: dataUpd.selectChannel.companyIdType, //kob
            companyTitleCode: dataUpd.selectChannel.companyTitleCode, //kob
            //prepare code for new param
            typeCode: dataUpd.selectChannel.typeCode,
            mapTypeSubTypeId: dataUpd.selectChannel.mapTypeSubTypeId,
            typeName: dataUpd.selectChannel.typeName,
            subTypeName: dataUpd.selectChannel.subTypeName,
            subTypeCode: dataUpd.selectChannel.subTypeCode,
            //start kob
            companyIdTypeName: dataUpd.selectChannel.companyIdTypeName,
            companyTitleEn: dataUpd.selectChannel.companyTitleEn,
            companyNameEn: dataUpd.selectChannel.companyNameEn,
            wtName: dataUpd.selectChannel.wtName,
            vatType: dataUpd.selectChannel.vatType,
            distChnSaleId: dataUpd.selectChannel.distChnSaleId,
            chnType: dataUpd.selectChannel.chnType,
            // end kob
            chnSalesGroupId: dataUpd.selectChannel.chnSalesGroupId,
            businessCode: dataUpd.selectChannel.businessCode,
            businessName: dataUpd.selectChannel.businessName,

        };


        var now = moment();
        locationDraft.modifiedBy = modifiedBy;
        locationDraft.modifiedDate = new Date(now.year(), now.month(), now.date(), now.hours(), now.minutes(), now.seconds(), now.milliseconds());
        locationDraft.save(function (errUpd, updatedDraft) {
            if (errUpd) {
                ret.responseCode = 500;
                ret.responseMessage = "Fail";
                ret.responseDescription = errUpd.message;
                res.json(ret);
            }
            logger.info("Update Success.");
            // ret.data = updatedDraft;
            res.json(ret);
        });
    });
};

exports.addLocationDraft = function (req, res) {
    try {
        logger.info('add Location draft');
        // var dataDraft = req.body;
        //logger.info('current user='+JSON.stringify(req.currentUser));
        draftAddSelectChannel(req, res);
    } catch (err) {
        var ret = {
            responseCode: 500,
            responseMessage: "Fail",
            error: err.message
        };
        res.status(500).json(ret);
    }

};


exports.getLocationDraftList = function (req, res) {
    logger.info('get Location draft list');
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };

    var filter = {};
    var userGroup = req.query.usergroup;
    var status = req.query.status;

    if (userGroup) {
        console.dir("filter User Group")
        console.log(userGroup)
        if (!Array.isArray(userGroup)) {
            var tmp = [];
            var arrStr = userGroup.split(",");
            arrStr.forEach(function (element) {
                if (element.length > 0) {
                    tmp.push(element);
                }
            });
            userGroup = tmp;
        }
        if (userGroup.indexOf("ADMIN") == -1) { //admin ignore userGroup
            var regxUg = "";
            userGroup.forEach(function (element) {
                if (element != undefined && element != "") {
                    if (regxUg == "") {
                        regxUg += "^" + element;
                    } else {
                        regxUg += "|^" + element;
                    }
                }
            });
            filter.userGroup = {
                $regex: new RegExp(regxUg)
                // $in: userGroup
            };
        }
    }
    // filter.status = {
    //     $ne: "DELETED"
    // };
    filter.status = {
        $nin: ["DELETED", "COMPLETED"]
    };

    if (status) {
        filter.status.$eq = status.toUpperCase();
    }

    locationDraftMod.find(filter, null, {
        sort: {
            createdDate: -1
        }
    }, function (err, result) {
        if (err) {
            logger.errorStack(err);
            ret.responseCode = 500;
            ret.responseMessage = 'Fail';
            ret.responseDescription = err.message;
            res.json(ret);
            throw err;
        }
        logger.info('get draft location list size :: ' + result.length);
        ret.data = result;
        res.json(ret);
    });
};

exports.getLocationDraftById = function (req, res) {
    var id = req.params.id;
    logger.info('get summary data by id = [' + id + ']');
    logger.info('get Location draft list');
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
            logger.info('get draft location success ');
            ret.data = result;
            res.json(ret);
        });
    } catch (error) {
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        res.json(ret);
    }
};

exports.updLocationDraft = function (req, res) {
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };

    var id = req.params.id;
    var dataUpd = req.body;
    var userId = req.currentUser.username;
    dataUpd.modifiedBy = userId;
    var step = dataUpd.step;
    var url = dataUpd.url;
    var modifiedBy = dataUpd.modifiedBy;
    if (!(modifiedBy)) {
        ret.responseCode = 400;
        ret.responseMessage = 'Bad request';
        ret.responseDescription = !modifiedBy ? 'filed[modifiedBy] is missing.' : 'filed[step] is missing.';
        res.json(ret);
        return;
    }
    logger.info('upd Location data by id = [' + id + ']');

    // checkFieldUpdLocationDraft(req, res, dataUpd);

    try {
        locationDraftMod.findById(id, function (err, result) {
            if (err) {
                ret.responseCode = 500;
                ret.responseMessage = 'Fail';
                ret.responseDescription = err.message;
                res.json(ret);
                return;
            }
            if (!result) {
                ret.responseCode = 404;
                ret.responseMessage = 'Data not found';
                ret.responseDescription = 'Data not found';
                res.json(ret);
                return;
            }
            logger.info('find draft location success ');
            var locationDraft = result;
            var now = moment();
            var expire = moment().add(7, 'days');  // edit by gun
            locationDraft.modifiedBy = modifiedBy;
            locationDraft.expire = new Date(expire.year(), expire.month(), expire.date(), expire.hours(), expire.minutes(), expire.seconds(), expire.milliseconds());
            locationDraft.modifiedDate = new Date(now.year(), now.month(), now.date(), now.hours(), now.minutes(), now.seconds(), now.milliseconds());

            if (dataUpd.selectChannel != undefined) {
                if (dataUpd.selectChannel.companyAbbr != locationDraft.pageGroup.selectChannel.companyAbbr ||
                    dataUpd.selectChannel.distChnCode != locationDraft.pageGroup.selectChannel.distChnCode ||
                    dataUpd.selectChannel.chnSalesCode != locationDraft.pageGroup.selectChannel.chnSalesCode ||
                    dataUpd.selectChannel.companyIdType != locationDraft.pageGroup.selectChannel.companyIdType ||
                    dataUpd.selectChannel.companyIdNo != locationDraft.pageGroup.selectChannel.companyIdNo ||
                    dataUpd.selectChannel.companyTitleTh != locationDraft.pageGroup.selectChannel.companyTitleTh ||
                    dataUpd.selectChannel.companyNameTh != locationDraft.pageGroup.selectChannel.companyNameTh ||
                    dataUpd.selectChannel.companyTitleEn != locationDraft.pageGroup.selectChannel.companyTitleEn ||
                    dataUpd.selectChannel.companyNameEn != locationDraft.pageGroup.selectChannel.companyNameEn ||
                    dataUpd.selectChannel.wtName != locationDraft.pageGroup.selectChannel.wtName ||
                    dataUpd.selectChannel.vatType != locationDraft.pageGroup.selectChannel.vatType) {

                    draftEditSelectChannel(locationDraft, req, res);
                    return;
                    //var userGroupAuth = Array.isArray(req.currentUser.userGroup)?req.currentUser.userGroup:[req.currentUser.userGroup] ;
                }
            } else if (dataUpd.profileInfo != undefined) {
                var profileInfo = dataUpd.profileInfo;
                var effDt = new Date(profileInfo.effectiveDt);
                logger.info(effDt.toString());
                profileInfo.effectiveDt = effDt;
                locationDraft.pageGroup.profileInfo = profileInfo;
                locationDraft.step = "1";
                locationDraft.url = url || '/location/new/location-info/' + locationDraft._id;
                logger.info('upd data step 1 location');

                locationDraft.save(function (errUpd, updatedDraft) {
                    if (errUpd) {
                        ret.responseCode = 500;
                        ret.responseMessage = "Fail";
                        ret.responseDescription = errUpd.message;
                        res.json(ret);
                    }
                    logger.info("Update Success.");
                    // ret.data = updatedDraft;
                    res.json(ret);
                });
                return;
            } else if (dataUpd.step2Product != undefined) {
                var step2Product = dataUpd.step2Product;
                locationDraft.pageGroup.step2Product = step2Product;
                locationDraft.step = "2";
                locationDraft.url = url || '/location/new/product/' + locationDraft._id;
                logger.info('upd data step 2 location');
                locationDraft.save(function (errUpd, updatedDraft) {
                    if (errUpd) {
                        ret.responseCode = 500;
                        ret.responseMessage = "Fail";
                        ret.responseDescription = errUpd.message;
                        res.json(ret);
                    }
                    logger.info("Update Success.");
                    // ret.data = updatedDraft;
                    res.json(ret);
                });
                return;
            } else if (dataUpd.retailDistributorInfo != undefined) {
                var retailDistributorInfo = dataUpd.retailDistributorInfo;
                locationDraft.pageGroup.retailDistributorInfo = retailDistributorInfo;
                logger.info('upd data retailDistributorInfo');
                locationDraft.save(function (errUpd, updatedDraft) {
                    if (errUpd) {
                        ret.responseCode = 500;
                        ret.responseMessage = "Fail";
                        ret.responseDescription = errUpd.message;
                        res.json(ret);
                    }
                    logger.info("Update Success.");
                    // ret.data = updatedDraft;
                    res.json(ret);
                });
                return;
            } else if (dataUpd.addressInfo != undefined) {
                var addressInfo = dataUpd.addressInfo;
                locationDraft.pageGroup.addressInfo = addressInfo;
                locationDraft.step = "3";
                locationDraft.url = url || '/location/new/address/' + locationDraft._id;
                logger.info('upd data step 3 location');
                var condition = [];
                for (var i = 0; i < locationDraft.userGroup.length; i++) {
                    condition.push({
                        groupName_data: {
                            $eq: locationDraft.userGroup[i]
                        }
                        //locationFlg: "Y",
                    });
                }
                // condition.push({
                //     locationFlg : "Y"
                // });
                console.dir("check Condition step 3")
                console.dir(condition)
                userGroupMod.aggregate([{
                    $match: {
                        locationFlg: "Y",
                        $or: condition,
                    }
                }, {
                    $group: {
                        _id: "$distChnCode_key1",
                        retail: {
                            $addToSet: {
                                code: "$retailShop_data",
                                name: "$groupName_data"
                            }
                        },


                        subRegion: {
                            $addToSet: {
                                code: "$saleSubRegionCode_data",
                                name: "$groupName_data"
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        retail: 1,
                        subRegion: 1
                    }
                }

                ], function (errUg, resultUg) {
                    if (errUg) {
                        ret.responseCode = 500;
                        ret.responseMessage = "Fail";
                        ret.responseDescription = errUg;
                        res.json(ret);
                        return;
                    }
                    var retail = resultUg[0].retail;
                    var subRegion = resultUg[0].subRegion;
                    var chkUserGroup = true;
                    var groupAll;
                    if (Array.isArray(retail)) {
                        for (var i = 0; i < retail.length; i++) {
                            if (chkUserGroup && retail[i].code != '') {
                                var address = locationDraft.pageGroup.addressInfo.address;
                                for (var j = 0; j < address.length; j++) {
                                    if (address[j].addressType == 'LOCATION_ADDR' && address[j].retailShop == retail[i].code) {
                                        locationDraft.userGroup = [retail[i].name];
                                        chkUserGroup = false;
                                        break;
                                    }
                                }
                            }

                            // if (retail[i].code != '' && locationDraft.pageGroup.step3Address.address.addressType == 'LOCATION_ADDR' &&
                            //     locationDraft.pageGroup.step3Address.address.retailShop == retail[i].code) {
                            //     locationDraft.userGroup = [retail[i].name];
                            //     chkUserGroup = false;
                            //     break;
                            // }
                        }
                    }
                    if (chkUserGroup && Array.isArray(subRegion)) {
                        for (var i = 0; i < subRegion.length; i++) {
                            if (chkUserGroup && subRegion[i].code != '') {
                                var address = locationDraft.pageGroup.addressInfo.address;
                                for (var j = 0; j < address.length; j++) {
                                    if (address[j].addressType == 'LOCATION_ADDR' && address[j].subRegionCode == subRegion[i].code) {
                                        locationDraft.userGroup = [subRegion[i].name];
                                        chkUserGroup = false;
                                        break;
                                    }
                                }
                            } else {
                                groupAll = [subRegion[i].name];
                            }
                        }
                    }
                    if (chkUserGroup) {
                        locationDraft.userGroup = groupAll;
                    }
                    locationDraft.save(function (errUpd, updatedDraft) {
                        if (errUpd) {
                            ret.responseCode = 500;
                            ret.responseMessage = "Fail";
                            ret.responseDescription = errUpd.message;
                            res.json(ret);
                        }
                        logger.info("Update Success.");
                        // ret.data = updatedDraft;
                        res.json(ret);
                    });
                });
                return;
            } else if (dataUpd.contactInfo != undefined) {
                var contactInfo = dataUpd.contactInfo;
                locationDraft.pageGroup.contactInfo = contactInfo;
                locationDraft.step = "4";
                locationDraft.url = url || '/location/new/contact/' + locationDraft._id;
                logger.info('upd data step 4 location');
                locationDraft.save(function (errUpd, updatedDraft) {
                    if (errUpd) {
                        ret.responseCode = 500;
                        ret.responseMessage = "Fail";
                        ret.responseDescription = errUpd.message;
                        res.json(ret);
                    }
                    logger.info("Update Success.");
                    // ret.data = updatedDraft;
                    res.json(ret);
                });
                return;
            } else if (dataUpd.financialInfo != undefined) {
                var financialInfo = dataUpd.financialInfo;
                locationDraft.pageGroup.financialInfo = financialInfo;
                locationDraft.url = url || '/location/new/financial/' + locationDraft._id;
                logger.info("Update finance Success.");
                locationDraft.save(function (errUpd, updatedDraft) {
                    if (errUpd) {
                        ret.responseCode = 500;
                        ret.responseMessage = "Fail";
                        ret.responseDescription = errUpd.message;
                        res.json(ret);
                    }
                    logger.info("Update Success.");
                    // ret.data = updatedDraft;
                    res.json(ret);
                });
                return;
            } else if (dataUpd.userLoginInfo != undefined) {
                var userLoginInfo = dataUpd.userLoginInfo;
                locationDraft.pageGroup.userLoginInfo = userLoginInfo;
                // locationDraft.url = url || '/location/new/financial/' + locationDraft._id;
                console.log("Update UserLogin", dataUpd);
                locationDraft.save(function (errUpd, updatedDraft) {
                    if (errUpd) {
                        ret.responseCode = 500;
                        ret.responseMessage = "Fail";
                        ret.responseDescription = errUpd.message;
                        res.json(ret);
                    }
                    logger.info("Update UserLogin Success.");
                    // ret.data = updatedDraft;
                    res.json(ret);
                });
                return;
            } else if (dataUpd.summary != undefined) {
                var summary = dataUpd.summary;
                locationDraft.pageGroup.summary = summary;
                locationDraft.step = "5";
                locationDraft.authAddrEn = dataUpd.authAddrEn
                locationDraft.url = url || '/location/new/contact/' + locationDraft._id;
                logger.info('upd data step 5 summary');
                locationDraft.save(function (errUpd, updatedDraft) {
                    if (errUpd) {
                        ret.responseCode = 500;
                        ret.responseMessage = "Fail";
                        ret.responseDescription = errUpd.message;
                        res.json(ret);
                    }
                    logger.info("Update Success.");
                    // ret.data = updatedDraft;
                    res.json(ret);
                });
                return;

            } else {
                ret.responseCode = 400;
                ret.responseMessage = 'Bad request';
                ret.responseDescription = "step not in condition";
                res.json(ret);
                return;
            }

            // /location/new/address/5
            // ret.responseCode = ;
            // ret.responseMessage = 'Bad request';
            // ret.responseDescription = "step not in condition";
            res.json(ret);
        });
    } catch (error) {
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        res.json(ret);
    }

};

exports.updLocationDraftOnestep = function (req, res) {
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };

    var id = req.params.id;
    var dataUpd = req.body;
    var userId = req.currentUser.username;
    dataUpd.modifiedBy = userId;
    var step = dataUpd.step;
    var url = dataUpd.url;
    var modifiedBy = dataUpd.modifiedBy;
    if (!(modifiedBy)) {
        ret.responseCode = 400;
        ret.responseMessage = 'Bad request';
        ret.responseDescription = !modifiedBy ? 'filed[modifiedBy] is missing.' : 'filed[step] is missing.';
        res.json(ret);
        return;
    }
    logger.info('upd Location data by id = [' + id + ']');

    try {
        locationDraftMod.findById(id, function (err, result) {
            if (err) {
                ret.responseCode = 500;
                ret.responseMessage = 'Fail';
                ret.responseDescription = err.message;
                res.json(ret);
                return;
            }
            if (!result) {
                ret.responseCode = 404;
                ret.responseMessage = 'Data not found';
                ret.responseDescription = 'Data not found';
                res.json(ret);
                return;
            }
            logger.info('find draft location success ');
            var locationDraft = result;
            var now = moment();
            var expire = moment().add(7, 'days');
            locationDraft.modifiedBy = modifiedBy;
            locationDraft.expire = new Date(expire.year(), expire.month(), expire.date(), expire.hours(), expire.minutes(), expire.seconds(), expire.milliseconds());
            locationDraft.modifiedDate = new Date(now.year(), now.month(), now.date(), now.hours(), now.minutes(), now.seconds(), now.milliseconds());
            if (dataUpd.data != undefined) {
                locationDraft.save(function (errUpd, updatedDraft) {
                    if (errUpd) {
                        ret.responseCode = 500;
                        ret.responseMessage = "Fail";
                        ret.responseDescription = errUpd.message;
                        res.json(ret);
                    }
                    logger.info("Update Success.");
                    // ret.data = updatedDraft;
                    res.json(ret);
                });
            }
        });

    } catch (error) {
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        res.json(ret);
    }

}


exports.delLocationDraftById = function (req, res) {
    var id = req.params.id;
    var currentUserId = req.currentUser.username;
    logger.info('Delete Location draft by id = [' + id + ']');
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };
    try {
        locationDraftMod.findById(id, function (err, locationDraft) {
            if (err) {
                ret.responseCode = 500;
                ret.responseMessage = 'Fail';
                ret.responseDescription = err.message;
                res.json(ret);
                return;
            }
            if (!locationDraft) {
                ret.responseCode = 404;
                ret.responseMessage = 'Data not found';
                ret.responseDescription = 'Data not found';
                res.json(ret);
                return;
            }
            logger.info('get draft location success ');
            var now = moment();
            locationDraft.status = "DELETED",
                locationDraft.modifiedBy = currentUserId;
            locationDraft.modifiedDate = new Date(now.year(), now.month(), now.date(), now.hours(), now.minutes(), now.seconds(), now.milliseconds());
            locationDraft.save(function (errUpd, updatedDraft) {
                if (errUpd) {
                    ret.responseCode = 500;
                    ret.responseMessage = "Fail";
                    ret.responseDescription = errUpd.message;
                    res.json(ret);
                }

                logger.info("Delete Success.");
                // ret.data = updatedDraft;
                res.json(ret);
            });

        });
    } catch (error) {
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        res.json(ret);
    }
};

exports.draftDelete = function (req, res) {
    var result = {
        responseCode: '',
        responseMessage: '',
        responseDescription: []
    }

    if (req.query.id && req.query.userFullname) {
        let mgQuery = {
            _id: req.query.id
        };
        let updateData = {
            $set: {
                modifiedBy: req.query.userFullname,
                modifiedDate: moment(),
                status: "DELETED"
            }
        };
        locationDraft.findOneAndUpdate(mgQuery, updateData, {
            new: true
        }, function (err, doc) {
            if (err) {
                re.json(err);
            } else {
                result.responseCode = 200;
                result.responseDescription = doc;
                res.json(result);
            }
        });
    } else {
        result.responseCode = 500;
        result.responseMessage = 'Invalid Parameter';
        res.json(result);
    }
};
