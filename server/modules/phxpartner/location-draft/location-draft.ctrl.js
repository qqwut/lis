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
const PREFIX = cfg.service.PANDORA.PREFIX
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
    var userId = req.currentUser.username;
    dataDraft.createdBy = userId;
    var userGroupAuth = Array.isArray(req.currentUser.userGroup) ? req.currentUser.userGroup : [req.currentUser.userGroup];
    console.log(userGroupAuth);
    if (!(dataDraft.companyAbbr && dataDraft.distChnCode &&
            dataDraft.chnSalesCode && dataDraft.createdBy)) {
        res.json({
            responseCode: 400,
            responseMessage: 'Bad request'
        });
        return;
    }
    
    var promises = [];
    var condition = {};
   
  //for user group admin edit by gun
    if( userGroupAuth.indexOf("ADMIN") != -1){
        condition = {
            distChnCode_key1: dataDraft.distChnCode,
            chnSalesCode_key2: dataDraft.chnSalesCode
        };
        
    }else {
        var regxUg ="";
        userGroupAuth.forEach(function(element) {
            if(element != undefined && element != "" ){ 
                if( regxUg == "" ){
                    regxUg += "^"+element;
                }else{
                    regxUg += "|^"+element;
                }
            }
        }); 
        condition = {
            distChnCode_key1: dataDraft.distChnCode,
            chnSalesCode_key2: dataDraft.chnSalesCode,
            groupName_data: 
                { $regex: new RegExp(regxUg)}
        };
    }
    
    var userGroupPm = userGroupMod.distinct('groupName_data', condition ,
        function (err, groupNameArr) {});
    promises.push(userGroupPm);

    var componyPm = companyMod.find({
        companyAbbr_data: dataDraft.companyAbbr
    }, function (err, result) {});
    promises.push(componyPm);

    Promise.all(promises).then(function (results) {
        var userGroups = results[0];
        // req.currentUser.userGroup. 

        // var userGroups = req.currentUser.userGroup;
        var company = results[1][0];

        var locDraft = {
            status: "PROGRESS",
            step: "0",
            url: "/location/new/select-channel",
            userGroup: userGroups,
            createdBy: dataDraft.createdBy,
            modifiedBy: dataDraft.createdBy
        };

        if (!company) {
            res.json({
                responseCode: 404,
                responseMessage: 'Data not fount',
                responseDescription: 'Not found company find by companyAbbr [' + dataDraft.companyAbbr + ']'
            });
            return;
        }

        var now = moment();
        var expire = moment().add(7, 'days');

        locDraft.expire = new Date(expire.year(), expire.month(), expire.date(), expire.hours(), expire.minutes(), expire.seconds(), expire.milliseconds());

        var createDt = new Date(now.year(), now.month(), now.date(), now.hours(), now.minutes(), now.seconds(), now.milliseconds());
        locDraft.createdDate = createDt;
        locDraft.modifiedDate = createDt;
        // locDraft.step = '0';
        locDraft.pageGroup = {};

        locDraft.pageGroup.selectChannel = {
            companyAbbr: dataDraft.companyAbbr,
            distChnCode: dataDraft.distChnCode,
            distChnName: dataDraft.distChnName,
            chnSalesCode: dataDraft.chnSalesCode,
            chnSalesName: dataDraft.chnSalesName,
            companyId: company.companyId_key0,
            companyIdNo: company.idNo_data,
            companyTitleTh: company.titleTh_data,
            companyNameTh: company.nameTh_data,
            companyIdType : company.idType_data //kk
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
    var userGroupPm = userGroupMod.distinct('groupName_data', {
        distChnCode_key1: dataUpd.selectChannel.distChnCode,
        chnSalesCode_key2: dataUpd.selectChannel.chnSalesCode,
        groupName_data: {
            $in: userGroupAuth
        }
    }, function (err, groupNameArr) {});
    promises.push(userGroupPm);

    var componyPm = companyMod.find({
        companyAbbr_data: dataUpd.selectChannel.companyAbbr
    }, function (err, result) {});
    promises.push(componyPm);

    Promise.all(promises).then(function (results) {
        var userGroups = results[0];
        var company = results[1][0];

        locationDraft.step = '0';
        locationDraft.url = '/location/new/select-channel/' + locationDraft._id;
        locationDraft.modifiedBy = modifiedBy;
        locationDraft.userGroup = userGroups;
        if (!company) {
            res.json({
                responseCode: 404,
                responseMessage: 'Data not fount',
                responseDescription: 'Not found company find by companyAbbr [' + dataUpd.selectChannel.companyAbbr + ']'
            });
            return;
        }



        locationDraft.pageGroup.selectChannel = {
            companyAbbr: dataUpd.selectChannel.companyAbbr,
            distChnCode: dataUpd.selectChannel.distChnCode,
            distChnName: dataUpd.selectChannel.distChnName,
            chnSalesCode: dataUpd.selectChannel.chnSalesCode,
            chnSalesName: dataUpd.selectChannel.chnSalesName,
            companyId: company.companyId_key0,
            companyIdNo: company.idNo_data,
            companyTitleTh: company.titleTh_data,
            companyNameTh: company.nameTh_data,
            companyIdType : company.idType_data//kk
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
            var regxUg ="";
            userGroup.forEach(function(element) {
                if(element != undefined && element != "" ){ 
                    if( regxUg == "" ){
                        regxUg += "^"+element;
                    }else{
                        regxUg += "|^"+element;
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
    var modifiedBy = dataUpd.modifiedBy;
    if (!(modifiedBy && step)) {
        ret.responseCode = 400;
        ret.responseMessage = 'Bad request';
        ret.responseDescription = !modifiedBy ? 'filed[modifiedBy] is missing.' : 'filed[step] is missing.';
        res.json(ret);
        return;
    }
    logger.info('upd Location data by id = [' + id + ']');

    checkFieldUpdLocationDraft(req, res, dataUpd);

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

            if (step == "0") {
                if (dataUpd.selectChannel.companyAbbr != locationDraft.pageGroup.selectChannel.companyAbbr ||
                    dataUpd.selectChannel.distChnCode != locationDraft.pageGroup.selectChannel.distChnCode ||
                    dataUpd.selectChannel.chnSalesCode != locationDraft.pageGroup.selectChannel.chnSalesCode) {

                    draftEditSelectChannel(locationDraft, req, res);
                    return;
                    //var userGroupAuth = Array.isArray(req.currentUser.userGroup)?req.currentUser.userGroup:[req.currentUser.userGroup] ;
                }
            } else if (step == "1") {
                var profileInfo = dataUpd.profileInfo;
                var effDt = new Date(profileInfo.effectiveDt);
                logger.info(effDt.toString());
                profileInfo.effectiveDt = effDt;
                locationDraft.pageGroup.profileInfo = profileInfo;
                locationDraft.step = "1";
                locationDraft.url = '/location/new/location-info/' + locationDraft._id;
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
            } else if (step == "2") {
                var step2Product = dataUpd.step2Product;
                locationDraft.pageGroup.step2Product = step2Product;
                locationDraft.step = "2";
                locationDraft.url = '/location/new/product/' + locationDraft._id;
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
            } else if (step == "3") {
                var addressInfo = dataUpd.addressInfo;
                var effDt = new Date(addressInfo.vatAddress.effectiveDt);
                var endDt = new Date(addressInfo.vatAddress.endDt);
                locationDraft.pageGroup.addressInfo = addressInfo;
                addressInfo.vatAddress.effectiveDt = effDt;
                addressInfo.vatAddress.endDt = endDt;
                locationDraft.step = "3";
                locationDraft.url = '/location/new/address/' + locationDraft._id;
                logger.info('upd data step 3 location');
                var condition = [];
                for (var i = 0; i < locationDraft.userGroup.length; i++) {
                    condition.push({
                        groupName_data: {
                            $eq: locationDraft.userGroup[i]
                        }
                    });
                }
                userGroupMod.aggregate([{
                        $match: {
                            $or: condition
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
                            }
                        }
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
            } else if (step == "4") {
                var contactInfo = dataUpd.contactInfot;
                locationDraft.pageGroup.contactInfo = contactInfo;
                locationDraft.step = "4";
                locationDraft.url = '/location/new/contact/' + locationDraft._id;
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
            } else if (step == "5") {
                var summary = dataUpd.summary;
                locationDraft.pageGroup.summary = summary; 
                locationDraft.step = "5";
                locationDraft.url = '/location/new/contact/' + locationDraft._id;
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

exports.getCheckDup = function (req, res) {
    var result = {
        responseCode: '',
        responseMessage: '',
        responseDescription: []
    }
    var query = req.query;

    // logger.info('Api search location');
    var filter = req.body || {};
    
    logger.debug('filter:' + JSON.stringify(filter));
    var ret = {};
    try {
        // filter.groupCode = req.currentUser.userGroup;
        var queryStr = utils.getSDFFilter2QueryStr(null, query);
        var uri = cfg.service.PANDORA.URI+PREFIX  + '/company/chk-duplicate.json?filter=' + queryStr;
        
        logger.info('prepare option to sent request : ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'SEARCH_LOCATION',
            reqId: req.id,
        }).then(function (response) {

            logger.info('response  :: ' + response.resultCode + ':' + response.resultDescription);
            if (parseInt(response.resultCode) != 20000) {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = 'Fail';
                ret.responseDescription = response.resultDescription;
                res.json(ret);
            }else{
                ret.responseCode = 200;
                ret.responseDescription = 'Success';
                ret.data = response.resultData.partnerCompnay;
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

exports.getCheckDupAbbr = function (req, res) {
    var result = {
        responseCode: '',
        responseMessage: '',
        responseDescription: []
    }
    var query = req.query;

    // logger.info('Api search location');
    var filter = req.body || {};
    
    logger.debug('filter:' + JSON.stringify(filter));
    var ret = {};
    try {
        // filter.groupCode = req.currentUser.userGroup;
        var queryStr = utils.getSDFFilter2QueryStr(null, query);
        var uri = cfg.service.PANDORA.URI+PREFIX  + '/company/chk-duplicate-abbr.json?filter=' + queryStr;
        
        logger.info('prepare option to sent request : ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'SEARCH_LOCATION',
            reqId: req.id,
        }).then(function (response) {

            logger.info('response  :: ' + response.resultCode + ':' + response.resultDescription);
            if (parseInt(response.resultCode) != 20000) {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = 'Fail';
                ret.responseDescription = response.resultDescription;
                res.json(ret);
            }else{
                ret.responseCode = 200;
                ret.responseDescription = 'Success';
                ret.data = response.resultData.partnerCompnay;
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
