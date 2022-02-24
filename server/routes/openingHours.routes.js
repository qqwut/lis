const express = require('express');
const openingHoursCtrl = require('../controller/openingHours-ctrl');
var router = express.Router();
router.route('/openinghours').get(openingHoursCtrl.openingHours);
module.exports = router;