process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
var moment = require('moment');
const fs = require('fs');
// var request = require('request');
// var rp = require('request-promise').defaults({strictSSL: true});
var rp = require('request-promise');
var env = process.env.NODE_ENV || 'development';
var cfg = require('../config/config.js');
var _CONST = require("../utils/constants");
var logger = require("../utils/logger").serviceLog;
var extend = require('extend');
var pnLogMongo = require("../model/pnServerLog");


const OPTIONS = {
    headers: _CONST.HEADERS,
    json: true
};

module.exports = request;

function request(url, opt) {
    //url = replaceProxy( url ) ; //tidarats
    var options =  {};
    extend(options , opt );
    // options.strictSSL = true;
    //add cert pendora
    // var key = fs.readFileSync(cfg.service.PANDORA.KEY);
    // options.key =  key; 
    if(cfg.service.PANDORA.CERT != undefined && cfg.service.PANDORA.CERT != "" ){
        var cert = fs.readFileSync(cfg.service.PANDORA.CERT); 
        options.cert =  cert; 
    }

    if("UPLOAD_FILE" == options.callService) {
        options.timeout = parseInt(cfg.http_req_timeout_upload) <= 0 ? undefined : parseInt(cfg.http_req_timeout_upload) * 1000;
    } else {
        options.timeout = parseInt(cfg.http_req_timeout) <= 0 ? undefined : parseInt(cfg.http_req_timeout) * 1000;
    }

    logger.info('TimeOut : ', options.timeout)

    options.method = opt.method || 'GET';
    options.uri = url; 
    var trancLog = 'CALL_SERVICE|'+(options.callService?options.callService.toUpperCase():'')+'|METHOD|'+options.method.toUpperCase()+'|URI|'+url+'|REQID|'+(options.reqId?options.reqId:'')+'|REQHEADERS|'+JSON.stringify(options.headers);
    trancLog += '|REQBODY|'+options.body?JSON.stringify(options.body):'';
    var reqTime = moment().valueOf();
    return rp(options , function (err, response, body) {
        var resTime = moment().valueOf();
        responseLog = '|RESPSTATUS|'+(response?response.statusCode:'')+'|RESPBODY|'+(body?JSON.stringify(body):'')+'|RESPTIME|'+(resTime-reqTime);

        var pnLog = {
            METHOD: options.method.toUpperCase(),
            URI: url,
            RESPBODY: (body?JSON.stringify(body):''),
            REQID: (options.reqId?options.reqId:''),
            REQHEADERS: JSON.stringify(options.headers),
            REQBODY: options.body?JSON.stringify(options.body):'',
            RESPSTATUS: (response?response.statusCode:''),
            RESPTIME: (resTime-reqTime),
            SERVICENAME: (options.callService?options.callService.toUpperCase():''),
            THREAD: '',
            USER: '',
            SOURCE: 'web',
            ACTION: '',
            REFKEY: ''
        };

        //********************** ERROR NOW IS NOT DEFINED **********************
        //var createDt = new Date(now.year(), now.month(), now.date(), now.hours(), now.minutes(), now.seconds(), now.milliseconds());
        var createDt = new Date().toISOString();
        
        // var createDt = dateTime.create();
        // var createDt = createDt.format('Y-m-d H:M:S');
        pnLog.DATE = createDt;
        responseLog += '|ERRORMESSAGE|'
        if(response && !(/^2/.test('' + response.statusCode)) ){
            responseLog += JSON.stringify(response);
            pnLog.ERRORMESSAGE = JSON.stringify(response);
        }
        responseLog += '|EXCEPTION|'
        if(err){
            responseLog += JSON.stringify(err);
            pnLog.EXCEPTION = JSON.stringify(err);
        }
        responseLog += '|';
        pnLogMongo.create(pnLog, function (err, draft) {
            // if (err) {
            //     res.json({
            //         responseCode: 500,
            //         responseMessage: 'Fail',
            //         error: err
            //     });
            //     return;
            // }
            // // console.dir(draft);
            // var ret = {
            //     responseCode: 201,
            //     responseMessage: "Success",
            //     data: {
            //         locationDraftId: draft._id
            //     }
            // };
            // // ret.data.push({
            // //     locationDraftId: draft._id
            // // });
            // res.json(ret);
        });
        

        // var responseLog = err?'|RESPSTATUS||RESPBODY||RESPTIME||ERRORMESSAGE|'+JSON.stringify(err)+'|EXCEPTION||':'|RESPSTATUS|'+response.statusCode+'|RESPBODY|'+JSON.stringify(body)+'|RESPTIME|'+(resTime-reqTime)+'|ERRORMESSAGE||EXCEPTION||';
        logger.info(trancLog+responseLog);
    });
};
function replaceProxy( url ) {
    ///phxPartner/v1/partner/location/name.json
    try{
        if(cfg.service.PANDORA.PREFIX != undefined && cfg.service.PANDORA.PREFIX != ''){
            var regx = RegExp('^'+cfg.service.PANDORA.URI+'/phxPartner/v1');
            url = url.replace(regx, cfg.service.PANDORA.URI+cfg.service.PANDORA.PREFIX);
             //console.log('NewUrl: ' + newUrl);
        }
    }catch (err){

    }
    return url ;
}
request.get = function(url, opt) {
    var options = {};
    opt = opt || {};
    extend(options , OPTIONS , opt);
    options.method = 'GET'; 
    // options.headers["Content-Length"] = 0;
    delete options.headers["Content-Length"];
    options.body = {};
    return request(url, options);
};

request.post = function(url, data, opt) {
    var options = {};
    extend(options , OPTIONS , opt);
    // options = opt || JSON.parse(JSON.stringify(OPTIONS));
    if(data){ 
        options.headers["Content-Length"] = Buffer.byteLength(JSON.stringify(data));
    }else{
        delete options.headers["Content-Length"];
    }
    options.method = 'POST';
    options.body = data;
    options.json = true;
    return request(url, options);
};

request.put = function(url, data, opt) {
    var options = {};
    extend(options , OPTIONS , opt);
    // extend(options , OPTIONS , opt);
    if(data){
        options.headers["Content-Length"] = Buffer.byteLength(JSON.stringify(data));
    }else{
        delete options.headers["Content-Length"];
    }
    
    // options = opt || JSON.parse(JSON.stringify(OPTIONS));
    options.method = 'PUT';
    options.body = data;
    return request(url, options);
}

request.delete = function(url, opt) {
    var options = {};
    extend(options , OPTIONS , opt);
    options.method = 'DELETE';
    delete options.headers["Content-Length"];
    options.body = {};
    return request(url, options);
}