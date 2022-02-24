const path = require('path');

require('dotenv').config({
    path: path.join(__dirname, './env/.env'),
    sample: path.join(__dirname, './env/.env'),
});

const cfg = module.exports = {}

cfg.app_host = process.env.APP_HOST || "0.0.0.0";
cfg.app_port = process.env.APP_PORT || "3003";
cfg.app_https = process.env.USE_HTTPS || false;
cfg.db_connection_string = process.env.DATABASE_CONNECTION_STRING || process.env.LOCAL_DATABASE_CONNECTION_STRING;
cfg.http_req_timeout = process.env.HTTP_REQ_TIMEOUT || 12000;
cfg.http_req_timeout_upload = process.env.HTTP_REQ_TIMEOUT_UPLOAD || 18000;
cfg.tmp_path = process.env.TMP_PATH || "/app/myofficepartners-backend/server/data/tmp";
cfg.authS3 = process.env.AUTHS3 || "Y2NzbTpjY3NtcEBzc3cwcmQ=";
cfg.authIds = process.env.AUTHIDS || process.env.LOCAL_AUTHIDS;
cfg.service = {};
cfg.service.PANDORA = {};
cfg.service.PANDORA.URI = process.env.PANDORA_URI;
cfg.service.PANDORA.URI_IDS = process.env.PANDORA_URI_IDS;
cfg.service.PANDORA.URI_S3 = process.env.PANDORA_URI_S3;
cfg.service.PANDORA.PREFIX = process.env.PANDORA_URI_PREFIX;
cfg.SECRET = process.env.JWT_SECRET || process.env.LOCAL_SECRET;

/// config to remove 

cfg.KEY = process.env.KEY;   /// --> to remove self key
cfg.CERT = process.env.CERT; ///--> to remove self cer
cfg.service.PANDORA.CERT = process.env.CERT; /// --> to remove cer

/// configs that might be able to replace in the app 

cfg.load_system_web_upload_path = process.env.LOAD_SYSTEM_WEB_UPLOAD_PATH;
cfg.pic_example_path = process.env.PIC_EXAMPLE_PATH;

/// curious config 
cfg.LOG = ""  /// found in ccsm-apponline-backend/server/config/config.js
cfg.URL_MYCHANNEL_AUTH = process.env.URL_MYCHANNEL_AUTH || "http://25.20.247.44:18443/api/auth";  //found in ccsm-apponline-backend/server/modules/authen/authen.ctrl.js
cfg.URL_SALESPORTAL_MENUS = process.env.URL_SALESPORTAL_MENUS || "http://25.20.247.44:18888/api/menus";
cfg.prefix_api = "" /// found in multiple modules under route
cfg.buildNumber = process.env.BUILD_NUMBER