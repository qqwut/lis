/* ------------- [START SERVER CONFIG VARIABLES] ------------ */
var config = {
  development: {
    app_host: "0.0.0.0",
    app_port: "3000",
    app_https: false,
    /********************************************** SWITCH SERVER MONGO ****************************************************/
    /* === replicate === */
    // db_ip_port:
    //   "mongodb.entronica:27017,fe1.entronica:27017,fe2.entronica:27017",
    // db_option: "replicaSet=rs_myoffice",

    /* ====== start : dev not replicate ====== */
    // db_ip_port: "202.129.207.27:27016",
    // db_user: "root",
    // db_pwd: "Entronic@",
    // db_ip_port:"25.44.186.155:27017",
    // db_user: "ccsmAdmin",
    // db_pwd:"Entronic@",
    /* ====== end : dev not replicate ====== */

    /* ====== start : iot ====== */
    /* === choose one (MASTER) === */
    // db_ip_port:"25.12.201.130:46128",
    // db_ip_port:"25.12.201.130:46130",
    // db_ip_port:"25.12.201.130:46136",
    /* === LAN === */
    // db_ip_port: "10.138.46.130:27017",
    db_ip_port: "10.138.46.128:27017,10.138.46.130:27017,10.138.46.136:27017",
    // db_user: "",
    // db_pwd:"",
    /* ====== end : iot ====== */
    /********************************************** SWITCH SERVER MONGO ****************************************************/

    db_name: "phxPartners-dev",
    db_reconnect: 3,
    query_debug: true,
    KEY: "key1.pem",
    CERT: "cert1.pem",
    service: {
      PANDORA: {
        URI : 'http://10.138.21.202:8080',   //JBOSS PG LAN
        // URI : 'http://25.12.201.130:20244',   //JBOSS PG IOT
        // URI : 'http://25.12.201.130:34618',   //JBOSS IOT
        // URI : 'http://10.138.34.61:8080',   //JBOSS IOT LAN
        // URI: 'http://25.12.201.130:34680',   //JBOSS DEV AIS
        // URI: "http://25.53.88.149:8080", //JBOSS DEV ENTRO
        URI_EQX: "http://25.12.201.130:15300", //EQUINOX
        // URI: "http://localhost:8080",
        KEY: "./PANDORA_CERT/server.key",
        CERT: "./PANDORA_CERT/server.pem",
        PREFIX: "/phxPartner/v1/partner"
      }
    },
    http_req_timeout: 12000,
    http_req_timeout_upload: 18000,
    session: 30 //minutes
  },
  iot: {
    node_secure: false,
    database: "mongodb://10.138.32.171:27017/phxPartners-dev",
    dbUser: "phxpartners",
    db_reconnect: 3,
    query_debug: false,
    pandora_key: "",
    pandora_cert: "",
    KEY: "key1.pem",
    CERT: "cert1.pem",
    prefix_phxpartner_be: "/api/v1/partner",
    sdf_prefix: "http://10.138.32.151:21300",
    proxy_target: "http://10.138.32.171:3000",
    proxy_root: "/entro/ccsm",
    proxy_rewrite: {
      "^/entro/ccsm": ""
    },
    web_port: 4200,
    app_port: 3000,
    http_req_timeout: 120000,
    http_req_timeout_upload: 18000,
    mockup_data: 1,
    session: 30 //minutes
  },
  vpn: {
    app_host: "0.0.0.0",
    app_port: "5001",
    app_https: false,
    db_ip_port:
      "mongdb.entronica:27017,fe1.entronica:27017,fe2.entronica:27017",
    db_option: "replicaSet=rs_myoffice",
    db_name: "phxPartners-dev",
    db_user: "phxpartners",
    db_query_debug: true,
    db_reconnect: 3,
    KEY: "key1.pem",
    CERT: "cert1.pem",
    service: {
      PANDORA: {
        URI: "http://25.12.201.130:21300",
        KEY: "",
        CERT: "",
        PREFIX: ""
      }
    },
    http_req_timeout: 120,
    http_req_timeout_upload: 180,
    session: 30 //minutes
  },
  production: {
    // database: 'mongodb://<user>:<pwd>@domain:port/database',
    node_secure: false,
    database:
      "mongodb://mongodb.pbssoffd901g.corp.ais900.org:27017/phxPartners-prod",
    dbUser: "phxpartners",
    query_debug: false,
    db_reconnect: 3,
    sdf_prefix: "http://10.198.40.37:18040",
    proxy_target: "http://10.198.112.199:8081",
    proxy_root: "/entro/ccsm",
    pandora_key: "",
    pandora_cert: "",
    KEY: "key1.pem",
    CERT: "cert1.pem",
    prefix_phxpartner_be: "/api/v1/partner",
    tmp_path: "/app/myofficepartners-backend/server/data/tmp",
    proxy_rewrite: {
      "^/entro/ccsm": ""
    },
    web_port: 8443,
    app_port: 8081,
    http_req_timeout: 120000,
    http_req_timeout_upload: 18000,
    session: 30 //minutes
  },
  production_ais: {
    database: "mongodb://10.138.32.171:27017/phxPartners-dev",
    dbUser: "phxpartners",
    db_reconnect: 3,
    query_debug: false,
    node_secure: false,
    // prefix_api: '/api'
    pandora_key: "",
    pandora_cert: "",
    KEY: "key1.pem",
    CERT: "cert1.pem",
    prefix_phxpartner_be: "/api/v1/partner",
    sdf_prefix: "http://10.138.32.153:21300",
    proxy_target: "http://10.138.32.171:5001",
    proxy_root: "/entro/ccsm",
    proxy_rewrite: {
      "^/entro/ccsm": ""
    },
    web_port: 5000,
    app_port: 5001,
    http_req_timeout: 120000,
    http_req_timeout_upload: 18000,
    session: 30 //minutes
  },
  hamahis: {
    app_host: "0.0.0.0",
    app_port: "3000",
    app_https: false,
    db_ip_port:
      "mongdb.entronica:27017,fe1.entronica:27017,fe2.entronica:27017",
    db_option: "replicaSet=rs_myoffice",
    db_name: "ppm-test2",
    db_user: "phxpartners",
    db_query_debug: true,
    db_reconnect: 3,
    KEY: "key1.pem",
    CERT: "cert1.pem",
    service: {
      PANDORA: {
        URI: "http://25.12.201.130:21300",
        KEY: "",
        CERT: "",
        PREFIX: ""
      }
    },
    http_req_timeout: 120,
    http_req_timeout_upload: 180,
    session: 30 //minutes
  },
  iot_ph2: {
    app_host: "0.0.0.0",
    app_port: "3000",
    app_https: false,
    db_ip_port:
      "mongdb.entronica:27017,fe1.entronica:27017,fe2.entronica:27017",
    db_option: "replicaSet=rs_myoffice",
    db_name: "phxPartners-dev",
    db_user: "phxpartners",
    db_reconnect: 3,
    query_debug: true,
    KEY: "key1.pem",
    CERT: "cert1.pem",
    service: {
      PANDORA: {
        URI: "http://25.12.201.130:13180", //JBOSS
        URI_EQX: "http://25.12.201.130:15300", //EQUINOX
        KEY: "",
        CERT: "",
        PREFIX: ""
      }
    },
    http_req_timeout: 120,
    http_req_timeout_upload: 180,
    session: 30 //minutes
  }
};
/* ------------- [END SERVER CONFIG VARIABLES] ------------ */

