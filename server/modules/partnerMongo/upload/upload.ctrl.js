var moment = require('moment');
var env = process.env.NODE_ENV || 'development';
var logger = require('../../../utils/logger');
var clientHttp = require("../../../connector/http-connector.js");
var multer = require('multer');
var path = require('path');
var multer = require('multer')
var upload = multer()
var xlsx = require('node-xlsx');
var fs = require("fs");
var readXlsxFile = require('read-excel-file')
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");
var cfg = require('../../../config/config.js');
const PREFIX = cfg.service.PANDORA.PREFIX
var jsonXlsx = require('icg-json-to-xlsx');
var path = require('path');
var json2xls = require('json2xls');
var utils = require("../../../utils/common.js");

// exports.uploadFile = function (req, res) {
//     console.log("uploadFile SAVE FILE");
//     console.log("==================================================================================");
//     console.log(req.body)
//     console.log("==================================================================================");

//     var dirUpload = process.env.LOG_LOG_PATH_UPLOAD || 'logs/uploadFile';
//     var dirResult = 'logs/uploadFile/result';
//     // var dirName = path.dirname(dirUpload)
//     if (!fs.existsSync(dirUpload)) {
//         fs.mkdirSync(dirUpload);
//     }
//     if (!fs.existsSync('logs/uploadFile/upload')) {
//         fs.mkdirSync('logs/uploadFile/upload');
//     }
//     if (!fs.existsSync('logs/uploadFile/result')) {
//         fs.mkdirSync('logs/uploadFile/result');
//     }
//     const storage = multer.diskStorage({
//         destination: (req, file, callBack) => {
//             callBack(null, 'logs/uploadFile/upload')
//         },
//         filename: (req, file, callBack) => {
//             callBack(null, `${file.originalname}`)
//         }
//     })
//     const upload = multer({ storage: storage }).array('uploads[]')
//     upload(req, res, function (err) {
//         const files = req.files;
//         console.log('files', files, files.length);
//         if (!files || files.length < 1) {
//             return res.json({
//                 responseCode: 400,
//                 responseMessage: 'No File',

//             });
//         }
//         for (var i = 0; i < files.length; i++) {
//             var nameXcel = files[i].originalname.split('.')
//             console.log('nameXcel', nameXcel)
//             if (files[i].originalname.split('.')[files[i].originalname.split('.').length - 1] === 'xlsx') {
//                 exceltojson = xlsxtojson;
//             } else {
//                 exceltojson = xlstojson;
//             }
//             try {
//                 //CONVERT EXCEL TO JSON
//                 exceltojson({
//                     input: files[i].path,
//                     output: null, //since we don't need output.json
//                     // lowerCaseHeaders: true
//                 }, function (err, result) {
//                     if (err) {
//                         return res.json({ error_code: 1, err_desc: err, data: null });
//                     }
//                     result.forEach(element => {
//                         for (var propName in element) {
//                             if (element[propName] === "") {
//                                 delete element[propName];
//                             }
//                         }
//                     })
//                     result = result.filter(value => Object.keys(value).length !== 0);
//                     var postData = {
//                         postData: result
//                     };
//                     //SEND TO JBOSS
//                     var uri = cfg.service.PANDORA.URI + PREFIX + '/upload/postFile.json';
//                     // console.log('POST :: ' + uri);
//                     // console.log('body1 :: ' + JSON.stringify(result));
//                     clientHttp.post(uri, postData, {
//                         service: 'phxpartners-be',
//                         callService: 'CREATE_LOCATION',
//                         reqId: req.id
//                     }).then(function (response) {
//                         // logger.info('response :: ' + JSON.stringify(response));
//                         if (parseInt(response.resultCode) == 20000) {
//                             var resultDataJson = response.resultData.postData
//                             // console.log('****************************************')
//                             // console.log(resultDataJson);
//                             console.log('****************************************')
//                             console.log('nameXcel', nameXcel)
//                             var xls = json2xls(resultDataJson);
//                             var date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split(' ')
//                             var format = date[0].split('-').join('') + "_" + date[1]
//                             var fileName = nameXcel[0] + "_RESULT_"+format+'.'+nameXcel[1]
//                             console.log('fileName', fileName)
//                             console.log('****************************************')
//                             // fs.writeFileSync('./logs/uploadFile/result/'+fileName, xls, 'binary', (err) => {
//                             //     if (err) {
//                             //         console.log("writeFileSync :", err);
//                             //     }
//                             //     console.log(filename + " file is saved!");
//                             // });
//                             console.log('**********Success**********')
//                         } else if (parseInt(response.resultCode) == 42410) {
//                             console.log('**********OperatioFailed**********')
//                         } else {
//                             console.log('**********Fail**********')
//                         }

