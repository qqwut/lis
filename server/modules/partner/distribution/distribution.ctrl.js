var fs = require('fs');
const path = require('path');
var moment = require('moment');
var _ = require('lodash');
var utils = require('../../../utils/common.js');
var env = process.env.NODE_ENV || 'development';
var cfg = require('../../../config/config.js');
var clientHttp = require('../../../connector/http-connector.js');
var utils = require('../../../utils/common.js');
var logger = require('../../../utils/logger');

const PREFIX = cfg.service.PANDORA.PREFIX

exports.getRetailDistributorInfo = function (req, res) {

    logger.info('API GET Retail Distributor List');
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };
    try {
        var filter = req.query;
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + PREFIX + '/retailDistributor/info.json?filter=' + queryStr;
        logger.info('get retail distributor to uri :: ' + uri);

        return clientHttp.get(uri).then(function (response) {
            logger.info('get retail distributor resultCode  :: ' + (response ? response.resultCode + ':' + response.resultDescription : ''));
            if (response.resultCode == '20000') {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = 'Success';
                ret.data = response.resultData.retailDistributorInfo;
                return res.json(ret);
            } else {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = 'Fail';
                ret.responseDescription = response.resultDescription;
                return res.json(ret);
            }
        }).catch(function (err) {
            logger.error('error request GET Retail Distributor :: ', err);
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

exports.getProductDistributorInfo = function (req, res) {

    logger.info('API GET Product Distributor List');
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };
    try {
        var filter = req.query;
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + PREFIX + '/productDistributor/info.json?filter=' + queryStr;
        logger.info('get product distributor to uri :: ' + uri);

        return clientHttp.get(uri).then(function (response) {
            logger.info('get product distributor resultCode  :: ' + (response ? response.resultCode + ':' + response.resultDescription : ''));
            if (response.resultCode == '20000') {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = 'Success';
                ret.data = response.resultData.productDistributorInfo;
                return res.json(ret);
            } else {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = 'Fail';
                ret.responseDescription = response.resultDescription;
                return res.json(ret);
            }
        }).catch(function (err) {
            logger.error('error request GET Product Distributor :: ', err);
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

exports.getProductList = function (req, res) {

    logger.info('API GET Product List');
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };
    try {
        var filter = req.query;
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + PREFIX + '/distribution/product/list.json?filter=' + queryStr;
        logger.info('get product list to uri :: ' + uri);

        return clientHttp.get(uri).then(function (response) {
            logger.info('get product list resultCode  :: ' + (response ? response.resultCode + ':' + response.resultDescription : ''));
            if (response.resultCode == '20000') {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = 'Success';
                ret.data = response.resultData.productGroup;
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

exports.getDistributorList = function (req, res) {

    logger.info('API GET Distributor List');
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };
    try {
        var filter = req.query;
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + PREFIX + '/distributor/list.json?filter=' + queryStr;
        logger.info('get distributor list to uri :: ' + uri);

        return clientHttp.get(uri).then(function (response) {
            logger.info('get distributor list resultCode  :: ' + (response ? response.resultCode + ':' + response.resultDescription : ''));
            if (response.resultCode == '20000') {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = 'Success';
                ret.data = response.resultData;
                return res.json(ret);
            } else {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = 'Fail';
                ret.responseDescription = response.resultDescription;
                return res.json(ret);
            }
        }).catch(function (err) {
            logger.error('error request GET Distributor List :: ', err);
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

exports.getProvinceList = function (req, res) {

    logger.info('API GET Province List');
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };
    try {
        var filter = req.query;
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + PREFIX + '/distribution/province/list.json?filter=' + queryStr;
        logger.info('get province list to uri :: ' + uri);

        return clientHttp.get(uri).then(function (response) {
            logger.info('get province list resultCode  :: ' + (response ? response.resultCode + ':' + response.resultDescription : ''));
            if (response.resultCode == '20000') {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = 'Success';
                ret.data = response.resultData.provinceList;
                return res.json(ret);
            } else {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = 'Fail';
                ret.responseDescription = response.resultDescription;
                return res.json(ret);
            }
        }).catch(function (err) {
            logger.error('error request GET Province List :: ', err);
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

exports.putRetailDistributorInfo = function (req, res) {

    logger.info('API PUT Retail Distributor List');
    var data = req.body;
    var filter = {};
    filter = req.query;
    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + PREFIX + '/retailDistributor/info.json?filter=' + queryStr;
        logger.info('put retail distributor to uri :: ' + uri);
        return clientHttp.put(uri, data, {
            service: 'phxpartners-be',
            callService: 'EDIT_REATAIL_DUSTRIBUTOR',
            reqId: req.id
        }).then(function (response) {
            logger.info('response :: ' + JSON.stringify(response));
            if (parseInt(response.resultCode) == 40301) {
                ret.responseCode = 403;
                ret.responseMessage = response.moreInfo;
                ret.responseDescription = response.resultDescription;
                ret.data = response.resultData;
                res.json(ret);
                return;
            } else if (parseInt(response.resultCode) != 20000) {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = response.moreInfo;
                ret.responseDescription = response.resultDescription;
                res.json(ret);
            } else {
                ret.responseCode = 200;
                ret.responseDescription = 'Success';
                res.json(ret);
            }


        }).catch(function (err) {
            logger.error('error request PUT Retail Distributor :: ' + err.message);
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

exports.putProductDistributorInfo = function (req, res) {

    logger.info('API PUT Product Distributor List');
    var data = req.body;
    var filter = {};
    filter = req.query;
    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + PREFIX + '/productDistributor/info.json?filter=' + queryStr;
        logger.info('put product distributor to uri :: ' + uri);
        return clientHttp.put(uri, data, {
            service: 'phxpartners-be',
            callService: 'EDIT_PRODUCT_DUSTRIBUTOR',
            reqId: req.id
        }).then(function (response) {
            logger.info('response :: ' + JSON.stringify(response));
            if (parseInt(response.resultCode) == 40301) {
                ret.responseCode = 403;
                ret.responseMessage = response.moreInfo;
                ret.responseDescription = response.resultDescription;
                ret.data = response.resultData;
                res.json(ret);
                return;
            } else if (parseInt(response.resultCode) != 20000) {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = response.moreInfo;
                ret.responseDescription = response.resultDescription;
                res.json(ret);
            } else {
                ret.responseCode = 200;
                ret.responseDescription = 'Success';
                res.json(ret);
            }


        }).catch(function (err) {
            logger.error('error request PUT Product Distributor :: ' + err.message);
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
exports.getOneStepDistributorList = function (req, res) {

    logger.info('API GET ONESTEP Distributor List');
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };
    try {
        var filter = req.query;
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + PREFIX + '/onestep/distributor/list.json?filter=' + queryStr;
        logger.info('get onestep distributor to uri :: ' + uri);

        return clientHttp.get(uri).then(function (response) {
            logger.info('get onestep distributor resultCode  :: ' + (response ? response.resultCode + ':' + response.resultDescription : ''));
            if (response.resultCode == '20000') {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = 'Success';
                ret.data = response.resultData.retailDistributorInfo;
                return res.json(ret);
            } else {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = 'Fail';
                ret.responseDescription = response.resultDescription;
                return res.json(ret);
            }
        }).catch(function (err) {
            logger.error('error request GET ONESTEP Distributor :: ', err);
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

exports.getRetailProductDistributorInfo = function (req, res) {

    logger.info('API GET Retail Product Distributor List');
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };
    try {
        var filter = req.query;
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + PREFIX + '/productDistributor/retail.json?filter=' + queryStr;
        logger.info('get retail product distributor to uri :: ' + uri);

        return clientHttp.get(uri).then(function (response) {
            logger.info('get retail product distributor resultCode  :: ' + (response ? response.resultCode + ':' + response.resultDescription : ''));
            if (response.resultCode == '20000') {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = 'Success';
                ret.responseDescription = response.resultDescription;
                return res.json(ret);
            } else {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = 'Fail';
                ret.responseDescription = response.resultDescription;
                return res.json(ret);
            }
        }).catch(function (err) {
            logger.error('error request GET Retail Product Distributor :: ', err);
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

exports.getProductOldDistributorInfo = function (req, res) {

    logger.info('API GET Product Old Distributor List');
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };
    try {
        var filter = req.query;
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + PREFIX + '/distributionRelation/getOldDistributor.json?filter=' + queryStr;
        logger.info('get product distributor to uri :: ' + uri);

        return clientHttp.get(uri).then(function (response) {
            logger.info('get product distributor resultCode  :: ' + (response ? response.resultCode + ':' + response.resultDescription : ''));
            if (response.resultCode == '20000') {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = 'Success';
                ret.moreInfo = response.moreInfo
                ret.data = response.resultData.oldDistributor
                return res.json(ret);
            } else {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = 'Fail';
                ret.responseDescription = response.resultDescription;
                ret.moreInfo = response.moreInfo
                ret.data = response.resultData
                return res.json(ret);
            }
        }).catch(function (err) {
            logger.error('error request GET Product Distributor :: ', err);
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

exports.getProductNewDistributorInfo = function (req, res) {

    logger.info('API GET Product New Distributor List');
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };
    try {
        var filter = req.query;
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + PREFIX + '/distributionRelation/getNewDistributor.json?filter=' + queryStr;
        logger.info('get product distributor to uri :: ' + uri);

        return clientHttp.get(uri).then(function (response) {
            logger.info('get product distributor resultCode  :: ' + (response ? response.resultCode + ':' + response.resultDescription : ''));
            if (response.resultCode == '20000') {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = 'Success';
                ret.data = response.resultData.newDistributor
                return res.json(ret);
            } else {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = 'Fail';
                ret.responseDescription = response.resultDescription;
                ret.moreInfo = response.moreInfo
                ret.data = response.resultData
                return res.json(ret);
            }
        }).catch(function (err) {
            logger.error('error request GET Product Distributor :: ', err);
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

exports.putRelationDistributionInfo = function (req, res) {
    logger.info('API GET Product New Distributor List');
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };

    var data = req.body;
    var filter = {};
    filter = req.query;
    var ret = {};

    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + PREFIX + '/distributionRelation/info.json?filter=' + queryStr;
        logger.info('PUT :: ' + uri);
        return clientHttp.put(uri, data, {
            service: 'phxpartners-be',
            callService: 'PUT_RELATION_DISTRIBUTION',
            reqId: req.id
        }).then(function (response) {
            if (response.resultCode == '20000') {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = 'Success';
                ret.moreInfo = response.moreInfo
                return res.json(ret);
            } else {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.responseMessage = 'Fail';
                ret.responseDescription = response.resultDescription;
                ret.moreInfo = response.moreInfo
                ret.data = response.resultData
                return res.json(ret);
            }
        }).catch(function (err) {
            logger.error('error request PUT Relation Distribution :: ', err);
            ret.responseCode = 500;
            ret.responseMessage = 'Fail';
            ret.responseDescription = err.message;
            return res.json(ret);
        })
    } catch (error) {
        logger.errorStack(error);
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        return res.json(ret);
    }
}