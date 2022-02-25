var env = process.env.NODE_ENV || 'development';
var cfg = require('../../../config/config.js');
var utils = require('../../../utils/common.js');
var logger = require('../../../utils/logger');
var authorizeFieldMod = require('../../../model/authorizeField');

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
                    "default": "$default"
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