/* ------------- [START SERVER GET FUNTION] ------------ */
exports.get = function get(env) {
  var cfg = config[env] || config.development;
  cfg.app_host = process.env.APP_HOST || cfg.app_host;
  cfg.app_port = process.env.APP_PORT || cfg.app_port;
  cfg.app_https = process.env.USE_HTTPS || cfg.app_https;
  cfg.db_ip_port = process.env.DATABASE_IP_PORT || cfg.db_ip_port;
  cfg.db_option = process.env.DATABASE_OPTION || cfg.db_option;
  cfg.db_name = process.env.DATABASE_NAME || cfg.db_name;
  cfg.db_user = process.env.DATABASE_USER || cfg.db_user;
  cfg.db_pwd = process.env.DATABASE_PWD || cfg.db_pwd;
  cfg.db_reconnect = process.env.DATABASE_RECONNECT || cfg.db_reconnect;
  cfg.http_req_timeout = process.env.HTTP_REQ_TIMEOUT || cfg.http_req_timeout;
  cfg.http_req_timeout_upload = process.env.HTTP_REQ_TIMEOUT_UPLOAD || cfg.http_req_timeout_upload;
  cfg.pandora_key = process.env.PANDORA_KEY || cfg.pandora_key;
  cfg.pandora_cert = process.env.PANDORA_CERT || cfg.pandora_cert;
  cfg.KEY = process.env.KEY || cfg.KEY;
  cfg.CERT = process.env.CERT || cfg.CERT;
  cfg.tmp_path = process.env.TMP_PATH || cfg.tmp_path;
  var envService = null;
  try {
    if (process.env.SERVICE && process.env.SERVICE.length > 0) {
      envService = JSON.parse(process.env.SERVICE);
    }
  } catch (error) {
    envService = null;
  }
  cfg.service = envService != null ? envService : cfg.service;
  return cfg;
};

/* ------------- [END SERVER GET FUNTION] ------------ */