/* ------------- [START REQUIRE] ------------ */
const mongoose = require("mongoose");
/* ------------- [END REQUIRE] ------------ */
/* ------------- [START INITIAL] ------------ */
var company = mongoose.model('company');
/* ------------- [END INITIAL] ------------ */
/* ------------- [STRAT IMPLEMENT API] ------------ */
exports.company = function(req, res) {
    var result = {
        responseCode: '',
        responseMessage: '',
        responseDescription: []
    };

    if (req.query.companyAbbr && req.query.internalCompanyFlag) {
        result.responseCode = 500;
        result.responseMessage = 'Invalid Parameter';
        res.json(result)
    } else if (req.query.companyAbbr) {
        let pipeline = [{
            $match: {
                companyAbbr_data: req.query.companyAbbr
            }
        }, {
            $project: {
                companyIdNo: "$idNo_data",
                companyTitleTh: "$titleTh_data",
                companyNameTh: "$nameTh_data",
                companyAbbr: "$companyAbbr_data"
            }
        }];

        company.aggregate(pipeline, function(err, docs) {
            if (err) {
                res.json(err);
            } else {
                if (docs.length == 0) result.responseCode = 404;
                else {
                    result.responseCode = 200;
                    result.responseDescription = docs;
                }
                res.json(result);
            }
        });
    } else if (req.query.internalCompanyFlag) {
        let pipeline = [{
                $match: {
                    internalCompanyFlag_data: req.query.internalCompanyFlag
                }
            },
            {
                $project: {
                    companyIdNo: "$idNo_data",
                    companyTitleTh: "$titleTh_data",
                    companyNameTh: "$nameTh_data",
                    companyAbbr: "$companyAbbr_data"
                }
            }
        ];

        company.aggregate(pipeline, function(err, docs) {
            if (err) {
                res.json(err);
            } else {
                if (docs.length == 0) result.responseCode = 404;
                else {
                    result.responseCode = 200;
                    result.responseDescription = docs;
                }
                res.json(result)
            }
        });
    } else {
        res.redirect('/error');
    }

};

module.exports = exports;
/* ------------- [END IMPLEMENT API] ------------ */