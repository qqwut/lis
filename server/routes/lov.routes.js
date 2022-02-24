// const config = require('../config/config').get(process.env.NODE_ENV).prefix_api;
const express = require('express');
const lovCtrl = require('../controller/lov-ctrl');
const router = express.Router();
const { createAccountLimiter } = require('../utils/rate-limit');

router.route('/get-lov').get(createAccountLimiter, lovCtrl.getLov);
router.route('/get-province').get(lovCtrl.getProvince);

module.exports = router;