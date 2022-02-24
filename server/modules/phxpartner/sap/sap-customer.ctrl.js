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

exports.syncSap = function (req, res) {
    // console.log(req.id,"------------------------- id --------------------------");
    // console.log(req.currentUser,"------------------------------------- currentUser ----------------------------------------");
    // console.log(req.body,"-------------------------------------- body -------------------------------------------");
    // console.log(req.body.pageGroup,"-------------------------------------- body.pageGroup -------------------------------------------");

    var sapData = req.body
    logger.info('api create sap');
    var retList = [];
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };
    try {
            const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
            var timeStamp = moment().format(DATETIME_FORMAT);
            var sap = [];
            console.log(sapData,'-------------------------------');
            sap.push(createSap());
            sap.push(updateSap());
            Promise.all(sap).then(()=>{
                res.json(retList);
            });

            function createSap() {
                if (sapData.create && sapData.create.length > 0) {
                    var uri = cfg.service.PANDORA.URI + '/phxPartner/v1/sap/customer/createCustomer.json';
                    sapData.create.forEach(sapNew => {
                        var requestNo = sapNew.REQUEST.No;
                        delete sapNew.REQUEST.No;
                        var data = {
                            parentTxId: timeStamp,
                            REQUEST: sapNew.REQUEST,
                            sapPhx: sapNew.sapPhx
                        };
                        console.log(data, '------------------- create ----------------');   

                        // logger.info('POST :: ' + uri);
                        // logger.debug('body :: ' + JSON.stringify(data));
                        // clientHttp.post(uri, data, {
                        //     service: 'phxpartners-be',
                        //     callService: 'CREATE_CUSTOMER',
                        //     reqId: req.id
                        // }).then(function (response) {
                        //     logger.info('response :: ' + JSON.stringify(response));
                        //     ret.requestNo = requestNo;
                        //     if (parseInt(response.resultCode) == 20000) {
                        //         ret.responseCode = 200;
                        //         ret.responseDescription = response.resultDescription;
                        //         retList.push(ret);
                        //     } else if (parseInt(response.resultCode) == 42410) {
                        //         ret.responseCode = 424;
                        //         ret.responseMessage = "Fail";
                        //         ret.responseDescription = response.resultDescription;
                        //         retList.push(ret);
                        //     } else {
                        //         ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                        //         ret.userMessage = response.userMessage;
                        //         ret.responseMessage = "Fail";
                        //         ret.responseDescription = response.resultDescription;
                        //         retList.push(ret);
                        //     }
                        // }).catch(function (err) {
                        //     logger.error(err)
                        //     ret.responseCode = 500;
                        //     ret.responseMessage = 'Fail';
                        //     ret.responseDescription = err.message;
                        //     retList.push(ret);
                        // });
                        ret.responseCode = 200;
                        ret.responseDescription = 'Success';
                        ret.data = data;
                        retList.push(ret);
                    });
                }
            }

            function updateSap() {
                if (sapData.change && sapData.change.length > 0) {
                    var username = req.currentUser.username;
                    var uri = cfg.service.PANDORA.URI + '/phxPartner/v1/sap/customer/createCustomer.json';
                    sapData.change.forEach(sapUpd => {
                        var requestNo = sapUpd.REQUEST.No;
                        delete sapUpd.REQUEST.No;
                        var data = {
                            parentTxId: timeStamp,
                            REQUEST: sapUpd.REQUEST,
                            sapPhx: sapUpd.sapPhx
                        };
                        
                        console.log(data, '------------------- update ----------------'); 
                                
                        // logger.info('PUT :: ' + uri);
                        // logger.debug('body :: ' + JSON.stringify(data));
                        // clientHttp.put(uri, data, {
                        //     service: 'phxpartners-be',
                        //     callService: 'UPDATE_CUSTOMER',
                        //     reqId: req.id
                        // }).then(function (response) {
                        //     logger.info('response :: ' + JSON.stringify(response));
                        //     ret.requestNo = requestNo;
                        //     if (parseInt(response.resultCode) == 20000) {
                        //         ret.responseCode = 200;
                        //         ret.responseDescription = response.resultDescription;
                        //         retList.push(ret);
                        //     } else if (parseInt(response.resultCode) == 42410) {
                        //         ret.responseCode = 424;
                        //         ret.responseMessage = "Fail";
                        //         ret.responseDescription = response.resultDescription;
                        //         retList.push(ret);
                        //     } else {
                        //         ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                        //         ret.userMessage = response.userMessage;
                        //         ret.responseMessage = "Fail";
                        //         ret.responseDescription = response.resultDescription;
                        //         retList.push(ret);
                        //     }
                        // }).catch(function (err) {
                        //     logger.error(err)
                        //     ret.responseCode = 500;
                        //     ret.responseMessage = 'Fail';
                        //     ret.responseDescription = err.message;
                        //     retList.push(ret);
                        // });
                        ret.responseCode = 200;
                        ret.responseDescription = 'Success';
                        ret.data = data;
                        retList.push(ret);
                    });
                }
            }
    } catch (error) {
        logger.errorStack(error)
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        res.json(ret);
    }
};