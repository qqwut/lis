module.exports = function (app) {
    var userGroupCtrl = app.modules.partnerMongo.userGroup.userGroupCtrl;

    app.get('/select-channel',
        userGroupCtrl.selectChannel
    );

    app.get('/select-channels',
        userGroupCtrl.selectChannels
    );

    app.get('/api/phxpartner/company-abbr',
        userGroupCtrl.getCompanyAbbr
    );

    app.get('/api/phxpartner/location/userGroup',
        userGroupCtrl.getUserGroup
    );

    app.get('/api/phxpartner/location/select-channel',
        userGroupCtrl.getSelectChannel
    );
    
    app.get('/api/phxpartner/location/chk-user-group',
        userGroupCtrl.checkUserGroup
    );


};