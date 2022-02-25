module.exports = function (app) {
    var shopsegmentCtrl = app.modules.partnerMongo.shopsegment.shopsegmentCtrl;

    app.get('/api/phxpartner/shop-segment',
        shopsegmentCtrl.getshopsegmentList
    );

};