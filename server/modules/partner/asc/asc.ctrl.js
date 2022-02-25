var fs = require("fs");
const path = require("path");
var moment = require("moment");
var _ = require("lodash");
var utils = require("../../../utils/common.js");
var env = process.env.NODE_ENV || "development";
var cfg = require("../../../config/config.js");
var clientHttp = require("../../../connector/http-connector.js");
var utils = require("../../../utils/common.js");
var logger = require("../../../utils/logger");

const PREFIX = cfg.service.PANDORA.PREFIX

exports.getAscList = function(req, res) {
  var filter = req.query;
  logger.info("API Search asc List");
  var ret = {
    responseCode: 200,
    responseMessage: "Success"
  };
  try {
    var filter = req.query;
    var queryStr = utils.getSDFFilter2QueryStr(null, filter);
    var uri = cfg.service.PANDORA.URI + PREFIX + "/asc/list.json?filter=" + queryStr;
    logger.info("get asc to uri :: " + uri);

    return clientHttp
      .get(uri)
      .then(function(response) {
        logger.info(
          "get asc resultCode  :: " +
            (response
              ? response.resultCode + ":" + response.resultDescription
              : "")
        );
        if (response.resultCode == "20000") {
          ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
          ret.responseMessage = "Success";
          ret.data = response.resultData.viewAscList;
          return res.json(ret);
        } else {
          ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
          ret.responseMessage = "Fail";
          ret.responseDescription = response.resultDescription;
          return res.json(ret);
        }
      })
      .catch(function(err) {
        logger.error("error request Search asc :: ", err);
        ret.responseCode = 500;
        ret.responseMessage = "Fail";
        ret.responseDescription = err.message;
        return res.json(ret);
      });
  } catch (error) {
    logger.errorStack(error);
    ret.responseCode = 500;
    ret.responseMessage = "Fail";
    ret.responseDescription = error.message;
    return res.json(ret);
  }
};

exports.getIdNumber = function(req, res) {
  logger.info("api getIdNumber");
  var filter = {};
  filter = req.query;
  var ret = {};
  try {
    var queryStr = utils.getSDFFilter2QueryStr(null, filter);
    var uri = cfg.service.PANDORA.URI+PREFIX + "/asc/IdNumber.json?filter=" + queryStr;
    logger.info("GET :: " + uri);
    return clientHttp
      .get(uri)
      .then(function(response) {
        logger.info("response :: " + JSON.stringify(response));
        if (parseInt(response.resultCode) != 20000) {
          ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
          ret.responseMessage = "Fail";
          ret.responsemoreInfo = response.moreInfo;
          ret.responseDescription = response.resultDescription;
          ret.data = response.resultData.profile;
          res.json(ret);
          return;
        }
        ret.responseCode = 200;
        ret.responseDescription = "Success";
        ret.data = response.resultData.profile;

        res.json(ret);
      })
      .catch(function(err) {
        logger.error(err);
        ret.responseCode = 500;
        ret.responseMessage = "Fail";
        ret.responseDescription = err.message;
        res.json(ret);
      });
  } catch (error) {
    ret.responseCode = 500;
    ret.responseMessage = "Fail";
    ret.responseDescription = error.message;
    res.json(ret);
  }
};

exports.getMobileNumber = function(req, res) {
  logger.info("api getIdNumber");
  var filter = {};
  filter = req.query;
  var ret = {};
  try {
    var queryStr = utils.getSDFFilter2QueryStr(null, filter);
    var uri = cfg.service.PANDORA.URI+PREFIX + "/asc/ascMobileNumber.json?filter=" + queryStr;
    logger.info("GET :: " + uri);
    return clientHttp
      .get(uri)
      .then(function(response) {
        logger.info("response :: " + JSON.stringify(response));
        if (parseInt(response.resultCode) != 20000) {
          ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
          ret.responseMessage = "Fail";
          ret.responsemoreInfo = response.moreInfo;
          ret.responseDescription = response.resultDescription;
          res.json(ret);
          return;
        }
        ret.responseCode = 200;
        ret.responseDescription = "Success";
        ret.data = response.resultData

        res.json(ret);
      })
      .catch(function(err) {
        logger.error(err);
        ret.responseCode = 500;
        ret.responseMessage = "Fail";
        ret.responseDescription = err.message;
        res.json(ret);
      });
  } catch (error) {
    ret.responseCode = 500;
    ret.responseMessage = "Fail";
    ret.responseDescription = error.message;
    res.json(ret);
  }
};

