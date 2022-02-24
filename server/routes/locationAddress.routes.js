// module.exports = function(app) {
//   var locationAddress = require('../controller/locationAddress-ctrl');
//   app.get('/api/location-address/get-country', locationAddress.getCountry);
//   app.get('/api/location-address/get-province', locationAddress.getProvince);
//   app.get('/api/location-address/get-address', locationAddress.getAddress);
// };


// const config = require('../config/config').get(process.env.NODE_ENV).prefix_api;
const express = require('express');
const locationAddress = require('../controller/locationAddress-ctrl');
var router = express.Router();

router.route('/get-address').get(locationAddress.getAddress);
// router.route('/draft-delete').delete(draftCtrl.draftDelete);
module.exports = router;