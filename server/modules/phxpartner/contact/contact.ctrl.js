var fs = require('fs');
const path = require('path');
var moment = require('moment');
var _ = require('lodash');
var env = process.env.NODE_ENV || 'development';
var cfg = require('../../../config/config.js');
var clientHttp = require('../../../connector/http-connector.js');
var locationDraftMod = require('../../../model/locationDraft.js');
var companyMod = require('../../../model/company.js');
var userGroupMod = require('../../../model/userGroup.js');
var openingHoursMod = require('../../../model/openingHours.js');
var mappingRegionMod = require('../../../model/mappingRegion.js');
var proviceMod = require('../../../model/province.js');
var subRegionMod = require('../../../model/subRegion.js');
var zipCodeMod = require('../../../model/zipCode.js');
var authFieldMod = require('../../../model/authField.js');
var logger = require('../../../utils/logger');

exports.getContact = function (req, res) {
    var id = req.params.id;
    logger.info('Search Contact');
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };
    try {
        var filter = '';
        
// pincode
// fnameTh
// lnameTh
// fnameEn
// lnameEn

        if(req.query.pinCode){
            filter = filter+'(pinCode'+'='+req.query.pinCode+')';
        }
        if(req.query.fnameTh){
            filter = filter+'(fnameTh'+'='+req.query.fnameTh+')';
        }
        if(req.query.lnameTh){
            filter = filter+'(lnameTh'+'='+req.query.lnameTh+')';
        }
        if(req.query.fnameEn){
            filter = filter+'(fnameEn'+'='+req.query.fnameEn+')';
        }
        if(req.query.lnameEn){
            filter = filter+'(lnameEn'+'='+req.query.lnameEn+')';
        }
        if(filter == ''){
            ret.responseCode = 500;
            ret.responseMessage = 'Fail';
            ret.responseDescription = error.message;
            res.json(ret);
        }
        var uri = cfg.service.PANDORA.URI+'/phxPartner/v1/contactHRInfo.json?filter=(&'+filter+')'
            logger.info('Search Contact success ');
            // var uri = cfg.service.PANDORA.URI + '/phxPartner/v1/createLocation.json';      
            // var data  = {data: result};
            logger.info('get to uri :: ' + uri);
            // logger.info('get body :: ' + data);
            return clientHttp.get(uri,{
                service: 'phxpartners-be',
                callService: 'SEARCH_LOC_CONTACT',
                reqId: req.id
            }).then(function(response) {
                logger.info('response :: ' + JSON.stringify(response));
                if(response.resultCode == '20000'){
                    if(response.resultData[0] && response.resultData[0]["contactHRInfo"]){
                        ret.resultData = response.resultData[0]["contactHRInfo"];
                    }
                    return res.json(ret);
                }
                else{
                    ret.responseCode = parseInt(parseInt(response.resultCode)/100);
                    ret.responseMessage = 'Fail';
                    ret.responseDescription = response.resultDescription;
                    return res.json(ret);
                }
            });            

    } catch (error) {
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        res.json(ret);
    }
};
