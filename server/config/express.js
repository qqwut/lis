/* ------------- [START IMPORT MODULE] ------------ */
const express = require('express');
const morgan = require("morgan");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
var env = process.env.NODE_ENV || 'development';
/* ------------- [END SET ENVIRONMENT] ------------ */
/* ------------- [START STORE CONFIG] ------------ */
const config = require('./config');

/* ------------- [END IMPORT MODULE] ------------ */
/* ------------- [START IMPORT OUR UTIL] ------------ */
//var logger = require('../utils/logger');
var log4js = require('log4js');
var db = require('../utils/db');
var moment = require('moment');
var passport = require('passport');
var memCache = require('memory-cache');
var jwtDecode = require('jwt-decode');
var uuid = require('uuid');

var expireTimeDef = 30 * 60 * 1000; //minutes * seconds * 1000 ==> ms
memCache.put('expires-ms-def', expireTimeDef);

require('../utils/jobSchedule');  /** --- JOB Schedule */



/* ------------- [END IMPORT OUR UTIL] ------------ */
/* ------------- [START IMPLEMENT] ------------ */
module.exports = function () {
  var logger = require("../utils/logger");
 
  var app = express();
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json({
    limit: '50mb'
  }));
  
  app.use(bodyParser.urlencoded({
    limit: '50mb',
    parameterLimit: 100000,
    extended: true 
  }));
  app.use(bodyParser.json());
  app.use(cookieParser());

  require('./passport');
  app.use(passport.initialize());
  app.use(passport.session());
  var isRevokedCallback = function (req, payload, done) {

    return done(null, false);
  };

  var jwt = require('express-jwt');
  var auth = jwt({
    secret: 'ccsm',
    userProperty: 'currentUser',
    getToken: function fromHeaderOrQuerystring(req) {
      if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
      }
      if (req.headers.authorization && req.headers.authorization.length > 0) {
        return req.headers.authorization;
      } else if (req.query && req.query.token) {
        return req.query.token;
      }
      return null;
    },
    isRevoked: isRevokedCallback
  });

  function getCurrentUser(req, res, next) {
    var token = null;
    var tokenHeader = req.headers["x-authorization"] || req.headers.authorization ;
    if (tokenHeader && tokenHeader.split(' ')[0] === 'Bearer') {
      token = tokenHeader.split(' ')[1];
    } else if (req.query && req.query.token) {
      token = req.query.token;
    }
    if (token == null) {
      res.send(401);
      return;
    }
    var decoded = jwtDecode(token);
    if (!decoded.userGroup) {
      if (decoded.role) {
        var userGroupArr = decoded.role.split('#');
        if (userGroupArr.length > 0) {
          decoded.userGroup = userGroupArr;
        }
      }

    }
    // console.log(decoded);
    req.currentUser = decoded;
    next();
  }

  logger.info("Overriding 'Express' logger");
  morgan.token('id', function getId(req) {
    return req.id;
  });

  morgan.token('user-id', function getId(req) {
    return req.currentUser ? req.currentUser.username : '';
  });

  function getRemoteIp(req ,res){
    var remoteIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '';
    if(remoteIp.indexOf(':') > -1 ){
      var tmp = remoteIp.split(':');
      remoteIp = tmp.length > 0 ? tmp[tmp.length -1 ]:remoteIp;
    }
    return remoteIp;
  }

  morgan.token('remote-ip',  getRemoteIp);

  morgan.token('uri', function(req, res){ 
    return req.originalUrl || req.url ; 
  })
  
  morgan.token('json', function(req, res){  
    var body = req.body && req.body != {} ? JSON.parse(JSON.stringify(req.body)): null ;
    var bodyStr = body != null ? JSON.stringify(body):'';
    var cfgLog = config.LOG || {};
    if(bodyStr.length > 0 && cfgLog.exclude){
        for (var key in cfgLog.exclude) {
            if (cfgLog.exclude.hasOwnProperty(key)) {
                var pattern = '("'+key+'":")(?:\\"|[^"])*"'
                var reg = new RegExp(pattern, 'g');
                bodyStr = bodyStr.replace(reg , '"'+key+'":"'+cfgLog.exclude[key]+'"')
            }
        }
    }
    if(req.url.startsWith("/service/auth/oauth2")){
      console.log(config);
      console.log(req.url);
      return '' ;
    }
    return bodyStr.length > 0 && bodyStr != '{}'  ? bodyStr:'' ; 
  })




  app.all('/api/*', getCurrentUser, function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    // var headerLog = req.currentUser ?  + '' + req.currentUser.username + ':'+req.id: req.id;
    next();
  });

  app.use('/api/*', function (req, res, next) {
    if (req.currentUser && !req.baseUrl.startsWith('/api/refresh-token')) {
        //update Time Expire for keep alive
    }
    next();
  });

  app.use(function (req, res, next) {
    req.id = req.headers['x-request-id'] || uuid.v4();
    var remoteIp = getRemoteIp(req, res);
    var username =req.currentUser?req.currentUser.username:'';
    var headerLog = 'IP|'+remoteIp+'|USER|'+username+'|REQUESTID|'+req.id;

    logger.setHeader(headerLog);
    next();
  });

  function logResponseBody(req, res, next) {
    var oldWrite = res.write,
        oldEnd = res.end;
  
    var chunks = [];
  
    res.write = function (chunk) {
      chunks.push(chunk);
      oldWrite.apply(res, arguments);
    };
  
    res.end = function (chunk) {
      var body = '';

      if (typeof chunk !== 'string' && !(chunk instanceof Buffer)) {
          res["resBody"] = body ;
          oldEnd.apply(res, arguments);
          return ;
      }

      if (!(chunk instanceof String || typeof chunk === 'string' ) )
          chunks.push(chunk);
      try {
        //console.dir(chunks);
        body =  chunks.length > 0? Buffer.concat(chunks).toString('utf8')  :'';
      } catch (error) {
        logger.errorStack(error);
      }

      res["resBody"] = body ;
      
      oldEnd.apply(res, arguments);
    };
  
    next();
  }
  
  app.use(logResponseBody);

  morgan.token('resp-body', function(req, res){ 
    return res.resBody?res.resBody:'' ; 
  })


  app.use(morgan('IP|:remote-ip|USER|:user-id|REQUESTID|:id|METHOD|:method|URI|:uri|REQUESTBODY|:json|RESPSTATUS|:status|RESPBODY|:resp-body|RESPTIME|:response-time', {
    "stream": logger.stream
  }));
  
  //app.use(logResponseBody);
  /* ------------- [START LOAD API ROUTE] ------------ */
  // var ALL_ROUTES = require('../routes/index').GET_ALL_ROUTES();
  // app.use('/', ALL_ROUTES);

  logger.info("load module");
  var load = require('express-load');
  // load('modules', {
  //   cwd: 'server',
  //   verbose: true
  // }).then('utils', {
  //   cwd: 'server',
  //   verbose: true
  // }).into(app);
  // {checkext:true, extlist:['.js','.myextension']}
  var cwdPath = path.join(__dirname, '..');
  load('modules', {
    cwd: cwdPath,
    checkext:true, 
    extlist:['service.js']
  }).into(app);
  load('modules', {
    cwd: cwdPath ,
    checkext:true, 
    extlist:['ctrl.js']
  }).into(app);
  load('modules', {
    cwd: cwdPath,
    // verbose: true,
    checkext:true, 
    extlist:['route.js']
  }).into(app);
  // load('utils', {
  //   cwd: 'server',
  //   // verbose: true
  // }).into(app);
  /* ------------- [END LOAD API ROUTE] ------------ */
  /* ------------- [START NOT MATCH ROUTE - 404 ] ------------ */

  app.all('/error', function (req, res) {
    logger.error('Got Redirect Error');
    res.status(500).send({
      error: "Connection close!"
    });
    // Future Action.
  });
  // app.all('*', function (req, res) {
  //   logger.info('[TRACE] Server 404 request:' + req.originalUrl);
  //   res.status(500).send({
  //     error: "Connection close!"
  //   });
  //   // Future Action.
  // });
  /* ------------- [END NOT MATCH ROUTE - 404 ] ------------ */
  return app;
};
/* ------------- [END IMPLEMENT] ------------ */