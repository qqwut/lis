module.exports = function (app) {
    var informationCtrl = app.modules.phxpartner.location.informationCtrl;

    app.get('/api/phxpartner/information/info',
        informationCtrl.getLocationInformation
    );

    app.get('/api/phxpartner/storeMaster/list',
        informationCtrl.getStoreMaster
    );

    app.get('/api/phxpartner/branchMaster/list',
        informationCtrl.getBranchMaster
    );

    app.get('/api/phxpartner/creditCardMaster/list',
        informationCtrl.getCreditCardsMaster
    );

    app.get('/api/phxpartner/information/getShopName/info',
        informationCtrl.getShopName
    );

    app.put('/api/phxpartner/information/info',
        informationCtrl.putLocationInformation
    );

    
    
};