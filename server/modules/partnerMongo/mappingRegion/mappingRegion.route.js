module.exports = function (app) {
    var mappingRegionCtrl = app.modules.partnerMongo.mappingRegion.mappingRegionCtrl;

    app.get('/api/phxpartner/location/chk-region/:subRegion',
        mappingRegionCtrl.mappingRegion
    );

    app.get('/api/phxpartner/mappingRegion/getSapSalesArea',
        mappingRegionCtrl.getSapSalesArea
    );

};