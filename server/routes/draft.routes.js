import rateLimit from 'express-rate-limit'
const createAccountLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 create account requests per `window` (here, per hour)
    message:
        'Too many accounts created from this IP, please try again after an hour',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})
// const config = require('../config/config').get(process.env.NODE_ENV).prefix_api;
const express = require('express');
const draftCtrl = require('../controller/draft-ctrl');
var router = express.Router();
router.route('/draft-list').get(draftCtrl.draftList, createAccountLimiter)
router.route('/draft-detail').get(draftCtrl.draftDetail);
router.route('/draft-create').post(draftCtrl.draftCreate);
router.route('/draft-save/:draftId').put(draftCtrl.draftSave);
router.route('/draft-delete').delete(draftCtrl.draftDelete);
module.exports = router;