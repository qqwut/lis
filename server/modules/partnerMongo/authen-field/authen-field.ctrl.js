const mongoose = require("mongoose");
var env = process.env.NODE_ENV || 'development';
var cfg = require('../../../config/config.js');
var utils = require('../../../utils/common.js');
var logger = require('../../../utils/logger');
var authorizeFieldMod = require('../../../model/authorizeField');
var authFieldMod = require('../../../model/authField.js');
var userGroupMod = require('../../../model/userGroup.js');
const { stringify } = require("querystring");

exports.getAuthorizeField = function (req, res) {
    logger.info('get authorize field data');

    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };

    var condition = [];
    var authenField = req.query;

    if (authenField && authenField != undefined) {
        var group = req.query.group;
        var role = req.query.role;
        var username = req.query.username;
        var parentComponentCode = req.query.parentComponentCode;
        var componentCode = req.query.componentCode;

        if (group && group.length > 0){
            condition.push({
                group: {
                    $eq: group
                }
            });
        }else {
            ret.responseCode = 400;
            ret.responseMessage = 'Bad Request';
            res.json(ret);
            return;
        }

        if (role && role.length > 0)
            condition.push({
                role: {
                    $eq: role
                }
            });

        if (username && username.length > 0)
            condition.push({
                username: {
                    $eq: username
                }
            });

        if (parentComponentCode && parentComponentCode.length > 0)
            condition.push({
                parentComponentCode: {
                    $eq: parentComponentCode
                }
            });

        if (componentCode && componentCode.length > 0)
            condition.push({
                componentCode: {
                    $eq: componentCode
                }
            });

        authorizeFieldMod.aggregate([{
                $match: {
                    $and: condition
                }
            },
            {
                "$project": {
                    "group": "$group",
                    "role": "$role",
                    "username": "$username",
                    "parentComponentCode": "$parentComponentCode",
                    "parentComponentType": "$parentComponentType",
                    "parentComponentName": "$parentComponentName",
                    "componentCode": "$componentCode",
                    "componentType": "$componentType",
                    "componentName": "$componentName",
                    "componentValue": "$componentValue",
                    "description": "$description",
                    "visible": "$visible",
                    "enable": "$enable",
                    "require": "$require",
                    "default": "$default",
                    "accountGroup": "$accountGroup",
                    "chnSalesCode_key1" : "$chnSalesCode_key1"
                }
            }
        ], function (err, result) {
            if (err) {
                res.status(500).json({
                    responseCode: 500,
                    responseMessage: 'Fail',
                    error: err
                });
                return;
            }

            ret.data = result;
            res.json(ret);
        });
    }else {
        ret.responseCode = 400;
        ret.responseMessage = 'Bad Request';
        res.json(ret);
        return;
    }
};

exports.getAuthenFieldBychnKey = function (req, res) {
    logger.info('get authen field data');

    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };

    var condition = [];
    var chnSaleCode = req.params.chnSaleCode;
    var pageKey = req.params.pageKey;

    var condition = [];
    if (chnSaleCode && chnSaleCode.length > 0) {
        condition.push({
            chnSalesCode_key1: {
                $eq: chnSaleCode
            }
        });
    } else {
        ret.responseCode = 400;
        ret.responseMessage = 'Bad Request';
        res.json(ret);
        return;
    }

    if (pageKey && pageKey.length > 0)
        condition.push({
            page_key2: {
                $eq: pageKey
            }
        });

    authFieldMod.aggregate([{
            $match: {
                $and: condition
            }
        },
        {
            "$project": {
                //"chnSaleCode": "$chnSalesCode_key1",
                //"page": "$page_key2",
                "action": "$action_data",
                "lovType": "$lovType_data",
                "fieldType": "$fieldType_data",
                "fieldName": "$fieldName_data",
                "attribute": "$attribute_data",
                "value": "$value_data",
                "labelName": "$labelName_data",
                "default": "$default",
                "visibled" : "$visibled",
                "enabled": "$enabled",
                "required": "$required"
            }
        }
    ], function (err, result) {
        if (err) {
            res.status(500).json({
                responseCode: 500,
                responseMessage: 'Fail',
                error: err
            });
            return;
        }

        ret.data = result;
        res.json(ret);
    });
};


