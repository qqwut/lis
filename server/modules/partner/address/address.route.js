module.exports = function (app) {
    var addressCtrl = app.modules.partner.address.addressCtrl;

    app.get('/api/phxpartner/address/list',
        addressCtrl.getAddressList
    );

    app.get('/api/phxpartner/address/search-address',
        addressCtrl.searchAddress
    );

    app.put('/api/phxpartner/address/list',
        addressCtrl.putAddressList
    );
};