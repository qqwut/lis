module.exports = function (app) {
    var requestFlowCtrl = app.modules.partner.requestFlow.requestFlowCtrl
    app.get('/api/phxpartner/master/store/storebranch/list',
        requestFlowCtrl.getStoreBranchList
    );
};