var log4js = require('log4js');
var mkdirp = require('mkdirp');
var fs = require('fs');
var path = require('path');
var logrotate = require('./log-rotator-util');
var moment = require('moment');
var logConfigPath = path.join(__dirname, '..', 'config', 'log4js_config.json');
var data = fs.readFileSync(logConfigPath, 'utf8');
var logConfig = JSON.parse(data);


var logDir = process.env.LOG_PATH || './logs';
var logRotateTime = process.env.LOG_ROTATE_TIME || '15';

// if (!fs.existsSync(logDir)){
//     fs.mkdirSync(logDir);
// }

for (var key in logConfig.appenders) {
    var logAppender = logConfig.appenders[key];
    if (logAppender.filename) {
        
        var pathFile = logDir+'/'+logAppender.filename;
        var dirLog = path.dirname(pathFile);
        if (!fs.existsSync(dirLog)){
            mkdirp(dirLog);
        }
        logAppender.filename = pathFile;
        logConfig.appenders[key] = logAppender;
    }
}
path.dirname(require.main.filename);

log4js.configure(logConfig);
var rotator = null;
if (rotator == null) {
    // "access": {
    //     "type": "file",
    rotator = logrotate.rotator;
    for (var key in logConfig.appenders) {
        if (logConfig.appenders[key].type == 'file') {
            var pathLogFile = logConfig.appenders[key].filename;
            rotator.register(pathLogFile, {
                schedule:logRotateTime+'m', 
                size: '0m',
                compress: false,
                count: 0,
                format: function (index) {
                    let format = moment().format("YYYYMMDD_HHmm");
                    return format;
                }
            });
        }
    }

    rotator.on('error', function (err) {
        // console.log('oops, an error occured!');
    });

    // // 'rotate' event is invoked whenever a registered file gets rotated 
    // rotator.on('rotate', function (file) {
    //     console.log('file ' + file + ' was rotated!');
    // });
}
var _logger = log4js.getLogger('phxpartners-app');
var _serviceLogger = log4js.getLogger('phxpartners-service');
var _accessLogger = log4js.getLogger('phxpartners-access');

var logger = module.exports = {};

logger.setHeader = function (fn) {
    logger['header'] = fn;
    // return this;
};

logger.debug = function (msg) {
    var header = logger.header || '';
    _logger.debug(header + '::' + msg);
};

logger.info = function (msg) {
    var header = logger.header || '';
    _logger.info(header + '::' + msg);
};

logger.trace = function (msg) {
    var header = logger.header || '';
    _logger.trace(header + '::' + msg);
};

logger.warn = function (msg) {
    var header = logger.header || '';
    _logger.warn(header + '::' + msg);
};

logger.error = function (msg, err) {
    var header = logger.header || '';
    if (err) {
        _logger.error(header + '::' + msg, err);
    } else {
        _logger.error(header + '::' + msg);
    }
};

logger.errorStack = function (err) {
    _logger.debug(err.stack || err);
    var header = logger.header || '';
    _logger.error(header + '::' + JSON.stringify(err.stack || err));

    // if (err) {
    //     _logger.error(header + '::' + msg, err);
    // } else {
    //     _logger.error(header + '::' + msg);
    // }
};

logger.log = function (msg) {
    var header = logger.header || '';
    _logger.log(header + '::' + msg);
};

logger.fatal = function (msg) {
    var header = logger.header || '';
    _logger.fatal(header + '::' + msg);
};

logger.stream = {
    write: function (message, encoding) {
        _accessLogger.info(message);
    }
};

logger.serviceLog = _serviceLogger;
// function(msg) {
//     // var header = logger.header || '';
//     _serviceLogger.info(msg);
// };

logger.logResponse = function (msg) {
    var header = logger.header || '';
    _accessLogger.debug(header + '::' + msg);
};