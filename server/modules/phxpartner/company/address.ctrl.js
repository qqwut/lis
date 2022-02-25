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
var lov = require('../../../model/lov.js');
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

    userGroupMod.aggregate([
        {
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
                                "provinceNameEn" :"$provinceData.provinceNameEn_data",
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
                            "addrSubRegion": "$addrSubRegionCode_data",
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
                                "addSubRegion": "$RegionData.addrSubRegionCode_data",
                                "tumbolEn": "$tumbolEn_key6",
                                "amphurEn": "$amphurEn_key5",
                                "provinceNameEn" :"$provinceData.provinceNameEn_data",
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
                        }else if(result.length == 0){
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
                            "addSubRegion": "$RegionData.addrSubRegionCode_data",
                            "tumbolEn": "$tumbolEn_key6",
                            "amphurEn": "$amphurEn_key5",
                            "provinceNameEn" :"$provinceData.provinceNameEn_data",
                            "countryCode" : ""
                            
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
                    }else if(result.length == 0){
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
exports.getProvince = function (req, res) {
    logger.info('get province data');

    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };

    var userGroupArr = [];
    var userGroup = req.query.userGroup;

    var condition = [];
    // if (userGroup && userGroup.length > 0) {
    //     userGroupArr = userGroup.split(',');
    //     for (var i = 0; i < userGroupArr.length; i++) {
    //         condition.push({
    //             groupName_data: {
    //                 $eq: userGroupArr[i]
    //             }
    //         });
    //     }
    // } else {
    //     ret.responseCode = 400;
    //     ret.responseMessage = 'Bad Request';
    //     res.json(ret);
    //     return;
    // }

    userGroupMod.aggregate([ 
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
