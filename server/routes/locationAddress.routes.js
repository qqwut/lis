const express = require('express');
const locationAddress = require('../controller/locationAddress-ctrl');
const router = express.Router();
const { createAccountLimiter } = require('../utils/rate-limit');

router.route('/get-address').get(createAccountLimiter, locationAddress.getAddress);
router.route('/draft-delete').delete(createAccountLimiter, draftCtrl.draftDelete);

module.exports = router;