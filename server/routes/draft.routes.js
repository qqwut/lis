// module.exports = function () {
//   const config = require('../config/config').get(process.env.NODE_ENV).prefix_api;
//   var draftCtrl = require('../controller/draft-ctrl');
//   router.get('/draft-list', draftCtrl.draftList);
//   app.delete('/draft-delete', draftCtrl.draftDelete);
//   // app.delete(config + '/draft/delete-draft', draftCtrl.deleteDraft);
// };

// const config = require('../config/config').get(process.env.NODE_ENV).prefix_api;
const express = require('express');
const draftCtrl = require('../controller/draft-ctrl');
var router = express.Router();
router.route('/draft-list').get((req, res) => {
    draftCtrl.draftList(req, res)
})
router.route('/draft-detail').get(draftCtrl.draftDetail);
router.route('/draft-create').post(draftCtrl.draftCreate);
router.route('/draft-save/:draftId').put(draftCtrl.draftSave);
router.route('/draft-delete').delete(draftCtrl.draftDelete);
module.exports = router;