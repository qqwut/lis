module.exports = function (app) {
    var locationCtrl = app.modules.partner.location.locationCtrl;

    app.get('/api/phxpartner/location/list',
      locationCtrl.getLocationList
    );

    app.get('/api/phxpartner/location/list/asc',
      locationCtrl.getLocationList
    );

    app.post('/api/phxpartner/location',
      locationCtrl.createLocation
    );

    // app.get('/api/phxpartner/location/list',
    //   locationCtrl.getListLocation
    // );
    
    app.get('/api/phxpartner/location/info',
      locationCtrl.getInfoLocation
    );

    app.put('/api/phxpartner/location/info',
    locationCtrl.upd
     );

    app.get('/api/phxpartner/location/profile',
      locationCtrl.getProfileLocation
    );

    app.get('/api/phxpartner/sap/payDirectVendor/info',
      locationCtrl.getSapPayDirectInfo
    );

    app.get('/api/phxpartner/headQuater/info',
      locationCtrl.getHeadQuater
    );

    app.get('/api/phxpartner/location/countLocation',
      locationCtrl.getCountLocation
    );

    app.post('/api/phxpartner/location/changeLicense',
      locationCtrl.changeLicense
    );
    app.get('/api/phxpartner/location/getBranchOutlet/info',
      locationCtrl.getBranchOutlet
    );

    app.get('/api/phxpartner/location/chkContactOm',
      locationCtrl.chkContactOm
    );

    app.get('/api/phxpartner/location/getHqLocationAbbr',
      locationCtrl.getHqLocationAbbr
    );

    
};