//                     }).catch(function (err) {
//                         console.log('**********Catch**********')
//                     });
//                 });
//             } catch (e) {
//                 return res.json({ error_code: 1, err_desc: "Corupted excel file" });
//             }
//         }

//     }).then(function (response) {
//         return res.json({
//             responseCode: 200,
//             responseMessage: 'Success',

//         });
//     })

// }

exports.uploadFile = function (req, res) {
    console.log("uploadFile SAVE FILE");
    console.log("==================================================================================");
    console.log(req.body)
    console.log("==================================================================================");
    logger.info('process.env.UPLOAD_ASC_UPLOAD_PATH', process.env.LOAD_ASC_UPLOAD_PATH)
    logger.info('process.env.UPLOAD_ASC_RESULT_PATH', process.env.LOAD_ASC_RESULT_PATH)
    var dirUploadPath = process.env.LOAD_ASC_UPLOAD_PATH || 'logs/UploadFile/ASC/Upload';
    var dirResultPath = process.env.LOAD_ASC_RESULT_PATH || 'logs/UploadFile/ASC/Result';
    if (!fs.existsSync(dirUploadPath)) {
        return res.json({
            responseCode: 500,
            responseMessage: 'No Upload folder',

        });
    }
    if (!fs.existsSync(dirResultPath)) {
        return res.json({
            responseCode: 500,
            responseMessage: 'No result folder',

        });
    }

    var dataExcel = req.body
    var user = req.currentUser ? req.currentUser.username : ''
    var postData = []
    var fileData = []
    for (var i = 0; i < dataExcel.length; i++) {
        var nameXcel = Object.keys(dataExcel[i])[0]
        postData.push({
            postData: dataExcel[i][nameXcel],
            nameFile: nameXcel,
            userName: user
        })
        fileData.push({
            nameFile: nameXcel,
            userName: user,
            status: 'PROCESS'
        })
        var xls = json2xls(dataExcel[i][nameXcel]);
        try {
            fs.writeFileSync(dirUploadPath + '/' + nameXcel, xls, 'binary', (err) => {
                if (err) {
                    console.log("writeFileSync :", err);
                    return res.json({ responseCode: 500, responseMessage: "Corupted excel file" });
                }
                console.log(filename + " file is saved!");
            });
        } catch (e) {
            return res.json({ responseCode: 500, responseMessage: "Corupted excel file" });
        }
    }
    try {
        //UPDATE STATUS
        var uri = cfg.service.PANDORA.URI + PREFIX + '/upload/asc_load_info.json';
        var fileDataUpload = { fileData: fileData }
        clientHttp.post(uri, fileDataUpload, {
            service: 'phxpartners-be',
            callService: 'UPLOAD_FILE',
            reqId: req.id
        }).then(function (response) {
            if (parseInt(response.resultCode) == 20000) {
                console.log('**********Success**********')
                return res.json({
                    responseCode: 200,
                    responseMessage: 'Success',
                    responseData: response.resultData

                });
            } else if (parseInt(response.resultCode) == 42410) {
                console.log('**********OperatioFailed**********')
                return res.json({
                    responseCode: 424,
                    responseMessage: 'OperatioFailed',

                });
            } else {
                console.log('**********Fail**********')
                return res.json({
                    responseCode: 404,
                    responseMessage: 'OperatioFailed',

                });
            }

        }).catch(function (err) {
            console.log('**********Catch**********')
            return res.json({
                responseCode: 500,
                responseMessage: 'System Error',

            });
        });
    } catch (e) {
        return res.json({
            responseCode: 500,
            responseMessage: 'System Error',

        });
    }
}

