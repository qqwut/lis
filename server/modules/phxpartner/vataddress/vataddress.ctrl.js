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


exports.getVatAddress = function (req, res) {
    var id = req.params.id;
    logger.info('Search VAT Address');
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };
    try {
        var filter = '';

        // if(req.query.companyAbbr && req.query.vatBranchNo){
        //     filter = filter+'(companyAbbr'+'='+req.query.companyAbbr+')'+'(vatBranchNo'+'='+req.query.vatBranchNo+')';
        // }    
        if(req.params.companyAbbrev && req.params.vatBranchNo){
            filter = filter+'(companyAbbr'+'='+req.params.companyAbbrev+')'+'(vatBranchNo'+'='+req.params.vatBranchNo+')';
        }    
        else{
            ret.responseCode = 500;
            ret.responseMessage = 'Parameter missing';
            // ret.responseDescription = error.message;
            return res.json(ret);
        }
        var uri = cfg.service.PANDORA.URI+'/phxPartner/v1/vatAddress/profile.json?filter=(&'+filter+')'
            logger.info('Search VAT Address success ');
            // var uri = cfg.service.PANDORA.URI + '/phxPartner/v1/createLocation.json';      
            // var data  = {data: result};
            logger.info('get to uri :: ' + uri);
            // logger.info('get body :: ' + data);
            return clientHttp.get(uri,{
                service: 'phxpartners-be',
                callService: 'SEARCH_VAT_ADDRESS',
                reqId: req.id
            }).then(function(response) {
                if(response.resultCode == '20000'){
                    logger.info('response :: ' + JSON.stringify(response));
                    if(response.resultData[0] && response.resultData[0]['vatAddress']){
                        ret.resultData = response.resultData[0]['vatAddress'];
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
        return res.json(ret);
    }
};
