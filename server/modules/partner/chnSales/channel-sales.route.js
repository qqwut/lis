module.exports = function (app) {
    var channelSalesCtrl = app.modules.partner.chnSales.channelSalesCtrl;

    app.get('/api/phxpartner/chnsalegroup/info',
      channelSalesCtrl.getChnSalesGroup
    );

};