/* ------------- [START REQUIRE] ------------ */
const mongoose = require("mongoose");
const moment = require('moment');
const async = require('async');
const usrService = require('../service/user-service');
/* ------------- [END REQUIRE] ------------ */
/* ------------- [START INITIAL] ------------ */
var locationDraft = mongoose.model('locationDraft');
var userGroupModel = mongoose.model('userGroup');
var company = mongoose.model('company');
/* ------------- [END INITIAL] ------------ */
/* ------------- [STRAT IMPLEMENT API] ------------ */
exports.draftList = function (req, res) {
    var result = {
        responseCode: '',
        responseMessage: '',
        responseDescription: []
    }

    if (req.query.userGroupAuth) {
        let userGrp = usrService.userGroupToArray(req.query.userGroupAuth, 'userGroup');
        locationDraft.find({
            $or: userGrp,
            status: {
                $ne: "DELETED"
            }
        }).exec(function (err, results) {
            if (err) {
                res.json(err);
            } else {
                if (results.length == 0) {
                    result.responseCode = 404;
                    result.responseMessage = 'Not found';
                } else {
                    result.responseCode = 200;
                    result.responseDescription = results;
                }
                res.json(result);
            }
        });
    } else {
        result.responseCode = 500;
        result.responseDescription = 'Invalid Parameter';
        res.json(result);
    }
};

exports.draftDetail = function (req, res) {
    var result = {
        responseCode: '',
        responseMessage: '',
        responseDescription: []
    }

    if (req.query.userGroupAuth && req.query.locationDraftId) {
        let userGrp = usrService.userGroupToArray(req.query.userGroupAuth, 'userGroup');
        let pipeline = [{
            $match: {
                $and: [{
                    $or: userGrp
                },
                { _id: mongoose.Types.ObjectId(req.query.locationDraftId) }
                ],
            }
        }];

        locationDraft.aggregate(pipeline, function (err, docs) {
            if (err) {
                res.json(err);
            } else {
                if (docs.length == 0) {
                    result.responseCode = 404;
                    result.responseMessage = 'Not found';
                } else {
                    result.responseCode = 200;
                    result.responseDescription = docs;
                }
                res.json(result)
            }
        })
    } else {
        result.responseCode = 500;
        result.responseDescription = 'Invalid Parameter';
        res.json(result);
    }

};

exports.draftCreate = function (req, res) {
    var result = {
        responseCode: '',
        responseMessage: '',
        responseDescription: []
    }

    let requireVal = req.body.userGroupAuth &&
        req.body.distChnCode && req.body.distChnName &&
        req.body.chnSalesCode && req.body.chnSalesName &&
        req.body.companyAbbr && req.body.createdBy;
    if (requireVal) {
        let userGrp = usrService.userGroupToArray(req.body.userGroupAuth, 'groupName_data');
        let data = {
            distChnCode: req.body.distChnCode,
            distChnName: req.body.distChnName,
            chnSalesCode: req.body.chnSalesCode,
            chnSalesName: req.body.chnSalesName,
            companyAbbr: req.body.companyAbbr,
            createdBy: req.body.createdBy,
            userGroup: userGrp
        };
        async.waterfall([
            function (callback) {
                if (data.userGroup == 'ADMIN') {  //ignore userGroup = ADMIN
                    let pipeline = [{
                        $match: {
                            $and: [{
                                chnSalesCode_key2: { $eq: data.chnSalesCode }
                            }, {
                                distChnCode_key1: { $eq: data.distChnCode }
                            }]
                        }
                    },
                    {
                     $project: { groupName_data: 1 }
                    }
                ];
                }else {
                let pipeline = [{
                    $match: {
                        $or: data.userGroup,
                        $and: [{
                            chnSalesCode_key2: { $eq: data.chnSalesCode }
                        }, {
                            distChnCode_key1: { $eq: data.distChnCode }
                        }]
                    }
                },
                {
                    $project: { groupName_data: 1 }
                }
                ];
            }
                userGroupModel.aggregate(pipeline, function (err, docs) {
                    if (err) {
                        callback(err, null)
                    } else {
                        data.userGroup = docs.map(function (a) { return a.groupName_data; });
                        callback(null, 'done');
                    }
                })
            },
            function (status, callback) {
                let pipeline = [{
                    $match: {
                        companyAbbr_data: data.companyAbbr
                    }
                }, {
                    $project: {
                        companyIdNo: "$idNo_data",
                        companyTitleTh: "$titleTh_data",
                        companyNameTh: "$nameTh_data",
                        companyAbbr: "$companyAbbr_data"
                    }
                }];

                company.aggregate(pipeline, function (err, docs) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, docs);
                    }
                });
            },
            function (company, callback) {
                var draft = new locationDraft({
                    pagegroup: {
                        selectChannel: {
                            companyIdNo: company.companyIdNo,
                            companyTitleTh: company.companyTitleTh,
                            companyNameTh: company.companyNameTh,
                            companyAbbr: data.companyAbbr,
                            distChnCode: data.distChnCode,
                            distChnName: data.distChnName,
                            chnSalesCode: data.chnSalesCode,
                            chnSalesName: data.chnSalesName
                        }
                    },
                    createdBy: data.createdBy,
                    userGroup: data.userGroup
                });

                draft.save(function (err, docs) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, docs);
                    }
                });
            }
        ], function (err, results) {
            if (err) {
                result.responseCode = 404;
                result.responseDescription = err;
                res.json(result);
            } else {
                result.responseCode = 200;
                result.responseDescription = results;
                res.json(result);
            }
            // result now equals 'done'
        });
    } else {
        result.responseCode = 500;
        result.responseMessage = 'Invalid Parameter';
        res.json(result);
    }
};

