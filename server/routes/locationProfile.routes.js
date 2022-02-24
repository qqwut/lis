module.exports = function(app)
{
  var locationProfile = require('../controller/locationProfile-ctrl');
  app.get('/api/location-profile/check-name-en', locationProfile.checkNameEN);
  app.get('/api/location-profile/check-name-th', locationProfile.checkNameTH);
  app.get('/api/location-profile/get-shop-segment', locationProfile.getShopSegment);
  app.get('/api/location-profile/get-shop-area', locationProfile.getShopArea);
  app.get('/api/location-profile/get-shop-type', locationProfile.getShopType);
  app.get('/api/location-profile/get-open-hour', locationProfile.getOpenHour);
  app.post('/api/save-step-one', locationProfile.saveStepOne);
};

// const config = require('../config/config').get(process.env.NODE_ENV).prefix_api;
const express = require('express');
const locationProfile = require('../controller/locationProfile-ctrl');
var router = express.Router();
router.route('/chk-duplicate').get(locationProfile.chkDuplicate);
module.exports = router;
