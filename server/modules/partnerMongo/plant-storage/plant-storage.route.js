module.exports = function (app) {
    var plantStorageCtrl = app.modules.partnerMongo.plantStorage.plantStorageCtrl;
    
    app.get('/api/phxpartner/sap/customer/plantStorage/plant/list',
        plantStorageCtrl.getSapPlantAllList
    );

    app.get('/api/phxpartner/sap/customer/plantStorage/storage/list',
        plantStorageCtrl.getSapStorageAllList
    );

};