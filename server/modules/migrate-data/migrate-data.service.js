if (process.env.LOCAL_UN_AUTH) {
    process.env[process.env.LOCAL_UN_AUTH] = String(process.env.LOCAL_UN_AUTH_STATUS);
}
var env = process.env.NODE_ENV || 'development';
var cfg = require('../../config/config.js');
var _request = require('request-promise');
const fs = require('fs');
var moment = require('moment');
var extend = require('util')._extend;
var _request = require('../../connector/http-connector');
var logger = require('../../utils/logger');
var utils = require('../../utils/common');
const _const = require('./migrate-data.const');
//constant =================================================================
var HEADERS = {
    "headers": {
        "Content-Type": "application/json",
        "User-Agent": "phxpartners",
        "Accept": "application/json"
    }
};

// var request = function (method, url, _options) {
//     var options = JSON.parse(JSON.stringify(HEADERS));
//     if(_options){
//         options = extend(options, _options);
//     }
//     options.json = true;
//     options.url = url;
//     options.method = method;    
//     if( (method.toUpperCase() == 'POST' || method.toUpperCase() == 'PUT') && options.body ){
//         options.headers = options.headers || {};
//         options.headers["Content-Length"] = Buffer.byteLength(JSON.stringify(options.body));
//     }else{
//         delete options.headers["Content-Length"] ;
//     }
//     return _request(options);
// };

exports.addLocation = function (data) {
    var url = cfg.service.PANDORA.URI + _const.URL_CREATE_LOCATION;
    // var opt = {};
   var dataPost = { data : data};
    // opt.json = true;
    return _request.post(url, dataPost, {
        service: 'phxpartners-be'
    });
}

exports.getLocationByLocationCode = function (locationCode) {
    var url = cfg.service.PANDORA.URI + _const.URL_GET_LOCATION;
    url += '?filter=(&(locationCode=' + locationCode + ')(groupName=ADMIN))&limit=1';
    return _request.get(url, {
        service: 'phxpartners-be'
    }).then(function (result) {
        console.log('getLocation ' + locationCode + '  ==> ' + JSON.stringify(result));
        // var retData = null;
        // if (result.resultCode == '20000') {
        //     retData = result.resultData[0].viewLocationList[0];
        // }
        return result;
        // return result;
    });
}

exports.getLocationProfile = function (locationCode, subRegion) {
    var url = cfg.service.PANDORA.URI + _const.URL_GET_PROFILE;
    url += '?filter=(&(locationCode=' + locationCode + ')(subRegion=' + subRegion + '))';
    return _request.get(url, {
        service: 'phxpartners-be'
    }).then(function (result) {
        console.log('getLocationProfile ' + locationCode + '  ==> ' + JSON.stringify(result));
        var retData = null;
        if (result.resultCode == '20000') {
            retData = result.resultData[0].location[0];
        }
        return retData;
    });
}

exports.getLocationInfo = function (locationCode) {
    var url = cfg.service.PANDORA.URI + _const.URL_GET_INFO;
    url += '?filter=(&(locationCode=' + locationCode + '))';
    return _request.get(url, {
        service: 'phxpartners-be'
    }).then(function (result) {
        console.log('getLocation ' + locationCode + '  ==> ' + JSON.stringify(result));
        var retData = null;
        if (result.resultCode == '20000') {
            retData = result.resultData[0].location[0];
        }
        return retData;
    });
}

exports.updLocationInfo = function(locationCode , updData){
    logger.info('Migrate upd location info : '+locationCode);
    logger.debug('locationCode ' + locationCode + " :: " + JSON.stringify(updData));
    var filter = {};
    filter.locationCode = locationCode;
    var ret = { method : 'update info'};
    var dataUpd = {
        location: [updData]
    };
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var url = cfg.service.PANDORA.URI + _const.URL_EDIT_INFO +'?filter=' + queryStr;
        logger.info('PUT :: ' + url);
        return _request.put(url, dataUpd, {
            service: 'phxpartners-be'
        }).then(function (response) {
            ret.responseCode = response.resultCode;
            if (response.resultCode == '20000') {
                ret.data = response.resultData;
            }else{
                ret.error = response.resultDescription;
            }
            return ret;
        });
    } catch (error) {
        logger.errorStack(error)
        ret.error = error.message;
        return ret;
    }
}

