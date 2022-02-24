module.exports = function (app) {
    var authCtrl = app.modules.authen.authenCtrl;

    app.post('/user/authenticate',
        authCtrl.authenticate
    );

    app.post('/service/auth/oauth2',
        authCtrl.oauth2
    );

    app.post('/service/auth/login',
        authCtrl.login
    );

    app.post('/service/auth/refreshToken',
        authCtrl.refreshToken
    );

    app.get('/service/auth/menus',
        authCtrl.getMenus
    );
    
    // new login for load balance
    app.post('/api/phxpartner/auth/session',
        authCtrl.createSession
    );
    app.get('/api/phxpartner/auth/session',
        authCtrl.checkDupSession
    );
};