exports.findAuthenfield = function (req, res) {
    logger.info('AUTHEN_FIELD :' +  JSON.stringify(req.query));
    filter =  req.query
    var condition = [];
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };

     /* ============================== [FILTER CONDITION : "AND" ] ================================**/
     // OR CONDITION
     if (filter.chnSalesCode_key1 != undefined && filter.chnSalesCode_key1 != null > 0){
        var chnSalesCode = filter.chnSalesCode_key1.split(",");
        if (undefined != filter.andChnSalesCodeFlg && filter.andChnSalesCodeFlg == 'Y') {
            condition.push({
                chnSalesCode_key1 : {"$in" : chnSalesCode }
            });
        }else {
            condition.push({
                $or:[
                    {   chnSalesCode_key1 : {"$in" : chnSalesCode }},
                    {   chnSalesCode_key1 : {$exists: false}}
                ]
            });
        }
    }

    if (filter.shopTypeGroup != undefined && filter.shopTypeGroup != null > 0){
        var shopTypeGroup = filter.shopTypeGroup.split(",");
        if("withOut" == shopTypeGroup[0]){
            condition.push({  
                shopTypeGroup : {"$exists" : false }
            });
        } else {
            condition.push({  
                shopTypeGroup : {"$in" : shopTypeGroup }
            });
        }
    }

    if (filter.shopType_data != undefined && filter.shopType_data != null > 0){
        var shopType_data = filter.shopType_data.split(",");
        if("withOut" == shopType_data[0]){
            condition.push({  
                shopType_data : {"$exists" : false }
            });
        } else {
            condition.push({  
                shopType_data : {"$in" : shopType_data }
            });
        }
    }

    if (filter.chnSalesCode_key2_nin != undefined && filter.chnSalesCode_key2_nin != null > 0){
        var chnSalesCode_key1 = filter.chnSalesCode_key2_nin.split(",");
        condition.push({
            chnSalesCode_key1 : {"$nin" : chnSalesCode_key1 }
        });
    }

     if (filter.userGroup != undefined && filter.userGroup != null > 0){
        var userGroup = filter.userGroup.split(",");
        condition.push({
                  userGroup : {"$in" : userGroup }
        });
    }
   
    if (filter.fieldType_data != undefined && filter.fieldType_data != null > 0){
        var fieldType = filter.fieldType_data.split(",");
        condition.push({
                    fieldType_data : {"$in" : fieldType }
        });
    }
    if (filter.chnSalesType != undefined && filter.chnSalesType != null > 0){
        var chnSaleType = filter.chnSalesType.split(",");
        condition.push({ 
                    chnSalesType : {"$in" : chnSaleType }
        });
    }
    if (filter.fieldName_data != undefined && filter.fieldName_data != null > 0){
        var fieldName = filter.fieldName_data.split(",");
        condition.push({ 
                     fieldName_data : {"$in" : fieldName }
        });
    }
    if (filter.labelName_data != undefined && filter.labelName_data != null > 0){
        var labelName = filter.labelName_data.split(",");
        condition.push({ 
                    labelName_data : {"$in" : labelName }
        });
    }
    if (filter.value_data != undefined && filter.value_data != null > 0){
        var value = filter.value_data.split(",");
        condition.push({
                      value_data : {"$in" : value }
        });
    }
    if (filter.page_key2 != undefined && filter.page_key2 != null > 0){
        var page = filter.page_key2.split(",");
        condition.push({  
                    page_key2 : {"$in" : page }
        });
    }
    if (filter.shopType != undefined && filter.shopType != null > 0){
        var data_shopType = filter.shopType.split(",");
        if("withOut" == data_shopType[0]){
            condition.push({  
                shopType : {"$exists" : false }
            });
        } else {
            condition.push({  
                shopType : {"$in" : data_shopType }
            });
        }
    }
    if (filter.shopFlg != undefined && filter.shopFlg != null > 0){
        var data_shopFlg = filter.shopFlg.split(",");
        condition.push({  
            shopFlg : {"$in" : data_shopFlg }
        });
    }
    if (filter.type != undefined && filter.type != null > 0){
        var data_type = filter.type.split(",");
        condition.push({  
            type : {"$in" : data_type }
        });
    }
    if (filter.type != undefined && filter.type != null > 0){
        var data_attribute_data = filter.type.split(",");
        condition.push({  
            type : {"$in" : data_attribute_data }
        });
    }
    if (filter.lovType_data != undefined && filter.lovType_data != null > 0){
        var data_lovType_data = filter.lovType_data.split(",");
        condition.push({  
            lovType_data : {"$in" : data_lovType_data }
        });
    }
    if (filter.memberCate != undefined && filter.memberCate != null > 0){
        var data_lovType_data = filter.memberCate.split(",");
        condition.push({  
            memberCate : {"$in" : data_lovType_data }
        });
    }

    if (filter.memberCategory != undefined && filter.memberCategory != null > 0 && filter.isNin == 'N'){
        var data_memberCategory = filter.memberCategory.split(",");
        condition.push({  
            memberCategory : {"$in" : data_memberCategory }
        });
    }
    if (filter.memberCategory != undefined && filter.memberCategory != null > 0 && filter.isNin == 'Y'){
        var data_memberCategory = filter.memberCategory.split(",");
        condition.push({  
            memberCategory : {"$nin" : data_memberCategory }
        });
    }

    if (filter.memberCategory != undefined && filter.memberCategory != null > 0 && filter.isNin == undefined){
        var data = filter.memberCategory.split(",");
        condition.push({  
            memberCategory : {"$in" : data }
        });
    }

    if (filter.accountGroup != undefined && filter.accountGroup != null > 0){
        var accountGroup = filter.accountGroup.split(",");
        condition.push({  
            accountGroup : {"$in" : accountGroup }
        });
    }
    if (filter.oldStatus != undefined && filter.oldStatus != null > 0){
        var oldStatus = filter.oldStatus.split(",");
        condition.push({  
            oldStatus : {"$in" : oldStatus }
        });
    }
    if (filter.newStatus != undefined && filter.newStatus != null > 0){
        var newStatus = filter.newStatus.split(",");
        condition.push({  
            newStatus : {"$in" : newStatus }
        });
    }
    if (filter.activeFlg != undefined && filter.activeFlg != null > 0){
        var activeFlg = filter.activeFlg;
        condition.push({  
            activeFlg : { "$eq" : activeFlg }
        });
    }
    if (filter.attribute_data != undefined && filter.attribute_data != null > 0){
        var attribute_data = filter.attribute_data;
        condition.push({  
            attribute_data : {"$eq" : attribute_data }
        });
    }
    if (filter.action_data != undefined && filter.action_data != null > 0){
        var action_data = filter.action_data;
        condition.push({  
            action_data : {"$eq" : action_data }
        });
    }
    if (filter.method_data != undefined && filter.method_data != null > 0){
        var method_data = filter.method_data;
        condition.push({  
            method_data : {"$eq" : method_data }
        });
    }
    if (filter.payType != undefined && filter.payType != null > 0){
        var payType = filter.payType;
        condition.push({  
            payType : {"$eq" : payType }
        });
    }
    if (filter.remark_code != undefined && filter.remark_code != null > 0){
        var remark_code = filter.remark_code;
        condition.push({
            remark_code : {"$eq" : remark_code }
        });
    }
    if (filter.hqFlg != undefined && filter.hqFlg != null > 0){
        var hqFlg = filter.hqFlg;
        condition.push({
            hqFlg : {"$eq" : hqFlg }
        });
    }

    try {
        authFieldMod.find( {
            $and: condition
        }, function (err, result) {
            if (err) {
                logger.error('AUTHEN_FIELD :' +  err.message);
                logger.errorStack(err);
                ret.responseCode = 500;
                ret.responseMessage = 'Fail';
                ret.responseDescription = err.message;
                res.json(ret);
                throw err;
            }else{
                if(result.length > 0){
                    logger.info('AUTHEN_FIELD :' +  result.length);
                    ret.data = result;
                    res.json(ret);
                }else{
                    ret.responseCode = 404;
                    ret.responseMessage = 'Data Not Found.';
                    ret.data = result;
                    res.json(ret);
                }
            }
            
        });
      
    } catch (error) {
        logger.error('AUTHEN_FIELD :' +  err.message);
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        res.json(ret);
    }

    
   
};

