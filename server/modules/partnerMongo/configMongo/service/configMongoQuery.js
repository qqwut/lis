'use strict';

/**
 * Uses MongooseJS to Connect to MongoDB
 * .Maps out all collections within
 */

var mongoose = require('mongoose');
var collections = mongoose.connections[0].collections;
var names = [];

exports.queryMasterData = (param)=>{
    return new Promise((resove, reject) => {
        Object.keys(collections).forEach(function(k) {
            names.push(k);
        })
        resove(names)
        names = [];
    })
}

exports.insertNewData = (testCaseName, payLoad)=>{
   // console.log(payLoad)
    const configmongoDB = require('mongoose').model(payLoad.tableName);
    let arr = JSON.parse("["+payLoad.queryString+"]");
    return new Promise((resove, reject) => {
        mongoose.connection.collection(payLoad.tableName).insertMany(arr)
        resove("Success")
    })
}  

exports.ConfigmongodbSer = (testCaseName , payLoad) => {
    const masterData = require('mongoose').model(payLoad.tableName);
    console.log(payLoad.queryString)
    return new Promise((resove, reject) => {
      let str = JSON.parse(payLoad.queryString);
    //  console.log(str)
      masterData.find( str , (err, queryResult) => {
        if(err) {
            reject(err)
        } else {
            console.log(queryResult)
            resove(JSON.stringify(queryResult))
        }
    })
  })
}
