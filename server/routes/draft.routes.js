const express = require('express');
const draftCtrl = require('../controller/draft-ctrl');
const { createAccountLimiter } = require('../utils/rate-limit');
const router = express.Router();

router.route('/draft-list').get(createAccountLimiter, draftCtrl.draftList)
router.route('/draft-detail').get(draftCtrl.draftDetail);
router.route('/draft-create').post(draftCtrl.draftCreate);
router.route('/draft-save/:draftId').put(createAccountLimiter, draftCtrl.draftSave);
router.route('/draft-delete').delete(createAccountLimiter, draftCtrl.draftDelete);
module.exports = router;