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
var rep = require('../../../config/replace.js');
var dataLocationDummy = [];
var testDummyData = cfg.mockup_data ? parseInt(cfg.mockup_data) : 0;
const PREFIX = cfg.service.PANDORA.PREFIX
// exports.getSummaryById = function (req, res) {
//     logger.info('get summary data');
//     var obj;
//     var filePath = path.join(__dirname, '../../../data/location-summary.json');
//     fs.readFile(filePath, 'utf8', function (err, data) {
//         if (err) { // throw err;
//             res.status(500).json({
//                 responseCode: 500,
//                 responseMessage: 'Fail',
//                 error: err
//             });
//             return;
//         }
//         obj = JSON.parse(data);
//         res.json({
//             resultCode: 20000,
//             resultDescription: 'Success',
//             data: obj
//         });
//     });
// };

// exports.getSummary = function (req, res) {
//     logger.info('get summary data');

//     // // Sync:
//     // var fs = require('fs');
//     // var obj = JSON.parse(fs.readFileSync('file', 'utf8'));
//     // Async:
//     // var fs = require('fs')
//     var obj;
//     var filePath = path.join(__dirname, '../../../data/location-summary.json');
//     fs.readFile(filePath, 'utf8', function (err, data) {
//         if (err) { // throw err;
//             res.status(500).json({
//                 responseCode: 500,
//                 responseMessage: 'Fail',
//                 error: err
//             });
//             return;
//         }
//         obj = JSON.parse(data);
//         res.json({
//             resultCode: 20000,
//             resultDescription: 'Success',
//             data: obj
//         });
//     });
// };

exports.getCompany = function (req, res) {
    logger.info('get company data');
    var internalCompanyFlag = req.query.internalCompanyFlag;
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };

    var filter = {};
    var internalCompanyFlag = req.query.internalCompanyFlag;

    if (internalCompanyFlag && internalCompanyFlag.length > 0) {
        filter.internalCompanyFlag_data = internalCompanyFlag;
    } else {
        ret.responseCode = 400;
        ret.responseMessage = 'Bad Request';
        res.json(ret);
        return;
    }
    filter.status_data = {
        $ne: "DELETED"
    };
    companyMod.find(filter, null, {
        sort: {
            companyId_key0: 1
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
        var data = [];
        if (result) {
            for (var i = 0; i < result.length; i++) {
                var company = {};
                company.id = result[i]._id;
                company.companyId = result[i].companyId_key0;
                company.companyAbbr = result[i].companyAbbr_data;
                company.vatBranchNo = result[i].vatBranchNo_data;
                company.idType = result[i].idType_data;
                company.idNo = result[i].idNo_data;
                company.abbrev = result[i].abbrev_data;
                company.prefixCompany = result[i].prefixCompany_data;
                company.saleOrgCode = result[i].saleOrgCode_data;
                company.titleTh = result[i].titleTh_data;
                company.nameTh = result[i].nameTh_data;
                company.titleEn = result[i].titleEn_data;
                company.nameEn = result[i].nameEn_data;
                company.internalCompanyFlag = result[i].internalCompanyFlag_data;
                company.status = result[i].status_data;
                company.effectiveDt = result[i].effectiveDt_data;
                company.terminateDt = result[i].terminateDt_data;
                company.mainPhoneType = result[i].mainPhoneType_data;
                company.mainPhoneNumber = result[i].mainPhoneNumber_data;
                company.mainPhoneExt = result[i].mainPhoneExt_data;
                company.faxNumber = result[i].faxNumber_data;
                company.remark = result[i].remark_data;
                company.created = result[i].created_data;
                company.createdBy = result[i].createdBy_data;
                company.lastUpd = result[i].lastUpd_data;
                company.lastUpdByv = result[i].lastUpdBy_data;
                data.push(company);
            }
        }
        ret.data = data;
        res.json(ret);
    });
};

exports.getUserGroup = function (req, res) {
    logger.info('get usergroup data');

    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };

    var filter = {};
    var userGroupAuthArr = [];
    var userGroupAuth = req.query.userGroupAuth;

    var condition = [];

    if (userGroupAuth && userGroupAuth.length > 0) {
        userGroupAuthArr = userGroupAuth.split(',');
        if (userGroupAuthArr.indexOf("ADMIN") == -1) { //admin ignore userGroup
            for (var i = 0; i < userGroupAuthArr.length; i++) {
                if (userGroupAuthArr[i].length > 0) {
                    condition.push({
                        groupName_data: {
                            $eq: userGroupAuthArr[i]
                        }
                    });

                }

            }
        }

    } else {
        ret.responseCode = 400;
        ret.responseMessage = 'Bad Request';
        res.json(ret);
        return;
    }

    userGroupMod.aggregate([{
        $match: {
            $or: condition
        }
    },
    {
        $lookup: {
            from: "mappingCompany",
            localField: "chnSalesCode_key2",
            foreignField: "chnSalesCode_key1",
            as: "mapComp"
        }
    },
    {
        $group: {
            _id: "$distChnCode_key1",
            distChn: {
                $addToSet: {
                    code: "$distChnCode_key1",
                    name: "$distChnName_data"
                }
            },
            chnSales: {
                $addToSet: {
                    code: "$chnSalesCode_key2",
                    name: "$chnSaleName_data",
                    companyAbbr: "$mapComp.companyAbbr_key2"
                }
            },
        }
    },
    {
        $project: {
            _id: 1,
            distChn: 1,
            chnSales: 1
        }
    }
    ], function (err, result) {
        if (err) {
            res.status(500).json({
                responseCode: 50000,
                responseMessage: 'Fail',
                error: err
            });
            return;
        }

        var data = [];
        ret.data = result;
        res.json(ret);
    });
};

exports.getOpenHour = function (req, res) {
    logger.info('get open hour data');
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };

    var filter = {};
    var chnSaleCode = req.params.chnSaleCode;
    var shopArea = req.query.shopArea || '';
    var shopType = req.query.shopType || '';

    var condition = [];
    var fieldSel = {
        "$project": {
            'dayOfWeek': "$dayOfWeek_data",
            'timeOpen': "$timeOpen_data",
            'timeClose': "$timeClose_data",
            "shopType": "$shopType_data",
            "shopArea": "$shopArea_data",

        }
    };

    if (chnSaleCode) {
        condition.push({
            chnSalesGrp_data: {
                $eq: chnSaleCode
            }
        });
    } else {
        ret.responseCode = 400;
        ret.responseMessage = 'Bad Request';
        res.json(ret);
        return;
    }

    // if(shopArea)  
    condition.push({
        shopArea_data: {
            $eq: shopArea
        }
    });
    // if(shopType)  
    condition.push({
        shopType_data: {
            $eq: shopType
        }
    });
    openingHoursMod.aggregate([{
        $match: {
            $and: condition
        }
    },
        fieldSel
    ], function (err, result) {
        if (err) {
            res.status(500).json({
                responseCode: 500,
                responseMessage: 'Fail',
                error: err
            });
            return;
        }
        if (result.length > 0) {
            ret.data = result;
            res.json(ret);
            return;
        }
        condition = [];
        condition.push({
            chnSalesGrp_data: {
                $eq: _CONST.OPEN_HOUR_DEFAULT_FLG
            }
        });
        condition.push({
            shopArea_data: {
                $eq: _CONST.OPEN_HOUR_DEFAULT_FLG
            }
        });
        condition.push({
            shopType_data: {
                $eq: _CONST.OPEN_HOUR_DEFAULT_FLG
            }
        });

        openingHoursMod.aggregate([{
            $match: {
                $and: condition
            }
        },
            fieldSel
        ], function (errDef, resultDef) {
            if (errDef) {
                ret.data = resultDef;
                res.json(ret);
                return;
            }
            ret.data = resultDef;
            res.json(ret);
        });

    });
};

exports.getRegion = function (req, res) {
    logger.info('get region data');
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };

    var filter = {};
    var provinceCode = req.params.provinceCode;

    var condition = [];
    if (provinceCode && provinceCode.length > 0) {
        condition.push({
            provinceCode_key0: {
                $eq: provinceCode
            }
        });
    } else {
        ret.responseCode = 400;
        ret.responseMessage = 'Bad Request';
        res.json(ret);
        return;
    }

    mappingRegionMod.aggregate([{
        $match: {
            $and: condition
        }
    },
    {
        "$project": {
            'subRegionCode': '$saleSubRegionCode_data'
        }
    }
    ], function (err, result) {
        if (err) {
            res.status(500).json({
                responseCode: 50000,
                responseMessage: 'Fail',
                error: err
            });
            return;
        }

        ret.data = result;
        res.json(ret);
    });
};