exports.mainMenuAuthen = function (req, res) {
    logger.info('AUTHEN_FIELD MAIN MENU:' +  JSON.stringify(req.query));
    filter =  req.query
    var condition = [];
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };
    if (filter.userGroup != undefined && filter.userGroup != null > 0){
        var userGroup = filter.userGroup.split(",");
    }

    try {
        authFieldMod.aggregate(
                [
                    {'$unwind': '$menus'} , 
                    {'$match': 
                            {
                                "fieldType_data":filter.fieldType_data,
                                "menus.userGroup": {"$in": userGroup }
                            }
                    },
                    
                    {'$group': 
                        {
                            '_id': '$_id',
                            'labelName_data' : { '$first': '$labelName_data' }, 
                            'url' : { '$first': '$url' },  
                            'priority' : { '$first': '$priority' },
                            'userGroup' : { '$first': '$userGroup' },
                            "image":{"$first":"$image"},
                            'menus':  {'$push': '$menus'}
                        }
                    }
                    
                    ,{
                        "$project": {
                            "id" : "$_id",
                            "labelName_data": "$labelName_data",
                            "url": "$url",
                            "priority": "$priority",
                            "userGroup": "$userGroup",
                            "image" :  "$image",
                            "menus": {
                                "$filter" : {
                                    "input": "$menus",
                                    "as" : "menus",
                                    "cond" : {
                                        "$ne" : [ "TEMP", "$$menus.fieldName_data" ]
                                                
                                    }
                                }
                            }
                        }
                    }
                     
                    ,{ "$sort" : { "priority" : 1 ,"menus.priority" :1}}
                    
                    
                ]
        , function (err, result) {
            if (err) {
                logger.error('AUTHEN_FIELD :' +  err.message);
                logger.errorStack(err);
                ret.responseCode = 500;
                ret.responseMessage = 'Fail';
                ret.responseDescription = err.message;
                res.json(ret);
                throw err;
            }else{
                logger.info('AUTHEN_FIELD :' +  result.length);
                ret.data = result;
                res.json(ret);
            }
            
        });
      
    } catch (error) {
        logger.error('AUTHEN_FIELD :' +  err.message);
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        res.json(ret);
    }
}

