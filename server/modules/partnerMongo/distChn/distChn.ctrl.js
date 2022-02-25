var fs = require('fs');
const path = require('path');
var moment = require('moment');
var _ = require('lodash');
var distChn = require('../../../model/distChn.js');

exports.getdistChn = function (req, res) {
    console.log('get getdistChn list');
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };

    var filter = {};
    filter =  req.query
    distChn.find(filter, null, {
    },function (err, result) {
        if (err) {
            console.error(err);
            ret.responseCode = 500;
            ret.responseMessage = 'Fail';
            ret.responseDescription = err.message;
            res.json(ret);
            throw err;
        }
        console.log('get getdistChn :: ' + result.length);
        ret.data = result;
        res.json(ret);
    });
};

exports.getdistChnSap = function (req, res) {
    console.log('get getdistChn list');
    var ret = {
        responseCode: 200,
        responseMessage: 'Success'
    };

    var filter = {};
    filter =  req.query
    distChn.find(filter, null, {
    },function (err, result) {
        if (err) {
            console.error(err);
            ret.responseCode = 500;
            ret.responseMessage = 'Fail';
            ret.responseDescription = err.message;
            res.json(ret);
            throw err;
        }
        console.log('get getdistChn :: ' + result.length);
        ret.data = result;
        res.json(ret);
    });
};