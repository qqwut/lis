module.exports = function (app) {
    var personphonetypeCtrl = app.modules.partnerMongo.personphonetype.personphonetypeCtrl;

    app.get('/api/phxpartner/person-phone-type',
        personphonetypeCtrl.getPersonPhoneTypeList
    );

};