exports.draftSave = function (req, res) {
    var result = {
        responseCode: '',
        responseMessage: '',
        responseDescription: []
    }
    console.dir(req.body);
    if (req.params.draftId && req.body) {
        let updateData = {};
        let pagegroupData ;
        if(req.body.step == 1){ 
            pagegroupData = {  
                'pagegroup.step1Location.nameTh': req.body.nameTh,
                'pagegroup.step1Location.nameEn': req.body.nameEn,
                'pagegroup.step1Location.abbrev': req.body.abbrev,
                'pagegroup.step1Location.status': req.body.status,
                // 'pagegroup.step1Location.effectiveDt': req.body.effectiveDt,
                'pagegroup.step1Location.remark': req.body.remark,
                'pagegroup.step1Location.shopClass': req.body.shopClass,
                'pagegroup.step1Location.shopSegment': req.body.shopSegment,
                'pagegroup.step1Location.shopArea': req.body.shopArea,
                'pagegroup.step1Location.shopType': req.body.shopType,
                'pagegroup.step1Location.isOpeningMon': req.body.isOpeninMon,
                'pagegroup.step1Location.openingHourMon': req.body.OpeningHourMon,
                'pagegroup.step1Location.closingHourMon': req.body.closingHourMon ,
                'pagegroup.step1Location.isOpeningTue': req.body.isOpeningTue ,
                'pagegroup.step1Location.openingHourTue': req.body.openingHourTue ,
                'pagegroup.step1Location.closingHourTue': req.body.closingHourTue ,
                'pagegroup.step1Location.isOpeningWed': req.body.isOpeningWed  ,
                'pagegroup.step1Location.openingHourWed': req.body.openingHourWed ,
                'pagegroup.step1Location.closingHourWed': req.body.closingHourWed ,
                'pagegroup.step1Location.isOpeningThu': req.body.isOpeningThu,
                'pagegroup.step1Location.openingHourThu': req.body.openingHourThu,
                'pagegroup.step1Location.closingHourThu': req.body.closingHourThu,
                'pagegroup.step1Location.isOpeningFri': req.body.isOpeningFri,
                'pagegroup.step1Location.openingHourFri': req.body.openingHourFri,
                'pagegroup.step1Location.closingHourFri': req.body.closingHourFri,
                'pagegroup.step1Location.isOpeningSat': req.body.isOpeningSat,
                'pagegroup.step1Location.openingHourSat': req.body.openingHourSat,
                'pagegroup.step1Location.closingHourSat': req.body.closingHourSat,
                'pagegroup.step1Location.isOpeningSun': req.body.isOpeningSun,
                'pagegroup.step1Location.openingHourSun': req.body.openingHourSun,
                'pagegroup.step1Location.closingHourSun': req.body.closingHourSun,
                'pagegroup.step1Location.isOpeningHoliday': req.body.isOpeningHoliday,
                'pagegroup.step1Location.openingHourHoliday': req.body.openingHourHoliday,
                'pagegroup.step1Location.closingHourHoliday': req.body.closingHourHoliday,

                    /** 

             "contactNumber": [
                {
                "phoneType": "mobile",
                "phoneNumber": "0891234567",
                "phoneExt": ",
                "phoneMainFlg": "Y"
                },
                {
                "phoneType": "office",
                "phoneNumber": "022123456",
                "phoneExt": "#123",
                "phoneMainFlg": "N"
                }
            ]
            */
            }

        }

        try {
            locationDraft.update(
                {
                    _id: req.params.draftId ,
                },
                {
                    $set:   pagegroupData

                },
                function (err, count) {
                    // if (err) return next(err);
                    // callback(err, count);
                    if(!err){
                        result.responseCode = 200;
                        result.responseMessage = 'Success';
                        res.json(result);
                    }else{
                        result.responseCode = 404;
                        result.responseMessage = 'fail';
                        res.json(result);

                    }
                });

        }catch (err){
             result.responseCode = 500;
             result.responseMessage = 'fail';
             res.json(result);
        }

        

        

    } else {
        result.responseCode = 500;
        result.responseMessage = 'Invalid Parameter';
        res.json(result);
    }

}

exports.draftDelete = function (req, res) {
    var result = {
        responseCode: '',
        responseMessage: '',
        responseDescription: []
    }

    if (req.query.id && req.query.userFullname) {
        const query = {}
        query['mgQuery'] = {
            _id: req.query.id
        };
        let updateData = {
            $set: {
                modifiedBy: req.query.userFullname,
                modifiedDate: moment(),
                status: "DELETED"
            }
        };
        locationDraft.findOneAndUpdate(query['mgQuery'], updateData, {
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

module.exports = exports;
/* ------------- [END IMPLEMENT API] ------------ */