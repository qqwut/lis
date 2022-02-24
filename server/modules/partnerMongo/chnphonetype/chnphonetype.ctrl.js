var fs = require('fs');
const path = require('path');
var moment = require('moment');
var _ = require('lodash');
var chnPhoneType = require('../../../model/chnPhoneType.js');
var logger = require('../../../utils/logger');
// var companyMod = require('../../../model/company.js');
// var userGroupMod = require('../../../model/userGroup.js');

exports.getChnPhoneTypeList = function (req, res) {
    logger.info('get Channel Phone Type list');
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };

    var filter = {};//{'lovType_data': 'SHOP_AREA'};
    // var userGroup = req.query.usergroup;
    // var status = req.query.status;
    // filter.status = {
    //     $ne: "DELETED"
    // };
    // if (status) {
    //     filter.status.$eq = status.toUpperCase();
    // }

    chnPhoneType
    .find(filter, null, {
        // sort: {
        //     createdDate: -1
        // }
    }).select(['-_id','code','name','channelType','defaultData']).exec(  function (err, result) {
        if (err) {
            console.error(err);
            ret.responseCode = 500;
            ret.responseMessage = 'Fail';
            ret.responseDescription = err.message;
            res.json(ret);
            throw err;
        }
        logger.info('get Channel Phone Type list size :: ' + result.length);
        ret.data = result;
        // ret.data = result.map(function(res){
        //     return res.toAliasedFieldsObject();
        // });
        res.json(ret);
    });
};
