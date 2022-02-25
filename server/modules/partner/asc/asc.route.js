module.exports = function (app) {
  var ascCtrl = app.modules.partner.asc.ascCtrl;

  app.get("/api/phxpartner/asc/list", ascCtrl.getAscList);

  app.get("/api/phxpartner/asc/search-IdNumber", ascCtrl.getIdNumber);

  app.get("/api/phxpartner/asc/ascMobileNumber", ascCtrl.getMobileNumber);

  app.get("/api/phxpartner/asc/accountNumber", ascCtrl.getAccountNumber);

  app.get("/api/phxpartner/asc/position", ascCtrl.getAscPosition);

  app.get("/api/phxpartner/asc/memberCategory", ascCtrl.getMemberCategory);

  app.get("/api/phxpartner/asc/ascPositionId", ascCtrl.getAscPositionId);

  app.post("/api/phxpartner/asc", ascCtrl.Ascpost);

  app.get("/api/phxpartner/asc/profile", ascCtrl.getAscProfile);

  app.get('/api/phxpartner/asc/searchLocation',ascCtrl.searchLocation);

  app.get('/api/phxpartner/asc/info',ascCtrl.getInfoAsc);

  app.get('/api/phxpartner/asc/competency',ascCtrl.getAscCompetency);

  app.put('/api/phxpartner/asc/info',ascCtrl.updAscInfo);

  app.get('/api/phxpartner/asc/chkContactLocation',ascCtrl.chkAscContactLocation);
  
  app.post('/api/phxpartner/asc/contactOm',ascCtrl.postAscContactOm);

  app.get('/api/phxpartner/asc/chkRequiredEmail',ascCtrl.chkRequiredEmail);

  app.get('/api/phxpartner/asc/locationAffiliation', ascCtrl.getLocationAffiliation);

};
