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

const PREFIX = cfg.service.PANDORA.PREFIX

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
                    var uri = cfg.service.PANDORA.URI+PREFIX + '/sap/customer/createCustomer.json';
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
                    var uri = cfg.service.PANDORA.URI+PREFIX + '/sap/customer/createCustomer.json';
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

exports.getPayDirectVendor = function (req, res) {
    logger.info('API GET PAY DIRECT VENDOR');
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };
    try {
        var filter = req.query;
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI+PREFIX + '/sap/payDirectVendor/info.json?filter=' + queryStr;
        logger.info('get product list to uri :: ' + uri);
        
        return clientHttp.get(uri).then(function (response) {
            logger.info('get product list resultCode  :: ' + (response? response.resultCode+':'+response.resultDescription : ''));
            if (response.resultCode == '20000') {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = 'Success';
                ret.data = response.resultData.payDirect;
                return res.json(ret);
            } else {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = 'Fail';
                ret.responseDescription = response.resultDescription;
                return res.json(ret);
            }
        }).catch(function (err) {
            logger.error('error request GET Product List :: ', err);
            ret.responseCode = 500;
            ret.responseMessage = 'Fail';
            ret.responseDescription = err.message;
            return res.json(ret);
        });
    } catch (error) {
        logger.errorStack(error);
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        return res.json(ret);
    }
    
};

exports.getSapCustomerAddress = function (req,res){
    logger.info('API GET SAP Customer Address');
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };
    try {
        var filter = req.query;
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI+PREFIX + '/sap/customer/address.json?filter=' + queryStr;
        logger.info('get Sap Customer :: ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'GET_SAP_ADDRESS',
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
            ret.data= response.resultData;
            res.json(ret);
        }).catch(function (err) {
            logger.error(err)
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
        return res.json(ret);
    }
}

exports.getSapListInfo = function (req, res) {
    var result = {
        responseCode: '',
        responseMessage: '',
        responseDescription: []
    }
    var query = req.query;
    // console.log('================================= start kob =======================================')
    console.log(query)
    // console.log('================================= end kob =======================================')

    var filter = req.body || {};

    logger.debug('filter:' + JSON.stringify(filter));
    var ret = {};
    try {
        // console.log('================================= kob trycatch try =======================================')
        var queryStr = utils.getSDFFilter2QueryStr(null, query);
        var uri = cfg.service.PANDORA.URI+PREFIX + '/sap/list.json?filter=' + queryStr;
        logger.info('prepare option to sent request : ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'SEARCH_LOCATION',
            reqId: req.id,
        }).then(function (response) {
            // console.log('================================= kob then =======================================')
            logger.info('response  :: ' + response.resultCode + ':' + response.resultDescription);
            if (parseInt(response.resultCode) != 20000) {
                // console.log('================================= kob if =======================================')
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = 'Fail';
                ret.responseDescription = response.resultDescription;
                res.json(ret);
            }else{
                // console.log('================================= kob else =======================================')
                ret.responseCode = 200;
                ret.responseDescription = 'Success';
                ret.data = response.resultData.sapList;
                res.json(ret);
                console.log(response.resultData.sapList)
                // console.log('================================= kob else =======================================')
            }
           
        }).catch(function (err) {
            // console.log('================================= kob catch =======================================')
            logger.errorStack(err);
            ret.responseCode = 500;
            ret.responseMessage = 'Fail';
            ret.responseDescription = err.message;
            res.json(ret);
        });
    } catch (error) {
        // console.log('================================= kob trycatch catch =======================================')
        logger.errorStack(error);
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        res.json(ret);
    }
};

exports.createSapCustomer = function (req, res) {

    logger.info('Create Sap Customer');
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };
    var data = req.body;
    try {
        var filter = req.query;
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI+PREFIX + '/sap/customer/createCustomer.json?filter=' + queryStr;
        
        logger.info('Create Sap Customer:: ' + uri);
        logger.debug('request data :: ' + JSON.stringify(data));
        return clientHttp.post(uri, data, {
            service : 'phxpartners-be' ,
            callService: 'CREATE_SAP_CUSTOMER', 
            reqId : req.id
        }).then(function (response) {
            logger.info('response ::' + JSON.stringify(response));
            if (parseInt(response.resultCode) != 20000) {
                if(parseInt(response.resultCode) == 40301){
                    ret.responseCode = 401
                }else if(parseInt(response.resultCode) == 40300){
                    ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                }else{
                    ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                }
                ret.responseMessage = response.moreInfo;
                ret.responseDescription = response.resultDescription;
                res.json(ret);
                return;
            }
            ret.responseCode = 200;
            ret.responseDescription = 'Success';
            ret.data = response.resultData
            res.json(ret);
        }).catch(function (err) {
            logger.error('error request :: '+err.message);
            ret.responseCode = 500;
            ret.responseMessage = 'Fail';
            ret.responseDescription = err.message;
            res.json(ret);
        });
        
    }
    catch (error) {
        logger.errorStack(error);
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        return res.json(ret);
    }
}