exports.mappingRegion = function (req, res) {
    logger.info('get mappingRegion data');
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };

    var filter = {};
    var subRegion = req.params.subRegion;

    var condition = [];
    if (subRegion && subRegion.length > 0) {
        condition.push({
            subRegion: {
                $eq: subRegion
            }
        });
    } else {
        ret.responseCode = 400;
        ret.responseMessage = 'Bad Request';
        res.json(ret);
        return;
    }

    mappingRegionMod.aggregate([
        {
            $lookup: {
                from: "region",
                localField: "regionCode_key2",
                foreignField: "code",
                as: "regionData"
            }
        },
        {
            $unwind: "$regionData"
        },
        {
            $lookup: {
                from: "subRegion",
                localField: "saleSubRegionCode_data",
                foreignField: "code",
                as: "subRegionData"
            }
        },
        {
            $unwind: "$subRegionData"
        },
        {
            $match: {
                $and: [{
                    saleSubRegionCode_data: {
                        $eq: subRegion
                    }
                }]
            }
        },
        {
            "$project": {

                "regionCode": "$regionCode_key2",
                "subRegion": "$saleSubRegionCode_data",
                "regionNameEn": "$regionData.nameEn",
                "regionNameTh": "$regionData.nameTh",
                "subRegionNameTh": "$subRegionData.nameTh",
                "subRegionNameEn": "$subRegionData.nameEn"
            }
        },
        {
            $limit: 1
        }
    ], function (err, result) {
        if (err) {
            res.status(500).json({
                responseCode: 50000,
                responseMessage: 'Fail',
                error: err
            });
            return;
        }

        ret.data = result;
        res.json(ret);
    });
};