exports.uploadData = function (req, res) {
    console.log("uploadFile SAVE FILE");
    console.log("==================================================================================");
    console.log(req.body)
    console.log("==================================================================================");

    logger.info('process.env.UPLOAD_ASC_UPLOAD_PATH', process.env.LOAD_ASC_UPLOAD_PATH)
    logger.info('process.env.UPLOAD_ASC_RESULT_PATH', process.env.LOAD_ASC_RESULT_PATH)
    var dirUploadPath = process.env.LOAD_ASC_UPLOAD_PATH || 'logs/UploadFile/ASC/Upload';
    var dirResultPath = process.env.LOAD_ASC_RESULT_PATH || 'logs/UploadFile/ASC/Result';
    if (!fs.existsSync(dirUploadPath)) {
        return res.json({
            responseCode: 500,
            responseMessage: 'No Upload folder',

        });
    }
    if (!fs.existsSync(dirResultPath)) {
        return res.json({
            responseCode: 500,
            responseMessage: 'No result folder',

        });
    }

    var dataExcel = req.body
    console.log('DATATOCREATE ::', dataExcel)
    for (var i = 0; i < dataExcel.length; i++) {
        try {
            //SEND TO JBOSS
            var uri = cfg.service.PANDORA.URI + PREFIX + '/upload/asc_load_data.json';
            clientHttp.post(uri, dataExcel[i], {
                service: 'phxpartners-be',
                callService: 'UPLOAD_FILE',
                reqId: req.id
            }).then(function (response) {
                if (parseInt(response.resultCode) == 20000) {
                    var resultDataJson = response.resultData.postData
                    var nameResult = response.resultData.nameFile.split('.')
                    var name = ''
                    var i;
                    for (i = 0; i < nameResult.length - 1; i++) {
                        name += nameResult[i] + '.'
                    }
                    if(name.length > 0) {
                        name = name.substring(0, name.length - 1)
                    }
                    var xls = json2xls(resultDataJson);
                    var date = moment({ year: new Date().getFullYear(), month: new Date().getMonth(), day: new Date().getDate(), hours: new Date().getHours(), minutes: new Date().getMinutes(), seconds: new Date().getSeconds() }).format('YYYYMMDD_HHmmss.');
                    var fileName = name + "_RESULT_" + date + nameResult[nameResult.length - 1]
                    fs.writeFileSync(dirResultPath + '/' + fileName, xls, 'binary', (err) => {
                        if (err) {
                            console.log("writeFileSync :", err);
                        }
                        console.log(filename + " file is saved!");
                    });
                    var updateData = [{ nameFile: fileName, userName: response.resultData.userName, fileId: response.resultData.fileId, status: "SUCCESS" }]
                    try {
                        //UPDATE STATUS
                        var uri = cfg.service.PANDORA.URI + PREFIX + '/upload/updateStatus.json';
                        var fileData = { fileData: updateData }
                        clientHttp.post(uri, fileData, {
                            service: 'phxpartners-be',
                            callService: 'UPLOAD_FILE',
                            reqId: req.id
                        }).then(function (response) {
                            if (parseInt(response.resultCode) == 20000) {
                                console.log('**********Success**********')
                            } else if (parseInt(response.resultCode) == 42410) {
                                console.log('**********OperatioFailed**********')
                            } else {
                                console.log('**********Fail**********')
                            }

                        }).catch(function (err) {
                            console.log('**********Catch**********')
                        });
                    } catch (e) {
                    }
                    console.log('**********Success**********')
                } else if (parseInt(response.resultCode) == 42410) {
                    console.log('**********OperatioFailed**********')
                } else {
                    console.log('**********Fail**********')
                }

            }).catch(function (err) {
                console.log('**********Catch**********')
            });
        } catch (e) {
            return res.json({ responseCode: 1, responseMessage: "Send JBOSS" });
        }
    }
    return res.json({
        responseCode: 200,
        responseMessage: 'Success',

    });

}

