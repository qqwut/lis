/* ------------- [START REQUIRE] ------------ */
const mongoose = require("mongoose");
const async = require('async');
// const _ = require('underscore');
/* ------------- [END REQUIRE] ------------ */
/* ------------- [START INITIAL] ------------ */
var userGroupModel = mongoose.model('userGroup');
/* ------------- [END INITIAL] ------------ */
/* ------------- [STRAT IMPLEMENT API] ------------ */
module.exports = {
  selectChannel: function (req, res) {
    var result = {
      responseCode: '',
      responseMessage: '',
      responseDescription: []
    }
    var query = req.query;
    var userGroup = query.userGroupAuth.split(",");
    var userAllGroup = []
    if (userGroup.indexOf('ADMIN') < 0) {
      for (var index = 0; index < userGroup.length; index++) {
        if (userGroup[index].length > 0) {
          var element = {
            'groupName_data': {
              $eq: userGroup[index]
            }
          }
          userAllGroup.push(element);
        }
      }
    }
    var pipeline = [{
      $lookup: {
        from: "mappingCompany",
        localField: "chnSalesCode_key2",
        foreignField: "chnSalesCode_key1",
        as: "mapComp"
      }
    }, {
      $group: {
        _id: "$distChnCode_key1",
        distChn: {
          $addToSet: {
            code: "$distChnCode_key1",
            name: "$distChnName_data"
          }
        },
        chnSales: {
          $addToSet: {
            code: "$chnSalesCode_key2",
            name: "$chnSaleName_data",
            companyAbbr: "$mapComp.companyAbbr_key2"
          }
        }
      }
    }, {
      $project: {
        _id: 1,
        distChn: 1,
        chnSales: 1
      }
    }];
    if (userAllGroup.length > 0) {
      pipeline.unshift({
        $match: {
          $or: userAllGroup
        }
      });
    }

    userGroupModel.aggregate(pipeline, function (err, results) {
      if (err) {
        res.json(err);
      } else {
        result.responseCode = 200;
        result.data = results
        result.responseDescription = 'success';
        res.json(result)
      }
    })

  }
}

/* ------------- [END IMPLEMENT SEARCH] ------------ */