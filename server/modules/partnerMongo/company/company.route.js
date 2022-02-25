module.exports = function (app) {
    var companyCtrl = app.modules.partnerMongo.company.companyCtrl;
    app.get('/api/phxpartner/company',
        companyCtrl.getCompany
    );
}