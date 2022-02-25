module.exports = function (app) {

    var uploadCtrl = app.modules.downloadFile.downloadFileCtrl

    app.get('/api/phxpartner/downloadFile',
        uploadCtrl.downloadFileExampleLocation
    );

}
