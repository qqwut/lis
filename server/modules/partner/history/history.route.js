module.exports = function (app) {
    var historyCtrl = app.modules.partner.history.historyCtrl;

    app.get('/api/phxpartner/history',
        historyCtrl.getHistory
    );
};