exports.getProvince = function (req, res) {
    logger.info('get province data');

    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };

    var userGroupArr = [];
    var userGroup = req.query.userGroup;

    var condition = [];
    if (userGroup && userGroup.length > 0) {
        userGroupArr = userGroup.split(',');
        for (var i = 0; i < userGroupArr.length; i++) {
            condition.push({
                groupName_data: {
                    $eq: userGroupArr[i]
                }
            });
        }
    } else {
        ret.responseCode = 400;
        ret.responseMessage = 'Bad Request';
        res.json(ret);
        return;
    }

    userGroupMod.aggregate([{
        $match: {
            $or: condition
        }
    },
    {
        $group: {
            _id: "$distChnCode_key1",
            retail: {
                $addToSet: {
                    code: "$retailShop_data"
                }
            },
            subRegion: {
                $addToSet: {
                    code: "$saleSubRegionCode_data"
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
    ], function (err, permission) {
        if (err) {
            res.status(500).json({
                responseCode: 500,
                responseMessage: 'Fail',
                error: err
            });
            return;
        }

        if (permission && permission[0]) {
            var retail = permission[0].retail;
            var subRegion = permission[0].subRegion;
            if (retail && retail[0] && retail[0].code && retail[0].code.length > 0) {
                var aggregate = [];
                if (retail.length === 1) {
                    aggregate = [{
                        $lookup: {
                            from: "mappingRegion",
                            localField: "provinceCode_key0",
                            foreignField: "provinceCode_key0",
                            as: "subRegion"
                        }
                    },
                    {
                        $match: {
                            retailShop_data: retail[0].code
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            "provinceCode": "$provinceCode_key0",
                            "provinceNameTh": "$provinceNameTh_data",
                            "retailShop": "$retailShop_data",
                            "subRegion": "$subRegion.saleSubRegionCode_data"

                        }
                    },
                    {
                        $sort: {
                            provinceNameTh: 1
                        }
                    }
                    ];
                } else {
                    aggregate = [{
                        $lookup: {
                            from: "mappingRegion",
                            localField: "provinceCode_key0",
                            foreignField: "provinceCode_key0",
                            as: "subRegion"
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            "provinceCode": "$provinceCode_key0",
                            "provinceNameTh": "$provinceNameTh_data",
                            "retailShop": "$retailShop_data",
                            "subRegion": "$subRegion.saleSubRegionCode_data"

                        }
                    },
                    {
                        $sort: {
                            provinceNameTh: 1
                        }
                    }
                    ];
                }
                provinceMod.aggregate(aggregate, function (err, result) {
                    if (err) {
                        res.status(500).json({
                            responseCode: 500,
                            responseMessage: 'Fail',
                            error: err
                        });
                        return;
                    }

                    ret.data = result;
                    res.json(ret);
                });
            } else if (subRegion && subRegion[0] && subRegion[0].code && subRegion[0].code.length > 0) {
                var aggregate = [];
                var condition = [];
                for (var i = 0; i < subRegion.length; i++) {
                    condition.push({
                        saleSubRegionCode_data: {
                            $eq: subRegion[i].code
                        }
                    });
                }
                aggregate = [{
                    $lookup: {
                        from: "province", // change province to province2
                        localField: "provinceCode_key0",
                        foreignField: "provinceCode_key0",
                        as: "province"
                    }
                },
                {
                    $match: {
                        $or: condition
                    }
                },
                {
                    "$unwind": "$provinceCode_key0"
                },
                {
                    "$unwind": "$province"
                },
                {
                    $project: {
                        _id: 1,
                        "subRegion": "$saleSubRegionCode_data",
                        "provinceCode": "$provinceCode_key0",
                        "provinceNameTh": "$province.provinceNameTh_data",
                        "retailShop": "$province.retailShop_data"
                    }
                },
                {
                    $sort: {
                        provinceNameTh: 1
                    }
                }

                ];
                mappingRegionMod.aggregate(aggregate, function (err, result) {
                    if (err) {
                        res.status(500).json({
                            responseCode: 500,
                            responseMessage: 'Fail',
                            error: err
                        });
                        return;
                    }

                    ret.data = result;
                    res.json(ret);
                });
            } else {
                provinceMod.aggregate([{
                    $lookup: {
                        from: "mappingRegion",
                        localField: "provinceCode_key0",
                        foreignField: "provinceCode_key0",
                        as: "subRegion"
                    }
                },
                {
                    $project: {
                        _id: 0,
                        "provinceCode": "$provinceCode_key0",
                        "provinceNameTh": "$provinceNameTh_data",
                        "retailShop": "$retailShop_data",
                        "subRegion": "$subRegion.saleSubRegionCode_data"
                    }
                },
                {
                    $sort: {
                        provinceNameTh: 1
                    }
                }
                ], function (err, result) {
                    if (err) {
                        res.status(500).json({
                            responseCode: 500,
                            responseMessage: 'Fail',
                            error: err
                        });
                        return;
                    }
                    ret.data = result;
                    res.json(ret);
                });
            }
        }
    });
};

exports.getZipCode = function (req, res) {
    logger.info('get zipcode data');

    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };

    var userGroupArr = [];
    var userGroup = req.query.userGroup;
    var provinceCode = req.query.provinceCode;
    var provinceName = req.query.provinceName;
    var amphurTh = req.query.amphurTh;
    var tumbolTh = req.query.tumbolTh;
    var zipCode = req.query.zipCode;
    var subRegion = req.query.subRegion;

    var condition = [];
    if (userGroup && userGroup.length > 0) {
        userGroupArr = userGroup.split(',');
        for (var i = 0; i < userGroupArr.length; i++) {
            if (userGroupArr[i] != null && userGroupArr[i].trim().length > 0) {
                condition.push({
                    groupName_data: {
                        $eq: userGroupArr[i]
                    }
                });
            }
        }
    } else {
        ret.responseCode = 400;
        ret.responseMessage = 'Bad Request';
        res.json(ret);
        return;
    }

    userGroupMod.aggregate([{
        $match: {
            $or: condition
        }
    },
    {
        $group: {
            _id: "$distChnCode_key1",
            retail: {
                $addToSet: {
                    code: "$retailShop_data"
                }
            },
            subRegion: {
                $addToSet: {
                    code: "$saleSubRegionCode_data"
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
    ], function (err, permission) {
        if (err) {
            res.status(500).json({
                responseCode: 500,
                responseMessage: 'Fail',
                error: err
            });
            return;
        }

        if (permission && permission[0]) {
            var retail = permission[0].retail;
            var subRegion = permission[0].subRegion;
            if (retail && retail[0] && retail[0].code && retail[0].code.length > 0) { //case retail
                logger.info('Case : retail');
                var aggregate = [];
                if (retail.length === 1) {
                    aggregate = [{
                        $lookup: {
                            from: "mappingRegion",
                            localField: "provinceCode_key0",
                            foreignField: "provinceCode_key0",
                            as: "subRegion"
                        }
                    },
                    {
                        $match: {
                            retailShop_data: retail[0].code
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            "provinceCode": "$provinceCode_key0",
                            "provinceNameTh": "$provinceNameTh_data",
                            "retailShop": "$retailShop_data",
                            "subRegion": "$subRegion.saleSubRegionCode_data"

                        }
                    },
                    {
                        $sort: {
                            provinceNameTh: 1
                        }
                    }
                    ];
                } else {
                    aggregate = [{
                        $lookup: {
                            from: "mappingRegion",
                            localField: "provinceCode_key0",
                            foreignField: "provinceCode_key0",
                            as: "subRegion"
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            "provinceCode": "$provinceCode_key0",
                            "provinceNameTh": "$provinceNameTh_data",
                            "retailShop": "$retailShop_data",
                            "subRegion": "$subRegion.saleSubRegionCode_data"

                        }
                    },
                    {
                        $sort: {
                            provinceNameTh: 1
                        }
                    }
                    ];
                }
                provinceMod.aggregate(aggregate, function (err, province) {
                    if (err) {
                        res.status(500).json({
                            responseCode: 500,
                            responseMessage: 'Fail',
                            error: err
                        });
                        return;
                    }
                    var condition = {};
                    if (zipCode && zipCode.length > 0) {
                        if (zipCode.indexOf('*') > 0) {
                            var regexValue = utils.regexMongoStartWith(zipCode);
                            condition.zipCode_key2 = {
                                $regex: new RegExp(regexValue)
                            };
                        } else {
                            condition.zipCode_key2 = {
                                $eq: zipCode
                            };
                        }
                    }
                    if (provinceCode && provinceCode.length > 0) {
                        if (provinceCode.indexOf('*') > 0) {
                            var regexValue = utils.regexMongoStartWith(provinceCode);
                            condition.provinceCode_key1 = {
                                $regex: new RegExp(regexValue)
                            };
                        } else {
                            condition.provinceCode_key1 = {
                                $eq: provinceCode
                            };
                        }
                        //condition.push( { provinceCode_key1: { $regex: re }});
                    } else {
                        var p = [];
                        if (province && province.length > 0) {
                            for (var i = 0; i < province.length; i++) {
                                p.push(province[i].provinceCode);
                            }
                            condition.provinceCode_key1 = {
                                $in: p
                            };
                            //condition.push( { provinceCode_key1: { $in: p }});
                        }
                    }
                    if (amphurTh && amphurTh.length > 0) {
                        if (amphurTh.indexOf('*') > 0) {
                            var regexValue = utils.regexMongoStartWith(amphurTh);
                            condition.amphurTh_key3 = {
                                $regex: new RegExp(regexValue)
                            };
                        } else {
                            condition.amphurTh_key3 = {
                                $eq: amphurTh
                            };
                        }
                        //condition.push( { amphurTh_key3: { $regex: re }});
                    }
                    if (tumbolTh && tumbolTh.length > 0) {
                        if (tumbolTh.indexOf('*') > 0) {
                            var regexValue = utils.regexMongoStartWith(tumbolTh);
                            condition.tumbolTh_key4 = {
                                $regex: new RegExp(regexValue)
                            };
                        } else {
                            condition.tumbolTh_key4 = {
                                $eq: tumbolTh
                            };
                        }
                        //condition.push( { tumbolTh_key4: { $regex: re }});
                    }
                    zipCodeMod.aggregate([{
                        $lookup: {
                            from: "province", // other table name
                            localField: "provinceCode_key1", // name of users table field
                            foreignField: "provinceCode_key0", // name of userinfo table field
                            as: "provinceData" // alias for userinfo table
                        }
                    },
                    {
                        $unwind: "$provinceData"
                    }, // $unwind used for getting data in object or for one record only

                    // Join with user_role table
                    {
                        $lookup: {
                            from: "mappingRegion",
                            localField: "provinceCode_key1",
                            foreignField: "provinceCode_key0",
                            as: "RegionData"
                        }
                    },
                    {
                        $unwind: "$RegionData"
                    },
                    {
                        $match: {
                            $and: [condition]
                        }
                    },
                    {
                        "$project": {

                            "zipCodeId": "$zipCodeId_key0",
                            "zipCode": "$zipCode_key2",
                            "tumbolTh": "$tumbolTh_key4",
                            "amphurTh": "$amphurTh_key3",
                            "provinceCode": "$provinceCode_key1",
                            "provinceName": "$provinceData.provinceNameTh_data",
                            "retailShop": "$provinceData.retailShop_data",
                            "subRegion": "$RegionData.saleSubRegionCode_data",
                            "tumbolEn": "$tumbolEn_key6",
                            "amphurEn": "$amphurEn_key5",
                            "provinceNameEn": "$provinceData.provinceNameEn_data",
                        }
                    }
                    ], function (err, result) {
                        if (err) {
                            res.status(500).json({
                                responseCode: 500,
                                responseMessage: 'Fail',
                                error: err
                            });
                            return;
                        }
                        if (province) {
                            result.forEach(function (r) {
                                province.forEach(function (p) {
                                    if (r.provinceCode === p.provinceCode) {
                                        r.provinceName = p.provinceNameTh;
                                        r.retailShop = p.retailShop;
                                        // r.subRegion = p.subRegion;
                                    }
                                });
                            });
                            ret.data = result;
                            res.json(ret);
                        }
                    });
                });
            } else if (subRegion && subRegion[0] && subRegion[0].code && subRegion[0].code.length > 0) { //case subRegion
                logger.info('Case : subRegion');
                var aggregate = [];
                var condition = [];
                for (var i = 0; i < subRegion.length; i++) {
                    condition.push({
                        saleSubRegionCode_data: {
                            $eq: subRegion[i].code
                        }
                    });
                }
                aggregate = [{
                    $lookup: {
                        from: "province",
                        localField: "provinceCode_key0",
                        foreignField: "provinceCode_key0",
                        as: "province"
                    }
                },
                {
                    $match: {
                        $or: condition
                    }
                },
                {
                    "$unwind": "$provinceCode_key0"
                },
                {
                    "$unwind": "$province"
                },
                {
                    $project: {
                        _id: 1,
                        "subRegion": "$saleSubRegionCode_data",
                        "provinceCode": "$provinceCode_key0",
                        "provinceNameTh": "$province.provinceNameTh_data",
                        "retailShop": "$province.retailShop_data"
                    }
                },
                {
                    $sort: {
                        provinceNameTh: 1
                    }
                }

                ];
                mappingRegionMod.aggregate(aggregate, function (err, province) {
                    if (err) {
                        res.status(500).json({
                            responseCode: 500,
                            responseMessage: 'Fail',
                            error: err
                        });
                        return;
                    }
                    var condition = {};
                    if (zipCode && zipCode.length > 0) {
                        if (zipCode.indexOf('*') > 0) {
                            var regexValue = utils.regexMongoStartWith(zipCode);
                            condition.zipCode_key2 = {
                                $regex: new RegExp(regexValue)
                            };
                        } else {
                            condition.zipCode_key2 = {
                                $eq: zipCode
                            };
                        }
                    }
                    if (provinceCode && provinceCode.length > 0) {
                        if (provinceCode.indexOf('*') > 0) {
                            var regexValue = utils.regexMongoStartWith(provinceCode);
                            condition.provinceCode_key1 = {
                                $regex: new RegExp(regexValue)
                            };
                        } else {
                            condition.provinceCode_key1 = {
                                $eq: provinceCode
                            };
                        }
                        //condition.push( { provinceCode_key1: { $regex: re }});
                    } else {
                        var p = [];
                        if (province && province.length > 0) {
                            for (var i = 0; i < province.length; i++) {
                                p.push(province[i].provinceCode);
                            }
                            condition.provinceCode_key1 = {
                                $in: p
                            };
                            //condition.push( { provinceCode_key1: { $in: p }});
                        }
                    }
                    if (amphurTh && amphurTh.length > 0) {
                        if (amphurTh.indexOf('*') > 0) {
                            var regexValue = utils.regexMongoStartWith(amphurTh);
                            condition.amphurTh_key3 = {
                                $regex: new RegExp(regexValue)
                            };
                        } else {
                            condition.amphurTh_key3 = {
                                $eq: amphurTh
                            };
                        }
                        //condition.push( { amphurTh_key3: { $regex: re }});
                    }
                    if (tumbolTh && tumbolTh.length > 0) {
                        if (tumbolTh.indexOf('*') > 0) {
                            var regexValue = utils.regexMongoStartWith(tumbolTh);
                            condition.tumbolTh_key4 = {
                                $regex: new RegExp(regexValue)
                            };
                        } else {
                            condition.tumbolTh_key4 = {
                                $eq: tumbolTh
                            };
                        }
                        //condition.push( { tumbolTh_key4: { $regex: re }});
                    }
                    zipCodeMod.aggregate([{
                        $lookup: {
                            from: "province", // other table name
                            localField: "provinceCode_key1", // name of users table field
                            foreignField: "provinceCode_key0", // name of userinfo table field
                            as: "provinceData" // alias for userinfo table
                        }
                    },
                    {
                        $unwind: "$provinceData"
                    }, // $unwind used for getting data in object or for one record only

                    // Join with user_role table
                    {
                        $lookup: {
                            from: "mappingRegion",
                            localField: "provinceCode_key1",
                            foreignField: "provinceCode_key0",
                            as: "RegionData"
                        }
                    },
                    {
                        $unwind: "$RegionData"
                    },
                    {
                        $match: {
                            $and: [condition]
                        }
                    },
                    {
                        "$project": {
                            "zipCodeId": "$zipCodeId_key0",
                            "zipCode": "$zipCode_key2",
                            "tumbolTh": "$tumbolTh_key4",
                            "amphurTh": "$amphurTh_key3",
                            "provinceCode": "$provinceCode_key1",
                            "provinceName": "$provinceData.provinceNameTh_data",
                            "retailShop": "$provinceData.retailShop_data",
                            "subRegion": "$RegionData.saleSubRegionCode_data",
                            "tumbolEn": "$tumbolEn_key6",
                            "amphurEn": "$amphurEn_key5",
                            "provinceNameEn": "$provinceData.provinceNameEn_data",
                        }
                    }
                    ], function (err, result) {
                        if (err) {
                            res.status(500).json({
                                responseCode: 500,
                                responseMessage: 'Fail',
                                error: err
                            });
                            return;
                        } else if (result.length == 0) {
                            res.json({
                                responseCode: 404,
                                responseMessage: 'Data not found'
                            });
                            return;
                        }
                        ret.data = result;
                        res.json(ret);
                    });
                });
            } else {
                logger.info('Case : no Retail & subRegion');
                var condition = {};
                if (zipCode && zipCode.length > 0) {
                    if (zipCode.indexOf('*') > 0) {
                        var regexValue = utils.regexMongoStartWith(zipCode);
                        condition.zipCode_key2 = {
                            $regex: new RegExp(regexValue)
                        };
                    } else {
                        condition.zipCode_key2 = {
                            $eq: zipCode
                        };
                    }
                }
                if (provinceCode && provinceCode.length > 0) {
                    if (provinceCode.indexOf('*') > 0) {
                        var regexValue = utils.regexMongoStartWith(provinceCode);
                        condition.provinceCode_key1 = {
                            $regex: new RegExp(regexValue)
                        };
                    } else {
                        condition.provinceCode_key1 = {
                            $eq: provinceCode
                        };
                    }
                    //condition.push( { provinceCode_key1: { $regex: re }});
                } else {
                    // var p = [];
                    // if (province&&province.length>0) {
                    //     for(var i=0;i<province.length;i++){
                    //         p.push(province[i].provinceCode);
                    //     }
                    //     condition.provinceCode_key1 = { $in: p };
                    //     //condition.push( { provinceCode_key1: { $in: p }});
                    // }
                }
                if (amphurTh && amphurTh.length > 0) {
                    if (amphurTh.indexOf('*') > 0) {
                        var regexValue = utils.regexMongoStartWith(amphurTh);
                        condition.amphurTh_key3 = {
                            $regex: new RegExp(regexValue)
                        };
                    } else {
                        condition.amphurTh_key3 = {
                            $eq: amphurTh
                        };
                    }
                    //condition.push( { amphurTh_key3: { $regex: re }});
                }
                if (tumbolTh && tumbolTh.length > 0) {
                    if (tumbolTh.indexOf('*') > 0) {
                        var regexValue = utils.regexMongoStartWith(tumbolTh);
                        condition.tumbolTh_key4 = {
                            $regex: new RegExp(regexValue)
                        };
                    } else {
                        condition.tumbolTh_key4 = {
                            $eq: tumbolTh
                        };
                    }
                    //condition.push( { tumbolTh_key4: { $regex: re }});
                }
                zipCodeMod.aggregate([{
                    $lookup: {
                        from: "province", // other table name
                        localField: "provinceCode_key1", // name of users table field
                        foreignField: "provinceCode_key0", // name of userinfo table field
                        as: "provinceData" // alias for userinfo table
                    }
                },
                {
                    $unwind: "$provinceData"
                }, // $unwind used for getting data in object or for one record only

                // Join with user_role table
                {
                    $lookup: {
                        from: "mappingRegion",
                        localField: "provinceCode_key1",
                        foreignField: "provinceCode_key0",
                        as: "RegionData"
                    }
                },
                {
                    $unwind: "$RegionData"
                },
                {
                    $match: {
                        $and: [condition]
                    }
                },
                {
                    "$project": {
                        "zipCodeId": "$zipCodeId_key0",
                        "zipCode": "$zipCode_key2",
                        "tumbolTh": "$tumbolTh_key4",
                        "amphurTh": "$amphurTh_key3",
                        "provinceCode": "$provinceCode_key1",
                        "provinceName": "$provinceData.provinceNameTh_data",
                        "retailShop": "$provinceData.retailShop_data",
                        "subRegion": "$RegionData.saleSubRegionCode_data",
                        "tumbolEn": "$tumbolEn_key6",
                        "amphurEn": "$amphurEn_key5",
                        "provinceNameEn": "$provinceData.provinceNameEn_data",
                        "countryCode": ""

                    }
                }
                ], function (err, result) {
                    if (err) {
                        res.status(500).json({
                            responseCode: 500,
                            responseMessage: 'Fail',
                            error: err
                        });
                        return;
                    }
                    else if (result.length == 0) {
                        res.json({
                            responseCode: 404,
                            responseMessage: 'Data not found'
                        });
                        return;
                    }
                    ret.data = result;
                    res.json(ret);
                });
            }
        }
    });
};

exports.getSubRegion = function (req, res) {
    var userGroup = req.currentUser ? req.currentUser.userGroup : null;
    if (!(userGroup && Array.isArray(userGroup) && userGroup.length > 0)) {
        res.json({
            responseCode: 403,
            responseMessage: 'Bad request : role(user group) not found in token',
        });
        return;
    }

    var condition = {};
    if (userGroup.indexOf("ADMIN") == -1) {
        condition['groupName_data'] = {
            $in: userGroup
        };
        // condition.push({
        //     groupName_data : {
        //         $in: userGroup
        //     }
        // });
    }


    userGroupMod.aggregate([{
        $match: condition
    },
    // {
    //     $group: {
    //         _id: "$distChnCode_key1",
    //         retail : "$retailShop_data",
    //         subRegion : "$saleSubRegionCode_data"
    //         // retail: {
    //         //     $addToSet: {
    //         //         code: "$retailShop_data"
    //         //     }

    //         // },
    //         // subRegion: {
    //         //     $addToSet: {
    //         //         code: "$saleSubRegionCode_data"
    //         //     }
    //         // }
    //     }
    // },
    {
        $project: {
            // _id: 1,
            retail: "$retailShop_data",
            subRegion: "$saleSubRegionCode_data"
        }
    }
    ], function (err, result) {
        if (err) {
            res.json({
                responseCode: 500,
                responseMessage: 'Fail',
                error: err
            });
            return;
        }
        if (result) {
            var retailArr = [];
            var subRegionArr = [];
            var condSubRegion = false;
            var groupData = _.uniqBy(result, function (item) {
                return item.retail + '|' + item.subRegion;
            })

            for (var i = 0; i < groupData.length; i++) {
                var ugItem = groupData[i];
                // var foundCon = false;
                if (ugItem.retail == '' && ugItem.subRegion == '') {
                    condSubRegion = true;
                    break;
                } else {
                    if (ugItem.retail && ugItem.retail.length > 0) {
                        retailArr.push(ugItem.retail);
                    }
                    if (ugItem.subRegion && ugItem.subRegion.length > 0) {
                        subRegionArr.push(ugItem.subRegion);
                    }
                }

                // for (var j = 0; j < ugItem.retail.length; j++) {

                //     if (ugItem.retail[j].code == "") {
                //         foundCon = true;
                //         //break;
                //     } else {
                //         if (retailArr.indexOf(ugItem.retail[j].code) == -1) {
                //             retailArr.push(ugItem.retail[j].code);
                //         }
                //     }

                // }
                // if (foundCon) {
                //     for (var j = 0; j < ugItem.subRegion.length; j++) {
                //         if (ugItem.subRegion[j].code == "") {
                //             condSubRegion = true;
                //             break;
                //         }
                //         if (subRegionArr.indexOf(ugItem.subRegion[j].code) == -1) {
                //             subRegionArr.push(ugItem.subRegion[j].code);
                //         }
                //     }
                // }
                // if (condSubRegion) break;
            }

            var ret = {
                responseCode: 200,
                responseMessage: 'Success'
            };

            if (condSubRegion) {
                var filter = {};
                subRegionMod.find(filter, null, {
                    // sort: {
                    //     createdDate: -1
                    // }
                }).select(['-_id', 'code', 'nameTh', 'nameEn', 'region', 'retailShop']).exec(function (err, result) {
                    if (err) {
                        console.error(err);
                        ret.responseCode = 500;
                        ret.responseMessage = 'Fail';
                        ret.responseDescription = err.message;
                        res.json(ret);
                        throw err;
                    }
                    logger.info('get SubRegion list size :: ' + result.length);
                    ret.data = result;
                    res.json(ret);
                });
            } else {

                var filterSg = [];
                if (retailArr.length > 0) {
                    filterSg.push({
                        retailShop: {
                            $in: retailArr
                        }
                    });
                }
                if (subRegionArr.length > 0) {
                    filterSg.push({
                        code: {
                            $in: subRegionArr
                        }
                    });
                }
                subRegionMod.aggregate([{
                    $match: {
                        $or: filterSg
                    }
                },
                {
                    '$project': {
                        '_id': 0,
                        'code': 1,
                        'nameTh': 1,
                        'nameEn': 1,
                        'region': 1,
                        'retailShop': 1
                    }
                }
                ], function (err, result) {
                    if (err) {
                        console.error(err);
                        ret.responseCode = 500;
                        ret.responseMessage = 'Fail';
                        ret.responseDescription = err.message;
                        res.json(ret);
                        throw err;
                    }
                    logger.info('get SubRegion list size :: ' + result.length);
                    ret.data = result;
                    res.json(ret);
                });
            }

            return;
        }

        res.json({
            responseCode: 404,
            responseMessage: 'Not found'
        });
        return;


    });



}

exports.selectChannel = function (req, res) {
    var result = {
        responseCode: '',
        responseMessage: '',
        responseDescription: []
    }
    var query = req.query;
    var userGroup = query.userGroupAuth.split(",");
    var userAllGroup = []
    if (userGroup.indexOf('ADMIN') < 0) {
        for (var index = 0; index < userGroup.length; index++) {
            if (userGroup[index].length > 0) {
                var element = {
                    'groupName_data': {
                        $eq: userGroup[index]
                    }
                }
                userAllGroup.push(element);
            }
        }
    }
    var pipeline = [{
        $lookup: {
            from: "mappingCompany",
            localField: "chnSalesCode_key2",
            foreignField: "chnSalesCode_key1",
            as: "mapComp"
        }
    }, {
        $group: {
            _id: "$distChnCode_key1",
            distChn: {
                $addToSet: {
                    code: "$distChnCode_key1",
                    name: "$distChnName_data"
                }
            },
            chnSales: {
                $addToSet: {
                    code: "$chnSalesCode_key2",
                    name: "$chnSaleName_data",
                    companyAbbr: "$mapComp.companyAbbr_key2"
                }
            }
        }
    }, {
        $project: {
            _id: 1,
            distChn: 1,
            chnSales: 1
        }
    }];
    if (userAllGroup.length > 0) {
        pipeline.unshift({
            $match: {
                $or: userAllGroup
            }
        });
    }

    userGroupModel.aggregate(pipeline, function (err, results) {
        if (err) {
            res.json(err);
        } else {
            result.responseCode = 200;
            result.data = results
            result.responseDescription = 'success';
            res.json(result)
        }
    })

}

exports.getSelectChannel = function (req, res) {
    var userGroup = req.currentUser ? req.currentUser.userGroup : req.query.userGroupAuth ? req.query.userGroupAuth.split(',') : null;
    if (!(userGroup && Array.isArray(userGroup) && userGroup.length > 0)) {
        res.json({
            responseCode: 403,
            responseMessage: 'Bad request : role(user group) not found in token',
        });
        return;
    }

    var condition = {};
    if (userGroup.indexOf("ADMIN") == -1) {
        condition['groupName_data'] = {
            $in: userGroup
        };
    }

    userGroupMod.aggregate([{
        $match: condition
    },
    {
        $project: {
            groupName_data: 1,
            distChnCode_key1: 1,
            distChnName_data: 1,
            chnSalesCode_key2: 1,
            chnSaleName_data: 1,
            retailShop_data: 1,
            saleSubRegionCode_data: 1
        }
    }
    ], function (err, result) {
        if (err) {
            res.json({
                responseCode: 500,
                responseMessage: 'Fail',
                error: err
            });
            return;
        }
        if (result == null) {
            res.json({
                responseCode: 404,
                responseMessage: 'Not found'
            });
            return;
        }
        console.log(result)
        res.json({
            responseCode: 200,
            responseMessage: 'Success',
            data: result
        });
    });
}

exports.getRetailShopList = function (req, res) {
    logger.info('get location Retail Shop list');
    var userGroup = req.currentUser ? req.currentUser.userGroup : null;
    if (!(userGroup && Array.isArray(userGroup) && userGroup.length > 0)) {
        res.json({
            responseCode: 403,
            responseMessage: 'Bad request : role(user group) not found in token',
        });
        return;
    }
    var condition = {};
    if (userGroup.indexOf("ADMIN") == -1) {
        condition['groupName_data'] = {
            $in: userGroup
        };
    }

    userGroupMod.aggregate([{
        $match: condition
    },
    {
        $project: {
            retailShop: "$retailShop_data",
            subRegion: "$saleSubRegionCode_data"
        }
    }
    ], function (err, result) {
        if (err) {
            res.json({
                responseCode: 500,
                responseMessage: 'Fail',
                error: err
            });
            return;
        }
        if (result == null) {
            res.json({
                responseCode: 403,
                responseMessage: 'Bad request'
            });
            return;
        }

        var ret = {
            responseCode: 200,
            responseMessage: 'Success'
        };

        var filter = {};
        var retailShopArr = [];
        var showAll = false;
        var groupData = _.uniqBy(result, function (item) {
            return item.retailShop + '|' + item.subRegion;
        })
        // retailShop: "$retailShop_data",
        // subRegion: "$saleSubRegionCode_data"
        groupData.forEach(function (element) {
            if (element["retailShop"] == '' && element["subRegion"] == '') {
                showAll = true;
                retailShopArr = [];
            }
            if (!showAll) {
                if (element["retailShop"] && element["retailShop"].length > 0) {
                    retailShopArr.push(element["retailShop"]);
                }
            }
        });
        if (retailShopArr.length > 0) {
            filter.code = {
                $in: retailShopArr
            };
        }


        retailShopMod.find(filter, null, {}).select(['-_id', 'code', 'name']).exec(function (err, result) {
            if (err) {
                console.error(err);
                ret.responseCode = 500;
                ret.responseMessage = 'Fail';
                ret.responseDescription = err.message;
                res.json(ret);
                throw err;
            }

            logger.info('get Retail Shop list size :: ' + result.length);
            ret.data = result;
            // ret.data = result.map(function(res){
            //     return res.toAliasedFieldsObject();
            // });
            res.json(ret);
        });

    });

};

exports.getAuthenField = function (req, res) {
    logger.info('get authen field data');

    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };

    var condition = [];
    var chnSaleCode = req.params.chnSaleCode;
    var pageKey = req.params.pageKey;

    var condition = [];
    if (chnSaleCode && chnSaleCode.length > 0) {
        condition.push({
            chnSalesCode_key1: {
                $eq: chnSaleCode
            }
        });
    } else {
        ret.responseCode = 400;
        ret.responseMessage = 'Bad Request';
        res.json(ret);
        return;
    }

    if (pageKey && pageKey.length > 0)
        condition.push({
            page_key2: {
                $eq: pageKey
            }
        });

    authFieldMod.aggregate([{
        $match: {
            $and: condition
        }
    },
    {
        "$project": {
            //"chnSaleCode": "$chnSalesCode_key1",
            //"page": "$page_key2",
            "action": "$action_data",
            "lovType": "$lovType_data",
            "fieldType": "$fieldType_data",
            "fieldName": "$fieldName_data",
            "attribute": "$attribute_data",
            "value": "$value_data",
            "labelName": "$labelName_data"
        }
    }
    ], function (err, result) {
        if (err) {
            res.status(500).json({
                responseCode: 500,
                responseMessage: 'Fail',
                error: err
            });
            return;
        }

        ret.data = result;
        res.json(ret);
    });
};

exports.checkSession = function (req, res) {
    logger.info('add session data');
    res.json({
        resultCode: 20000,
        resultDescription: 'Success',
        data: null
    });

};

exports.deleteSession = function (req, res) {
    logger.info('delete session data');
    res.json({
        responseCode: 20000,
        responseMessage: 'Success',
        data: null
    });

};

exports.addLocation = function (req, res) {
    var id = req.params.id;
    // var userId  = req.currentUser.username;
    var currentUserId = req.currentUser ? req.currentUser.username : "undefind";
    logger.info('api add Location');
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
            logger.debug(' draft :: ' + JSON.stringify(locData));
            const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

            locData.userGroup = draftData.userGroup;
            locData.createdBy = draftData.createdBy;
            locData.createdDate = moment(draftData.createdDate).format(DATETIME_FORMAT);
            locData.modifiedBy = currentUserId;
            locData.modifiedDate = moment(draftData.modifiedDate).format(DATETIME_FORMAT);
            locData.status = draftData.status;
            locData.approved = draftData.approved;
            var pageGroup = draftData.pageGroup;
            //  JSON.parse(JSON.stringify());
            // var profileInfo = JSON.parse(JSON.stringify(result.pageGroup.profileInfo));
            if (pageGroup.profileInfo.effectiveDt) {
                var effectiveDt = moment(pageGroup.profileInfo.effectiveDt).format('YYYY-MM-DD');
                pageGroup.profileInfo.effectiveDt = effectiveDt + ' 00:00:00';
            }
            locData.pageGroup = pageGroup;
            if (draftData.resendLocation && draftData.resendLocation.length > 0) {
                logger.info('set location code case resend');
                locData.sendSiebel = 'R';
                locData.pageGroup.summary = pageGroup.summary || {};
                locData.pageGroup.summary.locationCode = draftData.resendLocation;
            }
            // var createDt = moment(locData.createdDate).format(DATETIME_FORMAT);
            // var modifiedDt = moment(locData.modifiedDate).format(DATETIME_FORMAT);
            // locData.createdDate = createDt;
            locData.modifiedDate = moment().format(DATETIME_FORMAT);
            logger.info('get draft location by id success ');
            var uri = cfg.service.PANDORA.URI + PREFIX + '/createLocation.json';
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
                        ret.responseDescription = response.resultDescription;
                        res.json(ret);
                        return;
                    }
                    var location = response.resultData[0].location[0];
                    result.resendLocation = location.locationCode
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
                    var updObj = { resendLocation: result.resendLocation, response: result.response, modifiedDate: result.modifiedDate };
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
                        ret.responseDescription = response.resultDescription;
                        ret.data = location;
                        res.json(ret);
                    });
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
        });
    } catch (error) {
        logger.errorStack(error)
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        res.json(ret);
    }
};

