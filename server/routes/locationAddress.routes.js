const locationAddress = require('../controller/locationAddress-ctrl');
var router = express.Router();

router.route('/get-address').get(function (req, res) {
    locationAddress.getAddress(req, res)
});
// router.route('/draft-delete').delete(draftCtrl.draftDelete);
module.exports = router;