exports.searchResultLoadASC = function (req, res) {
    var filter = {};
    filter = req.query;
    logger.info('==apisearchResultFile' + req.query);
    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + PREFIX + '/upload/resultLoad.json?filter=' + queryStr;
        logger.info('==GET :: ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'GET_SEARCH_RESULT_LOAD_ASC',
            reqId: req.id
        }).then(function (response) {
            logger.info('response :: ' + JSON.stringify(response));
            if (response.resultCode == "20000") {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.resultDescription = response.resultDescription;
                ret.responseMoreInfo = response.moreInfo;
                ret.resultData = response.resultData;
                return res.json(ret);
            } else {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.resultDescription = response.resultDescription;
                ret.responseMoreInfo = response.moreInfo;
                ret.resultData = response.resultData;
                return res.json(ret);
            }
        }).catch(function (err) {
            logger.error(err)
            ret.responseCode = 500;
            ret.responseMessage = 'Fail';
            ret.responseDescription = err.message;
            res.json(ret);
        });
    } catch (error) {
        logger.info('==catch');
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        res.json(ret);
    }
};

exports.downloadFileAsc = function (req, res) {
    console.log("DOWNLOAD FILE");
    console.log(req.query);
    logger.info('process.env.LOAD_ASC_RESULT_PATH', process.env.LOAD_ASC_RESULT_PATH);
    var fileResultName = req.query.fileResultName;
    var fileTypeName = req.query.uploadType;
    if (fileTypeName == 'ASC') {
        var dirResultPath = process.env.LOAD_ASC_RESULT_PATH || 'logs/UploadFile/ASC/Result'
    } else if (fileTypeName == 'LOCATION') {
        var dirResultPath = process.env.LOAD_LOCATION_RESULT_PATH || 'logs/UploadFile/LOCATION/Result'
    }
    var filepath = dirResultPath + "/" + fileResultName;
    console.log("🏐file path", filepath)

    console.log('dirResultPath', dirResultPath);
    console.log('fileResultName', fileResultName);
    console.log('filepath', filepath);

    if (!fs.existsSync(filepath)) {
        return res.json({
            responseCode: 500,
            responseMessage: 'No result file.',
        });
    }

    try {
        console.log('Download start...')
        var fileData = xlsx.parse(fs.readFileSync(filepath)); // parses a buffer
        console.log('fileData', fileData)
        // send a JSON or any other response with these strings
        return res.json({
            responseCode: 200,
            responseMessage: 'Download finished.',
            sendFiles: fileData
        });
    } catch (e) {
        return res.json({ responseCode: 500, responseMessage: 'Fail to download file.', });
    }
};

