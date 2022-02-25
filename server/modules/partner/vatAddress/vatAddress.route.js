module.exports = function (app) {
    var vatAddressCtrl = app.modules.partner.vatAddress.vatAddressCtrl;

    app.get('/api/phxpartner/vat-address/list',
        vatAddressCtrl.getVatAddressList
    );

    app.put('/api/phxpartner/vat-address/list',
        vatAddressCtrl.putVatAddressList
    );

};