// exports.subMenuAuthen = function (req, res) {
//     logger.info('AUTHEN_FIELD :' +  JSON.stringify(req.query));
//     filter =  req.query
//     var condition = [];
//     var ret = {
//         responseCode: 200,
//         responseMessage: 'Success'
//     };
//     /* ============================== [FILTER CONDITION : "AND" ] ================================**/
//     // OR CONDITION
//     if(filter.chnSalesCode_key1 != undefined && filter.chnSalesCode_key1 != null > 0) {
//         var chnSalesCode = filter.chnSalesCode_key1.split(",");
//         condition.push({
//             $or:[
//                 {   chnSalesCode_key1 : {"$in" : chnSalesCode }},
//                 {   chnSalesCode_key1 : {$exists: false}}
//             ]
//         });
//     }
   
//     if(filter.fieldType_data != undefined && filter.fieldType_data != null > 0) {
//         var fieldType = filter.fieldType_data.split(",");
//         condition.push({
//             fieldType_data : {"$in" : fieldType }
//         });
//     }

//     if(filter.chnSalesType != undefined && filter.chnSalesType != null > 0) {
//         var chnSaleType = filter.chnSalesType.split(",");
//         condition.push({
//             chnSalesType : {"$in" : chnSaleType }
//         });
//     }

//     if(filter.userGroup != undefined && filter.userGroup != null > 0) {
//         var userGroup = filter.userGroup.split(",");
//         condition.push({
//             userGroup : {"$in" : userGroup }
//         });
//     }

//     try {
//         authFieldMod.find( {
//             $and: condition
//         }, function (err, result) {
//             if (err) {
//                 logger.error('AUTHEN_FIELD :' +  err.message);
//                 logger.errorStack(err);
//                 ret.responseCode = 500;
//                 ret.responseMessage = 'Fail';
//                 ret.responseDescription = err.message;
//                 res.json(ret);
//                 throw err;
//             }else{
//                 logger.info('AUTHEN_FIELD :' +  result.length);
//                 ret.data = result;
//                 res.json(ret);
//             }
            
//         }).sort({"orderBy":1});
      
//     } catch (error) {
//         logger.error('AUTHEN_FIELD :' +  err.message);
//         ret.responseCode = 500;
//         ret.responseMessage = 'Fail';
//         ret.responseDescription = error.message;
//         res.json(ret);
//     }
// };



