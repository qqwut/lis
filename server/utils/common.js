var fs = require('fs');
var path = require('path');
const moment = require('moment');

const LOCATION_DT_FORMAT = 'YYYY-MM-DD HH:mm:ss';

exports.getSDFFilter2QueryStr = function (filterKeyMapping, _filter) {
    if (_filter == undefined || _filter == null) {
        return '';
    }
    var qs = '';
    for (var k in _filter) {
        var value = _filter[k] ? _filter[k] : '';
        var key = k;
        // console.log(value);
        // console.log(key);
        if (Array.isArray(value) && value.length > 0) {
            var subQuery = '';
            for (var i = 0; i < value.length; i++) {
                subQuery += '(' + key + '=' + encodeURIComponent(value[i]) + ')';
            }
            if (subQuery.length > 0)
                qs += '(|' + subQuery + ')';
            continue;
        }
        if (value.length > 0)
            qs += '(' + key + '=' + encodeURIComponent(value) + ')';
    }
    return (qs.length > 0) ? '(&' + qs + ')' : '';
};

exports.regexMongoStartWith = function (str) {
    return '^' + str.substring(0, str.length - 1);
}

exports.readFileDataJson = function (filePath) {
    // var option = opt || { encoding : 'utf8' , flag : 'r'} ;
    var obj = null;
    try {
        var data = fs.readFileSync(filePath, 'utf8');
        obj = JSON.parse(data);
    } catch (err) {
        console.error(err);
    }
    return obj;
};

exports.excelColName = function (n) {
    var ordA = 'a'.charCodeAt(0);
    var ordZ = 'z'.charCodeAt(0);
    var len = ordZ - ordA + 1;

    var s = "";
    while (n >= 0) {
        s = String.fromCharCode(n % len + ordA) + s;
        n = Math.floor(n / len) - 1;
    }
    return s.toUpperCase();
}

exports.dateFormatSDF = function (n) {
    if (!n) {
        return '';
    }
    var dt = moment(n, [LOCATION_DT_FORMAT, 'YYYY-MM-DD'], true);
    if (!dt.isValid) {
        return '';
    }
    return dt.format(LOCATION_DT_FORMAT);
}

exports.nullToStr = function (str) {
    if (!str) {
        return '';
    }
    return str.toString();
}

exports.nullObj = function (obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            var element = obj[key];
            if (element && element.toString().length > 0) {
                return false;
            }
        }
    }
    return true;
}

exports.nullStr = function (str) {
    if (str && str.trim().length > 0) {
        return false;
    }
    return true;
}

exports._padLeft =function (nr, n, str) {
    return Array(n - String(nr).length + 1).join(str || '0') + nr;
}