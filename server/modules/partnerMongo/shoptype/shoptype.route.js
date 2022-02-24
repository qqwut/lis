module.exports = function (app) {
    var shoptypeCtrl = app.modules.partnerMongo.shoptype.shoptypeCtrl;

    app.get('/api/phxpartner/shop-type',
        shoptypeCtrl.getShopTypeList
    );

};