exports.checkauthenSubMenu = function (req, res) {
    logger.info("AUTHEN_FIELD :" +  JSON.stringify(req.query));
    filter = req.query;

    var fieldType = '';
    var chnSaleType = '';
    var chnSalesCode = '';

    var splitUserGroup = [];
    var userGroupCondition = [];
    var chnSalesCodeCondition = [];
    var firstCondition = {};

    var ret = {
        responseCode: 200,
        responseMessage: "Success"
    };
    /* ============================== [START FILTER CONDITION] ================================**/
    if(filter.fieldType_data != undefined && filter.fieldType_data != null > 0) {
        var fieldType = filter.fieldType_data;
    }

    if(filter.chnSalesType != undefined && filter.chnSalesType != null > 0) {
        var chnSaleType = filter.chnSalesType;
    }

    if(filter.userGroup != undefined && filter.userGroup != null > 0){
        var splitUserGroup = filter.userGroup.split(",");
        if(splitUserGroup.length > 0) {
            splitUserGroup.forEach( itemUserGroup => {
                userGroupCondition.push({ "subMenu.userGroup": itemUserGroup });
            });
            userGroupCondition.push({ "subMenu.userGroup": { $exists: false } });
        }
    }

    var chnSalesCode = filter.chnSalesCode_key1 ? filter.chnSalesCode_key1 : null;
    chnSalesCodeCondition.push({ "chnSalesCode_key1": { "$eq": chnSalesCode } });
    chnSalesCodeCondition.push({ "chnSalesCode_key1": { $exists: false } });

    if (filter.fieldName != undefined && filter.fieldName != null > 0) {
        var fieldName = filter.fieldName;
        firstCondition = {
            "fieldType_data": fieldType,
            "chnSalesType": chnSaleType,
            "userGroup": { "$in": splitUserGroup },
            "fieldName_data" : fieldName,
            "$or": chnSalesCodeCondition,
        }
    } else {
        firstCondition = {
            "fieldType_data": fieldType,
            "chnSalesType": chnSaleType,
            "userGroup": { "$in": splitUserGroup },
            "$or": chnSalesCodeCondition,
            }
        }
    
    /* ============================== [END FILTER CONDITION] ================================**/

    try {

        authFieldMod.aggregate(
            [
                {
                    "$match": firstCondition
                },
                
                {
                    "$unwind": {
                        "path": "$subMenu",
                        "preserveNullAndEmptyArrays": true
                    }
                },

                {
                    "$match": {
                        "$or": userGroupCondition
                    }
                },

                {
                    "$match": {
                        "$or": [
                            { "subMenu.chnSalesCode_key1": chnSalesCode },
                            { "subMenu.chnSalesCode_key1": { "$exists": false } }
                        ]
                    }
                },
                
                {
                    "$group": {
                        "_id": "$_id",
                        "labelName_data" : { "$first": "$labelName_data" },
                        "fieldType_data" : { "$first": "$fieldType_data" },
                        "fieldName_data" : { "$first": "$fieldName_data" },
                        "value_data" : { "$first": "$value_data" },
                        "chnSalesType" : { "$first": "$chnSalesType" },
                        "orderBy" : { "$first": "$orderBy" },
                        "userGroup" : { "$first": "$userGroup" },
                        "chnSalesCode_key1" : { "$first": "$chnSalesCode_key1" },
                        "subMenu" : { "$push": "$subMenu" }
                    }
                },
                
                {
                    "$sort" : {
                        "orderBy" : 1
                    }
                }
            ]

        , function (err, result) {
            if (err) {
                logger.error( +  err.message);
                logger.errorStack(err);
                ret.responseCode = 500;
                ret.responseMessage = 'Fail';
                ret.responseDescription = err.message;
                res.json(ret);
                throw err;
            } else {
                logger.info("AUTHEN_FIELD :" +  result.length);
                ret.data = result;
                res.json(ret);
            }
            
        });

    } catch (error) {
        logger.error("AUTHEN_FIELD :" +  err.message);
        ret.responseCode = 500;
        ret.responseMessage = "Fail";
        ret.responseDescription = error.message;
        res.json(ret);
    }
};

