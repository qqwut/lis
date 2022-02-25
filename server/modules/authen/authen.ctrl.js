var fs = require('fs');
const path = require('path');
var moment = require('moment');
var _ = require('lodash');

var models = require('../../model');
var jwt = require('jsonwebtoken');
var env = process.env.NODE_ENV || 'development';
var passport = require('passport');
var rp = require('request-promise');
var utils = require('../../utils/common.js');
var logger = require('../../utils/logger');
var cfg = require('../../config/config.js');
var userMod = require('../../model/user.js');
var sessionMod = require('../../model/session.js');

var jwtDecode = require('jwt-decode');

const URL_MYCHANNEL_AUTH = cfg.URL_MYCHANNEL_AUTH || 'http://25.20.247.44:18443/api/auth';
const URL_SALESPORTAL_MENUS = cfg.URL_SALESPORTAL_MENUS || 'http://25.20.247.44:18888/api/menus';

function encodeBase64(str) {
    var b = new Buffer(str);
    return b.toString('base64');
}

function decodeBase64(str) {
    var b = new Buffer(str, 'base64');
    return b.toString();
}

// exports.authenticate = function (req, res, next) {
//     logger.log('Api authenticate call : ' + req.body.username);
//     logger.log(JSON.stringify(req.body));

//     var data = req.body;
//     try {
//         passport.authenticate('local', function (err, user, info) {
//             var token;
//             if (info && info.errorCode == 550) {
//                 logger.info("authenticate error" + nfo.errorCode + ':' + info.message);
//                 res.status(550).json(info.message);
//                 return;
//             }

//             logger.info('start authen local Strategies.');
//             // If Passport throws/catches an error
//             if (err) {
//                 logger.error('authen local Strategies error', err);
//                 res.status(500).json(err);
//                 return;
//             }
//             if (!user) {
//                 logger.debug('authen fail: user not found.');
//                 return res.status(404).json("authen fail");
//             }

//             var roles = {};
//             var expireTime = parseInt(memCache.get('expires-ms-def'));
//             var expireDT = moment().add(expireTime / 30, 'minute');

//             var profile = {
//                 userId: data.username,
//                 firstName: 'guest',
//                 lastName: 'demo',
//                 userGroup: data.usergroup.split(','),
//                 exp: parseInt(expireDT.toDate().getTime() / 1000)
//             };

//             var SECRET = "ccsm";
//             var token = jwt.sign(profile, SECRET); // 60*5 minutes
//             console.log('save token data login session :: ' + req.sessionID);
//             memCache.put(user.id, {
//                 sessionID: req.sessionID,
//                 "token": token
//             }, expireTime);

//             res.status(200);

//             return res.json({
//                 "token": token,
//                 "data": {
//                     "accessToken": token,
//                     "refreshToken": token,
//                     "redirectURL": "/"
//                 }

//             });

//             //             models.sequelize.query("select grp.id_ , grp.name_ from act_id_user u inner join act_id_membership mem on u.id_ = mem.user_id_ " +
//             //                 "inner join act_id_group grp on mem.group_id_ = grp.id_ " +
//             //                 "where grp.type_ = 'security-role' and u.id_ = '" + user.id + "' ", { type: Sequelize.QueryTypes.SELECT, raw: true }).then(function(result) {

//             //                 var roles = {};
//             //                 result = Array.isArray(result) ? result : [result];
//             //                 for (var i = 0; i < result.length; i++) {
//             //                     var grp = result[i];
//             //                     if (grp) {
//             //                         roles[grp.id_] = { id: grp.id_, name: grp.name_ };
//             //                     }

//             //                 }
//             //                 var expireTime = parseInt(memCache.get('expires-ms-def'));
//             //                 var expireDT = moment().add(expireTime / 30, 'minute');

//             //                 var profile = {
//             //                     id: user.id,
//             //                     name: user.firstName + " " + user.lastName,
//             //                     firstName: user.firstName,
//             //                     lastName: user.lastName,
//             //                     email: user.email,
//             //                     roles: roles,
//             //                     nodeEnv: env,
//             //                     sessionID: req.sessionID,
//             //                     exp: parseInt(expireDT.toDate().getTime() / 1000)
//             //                 };
//             // //                 models.sequelize.query(`SELECT
//             // // smaf_user_group_menu.menu_id,
//             // // bit_or(smaf_user_role.permission) AS permission,
//             // // array_remove(ARRAY(SELECT DISTINCT UNNEST(array_agg(sub_menu_id))),null) AS "subMenuId"
//             // // from smaf_user_membership
//             // // INNER JOIN smaf_user_group_menu ON smaf_user_membership."group" = smaf_user_group_menu.group_no
//             // // INNER JOIN smaf_user_role ON smaf_user_role.role_no::TEXT = smaf_user_membership."role"::TEXT
//             // // where user_id = '`+ user.id +`'
//             // // GROUP BY smaf_user_membership.user_id,smaf_user_group_menu.menu_id`, { type: Sequelize.QueryTypes.SELECT, raw: true }).then(function(userPermisson) {

