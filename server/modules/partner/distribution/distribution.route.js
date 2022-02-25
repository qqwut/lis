module.exports = function (app) {
  var distributionCtrl = app.modules.partner.distribution.distributionCtrl;

  app.get('/api/phxpartner/retailDistributor/info', distributionCtrl.getRetailDistributorInfo);
  app.get('/api/phxpartner/productDistributor/info', distributionCtrl.getProductDistributorInfo);
  app.get('/api/phxpartner/distribution/product/list', distributionCtrl.getProductList);
  app.get('/api/phxpartner/distributor/list', distributionCtrl.getDistributorList);
  app.get('/api/phxpartner/distribution/province/list', distributionCtrl.getProvinceList);
  app.get('/api/phxpartner/onestep/distributor/list', distributionCtrl.getOneStepDistributorList);
  app.put('/api/phxpartner/retailDistributor/info', distributionCtrl.putRetailDistributorInfo);
  app.put('/api/phxpartner/productDistributor/info', distributionCtrl.putProductDistributorInfo);
  app.get('/api/phxpartner/onestep/distributor/list', distributionCtrl.getOneStepDistributorList);
  app.get('/api/phxpartner/productDistributor/retail', distributionCtrl.getRetailProductDistributorInfo);
  app.get('/api/phxpartner/distributionRelation/getOldDistributor', distributionCtrl.getProductOldDistributorInfo)
  app.get('/api/phxpartner/distributionRelation/getNewDistributor', distributionCtrl.getProductNewDistributorInfo)
  app.put('/api/phxpartner/distributionRelation/info', distributionCtrl.putRelationDistributionInfo)
};
