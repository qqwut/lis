// const config = require('../config/config').get(process.env.NODE_ENV).prefix_api;
const express = require('express');
const mappingRegionCtrl = require('../controller/mappingRegion-ctrl');
var router = express.Router();
router.route('/mappingRegion').get(mappingRegionCtrl.mappingRegion);
module.exports = router;