// 1
exports.uploadFileLocation = function (req, res) {
    console.log("uploadFile SAVE FILE");
    console.log("==================================================================================");
    console.log(req.body)
    console.log("==================================================================================");
    logger.info('process.env.UPLOAD_LOCATION_UPLOAD_PATH', process.env.LOAD_LOCATION_UPLOAD_PATH)
    logger.info('process.env.UPLOAD_LOCATION_RESULT_PATH', process.env.LOAD_LOCATION_RESULT_PATH)
    var dirUploadPath = process.env.LOAD_LOCATION_UPLOAD_PATH || 'logs/UploadFile/Location/Upload';
    var dirResultPath = process.env.LOAD_LOCATION_RESULT_PATH || 'logs/UploadFile/Location/Result';
    var actionType = req.query.actionType;

    if(actionType == 'CREATE'){
        dirUploadPath += '/Create';
        dirResultPath += '/Create';
    } else if(actionType == 'EDIT'){
        dirUploadPath += '/Edit';
        dirResultPath += '/Edit';
    } else if(actionType == 'INACTIVE'){
        dirUploadPath += '/Inactive';
        dirResultPath += '/Inactive';
    }

    if (!fs.existsSync(dirUploadPath)) {
        return res.json({
            responseCode: 500,
            responseMessage: 'No upload folder',

        });
    }

    if (!fs.existsSync(dirResultPath)) {
        return res.json({
            responseCode: 500,
            responseMessage: 'No result folder',

        });
    }

    var dataExcel = req.body
    var user = req.currentUser ? req.currentUser.username : ''
    var postData = []
    var fileData = []
    for (var i = 0; i < dataExcel.length; i++) {
        var nameXcel = Object.keys(dataExcel[i])[0]
        fileData.push({
            nameFile: nameXcel,
            userName: user,
            status: 'PROCESS',
            actionType: req.query.actionType,
            uploadType: 'LOCATION'
        })
        var xls = json2xls(dataExcel[i][nameXcel]);
        try {
            fs.writeFileSync(dirUploadPath + '/' + nameXcel, xls, 'binary', (err) => {
                if (err) {
                    console.log("writeFileSync :", err);
                    return res.json({ responseCode: 500, responseMessage: "Corupted excel file" });
                }
                console.log(filename + " file is saved!");
            });
        } catch (e) {
            return res.json({ responseCode: 500, responseMessage: "Corupted excel file" });
        }
    }
    try {
        //UPDATE STATUS
        var uri = cfg.service.PANDORA.URI + PREFIX + '/upload/location_load_info.json';
        var fileDataUpload = { fileData: fileData }
        console.log('fileDataUpload', fileDataUpload)
        clientHttp.post(uri, fileDataUpload, {
            service: 'phxpartners-be',
            callService: 'UPLOAD_FILE',
            reqId: req.id
        }).then(function (response) {
            if (parseInt(response.resultCode) == 20000) {
                console.log('**********Success**********')
                return res.json({
                    responseCode: 200,
                    responseMessage: 'Success',
                    responseData: response.resultData

                });
            } else if (parseInt(response.resultCode) == 42410) {
                console.log('**********OperatioFailed**********')
                return res.json({
                    responseCode: 424,
                    responseMessage: 'OperatioFailed',

                });
            } else {
                console.log('**********Fail**********')
                return res.json({
                    responseCode: 404,
                    responseMessage: 'OperatioFailed',

                });
            }

        }).catch(function (err) {
            console.log('**********Catch**********')
            return res.json({
                responseCode: 500,
                responseMessage: 'System Error',

            });
        });
    } catch (e) {
        return res.json({
            responseCode: 500,
            responseMessage: 'System Error',

        });
    }
}
 