//             // //                     // console.dir(profile);
//             // //                     var permission = {};
//             // //                     permission.AccessMenu = {};
//             // //                     if(userPermisson){
//             // //                         for(var j = 0;j< userPermisson.length;j++){
//             // //                             permission[userPermisson[j].menu_id] = userPermisson[j].permission;
//             // //                             permission.AccessMenu[userPermisson[j].menu_id] = userPermisson[j].subMenuId;
//             // //                         }
//             // //                     }
//             // //                     profile.permission = permission;

//             // //                     var SECRET = "smaf-bss-order";
//             // //                     var token = jwt.sign(profile, SECRET); // 60*5 minutes
//             // //                     // var token = jwt.sign(profile, SECRET, { expiresIn: '1m' }); // 60*5 minutes
//             // //                     console.log('save token data login session :: ' + req.sessionID);
//             // //                     memCache.put(user.id, { sessionID: req.sessionID, "token": token }, expireTime);

//             // //                     res.status(200);
//             // //                     return res.json({
//             // //                         "token": token
//             // //                     });
//             // //                 });
//             //             }).catch(function(error) {
//             //                 console.log('passport login err :' + error);
//             //                 return res.status(500).json(error);
//             //             });
//         })(req, res, next);

//     } catch (error) {
//         console.log('api login error :' + error);
//         res.status(500).json(error);
//     }
// };

function checkUserPasswd(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    logger.debug('Authen checkUserPasswd.');
    userMod.findOne({
        'username': username
    }, '_id username password', function (err, user) {
        logger.debug('find user by username[' + username + ']');
        if (err) {
            logger.error('find user has error', err);
            res.status(401).json({
                "resultCode": "ENTRO00140110",
                "resultDescription": "Fail to get user.",
                "developerMessage": "Fail to get user."
            });
            return;
        };
        if (!user) {
            logger.info('User not found');
            var data = req.body;
            var options = {};
            options.headers = {};
            //options = opt || JSON.parse(JSON.stringify(OPTIONS));
            options.headers["Content-Length"] = Buffer.byteLength(JSON.stringify(data));
            options.headers["channeltype"] = req.headers["channeltype"] || 'myoffice-web';
            options.headers["clientid"] = req.headers["clientid"] || '';
            options.method = 'POST';
            options.body = data;
            options.json = true;

            var url = URL_MYCHANNEL_AUTH + '/oauth2';
            logger.info('Check On AIS ENV :: ' + url);
            try {
                rp(url, options).then(function (result) {
                    logger.info('resultCode :: ' + result.resultCode);
                    // if (parseInt(result.resultCode) != 20000) {
                    //     res.json(res)
                    //     return;
                    // }
                    res.json(result)
                }).catch(function (err) {
                    logger.errorStack(err);
                    res.status(500).json({
                        "resultCode": "50000",
                        "resultDescription": err.message,
                        "developerMessage": err.message
                    });
                });
                // return;
            } catch (error) {
                logger.errorStack(error);
                res.status(500).json({
                    "resultCode": 50000,
                    "resultDescription": error.message,
                    "developerMessage": err.message
                });
            }
            return;
        }
        // logger.debug(user);
        if (user.password != password) {
            logger.info('Authenfind fail : Password invalid');
            res.status(401).json({
                "resultCode": "ENTRO00140110",
                "resultDescription": "Password invalid.",
                "developerMessage": "Password invalid."
            });
            return;
        }
        logger.info('Authenfind success');
        var ret = {
            "resultCode": "20000",
            "resultDescription": "Success",
            "developerMessage": "Success",
            "data": {
                "token": "EntroMockup/" + encodeBase64(JSON.stringify(user))
            }
        };
        res.json(ret);
    })
}

function genTokenEntroAuth(username, req, res, next) {
    var expireMinute = cfg.session && !isNaN(parseInt(cfg.session)) ? parseInt(cfg.session) : 30;
    var expireDT = moment().add(expireMinute, 'minute');
    userMod.findOne({'username': username}, function (err, user) {
        if (err) {
            var ret = {
                "resultCode": "50000",
                "resultDescription": "Fail",
                "developerMessage": "Fail",
                "error": err
            };
            res.status(500).json(ret);
            return;
        }
        var profile = {
            "username": user.username,
            "locationCode": user.locationCode,
            "email": user.email,
            "firstname": user.firstname,
            "lastname": user.lastname,
            "sharedUser": user.sharedUser,
            "userType": user.userType,
            "role": user.role,
            "channelType": user.channelType,
            "ascCode": user.ascCode,
            "mobileNo": user.mobileNo
        };
        profile.timestamp = moment().unix();
        profile.exp = parseInt(expireDT.toDate().getTime() / 1000);
        var SECRET = cfg.SECRET;
        var token = jwt.sign(profile, SECRET); // 60*5 minutes
        var ret = {
            "resultCode": "20000",
            "resultDescription": "Success",
            "developerMessage": "Success",
            "data": {
                "accessToken": token,
                "refreshToken": token
            }
        };
        res.json(ret);
    });

}