exports.getLocationAddress = function (locationCode) {
    var url = cfg.service.PANDORA.URI + _const.URL_GET_ADDRESS;
    url += '?filter=(&(locationCode=' + locationCode + '))';
    return _request.get(url, {
        service: 'phxpartners-be'
    }).then(function (result) {
        console.log('getLocationAddress ' + locationCode + '  ==> ' + JSON.stringify(result));
        var retData = null;
        if (result.resultCode == '20000') {
            retData = result.resultData[0].address;
        }
        return retData;
    });
}

exports.updLocationAddress = function(locationCode , updData){
    logger.info('Migrate upd location address : '+locationCode);
    logger.debug('locationCode ' + locationCode + " :: " + JSON.stringify(updData));
    var filter = {};
    filter.locationCode = locationCode;
    var ret = { method : 'update address'};
    var dataUpd = {
        address: updData
    };
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var url = cfg.service.PANDORA.URI + _const.URL_EDIT_ADDRESS +'?filter=' + queryStr;
        logger.info('PUT :: ' + url);
        return _request.put(url, dataUpd, {
            service: 'phxpartners-be'
        }).then(function (response) {
            ret.responseCode = response.resultCode;
            if (response.resultCode == '20000') {
                ret.data = response.resultData;
            }else{
                ret.error = response.resultDescription;
            }
            return ret;
        });
    } catch (error) {
        logger.errorStack(error)
        ret.error = error.message;
        return ret;
    }
}

exports.getLocationVatAddress = function (locationCode) {
    var url = cfg.service.PANDORA.URI + _const.URL_GET_VAT_ADDRESS;
    url += '?filter=(&(locationCode=' + locationCode + '))';
    return _request.get(url, {
        service: 'phxpartners-be'
    }).then(function (result) {
        console.log('getLocationVatAddress ' + locationCode + '  ==> ' + JSON.stringify(result));
        var retData = null;
        if (result.resultCode == '20000') {
            retData = result.resultData[0].vatAddress;
        }
        return retData;
    });
}

exports.updLocationVatAddress = function(locationCode , updData){
    logger.info('Migrate upd location vat-address : '+locationCode);
    logger.debug('locationCode ' + locationCode + " :: " + JSON.stringify(updData));
    var filter = {};
    filter.locationCode = locationCode;
    var ret = { method : 'update vat-address'};
    var dataUpd = {
        vatAddress: updData
    };
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var url = cfg.service.PANDORA.URI + _const.URL_EDIT_VAT_ADDRESS +'?filter=' + queryStr;
        logger.info('PUT :: ' + url);
        return _request.put(url, dataUpd, {
            service: 'phxpartners-be'
        }).then(function (response) {
            ret.responseCode = response.resultCode;
            if (response.resultCode == '20000') {
                ret.data = response.resultData;
            }else{
                ret.error = response.resultDescription;
            }
            return ret;
        });
    } catch (error) {
        logger.errorStack(error)
        ret.error = error.message;
        return ret;
    }
}

exports.getLocationContact = function (locationCode) {
    var url = cfg.service.PANDORA.URI + _const.URL_GET_CONTACT;
    url += '?filter=(&(locationCode=' + locationCode + '))';
    return _request.get(url, {
        service: 'phxpartners-be'
    }).then(function (result) {
        console.log('getLocationContact ' + locationCode + '  ==> ' + JSON.stringify(result));
        var retData = null;
        if (result.resultCode == '20000') {
            retData = result.resultData[0].contactPerson;
        }
        return retData;
    });
}

exports.updLocationContact = function(locationCode , updData){
    logger.info('Migrate upd location contact : '+locationCode);
    logger.debug('locationCode ' + locationCode + " :: " + JSON.stringify(updData));
    var filter = {};
    filter.locationCode = locationCode;
    var ret = { method : 'update contact'};
    var dataUpd = {
        contact : updData
    };
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var url = cfg.service.PANDORA.URI + _const.URL_EDIT_CONTACT+'?filter=' + queryStr;
        logger.info('PUT :: ' + url);
        return _request.put(url, dataUpd, {
            service: 'phxpartners-be'
        }).then(function (response) {
            ret.responseCode = response.resultCode;
            if (response.resultCode == '20000') {
                ret.data = response.resultData;
            }else{
                ret.error = response.resultDescription;
            }
            return ret;
        });
    } catch (error) {
        logger.errorStack(error)
        ret.error = error.message;
        return ret;
    }
}