exports.chkDupName = function (req, res) {
    logger.info('chk dup name');
    var filter = req.query;
    // filter.nameTh = filter.nameTh.replace(/\(/g , "\\(");
    // filter.nameEn = filter.nameEn.replace(/\(/g , "\\(")..replace(/\)/g , "\\)");
    var companyId = filter.companyId;
    var nameTh = filter.nameTh;
    var nameEn = filter.nameEn;

    if (nameTh) {
        filter.nameTh = nameTh.replace(/${{rep.replaceFirst}}/g, "${{rep.replaceFirst}}").replace(/${{rep.replaceEnd}/g, "${{rep.replaceEnd}");
    }
    if (nameEn) {
        filter.nameEn = nameEn.replace(/${{rep.replaceFirst}}/g, "${{rep.replaceFirst}}").replace(/${{rep.replaceEnd}/g, "${{rep.replaceEnd}");
    }
    var nameAbbrev = filter.nameAbbrev;
    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + PREFIX + '/location/checkDup.json?filter=' + queryStr;
        logger.info('GET :: ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'CHECK_LOC_NAME',
            reqId: req.id
        }).then(function (response) {
            logger.info('response :: ' + JSON.stringify(response));
            if (parseInt(response.resultCode) == 20000) {
                ret.responseCode = 200;
                ret.data = response.resultData;
                res.json(ret);
            } else if ((parseInt(response.resultCode) == 40301)) {
                ret.responseCode = 401;
                //ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseDescription = response.resultDescription;
                ret.data = response.resultData;
                res.json(ret);
            } else {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseDescription = response.resultDescription;
                res.json(ret);
            }
            // res.json(response);
        });
    } catch (error) {
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        res.json(ret);
    }
};

