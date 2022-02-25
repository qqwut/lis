/* ------------- [START REQUIRE] ------------ */
const axios = require('axios');
/* ------------- [END REQUIRE] ------------ */
/* ------------- [START INITIAL] ------------ */
/* ------------- [END INITIAL] ------------ */
/* ------------- [STRAT IMPLEMENT API] ------------ */
module.exports = {
  chkDuplicate: function (req, res) {
    var query = req.query;
    if (query.nameEn) {
      axios.get('http://25.27.7.151:21300/phxPartnerBE/v1/partnerProfile/location/name.json?filter=(&(companyId=C0000000001)' + '(nameEn=' + query.nameEn + '))', {})
        .then(function (response) {
          res.json(response.data);
          // res.json(response);
          // console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }
}
/* ------------- [END IMPLEMENT API] ------------ */