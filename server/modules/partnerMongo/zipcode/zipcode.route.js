module.exports = function (app) {
    var zipcodeCtrl = app.modules.partnerMongo.zipcode.zipcodeCtrl;

    app.get('/api/phxpartner/location/zipcode',
        zipcodeCtrl.getZipCode
    );

    app.get('/api/phxpartner/company/zipcode',
        zipcodeCtrl.getZipCodeCompany
    );

    app.get('/api/phxpartner/asc/zipcode-all',
        zipcodeCtrl.getZipCodeALL
    );

    app.get('/api/phxpartner/sap/zipcode',
        zipcodeCtrl.getZipCodeSap
    );

    

};