checkauthenUserGroup = function (req) {
    return new Promise((resolve, reject) => {
        filter =  req;
        var condition = [];
        var data = [];
        var ret = {
            responseCode: 200,
            responseMessage: 'Success'
        };
        console.dir("check filter User Group")
        console.dir(filter)
        if (filter.chnSalesCode_key1 != undefined && filter.chnSalesCode_key1 != null > 0){
            condition.push({
                chnSalesCode_key2 : {"$eq" : filter.chnSalesCode_key1}
            });
        }
        if (filter.userGroup != undefined && filter.userGroup != null > 0){
            var userGroup = filter.userGroup.split(",");
            condition.push({
                groupName_data :  {"$in" : userGroup } 
            });
        
        }
        let pipeline = [{
            $match: {
                $and:[
                    {"groupName_data" :{  $in:userGroup}}, 
                    {"chnSalesCode_key2" : filter.chnSalesCode_key1}
                ]
                
            }
        },{
            $project: {
                "saleSubRegionCode_data" : "$saleSubRegionCode_data",
                "retailShop_data" : "$retailShop_data",
            },
        }]
        userGroupMod.aggregate(pipeline, function(err, result)  {
            if (err) {
                logger.info('Error To Check Authen User:' + result);
            }else {
                if(result.length > 0){
                    if(result[0].saleSubRegionCode_data || result[0].retailShop_data){
                        data = result;
                        resolve(data)
                    }else{
                        data = []
                        resolve(data)
                    }
                    // return
                } else{
                    logger.info('No "saleSubRegionCode_data:');
                    resolve(data)
                    // return
                }   
            }
        })
    })
}

exports.getAuthorizeEditbtn = function (req, res) {
    filter =  req.query
    var condition = [];
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };
     /* ============================== [FILTER CONDITION : "AND" ] ================================**/
     // OR CONDITION
     if (filter.chnSalesCode_key1 != undefined && filter.chnSalesCode_key1 != null > 0){
        var chnSalesCode = filter.chnSalesCode_key1.split(",");
        if (undefined != filter.andChnSalesCodeFlg && filter.andChnSalesCodeFlg == 'Y') {
            condition.push({
                chnSalesCode_key1 : {"$in" : chnSalesCode }
            });
        }else {
            condition.push({
                $or:[
                    {   chnSalesCode_key1 : {"$in" : chnSalesCode }},
                    {   chnSalesCode_key1 : {$exists: false}}
                ]
            });
        }
    }
    if (filter.userGroup != undefined && filter.userGroup != null > 0){
        var userGroup = filter.userGroup.split(",");
        condition.push({
                  userGroup : {"$in" : userGroup }
        });
    }
    if (filter.chnSalesType != undefined && filter.chnSalesType != null > 0){
        var chnSaleType = filter.chnSalesType.split(",");
        condition.push({ 
                    chnSalesType : {"$in" : chnSaleType }
        });
    }
    if (filter.fieldName_data != undefined && filter.fieldName_data != null > 0){
        var fieldName = filter.fieldName_data.split(",");
        condition.push({ 
                        fieldName_data : {"$in" : fieldName }
        });
    }
    if (filter.page_key2 != undefined && filter.page_key2 != null > 0){
        var page = filter.page_key2.split(",");
        condition.push({  
                    page_key2 : {"$in" : page }
        });
    }
    if (filter.accountGroup != undefined && filter.accountGroup != null > 0){
        var accountGroup = filter.accountGroup.split(",");
        condition.push({  
            accountGroup : {"$in" : accountGroup }
        });
        //console.dir("setaccountGroup" + accountGroup)
    }
    var pipeline = []
    var saleSubRegion = []
    var saleSubRegionGroup = []
    var retailShopGroup = []
    var fieldName_data = filter.fieldName_data;
    var subRegion = filter.subRegion;
    var chnSalesCode = filter.chnSalesCode_key1;

    checkauthenUserGroup(filter).then(function(response) {
            saleSubRegion = response;
            if(saleSubRegion.length > 0){
                saleSubRegion.forEach(element => {
                    if(element.saleSubRegionCode_data){
                        saleSubRegionGroup.push(element.saleSubRegionCode_data);
                        // subRegion = element.saleSubRegionCode_data
                    }
                    if(element.retailShop_data){
                        //console.dir(element.retailShop_data)
                        retailShopGroup.push(element.retailShop_data) 
                    }
                });
                if(saleSubRegionGroup.length>0){
                    filter.saleSubRegionGroup = saleSubRegionGroup
                    pipeline = [{
                    $match: {
                        $and: [{
                            permission:{								
                                $elemMatch:{							
                                $and:[							
                                    {"chnSalesCode_key1" :chnSalesCode}, /*chnSalesCode from V_PN_LOCATION_CONTACT in Oracle */						
                                    {"userGroup":{  $in:  userGroup}}, /*permission of user in authorize user cookie*/						
                                    {"subRegion": subRegion},
                                    {"subRegion": {$in: saleSubRegionGroup}},
                                    // {"subRegion": filter.subRegion}
                                    ]						
                                }							
                            },
                        },{
                            "fieldName_data" : {"$eq" : fieldName_data},
                        }]
                    }
                    }, {
                        $project: {
                            "labelName_data" : "$labelName_data",
                            "page_key2" : "$page_key2",
                            "fieldName_data" : "$fieldName_data",
                            "visibled": "$visibled",
                            "permission": "$permission",
                            
                        },
                    }];
                }
                if(retailShopGroup.length>0){
                    filter.retailShopGroup = retailShopGroup
                    pipeline = [{
                        $match: {
                            $and: [{
                                permission:{								
                                    $elemMatch:{							
                                    $and:[							
                                        {"chnSalesCode_key1" :chnSalesCode}, /*chnSalesCode from V_PN_LOCATION_CONTACT in Oracle */						
                                        {"userGroup":{  $in:  userGroup}}, /*permission of user in authorize user cookie*/						
                                        {"retail": {$in: filter.retailShopGroup}},
                                        {"retail":filter.retailShop}
                                        ]						
                                    }							
                                },
                            },{
                                "fieldName_data" : {"$eq" : fieldName_data},
                            }]
                        }
                    }, {
                        $project: {
                            "labelName_data" : "$labelName_data",
                            "page_key2" : "$page_key2",
                            "fieldName_data" : "$fieldName_data",
                            "visibled": "$visibled",
                            "permission": "$permission",
                            
                        },
                    }];
                }
            }else{
             pipeline = [{
                $match: {
                    $and: [{
                        permission:{								
                            $elemMatch:{							
                            $and:[							
                                {"chnSalesCode_key1" :chnSalesCode}, /*chnSalesCode from V_PN_LOCATION_CONTACT in Oracle */						
                                {"userGroup":{  $in: userGroup}} /*permission of user in authorize user cookie*/						
                                
                                ]						
                            }							
                        },
                    },{
                        "fieldName_data" : {"$eq" : fieldName_data},
                    }]
                }
                }, {
                $project: {
                    "labelName_data" : "$labelName_data",
                    "page_key2" : "$page_key2",
                    "fieldName_data" : "$fieldName_data",
                    "visibled": "$visibled",
                    "permission": "$permission",
                    
                },
                
            }];
            }

            logger.info('pipeline : ' + JSON.stringify(pipeline)) 

            authFieldMod.aggregate(pipeline, function(err, result)  {
                if (err) {
                    res.status(500).json({
                        responseCode: 500,
                        responseMessage: 'Fail',
                        error: err
                    });
                }else {
                    logger.info('AUTHEN_FIELD_RESULT:' + result);
                    ret.data = result;
                    res.json(ret);
                }
            })
        }
    )
};

