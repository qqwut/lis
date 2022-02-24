module.exports = function (app) {
    var profileCtrl = app.modules.phxpartner.company.profileCtrl;
    var addressCtrl = app.modules.phxpartner.company.addressCtrl;
    var companyCtrl = app.modules.phxpartner.company.companyCtrl;

    // app.get('/api/phxpartner/chk-company',
    //     profileCtrl.getCompany
    // );

    // app.get('/api/phxpartner/chk-duplicate-email',
    //     profileCtrl.getCompanyEmail
    // );

    // app.get('/api/phxpartner/company/zipcode',
    //     addressCtrl.getZipCode
    // );

    // app.get('/api/phxpartner/company/province',
    //     addressCtrl.getProvince
    // );

    // app.post('/api/phxpartner/company/createCompany',
    //     companyCtrl.createCompany
    // );
}