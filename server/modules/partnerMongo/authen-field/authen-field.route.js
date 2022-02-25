module.exports = function (app) {
    var authenFieldCtrl = app.modules.partnerMongo.authenField.authenFieldCtrl;

    app.get('/api/phxpartner/authenfield/get-submenu-authen',
        // authenFieldCtrl.subMenuAuthen
        authenFieldCtrl.checkauthenSubMenu
    );

    app.get('/api/phxpartner/authenfield/get-menu-authen',
        authenFieldCtrl.mainMenuAuthen
    );

    app.get('/api/phxpartner/authenfield/get-authenfields',
        authenFieldCtrl.findAuthenfield
    );
    app.get('/api/phxpartner/get-auth-field',
        authenFieldCtrl.getAuthorizeField
    );
    app.get('/api/phxpartner/location/authenfield/:chnSaleCode/:pageKey',
        authenFieldCtrl.getAuthenFieldBychnKey
    );

    app.get('/api/phxpartner/authenfield/chk-editbtn',
        authenFieldCtrl.getAuthorizeEditbtn 
    );

    app.get('/api/phxpartner/authenfield/accNoBankFullPrivacy',
        authenFieldCtrl.getAuthorizeAccNoBankFullPrivacy
    );
}