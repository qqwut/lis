module.exports = function (app) {
    var idtypeCtrl = app.modules.partnerMongo.idtype.idtypeCtrl;

    app.get('/api/phxpartner/id-type',
        idtypeCtrl.getIdTypeList
    );

};