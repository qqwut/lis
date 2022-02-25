/* ------------- [START REQUIRE] ------------ */
const request = require('request');
// const _ = require('lodash');
const mongoose = require("mongoose");
/* ------------- [END REQUIRE] ------------ */
/* ------------- [START INITIAL] ------------ */
// var tempLocationData = require('./tempLocationData.js');
/* ------------- [END INITIAL] ------------ */
/* ------------- [STRAT IMPLEMENT API] ------------ */

module.exports = {
getCountry :function(req, res, next) {
  request('https://restcountries.eu/rest/v2/all', function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var parsed = JSON.parse(body);
      res.json(parsed);
    } else {z
      console.log('get country data not found')
      res.json([]);
    }
  });

},

 getProvince : function(req, res, next) {
  var tempData = tempLocationData.locationData;
  console.log(tempData);
},
/* ------------- [END IMPLEMENT API] ------------ */

 getAddress : function(req, res, next) {
  var zipCodeCollection = mongoose.model('zipCode');
  // console.log(req.query);
  // console.log({zipCode_key2:{ $regex: '.*' + req.query.zipCode_key2 + '.*' }} );

  query = {
    zipCode_key2:{ $regex: '.*' + req.query.zipCode_key2 + '.*', $options: 'i'} ,
    provinceCode_key1:{$regex: '.*' + req.query.provinceCode_key1 + '.*', $options: 'i'},
    amphurTh_key3:{$regex: '.*' + req.query.amphurTh_key3 + '.*' , $options: 'i'},
    tumbolTh_key4:{$regex: '.*' + req.query.tumbolTh_key4 + '.*' , $options: 'i'},
  };
  
  console.log(query);
   zipCodeCollection.find( query , function(err, docs) { 
    if (err) {
      res.json(err);
    } else {
      res.json(docs);
    }
  });
}
}