exports.chkDupMobile = function (req, res) {
    logger.info('chk dup mobile');
    var filter = req.query;
    var mobile = filter.mobile;

    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + PREFIX + '/checkMobile.json?filter=' + queryStr;
        logger.info('GET :: ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'CHECK_MOBILE_SERVICE',
            reqId: req.id
        }).then(function (response) {
            logger.info('response :: ' + JSON.stringify(response));
            if (parseInt(response.resultCode) == 20000) {
                ret.responseCode = 200;
                ret.data = response.resultData;
                res.json(ret);
            } else if ((parseInt(response.resultCode) == 40301)) {
                ret.responseCode = 403;
                //ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseDescription = response.resultDescription;
                ret.data = response.resultData;
                res.json(ret);
            } else {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseDescription = response.resultDescription;
                res.json(ret);
            }
            // res.json(response);
        });
    } catch (error) {
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        res.json(ret);
    }
};

function getLocationDummyData(filter) {
    var filePath = path.join(__dirname, '../../../data/location.json');
    var dataDummy = utils.readFileDataJson(filePath);
    dataDummy = _.filter(dataDummy, function (o) {
        return o.show
    });
    // "distChnCode": "AISCHN",
    // "distChnName": "AIS Channel",
    // "locationNameEn": "Location - 550",
    // "locationNameTh": "sine ccsmid 659",
    // "status": "ACTIVE",
    // "shopType": "",
    // "retailShop": "BKK",
    // "locationCode": "97659",
    // "companyNameTh": "บริษัท แอดวานซ์ ไวร์เลส เน็ทเวอร์ค จำกัด",
    // "companyNameEn": "Advanced Wireless Network Company Limited",
    // "companyAbbr": "AWN",
    // "companyId": "C0000000006",
    // "chnSalesCode": "AISSHOP",
    // "chnSalesName": "AIS Shop",
    // "subRegion": "",
    // "provinceCode": ""
    if (filter) {
        dataDummy = _.filter(dataDummy, function (o) {
            if (filter.locationCode && o.locationCode != filter.locationCode) {
                return false;
            }
            if (filter.distChnCode && o.distChnCode != filter.distChnCode) {
                return false;
            }
            if (filter.locationNameEn && !o.locationNameEn.startsWith(filter.locationNameEn)) {
                return false;
            }
            if (filter.locationNameTh && !o.locationNameTh.startsWith(filter.locationNameTh)) {
                return false;
            }
            if (filter.status && o.status.toUpperCase() != filter.status.toUpperCase()) {
                return false;
            }
            if (filter.retailShop && o.retailShop != filter.retailShop) {
                return false;
            }
            if (filter.companyAbbr && o.companyAbbr != filter.companyAbbr) {
                return false;
            }
            if (filter.chnSalesCode && o.chnSalesCode != filter.chnSalesCode) {
                return false;
            }
            if (filter.subRegion && o.subRegion != filter.subRegion) {
                return false;
            }
            // if(filter.provinceCode && o.provinceCode != filter.provinceCode){
            //     return false;
            // }
            return true;
        });
    }
    return dataDummy;
};

