module.exports = function (app) {
    var openingHoursCtrl = app.modules.partnerMongo.openingHours.openingHoursCtrl;

    app.get('/api/phxpartner/location/openHours/:chnSaleCode',
        openingHoursCtrl.getOpenHour
    );  

};