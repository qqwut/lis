module.exports = function (app) {
    var statustypeCtrl = app.modules.partnerMongo.statustype.statustypeCtrl;

    app.get('/api/phxpartner/status-type',
        statustypeCtrl.getStatusTypeList
    );

};