exports.oauth2 = function (req, res, next) {
    logger.info("access api post oauth2");
    try {
        checkUserPasswd(req, res, next);
    } catch (error) {
        logger.errorStack(error);
        res.status(500).json({
            resultCode: '50000',
            resultDescription: 'Fail',
            developerMessage: 'Fail',
            error: error
        });
    }
}

exports.login = function (req, res, next) {
    logger.info("access post login");
    var data = req.body;
    var options = {};
    options.headers = {};
    //options = opt || JSON.parse(JSON.stringify(OPTIONS));
    options.headers["Content-Length"] = Buffer.byteLength(JSON.stringify(data));
    options.headers["channeltype"] = req.headers["channeltype"] || 'myoffice-web';
    options.headers["clientid"] = req.headers["clientid"] || '';
    options.method = 'POST';
    options.body = data;
    options.json = true;

    var tokenId = data.tokenID;
    if (!tokenId) {
        res.json({
            "resultCode": "40000",
            "resultDescription": "Bad request",
            "developerMessage": "Bad request [ tokenID is missing]",
        });
        return;
    }
    if (tokenId.startsWith('EntroMockup/')) {
        var tokenID = req.body.tokenID;
        var userToken = JSON.parse(decodeBase64(tokenID.substr("EntroMockup/".length)));
        genTokenEntroAuth(userToken.username, req, res, next);
        return;
    }


    var url = URL_MYCHANNEL_AUTH + '/login';
    rp(url, options).then(function (result) {
        res.json(result)
    }).catch(function (err) {
        logger.error(err.statusCode + ':' + err.message);
        res.status(500).json(err);
    });

}

exports.getMenus = function (req, res, next) {
    // x-authorization
    var options = {};
    options.headers = {};
    // options.headers["channeltype"] = req.headers["channeltype"] || 'myoffice-web';
    // options.headers["clientid"] = req.headers["clientid"] || '';
    options.headers["x-authorization"] = req.headers["x-authorization"] || '';
    if (options.headers["x-authorization"] && options.headers["x-authorization"] != '') {
        var token = null;
        if (options.headers["x-authorization"] && options.headers["x-authorization"].split(' ')[0] === 'Bearer') {
            token = options.headers["x-authorization"].split(' ')[1];
            var decoded = jwtDecode(token);
            if (decoded.username && decoded.userType && decoded.userType == 'ENTRO') {
                var filePath = path.join(__dirname, '../../data/menus.json');
                var dataDummy = utils.readFileDataJson(filePath);
                res.json(dataDummy);
                return;
            }
        }
    }

    options.method = 'GET';

    // options.body = data;
    options.json = true;
    options.url = URL_SALESPORTAL_MENUS;
    rp(options).then(function (result) {
        res.json(result);
    }).catch(function (err) {
        logger.error(err.statusCode + ':' + err.message);
        // if (err.statusCode && parseInt(err.statusCode) == 401) {
        //     var filePath = path.join(__dirname, '../../data/menus.json');
        //     var dataDummy = utils.readFileDataJson(filePath);
        //     res.json(dataDummy);
        //     // fs.readFile(filePath, 'utf8', function (err, data) {
        //     //     if (err) { // throw err;
        //     //         res.status(500).json({
        //     //             responseCode: 500,
        //     //             responseMessage: 'Fail',
        //     //             error: err
        //     //         });
        //     //         return;
        //     //     }
        //     //     obj = JSON.parse(JSON.stringify(data));
        //     //     res.json(data);
        //     //     return;
        //     // });
        //     return;
        // }
        res.status(500).json(err);
    });

}

