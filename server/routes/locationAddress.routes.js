var express = require('express');
var app = express();

// set up rate limiter: maximum of five requests per minute
var RateLimit = require('express-rate-limit');
var limiter = new RateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5
});

// apply rate limiter to all requests
app.use(limiter);
const express = require('express');
const locationAddress = require('../controller/locationAddress-ctrl');
var router = express.Router();

router.route('/get-address').get(function (req, res) {
    locationAddress.getAddress(req, res)
});
// router.route('/draft-delete').delete(draftCtrl.draftDelete);
module.exports = router;