module.exports = function (app) {
    var searchCtrl = app.modules.phxpartner.companySearch.searchCtrl;
    var generalviewCtrl = app.modules.phxpartner.companySearch.generalCtrl;
    var addressviewCtrl = app.modules.phxpartner.companySearch.addressCtrl;
    var contactviewCtrl = app.modules.phxpartner.companySearch.contactCtrl;

    // app.post('/api/phxpartner/company/companyProfileList',
    //     searchCtrl.searchCompany
    // );

    // app.post('/api/phxpartner/company/companyInfo',
    //     generalviewCtrl.generalview
    // );

    // app.post('/api/phxpartner/company/companyViewAddress',
    //     addressviewCtrl.addressview
    // );
    
    // app.get('/api/phxpartner/company/contact',
    //     contactviewCtrl.getCompanyContact
    // );

    // app.put('/api/phxpartner/company/contact',
    //     contactviewCtrl.updCompanyContact
    // );
}