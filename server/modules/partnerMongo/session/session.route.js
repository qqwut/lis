module.exports = function (app) {
    var sessionCtrl = app.modules.partnerMongo.session.sessionCtrl;

    app.get('/api/phxpartner/session/check-session',
        sessionCtrl.checkSession
    );

    app.post('/api/phxpartner/session/lock-session',
        sessionCtrl.lockSession
    );

    app.post('/api/phxpartner/session/unlock-session',
        sessionCtrl.unlockSession
    );

    app.post('/api/phxpartner/location/session',
        sessionCtrl.checkSession
    );
    app.delete('/api/phxpartner/location/session',
        sessionCtrl.deleteSession
    );

    app.post('/service/phxpartner/session/session-auth',
        sessionCtrl.createSessionAuthLogin
    );

    app.get('/service/phxpartner/session/session-auth/:id',
        sessionCtrl.getSessionAuthLoginById
    );

    app.put('/service/phxpartner/session/session-auth/:id',
        sessionCtrl.updateSessionAuthLoginById
    );

};