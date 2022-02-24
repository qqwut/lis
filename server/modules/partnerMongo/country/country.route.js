module.exports = function (app) {
    var countryCtrl = app.modules.partnerMongo.country.countryCtrl;

    app.get('/api/phxpartner/country',
        countryCtrl.getCountryList
    );

};