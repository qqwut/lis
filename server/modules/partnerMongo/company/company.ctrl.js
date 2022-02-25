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
var dataLocationDummy = [];
var testDummyData = cfg.mockup_data ? parseInt(cfg.mockup_data) : 0;


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
                company.sapCompany = result[i].sapCompany_data;
                data.push(company);
            }
        }
        ret.data = data;
        res.json(ret);
    });
};