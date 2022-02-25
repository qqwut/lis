// /* ------------- [START REQUIRE] ------------ */
// const moment = require('moment');
// const alasql = require('alasql');
// const fs = require('fs');
// const path = require('path');
// /* ------------- [END REQUIRE] ------------ */
// /* ------------- [START INITIAL] ------------ */
// const db = new alasql.Database();
// // const navigatorFile = path.join(__dirname, '../excel/navigator.xlsx');
// /* ------------- [END INITIAL] ------------ */
// /* ------------- [START FUNCTION] ------------ */
// var result = [{
//   name: 'nat',
//   address: [
//     'Thailand',
//     'Russia'
//   ],
//   phone: ['1234567890', '1112223334']
// }];
// exports.initialData = function() {
//   console.log('Inital');
//   const dateFormat = moment().format('YYYYMMDD_HHmmss');
//   const name = 'export_' + dateFormat;
//   const filePath = path.join(__dirname, `../excel/${name}.xlsx`);
//   fs.closeSync(fs.openSync(filePath, 'w'));
//   console.log(`Created File as ${name}.xlsx`);
//   alasql.promise(`SELECT * INTO XLSX("${filePath}",{headers:true}) FROM ?`, [result])
//     .then(function(data) {
//       console.log('Data saved');
//     }).catch(function(err) {
//       console.log('Error:', err);
//     });
// };
// /* ------------- [END FUNCTION] ------------ */
//
// /* ------------- [START FUNCTION] ------------ */
// // function queryDB(path) {
// //   alasql([`SELECT * FROM XLSX("${navigatorFile}") where URL = '${path}'`])
// //     .then(function(res) {
// //       console.log(res);
// //       return res;
// //       // console.log(res); // output depends on mydata.xls
// //     }).catch(function(err) {
// //       console.log('Error:', err);
// //     });
// //
// //   // alasql(`SELECT * FROM XLSX("${navigatorFile}") where URL = '${path}'`)
// //   //   .then(function(data) {
// //   //     console.log(data);
// //   //     return data;
// //   //   }).catch(function(err) {
// //   //     console.log('Error:', err);
// //   //     return err;
// //   //   });
// // }
// //
//
// //
// // exports.query = function(path) {
// //   console.log('Start query');
// //   alasql([`SELECT * FROM XLSX("${navigatorFile}") where URL = '${path}'`])
// //     .then(function(res) {
// //       // console.log(res);
// //       return res;
// //       // console.log(res); // output depends on mydata.xls
// //     }).catch(function(err) {
// //       console.log('Error:', err);
// //     });
// //   // return queryDB(path);
// // };
// // /* ------------- [END FUNCTION] ------------ */
// //
// //
// // // var ourdatabase = {
// // //   initialData: function() {
// // //     console.log('START Mount ALA-DB');
// // //     alasql.promise(`SELECT * FROM XLSX("${navigatorFile}")`)
// // //       .then(function(data) {
// // //         // console.log(data);
// // //       }).catch(function(err) {
// // //         console.log('Error:', err);
// // //       });
// // //     console.log('END Mount ALA-DB');
// // //   },
// // //   query: function(path) {
// // //     // var resSync = alasql(`SELECT * FROM XLSX("${navigatorFile}") where URL = '${path}'`, function(data) {
// // //     //   console.log(data);
// // //     //   return data;
// // //     // });
// // //
// // //     alasql.promise(`SELECT * FROM XLSX("${navigatorFile}") where URL = '${path}'`)
// // //       .then(function(data) {
// // //         // console.log(data);
// // //         return data;
// // //       }).catch(function(err) {
// // //         // console.log('Error:', err);
// // //         return err;
// // //       });
// // //   },
// // // };
// //
// // // module.exports = ourdatabase;
