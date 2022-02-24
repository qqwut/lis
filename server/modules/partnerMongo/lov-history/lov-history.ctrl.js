var fs = require('fs');
const path = require('path');
var moment = require('moment');
var _ = require('lodash');
var filterByLocHistory = require('../../../model/filterByLocHistory.js');
var historyLocSortBy = require('../../../model/historyLocSortby.js');
var historyLocDisplay = require('../../../model/historyLocDisplay.js');
var historyLocFilterBy = require('../../../model/historyLocFilterby.js')

var logger = require('../../../utils/logger');

exports.getFilterByLocHistoryList = function (req, res) { 
    console.log('get Filter By Location History list');
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };

    var filter = {}; //{'lovType_data': 'SHOP_AREA'};

    filterByLocHistory.find(filter, null, {
            // sort: {
            //     createdDate: -1
            // }
        }).select(['-_id', 'code', 'name']).exec(function (err, result) {
            if (err) {
                console.error(err);
                ret.responseCode = 500;
                ret.responseMessage = 'Fail';
                ret.responseDescription = err.message;
                res.json(ret);
                throw err;
            }
            console.log('get Filter By Location History list size :: ' + result.length);
            ret.data = result;
            // ret.data = result.map(function(res){
            //     return res.toAliasedFieldsObject();
            // });
            res.json(ret);
        });
};

exports.gethistoryLocFilterByList = function (req, res) {
    console.log('get Filter By Location History list');
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };

    var filter = {}; //{'lovType_data': 'SHOP_AREA'};

    historyLocFilterBy.find(filter, null, {
            sort: {
                sortBy: 1
            }
        }).select(['-_id', 'code', 'name']).exec(function (err, result) {
            if (err) {
                console.error(err);
                ret.responseCode = 500;
                ret.responseMessage = 'Fail';
                ret.responseDescription = err.message;
                res.json(ret);
                throw err;
            }
            console.log('get Filter By Location History list size :: ' + result.length);
            ret.data = result;
            // ret.data = result.map(function(res){
            //     return res.toAliasedFieldsObject();
            // });
            res.json(ret);
        });
};

exports.getHistoryLocSortByList = function (req, res) {
    console.log('get History Location Sort By list');
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };

    var filter = {};//{'lovType_data': 'SHOP_AREA'};
    // var userGroup = req.query.usergroup;
    // var status = req.query.status;
    // filter.status = {
    //     $ne: "DELETED"
    // };
    // if (status) {
    //     filter.status.$eq = status.toUpperCase();
    // }

    historyLocSortBy
    .find(filter, null, {
        // sort: {
        //     createdDate: -1
        // }
    }).select(['-_id','code','name','field','orderBy']).exec( function (err, result) {
        if (err) {
            console.error(err);
            ret.responseCode = 500;
            ret.responseMessage = 'Fail';
            ret.responseDescription = err.message;
            res.json(ret);
            throw err;
        }
        console.log('get History Location Sort By  list size :: ' + result.length);
        ret.data = result;
        // ret.data = result.map(function(res){
        //     return res.toAliasedFieldsObject();
        // });
        res.json(ret);
    });
};

exports.getHistoryLocDisplay = function (req, res) {
    console.log('get History Loc for Display');
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };

    var filter = {};
    
    historyLocDisplay
    .find(filter, null, {
       
    }).select(['-_id','code','name','menuType','table' ,'column' , 'display' , 'fixShow']).exec( function (err, result) {
        if (err) {
            console.error(err);
            ret.responseCode = 500;
            ret.responseMessage = 'Fail';
            ret.responseDescription = err.message;
            res.json(ret);
            throw err;
        }
        console.log('get History Display  list size :: ' + result.length);
        ret.data = result;
        
        res.json(ret);
    });
};
