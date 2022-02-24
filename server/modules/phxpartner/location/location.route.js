module.exports = function (app) {
    var locationCtrl = app.modules.phxpartner.location.locationCtrl;
    //var infoCtrl = app.modules.phxpartner.location.infoCtrl;
    // var historyCtrl = app.modules.phxpartner.location.historyCtrl;

    // app.get('/api/phxpartner/location/draft',
    //     locationCtrl.getLocationDraftList
    // );

    // app.get('/api/phxpartner/location/draft/:id',
    //     locationCtrl.getLocationDraftById
    // );

    // app.post('/api/phxpartner/location/draft',
    //     locationCtrl.addLocationDraft
    // );

    // app.put('/api/phxpartner/location/draft/:id',
    //     locationCtrl.updLocationDraft
    // );

    // app.delete('/api/phxpartner/location/draft/:id',
    //     locationCtrl.delLocationDraftById
    // );


    // app.get('/api/phxpartner/company',
    //     locationCtrl.getCompany
    // );

    // app.get('/api/phxpartner/location/userGroup',
    //     locationCtrl.getUserGroup
    // );

    // app.get('/api/phxpartner/location/openHours/:chnSaleCode',
    //     locationCtrl.getOpenHour
    // );

    // app.get('/api/phxpartner/location/mappingRegion/:provinceCode',
    //     locationCtrl.getRegion
    // );

    // app.get('/api/phxpartner/location/chk-region/:subRegion',
    //     locationCtrl.mappingRegion
    // );

    // app.get('/api/phxpartner/location/province',
    //     locationCtrl.getProvince
    // );

    // app.get('/api/phxpartner/location/zipcode',
    //     locationCtrl.getZipCode
    // );

    // app.get('/api/phxpartner/location/sub-region',
    //     locationCtrl.getSubRegion
    // );

    // app.get('/api/phxpartner/location/select-channel',
    //     locationCtrl.getSelectChannel
    // );

    // app.get('/api/phxpartner/location/retail-shop',
    //     locationCtrl.getRetailShopList
    // );

    // app.get('/api/phxpartner/location/authenfield/:chnSaleCode/:pageKey',
    //     locationCtrl.getAuthenField
    // );

    app.get('/api/phxpartner/location/chk-duplicate',
        locationCtrl.chkDupName
    );

    app.get('/api/phxpartner/location/chk-mobile',
        locationCtrl.chkDupMobile
    );

    app.get('/api/phxpartner/location/chkOldLocation',
        locationCtrl.chkOldLocation
    )

    // app.get('/api/phxpartner/location/chk-user-group',
    //     locationCtrl.checkUserGroup
    // );

    // app.post('/api/phxpartner/location/session',
    //     locationCtrl.checkSession
    // );

    // app.delete('/api/phxpartner/location/session',
    //     locationCtrl.deleteSession
    // );

    app.post('/api/phxpartner/location/search',
        locationCtrl.searchLocation
    );

    // app.post('/api/phxpartner/location/:id',
    //     locationCtrl.addLocation
    // );

    // app.get('/api/phxpartner/location/chk-user-group',
    //     locationCtrl.checkUserGroup
    // );

    app.get('/api/phxpartner/vanDistribution/info',
        locationCtrl.getLocationVan
    );
    app.get('/api/phxpartner/hubDistribution/info',
        locationCtrl.getLocationHub
    );
    ///phxPartner/v1/hubDistribution/info.json?filter=(&(distLocationCode=$value)(subRegion=$value))

    app.put('/api/phxpartner/hubDistribution/info',
        locationCtrl.updLocationHubDistribution
    );
    app.put('/api/phxpartner/vanDistribution/info',
        locationCtrl.updLocationVanDistribution
    );

    app.get('/api/phxpartner/distribution/product/list',
        locationCtrl.getDistributionProductList
    );

    app.get('/api/phxpartner/distribution/hubDistribution/list',
        locationCtrl.getHubDistributionList
    );
    app.get('/api/phxpartner/distribution/vanDistribution/list',
        locationCtrl.getVanDistributionList
    );

    app.get('/api/phxpartner/location/mobileContact',
        locationCtrl.getMobileContact
    )

    app.post('/api/phxpartner/location/test-user-login',
    locationCtrl.testUserLogin
    );

    app.get('/api/phxpartner/location/userLoginConfig',
        locationCtrl.getUserloginConfix
    )

    app.get('/api/phxpartner/userlogin/info',
        locationCtrl.getUserloginInfo
    )

    app.put('/api/phxpartner/userlogin/info',
        locationCtrl.updUserloginInfo
    )

    app.get('/api/phxpartner/userlogintransaction/info',
        locationCtrl.getUserloginTransactionInfo
    )

    
    app.get('/api/phxpartner/userlogindefault/info',
        locationCtrl.getUserloginDefaultInfo
    )
    
    app.get('/api/phxpartner/userlogin/count',
        locationCtrl.getCountUserlogin
    )

};