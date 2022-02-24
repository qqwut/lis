module.exports = function (app) {
  var apitest = require('../controller/apitest-ctrl');
  app.get('/api/test/db', apitest.test);
  app.post('/api/test/db', apitest.save);
  app.get('/api/test/importexcel', apitest.importExcel);
};

// "db.userGroup.aggregate([ {
//   $match: {
//     $or: [{
//       groupName_data: {
//         $eq: ""
//         AISSHOPBKK ""
//       }
//     }, {
//       groupName_data: {
//         $eq: ""
//         DSFBBCB ""
//       }
//     }]
//   }
// }, {
//   $lookup: {
//     from: ""
//     mappingCompany "",
//     localField: ""
//     chnSalesCode_key2 "",
//     foreignField: ""
//     chnSalesCode_key1 "",
//     as: ""
//     mapComp ""
//   }
// }, {
//   ""
//   $project "": {
//     ""
//     userGroup "": 1,
//     ""
//     groupName_data "": 1,
//     ""
//     distChnCode_key1 "": 1,
//     ""
//     distChnName_data "": 1,
//     ""
//     chnSalesCode_key2 "": 1,
//     ""
//     chnSaleName_data "": 1,
//     ""
//     retailShop_data "": 1,
//     ""
//     saleSubRegionCode_data "": 1,
//     ""
//     companyAbbr "": ""
//     $mapComp.companyId_key2 ""
//   }
// }
// ]);
// "