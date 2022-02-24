module.exports = function (app) {
    var addresstypeCtrl = app.modules.partnerMongo.addresstype.addresstypeCtrl;

    app.get('/api/phxpartner/address-type',
        addresstypeCtrl.getAddressTypeList
    );

};