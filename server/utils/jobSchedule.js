const cron = require('node-cron');
const logger = require('./logger');
var fs = require('fs');

logger.info('START : Schedule');

var env = process.env.NODE_ENV || "development";
var cfg = require("../config/config");
var clientHttp = require("../connector/http-connector.js");

const PREFIX = cfg.service.PANDORA.PREFIX

// const schedule = require('../modules/partner/jobschedule/jobschedule.ctrl');

// สั่งให้มันทำงานทุกๆวัน เวลา 01.00
cron.schedule('00 01 * * *', function () { 

  logger.info('Schedual : ' + new Date);
    
  try {
        var uri = cfg.service.PANDORA.URI+PREFIX + '/jobschedule/omEmpMovementForCCSM.json';
        logger.info('METHOD PUT :: ' + uri);
        // logger.debug('request data :: ' + JSON.stringify(dataUpd));
        new clientHttp.put(uri, null, {
            service : 'phxpartners-be' ,
            callService: 'EMPLOYEE_MOVEMENT_FOR_CCSM',
            reqId: '1'
        }).then(function (response) {
            logger.info('response ::' + JSON.stringify(response));
        }).catch(function (err) {
            logger.error('error request :: '+err.message);
        });

    } catch (error) {
        logger.errorStack(error);
    }
});

// สั่งให้มันทำงานทุก 30 นาที
cron.schedule('*/30 * * * *', function () {

    logger.info('Schedual : ' + new Date);

    try{
        // var uri = cfg.service.PANDORA.URI+PREFIX + '/jobschedule/monitoring/AutoUsername.json?filter=(&(case=all))';
        // logger.info('AUTO_USERNAME :: ' + uri);
        // new clientHttp.get(uri, {
        //   service: 'phxpartners-be',
        //   callService: 'AUTO_USERNAME',
        //   reqId: '1'
        // }).then( function (response) {
        //   logger.info('response :: ' + JSON.stringify(response));
        // }).catch( function (err) {
        //   logger.error(err)
        // });
      } catch (error){
        logger.errorStack(error);
      }

});