exports.getSapTransactionInfo = function (req, res) {
    var result = {
        responseCode: '',
        responseMessage: '',
        responseDescription: []
    }
    var query = req.query;
    // console.log('================================= start kob =======================================')
    console.log(query)
    // console.log('================================= end kob =======================================')

    var filter = req.body || {};

    logger.debug('filter:' + JSON.stringify(filter));
    var ret = {};
    try {
        // console.log('================================= kob trycatch try =======================================')
        var queryStr = utils.getSDFFilter2QueryStr(null, query);
        var uri = cfg.service.PANDORA.URI+PREFIX + '/sap/transaction.json?filter=' + queryStr;
        logger.info('prepare option to sent request : ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'SEARCH_LOCATION',
            reqId: req.id,
        }).then(function (response) {
            // console.log('================================= kob then =======================================')
            logger.info('response  :: ' + response.resultCode + ':' + response.resultDescription);
            if (parseInt(response.resultCode) != 20000) {
                // console.log('================================= kob if =======================================')
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = 'Fail';
                ret.responseDescription = response.resultDescription;
                res.json(ret);
            }else{
                console.log('================================= kob else =======================================')
                ret.responseCode = 200;
                ret.responseDescription = 'Success';
                ret.data = response.resultData.sapTransactionList;
                res.json(ret);
                console.log(response.resultData)
                console.log('================================= kob else =======================================')
            }
           
        }).catch(function (err) {
            // console.log('================================= kob catch =======================================')
            logger.errorStack(err);
            ret.responseCode = 500;
            ret.responseMessage = 'Fail';
            ret.responseDescription = err.message;
            res.json(ret);
        });
    } catch (error) {
        // console.log('================================= kob trycatch catch =======================================')
        logger.errorStack(error);
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        res.json(ret);
    }
};

exports.changeSapCustomer = function (req, res) {

    logger.info('Change Sap Customer');
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };
    var data = req.body;
    try {
        var filter = req.query;
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI+PREFIX + '/sap/customer/changeCustomer.json?filter=' + queryStr;
        
        logger.info('Change Sap Customer:: ' + uri);
        logger.debug('request data :: ' + JSON.stringify(data));
        return clientHttp.put(uri, data, {
            service : 'phxpartners-be' ,
            callService: 'CREATE_SAP_VENDOR', 
            reqId : req.id
        }).then(function (response) {
            logger.info('response ::' + JSON.stringify(response));
            if (parseInt(response.resultCode) != 20000) {
                if(parseInt(response.resultCode) == 40301){
                    ret.responseCode = 401
                }else if(parseInt(response.resultCode) == 40300){
                    ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                }else{
                    ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                }
                //ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = response.moreInfo;
                ret.responseDescription = response.resultDescription;
                res.json(ret);
                return;
            }
            ret.responseCode = 200;
            ret.responseDescription = 'Success';
            ret.data = response.resultData
            res.json(ret);
        }).catch(function (err) {
            logger.error('error request :: '+err.message);
            ret.responseCode = 500;
            ret.responseMessage = 'Fail';
            ret.responseDescription = err.message;
            res.json(ret);
        });
        
    }
    catch (error) {
        logger.errorStack(error);
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        return res.json(ret);
    }
};

