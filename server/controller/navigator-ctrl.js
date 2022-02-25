/* ------------- [START REQUIRE] ------------ */
const alasql = require('alasql');
const fs = require('fs');
const path = require('path');
/* ------------- [END REQUIRE] ------------ */
/* ------------- [START INITIAL] ------------ */
const db = new alasql.Database();
const navigatorFile = path.join(__dirname, '../excel/navigator.xlsx');
/* ------------- [END INITIAL] ------------ */
/* ------------- [STRAT IMPLEMENT SEARCH] ------------ */
exports.search = function(req, res) {
  var queryUrl = req.query.url;
  alasql.promise(`SELECT * FROM XLSX("${navigatorFile}") where URL = '${queryUrl}'`)
    .then(function(data) {
      // console.log(data);
      res.json(data);
    }).catch(function(err) {
      // console.log('Error:', err);
      res.json(err);
    });
};
/* ------------- [END IMPLEMENT SEARCH] ------------ */
