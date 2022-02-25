module.exports = function (app) {
    var addressCtrl = app.modules.phxpartner.location.addressCtrl;

    // app.get('/api/phxpartner/location/search-address',
    //     addressCtrl.getAddress
    // );
     app.get('/api/phxpartner/location/:id/address',
         addressCtrl.getLocationAddress
     );

    // app.put('/api/phxpartner/location/:id/address',
    //     addressCtrl.updLocationAddress
    // );

};