exports.getAccountNumber = function(req, res) {
  logger.info("api getIdNumber");
  var filter = {};
  filter = req.query;
  var ret = {};
  try {
    var queryStr = utils.getSDFFilter2QueryStr(null, filter);
    var uri = cfg.service.PANDORA.URI+PREFIX + "/asc/accountNumber.json?filter=" + queryStr;
    logger.info("GET :: " + uri);
    return clientHttp
      .get(uri)
      .then(function(response) {
        logger.info("response :: " + JSON.stringify(response));
        if (parseInt(response.resultCode) != 20000) {
          ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
          ret.responseMessage = "Fail";

          ret.responseDescription = response.resultDescription;
          res.json(ret);
          return;
        }
        ret.responseCode = 200;
        ret.responseDescription = "Success";

        res.json(ret);
      })
      .catch(function(err) {
        logger.error(err);
        ret.responseCode = 500;
        ret.responseMessage = "Fail";
        ret.responseDescription = err.message;
        res.json(ret);
      });
  } catch (error) {
    ret.responseCode = 500;
    ret.responseMessage = "Fail";
    ret.responseDescription = error.message;
    res.json(ret);
  }
};

exports.getAscPosition = function(req, res) {
  logger.info("api Positon");
  var filter = {};
  filter = req.query;
  var ret = {};
  try {
    var queryStr = utils.getSDFFilter2QueryStr(null, filter);
    var uri = cfg.service.PANDORA.URI+PREFIX + "/asc/position.json?filter=" + queryStr;
    logger.info("GET :: " + uri);
    return clientHttp
      .get(uri)
      .then(function(response) {
        logger.info("response :: " + JSON.stringify(response));
        if (parseInt(response.resultCode) != 20000) {
          ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
          ret.responseMessage = "Fail";

          ret.responseDescription = response.resultDescription;
          res.json(ret);
          return;
        }
        ret.responseCode = 200;
        ret.responseDescription = "Success";
        ret.data = response.resultData.position;

        res.json(ret);
      })
      .catch(function(err) {
        logger.error(err);
        ret.responseCode = 500;
        ret.responseMessage = "Fail";
        ret.responseDescription = err.message;
        res.json(ret);
      });
  } catch (error) {
    ret.responseCode = 500;
    ret.responseMessage = "Fail";
    ret.responseDescription = error.message;
    res.json(ret);
  }
};

exports.getMemberCategory = function(req, res) {
  logger.info("api MemberCategory");
  var filter = {};
  filter = req.query;
  var ret = {};
  try {
    var queryStr = utils.getSDFFilter2QueryStr(null, filter);
    /*queryStr = queryStr.replace("data=", "");
    queryStr = queryStr.slice(3);
    queryStr = queryStr.slice(0, -2);*/
    var uri = cfg.service.PANDORA.URI+PREFIX +"/asc/memberCategory.json?filter=" +queryStr;
    logger.info("GET :: " + uri);
    return clientHttp
      .get(uri)
      .then(function(response) {
        logger.info("response :: " + JSON.stringify(response));
        if (parseInt(response.resultCode) != 20000) {
          ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
          ret.responseMessage = "Fail";

          ret.responseDescription = response.resultDescription;
          res.json(ret);
          return;
        }
        ret.responseCode = 200;
        ret.responseDescription = "Success";
        ret.data = response.resultData.memberCat;

        res.json(ret);
      })
      .catch(function(err) {
        logger.error(err);
        ret.responseCode = 500;
        ret.responseMessage = "Fail";
        ret.responseDescription = err.message;
        res.json(ret);
      });
  } catch (error) {
    ret.responseCode = 500;
    ret.responseMessage = "Fail";
    ret.responseDescription = error.message;
    res.json(ret);
  }
};