// 2
exports.uploadDataLocation = function (req, res) {
    console.log("uploadFile SAVE FILE");
    console.log("==================================================================================");
    console.log(req.body)
    console.log("==================================================================================");

    logger.info('process.env.UPLOAD_LOCATION_UPLOAD_PATH', process.env.LOAD_LOCATION_UPLOAD_PATH)
    logger.info('process.env.UPLOAD_LOCATION_RESULT_PATH', process.env.LOAD_LOCATION_RESULT_PATH)
    var dirUploadPath = process.env.LOAD_LOCATION_UPLOAD_PATH || 'logs/UploadFile/Location/Upload';
    var dirResultPath = process.env.LOAD_LOCATION_RESULT_PATH || 'logs/UploadFile/Location/Result';
    var uri = '';

    if(req.query.actionType == 'CREATE'){
        dirResultPath += '/Create';
        dirUploadPath += '/Create';
        uri = cfg.service.PANDORA.URI + PREFIX + '/upload/create/location_load_data.json';
    } else if(req.query.actionType == 'EDIT'){
        dirResultPath += '/Edit';
        dirUploadPath += '/Edit';
        uri = cfg.service.PANDORA.URI + PREFIX + '/upload/edit/location_load_data.json';
    } else if(req.query.actionType == 'INACTIVE'){
        dirResultPath += '/Inactive';
        dirUploadPath += '/Inactive';
        uri = cfg.service.PANDORA.URI + PREFIX + '/upload/inactive/location_load_data.json';
    }

    if (!fs.existsSync(dirUploadPath)) {
        return res.json({
            responseCode: 500,
            responseMessage: 'No upload folder',

        });
    }

    if (!fs.existsSync(dirResultPath)) {
        return res.json({
            responseCode: 500,
            responseMessage: 'No result folder',

        });
    }

    var dataExcel = req.body
    console.log('DATATOCREATE ::', dataExcel)
    for (var i = 0; i < dataExcel.length; i++) {
        try {
            //SEND TO JBOSS
            clientHttp.post(uri, dataExcel[i], {
                service: 'phxpartners-be',
                callService: 'UPLOAD_FILE',
                reqId: req.id
            }).then(function (response) {
                if (parseInt(response.resultCode) == 20000) {
                    var resultDataJson = response.resultData.dataUploadLocation
                    var nameResult = response.resultData.nameFile.split('.')
                    var name = ''
                    var i;
                    for (i = 0; i < nameResult.length - 1; i++) {
                        name += nameResult[i] + '.'
                    }
                    if(name.length > 0) {
                        name = name.substring(0, name.length - 1)
                    }
                    var xls = json2xls(resultDataJson);
                    var date = moment({ year: new Date().getFullYear(), month: new Date().getMonth(), day: new Date().getDate(), hours: new Date().getHours(), minutes: new Date().getMinutes(), seconds: new Date().getSeconds() }).format('YYYYMMDD_HHmmss.');
                    var fileName = name + "_Result_" + req.query.actionType + "_" + date + nameResult[nameResult.length - 1]
                    fs.writeFileSync(dirResultPath + '/' + fileName, xls, 'binary', (err) => {
                        if (err) {
                            console.log("writeFileSync :", err);
                        }
                        console.log(filename + " file is saved!");
                    });
                    var updateData = [{ nameFile: fileName, userName: response.resultData.userName, fileId: response.resultData.fileId, status: "SUCCESS" }]
                    try {
                        //UPDATE STATUS
                        var uri = cfg.service.PANDORA.URI + PREFIX + '/upload/location/updateStatus.json';
                        var fileData = { fileData: updateData }
                        clientHttp.post(uri, fileData, {
                            service: 'phxpartners-be',
                            callService: 'UPLOAD_FILE',
                            reqId: req.id
                        }).then(function (response) {
                            if (parseInt(response.resultCode) == 20000) {
                                console.log('**********Success**********')
                            } else if (parseInt(response.resultCode) == 42410) {
                                console.log('**********OperatioFailed**********')
                            } else {
                                console.log('**********Fail**********')
                            }

                        }).catch(function (err) {
                            console.log('**********Catch**********')
                        });
                    } catch (e) {
                    }
                    console.log('**********Success**********')
                } else if (parseInt(response.resultCode) == 42410) {
                    console.log('**********OperatioFailed**********')
                } else {
                    console.log('**********Fail**********')
                }

            }).catch(function (err) {
                console.log('**********Catch**********', err.message)
            });
        } catch (e) {
            return res.json({ responseCode: 1, responseMessage: "Send JBOSS" });
        }
    }
    return res.json({
        responseCode: 200,
        responseMessage: 'Success',

    });
}