exports.createSapVendor = function (req, res) {

    logger.info('Create Sap Vendor');
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };
    var data = req.body;
    try {
        var filter = req.query;
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI+PREFIX + '/sap/vendor/createVendor.json?filter=' + queryStr;
        
        logger.info('Create Sap Vendor:: ' + uri);
        logger.debug('request data :: ' + JSON.stringify(data));
        return clientHttp.post(uri, data, {
            service : 'phxpartners-be' ,
            callService: 'CREATE_SAP_VENDOR', 
            reqId : req.id
        }).then(function (response) {
            logger.info('response ::' + JSON.stringify(response));
            if (parseInt(response.resultCode) != 20000) {
                if(parseInt(response.resultCode) == 40301){
                    ret.responseCode = 401
                }else if(parseInt(response.resultCode) == 40300){
                    ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                }else{
                    ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                }
                ret.responseMessage = response.moreInfo;
                ret.responseDescription = response.resultDescription;
                res.json(ret);
                return;
            }
            ret.responseCode = 200;
            ret.responseDescription = 'Success';
            ret.data = response.resultData
            res.json(ret);
        }).catch(function (err) {
            logger.error('error request :: '+err.message);
            ret.responseCode = 500;
            ret.responseMessage = 'Fail';
            ret.responseDescription = err.message;
            res.json(ret);
        });
        
    }
    catch (error) {
        logger.errorStack(error);
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        return res.json(ret);
    }
};

exports.changeSapVendor = function (req, res) {

    logger.info('Change Sap Vendor');
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };
    var data = req.body;
    try {
        var filter = req.query;
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI+PREFIX + '/sap/vendor/changeVendor.json?filter=' + queryStr;
        
        logger.info('Change Sap Vendor:: ' + uri);
        logger.debug('request data :: ' + JSON.stringify(data));
        return clientHttp.put(uri, data, {
            service : 'phxpartners-be' ,
            callService: 'CREATE_SAP_VENDOR', 
            reqId : req.id
        }).then(function (response) {
            logger.info('response ::' + JSON.stringify(response));
            if (parseInt(response.resultCode) != 20000) {
                if(parseInt(response.resultCode) == 40301){
                    ret.responseCode = 401
                }else if(parseInt(response.resultCode) == 40300){
                    ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                }else{
                    ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                }
                ret.responseMessage = response.moreInfo;
                ret.responseDescription = response.resultDescription;
                res.json(ret);
                return;
            }
            ret.responseCode = 200;
            ret.responseDescription = 'Success';
            ret.data = response.resultData
            res.json(ret);
        }).catch(function (err) {
            logger.error('error request :: '+err.message);
            ret.responseCode = 500;
            ret.responseMessage = 'Fail';
            ret.responseDescription = err.message;
            res.json(ret);
        });
        
    }
    catch (error) {
        logger.errorStack(error);
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        return res.json(ret);
    }
};

exports.BlockSapCustomer = function (req, res) {
    console.log('=============================================== kob changeSapCustomerBlock =====================================================')

    logger.info('Change Sap Customer');
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };
    var data = req.body;
    console.log('================================= start kob =======================================')
    console.log(data)
    console.log("req.query")
    console.log(req.query)
    try {
        var filter = req.query;
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI+PREFIX + '/sap/customer/blockCustomer.json?filter=' + queryStr;

        console.log("queryStr")
        console.log(queryStr)
        console.log("filter")
        console.log(filter)
        console.log('================================= end kob =======================================')
        
        logger.info('Change Sap Customer:: ' + uri);
        logger.debug('request data :: ' + JSON.stringify(data));
        return clientHttp.put(uri, data, {
            service : 'phxpartners-be' ,
            callService: 'CREATE_SAP_VENDOR', 
            reqId : req.id
        }).then(function (response) {
            logger.info('response ::' + JSON.stringify(response));
            if (parseInt(response.resultCode) != 20000) {
                if(parseInt(response.resultCode) == 40301){
                    ret.responseCode = 401
                }else if(parseInt(response.resultCode) == 40300){
                    ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                }else{
                    ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                }
                ret.responseMessage = response.moreInfo;
                ret.responseDescription = response.resultDescription;
                res.json(ret);
                return;
            }
            ret.responseCode = 200;
            ret.responseDescription = 'Success';
            ret.data = response.resultData
            res.json(ret);
        }).catch(function (err) {
            logger.error('error request :: '+err.message);
            ret.responseCode = 500;
            ret.responseMessage = 'Fail';
            ret.responseDescription = err.message;
            res.json(ret);
        });
        
    }
    catch (error) {
        logger.errorStack(error);
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        return res.json(ret);
    }
};

