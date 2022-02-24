/* ------------- [START REQUIRE] ------------ */
const mongoose = require("mongoose");
/* ------------- [END REQUIRE] ------------ */
/* ------------- [START INITIAL] ------------ */
var mappingRegion = mongoose.model('mappingRegion');
/* ------------- [END INITIAL] ------------ */
/* ------------- [STRAT IMPLEMENT API] ------------ */
exports.mappingRegion = function(req, res) {
    var result = {
        responseCode: '',
        responseMessage: '',
        responseDescription: []
    };

    var mgQuery = {
        provinceCode_key0: req.query.provinceCode
    };

    mappingRegion.find(mgQuery).exec(function(err, docs) {
        if (err) {
            // 
        } else {
            if (docs.length == 0) result.responseCode = 404;
            else {
                result.responseCode = 200;
                result.responseDescription = docs;
            }
            res.json(result);
        }
    })
};

module.exports = exports;
/* ------------- [END IMPLEMENT API] ------------ */