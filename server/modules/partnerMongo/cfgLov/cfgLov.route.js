module.exports = function (app) {
    var cfgLov = app.modules.partnerMongo.cfgLov.cfgLovCtrl;

    app.get('/api/phxpartner/lov',
        cfgLov.getLovCriteria
    ); 

    app.get('/api/phxpartner/lov/find-lov',
    cfgLov.findLovCriteria
    );
};