exports.refCustomer = function (req, res) {
    logger.info('refCustomer');
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };
    var data = req.body;
    console.log(data)
    try {
        var filter = req.query;
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI+PREFIX + '/sap/customer/refCustomer.json';
        logger.info('refCustomer:: ' + uri);
        logger.debug('request data :: ' + JSON.stringify(data));
        return clientHttp.put(uri, data, {
            service : 'phxpartners-be' ,
            callService: 'REFERANCE_CUSTOMER', 
            reqId : req.id
        }).then(function (response) {
            logger.info('response ::' + JSON.stringify(response));
            if (parseInt(response.resultCode) != 20000) {
                if(parseInt(response.resultCode) == 40301){
                    ret.responseCode = 401
                }else if(parseInt(response.resultCode) == 40300){
                    ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                }else{
                    ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                }
                ret.responseMessage = response.moreInfo;
                ret.responseDescription = response.resultDescription;
                res.json(ret);
                return;
            }
            ret.responseCode = 200;
            ret.responseDescription = 'Success';
            ret.data = response.resultData
            res.json(ret);
            });
     } catch (error) {
        logger.errorStack(error);
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        return res.json(ret);
    }
};

exports.unrefCustomer = function (req,res) {
    logger.info('un refCustomer');
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };
    var data = req.query;
    console.log(data)
    try {
        var filter = req.query;
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI+PREFIX + '/sap/customer/refCustomer.json';
        logger.info('un refCustomer:: ' + uri);
        logger.debug('request data :: ' + JSON.stringify(data));
        return clientHttp.delete(uri, data, {
            service : 'phxpartners-be' ,
            callService: 'UN_REFERANCE_CUSTOMER', 
            reqId : req.id
        }).then(function (response) {
            logger.info('response ::' + JSON.stringify(response));
            if (parseInt(response.resultCode) != 20000) {
                if(parseInt(response.resultCode) == 40301){
                    ret.responseCode = 401
                }else if(parseInt(response.resultCode) == 40300){
                    ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                }else{
                    ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                }
                ret.responseMessage = response.moreInfo;
                ret.responseDescription = response.resultDescription;
                res.json(ret);
                return;
            }
            ret.responseCode = 200;
            ret.responseDescription = 'Success';
            ret.data = response.resultData
            res.json(ret);
            });
     } catch (error) {
        logger.errorStack(error);
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        return res.json(ret);
    }
}

exports.getSapPlantAndStorageListInfo = function (req,res) {
    logger.info('API GET PLANT AND STORAGE');
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };
    try {
        var filter = req.query;
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI+PREFIX + '/sap/customer/plantStorage.json?filter=' + queryStr;
        logger.info('get sap plant and storage :: ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'GET_PLANT_AND_STORAGE',
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
            ret.data = response.resultData
            res.json(ret);
       
          
        });
    } catch (error) {
        logger.errorStack(error);
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        return res.json(ret);
    }
};

exports.putSapPlantAndStorageListInfo = function (req, res) {
    logger.info('API PUT PLANT AND STORAGE');
    var ret = { responseCode: 200, responseMessage: 'Success' };

    try {
        var uri = cfg.service.PANDORA.URI+PREFIX + '/sap/customer/plantStorage.json';
        var data = req.body;
        logger.info('PUT :: ' + uri);
        logger.debug('body :: ' + JSON.stringify(data));
        clientHttp.put(uri, data, {
            service: 'phxpartners-be',
            callService: 'UPDATE_PLANT_AND_STORAGE',
            reqId: req.id
        }).then(function (response) {
            logger.info('response :: ' + JSON.stringify(response));
            if (parseInt(response.resultCode) == 20000) {
                ret.responseCode = 200;
                ret.responseDescription = response.resultDescription;
                res.json(ret);
            } else if (parseInt(response.resultCode) == 42410) {
                ret.responseCode = 424;
                ret.responseMessage = "Fail";
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

exports.partnerFunctionDelete = function (req, res) {
    logger.info('API GET Partner Function Delete');
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };
    try {
        var filter = req.query;
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI+PREFIX + '/sap/partnerFunctionDelete.json?filter=' + queryStr;
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'GET_PARTNER_FOR_DELETE',
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
            ret.data = response.resultData
            res.json(ret);
       
          
        });
    } catch (error) {
        logger.errorStack(error);
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        return res.json(ret);
    }
};

exports.partnerFunctionInsert = function (req, res) {
    logger.info('API GET partner Function Insert');
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };
    try {
        var filter = req.query;
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI+PREFIX + '/sap/partnerFunctionInsert.json?filter=' + queryStr;
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'GET_PARTNER_FOR_INSERT',
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
            ret.data = response.resultData
            res.json(ret);
       
          
        });
    } catch (error) {
        logger.errorStack(error);
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        return res.json(ret);
    }
};

