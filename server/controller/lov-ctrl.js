/* ------------- [START REQUIRE] ------------ */
const mongoose = require("mongoose");
const async = require('async');
/* ------------- [END REQUIRE] ------------ */
/* ------------- [START INITIAL] ------------ */
// var company = mongoose.model('company');
/* ------------- [END INITIAL] ------------ */
/* ------------- [STRAT IMPLEMENT API] ------------ */
module.exports = {
  getLov: function (req, res) {
    var lovCollection = mongoose.model('lov');
    var result = {
      responseCode: '',
      responseMessage: '',
      responseDescription: []
    }
    lovCollection.find(req.query, function (err, results) {
      if (err) {
        res.json(err);
      } else {
        if (results.length == 0) {
          result.responseCode = 404;
        } else {
          result.responseCode = 200;
        }
        result.responseDescription = results;
        res.json(result);
      }

    });

  },
  getProvince: function (req, res) {
    // getLov
    var lovCollection = mongoose.model('lov');
    var userGroupCollection = mongoose.model('userGroup');
    // console.log('hello');

    async.waterfall([
      myFirstFunction,
      mySecondFunction,
      myLastFunction,
    ], function (err, result) {
      // result now equals 'done'
    });
    function myFirstFunction(callback) {
      console.log('first:');
      callback(null, 'one', 'two');
    }
    function mySecondFunction(arg1, arg2, callback) {
      // arg1 now equals 'one' and arg2 now equals 'two'
      console.log('secound: ' + arg1 + ' ' + arg2);
      callback(null, 'three');
    }
    function myLastFunction(arg1, callback) {
      // arg1 now equals 'three'
      console.log('Last: ' + arg1);
      callback(null, 'done');
    }


  }
}
/* ------------- [END IMPLEMENT API] ------------ */