function getLocationDummyDataByCode(locationCode) {
    if (dataLocationDummy == null || dataLocationDummy.length <= 0) {
        getLocationDummyData();
    }
    var locData = null;
    for (var i = 0; i < dataLocationDummy.length; i++) {
        var tmp = dataLocationDummy[i];
        if (locationCode == tmp.locationCode) {
            locData = tmp;
            break;
        }
    }
    return locData;
};

exports.searchLocation = function (req, res) {
    logger.info('Api search location');
    var filter = req.body || {};
    var nameTh = filter.locationNameTh;
    var nameEn = filter.locationNameEn;

    if (nameTh) {
        filter.locationNameTh = nameTh.replace(/${{rep.replaceFirst}}/g, "${{rep.replaceTwoBsFirst}}").replace(/${{rep.replaceEnd}}/g, "${{rep.replaceTwoBsEnd}}");
    }
    if (nameEn) {
        filter.locationNameEn = nameEn.replace(/${{rep.replaceFirst}}/g, "${{rep.replaceTwoBsFirst}}").replace(/${{rep.replaceEnd}}/g, "${{rep.replaceTwoBsEnd}}");
    }
    logger.debug('filter:' + JSON.stringify(filter));
    var ret = {};
    try {
        filter.groupName = req.currentUser.userGroup;
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + PREFIX + '/location/list.json?filter=' + queryStr;
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
            ret.data = response.resultData.viewLocationList;
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

exports.checkUserGroup = function (req, res) {
    logger.info('checkUserGroup');
    // /api/phxpartner/location/chk-user-group/?userGroup=AISSHOPBKK,DSFBBCB&distChnCode=AISCHN&chnSaleCode=AISSHOP
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };

    var condition = [];
    var userGroup = req.query.userGroup;
    var distChnCode = req.query.distChnCode;
    var chnSaleCode = req.query.chnSaleCode;

    if (userGroup != null && userGroup.length > 0) {
        if (!Array.isArray(userGroup)) {
            userGroup = userGroup.split(",");
        }
    }
    var condition = [];

    if (userGroup && Array.isArray(userGroup) && userGroup.length > 0) {
        if (userGroup.indexOf("ADMIN") != -1) {

        } else {
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
            condition.push({
                groupName_data: {
                    $regex: new RegExp(regxUg)
                }
            });
        }
    } else {
        ret.responseCode = 400;
        ret.responseMessage = 'Bad Request';
        res.json(ret);
        return;
    }

    if (distChnCode && distChnCode.length > 0) {
        condition.push({
            distChnCode_key1: {
                $eq: distChnCode
            }
        });
    } else {
        ret.responseCode = 400;
        ret.responseMessage = 'Bad Request';
        res.json(ret);
        return;
    }
    if (chnSaleCode && chnSaleCode.length > 0) {
        condition.push({
            chnSalesCode_key2: {
                $eq: chnSaleCode
            }
        });
    } else {
        ret.responseCode = 400;
        ret.responseMessage = 'Bad Request';
        res.json(ret);
        return;
    }


    userGroupMod.aggregate([{
        $match: {
            $and: condition
        }
    }, {
        $project: {
            groupName: "$groupName_data",
            disChnCode: "$distChnCode_key1",
            disChnName: "$distChnName_data",
            chnSaleCode: "$chnSalesCode_key2",
            chnSaleName: "$chnSaleName_data",
            retailShop: "$retailShop_data",
            subRegion: "$saleSubRegionCode_data"
        }
    }], function (err, result) {
        if (err) {
            res.status(500).json({
                responseCode: 50000,
                responseMessage: 'Fail',
                error: err
            });
            return;
        }

        ret.data = result;
        res.json(ret);
    });
};
exports.getLocationVan = function (req, res) {
    logger.info('api get location hup');
    var locationCode = req.params.id;
    var filter = req.query;
    filter.locationCode = locationCode;
    // filter.subRegion
    // filter.saleAreaId
    // filter.distributionGroup
    // filter.chnSaleCode

    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        //
        var uri = cfg.service.PANDORA.URI + PREFIX + '/vanDistribution/info.json?filter=' + queryStr;
        logger.info('GET :: ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'VIEW_LOC_DIST_INFO',
            reqId: req.id
        }).then(function (response) {
            logger.info('response :: ' + JSON.stringify(response));
            // if (testDummyData) {
            //     // if (parseInt(response.resultCode) != 20000 && testDummyData) {
            //     ret.responseCode = 200;
            //     ret.responseMessage = 'Success (Mockup)';
            //     //var locData = getLocationDummyDataByCode(locationCode);
            //     var filePath = path.join(__dirname, '../../../data/locationAddress.json');
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
            ret.data = response.resultData.vanDistributionInfo;
            res.json(ret);
        });
    } catch (error) {
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        res.json(ret);
    }
};
exports.getLocationHub = function (req, res) {
    logger.info('api get location hup');
    var filter = req.query;
    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        //
        var uri = cfg.service.PANDORA.URI + PREFIX + '/hubDistribution/info.json?filter=' + queryStr;
        logger.info('GET :: ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'VIEW_LOC_RETAIL_INFO',
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
            ret.data = response.resultData.hubDistributionInfo;
            res.json(ret);
        });
    } catch (error) {
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        res.json(ret);
    }
};
exports.updLocationHubDistribution = function (req, res) {
    logger.info('api put updLocationHubDistribution');
    var locationCode = req.params.id;
    var username = req.currentUser.username;
    var data = {
        hubDistributionInfo: req.body
    };
    for (var i = 0; i < data.hubDistributionInfo.length; i++) {
        if (data.hubDistributionInfo[i].cmd == "post") {
            data.hubDistributionInfo[i].lastUpBy = username;
            data.hubDistributionInfo[i].createdBy = username;
        } else if (data.hubDistributionInfo[i].cmd == "delete") {
            data.hubDistributionInfo[i].lastUpBy = username;
        }
    }
    var filter = req.query;
    // filter.locationCode = locationCode;
    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + PREFIX + '/hubDistribution/info.json?filter=' + queryStr;
        logger.info('PUT :: ' + uri);
        return clientHttp.put(uri, data, {
            service: 'phxpartners-be',
            callService: 'PUT_LOC_RETAIL_INFO',
            reqId: req.id
        }).then(function (response) {
            logger.info('response :: ' + JSON.stringify(response));
            if (parseInt(response.resultCode) != 20000) {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = 'Fail';
                ret.responseDescription = response.resultDescription;
                ret.responseData = response.resultData;
                res.json(ret);
                return;
            }
            ret.responseCode = 200;
            ret.responseDescription = 'Success';
            res.json(ret);
        }).catch(function (err) {
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
exports.updLocationVanDistribution = function (req, res) {
    logger.info('api put updLocationVanDistribution');
    // logger.info( JSON.stringify(req.body) );
    var username = req.currentUser.username;
    var locationCode = req.params.id;
    var data = {
        vanDistributionInfo: req.body
    };
    for (var i = 0; i < data.vanDistributionInfo.length; i++) {
        if (data.vanDistributionInfo[i].cmd == "post") {
            data.vanDistributionInfo[i].lastUpBy = username;
            data.vanDistributionInfo[i].createdBy = username;
        } else if (data.vanDistributionInfo[i].cmd == "delete") {
            data.vanDistributionInfo[i].lastUpBy = username;
        }
    }
    var filter = req.query;

    // filter.subRegion = data.subRegion;
    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + PREFIX + '/vanDistribution/info.json?filter=' + queryStr;
        logger.info('PUT :: ' + uri);
        return clientHttp.put(uri, data, {
            service: 'phxpartners-be',
            callService: 'PUT_LOC_DIST_INFO',
            reqId: req.id
        }).then(function (response) {
            logger.info('response :: ' + JSON.stringify(response));
            if (parseInt(response.resultCode) != 20000) {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = 'Fail';
                ret.responseDescription = response.resultDescription;
                ret.responseData = response.resultData;
                if (ret.responseCode == 424 && response.moreInfo.indexOf('duplicate') !== -1) {
                    ret.responseDescription = response.moreInfo;
                }
                res.json(ret);
                return;
            }
            ret.responseCode = 200;
            ret.responseDescription = 'Success';
            res.json(ret);
        }).catch(function (err) {
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
exports.getDistributionProductList = function (req, res) {
    logger.info('api get Distribution Products List');
    var filter = req.query;
    var ret = {};
    try {
        // var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        // /phxPartner/v1/distribution/product/list.json?
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + PREFIX + '/distribution/product/list.json?filter=' + queryStr;
        logger.info('GET :: ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'VIEW_LOC_DIST_PRODUCT',
            reqId: req.id
        }).then(function (response) {
            logger.info('response :: ' + JSON.stringify(response));
            // if (testDummyData) {
            //     // if (parseInt(response.resultCode) != 20000 && testDummyData) {
            //     ret.responseCode = 200;
            //     ret.responseMessage = 'Success (Mockup)';
            //     //var locData = getLocationDummyDataByCode(locationCode);
            //     var filePath = path.join(__dirname, '../../../data/locationAddress.json');
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
            ret.data = response.resultData.productGroup;
            res.json(ret);
        });
    } catch (error) {
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        res.json(ret);
    }
};
// getHubDistributionList
exports.getHubDistributionList = function (req, res) {
    logger.info('api get Hub Distribution List');
    // var locationCode = req.params.id;
    var filter = req.query;
    // filter.locationCode = locationCode;
    // filter.subRegion
    // filter.saleAreaId
    // filter.distributionGroup
    // filter.chnSaleCode

    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        ///phxPartner/v1/hubDistribution/list.json?filter=(&(distLocationCode=$value)(subRegion=$value)(saleAreaId=$value)(distributionGroup=$value)(chnSalesCode=$value))
        var uri = cfg.service.PANDORA.URI + PREFIX + '/hubDistribution/list.json?filter=' + queryStr;
        logger.info('GET :: ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'VIEW_LOC_RETAIL_LIST',
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
            ret.data = response.resultData.hubDistributionList;
            res.json(ret);
        });
    } catch (error) {
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        res.json(ret);
    }
};
exports.getVanDistributionList = function (req, res) {
    logger.info('api get Van Distribution List');
    // var locationCode = req.params.id;
    var filter = req.query;
    // filter.locationCode = locationCode;
    // filter.subRegion
    // filter.saleAreaId
    // filter.distributionGroup
    // filter.chnSaleCode

    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        ///phxPartner/v1/hubDistribution/list.json?filter=(&(distLocationCode=$value)(subRegion=$value)(saleAreaId=$value)(distributionGroup=$value)(chnSalesCode=$value))
        var uri = cfg.service.PANDORA.URI + PREFIX + '/vanDistribution/list.json?filter=' + queryStr;
        logger.info('GET :: ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'VIEW_LOC_DIST_LIST',
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
            ret.data = response.resultData.vanDistributionList;
            res.json(ret);
        });
    } catch (error) {
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        res.json(ret);
    }
};

exports.chkOldLocation = function (req, res) {
    var ret = {};
    var filter = req.query
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + PREFIX + '/location/chkOldLocation.json?filter=' + queryStr;
        logger.info('GET :: ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'CHECK_OLD_LOCATION',
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
            ret.data = response.resultData.vanDistributionList;
            res.json(ret);
        });
    } catch (error) {
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        res.json(ret);
    }
};

