module.exports = function (app) {
    var chnphonetypeCtrl = app.modules.partnerMongo.chnphonetype.chnphonetypeCtrl;

    app.get('/api/phxpartner/chn-phone-type',
        chnphonetypeCtrl.getChnPhoneTypeList
    );

};