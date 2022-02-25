'use strict';

module.exports = function (app) {
  var val = app.modules.partnerMongo.configMongo.configMongoCtrl;

    app.get('/api/phxpartner/mongo/query-table-list-mongodb',
        val.queryTableListConfigmongo
    );

    app.post('/api/phxpartner/mongo/insert-new-data-mongodb',
        val.insertNewDataConfigmongo
    );

    app.post('/api/phxpartner/mongo/query-string-mongodb',
        val.queryConfigmongo
    );

    

    

    
 
};