exports.getAuthorizeAccNoBankFullPrivacy = function (req, res) {

    filter =  req.query
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };

    if(filter.userGroup != undefined && filter.userGroup != null > 0){
        var userGroup = filter.userGroup.split(",");
    }

    pipeline = [{
        $match: {
            $and: [{
                fullPrivacy:{								
                    $elemMatch:{							
                    $and:[							
                            {"chnSalesCode_key1" : filter.chnSalesCode_key1},					
                            {"userGroup":{  $in: userGroup }}
                        ]						
                    }							
                },
                "page_key2": filter.page_key2,
                "fieldName_data": filter.fieldName_data
            }]
        }
    }];

    try{
        authFieldMod.aggregate(pipeline, function(err, result)  {
            if (err) {
                res.status(500).json({
                    responseCode: 500,
                    responseMessage: 'Fail',
                    error: err
                });
            }else {
                logger.info('AUTHEN_FIELD_RESULT:' + result);
                if(result != undefined && result != null && result != ""){
                    ret.data = result;
                } else {
                    ret.responseCode = 404;
                    ret.responseMessage = "Data not found";
                    ret.data = [];
                }
                res.json(ret);
            }
        });
    } catch (err) {
        ret.responseCode = 500;
        ret.responseMessage = "System error";
        ret.data = [];
    }
}