exports.getAscPositionId = function(req, res) {
  logger.info("api PositionId");
  var filter = {};
  filter = req.query;
  var ret = {};
  try {
    var queryStr = utils.getSDFFilter2QueryStr(null, filter);
    var uri = cfg.service.PANDORA.URI+PREFIX + "/asc/ascPositionId.json?filter=" + queryStr;
    logger.info("GET :: " + uri);
    return clientHttp
      .get(uri)
      .then(function(response) {
        logger.info("response :: " + JSON.stringify(response));
        if (parseInt(response.resultCode) != 20000) {
          ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
          ret.responseMessage = "Fail";

          ret.responseDescription = response.resultDescription;
          res.json(ret);
          return;
        }
        ret.responseCode = 200;
        ret.responseDescription = "Success";
        ret.data = response.resultData.memberPositionId;

        res.json(ret);
      })
      .catch(function(err) {
        logger.error(err);
        ret.responseCode = 500;
        ret.responseMessage = "Fail";
        ret.responseDescription = err.message;
        res.json(ret);
      });
  } catch (error) {
    ret.responseCode = 500;
    ret.responseMessage = "Fail";
    ret.responseDescription = error.message;
    res.json(ret);
  }
};

exports.Ascpost = function(req, res) {
  logger.info("api post asc info ");
  var locationCode = req.query.locationId;
  var data = req.body;
  logger.debug("post ASC " + " :: " + JSON.stringify(data));
  var filter = {};
  filter = req.query;
  var ret = {};
  try {
    var queryStr = utils.getSDFFilter2QueryStr(null, filter);
    var uri = cfg.service.PANDORA.URI+PREFIX + "/asc/createASC.json";
    logger.info("post :: " + uri);
    return clientHttp
      .post(uri, data, {
        service: "phxpartners-be",
        callService: "EDIT_LOC_GENERAL",
        reqId: req.id
      })
      .then(function(response) {
        logger.info("response :: " + JSON.stringify(response));
        if (parseInt(response.resultCode) != 20000) {
          ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
          ret.responseMessage = "Fail";
          if (response.resultData != undefined && response.resultData.length > 0) {
            ret.data = response.resultData;
          }
          ret.responseDescription = response.resultDescription;
          ret.responseMoreInfo = response.moreInfo;
          res.json(ret);
          return;
        }
        ret.responseCode = 200;
        ret.responseDescription = "Success";
        ret.responseMessage = response.resultData.message;
        ret.data = response.resultData.ascCode;
        res.json(ret);
      })
      .catch(function(err) {
        logger.error(err);
        ret.responseCode = 500;
        ret.responseMessage = "Fail";
        ret.responseDescription = err.message;
        res.json(ret);
      });
  } catch (error) {
    logger.errorStack(error);
    ret.responseCode = 500;
    ret.responseMessage = "Fail";
    ret.responseDescription = error.message;
    res.json(ret);
  }
};

exports.getAscProfile = function(req, res) {
  logger.info("API GET ASC Profile");
  var ret = {
    responseCode: 200,
    responseMessage: "Success"
  };
  try {
    var filter = req.query;
    var queryStr = utils.getSDFFilter2QueryStr(null, filter);
    var uri = cfg.service.PANDORA.URI+PREFIX + "/asc/profile.json?filter=" + queryStr;
    logger.info("get asc profile to uri :: " + uri);

    return clientHttp
      .get(uri)
      .then(function(response) {
        logger.info(
          "get asc profile resultCode  :: " +
            (response
              ? response.resultCode + ":" + response.resultDescription
              : "")
        );
        if (response.resultCode == "20000") {
          ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
          ret.responseMessage = "Success";
          ret.data = response.resultData.ascProfile;
          return res.json(ret);
        } else {
          ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
          ret.responseMessage = "Fail";
          ret.responseDescription = response.resultDescription;
          return res.json(ret);
        }
      })
      .catch(function(err) {
        logger.error("error request GET ASC Profile List :: ", err);
        ret.responseCode = 500;
        ret.responseMessage = "Fail";
        ret.responseDescription = err.message;
        return res.json(ret);
      });
  } catch (error) {
    logger.errorStack(error);
    ret.responseCode = 500;
    ret.responseMessage = "Fail";
    ret.responseDescription = error.message;
    return res.json(ret);
  }
};

