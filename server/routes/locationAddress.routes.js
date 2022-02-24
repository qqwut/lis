import rateLimit from 'express-rate-limit'

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// const config = require('../config/config').get(process.env.NODE_ENV).prefix_api;
const express = require('express');
const locationAddress = require('../controller/locationAddress-ctrl');
var router = express.Router();

router.route('/get-address', apiLimiter).get(locationAddress.getAddress);
// router.route('/draft-delete').delete(draftCtrl.draftDelete);
module.exports = router;