module.exports = function (app) {
    var locationDraftCtrl = app.modules.phxpartner.locationDraft.locationDraftCtrl;

    app.get('/api/phxpartner/company/chk-duplicate',
        locationDraftCtrl.getCheckDup
    );

    app.get('/api/phxpartner/company/chk-duplicate-abbr',
        locationDraftCtrl.getCheckDupAbbr
    );

    // app.get('/api/phxpartner/location-draft',
    //     locationDraftCtrl.getLocationDraftList
    // );

    // app.get('/api/phxpartner/location-draft/:id',
    //     locationDraftCtrl.getLocationDraftById
    // );

    // app.post('/api/phxpartner/location-draft',
    //     locationDraftCtrl.addLocationDraft
    // );

    // app.put('/api/phxpartner/location-draft/:id',
    //     locationDraftCtrl.updLocationDraft
    // );

    // app.delete('/api/phxpartner/location-draft/:id',
    //     locationDraftCtrl.delLocationDraftById
    // );

   

};