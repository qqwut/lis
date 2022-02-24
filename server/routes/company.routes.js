// const config = require('../config/config').get(process.env.NODE_ENV).prefix_api;
const express = require('express');
const companyCtrl = require('../controller/company-ctrl');
var router = express.Router();
router.route('/company').get(companyCtrl.company);
module.exports = router;