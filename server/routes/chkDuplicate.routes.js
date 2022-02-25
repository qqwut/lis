// const config = require('../config/config').get(process.env.NODE_ENV).prefix_api;
const express = require('express');
const chkDuplicateCtrl = require('../controller/chkDuplicate-ctrl');
var router = express.Router();
router.route('/chk-duplicate').get(chkDuplicateCtrl.chkDuplicate);
module.exports = router;