exports.changeBlockCustomer = function (req, res) {
    logger.info('API change Block Customer');
    var ret = { responseCode: 200, responseMessage: 'Success' };

    try {
        var filter = req.query;
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI+PREFIX + '/sap/customer/changeBlockCustomer.json?filter=' + queryStr;
        var data = req.body;
        logger.info('PUT :: ' + uri);
        logger.debug('body :: ' + JSON.stringify(data));
        clientHttp.put(uri, data, {
            service: 'phxpartners-be',
            callService: 'UPDATE_CHANGE_BLOCK_CUSTOMER',
            reqId: req.id
        }).then(function (response) {
            logger.info('response :: ' + JSON.stringify(response));
            if (parseInt(response.resultCode) == 20000) {
                ret.responseCode = 200;
                ret.responseDescription = response.resultDescription;
                res.json(ret);
            } else if (parseInt(response.resultCode) == 42410) {
                ret.responseCode = 424;
                ret.responseMessage = "Fail";
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

exports.sameSaleArea = function (req, res) {
    logger.info('API GET Same Sale Area');
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };
    try {
        var filter = req.query;
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI+PREFIX + '/sap/sameSaleArea.json?filter=' + queryStr;
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'GET_SAME_SALE_AREA',
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
            ret.data = response.resultData
            res.json(ret);
       
          
        });
    } catch (error) {
        logger.errorStack(error);
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        return res.json(ret);
    }
};


exports.partySapChangeLicense = function (req, res) {
    logger.info(' API partySapChangeLicense');
    var ret = { responseCode: 200, responseMessage: 'Success' };

    try {
        var filter = req.query;
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI+PREFIX + '/sap/partySapChangeLicense.json?filter=' + queryStr;
        var data = req.body;
        logger.info('PUT :: ' + uri);
        logger.debug('body :: ' + JSON.stringify(data));
        clientHttp.put(uri, data, {
            service: 'phxpartners-be',
            callService: 'UPDATE_PARTY_SAP_CHANGE_LICENSE',
            reqId: req.id
        }).then(function (response) {
            logger.info('response :: ' + JSON.stringify(response));
            if (parseInt(response.resultCode) == 20000) {
                ret.responseCode = 200;
                ret.responseDescription = response.resultDescription;
                res.json(ret);
            } else if (parseInt(response.resultCode) == 42410) {
                ret.responseCode = 424;
                ret.responseMessage = "Fail";
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

exports.getlocationsapByCriteria = function(req, res) {
    var filter = req.query;
    logger.info("API Search SAP");
    var ret = {
      responseCode: 200,
      responseMessage: "Success"
    };
    try {
      var filter = req.query;
      var queryStr = utils.getSDFFilter2QueryStr(null, filter);
      var uri = cfg.service.PANDORA.URI + PREFIX + "/location/sap.json?filter=" + queryStr;
      logger.info("get sap to uri :: " + uri);
  
      return clientHttp
        .get(uri)
        .then(function(response) {
          logger.info(
            "get sap resultCode  :: " +
              (response
                ? response.resultCode + ":" + response.resultDescription
                : "")
          );
          if (response.resultCode == "20000") {
            ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
            ret.responseMessage = "Success";
            ret.data = response.resultData;
            return res.json(ret);
          } else {
            ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
            ret.responseMessage = "Fail";
            ret.responseDescription = response.resultDescription;
            return res.json(ret);
          }
        })
        .catch(function(err) {
          logger.error("error request Search sap :: ", err);
          ret.responseCode = 500;
          ret.responseMessage = "Fail";
          ret.responseDescription = err.message;
          return res.json(ret);
        });
    } catch (error) {
      logger.errorStack(error);
      ret.responseCode = 500;
      ret.responseMessage = "Fail";
      ret.responseDescription = error.message;
      return res.json(ret);
    }
  };

  exports.getSapMsgTransection = function (req, res) {
    logger.info('API GET SAP MSG TRANSECTION');
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };
    try {
        var filter = req.query;
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI+PREFIX + '/sap/msgTransaction.json?filter=' + queryStr;
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'GET_SAP_MSG_TANGSECTION',
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
            ret.data = response.resultData
            res.json(ret);
       
          
        });
    } catch (error) {
        logger.errorStack(error);
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        return res.json(ret);
    }
};