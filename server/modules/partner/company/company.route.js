module.exports = function (app) {
    var companyCtrl = app.modules.partner.company.companyCtrl;
    app.post('/api/phxpartner/company/companyProfileList',
        companyCtrl.searchCompany
    );

    app.post('/api/phxpartner/company/companyInfo',
        companyCtrl.generalview
    );

    app.get('/api/phxpartner/chk-company',
        companyCtrl.getCompany
    );

    
    app.get('/api/phxpartner/chk-duplicate-email',
        companyCtrl.getCompanyEmail
    );

    app.post('/api/phxpartner/company/createCompany',
        companyCtrl.createCompany
    );

    app.get('/api/phxpartner/company/list',
        companyCtrl.getCompanyListInfo
    );

    app.get('/api/phxpartner/company/search',
        companyCtrl.searchCompanyList
    );

    app.get('/api/phxpartner/company/info',
        companyCtrl.getCompanyInfo
    );

    app.put('/api/phxpartner/company/info',
        companyCtrl.putCompanyInfo
    );
    
};