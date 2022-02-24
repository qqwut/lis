// const config = require('../config/config').get(process.env.NODE_ENV).prefix_api;
const express = require('express');
var router = express.Router();
router.route('/get-lov').get(require('../controller/lov-ctrl').getLov);
router.route('/get-province').get(require('../controller/lov-ctrl').getProvince);

module.exports = router;