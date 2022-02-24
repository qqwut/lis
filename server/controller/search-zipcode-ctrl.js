/* ------------- [START REQUIRE] ------------ */
const mongoose = require("mongoose");
const async = require('async');
// const _ = require('underscore');
/* ------------- [END REQUIRE] ------------ */
/* ------------- [START INITIAL] ------------ */
var zipCodeModel = mongoose.model('zipCode');
/* ------------- [END INITIAL] ------------ */
/* ------------- [STRAT IMPLEMENT API] ------------ */
module.exports = {
  searchZipCode : function(req, res, next) {
    var result = {
      responseCode: '',
      responseMessage: '',
      responseDescription: []
    };
    var zipCodeCollection = mongoose.model('zipCode');
    // console.log(req.query);
    // console.log({zipCode_key2:{ $regex: '.*' + req.query.zipCode_key2 + '.*' }} );

    var filter = [];

    if(req.query && (req.query.amphurTh || req.query.province || req.query.tumbolTh || req.query.zipCode)){
      if(req.query.amphurTh){ filter.push({amphurTh_key3: {$regex: '' + req.query.amphur + '.*' }}); }
      if(req.query.province){ filter.push({provinceCode_key1: {$regex: '' + req.query.province + '.*' }}); }
      if(req.query.tumbolTh){ filter.push({tumbolTh_key4: {$regex: '' + req.query.tumbolTh + '.*' }}); }
      if(req.query.zipCode){ filter.push({zipCode_key2: {$regex: '' + req.query.zipCode + '.*' }}); }
    }


        let pipeline = [{
          $match: {$and: [
            // {tumbolTh_key4: req.query.tumbonTh ? { $regex: '' + req.query.tumbonTh + '.*', $options: 'i' } : undefined} ,
            // {provinceCode_key1: req.query.province ? {$regex: '' + req.query.province + '.*', $options: 'i' } : undefined} ,
            req.query.amphur ? { amphurTh_key3:  {$regex: '' + req.query.amphur + '.*' } } : undefined ,
            // {zipCode_key2: req.query.zipCode  ? {$regex: '' + req.query.zipCode + '.*', $options: 'i' } : undefined} ,
          ]}
        }, {
          $project: {
            "zipCode": "$zipCode_key2",
            "tumbolTh": "$tumbolTh_key4",
            "amphurTh": "$amphurTh_key3",
            "province": "$provinceCode_key1"
          }
        }];

    // query = {
    //   zipCode_key2:{ $regex: '/^' + req.query.zipCode_key2 + './'} ,
    //   provinceCode_key1:{$regex: '/^' + req.query.provinceCode_key1 + '/'},
    //   amphurTh_key3:{$regex: '/^' + req.query.amphurTh_key3 + '/' },
    //   tumbolTh_key4:{$regex: '/^' + req.query.tumbolTh_key4 + '/' },
    // };
    
    console.dir(JSON.stringify(pipeline));
    zipCodeCollection.aggregate( pipeline , function(err, docs) { 
        if (err) {
          res.json(err);
        } else {
          result.responseCode = 200;
          result.responseDescription = docs;
          res.json(result)
        }
    });
  }
}

/* ------------- [END IMPLEMENT SEARCH] ------------ */