exports.getMobileContact = function (req, res) {
    logger.info('getMobileContact');
    var filter = req.query;
    var mobile = filter.mobile;

    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + PREFIX + '/location/mobileContact.json?filter=' + queryStr;
        logger.info('GET :: ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'GET_MOBILE_CONTACT',
            reqId: req.id
        }).then(function (response) {
            logger.info('response :: ' + JSON.stringify(response));
            if (parseInt(response.resultCode) == 20000) {
                ret.responseCode = 200;
                ret.responseDescription  = response.resultDescription;
                ret.moreinfo = response.moreinfo;
                ret.resultData = response.resultData;
                res.json(ret);
            } else if ((parseInt(response.resultCode) == 40401)) {
                ret.responseCode = 404;
                ret.responseDescription = response.resultDescription;
                ret.moreinfo = response.moreinfo;
                ret.resultData = response.resultData.phoneList;
                res.json(ret);
            } else {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseDescription = response.resultDescription;
                res.json(ret);
            }
        });
    } catch (error) {
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        res.json(ret);
    }
};

exports.testUserLogin = function (req, res) {
    var data = req.body;
    // var userId  = req.currentUser.username;
    var currentUserId = req.currentUser ? req.currentUser.username : "undefind";
    logger.info('api add Location');
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };
    try {
        var uri = cfg.service.PANDORA.URI + PREFIX + '/location/userLogin.json';
        logger.info('POST :: ' + uri);
        logger.debug('body :: ' + data);
        clientHttp.post(uri, data, {
            service: 'phxpartners-be',
            callService: 'CREATE_LOCATION',
            reqId: req.id
        }).then(function (response) {
            logger.info('response :: ' + JSON.stringify(response));
            if (parseInt(response.resultCode) == 20000) {
                // var data
                ret.data = location;
                ret.responseCode = 200;
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
exports.getUserloginConfix = function (req, res) {
    logger.info('getUserloginConfix');
    var filter = req.query;
    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + PREFIX + '/location/userLoginConfig.json?filter=' + queryStr;
        logger.info('GET :: ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'GET_MOBILE_CONTACT',
            reqId: req.id
        }).then(function (response) {
            logger.info('response :: ' + JSON.stringify(response));
            if (parseInt(response.resultCode) == 20000) {
                ret.responseCode = 200;
                ret.responseDescription  = response.resultDescription;
                ret.moreinfo = response.moreinfo;
                ret.resultData = response.resultData;
                res.json(ret);
            } else if ((parseInt(response.resultCode) == 40401)) {
                ret.responseCode = 404;
                ret.responseDescription = response.resultDescription;
                ret.moreinfo = response.moreinfo;
                ret.resultData = response.resultData.phoneList;
                res.json(ret);
            } else {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseDescription = response.resultDescription;
                res.json(ret);
            }
        });
    } catch (error) {
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        res.json(ret);
    }
};

exports.getUserloginInfo = function (req, res) {
    logger.info('getUserloginInfo');
    var filter = req.query;
    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + PREFIX + '/userlogin/info.json?filter=' + queryStr;
        logger.info('GET :: ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'GET_USERLOGIN_INFO',
            reqId: req.id
        }).then(function (response) {
            logger.info('response :: ' + JSON.stringify(response));
            if (parseInt(response.resultCode) == 20000) {
                ret.responseCode = 200;
                ret.responseDescription  = response.resultDescription;
                ret.moreinfo = response.moreinfo;
                ret.resultData = response.resultData;
                res.json(ret);
            } else if ((parseInt(response.resultCode) == 40401)) {
                ret.responseCode = 404;
                ret.responseDescription = response.resultDescription;
                ret.moreinfo = response.moreinfo;
                ret.resultData = response.resultData.phoneList;
                res.json(ret);
            } else {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseDescription = response.resultDescription;
                res.json(ret);
            }
        });
    } catch (error) {
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        res.json(ret);
    }
};

