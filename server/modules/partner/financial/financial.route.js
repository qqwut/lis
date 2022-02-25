module.exports = function (app) {
    var financialCtrl = app.modules.partner.financial.financialCtrl;

    app.get('/api/phxpartner/financial/list',
        financialCtrl.getfinancialList
    );
    app.get('/api/phxpartner/financial/info',
        financialCtrl.getfinancialInfo
    );
    app.get('/api/phxpartner/financialASC/info',
        financialCtrl.getfinancialASCInfo
    );
    app.get('/api/phxpartner/financial/checkAccount',
        financialCtrl.checkAccount
    );  
    app.put('/api/phxpartner/financial/info',
        financialCtrl.updFinancialInfo
    );
    app.get('/api/phxpartner/financial/checkAccountNo',
        financialCtrl.checkAccountNo
    );
    app.get('/api/phxpartner/financial/checkStatusSapVendor',
        financialCtrl.checkStatusVendor
    );
    app.get('/api/phxpartner/financial/checkWTAddress',
        financialCtrl.checkWTAddress
    );
    app.get('/api/phxpartner/financial/bankInfoHq',
        financialCtrl.bankInfoHq
    );
    app.get('/api/phxpartner/financial/bankInfoHqVendor',
        financialCtrl.bankInfoHqVendor
    );
    app.get('/api/phxpartner/financial/checkBankActive',
        financialCtrl.checkBankActive
    );
    app.get('/api/phxpartner/financial/checkSapVendor',
        financialCtrl.checkSapVendor
    );
    app.get('/api/phxpartner/financial/checkBankRequire',
        financialCtrl.checkBankRequire
    );
    
};