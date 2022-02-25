module.exports = function (app) {
    var storeMasterCtrl = app.modules.partner.storeMaster.storeMasterCtrl
    app.get('/api/phxpartner/master/store/list',
        storeMasterCtrl.getStoreMaster
    );
    app.get('/api/phxpartner/master/store/checkDup',
        storeMasterCtrl.checkDulpStore
    );
    app.get('/api/phxpartner/master/store/chkRelateStoreLoc',
        storeMasterCtrl.getRelateStoreLoc
    );
    app.put('/api/phxpartner/master/store/info',
        storeMasterCtrl.updateStoreMaster
    );
    app.put('/api/phxpartner/master/store/storeType/info',
        storeMasterCtrl.createStoreType
    );
};