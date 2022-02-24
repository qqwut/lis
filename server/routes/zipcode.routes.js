// const config = require('../config/config').get(process.env.NODE_ENV).prefix_api;
const express = require('express');
const zipCodeCtrl = require('../controller/search-zipcode-ctrl');
var router = express.Router();
router.route('/search-zipcode').get(zipCodeCtrl.searchZipCode);
module.exports = router;

