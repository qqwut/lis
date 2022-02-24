module.exports = function (app) {
    var distChnCtrl = app.modules.partnerMongo.distChn.distChnCtrl;
    app.get('/api/phxpartner/dist-chn',
        distChnCtrl.getdistChn
    );
    app.get('/api/phxpartner/dist-chn-sap',
        distChnCtrl.getdistChnSap
    );

};