exports.searchLocation = function (req, res) {
        logger.info('api PositionId');
        var filter = {};
        filter = req.query;
        filter.groupCode = req.currentUser.userGroup;
        var ret = {};
        try {
            var queryStr = utils.getSDFFilter2QueryStr(null, filter);
            var uri = cfg.service.PANDORA.URI+PREFIX +'/asc/searchLocation.json?filter='+queryStr;
            logger.info('GET :: ' +uri);
            return clientHttp.get(uri).then(function (response) {
                logger.info('response :: '+JSON.stringify(response));
                if (parseInt(response.resultCode) != 20000) {
                    ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
                    ret.responseMessage = 'Fail';
    
                    ret.responseDescription = response.resultDescription;
                    res.json(ret);
                    return;
                }
                ret.responseCode = 200;
                ret.responseDescription = 'Success';
                ret.resultData = response.resultData.viewLocationList

                res.json(ret);
            }).catch(function (err) {
                logger.error(err)
                ret.responseCode = 500;
                ret.responseMessage = 'Fail';
                ret.responseDescription = err.message;
                res.json(ret);
            });
        } catch (error) {
            ret.responseCode = 500;
            ret.responseMessage = 'Fail';
            ret.responseDescription = error.message;
            res.json(ret);
        }
    };

exports.getInfoAsc = function(req, res) {
      logger.info("API GET ASC Info");
      var ret = {
        responseCode: 200,
        responseMessage: "Success"
      };
      // /phxPartner/v1/partner/asc/info.json?filter=(&(salePersonId=xxx)(personMappingId=xxx))
      try {
        var filter = req.query;
        var queryStr = utils.getSDFFilter2QueryStr(null, filter);
        var uri = cfg.service.PANDORA.URI+PREFIX + "/asc/info.json?filter=" + queryStr;
        logger.info("get asc info to uri :: " + uri);
        return clientHttp
          .get(uri)
          .then(function(response) {
            logger.info(
              "get asc info resultCode  :: " +
                (response
                  ? response.resultCode + ":" + response.resultDescription
                  : "")
            );
            if (response.resultCode == "20000") {
              ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
              ret.responseMessage = "Success";
              ret.data = response.resultData.ascInfo;
              return res.json(ret);
            } else {
              ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
              ret.responseMessage = "Fail";
              ret.responseDescription = response.resultDescription;
              return res.json(ret);
            }
          })
          .catch(function(err) {
            logger.error("error request GET ASC INFO List :: ", err);
            ret.responseCode = 500;
            ret.responseMessage = "Fail";
            ret.responseDescription = err.message;
            return res.json(ret);
          });
      } catch (error) {
        logger.errorStack(error);
        ret.responseCode = 500;
        ret.responseMessage = "Fail";
        ret.responseDescription = error.message;
        return res.json(ret);
      }
};

