module.exports = function (app) {
    var socialtypeCtrl = app.modules.partnerMongo.socialtype.socialtypeCtrl;

    app.get('/api/phxpartner/social-type',
        socialtypeCtrl.getSocialTypeList
    );

};