exports.searchResultLoadLocation = function (req, res) {
    var filter = {};
    filter = req.query;
    logger.info('==apisearchResultFile NEW' + req.query);
    var ret = {};
    try {
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI + PREFIX + '/upload/resultLoad.json?filter=' + queryStr;
        logger.info('==GET :: ' + uri);
        return clientHttp.get(uri, {
            service: 'phxpartners-be',
            callService: 'GET_SEARCH_RESULT_LOAD_LOCATION',
            reqId: req.id
        }).then(function (response) {
            logger.info('response :: ' + JSON.stringify(response));
            if (response.resultCode == "20000") {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.resultDescription = response.resultDescription;
                ret.responseMoreInfo = response.moreInfo;
                ret.resultData = response.resultData;
                return res.json(ret);
            } else {
                ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                ret.resultDescription = response.resultDescription;
                ret.responseMoreInfo = response.moreInfo;
                ret.resultData = response.resultData;
                return res.json(ret);
            }
        }).catch(function (err) {
            logger.error(err)
            ret.responseCode = 500;
            ret.responseMessage = 'Fail';
            ret.responseDescription = err.message;
            res.json(ret);
        });
    } catch (error) {
        logger.info('==catch');
        ret.responseCode = 500;
        ret.responseMessage = 'Fail';
        ret.responseDescription = error.message;
        res.json(ret);
    }
};

exports.downloadFileLocation = function (req, res) {
    console.log("DOWNLOAD FILE NEW");
    console.log(req.query);
    logger.info('process.env.LOAD_LOCATION_RESULT_PATH', process.env.LOAD_LOCATION_RESULT_PATH);
    var fileResultName = req.query.fileResultName;
    // var fileTypeName = req.query.uploadType;
    var dirResultPath = process.env.LOAD_LOCATION_RESULT_PATH || 'logs/UploadFile/Location/Result'

    if(req.query.actionType == 'CREATE'){
        dirResultPath += '/Create';
    } else if(req.query.actionType == 'EDIT'){
        dirResultPath += '/Edit';
    } else if(req.query.actionType == 'INACTIVE'){
        dirResultPath += '/Inactive';
    }

    var filepath = dirResultPath + "/" + fileResultName;
    console.log("🏐file path", filepath)

    console.log('dirResultPath', dirResultPath);
    console.log('fileResultName', fileResultName);
    console.log('filepath', filepath);

    if (!fs.existsSync(filepath)) {
        return res.json({
            responseCode: 500,
            responseMessage: 'No result file.',
        });
    }

    try {
        console.log('Download start...')
        var fileData = xlsx.parse(fs.readFileSync(filepath)); // parses a buffer
        console.log('fileData', fileData)
        // send a JSON or any other response with these strings
        return res.json({
            responseCode: 200,
            responseMessage: 'Download finished.',
            sendFiles: fileData
        });
    } catch (e) {
        return res.json({ responseCode: 500, responseMessage: 'Fail to download file.', });
    }
};

exports.checkFileExampleLocation = function (req, res) {

    console.log("DOWNLOAD FILE NEW");
    console.log(req.query);
    logger.info('process.env.LOAD_LOCATION_FILE_EXAMPLE', process.env.LOAD_LOCATION_FILE_EXAMPLE);
    var dirResultPath = process.env.LOAD_LOCATION_FILE_EXAMPLE || 'logs/UploadFile/Location/Example'

    var fileName;
    if('Create' == req.query.actionType) {
        fileName = "Example_Create_Load_Location.xlsx";

    } else if ('Edit' == req.query.actionType) {
        fileName = "Example_Edit_Load_Location.xlsx";

    } else {
        fileName = "test.xlsx";
    }

    var filepath = dirResultPath + "/" + req.query.actionType + "/" + fileName;
    console.log("🏐file path", filepath)
    console.log('dirResultPath', dirResultPath);
    console.log('filepath', filepath);

    if (!fs.existsSync(filepath)) {
        return res.json({
            responseCode: 500,
            responseMessage: 'No result file.',
        });
    } else {
        return res.json({
            responseCode: 200,
            responseMessage: 'Success',
            path: filepath
        });
    }
};