exports.getAscCompetency = function(req, res) {
  logger.info("API GET Asc Competency");
  var ret = {
    responseCode: 200,
    responseMessage: "Success"
  };
  try {
    var filter = req.query;
    var queryStr = utils.getSDFFilter2QueryStr(null, filter);
    var uri = cfg.service.PANDORA.URI+PREFIX + "/asc/competency.json?filter=" + queryStr;
    logger.info("get Asc Competency to uri :: " + uri);
    return clientHttp
      .get(uri)
      .then(function(response) {
        logger.info(
          "get Asc Competency resultCode  :: " +
            (response
              ? response.resultCode + ":" + response.resultDescription
              : "")
        );
        if (response.resultCode == "20000") {
          ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
          ret.responseMessage = "Success";
          if(response.resultData){
            ret.data = response.resultData.competency;
          }
          return res.json(ret);
        } else {
          ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
          ret.responseMessage = "Fail";
          ret.responseDescription = response.resultDescription;
          return res.json(ret);
        }
      })
      .catch(function(err) {
        logger.error("error request Asc Competency :: ", err);
        ret.responseCode = 500;
        ret.responseMessage = "Fail";
        ret.responseDescription = err.message;
        return res.json(ret);
      });
  } catch (error) {
    logger.errorStack(error);
    ret.responseCode = 500;
    ret.responseMessage = "Fail";
    ret.responseDescription = error.message;
    return res.json(ret);
  }
}
exports.updAscInfo = function (req, res) { 
  var filter = req.query; 
  var data = req.body; 
  var username = req.currentUser.username;
  var ret = {};

  // if( !(data && Array.isArray(data))   ){
  //     logger.info('Data is null ro Invalid format');
  //     ret.responseCode = 403
  //     ret.responseMessage = 'Fail';
  //     ret.responseDescription = 'Bad request';
  //     res.json(ret);
  //     return;
  // }
  
  if(data.data){
    data.data.modifiedBy = username;
    data.data.modifiedDate = moment(new Date()).format("DD/MM/YYYY hh:mm:ss");
    console.log("-------- : "+ data.data.modifiedBy );
    console.log("-------- : "+ data.data.modifiedDate );

  }
  var ret = {};
  // var dataUpd = { financial : data };
  var dataUpd = data;
  try {
      var queryStr = utils.getSDFFilter2QueryStr(null, filter);
      var uri = cfg.service.PANDORA.URI+PREFIX + '/asc/info.json?filter=' + queryStr;
      logger.info('METHOD PUT :: ' + uri);
      logger.debug('request data :: ' + JSON.stringify(dataUpd));
      return clientHttp.put(uri, dataUpd, {
          service : 'phxpartners-be' ,
          callService: 'EDIT_ASC', 
          reqId : req.id
      }).then(function (response) {
          logger.info('response ::' + JSON.stringify(response));
          if (parseInt(response.resultCode) != 20000) {
              ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
              ret.responseMessage = response.moreInfo;
              ret.responseDescription = response.resultDescription;
              res.json(ret);
              return;
          }
          ret.responseCode = 200;
          ret.responseMessage = response.moreInfo;
          ret.responseDescription = 'Success';
          ret.data = response.resultData
          res.json(ret);
      }).catch(function (err) {
          logger.error('error request :: '+err.message);
          ret.responseCode = 500;
          ret.responseMessage = 'Fail';
          ret.responseDescription = err.message;
          res.json(ret);
      });

  } catch (error) {
      logger.errorStack(error);
      ret.responseCode = 500;
      ret.responseMessage = 'Fail';
      ret.responseDescription = error.message;
      res.json(ret);
  }
}

exports.chkAscContactLocation = function (req, res) {
  logger.info('chkAscContactLocation'+ req.query);
  var filter = {};
  filter = req.query;
  var ret = {};
  try {
      var queryStr = utils.getSDFFilter2QueryStr(null, filter);
      var uri = cfg.service.PANDORA.URI+PREFIX + '/asc/chkContactLocation.json?filter=' + queryStr;
      logger.info('GET :: ' + uri);
      return clientHttp.get(uri, {
          service: 'phxpartners-be',
          callService: 'GET_ASC_CHECK_CONTACT_LOCATION',
          reqId: req.id
      }).then(function (response) {
          logger.info('response :: ' + JSON.stringify(response));
          if (parseInt(response.resultCode) != 20000) {
              ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
              ret.responseMessage = 'Fail';
              ret.responseDescription = response.resultDescription;
              res.json(ret);
              return;
          }
          ret.responseCode = 200;
          ret.responseDescription = 'Success';
          ret.resultData = response.resultData;
          res.json(ret);
      }).catch(function (err) {
          logger.error(err)
          ret.responseCode = 500;
          ret.responseMessage = 'Fail';
          ret.responseDescription = err.message;
          res.json(ret);
      });
  } catch (error) {
      ret.responseCode = 500;
      ret.responseMessage = 'Fail';
      ret.responseDescription = error.message;
      res.json(ret);
  }
};

