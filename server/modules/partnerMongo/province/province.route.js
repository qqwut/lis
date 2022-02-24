module.exports = function (app) {
    var provinceCtrl = app.modules.partnerMongo.province.provinceCtrl;

    app.get('/api/phxpartner/location/province',
        provinceCtrl.getProvince
    );

    app.get('/api/phxpartner/company/province',
        provinceCtrl.getProvinceCompany
    );
    
    app.get('/api/phxpartner/province/list',
        provinceCtrl.getProvinceAll
    );

    app.get('/api/phxpartner/sap/province',
        provinceCtrl.getProvinceSap
    );

};