module.exports = function (app) {
    var bankInfoCtrl = app.modules.partnerMongo.bankinfo.bankinfoCtrl;

    app.get('/api/phxparner/bankinfo/search',
        bankInfoCtrl.getBankinfo
    );

    app.get('/api/phxparner/bankinfo/bank',
        bankInfoCtrl.getBankinfoCode
    );

};