exports.postAscContactOm = function(req, res) {
  logger.info("api post asc contact om");
  var data = req.body;
  logger.debug("Post ASC Contact Om " + " :: " + JSON.stringify(data));
  var filter = {};
  filter = req.query;
  var ret = {};
  try {
    var queryStr = utils.getSDFFilter2QueryStr(null, filter);
    var uri = cfg.service.PANDORA.URI+PREFIX + "/asc/contactOm.json";
    logger.info("post :: " + uri);
    return clientHttp
      .post(uri, data, {
        service: "phxpartners-be",
        callService: "POST_ASC_CONTACT_OM",
        reqId: req.id
      })
      .then(function(response) {
        logger.info("response :: " + JSON.stringify(response));
        if (parseInt(response.resultCode) != 20000) {
          ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
          ret.responseMessage = "Fail";
          if (response.resultData != undefined || response.resultData.length > 0) {
            ret.data = response.resultData;
          }
          ret.responseDescription = response.resultDescription;
          ret.responseMoreInfo = response.moreInfo;
          res.json(ret);
          return;
        }
        ret.responseCode = 200;
        ret.responseDescription = "Success";
        ret.resultData = response.resultData;
        res.json(ret);
      })
      .catch(function(err) {
        logger.error(err);
        ret.responseCode = 500;
        ret.responseMessage = "Fail";
        ret.responseDescription = err.message;
        res.json(ret);
      });
  } catch (error) {
    logger.errorStack(error);
    ret.responseCode = 500;
    ret.responseMessage = "Fail";
    ret.responseDescription = error.message;
    res.json(ret);
  }
};

exports.chkRequiredEmail = function (req, res){
  logger.info('Required Email')
  var filter = req.query;
  var ret = {};
  try{
    var queryStr = utils.getSDFFilter2QueryStr(null, filter);
    var uri = cfg.service.PANDORA.URI+PREFIX + '/asc/email/requiredFlg.json?filter=' + queryStr;
    logger.info('GET :: ' + uri);
    return clientHttp.get(uri, {
      service: 'phxpartners-be',
      callService: 'GET_ASC_CHECK_REQUIRED_EMAIL',
      reqId: req.id
    }).then( function (response) {
      logger.info('response :: ' + JSON.stringify(response));
      if (parseInt(response.resultCode) != 20000) {
        ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
        ret.responseMessage = 'Fail';
        ret.responseDescription = response.resultDescription;
        res.json(ret);
        return;
      }
      ret.responseCode = 200;
      ret.responseDescription = 'Success';
      ret.resultData = response.resultData;
      res.json(ret);
    }).catch( function (err) {
      logger.error(err)
      ret.responseCode = 500;
      ret.responseMessage = 'Fail';
      ret.responseDescription = err.message;
      res.json(ret);
    });
  } catch (error){
    ret.responseCode = 500;
    ret.responseMessage = 'Fail';
    ret.responseDescription = error.message;
    res.json(ret);
  }
};

exports.getLocationAffiliation = function (req, res) {
  var filter = req.query;
  var ret = {};
  try{
    var queryStr = utils.getSDFFilter2QueryStr(null, filter);
    var uri = cfg.service.PANDORA.URI+PREFIX + '/asc/locationAffiliation.json?filter=' + queryStr;
    logger.info('GET :: ' + uri);
    return clientHttp.get(uri, {
      service: 'phxpartners-be',
      callService: 'GET_ASC_LOCATION_AFFILIATION',
      reqId: req.id
    }).then( function (response) {
      logger.info('response :: ' + JSON.stringify(response));
      if (parseInt(response.resultCode) != 20000) {
        ret.responseCode = parseInt(parseInt(response.resultCode) / 100);
        ret.responseMessage = 'Fail';
        ret.responseDescription = response.resultDescription;
        res.json(ret);
        return;
      }
      ret.responseCode = 200;
      ret.responseDescription = 'Success';
      ret.resultData = response.resultData;
      res.json(ret);
    }).catch( function (err) {
      ret.responseCode = 500;
      ret.responseMessage = 'Fail';
      ret.responseDescription = err.message;
      res.json(ret);
    });
  } catch (error){
    ret.responseCode = 500;
    ret.responseMessage = 'Fail';
    ret.responseDescription = error.message;
    res.json(ret);
  }
};