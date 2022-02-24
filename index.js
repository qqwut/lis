const crypto = require('crypto');
const fs = require("fs");
const http = require("http");
const https = require("https");
var express = require('express');

// set up rate limiter: maximum of five requests per minute
var RateLimit = require('express-rate-limit');
var limiter = new RateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5
});

/* ------------- [START STORE CONFIG] ------------ */
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const config = require('./server/config/config');

/* ------------- [END STORE CONFIG] ------------ */
/* ------------- [START IMPORT OUR MODULE] ------------ */
const logger = require('./server/utils/logger');
const express = require('./server/config/express');
var app = express();

// apply rate limiter to all requests
app.use(limiter);
/* ------------- [END IMPORT OUR MODULE] ------------ */

/* ------------- [END IMPORT SSL CONFIG] ------------ */
/* ------------- [START INITIAL OUR APPLICATION] ------------ */
http.createServer(app).listen(config.app_port);
logger.info(`Isn't Secure : | Port : ${config.app_port}`);

app.get('/', (req, res) => {
    res.send(`Hello, I'm Application Development guide. ${process.env.BUILD_NUMBER}`);
});
logger.info("ENVIRONMENT : " + process.env.NODE_ENV);
