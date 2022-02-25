module.exports = function (app) {
    var historyCtrl = app.modules.partnerMongo.lovHistory.lovHistoryCtrl;

    app.get('/api/phxpartner/history/lov-filterby',
        historyCtrl.gethistoryLocFilterByList
    );

    app.get('/api/phxpartner/history/lov-sortby',
        historyCtrl.getHistoryLocSortByList
    );
    
    app.get('/api/phxpartner/history/lov-display',
        historyCtrl.getHistoryLocDisplay
);

    app.get('/api/phxpartner/history/lov-display',
        historyCtrl.getHistoryLocSortByList
    );

};