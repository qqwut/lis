module.exports = function (app) {
    var sapCustomerCtrl = app.modules.partner.sap.sapCustomerCtrl;

    app.post('/api/phxpartner/sap/syncSap',
        sapCustomerCtrl.syncSap
    );

    app.get('/api/phxpartner/sap/payDirectVendor/info',
        sapCustomerCtrl.getPayDirectVendor
    );

    app.get('/api/phxpartner/sap/customer/address',
        sapCustomerCtrl.getSapCustomerAddress
    );

    app.get('/api/phxpartner/sap/list',
        sapCustomerCtrl.getSapListInfo
    );
    
    app.post('/api/phxpartner/sap/customer/',
        sapCustomerCtrl.createSapCustomer
    );

    app.get('/api/phxpartner/sap/transaction',
        sapCustomerCtrl.getSapTransactionInfo
    );
    
    app.post('/api/phxpartner/sap/customer',
        sapCustomerCtrl.createSapCustomer
    );

    app.put('/api/phxpartner/sap/customer/change',
        sapCustomerCtrl.changeSapCustomer
    );
    
    app.post('/api/phxpartner/sap/vendor/create',
        sapCustomerCtrl.createSapVendor
    );
    
    app.put('/api/phxpartner/sap/vendor/change',
        sapCustomerCtrl.changeSapVendor
    );

    //app.post('/api/phxpartner/sap/zipcode',
    //    addressCtrl.getZipCode
    //); 

    app.put('/api/phxpartner/sap/customer/change/block',
        sapCustomerCtrl.BlockSapCustomer
    );

    app.post('/api/phxpartner/sap/customer/refCustomer',
        sapCustomerCtrl.refCustomer
    );

    app.delete('/api/phxpartner/sap/customer/refCustomer',
        sapCustomerCtrl.unrefCustomer
    );

    app.get('/api/phxpartner/sap/customer/plantStorage',
        sapCustomerCtrl.getSapPlantAndStorageListInfo
    );

    app.put('/api/phxpartner/sap/customer/plantStorage',
        sapCustomerCtrl.putSapPlantAndStorageListInfo
    );

    app.get('/api/phxpartner/sap/partnerFunctionDelete',
        sapCustomerCtrl.partnerFunctionDelete
    );

    app.get('/api/phxpartner/sap/partnerFunctionInsert',
        sapCustomerCtrl.partnerFunctionInsert
    );

    app.post('/api/phxpartner/sap/customer/changeBlockCustomer',
        sapCustomerCtrl.changeBlockCustomer
    );

    app.get('/api/phxpartner/sap/sameSaleArea',
        sapCustomerCtrl.sameSaleArea
    );
    
    app.put('/api/phxpartner/sap/partySapChangeLicense',
        sapCustomerCtrl.partySapChangeLicense
    );
    
    app.get('/api/phxpartner/location/sap',
        sapCustomerCtrl.getlocationsapByCriteria
    );

    app.get('/api/phxpartner/sap/msgTransaction',
        sapCustomerCtrl.getSapMsgTransection
    );

}