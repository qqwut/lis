// const config = require('../config/config').get(process.env.NODE_ENV).prefix_api;
const express = require('express');
const lovCtrl = require('../controller/lov-ctrl');
var router = express.Router();
router.get('/get-lov', lovCtrl.getLov);
router.route('/get-province').get(lovCtrl.getProvince);

module.exports = router;