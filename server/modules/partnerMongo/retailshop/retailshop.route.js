module.exports = function (app) {
    var retailshopCtrl = app.modules.partnerMongo.retailshop.retailshopCtrl;

    app.get('/api/phxpartner/retail-shop',
        retailshopCtrl.getRetailShopList
    );

    
    app.get('/api/phxpartner/location/retail-shop',
        retailshopCtrl.getRetailShopList
    );

};