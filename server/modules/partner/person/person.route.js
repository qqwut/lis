module.exports = function (app) {
    var personCtrl = app.modules.partner.person.personCtrl;

    app.get('/api/phxpartner/person/list',
    personCtrl.getPersontList
    );
 
};