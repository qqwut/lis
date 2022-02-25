var moment = require('moment');
var env = process.env.NODE_ENV || 'development';
var logger = require('../../../utils/logger');
var userGroupMod = require('../../../model/userGroup.js');
var requestFlowDraftMod = require('../../../model/requestFlow');
var http = require('http');
var clientHttp = require("../../../connector/http-connector.js");
var express = require('express');
var _router = express.Router();
var multer = require('multer');
var path = require('path');
var multer  = require('multer')
var upload = multer()
// app.post('/profile', upload.array('photos'), function (req, res, next) {

// })
exports.uploadFileRequestFlow = function (req, res) {
    console.log("uploadFileRequestFlow SAVE FILE");
    console.log("==================================================================================");
    console.log(req)
    console.log("==================================================================================");
    // const multer = require('multer');
    const storage = multer.diskStorage({
        destination: (req, file, callBack) => {
            callBack(null, 'logs')
        },
        filename: (req, file, callBack) => {
            callBack(null, `${file.originalname}`)
        }
    })

    // const upload = multer({ storage: storage })
    // window.localStorage.setItem(upload.array('uploads[]'), (req, res, next) => {
    //     const files = req.files;
    //     console.log(files);
    //     if (!files) {
    //       const error = new Error('No File')
    //       error.httpStatusCode = 400
    //       return next(error)
    //     }
    //     res.json({
    //         responseCode: 200,
    //         responseMessage: 'Success',
            
    //     });
    //     return;
    //   })
      const upload = multer({ storage: storage }).array('uploads[]')
      upload(req, res, function(err) {
        const files = req.files;
        console.log(files);
        if (!files) {
          const error = new Error('No File')
          error.httpStatusCode = 400
          return next(error)
        }
        res.json({
            responseCode: 200,
            responseMessage: 'Success',
            
        });
        return;
        // if (err) {
        //     return res.end("Something went wrong!");
        // }
        // return res.end("File uploaded sucessfully!.");
    });
    
}
exports.addrequestFlowDraft = function (req, res) {
    try {
        logger.info('add RequestFlow draft');
        var dataDraft = req.body;
        console.log("==================================================================================");
        console.log(dataDraft);
        console.log("==================================================================================");
        var userId = req.currentUser.username;
        dataDraft.createdBy = userId;
        var userGroupAuth = Array.isArray(req.currentUser.userGroup) ? req.currentUser.userGroup : [req.currentUser.userGroup];

        // if (!(dataDraft.companyAbbr && dataDraft.distChnCode &&
        //     dataDraft.chnSalesCode && dataDraft.createdBy) && dataDraft.chnType == 'I') {
        //     res.json({
        //         responseCode: 400,
        //         responseMessage: 'Bad request'
        //     });
        //     return;
        // }

        var promises = [];
        var condition = {};

        if (userGroupAuth.indexOf("ADMIN") != -1) {
            condition = {
                distChnCode_key1: dataDraft.companyInfo.distChnCode,
                chnSalesCode_key2: dataDraft.companyInfo.chnSalesCode,
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
                distChnCode_key1: dataDraft.companyInfo.distChnCode,
                chnSalesCode_key2: dataDraft.companyInfo.chnSalesCode,
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
        Promise.all(promises).then(function (results) {
            var userGroups = results[0];
            console.dir("userGroupPm Create")
            console.dir(userGroups)
            var requestFlowDraft = {
                // status: "PROGRESS",
                // step: "0",
                url: "/requestFlow/AE",
                userGroup: userGroups,
                createdBy: dataDraft.createdBy,
                lastUpdBy: dataDraft.createdBy
            };

            var now = moment();
            var createDt = new Date(now.year(), now.month(), now.date(), now.hours(), now.minutes(), now.seconds(), now.milliseconds());
            requestFlowDraft.createdDate = createDt;
            requestFlowDraft.lastUpdDate = createDt;
            requestFlowDraft.requestFlow = {}
            console.log(dataDraft.companyInfo)
            if (dataDraft.companyInfo) {
                requestFlowDraft.requestFlow.companyInformation = dataDraft.companyInfo
            }
            if (dataDraft.locationInfo) {
                requestFlowDraft.requestFlow.locationInformation = dataDraft.locationInfo
            }
            if (dataDraft.addressInfo) {
                requestFlowDraft.requestFlow.addressInformation = dataDraft.addressInfo
            }
            console.log('***************financialInfo****************', dataDraft.financialInfo)
            if (dataDraft.financialInfo) {
                requestFlowDraft.requestFlow.financialInformation = dataDraft.financialInfo
            }
            console.log('***************retailDistributorInfo****************', dataDraft.retailDistributorInfo)
            if (dataDraft.retailDistributorInfo) {
                requestFlowDraft.requestFlow.retailDistributorInformation = dataDraft.retailDistributorInfo
            }
            console.log('***************contactInfo****************', dataDraft.contactInfo)
            if (dataDraft.contactInfo) {
                requestFlowDraft.requestFlow.retailDistributorInformation = dataDraft.contactInfo
            }
            console.log('***************userInfo****************', dataDraft.userInfo)
            if (dataDraft.userInfo) {
                requestFlowDraft.requestFlow.retailDistributorInformation = dataDraft.userInfo
            }
            console.log('***************remark****************', dataDraft.remark)
            if (dataDraft.remark) {
                requestFlowDraft.remark = dataDraft.remark
            }
            console.log('***************requestFlowDraft***************', requestFlowDraft)
            // res.json({
            //     responseCode: 200,
            //     responseMessage: 'Success',
            //     data: {
            //         requestFlowDraft: requestFlowDraft
            //     }
            // });
            // return;
            requestFlowDraftMod.create(requestFlowDraft, function (err, draft) {
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
                        requestFlowDraftId: draft._id
                    },
                    dataCreate: {
                        requestFlowDraft: requestFlowDraft
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
    } catch (err) {
        var ret = {
            responseCode: 500,
            responseMessage: "Fail",
            error: err.message
        };
        res.status(500).json(ret);
    }

};