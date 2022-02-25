module.exports = function (app) {
    var infoCtrl = app.modules.phxpartner.location.infoCtrl;      
    
     app.get('/api/phxpartner/location/:id/info',
         infoCtrl.getInfo
     );

    // app.put('/api/phxpartner/location/:id/info',
    //     infoCtrl.upd
    // );
}
