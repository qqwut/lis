module.exports = function (app) {

    var uploadCtrl = app.modules.partnerMongo.upload.uploadCtrl;

    app.post('/api/phxpartner/upload/asc_load_info',
        uploadCtrl.uploadFile
    );

    app.post('/api/phxpartner/upload/asc_load_data',
        uploadCtrl.uploadData
    );

    app.get('/api/phxpartner/upload/resultLoad',
        uploadCtrl.searchResultLoadASC
    );

    app.get('/api/phxpartner/upload/downloadFile',
        uploadCtrl.downloadFileAsc
    );

    app.post('/api/phxpartner/upload/location_load_info',
        uploadCtrl.uploadFileLocation
    );

    app.post('/api/phxpartner/upload/location_load_data',
        uploadCtrl.uploadDataLocation
    );

    app.get('/api/phxpartner/upload/location/resultLoad',
        uploadCtrl.searchResultLoadLocation
    );

    app.get('/api/phxpartner/upload/location/downloadFile',
        uploadCtrl.downloadFileLocation
    );
    
    app.get('/api/phxpartner/location/chkFileExample',
        uploadCtrl.checkFileExampleLocation
    );
};