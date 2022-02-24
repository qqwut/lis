module.exports = function (app) {
    var locationDraftCtrl = app.modules.partnerMongo.locationDraft.locationDraftCtrl;

    app.get('/api/phxpartner/location-draft',
        locationDraftCtrl.getLocationDraftList
    );

    app.get('/api/phxpartner/location-draft/:id',
        locationDraftCtrl.getLocationDraftById
    );

    app.post('/api/phxpartner/location-draft',
        locationDraftCtrl.addLocationDraft
    );

    app.put('/api/phxpartner/location-draft/:id',
        locationDraftCtrl.updLocationDraft
    );
    
    app.put('/api/phxpartner/location-onestep-draft/:id',
        locationDraftCtrl.updLocationDraftOnestep
    );

    app.delete('/api/phxpartner/location-draft/:id',
        locationDraftCtrl.delLocationDraftById
    );

    app.delete('/draft-delete',
        locationDraftCtrl.draftDelete
    );

   

};