module.exports = function (app) {
    var shopareaCtrl = app.modules.partnerMongo.shoparea.shopareaCtrl;

    app.get('/api/phxpartner/shop-area',
        shopareaCtrl.getShopAreaList
    );

};