/* ------------- [START REQUIRE] ------------ */
const mongoose = require("mongoose");
/* ------------- [END REQUIRE] ------------ */
/* ------------- [START INITIAL] ------------ */
var openingHours = mongoose.model('openingHours');
/* ------------- [END INITIAL] ------------ */
/* ------------- [STRAT IMPLEMENT API] ------------ */
module.exports = {
    openingHours: function (req, res) {
        console.log("hello: "+req.query.chnSaleCode)
        var result = {
            responseCode: '',
            responseMessage: '',
            responseDescription: []
        };

        if (req.query.chnSaleCode) {
            var pipeline = [{
                $match: {
                     
                         chnSalesGrp_data: { $eq:req.query.chnSaleCode }  
                    
                }
            }, {
                $project: {
                    dayOfWeek_data: 1,
                    timeOpen_data: 1,
                    timeClose_data: 1
                }
            }]

            openingHours.aggregate(pipeline, function (err, results ){
                 
                if (err) {
                    res.json(result)
                } else {
                     if (results.length == 0) {
                        result.responseCode = 404;
                        result.responseMessage = 'Not found';
                    } else{
                        result.responseCode = 200;
                        result.responseMessage = "Success"
                        result.responseDescription = results;
                    }
                     res.json(result)
                }
            });

        } else {
            res.redirect('/error');
        }


    }
}
/* ------------- [END IMPLEMENT API] ------------ */