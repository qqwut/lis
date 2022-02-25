module.exports = function (app) {
    var subregionCtrl = app.modules.partnerMongo.subregion.subregionCtrl;

    app.get('/api/phxpartner/sub-region',
        subregionCtrl.getSubRegionList
    );

    app.get('/api/phxpartner/location/sub-region',
        subregionCtrl.getSubRegion
    );

};