exports.refreshToken = function (req, res, next) {
    logger.info("access refreshToken");
    var options = {};
    options.headers = {};
    options.headers["x-authorization"] = req.headers["x-authorization"] || '';
    if (options.headers["x-authorization"] && options.headers["x-authorization"] != '') {
        var token = null;
        if (options.headers["x-authorization"] && options.headers["x-authorization"].split(' ')[0] === 'Bearer') {
            token = options.headers["x-authorization"].split(' ')[1];
            try {
                var decoded = jwtDecode(token);
                if (decoded.username && decoded.userType && decoded.userType == 'ENTRO') {
                    logger.info("User Type :: Entro");
                    genTokenEntroAuth(decoded.username, req, res, next);
                    return;
                }
            } catch (error) {
                res.status(401).json({
                    "resultCode": "ENTRO00140102",
                    "resultDescription": "Invalid token format",
                    "developerMessage": "Invalid token format"
                });
                return;
            }

        }else{
            res.status(401).json({
                "resultCode": "ENTRO00140105",
                "resultDescription": "No authentication header",
                "developerMessage": "No authentication header"
            });
            return;
        }
    }
    options.method = 'GET';
    options.json = true;
    options.url = URL_MYCHANNEL_AUTH + '/refreshToken';
    rp(options).then(function (result) {
        res.json(result);
    }).catch(function (err) {
        logger.error(err.statusCode + ':' + err.message);
        res.status(err.statusCode).json(err);
    });
}

exports.createSession = function (req, res, next) {
    // res.json('result'); 
    var currentUserId = req.query.userId ? req.query.userId : "test001";
    logger.info('Lock Session by id = [' + currentUserId + ']');
    var data = req.body;
    logger.info(data);
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };
    try {
        var now = moment();
        var expired = moment().add(cfg.session, 'minutes');
        // if (!(data.type && data.refId)) {
        //     res.json({
        //         responseCode: 400,
        //         responseMessage: 'Bad request'
        //     });
        //     return;
        // }

        // if ((data.type !== 'LOGIN')) {
        //     res.json({
        //         responseCode: 400,
        //         responseMessage: 'Bad request'
        //     });
        //     return;
        // }

        var filter1 = {
            type_key0: 'LOGIN',
            refId_key1: data.refId,
            expired_data: { $lte: new Date(now.year(), now.month(), now.date(), now.hours(), now.minutes(), now.seconds()) }
        };

        sessionMod.remove(filter1);

        var filter2 = {
            type_key0: data.type,
            refId_key1: data.refId,
            userId_key2: { $ne: data.userId },
            expired_data: { $gte: new Date(now.year(), now.month(), now.date(), now.hours(), now.minutes(), now.seconds()) }
        };
        sessionMod.find(filter2, function (err, result) {
            if (err) {
                console.error(err);
                ret.responseCode = 500;
                ret.responseMessage = 'Fail';
                ret.responseDescription = err.message;
                res.json(ret);
                throw err;
            }
            if(result&&result.length>0){
                logger.info(JSON.stringify(result));
                ret.responseCode = 401;
                ret.responseMessage = 'This account already log-in.';
                ret.responseDescription = 'This account already log-in.';
                res.json(ret);
            }else{
                var lock = {
                    type_key0: data.type,
                    refId_key1: data.refId,
                    userId_key2: data.userId,
                    page_data: data.page,
                    token_data: data.token,
                    refreshToken_data: data.refreshToken_data,
                    expired_data: new Date(expired.year(), expired.month(), expired.date(), expired.hours(), expired.minutes(), expired.seconds())
                };
                
                sessionMod.create(lock, function (err, session) {
                    if (err) {
                        res.json({
                            responseCode: 500,
                            responseMessage: 'Fail',
                            error: err
                        });
                        return;
                    }

                    ret.data = session;
                    
                    res.json(ret);
                });
            }
        });
       
    } catch (error) {
        logger.errorStack(error);
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        res.json(ret);
    }
};

exports.checkDupSession = function (req, res, next) {
    // res.json('result'); 
    var currentUserId = req.query.userId ? req.query.userId : "test001";
    logger.info('Check Duplicate Session by id = [' + currentUserId + ']');
    // var data = req.body;
    // logger.info(data);
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };
    try {
        var now = moment();
        var expired = moment().add(cfg.session, 'minutes'); 

        var filter1 = {
            type_key0: 'LOGIN',
            userId_key2: currentUserId,
            expired_data: { $lte: new Date(now.year(), now.month(), now.date(), now.hours(), now.minutes(), now.seconds()) }
        };

        sessionMod.remove(filter1);

        var filter2 = {
            type_key0: 'LOGIN', 
            userId_key2: { $ne: currentUserId },
            expired_data: { $gte: new Date(now.year(), now.month(), now.date(), now.hours(), now.minutes(), now.seconds()) }
        };
        sessionMod.find(filter2, function (err, result) {
            if (err) {
                console.error(err);
                ret.responseCode = 500;
                ret.responseMessage = 'Fail';
                ret.responseDescription = err.message;
                res.json(ret);
                throw err;
            }
            if(result&&result.length>0){
                logger.info(JSON.stringify(result));
                ret.responseCode = 401;
                ret.responseMessage = 'This account already log-in.';
                ret.responseDescription = 'This account already log-in.';
                res.json(ret);
            }else{  
                res.json(ret); 
            }
        });
       
    } catch (error) {
        logger.errorStack(error);
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        res.json(ret);
    }
};