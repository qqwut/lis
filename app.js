/* ------------- [START SET ENVIRONMENT] ------------ */
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
/* ------------- [END SET ENVIRONMENT] ------------ */
/* ------------- [START STORE CONFIG] ------------ */
const config = require('./server/config/config').get(process.env.NODE_ENV);
/* ------------- [END STORE CONFIG] ------------ */
/* ------------- [START IMPORT MODULE] ------------ */
const express = require('express');
const morgan = require("morgan");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');
const fs = require("fs");
var logger = require('./server/utils/logger');
// var logger = require('log4js');
var passport = require('passport');
var memCache = require('memory-cache');
var expireTimeDef = 30 * 60 * 1000; //minutes * seconds * 1000 ==> ms
memCache.put('expires-ms-def', expireTimeDef);
/* ------------- [END IMPORT MODULE] ------------ */
/* ------------- [START IMPORT SSL CONFIG] ------------ */
const privateKey = fs.readFileSync('key1.pem');
const certificate = fs.readFileSync('cert1.pem');
const proxy = require('http-proxy-middleware');
const https = require("https");
const options = {
    key: privateKey,
    cert: certificate
};
/* ------------- [END IMPORT SSL CONFIG] ------------ */
/* ------------- [START INITIAL OUR APPLICATION] ------------ */
var app = express();
morgan.token('id', function getId(req) {
    return req.id;
});
morgan.token('user-id', function getId(req) {
    return req.currentUser ? req.currentUser.username : '---';
});

app.use(function (req, res, next) {
    req.id = uuid.v4();
    next();
});

app.use(morgan(':user-id - :id :method :url [ response-time= :response-time ms.]', {
    "stream": logger.stream
}));

// if (process.env.NODE_ENV === 'development') {
//     logger.info("Development Environment");
//     app.use(morgan("dev", {
//         "stream": logger.stream
//     }));
// }else  if (process.env.NODE_ENV === 'iot') {
//     logger.info("IOT Environment");
//     app.use(morgan("iot", {
//         "stream": logger.stream
//     }));
// }else {
//     logger.info("Production Environment");
//     app.use(morgan("common", {
//         "stream": logger.stream
//     }));
// }
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist')));
app.use(config.proxy_root, proxy({
    target: config.proxy_target,
    changeOrigin: true,
    ws: true,
    pathRewrite: config.proxy_rewrite
}));
app.use(bodyParser.urlencoded({
    extended: true
}));

const load = require('express-load');

load('modules', {
    cwd: 'server'
}).into(app);

require('./server/config/passport');

app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist')));
app.use(config.proxy_root, proxy({
  target: config.proxy_target,
  changeOrigin: true,
  pathRewrite: config.proxy_rewrite,
}));

app.all('*', function (req, res) {
  // logger.info('[TRACE] Server 404 request:' + req.originalUrl);
  res.status(200).sendFile(path.join(__dirname, './dist/index.html'));
});
https.createServer(options, app).listen(config.web_port);
logger.info(process.env.NODE_ENV +" Environment");
logger.info('Web-App is running on port : ' + config.web_port);
/* ------------- [END INITIAL OUR APPLICATION] ------------ */
/* ------------- [START EXPORT OUR MODULE] ------------ */
module.exports = app;
/* ------------- [END EXPORT OUR MODULE] ------------ */