exports.getUserloginTransactionInfo = function (req, res) {
    logger.info('getUserloginInfo');
    var filter = req.query;
    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + PREFIX + '/userlogin/userlogintns.json?filter=' + queryStr;
        logger.info('GET :: ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'GET_USERLOGIN_TRANSACTION_INFO',
            reqId: req.id
        }).then(function (response) {
            logger.info('response :: ' + JSON.stringify(response));
            if (parseInt(response.resultCode) == 20000) {
                ret.responseCode = 200;
                ret.responseDescription  = response.resultDescription;
                ret.moreinfo = response.moreinfo;
                ret.resultData = response.resultData;
                res.json(ret);
            } else if ((parseInt(response.resultCode) == 40401)) {
                ret.responseCode = 404;
                ret.responseDescription = response.resultDescription;
                ret.moreinfo = response.moreinfo;
                ret.resultData = response.resultData.phoneList;
                res.json(ret);
            } else {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseDescription = response.resultDescription;
                res.json(ret);
            }
        });
    } catch (error) {
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        res.json(ret);
    }
};

exports.getUserloginDefaultInfo = function (req, res) {
    logger.info('getUserloginInfo');
    var filter = req.query;
    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + PREFIX + '/userlogin/defaultinfo.json?filter=' + queryStr;
        logger.info('GET :: ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'GET_USERLOGIN_DEFAULT_INFO',
            reqId: req.id
        }).then(function (response) {
            logger.info('response :: ' + JSON.stringify(response));
            if (parseInt(response.resultCode) == 20000) {
                ret.responseCode = 200;
                ret.responseDescription  = response.resultDescription;
                ret.moreinfo = response.moreinfo;
                ret.resultData = response.resultData;
                res.json(ret);
            } else if ((parseInt(response.resultCode) == 40401)) {
                ret.responseCode = 404;
                ret.responseDescription = response.resultDescription;
                ret.moreinfo = response.moreinfo;
                ret.resultData = response.resultData.phoneList;
                res.json(ret);
            } else {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseDescription = response.resultDescription;
                res.json(ret);
            }
        });
    } catch (error) {
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        res.json(ret);
    }
};


exports.getCountUserlogin = function (req, res) {
    logger.info('getUserloginInfo');
    var filter = req.query;
    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + PREFIX + '/countuserlogin/info.json?filter=' + queryStr;
        logger.info('GET :: ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'GET_USERLOGIN_DEFAULT_INFO',
            reqId: req.id
        }).then(function (response) {
            logger.info('response :: ' + JSON.stringify(response));
            if (parseInt(response.resultCode) == 20000) {
                ret.responseCode = 200;
                ret.responseDescription  = response.resultDescription;
                ret.moreinfo = response.moreinfo;
                ret.resultData = response.resultData;
                res.json(ret);
            } else if ((parseInt(response.resultCode) == 40401)) {
                ret.responseCode = 404;
                ret.responseDescription = response.resultDescription;
                ret.moreinfo = response.moreinfo;
                ret.resultData = response.resultData.phoneList;
                res.json(ret);
            } else {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseDescription = response.resultDescription;
                res.json(ret);
            }
        });
    } catch (error) {
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        res.json(ret);
    }
};

exports.updUserloginInfo = function (req, res) {
    logger.info('getUserloginInfo');
    var filter = req.query;
    var username = req.currentUser.username;
    filter.modifyBy = username
    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + PREFIX + '/userlogin/info.json?filter=' + queryStr;
        logger.info('PUT :: ' + uri);
        return clientHttp.put(uri,req.body, {
            service: 'phxpartners-be',
            callService: 'PUT_USERLOGIN_INFO',
            reqId: req.id
        }).then(function (response) {
            logger.info('response :: ' + JSON.stringify(response));
            if (parseInt(response.resultCode) == 20000) {
                ret.responseCode = 200;
                ret.responseDescription  = response.resultDescription;
                ret.moreinfo = response.moreinfo;
                ret.resultData = response.resultData;
                res.json(ret);
            } else if ((parseInt(response.resultCode) == 40401)) {
                ret.responseCode = 404;
                ret.responseDescription = response.resultDescription;
                ret.moreinfo = response.moreinfo;
                ret.resultData = response.resultData.phoneList;
                res.json(ret);
            } else {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseDescription = response.resultDescription;
                res.json(ret);
            }
        });
    } catch (error) {
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        res.json(ret);
    }
};
