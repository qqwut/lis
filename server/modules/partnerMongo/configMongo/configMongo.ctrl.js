
let QueryTableName = require('./service/configMongoQuery.js');
let InsertNewData = require('./service/configMongoQuery.js');
let QueryMongoDBService = require('./service/configMongoQuery.js');

exports.queryTableListConfigmongo = (req, res ,next)=>{
    let testCaseName = req.query.testCaseName;
    QueryTableName.queryMasterData(testCaseName, req.body ).then(response=>{
        let resToAg = {data: response}
        res.json(resToAg);
    })
    .catch(e=>{
        next( new Error(e) )
    })
}

exports.insertNewDataConfigmongo = (req, res ,next)=>{
    let payLoad = req.body
    console.log(payLoad)
    let testCaseName = req.query.testCaseName;
    InsertNewData.insertNewData(testCaseName, payLoad ).then(response=>{
       let resToAg = {data: response}
       res.json(resToAg);
    })
    .catch(e=>{
      next( new Error(e) )
    })
}

exports.queryConfigmongo = (req, res ,next)=>{
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };
    let payLoad = req.body 
    let testCaseName = req.query.testCaseName;
    QueryMongoDBService.ConfigmongodbSer(testCaseName, payLoad).then(response=>{
       let resToAg = {data: response}
       ret.responseCode = 200;
       ret.responseMessage = 'Success'
       ret.data = resToAg.data
       res.json(ret);
    })
    .catch(e=>{
        ret.responseCode = 500;
        ret.responseMessage = 'Fail'
        res.json(ret);
        next( new Error(e) )
    })
  }