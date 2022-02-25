module.exports = function (app) {
    var regionCtrl = app.modules.partnerMongo.region.regionCtrl;

    app.get('/api/phxpartner/region',
        regionCtrl.getRegionList
    );

    app.get('/api/phxpartner/location/mappingRegion/:provinceCode',
        regionCtrl.getRegion
    );

};